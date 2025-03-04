import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { KeyPairEncodings, Security, TaskArgs, Result, RenderSQLResult, Table, Records, TableMapping, ColumnMapping, DMLActions, DDLActions, TablesResult, Biscuits, EncryptColumnOptions, EncryptColumnTypes, View } from './types'; 
import Utils from './utils/utils'; 
import extract from 'extract-zip';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import { ED25519Signer } from '@instruxi-io/sxt-typescript-sdk';
import ejs from 'ejs';
import { Parser } from '@dbml/core';
import NodeCache from 'node-cache';

class TablesManagerError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'TablesManagerError';
  }
}

class TablesManager {
  private loadedTables: Map<string, Table | View>;
  private cache: NodeCache;
 
  schema: string;
  businessObject: string | null;
  force: boolean;
  query: string;
  outfile: string;

  constructor(taskArgs: TaskArgs) {
    this.businessObject = taskArgs.businessobject || "";
    this.loadedTables = new Map();
    this.schema = taskArgs.schema.toUpperCase();
    this.force = taskArgs.force || false;
    this.query = taskArgs.query || "";
    this.outfile = taskArgs.outfile || "";
    this.cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache for 10 minutes
  }

  private log(message: string, level: 'info' | 'error' | 'warn' = 'info'): void {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  }

  async init(taskArgs: TaskArgs): Promise<void> {
    try {
        if (taskArgs.viewname) {
            const viewName = taskArgs.viewname.toUpperCase();
            this.log(`Initializing for view: ${viewName}`, 'info');
            const view = await this.createViewObject(taskArgs.schema.toUpperCase(), viewName);
            this.loadedTables.set(view.viewName, view);
        }

        if (taskArgs.businessobject) {
            this.businessObject = taskArgs.businessobject;
            let _tables: TablesResult = await this.listTableDefinitionsFromBusinessObject(this.businessObject, taskArgs.accesstype);
            if (_tables.success) {
                for (const table of _tables.tables) {
                    this.loadedTables.set(table.tableName, table);
                }
            }
        } else if (taskArgs.table) {
            if (typeof taskArgs.table === 'string') {
                let _tables: string[] = taskArgs.table.split(',').map(table => table.toUpperCase());
                for (const table of _tables) {
                    if (taskArgs.viewname && table === taskArgs.viewname.toUpperCase()) {
                        continue;
                    }
                    let _table: TablesResult = await this.getTableDefinitionByTable(table, taskArgs.accesstype);
                    if (_table.success && _table.tables.length > 0) {
                        this.loadedTables.set(_table.tables[0].tableName, _table.tables[0]);
                    }
                }
            } else {
                throw new TablesManagerError("taskArgs.table must be a string");
            }
        } else if (!taskArgs.viewname) {
            throw new TablesManagerError("Failed to initialize TablesManager: either a table reference, a business object, or a view name is required.");
        }

        for (const [name, tableOrView] of this.loadedTables) {
            if (this.isTable(tableOrView)) {
                await this.loadBiscuitsForTable(tableOrView);
            }
        }
    } catch (error) {
        this.log('Error in init:', 'error');
        throw error;
    }
  }

  private async createViewObject(schema: string, viewName: string): Promise<View> {
      const securityFilePath = path.join('schemas', schema.toLowerCase(), '.secure', 'keys', `${viewName.toUpperCase()}.json`);
      const security = JSON.parse(await fs.promises.readFile(securityFilePath, 'utf8'));

      const view: View = {
          schema,
          viewName: viewName.toUpperCase(),
          resourceIds: [], // This will be populated with the resource IDs of the tables used in the view
          security: {
              hexEncodedPublicKey: security.hexEncodedPublicKey,
              hexEncodedPrivateKey: security.hexEncodedPrivateKey
          }
      };

      // Load biscuits for the view
      const biscuitFilePath = path.join('schemas', schema.toLowerCase(), '.secure', 'biscuits', `${viewName.toUpperCase()}.json`);
      if (await fs.promises.access(biscuitFilePath).then(() => true).catch(() => false)) {
          const biscuits = JSON.parse(await fs.promises.readFile(biscuitFilePath, 'utf8'));
          view.biscuits = {
              ddl: biscuits.ddl,
              dql: biscuits.dql
          };
      }

      return view;
  }

  private async loadBiscuitsForTable(table: Table): Promise<void> {
      const biscuitFilePath = path.join('schemas', table.schema.toLowerCase(), '.secure', 'biscuits', `${table.tableName}.json`);
      if (await fs.promises.access(biscuitFilePath).then(() => true).catch(() => false)) {
          const biscuits = JSON.parse(await fs.promises.readFile(biscuitFilePath, 'utf8'));
          table.biscuits = biscuits;
      }
  }

  getTables(): (Table | View)[] {
    console.log('Loaded tables:', this.loadedTables);
    return Array.from(this.loadedTables.values());
  }

  async listTableDefinitionsFromBusinessObject(businessObject: string, accessType: string = 'permissioned'): Promise<TablesResult> {
    try {
      const ejsFilePath = Utils.createPath('business-objects', `${businessObject}.ejs`);
      const ejsFile = fs.readFileSync(ejsFilePath, 'utf8');
      const rendered = ejs.render(ejsFile, { schema: this.schema });
    
      const parser = new Parser();
      const database = parser.parse(rendered, 'dbml');
      let _tables: Table[] = [];
      for (const table of database.schemas[0].tables) {
        const parsedSchema = table.schema.name;
        const tableName = table.name;
        const resourceId = `${parsedSchema}.${tableName}`;
        const fields = table.fields || [];
        const indexes = table.indexes || [];
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
          throw new TablesManagerError(`Schema ${parsedSchema} does not match the schema ${this.schema}`);
        }
      }
      return { success: true, message: `Processed all tables in ${this.schema} - ${businessObject}`, tables: _tables};
    } catch (error) {
      this.log('Error in listTableDefinitionsFromBusinessObject:', 'error');
      return Utils.handleTableErrors(error);
    }
  }

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
                if (!foundTable.biscuits) missing.push('biscuits');
                if (!foundTable.security) missing.push('security');
                this.log(`Warning: No ${missing.join(' or ')} found for table ${foundTable.tableName} in schema ${foundTable.schema}`, 'warn');
              }
            }  
          }
        }
      } else {
        return { success: false, message: `No business objects were found in ${this.schema}`, tables: tableObject};
      }
      return { success: true, message: `Processed ${this.schema} - ${table}`, tables: tableObject};
    } catch (error) {
      this.log('Error in getTableDefinitionByTable:', 'error');
      return Utils.handleTableErrors(error);
    }
  }

  async listBusinessObjects(): Promise<string[]> {
    try {
      const ejsFiles = fs.readdirSync(Utils.createPath('business-objects'));
      return ejsFiles.map(file => file.replace('.ejs', ''));
    } catch (error) {
      this.log('Error in listBusinessObjects:', 'error');
      console.log(Utils.handleTableErrors(error));
      return [];
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
      this.log(`Failed to parse JSON file into Biscuit object: ${(error as Error).message}`, 'error');
    }
    this.log(`No ${accessLevel} biscuit found for table ${table.tableName} in schema ${table.schema}`, 'warn');
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
      this.log(`Failed to parse JSON file into Biscuit object: ${(error as Error).message}`, 'error');
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
      this.log(`Failed to parse JSON file into Security object: ${(error as Error).message}`, 'error');
    }
    return null;
  }

  async getTableByName(tableName: string): Promise<Table | undefined> {
    const cacheKey = `table_${tableName}`;
    let table = this.cache.get<Table>(cacheKey);
    
    if (table === undefined) {
      const tableOrView = this.loadedTables.get(tableName);
      if (tableOrView && this.isTable(tableOrView)) {
        this.cache.set(cacheKey, tableOrView);
        table = tableOrView;
      } else {
        // If the table is not loaded, try to load it
        const tableDefinition = await this.loadTableDefinition(tableName);
        if (tableDefinition) {
          this.loadedTables.set(tableName, tableDefinition);
          this.cache.set(cacheKey, tableDefinition);
          table = tableDefinition;
        }
      }
    }
    
    return table;
  }

  private async loadTableDefinition(tableName: string): Promise<Table | undefined> {
    // Implementation to load a single table definition
    // This could involve parsing the business object or fetching from a database
    const result = await this.getTableDefinitionByTable(tableName);
    return result.success && result.tables.length > 0 ? result.tables[0] : undefined;
  }

  async saveTableSecurity(force: boolean = false): Promise<Result> {
    try {
      if (this.loadedTables.size === 0) {
        this.log(`No tables found in schema ${this.schema}`, 'warn');
        return {
          success: false,
          message: `No tables found in schema ${this.schema}`
        };
      }
  
      for (let [, tableOrView] of this.loadedTables) {
        // Skip views, only process tables
        if (!this.isTable(tableOrView)) {
          continue;
        }

        const table = tableOrView; // Now TypeScript knows this is a Table
        const securityFilePath = Utils.createPath('schemas', this.schema.toLowerCase(), '.secure', 'keys', `${table.tableName}.json`);
        this.log(`Security file path: ${securityFilePath}`, 'info');
        try {
          const tableKeys = new ED25519Signer();
          const keyData: KeyPairEncodings = tableKeys.generateKeyPairEncodings();
          this.log(`Public Key: ${keyData.hexEncodedPublicKey}`, 'info');
          Utils.writeFile(securityFilePath, JSON.stringify(keyData, null, 2), force);
        } catch (innerError) {
          this.log(`Error generating keys for table ${table.tableName}: ${innerError instanceof Error ? innerError.message : 'Unknown error'}`, 'error');
          this.log(`Error details: ${JSON.stringify(innerError)}`, 'error');
          throw innerError;
        }
      }
  
      return {
        success: true,
        message: `Public and private keys saved for all tables in schema ${this.schema}`
      };
    } catch (error) {
      this.log(`Error in saveTableSecurity: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      this.log(`Error details: ${JSON.stringify(error)}`, 'error');
      return Utils.handleError(error);
    }
  }

  async formatViewName(viewName: string): Promise<string> {
    // Convert camelCase to SNAKE_CASE
    const snakeCase = viewName.replace(/[A-Z]/g, letter => `_${letter}`).toUpperCase();
    
    // Add V_ prefix if not already present
    return snakeCase.startsWith('V_') ? snakeCase : `V_${snakeCase}`;
  }

  async saveViewSecurity(viewName: string, force: boolean = false): Promise<Result> {
    try {
      // Format the view name
      const formattedViewName = await this.formatViewName(viewName);
      
      const securityFilePath = Utils.createPath('schemas', this.schema.toLowerCase(), '.secure', 'keys', `${formattedViewName}.json`);
      this.log(`Security file path: ${securityFilePath}`, 'info');
  
      const viewKeys = new ED25519Wallet();
      const keyData: KeyPairEncodings = viewKeys.generateKeyPairEncodings();
      this.log(`Public Key: ${keyData.hexEncodedPublicKey}`, 'info');
  
      await Utils.writeFile(securityFilePath, JSON.stringify(keyData, null, 2), force);
  
      return {
        success: true,
        message: `Public and private keys saved for view ${formattedViewName} in schema ${this.schema}`,
      };
    } catch (error) {
      this.log('Error in saveViewSecurity:', 'error');
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
      this.log('Error in backupTableSecurity:', 'error');
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
          throw new TablesManagerError(`The security directory for schema ${this.schema} already exists.\nUse force = true to overwrite it.`);
        }
      }
      mkdirp.sync(securityPath);
      await extract(source, { dir: securityPath });
      return { success: true, message: 'restore security success' };
    } catch (error) {
      this.log('Error in restoreTableSecurity:', 'error');
      return Utils.handleError(error);
    }
  }

  // Type guard to check if an object is a Table
  private isTable(obj: Table | View): obj is Table {
    return 'tableName' in obj && 'resourceId' in obj && 'accessType' in obj;
  }

  async saveTableDefinitions(force: boolean = false): Promise<Result> {  
    try {
      if (this.loadedTables.size === 0) {
        this.log('No tables to process', 'warn');
        return { success: false, message: 'No tables to process' };
      }

      for (const [, tableOrView] of this.loadedTables) {
        if (this.isTable(tableOrView)) {
          const outputFilePath = Utils.createPath('schemas', this.schema.toLowerCase(), 'tables', `${tableOrView.tableName}.json`);
          Utils.writeFile(outputFilePath, JSON.stringify(tableOrView, null, 2), force);
        }
      }
      return { success: true, message: `Processed ${this.schema}` };
    } catch (error) {
      this.log('Error in saveTableDefinitions:', 'error');
      return Utils.handleError(error);
    }
  }

  async dqlPreviewFromTable(table: Table, limit: number = 100): Promise<RenderSQLResult> {
    try {
      const columnNames = table.columns.map(column => column.columnName).join(',\n \t');
      const sql = `SELECT \n\t${columnNames}\nFROM ${table.resourceId}\nLIMIT ${limit};`;
      return { success: true, message: 'DQL success', sql };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      this.log('Error in dqlPreviewFromTable:', 'error');
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
      this.log('Error in sqlQueryFromFile:', 'error');
      return { success: false, message, sql: null};
    }
  }
    
  escapeString(value: string): string {
    return value.replace(/'/g, "''");
  }

  async getViewParameters(viewName: string): Promise<Record<string, string> | null> {
    try {
      const parameterFilePath = path.join('data', 'parameters', `${viewName}.json`);
      if (fs.existsSync(parameterFilePath)) {
        const fileContent = fs.readFileSync(parameterFilePath, 'utf8');
        return JSON.parse(fileContent);
      } else {
        this.log(`No parameter file found for view ${viewName}`, 'warn');
        return null;
      }
    } catch (error) {
      this.log(`Failed to parse parameter file for view ${viewName}: ${(error as Error).message}`, 'error');
      return null;
    }
  }
  
  async dmlFromTable(table: Table, operation: 'insert' | 'delete' | 'update'): Promise<RenderSQLResult> {
    try {
      let data: Records | null = null;
      data = await Utils.getRecordsFromDataLocation(table.tableName, operation);
      let dml: string | null = null;
  
      switch (operation) {
        case 'insert':
          if (data && data.length > 0) {
            const fields = Object.keys(data[0]);
            dml = `INSERT INTO ${table.resourceId} (${fields.join(', ')}) VALUES `;
            dml += data.map(record => {
              const values = fields.map(field => {
                if (field === 'deployed_at') {
                  return 'CURRENT_TIMESTAMP';
                } else if (record[field] === null) {
                  return 'NULL';
                } else if (typeof record[field] === 'string') {
                  return `'${this.escapeString(record[field])}'`;
                } else {
                  return record[field];
                }
              }).join(', ');
              return `(${values})`;
            }).join(', ');
            dml += ';';
          }
          break;
        case 'delete':
          if (data && data.length === 0) {
            this.log('No records provided. Deleting all records from the table', 'warn');
            dml = `DELETE FROM ${table.resourceId};`;
          } else if (data) {
            dml = data.map(record => {
              const conditions = Object.entries(record).map(([key, value]) => {
                if (typeof value === 'string') {
                  return `${key} = '${this.escapeString(value)}'`;
                } else {
                  return `${key} = '${value}'`;
                }
              }).join(' AND ');
              return `DELETE FROM ${table.resourceId} WHERE ${conditions};`;
            }).join(' ');
          }
          break;
        case 'update':
          if (data) {
            dml = data.map(record => {
              const setClauses = Object.entries(record).map(([key, value]) => {
                if (typeof value === 'string') {
                  return `${key} = '${this.escapeString(value)}'`;
                } else {
                  return `${key} = '${value}'`;
                }
              }).join(', ');
              return `UPDATE ${table.resourceId} SET ${setClauses};`;
            }).join(' ');
          }
          break;
      }
  
      return { success: true, message: 'DML success', sql: dml };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      this.log('Error in dmlFromTable:', 'error');
      return { success: false, message, sql: null };
    }
  }

  async streamTemplateFromTable(table: Table): Promise<TableMapping | null> {
    try {
      const columnMapping: ColumnMapping[] = table.columns.map(column => ({
        originKey: column.columnName,
        dataType: column.columnType,
      }));
  
      const tableMapping: TableMapping = {
        originPath: table.schema,
        targetTable: table.tableName,
        isArray: false,
        columnMapping,
      };
  
      return tableMapping;
    } catch (error) {
      this.log(`Error creating table mapping: ${error}`, 'error');
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
      this.log('Error in ddlFromTable:', 'error');
      return { success: false, message, sql: null };
    }
  }
    
  async ddlIndexFromTable(action: DDLActions, table: Table): Promise<RenderSQLResult[]> {
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
      this.log('Error in ddlIndexFromTable:', 'error');
      return [{ success: false, sql: null, message }];
    }
  }

  async saveSQLTemplates(templateType: 'ddl' | 'dql' | 'dml', force: boolean = false): Promise<Result> {
    try {
      let generatedCount = 0;

      for (const [, tableOrView] of this.loadedTables) {
        // Skip views, only process tables
        if (!this.isTable(tableOrView)) {
          continue;
        }

        const table = tableOrView; // Now TypeScript knows this is a Table
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
            this.log(`Invalid templateType: ${templateType}`);
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
      this.log('Error in saveSQLTemplates:', 'error');
      return { success: false, message: (error as Error).message };
    }
  }

  async generateViewSQL(
    schema: string, 
    viewName: string, 
    viewType: 'standard' | 'materialized' | 'parameterized', 
    action: 'create' | 'drop',
    refreshInterval?: number
  ): Promise<RenderSQLResult> {
    try {
      let sql: string;
      const capitalizedViewName = viewName.toUpperCase();

      if (action === 'create') {
        const securityFilePath = path.join('schemas', schema.toLowerCase(), '.secure', 'keys', `${capitalizedViewName}.json`);
        if (!fs.existsSync(securityFilePath)) {
          throw new Error(`Security file not found for view ${capitalizedViewName}`);
        }
        const securityData = JSON.parse(fs.readFileSync(securityFilePath, 'utf8'));

        let publicKey = securityData.hexEncodedPublicKey;
        if (!publicKey) {
          throw new Error(`Public key not found in security file for view ${capitalizedViewName}`);
        }

        const filePath = path.join('schemas', schema.toLowerCase(), 'sql', 'views', `${capitalizedViewName}.sql`);
        if (!fs.existsSync(filePath)) {
          throw new Error(`SQL file not found for view ${capitalizedViewName}`);
        }
        const viewDefinition = fs.readFileSync(filePath, 'utf8');
        
        const viewTypeMap = {
          standard: 'VIEW',
          materialized: 'MATERIALIZED VIEW',
          parameterized: 'PARAMETERIZED VIEW'
        };
        
        let withClause = `WITH "public_key=${publicKey}"`;
        if (viewType === 'materialized' && refreshInterval) {
          withClause += `,refresh_interval=${refreshInterval}`;
        }
        
        sql = `CREATE ${viewTypeMap[viewType]} ${schema}.${capitalizedViewName} ${withClause} AS ${viewDefinition}`;

      } else {
        const viewTypeMap = {
          standard: 'VIEW',
          materialized: 'MATERIALIZED VIEW',
          parameterized: 'PARAMETERIZED VIEW'
        };
        
        sql = `DROP ${viewTypeMap[viewType]} ${schema}.${capitalizedViewName}`;
      }

      return { success: true, message: `${action.charAt(0).toUpperCase() + action.slice(1)} view SQL generated successfully`, sql };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error in generateViewSQL:', error);
      return { success: false, message, sql: null };
    }
  }

  private clearCache() {
    this.cache.flushAll();
  }
}

export default TablesManager;
