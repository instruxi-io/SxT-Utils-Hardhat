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

async function main() {
    try {
        let BiscuitMaker;
        const module = await import('@instruxi-io/sxt-biscuit-maker');
        BiscuitMaker = module.default;

        const biscuits = BiscuitMaker.init();
        const table = argv.table.toUpperCase();
        const schema = argv.schema.toUpperCase();

        const schemaPath = path.join('schemas', schema.toLowerCase());
        const biscuitFilePath = path.join(schemaPath, '.secure', 'biscuits', `${table}.json`);
        const securityPath = path.join(schemaPath, '.secure', 'keys', `${table}.json`);
        const tableDefinitions = path.join(schemaPath, 'tables', `${table}.json`);

        if (!fs.existsSync(tableDefinitions)) {
            throw new Error(`Table definitions are required for biscuit production.\n npx hardhat sxt-utils:saveTableDefinitions --schema ${schema} --table ${table}`);
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

        if (fs.existsSync(biscuitFilePath) && !argv.force) {
            throw new Error(`Biscuit file already exists at ${biscuitFilePath}. Use the --force option to overwrite it.`);
        }

        await biscuits.generateTableBiscuits(schema + '.' + table, BiscuitMaker, securityPath);
        fs.writeFileSync(biscuitFilePath, JSON.stringify(biscuits._biscuits, null, 2));
        console.log('Biscuits generated successfully for ' + table, 'to', biscuitFilePath);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
