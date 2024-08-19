const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const argv = yargs(hideBin(process.argv))
    .option('schema', {
        alias: 's',
        description: 'Provide the table schema',
        type: 'string',
        demandOption: true 
    })
    .option('table', {
        alias: 't',
        description: 'Provide the schema table name',
        type: 'string',
        demandOption: false 
    })
    .option('force', {
        alias: 'f',
        description: 'Force overwrite of existing biscuit(s). Use "all" to process all tables.',
        type: 'string',
        default: 'false'
    })
    .help()
    .alias('help', 'h')
    .argv;

function generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
}

async function processSingleTable(BiscuitMaker, schema, table) {
    const schemaPath = path.join('schemas', schema.toLowerCase());
    const biscuitFilePath = path.join(schemaPath, '.secure', 'biscuits', `${table}.json`);
    const securityPath = path.join(schemaPath, '.secure', 'keys', `${table}.json`);
    const tableDefinitions = path.join(schemaPath, 'tables', `${table}.json`);

    if (!fs.existsSync(tableDefinitions)) {
        console.log(`Table definitions not found for ${table}. Skipping.`);
        return;
    }

    // Create directories if they don't exist
    fs.mkdirSync(path.dirname(biscuitFilePath), { recursive: true });
    fs.mkdirSync(path.dirname(securityPath), { recursive: true });

    // Check if the key file exists, if not, generate and save it
    if (!fs.existsSync(securityPath)) {
        console.log(`Key file not found. Generating new key pair for ${table}...`);
        const { privateKey, publicKey } = generateKeyPair();
        const keyData = {
            privateKey: privateKey,
            publicKey: publicKey
        };
        fs.writeFileSync(securityPath, JSON.stringify(keyData, null, 2));
        console.log(`Key pair generated and saved to ${securityPath}`);
    }

    const biscuits = BiscuitMaker.init();
    await biscuits.generateTableBiscuits(schema + '.' + table, BiscuitMaker, securityPath);
    fs.writeFileSync(biscuitFilePath, JSON.stringify(biscuits._biscuits, null, 2));
    console.log(`Biscuits generated successfully for ${table} to ${biscuitFilePath}`);
}

async function main() {
    try {
        let BiscuitMaker;
        const module = await import('@instruxi-io/sxt-biscuit-maker');
        BiscuitMaker = module.default;

        const schema = argv.schema.toUpperCase();
        const schemaPath = path.join('schemas', schema.toLowerCase());

        if (argv.force === 'all') {
            const tablesDir = path.join(schemaPath, 'tables');
            const tableFiles = fs.readdirSync(tablesDir).filter(file => file.endsWith('.json'));
            
            for (const tableFile of tableFiles) {
                const table = path.basename(tableFile, '.json').toUpperCase();
                await processSingleTable(BiscuitMaker, schema, table);
            }
        } else {
            if (!argv.table) {
                throw new Error('Table name is required when not using --force all');
            }
            const table = argv.table.toUpperCase();
            await processSingleTable(BiscuitMaker, schema, table);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
