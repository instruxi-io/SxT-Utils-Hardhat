const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { error } = require('console');
const fs = require('fs');
const path = require('path');

const argv = yargs(hideBin(process.argv))
    .option('schema', {
        alias: 's',
        description: 'Provide the table schema',
        type: 'string',
        demandOption: true 
    })
    .option('table', {
        alias: 't',
        description: 'Provide the schema table name]',
        type: 'string',
        demandOption: true 
    })
    .option('force', {
        alias: 'f',
        description: 'Force overwrite of existing biscuit',
        type: 'boolean',
        default: false
    })
    .help()
    .alias('help', 'h')
    .argv;

    
async function main() {
    try {
        let BiscuitMaker;
        const module = await import('@instruxi-io/sxt-biscuit-maker');
        BiscuitMaker = module.default;

        const biscuits = BiscuitMaker.init();
        const table = argv.table.toUpperCase()
        const schema = argv.schema.toUpperCase()

        const schemaPath = path.join('schemas', schema.toLowerCase());
        const biscuitFilePath = path.join(schemaPath, '.secure', 'biscuits', `${table}.json`);
        const securityPath = path.join(schemaPath,'.secure', 'keys', `${table}.json`)
        const tableDefinitions = path.join(schemaPath, 'tables', `${table}.json`)
   
        if (fs.existsSync(!tableDefinitions)) {
            throw new Error(`Table definitions are required for biscuit production.\n npx hardhat sxt-utils:generateTableDefinitions --schema ${schema} --table ${table}`);
        } else if (fs.existsSync(biscuitFilePath) && !argv.force) {
            throw new Error(`Biscuit file already exists at ${biscuitFilePath}. Use the --force option to overwrite it.`);
        } else {
            await biscuits.generateTableBiscuits(schema + '.' + table, BiscuitMaker, securityPath)              
            fs.writeFileSync(biscuitFilePath, JSON.stringify(biscuits._biscuits, null, 2));
            console.log('Biscuits generated successfully for ' + table, 'to', biscuitFilePath);  
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
    
main();