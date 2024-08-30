import { HardhatRuntimeEnvironment } from "hardhat/types";
import ClientManager from "./Client";
import TablesManager from "./Tables";
import SessionManager from "./Session";
import SchemaManager from "./Schema";

export interface View {
    schema: string;
    viewName: string;
    resourceIds: string[];
    biscuits?: {
        ddl?: string;
        dql?: string;
    };
    security?: {
        hexEncodedPublicKey: string;
        hexEncodedPrivateKey: string;
    };
}
  
export interface KeyPairEncodings {
    ED25519PublicKeyUint: Uint8Array;
    ED25519PrivateKeyUint: Uint8Array;
    b64PublicKey: string;
    b64PrivateKey: string;
    hexEncodedPublicKey: string;
    hexEncodedPrivateKey: string;
}

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
    outfile?: string;
    viewname?: string;
}

export interface ViewTaskArgs {
    schema: string;
    tables: string;
    viewname: string;
    viewtype: string;
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
export type EncryptActions = 'encrypt' | 'decrypt';

export type EncryptColumnOptions = 
  'NONE' | 
  'LIKE' | 
  'ASCII' | 
  'EASCII' | 
  'EBCDIC' | 
  'UNICODE' | 
  'NUMERIC' | 
  'NUMERIC_NONSTRICT' | 
  'NUMERICLP' |
  'MASK_DAY' |
  'MASK_DAY_RANDOM' |
  'MASK_MONTH' |
  'MASK_MONTH_DAY' |
  'MASK_YEAR' |
  'MASK_YEAR_MONTH' |
  'MASK_YEAR_DAY' |
  'MASK_FULL_DATE';

export type EncryptColumnTypes = 
  'DET' | 
  'FPE' | 
  'FPE_DAY' | 
  'FPE_TOKEN' | 
  'MASK' | 
  'OPE';

export interface EncryptionColumn {
  name: string;
  encType: EncryptColumnTypes;
  encOption: EncryptColumnOptions;
}

export interface EncryptionTable {
  resourceId: string;
  columns: EncryptionColumn[];
}

export interface EncryptionConfig {
  tables: EncryptionTable[];
  biscuits: string[];
}

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
    (tableManager: TablesManager, taskArgs?: TaskArgs): Promise<Result>;
}
  
export interface StagingActions {
    [key: string]: StagingAction;
}
  
interface SchemaAction {
    (hre: HardhatRuntimeEnvironment, schemaManager: SchemaManager, taskArgs: TaskArgs): Promise<SxTResult> | Promise<Result>;
}
  
export interface SchemaActions {
    [key: string]: SchemaAction;
}

export type ViewTypes = 'standard' | 'materialized' | 'parameterized';

export interface ViewTaskArgs extends TaskArgs {
  viewName: string;
  viewType: string;
}

export type ViewAction = (
  hre: HardhatRuntimeEnvironment,
  clientManager: ClientManager,
  taskArgs: ViewTaskArgs
) => Promise<SxTResult>;

export interface ViewActions {
  [key: string]: ViewAction;
}
