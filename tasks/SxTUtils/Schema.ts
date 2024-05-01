import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { pipeline } from 'stream';
import { TaskArgs, Result, RenderSQLResult, Directories, SxTResult } from './types'; 
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import Utils from './utils/utils'; 

const SCHEMA_ACTIONS = {
  'create': 'CREATE SCHEMA',
  'drop': 'DROP SCHEMA'
};

class SchemaManager {
  constructor (){}

  async createDirectories (baseDir: string, directories: Directories): Promise<Result> {
    try {
      await Promise.all(directories.map(directory => 
        fs.promises.mkdir(path.join(baseDir, ...directory), { recursive: true })
      ));
      return { success: true, message: 'Directories created successfully.' };
    } catch (error) {
      return { success: false, message: `Error creating directories: ${(error as Error).message}` };
    }
  }

  async checkSchemaDir(schemaDir: string): Promise<void> {
    const checkResult = await Utils.checkSchemaDirExists(schemaDir);
    if (!checkResult.success) {
      throw checkResult;
    }
  }

  async generateSQL(operation: 'drop' | 'create', taskArgs: TaskArgs, schemaDir: string): Promise<RenderSQLResult> {
    try {
      await this.checkSchemaDir(schemaDir);
      let sql = await this.ddlSchema(operation, taskArgs.schema);
      return sql;
    } catch (error) {
      return { success: false, sql: null, message: `Error in ${operation} schema: ${(error as Error).message}` };
    }
  }

  async ddlSchema(action: 'create' | 'drop', schemaName: string): Promise<RenderSQLResult> {
    try {
      const ddl = `${SCHEMA_ACTIONS[action]} ${schemaName.toUpperCase()};`;
      return {
        success: true,
        sql: ddl,
        message: `Schema ${action} successful`
      };
    } catch (error) {
      return {
        success: false,
        sql: null,
        message: `Schema ${action} failed: ${(error as Error).message}`
      };
    }
  }

  async initSchema(taskArgs: TaskArgs): Promise<Result> {
      try {
        let schemaDir = Utils.getSchemaDir(taskArgs.schema);
        const checkResult = await Utils.checkSchemaDirExists(schemaDir);
        if (checkResult.success) {
          if (!taskArgs.force) {
            throw {
              success: false,
              message: `Proposed directory ${schemaDir} already exists\nUse --force to override the existing directory`,
            };
          } else {
            fs.rmdirSync(schemaDir, { recursive: true });
            console.log(`Existing schema directory ${schemaDir} replaced with init template`);
          }
        }
        
        const directories: Directories = [
          ['tables'],
          ['.secure', 'keys'],
          ['.secure', 'biscuits'],
          ['sql', 'schema', 'drop'],
          ['sql', 'schema', 'create'],
          ['sql', 'ddl', 'drop'],
          ['sql', 'ddl', 'create'],
          ['sql', 'dml', 'insert'],
          ['sql', 'dml', 'update'],
          ['sql', 'dml', 'delete'],
          ['sql', 'dql', 'preview'],
          ['sql', 'ud-custom'],
          ['sql', 'ud-routes']
        ];
        await this.createDirectories(schemaDir, directories);
        return {
          success: true,
          message: `Initialized schema directory ${schemaDir}`,
        };
      } catch (error) {
        throw {
          success: false,
          message: `Error during schema initialization:\n${(error as Error).message}`,
        };
      }
  }
    
  async backupSchema(taskArgs: TaskArgs): Promise<Result> {
    let schemaDir = Utils.getSchemaDir(taskArgs.schema);
    const schemaDirExistsResult = await Utils.checkSchemaDirExists(schemaDir);
    if (!schemaDirExistsResult.success) {
      throw schemaDirExistsResult;
    }
  
    const archiveFormat = 'tar'; // Set the archive format to 'tar'
  
    const output = fs.createWriteStream(path.join(process.cwd(), `${taskArgs.schema}.${archiveFormat}.gz`)); // Append '.gz' to the output file name
    const archive = archiver(archiveFormat, {
      gzip: true, // Enable gzip compression
      zlib: { level: 9 } // Sets the compression level.
    });
  
    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('Backup has been finalized and the output file descriptor has closed.');
    });
  
    archive.on('error', function(err: Error) {
      throw {
        success: false,
        message: `Error during archiving: ${err.message}`,
      };
    });
  
    archive.glob('**/*', {
      cwd: schemaDir,
      ignore: ['**/.*'] // ignores files and directories that start with a dot
    });
  
    let result: Result;
    try {
      result = await new Promise((resolve, reject) => {
        pipeline(archive, output, (err: Error | null) => {
          if (err) {
            reject({
              success: false,
              message: `Error during backup: ${err.message}`,
            });
          } else {
            resolve({
              success: true,
              message: 'Backup completed successfully.',
            });
          }
        });
      });
      archive.finalize();
    } catch (error) {
      throw error;
    }
  
    return result;
}

  async dropSchema(taskArgs: TaskArgs, schemaDir: string): Promise<RenderSQLResult> {  
      return this.generateSQL('drop', taskArgs, schemaDir);
  }
    
  async createSchema(taskArgs: TaskArgs, schemaDir: string): Promise<RenderSQLResult> {  
      return this.generateSQL('create', taskArgs, schemaDir);
  } 

  async manageSchemaDDL(hre: HardhatRuntimeEnvironment, taskArgs: TaskArgs, action: 'create' | 'drop'): Promise<SxTResult> {
    console.log(`DDL Manager (schema=${taskArgs.schema.toUpperCase()}, table=${ taskArgs.table}, action=${action})`);
    let sql: RenderSQLResult;
    if (action === 'create') {
      sql = await this.createSchema(taskArgs, Utils.getSchemaDir(taskArgs.schema));
    } else if (action === 'drop') {
      sql = await this.dropSchema(taskArgs, Utils.getSchemaDir(taskArgs.schema));
    } else {
      throw new Error(`Invalid action: ${action}`);
    }
    let result: SxTResult;
    if (sql.success) {
      if (sql.sql) {
        console.log('----------------------------------------')
        console.log(sql.sql)
        let [ddlSuccess, ddlError] = await hre.sxtSDK.DDL(sql.sql, [], "");
        if (ddlError) {
          console.log(ddlError, "\n Possible duplicate schema")
          result = { 
            success: false,
            message: `----------------------------------------\nDDL Failed --> ${ddlError?.response?.data.title}\n\t${ddlError?.response?.data.detail}`, 
            sql: sql.sql, 
            records: null 
          };
        } else if (ddlSuccess?.data === '') {
          result = { 
            success: false, 
            message: 'Schema creation failed. createTableSuccess returned an empty string', 
            sql: sql.sql, 
            records: null 
          };
        } else {
          result = { 
            success: true, 
            message: '----------------------------------------\nDDL Success', 
            sql: sql.sql, 
            records: null 
          };
        }
      } else {
        result = { 
          success: false, 
          message: 'Table creation failed. SQL statement, public key, or biscuit is missing', 
          sql: sql.sql || 'No SQL generated', 
          records: null 
        };
      }
    } else {
      console.error(`Could not generate SQL statement: ${sql.message}`);
      result = { success: false, message: `Table creation failed: ${sql.message}`, sql: sql.sql || 'No SQL generated', records: null };
    }
    return result;
  }

  async listBusinessObjects(): Promise<string[]> {
    try {
      const ejsFiles = fs.readdirSync(Utils.createPath('business-objects'));
      const businessObjects = ejsFiles.map(file => file.replace('.ejs', ''));
      return businessObjects;
    } catch (error) {
      console.log(Utils.handleTableErrors(error))
      return []
    }
  }
}

export default SchemaManager;