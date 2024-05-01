import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { Security, TaskArgs, Result, RenderSQLResult, Table, Records, TableMapping, ColumnMapping, DMLActions, DDLActions, TablesResult, Biscuits } from './types'; 
import Utils from './utils/utils'; 
import extract from 'extract-zip';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import { ED25519Wallet } from '@instruxi-io/sxt-typescript-sdk';
import ejs from 'ejs'
import { Parser } from '@dbml/core';

// see https://github.com/instruxi-io/sxt-utils/blob/master/packages/SxT-Typescript-SDK/src/ED25519Wallet.ts
// will export from types next version
export interface KeyPairEncodings {
  ED25519PublicKeyUint: Uint8Array;
  ED25519PrivateKeyUint: Uint8Array;
  b64PublicKey: string;
  b64PrivateKey: string;
  hexEncodedPublicKey: string;
  hexEncodedPrivateKey: string;
}


class TablesManager {
    tables: Table[];
    schema: string;
    businessObject: string | null;
    force: boolean;
    query: string;
    outfile: string

    constructor (taskArgs: TaskArgs){
      this.businessObject = taskArgs.businessobject || ""
      this.tables = [];
      this.schema = taskArgs.schema.toUpperCase();
      this.force = taskArgs.force || false;
      this.query = taskArgs.query || "";
      this.outfile = taskArgs.outfile || "";
    }

    // Init creates a new TablesManager instance and loads an instance of Table for each table in the --businessobject or listed in the task argument --table
    async init(taskArgs: TaskArgs) {
      if (taskArgs.businessobject) {
        this.businessObject = taskArgs.businessobject;
        let _tables: TablesResult = await this.listTableDefinitionsFromBusinessObject(this.businessObject, taskArgs.accesstype);
        if (_tables.success) {
          this.tables = _tables.tables;
        }
      } else if (taskArgs.table) {
        if (typeof taskArgs.table === 'string') {
          let _tables: string[] = taskArgs.table.split(',');
          _tables = _tables.map(table => table.toUpperCase());
          for (const table of _tables) {
            let _table: TablesResult = await this.getTableDefinitionByTable(table, taskArgs.accesstype);
            this.tables.push(_table.tables[0]);
          }
        } else {
          throw new Error("taskArgs.table must be a string");
        }
      } else {
          throw new Error("Failed to initialize TablesManager: either a table reference or a business object is required.");
      }
    }

    //********************************* Stage Table Security ********************************* //
    // returns a list of table definitions in a given business object. Used by getTableDefinitions
    async listTableDefinitionsFromBusinessObject(businessObject: string, accessType: string = 'permissioned'): Promise<TablesResult> {
      try {
        const ejsFilePath = Utils.createPath('business-objects', `${businessObject}.ejs`);
        const ejsFile = fs.readFileSync(ejsFilePath, 'utf8');
        const rendered = ejs.render(ejsFile, { schema: this.schema.toUpperCase() });
      
        const parser = new Parser();
        const database = parser.parse(rendered, 'dbml');
        let _tables: Table[] = [];
        for (const table of database.schemas[0].tables) {
          const parsedSchema = table.schema.name
          const tableName = table.name
          const resourceId = parsedSchema + '.' + tableName;
          const fields = table.fields || []
          const indexes = table.indexes || []
          if (parsedSchema === this.schema) {
            const columns = fields.map(field => ({
              columnName: field.name,
              columnType: field.type.type_name,
              columnAttributes: field.pk ? ['pk'] : [] 
            }));
            
            const primaryKeys = [
              ...fields.filter(field => field.pk).map(field => field.name),
              ...indexes.filter(index => index.pk).flatMap(index => index.columns.map(column => column.value))
            ];
            const _indexes = table.indexes
              .filter(index => !index.pk) 
              .map(index => ({
                name: index.name,
                columns: index.columns.flatMap(column => column.value)
            }));
            let tableData: Table = {
              schema: parsedSchema,
              tableName: tableName,
              resourceId: resourceId,
              accessType: accessType,
              columns: columns,
              primaryKeys: primaryKeys,
              indexes: _indexes,
            };
            let biscuits: Biscuits | null = await this.getTableBiscuits(tableData);
            tableData.biscuits = biscuits;
            let security: Security | null = await this.getTableSecurity(tableData);
            tableData.security = security;
            _tables.push(tableData);
          } else {
            throw new Error(`Schema ${parsedSchema} does not match the schema ${this.schema}`);
          }
        }
        return { success: true, message: `Processed all tables in ${this.schema.toUpperCase()} - ${businessObject.toUpperCase()}`, tables: _tables};
      }
      catch(error) {
        return Utils.handleTableErrors(error);
      }
    }

    // if we do not have a business object, we can get the table definition by table name by iterating through all business objects and finding the proposed table
    async getTableDefinitionByTable(table: string, accessType: string = 'permissioned'): Promise<TablesResult> {
      try {
        let tableObject: Table[] = [];
        let businessObjects: string[] = await this.listBusinessObjects();
        if (businessObjects.length > 0) {
          for (const businessObject of businessObjects) {
            let tables = await this.listTableDefinitionsFromBusinessObject(businessObject, accessType);
            if (tables.tables) {
              let foundTable = tables.tables.find(t => t.tableName === table.toUpperCase());
              if (foundTable) {
                tableObject.push(foundTable);
                if (!foundTable.biscuits || !foundTable.security) {
                  let missing = [];
                  if (!foundTable.biscuits) {
                    missing.push('biscuits');
                  }
                  if (!foundTable.security) {
                    missing.push('security');
                  }
                  console.log(`Warning: No ${missing.join(' or ')} found for table ${foundTable.tableName} in schema ${foundTable.schema}`);
                }
              }  
            }
          }
        } else {
          return { success: false, message: `No business objects were found in ${this.schema}`, tables: tableObject};
        }
        return { success: true, message: `Processed ${this.schema.toUpperCase()} - ${table.toUpperCase()}`, tables: tableObject};
      } catch (error) {
        return Utils.handleTableErrors(error);
      }
    }

    // returns a list of business objects in a given schema
    async listBusinessObjects(): Promise<string[]> {
      try {
        const ejsFiles = fs.readdirSync(Utils.createPath('business-objects'));
        const businessObjects = ejsFiles.map(file => file.replace('.ejs', ''));
        return businessObjects;
      } catch (error: unknown) {
        console.log(Utils.handleTableErrors(error))
        return []
      }
    }

    async getTableBiscuit(table: Table, accessLevel: 'dml' | 'ddl' | 'dql' | 'wildcard' | 'admin'): Promise<string | null> { 
      try {
          const schemaPath = path.resolve('schemas', table.schema.toLowerCase());
          const securityFilePath = path.resolve(schemaPath, '.secure', 'biscuits', `${table.tableName}.json`);
          if (fs.existsSync(securityFilePath)) {
              const fileContent = fs.readFileSync(securityFilePath, 'utf8');
              const biscuitData: Biscuits = JSON.parse(fileContent);
              return biscuitData[accessLevel] || null;
          }
      } catch (error) {
          console.error(`Failed to parse JSON file into Biscuit object: ${(error as Error).message}`);
      }
      console.log(`Warning: No ${accessLevel} biscuit found for table ${table.tableName} in schema ${table.schema}`);
      return null;
    }

    async getTableBiscuits(table: Table): Promise<Biscuits | null> { 
      try {
        const schemaPath = path.resolve('schemas', table.schema.toLowerCase());
        const securityFilePath = path.resolve(schemaPath, '.secure', 'biscuits', `${table.tableName}.json`);
        if (fs.existsSync(securityFilePath)) {
          const fileContent = fs.readFileSync(securityFilePath, 'utf8');
          const biscuitData: Biscuits = JSON.parse(fileContent);
          return biscuitData;
        }
      } catch (error) {
        console.error(`Failed to parse JSON file into Biscuit object: ${(error as Error).message}`);
      }
      return null;
    }

    async getTableSecurity(table: Table): Promise<Security | null> {
      try {
          const schemaPath = path.resolve('schemas', this.schema.toLowerCase());
          const securityFilePath = path.resolve(schemaPath, '.secure', 'keys', `${table.tableName}.json`);
          if (fs.existsSync(securityFilePath)) {
              const fileContent = fs.readFileSync(securityFilePath, 'utf8');
              const securityData: Security = JSON.parse(fileContent);
              return securityData;
          }
      } catch (error) {
          console.error(`Failed to parse JSON file into Security object: ${(error as Error).message}`);
      }
      return null;
    }

    getTables(): Table[] {
      return this.tables;
    }
  
    getTableByName(tableName: string): Table | undefined {
      return this.tables.find(table => table.tableName === tableName);
    }

    async saveTableSecurity(force: boolean = false): Promise<Result> {
      try {
        for (let table of this.tables) {
          const securityFilePath = Utils.createPath('schemas', this.schema.toLowerCase(), '.secure', 'keys', `${table.tableName}.json`);
          console.log(`Security file path: ${securityFilePath}`);
          const tableKeys = new ED25519Wallet();
          const keyData: KeyPairEncodings = tableKeys.generateKeyPairEncodings();
          console.log(`Public Key: ${keyData.hexEncodedPublicKey}`);
          Utils.writeFile(securityFilePath, JSON.stringify(keyData, null, 2), force);
        }
        return {
          success: true,
          message: `Public and private keys saved for all tables in schema ${this.schema}`
        };
      } catch (error) {
        return Utils.handleError(error);
      }
    }
    
    async backupTableSecurity(zipEnding: string = 'zip', destination: string = 'local', force: boolean = false): Promise<Result> {
      try {
        if (destination !== 'local') {
          return { success: false, message: 'Only local backup destination is supported as of now.' };
        }
        const schemaPath = Utils.createPath('schemas', this.schema.toLowerCase());
        const securityPath = Utils.createPath(schemaPath, '.security');
        const outputFilePath = Utils.createPath(securityPath, `${this.schema.toLowerCase()}.security.${zipEnding.toLowerCase()}`);
    
        const output = fs.createWriteStream(outputFilePath);
        const archive = archiver(zipEnding === 'zip' ? 'zip' : 'tar', {
            gzip: true,
            gzipOptions: {
            level: 1
            }
        });
    
        output.on('close', () => ({ success: true, message: 'Backup was successful.' }));
        output.on('error', (err) => ({ success: false, message: `Backup failed: ${err.message}` }));
    
        archive.pipe(output);
        archive.directory(securityPath, false);
        archive.finalize();
        return { success: true, message: 'Backup security success' };
      } catch (error) {
        return Utils.handleError(error);
      }
    }
    
    async restoreTableSecurity(source: string, force: boolean = false): Promise<Result> {
      try {
        const schemaPath = Utils.createPath('schemas', this.schema.toLowerCase());
        const securityPath = Utils.createPath(schemaPath, '.security');
        if (fs.existsSync(securityPath)) {
            if (force) {
            rimraf.sync(securityPath);
            } else {
            throw new Error(`The security directory for schema ${this.schema} already exists.\nUse force = true to overwrite it.`);
            }
        }
        mkdirp.sync(securityPath);
        await extract(source, { dir: securityPath });
        return { success: true, message: 'restore security success' };
      } catch (error) {
        return Utils.handleError(error);
      }
    }

    async saveTableDefinitions(force: boolean = false): Promise<Result> {  
      try {
        for (const table of this.tables) {
            const outputFilePath = Utils.createPath('schemas', this.schema.toLowerCase(), 'tables', `${table.tableName}.json`);
            Utils.writeFile(outputFilePath, JSON.stringify(table, null, 2), force)
        }
        return { success: true, message: `Processed ${this.schema}`};
      } catch (error) {
          return Utils.handleError(error);
      }
    }

    //**************************** Persist SQL *****************************/
    async dqlPreviewFromTable (table: Table, limit: number = 10): Promise<RenderSQLResult> {
      try {
        const columnNames = table.columns.map(column => column.columnName).join(',\n \t');
        const sql = `SELECT \n\t${columnNames}\nFROM ${table.resourceId}\nLIMIT ${limit};`;
        return { success: true, message: 'DQL success', sql };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message, sql: null};
      }
    }
  
    async sqlQueryFromFile(schema: string, queryName: string): Promise<RenderSQLResult> {
      try {
        const filePath = path.join('schemas', schema.toLowerCase(), 'sql', 'ud-custom', `${queryName}.sql`);
        const sql = fs.readFileSync(filePath, 'utf8');
    
        return { success: true, message: 'DQL success', sql };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message, sql: null};
        }
    }
    
    async dmlFromTable(table: Table, operation: 'insert' | 'delete' | 'update'): Promise<RenderSQLResult> {
      try {
          let data: Records | null = null;
          data = await Utils.getRecordsFromDataLocation(table.tableName, operation);
          let dml: string | null = null;
            switch (operation) {
              case 'insert':
                const fields = Object.keys(data[0]); // assuming all records have the same structure
                dml = `INSERT INTO ${table.resourceId} (${fields.join(', ')}) VALUES `;
                dml += data.map(record => {
                    const values = fields.map(field => {
                        if (field === 'deployed_at') {
                            return 'CURRENT_TIMESTAMP';
                        } else if (record[field] === null) {
                            return 'NULL';
                        } else if (typeof record[field] === 'string') {
                            return `'${record[field]}'`;
                        } else {
                            return record[field];
                        }
                    }).join(', ');
                    return `(${values})`;
                }).join(', ');
                dml += ';';
                break;
              case 'delete':
                  if (data.length === 0) {
                      console.log('No records provided. Deleting all records from the table');
                      dml = `DELETE FROM ${table.resourceId};`;
                  } else {  
                      for (const record of data) {
                          const conditions = Object.entries(record).map(([key, value]) => `${key} = '${value}'`).join(' AND ');
                          dml = `DELETE FROM ${table.resourceId} WHERE ${conditions};`;
                      }  
                  }
                  break;
              case 'update':
                  for (const record of data) {
                      const setClauses = Object.entries(record).map(([key, value]) => `${key} = '${value}'`).join(', ');
                      dml = `UPDATE ${table.resourceId} SET ${setClauses};`;
                  }
                  break;
          }
          return { success: true, message: 'DML success', sql: dml };
      } catch (error) {
          const message = error instanceof Error ? error.message : 'An unknown error occurred';
          return { success: false, message, sql: null };
      }
    }

    async streamTemplateFromTable(table: Table): Promise<TableMapping | null> {
      try {
        const columnMapping: ColumnMapping[] = table.columns.map(column => ({
          originKey: column.columnName,
          dataType: column.columnType,
          // destColumn is optional, add it if needed
        }));
    
        const tableMapping: TableMapping = {
          originPath: table.schema, // assuming schema is the originPath
          targetTable: table.tableName,
          isArray: false, // set this based on your requirements
          columnMapping,
        };
    
        return tableMapping;
      } catch (error) {
        console.error(`Error creating table mapping: ${error}`);
        return null;
      }
    }

    async ddlFromTable(action: DDLActions, table: Table): Promise<RenderSQLResult> {
      try {
        let ddl = '';
        if (action === 'create') {
            ddl = `CREATE TABLE ${table.resourceId} (\n`;
            const columnDefinitions = table.columns.map(column => `  ${column.columnName} ${column.columnType}`);
            ddl += columnDefinitions.join(',\n');
            if (table.primaryKeys && table.primaryKeys.length > 0) {
                ddl += `,\n  PRIMARY KEY(${table.primaryKeys.join(', ')})`;
            }
            ddl += '\n)\n';
        } else if (action === 'drop') {
            ddl = `DROP TABLE IF EXISTS ${table.resourceId}`;
        }
        return { success: true, message: 'DDL success' , sql: ddl };
      } catch (error) {
          const message = error instanceof Error ? error.message : 'An unknown error occurred';
          return { success: false, message, sql: null };
      }
    }
    
    async ddlIndexFromTable(action: 'create' | 'drop', table: Table): Promise<RenderSQLResult[]> {
        try {
        const results: RenderSQLResult[] = [];
        for (const column of table.columns) {
            let ddl = '';
            if (column.columnAttributes.includes('indexed')) {
            if (action === 'create') {
                ddl = `CREATE INDEX idx_${table.tableName}_${column.columnName} ON ${table.tableName} (${column.columnName});\n`;
            } else if (action === 'drop') {
                ddl = `DROP INDEX idx_${table.tableName}_${column.columnName} ON ${table.tableName};\n`;
            }
            results.push({ success: true, message: 'Rendered SQL successfully', sql: ddl });
            } else {
            results.push({ success: false, message: 'Failed to render SQL', sql: null });
            }
        }
        return results;
        } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return [{ success: false, sql: null, message }];
        }
    }

    // Persist the SQL generated from the DDL, DML, and DQL operations
    async saveSQLTemplates(templateType: 'ddl' | 'dql' | 'dml', force: boolean = false): Promise<Result> {
      try {
        let generatedCount = 0;

        for (const table of this.tables) {
          let contents;
          let outputDir;
          let files: { path: string; content: string }[] = [];

          switch (templateType) {
            case 'dml':
              const operations: DMLActions[] = ['insert', 'delete', 'update'];
              for (const operation of operations) {
                outputDir = Utils.createPath('schemas', table.schema.toLowerCase(), 'sql', templateType.toLowerCase(), operation);
                const records = await Utils.getRecordsFromDataLocation(table.tableName, operation);
                contents = await this.dmlFromTable(table, operation);
                if (contents && typeof contents === 'object' && 'sql' in contents && contents.sql && contents.sql.trim() !== '') {
                  files.push({ path: Utils.createPath(outputDir, `${table.resourceId}.sql`), content: contents.sql });
                }
              }
              break;
            case 'dql':
              outputDir = Utils.createPath('schemas', table.schema.toLowerCase(), 'sql', templateType.toLowerCase(), 'preview');
              contents = await this.dqlPreviewFromTable(table);
              if (contents && typeof contents === 'object' && 'sql' in contents && contents.sql && contents.sql.trim() !== '') {
                files.push({ path: Utils.createPath(outputDir, `${table.resourceId}.sql`), content: contents.sql });
              }
              break;
            case 'ddl':
              const ddlOperations: DDLActions[] = ['create', 'drop', 'index'];
              for (const ddlOperation of ddlOperations) {
                outputDir = Utils.createPath('schemas', table.schema.toLowerCase(), 'sql', templateType.toLowerCase(), ddlOperation);
                contents = await this.ddlFromTable(ddlOperation, table);
                if (contents && typeof contents === 'object' && 'sql' in contents && contents.sql && contents.sql.trim() !== '') {
                  files.push({ path: Utils.createPath(outputDir, `${table.resourceId}.sql`), content: contents.sql });
                }
              }
              break;
            default:
              console.error(`Invalid templateType: ${templateType}`);
              continue;
          }

          for (const file of files) {
            fs.mkdirSync(path.dirname(file.path), { recursive: true });
            Utils.writeFile(file.path, file.content || '', force);
            generatedCount++;
          }
        }

        const message = `${templateType.toUpperCase()} templates generated successfully for ${generatedCount} tables`;
        return { success: true, message };
      } catch (error) {
        console.error(Utils.handleError(error as Error));
        return { success: false, message: (error as Error).message };
      }
    }
}

export default TablesManager;