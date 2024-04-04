import fs from 'fs';
import path from 'path';
import { Result, TablesResult, Records } from '../types'; 
import { Format } from 'archiver';

function isFormat(format: string): format is Format {
  return format === 'zip' || format === 'tar';
}

function handleError(error: any): Result {
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  return { success: false, message };
}

function handleTableErrors(error: any): TablesResult {
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  return { success: false, message, tables: [] };
}

// Utility function to write files
function writeFile(path: string, content: string, force: boolean): void {
  if (fs.existsSync(path)) {
    if (!force) {
      console.log(`\nFile ${path} already exists. Use force option to overwrite.\n`);
      return;
    }
    console.log(`Overwriting existing file ${path}`);
  } else {
    console.log(`\nCreating new file ${path}`);
  }
  
  fs.writeFileSync(path, content);
}

// Utility function to create file paths
function createPath(...segments: string[]): string {
  return path.join(...segments);
}

function getSchemaDir(schema: string): string {
  // Convert schema to lowercase and replace hyphens with underscores
  schema = schema.toLowerCase().replace(/-/g, '_');

  // Check if schema contains only alphanumeric characters and underscores
  if (!/^[_a-z0-9]+$/.test(schema)) {
    console.error(`Invalid schema name. It must contain only alphanumeric characters and underscores.`);
    process.exit(1);
  }

  return path.join('schemas', schema);
}

const checkSchemaDirExists = async (schemaDir: string): Promise<Result> => {
  if (!fs.existsSync(schemaDir)) {
    return { success: false, message: `Schema directory ${schemaDir} does not exist. Please initialize it first.` };
  }
  return { success: true, message: 'Schema directory exists.' };
};

const getRecordsFromDataLocation = async (table: string, operation: 'insert' | 'delete' | 'update', dataLocation?: string): Promise<Records> => {
  const defaultPath = dataLocation || `data/${operation}/${table.toUpperCase()}.json`;
  try {
    const data = fs.readFileSync(defaultPath, 'utf8');
    const records: Records = JSON.parse(data);
    console.log(`DML ${operation} - Found ${records.length} records at ${defaultPath}`);
    return records;
  } catch (error) {
    return [];
  }
}

const Utils = { 
  createPath, 
  writeFile,
  handleError,
  isFormat,
  getSchemaDir,
  checkSchemaDirExists,
  handleTableErrors,
  getRecordsFromDataLocation
};

export default Utils;