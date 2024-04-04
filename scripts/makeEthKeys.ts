import { ethers } from 'ethers';
import * as fs from 'fs';

async function main() {
    try {
        const wallet = ethers.Wallet.createRandom();
        const publicKey = wallet.address;
        const privateKey = wallet.privateKey;
        const content = `PUBLIC_KEY=${publicKey}\nPRIVATE_KEY=${privateKey}\n`;
        if (fs.existsSync('dev.env')) {
            throw new Error('dev.env file already exists.');
        }
        fs.writeFileSync('dev.env', content);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();