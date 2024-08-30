import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { RenderSQLResult, SxTResult } from './types';
import { table as dtable } from 'table';
import TablesManager from './Tables';
import { HttpSuccess } from '@instruxi-io/sxt-typescript-sdk/src/types';
import fs from 'fs';
import path from 'path';
import NodeCache from 'node-cache';

class ClientManagerError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ClientManagerError';
  }
}

class ClientManager {
  private tablesManager: TablesManager;
  private cache: NodeCache;

  constructor(tablesManager: TablesManager) {
    this.tablesManager = tablesManager;
    this.cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache for 10 minutes
  }

  private log(message: string, level: 'info' | 'error' | 'warn' = 'info'): void {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  }
  
  async manageTableDDL(hre: HardhatRuntimeEnvironment, action: 'create' | 'drop'): Promise<SxTResult[]> {
    const results: SxTResult[] = [];
    const tables = await this.tablesManager.getTables();

    for (const table of tables) {
      this.log(`DDL Manager (schema=${this.tablesManager.schema}, table=${table.tableName}, action=${action})`);
      const sql: RenderSQLResult = await this.tablesManager.ddlFromTable(action, table);
      console.log('----------------------------------------');
      if (!sql.sql || !table.security?.hexEncodedPublicKey || !table.biscuits?.ddl) {
        let message = 'Error: ';
        if (!sql.sql) message += 'No SQL statement. ';
        if (!table.security?.hexEncodedPublicKey) message += 'No hex encoded public key. ';
        if (!table.biscuits?.ddl) message += 'No DDL biscuit. ';
        results.push({ success: false, message: message, sql: '', records: null });
        continue;
      }

      let createSQLText;
      if (action === 'create') {
        createSQLText = hre.sxtSDK.addSecuritySuffix(sql.sql, table.security?.hexEncodedPublicKey, table.accessType || 'permissioned');
      }

      const sqlToExecute = createSQLText || sql.sql;
      console.log(sqlToExecute);
      console.log(`DDL on ${table.tableName} with biscuit: `, table.biscuits.ddl.substring(0, 30), '...');
      const [ddlSuccess, ddlError] = await hre.sxtSDK.createTable(sqlToExecute, [table.biscuits.ddl]);
      if (ddlError) {
        this.log(ddlError.toString(), 'error');
        results.push({
          success: false,
          message: `DDL Failed --> ${ddlError?.response?.data.title}\n\t${ddlError?.response?.data.detail}`,
          sql: sql.sql,
          records: null
        });
      } else if (ddlSuccess?.data === '') {
        results.push({ success: false, message: 'Table creation failed. createTableSuccess returned an empty string', sql: sql.sql, records: null });
      } else {
        results.push({ success: true, message: 'DDL Success', sql: sql.sql, records: ddlSuccess?.data });
      }
    }

    return results;
  }
  
  async printTable(dqlSuccess: HttpSuccess<any> | null, outFile: string): Promise<void> {
    if (dqlSuccess === null) {
      this.log('dqlSuccess is null or does not contain data', 'error');
      return;
    }
    try {
      let dataArrays = [];
      if (dqlSuccess.data.length > 0) {
        dataArrays.push(Object.keys(dqlSuccess.data[0]));
      }
      for (let dataObject of dqlSuccess.data) {
        let truncatedValues = Object.values(dataObject).map(value => 
          String(value).substring(0, 8) 
        );
        dataArrays.push(truncatedValues);
      }

      let columnsConfig: { [key: number]: { width: number, wrapWord: boolean } } = {};
      if (dataArrays.length > 0) {
        for (let i = 0; i < dataArrays[0].length; i++) {
          columnsConfig[i] = {
            width: 9,
            wrapWord: false
          };
        }
      }

      const config = {
        border: {
          topBody: `─`,
          topJoin: `┬`,
          topLeft: `┌`,
          topRight: `┐`,
          bottomBody: `─`,
          bottomJoin: `┴`,
          bottomLeft: `└`,
          bottomRight: `┘`,
          bodyLeft: `│`,
          bodyRight: `│`,
          bodyJoin: `│`,
          joinBody: `─`,
          joinLeft: `├`,
          joinRight: `┤`,
          joinJoin: `┼`
        },
        columns: columnsConfig
      };

      let output = dtable(dataArrays, config);
      console.log(output);

      if (outFile && path.extname('tmp/' + outFile) === '.json') {
        fs.writeFileSync('tmp/' + outFile, JSON.stringify(dqlSuccess.data, null, 2));
      } else if (!outFile) {
        this.log('No outFile defined. Output will not be saved', 'warn');
      } else {
        this.log('Invalid outFile. It should be a .json file', 'error');
      }
    } catch (error) {
      this.log(`Failed to generate table: ${error}`, 'error');
    }
  }

  async manageTableIndex(hre: HardhatRuntimeEnvironment): Promise<SxTResult[]> {
    let results: SxTResult[] = [];
    const tables = await this.tablesManager.getTables();

    for (const table of tables) {
      this.log(`Creating index for table ${table.tableName} in schema ${this.tablesManager.schema}`, 'info');
      const sqls: RenderSQLResult[] = await this.tablesManager.ddlIndexFromTable('create', table);

      for (const sql of sqls) {
        if (!sql.success) {
          this.log(`Could not generate SQL statement: ${sql.message}`, 'error');
          results.push({ success: false, message: `Index creation failed: ${sql.message}`, sql: sql.sql || 'No SQL generated', records: null });
          continue;
        }

        if (!sql.sql || !table.security?.hexEncodedPublicKey || !table.biscuits?.ddl) {
          results.push({ success: false, message: 'Condition not met', sql: sql.sql, records: null });
          continue;
        }

        const [ddlSuccess, ddlError] = await hre.sxtSDK.DDL(sql.sql, [table.biscuits.ddl]);

        if (ddlError) {
          results.push({
            success: false,
            message: `DDL Failed --> ${ddlError?.response?.data.title}\n\t${ddlError?.response?.data.detail}`,
            sql: sql.sql,
            records: null
          });
        } else if (!ddlSuccess) {
          results.push({ success: false, message: 'Index creation failed. DDL operation returned falsy value', sql: sql.sql, records: null });
        } else {
          results.push({ success: true, message: 'Index creation was successful', sql: sql.sql, records: null });
        }
      }
    }

    return results;
  }

  async manageTableDML(hre: HardhatRuntimeEnvironment, action: 'insert' | 'update' | 'delete'): Promise<SxTResult[]> {
    let results: SxTResult[] = [];
    const tables = await this.tablesManager.getTables();

    for (const table of tables) {
      this.log(`DML ${action} on ${this.tablesManager.schema}.${table.tableName}`, 'info');
      const sql: RenderSQLResult = await this.tablesManager.dmlFromTable(table, action);
      let result: SxTResult;
      if (sql.success) {
        let biscuit = table.biscuits?.dml;
        if (!biscuit) {
          result = { success: false, message: 'Biscuit not found for the table', sql: sql.sql || 'No SQL generated', records: null };
        } else if (sql.sql && biscuit) {
          console.log('----------------------------------------');
          let [dmlSuccess, dmlError] = await hre.sxtSDK.DML([table.resourceId], sql.sql, [biscuit]);
          if (dmlError) {
            this.log(dmlError?.config, 'error');
            result = { success: false, message: dmlError.message, sql: sql.sql, records: null };
          } else {
            result = { success: true, message: 'Query execution was successful', sql: sql.sql, records: null };
          }
        } else {
          result = { success: false, message: 'Query execution failed. SQL statement rendered null', sql: sql.sql, records: null };
        }
      } else {
        result = { success: false, message: `Query execution failed: ${sql.message}`, sql: sql.sql || 'No SQL generated', records: null };
      }
      results.push(result);
    }

    return results;
  }

  async manageTablePreviewDQL(hre: HardhatRuntimeEnvironment): Promise<SxTResult[]> {
    const results: SxTResult[] = [];
    const tables = await this.tablesManager.getTables();

    for (const table of tables) {
      this.log(`DQL Manager (schema=${this.tablesManager.schema}, table=${table.tableName}, action=preview)`, 'info');
      const sql: RenderSQLResult = await this.tablesManager.dqlPreviewFromTable(table);

      if (!sql.success || !sql.sql) {
        results.push({
          success: false,
          message: `SQL generation failed: ${sql.message}`,
          sql: sql.sql || 'No SQL generated',
          records: null
        });
        continue;
      }

      if (!table.biscuits?.dql) {
        results.push({
          success: false,
          message: 'Biscuit not found for the table',
          sql: sql.sql,
          records: null
        });
        continue;
      }

      console.log(`----------------------------------------\n ${sql.sql}`);

      const [dqlSuccess, dqlError] = await hre.sxtSDK.DQL([table.resourceId], sql.sql, [table.biscuits?.dql]);

      console.log(`----------------------------------------\n ${sql.sql}`);
      if (dqlError) {
        this.log(dqlError.message, 'error');
        results.push({
          success: false,
          message: `----------------------------------------\nDQL Failed --> ${dqlError?.response?.data.title}\n\t${dqlError?.response?.data.detail}`,
          sql: sql.sql,
          records: null
        });
      } else if (dqlSuccess !== null) {
        await this.printTable(dqlSuccess, this.tablesManager.outfile);
        results.push({
          success: true,
          message: 'Query execution was successful',
          sql: sql.sql,
          records: dqlSuccess.data
        });
      } else {
        results.push({
          success: false,
          message: 'DQL execution returned null',
          sql: sql.sql,
          records: null
        });
      }
    }

    return results;
  }

  async manageTableCustomDQL(hre: HardhatRuntimeEnvironment): Promise<SxTResult> {
    const resourceIds: string[] = [];
    const biscuits: string[] = [];
    const tables = await this.tablesManager.getTables();

    for (const table of tables) {
      this.log(`Processing Custom Query (schema=${this.tablesManager.schema}, table=${table.tableName})`, 'info');

      if (!table.biscuits?.dql) {
        return { success: false, message: 'Biscuit not found for the table', sql: '', records: null };
      }

      biscuits.push(table.biscuits?.dql);
      resourceIds.push(table.resourceId);
    }
    
    if (!this.tablesManager.query) {
      return { success: false, message: 'Query parameter not found. Be sure to use --query', sql: '', records: null };
    }
    const sql: RenderSQLResult = await this.tablesManager.sqlQueryFromFile(this.tablesManager.schema, this.tablesManager.query);

    if (!sql.success || !sql.sql) {
      return { success: false, message: `SQL generation failed: ${sql.message}`, sql: sql.sql || 'No SQL generated', records: null };
    }

    console.log(`----------------------------------------\n ${sql.sql}`);
    const [dqlSuccess, dqlError] = await hre.sxtSDK.DQL(resourceIds, sql.sql, biscuits);

    if (dqlError) {
      console.log(dqlError);
      return {
        success: false,
        message: `----------------------------------------\nDQL Failed --> ${dqlError?.response?.data.title}\n\t${dqlError?.response?.data.detail}`,
        sql: sql.sql,
        records: null
      };
    } else if (dqlSuccess !== null) {
      await this.printTable(dqlSuccess, this.tablesManager.outfile);
      return { success: true, message: 'Query execution was successful', sql: sql.sql, records: null };
    } else {
      return { success: false, message: 'DQL execution returned null', sql: sql.sql, records: null };
    }
  }

  async manageView(hre: HardhatRuntimeEnvironment, action: 'create' | 'drop', viewName: string, viewType: 'standard' | 'materialized' | 'parameterized'): Promise<SxTResult> {
    viewName = viewName.toUpperCase(); // Capitalize the viewName

    this.log(`View Manager (schema=${this.tablesManager.schema}, view=${viewName}, action=${action}, type=${viewType})`, 'info');
    const resourceIds: string[] = [];
    const biscuits: string[] = [];
    const tables = this.tablesManager.getTables();

    if (tables.length === 0) {
        return { 
            success: false, 
            message: 'No tables found for the view. Please ensure that the necessary tables are specified.',
            sql: '',
            records: null 
        };
    }

    for (const table of tables) {
        this.log(`Loading security for (schema=${this.tablesManager.schema}, table=${table})`, 'info');

        if (!table.biscuits?.ddl) {
            return { success: false, message: `Biscuit not found for the table ${table.tableName}`, sql: '', records: null };
        }

        biscuits.push(table.biscuits.ddl);
        resourceIds.push(table.resourceId);
    }
    
    const sql: RenderSQLResult = await this.tablesManager.generateViewSQL(this.tablesManager.schema, viewName, viewType, action);
    
    if (!sql.success || !sql.sql) {
        return {
            success: false,
            message: `SQL generation failed: ${sql.message}`,
            sql: sql.sql || 'No SQL generated',
            records: null
        };
    }

    console.log(`----------------------------------------\n ${sql.sql}`);

    const [ddlSuccess, ddlError] = await hre.sxtSDK.DDL(sql.sql, biscuits);

    if (ddlError) {
        console.log(ddlError);
        return {
            success: false,
            message: `----------------------------------------\nDDL Failed --> ${ddlError?.response?.data.message}\n\t${ddlError?.response?.data.message}`,
            sql: sql.sql,
            records: null
        };
    } else if (ddlSuccess) {
        return {
            success: true,
            message: `View ${action} was successful`,
            sql: sql.sql,
            records: ddlSuccess.data
        };
    } else {
        return {
            success: false,
            message: 'DDL execution returned null',
            sql: sql.sql,
            records: null
        };
    }
  }

  async refreshMaterializedView(hre: HardhatRuntimeEnvironment, viewName: string): Promise<SxTResult> {
    this.log(`Refreshing Materialized View (schema=${this.tablesManager.schema}, view=${viewName})`, 'info');

    const table = await this.tablesManager.getTableByName(viewName);
    if (!table || !table.biscuits?.wildcard) {
      return {
        success: false,
        message: 'Biscuit not found for the view',
        sql: '',
        records: null
      };
    }

    const [refreshSuccess, refreshError] = await hre.sxtSDK.refreshMaterializedView(`${this.tablesManager.schema}.${viewName}`, [table.biscuits.wildcard]);

    if (refreshError) {
      return {
        success: false,
        message: `----------------------------------------\nRefresh Failed --> ${refreshError?.response?.data.title}\n\t${refreshError?.response?.data.detail}`,
        sql: '',
        records: null
      };
    } else if (refreshSuccess) {
      return {
        success: true,
        message: 'Materialized view refresh was successful',
        sql: '',
        records: refreshSuccess.data
      };
    } else {
      return {
        success: false,
        message: 'Refresh execution returned null',
        sql: '',
        records: null
      };
    }
  }

  async getLastRefreshTime(hre: HardhatRuntimeEnvironment, viewName: string): Promise<SxTResult> {
    this.log(`Getting Last Refresh Time (schema=${this.tablesManager.schema}, view=${viewName})`, 'info');

    const table = await this.tablesManager.getTableByName(viewName);
    if (!table || !table.biscuits?.wildcard) {
      return {
        success: false,
        message: 'Biscuit not found for the view',
        sql: '',
        records: null
      };
    }

    const [timeSuccess, timeError] = await hre.sxtSDK.getMaterializedViewLastRefreshTime(`${this.tablesManager.schema}.${viewName}`, [table.biscuits.wildcard]);

    if (timeError) {
      return {
        success: false,
        message: `----------------------------------------\nGet Last Refresh Time Failed --> ${timeError?.response?.data.title}\n\t${timeError?.response?.data.detail}`,
        sql: '',
        records: null
      };
    } else if (timeSuccess) {
      return {
        success: true,
        message: 'Get last refresh time was successful',
        sql: '',
        records: timeSuccess.data
      };
    } else {
      return {
        success: false,
        message: 'Get last refresh time execution returned null',
        sql: '',
        records: null
      };
    }
  }

  async manageViewDQL(hre: HardhatRuntimeEnvironment, viewName: string, viewType: 'standard' | 'materialized' | 'parameterized'): Promise<SxTResult> {
    this.log(`View DQL Manager (schema=${this.tablesManager.schema}, view=${viewName}, type=${viewType})`, 'info');
    viewName = viewName.toUpperCase(); 
    const view = await this.tablesManager.getTableByName(viewName);
    
    if (!view || !view.biscuits?.dql) {
      return {
        success: false,
        message: 'Biscuit not found for the view',
        sql: '',
        records: null
      };
    }
  
    let parameters: Record<string, any> | undefined;
    if (viewType === 'parameterized') {
      try {
        const parameterPath = path.join('data', 'parameters', `${viewName}.json`);
        if (fs.existsSync(parameterPath)) {
          const parameterContent = fs.readFileSync(parameterPath, 'utf8');
          parameters = JSON.parse(parameterContent);
        } else {
          this.log(`Parameter file not found for parameterized view ${viewName}`, 'warn');
        }
      } catch (error) {
        this.log(`Error reading or parsing parameters for view ${viewName}: ${error}`, 'error');
      }
    }
  
    try {
      const [dqlSuccess, dqlError] = await hre.sxtSDK.queryViewById(this.tablesManager.schema + '.' + viewName, parameters || {}, [view.biscuits.dql]);
  
      console.log(dqlError)
      if (dqlError) {
        return {
          success: false,
          message: `Query Failed --> ${dqlError.message}`,
          sql: '',
          records: null
        };
      } else if (dqlSuccess) {
        await this.printTable(dqlSuccess, this.tablesManager.outfile);
        return {
          success: true,
          message: 'View query was successful',
          sql: '',
          records: dqlSuccess.data
        };
      } else {
        return {
          success: false,
          message: 'View query execution returned null',
          sql: '',
          records: null
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Unexpected error during view query: ${(error as Error).message}`,
        sql: '',
        records: null
      };
    }
  }
  
  private clearCache() {
    this.cache.flushAll();
  }
}

export default ClientManager;