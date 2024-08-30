import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import SchemaManager from "./Schema";
import ClientManager from "./Client";
import TablesManager from "./Tables";
import SessionManager from "./Session";
import { SchemaActions, TableActions, StagingActions, SessionActions, QueryActions, ViewActions, TaskArgs, ViewTaskArgs, ViewTypes, SxTResult } from './types';

const queryActions: QueryActions = {
  query: (hre: HardhatRuntimeEnvironment, clientManager: ClientManager) => clientManager.manageTableCustomDQL(hre),
};

for (const queryAction in queryActions) {
  task(`sxt-utils:${queryAction}Table`, `Perform ${queryAction} on the proposed tables`)
    .addParam("schema", "The schema to process")
    .addParam("query", "The name of the user defined query to execute", '', types.string)
    .addParam("table", "The table references in the query", '', types.string)
    .addOptionalParam("outfile", "The file to output DQL results", '', types.string)
    .setAction(async (taskArgs: TaskArgs, hre: HardhatRuntimeEnvironment) => {
      const tableManager = new TablesManager(taskArgs);
      await tableManager.init(taskArgs);
      const clientManager = new ClientManager(tableManager)
      await queryActions[queryAction](hre, clientManager);
  });
}

const tableActions: TableActions = {
  create: (hre: HardhatRuntimeEnvironment, clientManager: ClientManager) => clientManager.manageTableDDL(hre, 'create'),
  drop: (hre: HardhatRuntimeEnvironment, clientManager: ClientManager) => clientManager.manageTableDDL(hre, 'drop'),
  insertInto: (hre: HardhatRuntimeEnvironment, clientManager: ClientManager) => clientManager.manageTableDML(hre, 'insert'),
  deleteFrom: (hre: HardhatRuntimeEnvironment, clientManager: ClientManager) => clientManager.manageTableDML(hre, 'delete'),
  update: (hre: HardhatRuntimeEnvironment, clientManager: ClientManager) => clientManager.manageTableDML(hre, 'update'),
  preview: (hre: HardhatRuntimeEnvironment, clientManager: ClientManager) => clientManager.manageTablePreviewDQL(hre),
  // encrypt: (hre: HardhatRuntimeEnvironment, clientManager: ClientManager) => clientManager.manageEncryptTable(hre),
};

for (const tableAction in tableActions) {
  task(`sxt-utils:${tableAction}Table`, `Perform ${tableAction} on the proposed tables`)
    .addParam("schema", "The schema to process")
    .addOptionalParam("table", "The table to process. If not provided, all tables will be processed")
    .addOptionalParam("businessobject", "The business object to process. If not provided, all tables will be processed")
    .addOptionalParam("accesstype", "The access type for the table. Can be either 'permissioned' or 'public_read'. Defaults to permissioned", 'permissioned', types.string)
    .addOptionalParam("outfile", "The file to output DQL results", '', types.string)
    .setAction(async (taskArgs: TaskArgs, hre: HardhatRuntimeEnvironment) => {
      if (!taskArgs.table && !taskArgs.businessobject) {
        throw new Error("Table(s) must be provided using the --businessobject or --table argument");
      }
      const tableManager = new TablesManager(taskArgs);
      await tableManager.init(taskArgs);
      const clientManager = new ClientManager(tableManager)
      const result = await tableActions[tableAction](hre, clientManager);
      for (const message of result) {
        console.log(message.message);
      }
  });
}

const stagingActions: StagingActions = {
  saveTableSecurity: async (tableManager: TablesManager) => await tableManager.saveTableSecurity(tableManager.force),
  saveViewSecurity: async (tableManager: TablesManager, taskArgs?: TaskArgs) => {
    if (!taskArgs || !taskArgs.viewname) {
      throw new Error("View name is required for saveViewSecurity action");
    }
    return await tableManager.saveViewSecurity(taskArgs.viewname, taskArgs.force);
  },
  saveTableDefinitions: async (tableManager: TablesManager) => await tableManager.saveTableDefinitions(tableManager.force),
  saveTableDQL: async (tableManager: TablesManager) => await tableManager.saveSQLTemplates('dql', tableManager.force),
  saveTableDML: async (tableManager: TablesManager) => await tableManager.saveSQLTemplates('dml', tableManager.force),
  saveTableDDL: async (tableManager: TablesManager) => await tableManager.saveSQLTemplates('ddl', tableManager.force),
};

for (const stagingAction in stagingActions) {
  task(`sxt-utils:${stagingAction}`, `Generating table-level ${stagingAction} artifacts for the proposed tables`)
    .addParam("schema", "The schema to process")
    .addOptionalParam("businessobject", "The business object to process.")
    .addOptionalParam("table", "The table to process.")
    .addOptionalParam("viewname", "The view to process")
    .addOptionalParam("accesstype", "Can be either 'permissioned' or 'public_read'. Defaults to permissioned", 'permissioned', types.string)
    .addOptionalParam("force", "Overwrite the existing table definitions if persist is true", false, types.boolean)
    .setAction(async (taskArgs: TaskArgs, hre: HardhatRuntimeEnvironment) => {
      if (!taskArgs.viewname && !taskArgs.table && !taskArgs.businessobject) {
        throw new Error("Either viewname, table, or businessobject must be provided");
      }

      const tableManager = new TablesManager(taskArgs);
      await tableManager.init(taskArgs);

      if (stagingAction === 'saveViewSecurity' && !taskArgs.viewname) {
        throw new Error("viewname is required for saveViewSecurity action");
      }

      await stagingActions[stagingAction](tableManager, taskArgs);
    });
}
 
const schemaActions: SchemaActions = {
  create: async (hre: HardhatRuntimeEnvironment, schemaManager: SchemaManager, taskArgs) => await schemaManager.manageSchemaDDL(hre, taskArgs, 'create'),
  drop: async (hre: HardhatRuntimeEnvironment, schemaManager: SchemaManager, taskArgs) => await schemaManager.manageSchemaDDL(hre, taskArgs, 'drop'),
  init: async (hre: HardhatRuntimeEnvironment, schemaManager: SchemaManager, taskArgs) => await schemaManager.initSchema(taskArgs),
  backup: async (hre: HardhatRuntimeEnvironment, schemaManager: SchemaManager, taskArgs) => await schemaManager.backupSchema(taskArgs),
};

for (const schemaAction in schemaActions) {
  task(`sxt-utils:${schemaAction}Schema`, `Perform ${schemaAction} on the proposed schema`)
    .addParam("schema", "The schema to process")
    .addOptionalParam("force", "Overwrite existing files", false, types.boolean)
    .addOptionalParam("format", "The format of the backup archive (zip, tar)", 'zip', types.string)
    .setAction(async (taskArgs: TaskArgs, hre: HardhatRuntimeEnvironment) => {
      try {
        const schemaManager = new SchemaManager();
        let schemaActionStatus  = await schemaActions[schemaAction](hre, schemaManager, taskArgs);
        console.log(schemaActionStatus.message);
      } catch (error) {
        throw new Error(`${(error as Error).message}`);
      }
    });
}

const sessionManager = new SessionManager();

const sessionActions: SessionActions = {
  login: async (hre, taskArgs) => await sessionManager.login(hre, taskArgs),
};

for (const sessionAction in sessionActions) {
  task(`sxt-utils:${sessionAction}`, `Performing session ${sessionAction}`)
    .setAction(async (taskArgs: TaskArgs, hre: HardhatRuntimeEnvironment) => {
      try {
        let sessionActionStatus = await sessionActions[sessionAction](hre, taskArgs);
        console.log(sessionActionStatus.message);
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
      }
  });
}

function validateViewType(viewType: string): ViewTypes {
  if (viewType === 'standard' || viewType === 'materialized' || viewType === 'parameterized') {
    return viewType;
  }
  throw new Error(`Invalid view type: ${viewType}. Must be 'standard', 'materialized', or 'parameterized'.`);
}

const viewActions: ViewActions = {
  createView: async (hre: HardhatRuntimeEnvironment, clientManager: ClientManager, taskArgs: ViewTaskArgs): Promise<SxTResult> => await clientManager.manageView(hre, 'create', taskArgs.viewname, validateViewType(taskArgs.viewtype)),
  dropView: async (hre: HardhatRuntimeEnvironment, clientManager: ClientManager, taskArgs: ViewTaskArgs): Promise<SxTResult> => await clientManager.manageView(hre, 'drop', taskArgs.viewname, validateViewType(taskArgs.viewtype)),
  refreshMaterializedView: async (hre: HardhatRuntimeEnvironment, clientManager: ClientManager, taskArgs: ViewTaskArgs): Promise<SxTResult> => await clientManager.refreshMaterializedView(hre, taskArgs.viewname),
  getLastRefreshTime: async (hre: HardhatRuntimeEnvironment, clientManager: ClientManager, taskArgs: ViewTaskArgs): Promise<SxTResult> => await clientManager.getLastRefreshTime(hre, taskArgs.viewname),
  queryView: async (hre: HardhatRuntimeEnvironment, clientManager: ClientManager, taskArgs: ViewTaskArgs): Promise<SxTResult> => await clientManager.manageViewDQL(hre, taskArgs.viewname, validateViewType(taskArgs.viewtype)),
};

for (const viewAction in viewActions) {
  task(`sxt-utils:${viewAction}`, `Perform ${viewAction} operation`)
    .addParam("schema", "The schema to process")
    .addOptionalParam("businessobject", "The business object to process.")
    .addOptionalParam("table", "The table to process.")
    .addParam("viewname", "The name of the view to process")
    .addOptionalParam("viewtype", "The type of view (standard, materialized, parameterized)", 'standard', types.string)
    .setAction(async (taskArgs: ViewTaskArgs, hre: HardhatRuntimeEnvironment) => {
      const tableManager = new TablesManager(taskArgs);
      await tableManager.init(taskArgs);
      const clientManager = new ClientManager(tableManager);
      try {
        const result = await viewActions[viewAction](hre, clientManager, taskArgs);
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
      }
    });
}

export default {};