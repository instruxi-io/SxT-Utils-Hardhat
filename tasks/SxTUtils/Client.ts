import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { RenderSQLResult, SxTResult } from './types'; 
import { table as dtable } from 'table';
import TablesManager from './Tables'
import { HttpSuccess } from 'SpaceAndTimeSDK/src/types';
import fs from 'fs';
import path from 'path';

class ClientManager {
  tablesManager: TablesManager;

  constructor (tablesManager: TablesManager){
    this.tablesManager = tablesManager;
  }

  //********************************* Execute SQL ********************************* //
  async manageTableDDL(hre: HardhatRuntimeEnvironment, action: 'create' | 'drop'): Promise<SxTResult[]> {
    const results: SxTResult[] = [];
  
    for (let table of this.tablesManager.tables) {
      console.log(`DDL Manager (schema=${this.tablesManager.schema.toUpperCase()}, table=${table.tableName}, action=${action.toUpperCase()})`);
      const sql: RenderSQLResult = await this.tablesManager.ddlFromTable(action, table);
      console.log('----------------------------------------')
      if (!sql.sql || !table.security?.hexEncodedPublicKey || !table.biscuits?.ddl) {
        let message = 'Error: ';
        if (!sql.sql) {
          message += 'No SQL statement. ';
        }
        if (!table.security?.hexEncodedPublicKey) {
          message += 'No hex encoded public key. ';
        }
        if (!table.biscuits?.ddl) {
          message += 'No DDL biscuit. ';
        }
        results.push({ success: false, message: message, sql: '', records: null });
        continue;
      }
  
      let createSQLText;
      if (action === 'create') {
        createSQLText = hre.sxtSDK.addSecuritySuffix(sql.sql, table.security?.hexEncodedPublicKey, table.accessType || 'permissioned');
      }
  
      const sqlToExecute = createSQLText || sql.sql;
      console.log(`DDL on ${table.tableName} with biscuit: `, table.biscuits.ddl.substring(0, 30), '...');
      const [ddlSuccess, ddlError] = await hre.sxtSDK.createTable(sqlToExecute, table.accessType, [table.biscuits.ddl]);
      if (ddlError) {
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
  
  async manageTableIndex(hre: HardhatRuntimeEnvironment): Promise<SxTResult[]> {
    let results: SxTResult[] = [];
  
    for (let table of this.tablesManager.tables) {
      console.log(`Creating index for table ${table.tableName} in schema ${this.tablesManager.schema.toUpperCase()}`);
      const sqls: RenderSQLResult[] = await this.tablesManager.ddlIndexFromTable('create', table);
  
      for (const sql of sqls) {
        if (!sql.success) {
          console.error(`Could not generate SQL statement: ${sql.message}`);
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
  
    for (let table of this.tablesManager.tables) {
      console.log(`DML ${action} on ${this.tablesManager.schema.toUpperCase()}.${table.tableName}`);
      const sql: RenderSQLResult = await this.tablesManager.dmlFromTable(table, action);
      let result: SxTResult;
      if (sql.success) {
        let biscuit = table.biscuits?.dml;
        if (!biscuit) {
          result = { success: false, message: 'Biscuit not found for the table', sql: sql.sql || 'No SQL generated', records: null };
        } else if (sql.sql && biscuit) {
          console.log('----------------------------------------')
          let [dmlSuccess, dmlError] = await hre.sxtSDK.DML([table.resourceId], sql.sql, [biscuit]);
          if (dmlError) {
            console.log(dmlError)
            result = { success: false, message: `----------------------------------------\nDML Failed --> ${dmlError?.response?.data.title}\n\t${dmlError?.response?.data.detail}`, sql: sql.sql, records: null };
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
    
  async printTable(dqlSuccess: HttpSuccess<any>| null, outFile: string): Promise<void> {
    if (dqlSuccess === null) {
      console.error('dqlSuccess is null or does not contain data');
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
  
      if (outFile && path.extname(outFile) === '.json') {
        fs.writeFileSync(outFile, JSON.stringify(dqlSuccess.data, null, 2));
      } else if (!outFile) {
        console.error('No outFile defined. Output will not be saved');
      } else {
        console.error('Invalid outFile. It should be a .json file');
      }
    } catch (error) {
      console.error(`Failed to generate table: ${error}`);
    }
  }

  async manageTablePreviewDQL(hre: HardhatRuntimeEnvironment): Promise<SxTResult[]> {
    const results: SxTResult[] = [];
  
    for (const table of this.tablesManager.tables) {
      console.log(`DQL Manager (schema=${this.tablesManager.schema.toUpperCase()}, table=${table.tableName}, action=preview)`);
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
  
      if (dqlError) {
        results.push({
          success: false,
          message: `----------------------------------------\nDQL Failed --> ${dqlError?.response?.data.title}\n\t${dqlError?.response?.data.detail}`,
          sql: sql.sql,
          records: null
        });
      } else if (dqlSuccess !== null) {
        this.printTable(dqlSuccess, this.tablesManager.outfile);
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
  
    for (const table of this.tablesManager.tables) {
      console.log(`Processing Custom Query (schema=${this.tablesManager.schema.toUpperCase()}, table=${table.tableName})`);
  
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
      console.log(dqlError)
      return {
        success: false,
        message: `----------------------------------------\nDQL Failed --> ${dqlError?.response?.data.title}\n\t${dqlError?.response?.data.detail}`,
        sql: sql.sql,
        records: null
      };
    } else if (dqlSuccess !== null) {
      this.printTable(dqlSuccess, this.tablesManager.outfile);
      return { success: true, message: 'Query execution was successful', sql: sql.sql, records: null };
    } else {
      return { success: false, message: 'DQL execution returned null', sql: sql.sql, records: null };
    }
  }

}

export default ClientManager;