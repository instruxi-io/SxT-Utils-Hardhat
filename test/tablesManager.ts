import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import TablesManager from '../tasks/SxTUtils/Tables';
import Utils from '../tasks/SxTUtils/utils/utils';
import { ED25519Wallet } from "SpaceAndTimeSDK";
import { TaskArgs } from 'tasks/SxTUtils';


describe('TablesManager', () => {
  let tablesManagerFromBusinessObject: TablesManager;
  let tablesManagerFromTable: TablesManager;
  let tablesManagerFromTables: TablesManager;
  let sandbox: sinon.SinonSandbox;
  const testSchema = 'mesh_prod';
  const testBusinessObject = 'Authentication';
  const testTable = [{schema: testSchema.toUpperCase(), tableName: 'ACCOUNTS'},{schema: testSchema.toUpperCase(), tableName: 'APIKEYS'},{schema: testSchema.toUpperCase(), tableName: 'TENANTS'}];
  const testTableArray = testTable.map((table) => table.tableName);
  const testTables = 'attestations,smart_contracts,accounts';
  const testTablesArray = testTables.split(",");
  const testAccessType = 'permissioned'

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    tablesManagerFromBusinessObject = new TablesManager({ schema: testSchema, businessobject: testBusinessObject });
    tablesManagerFromTable = new TablesManager({ schema: testSchema, table: testTable[0].tableName });
    tablesManagerFromTables = new TablesManager({ schema: testSchema, table: testTables });
  });

  afterEach(() => {
    sandbox.restore();
  });

  
  it('should construct properly', () => {
    expect(tablesManagerFromBusinessObject.schema).to.equal(testSchema.toUpperCase());
    expect(tablesManagerFromBusinessObject.businessObject).to.equal(testBusinessObject);
    expect(tablesManagerFromBusinessObject.tables).to.deep.equal([]);
    //expect(tablesManagerFromTable.schema).to.equal(testSchema.toUpperCase());
    //expect(tablesManagerFromTable.businessObject).to.equal(testBusinessObject);
    //expect(tablesManagerFromTable.tables).to.deep.equal([]);
    //expect(tablesManagerFromTables.schema).to.equal(testSchema.toUpperCase());
    //expect(tablesManagerFromTables.businessObject).to.equal(testBusinessObject);
    //expect(tablesManagerFromTables.tables).to.deep.equal([]);
  });

  describe('init', () => {
    it('should initialize with businessobject', (done) => {
      const taskArgs: TaskArgs = { businessobject: testBusinessObject, schema: testSchema.toUpperCase(), accesstype: testAccessType };
      const tablesResult = { success: true, tables: testTable };
  
      const tablesManager = new TablesManager(taskArgs);
      tablesManager.init(taskArgs)
        .then(() => {
          expect(tablesManager.businessObject).to.equal(taskArgs.businessobject);
          expect(tablesManager.schema).to.deep.equal(testSchema.toUpperCase());
          expect(tablesManager.tables.map((table) => table.tableName)).to.deep.equal(testTableArray);
          done();
        })
        .catch((error) => {
          done(error);
        });
    
      });
  

      it('should initialize with table', (done) => {
        const taskArgs: TaskArgs = { table: testTable[0].tableName, schema: testSchema, accesstype: testAccessType };
        const tablesResult = { success: true, tables: testTable };
      
        const tablesManager = new TablesManager(taskArgs);
        tablesManager.init(taskArgs)
          .then(() => {
            expect(tablesManager.businessObject).to.equal(null || undefined || '');
            expect(tablesManager.schema).to.deep.equal(testSchema.toUpperCase());
            expect(tablesManager.tables.map((table) => table.tableName)).to.deep.equal([testTable[0].tableName]);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should initialize with tables', (done) => {
        const taskArgs: TaskArgs = { table: testTables, schema: testSchema, accesstype: testAccessType };
        const tablesResult = { success: true, tables: testTable };
      
        const tablesManager = new TablesManager(taskArgs);
        tablesManager.init(taskArgs)
          .then(() => {
            expect(tablesManager.businessObject).to.equal(null || undefined || '');
            expect(tablesManager.schema).to.deep.equal(testSchema.toUpperCase());
            expect(tablesManager.tables.map((table) => table.tableName)).to.deep.equal(testTablesArray.map((table) => table.toUpperCase()));
            done();
          })
          .catch((error) => {
            done(error);
          });
        
      });
    });
  });
