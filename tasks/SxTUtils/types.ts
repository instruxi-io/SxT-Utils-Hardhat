import { HardhatRuntimeEnvironment } from "hardhat/types";
import ClientManager from "./Client";
import TablesManager from "./Tables";

export interface RenderSQLResult {
    success: boolean;
    sql: string | null; 
    message: string;
}

export interface SxTResult {
    success: boolean;
    sql: string | null;
    message: string;
    records?: Array<{[key: string]: any}> | null; 
  }
  
export interface TaskArgs {
    schema: string;
    table?: string;
    resourceid?: string;
    accesstype?: string;
    businessobject?: string;
    location?: string;
    force?: boolean;
    format?: string;
    persist?: boolean;
    query?: string;
    outfile?: string
}

export interface QueryTaskArgs {
    schema: string;
    tables: string;
    query: string;
}

export interface Result {
    success: boolean;
    message: string;
}

export interface TablesResult {
    success: boolean;
    message: string;
    tables: Table[];
}

export type Directories = string[][];

export interface Column {
    columnName: string;
    columnType: string;
    columnAttributes: string[];
  }

export interface IndexColumn {
    value: string;
}
  
export interface Index {
    name: string;
    columns: IndexColumn[];
}

export interface Security {
    ED25519PublicKeyUint: { [key: string]: number };
    ED25519PrivateKeyUint: { [key: string]: number };
    b64PublicKey: string;
    b64PrivateKey: string;
    hexEncodedPublicKey: string;
    hexEncodedPrivateKey: string;
}

export interface Biscuits {
    dml: string;
    ddl: string;
    dql: string;
    admin: string;
    wildcard: string;
} 

export interface Table {
    schema: string;
    tableName: string;
    resourceId: string;
    accessType: string;
    columns: Column[];
    primaryKeys: string[];
    indexes: Index[];
    biscuits?: Biscuits | null;
    security?: Security | null;
}
  
export interface Record {
    [key: string]: string | number | boolean;
}

export type Records = Record[];

export type DMLActions = 'insert' | 'delete' | 'update';
export type DDLActions = 'create' | 'drop' | 'index';
export type DQLActions = 'preview' | 'custom';

export interface ColumnMapping {
    originKey: string;
    destColumn?: string;
    dataType: string;
}
  
export interface TableMapping {
    originPath: string;
    targetTable: string;
    isArray?: boolean;
    columnMapping: ColumnMapping[];
}

export interface PromptResponse {
    input: string;
}

interface SessionAction {
    (hre: HardhatRuntimeEnvironment, taskArgs: TaskArgs): Promise<Result>;
}
  
export interface SessionActions {
    [key: string]: SessionAction;
}
  
interface TableAction {
    (hre: HardhatRuntimeEnvironment, clientManager: ClientManager): Promise<SxTResult[]>;
}
  
export interface TableActions {
    [key: string]: TableAction;
}

interface QueryAction {
    (hre: HardhatRuntimeEnvironment, clientManager: ClientManager): Promise<SxTResult>;
}
  
export interface QueryActions {
    [key: string]: QueryAction;
}
  
interface StagingAction {
    (tableManager: TablesManager): Promise<Result>;
}
  
export interface StagingActions {
    [key: string]: StagingAction;
}
  
interface SchemaAction {
    (hre: HardhatRuntimeEnvironment, taskArgs: TaskArgs): Promise<SxTResult> | Promise<Result>;
}
  
export interface SchemaActions {
    [key: string]: SchemaAction;
}