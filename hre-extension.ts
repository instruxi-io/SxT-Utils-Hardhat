import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { SpaceAndTimeSDK, SessionData, MinimalSigner} from '@instruxi-io/sxt-typescript-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { createWalletClient, http, createPublicClient, Chain, PublicClient, WalletClient } from 'viem';

export type SxTSDKInstance = SpaceAndTimeSDK;

declare module 'hardhat/types/config' {
    interface HardhatUserConfig {
        meshUri: string;
        meshApiKey: string;
        sxtUri: string;
        sxtJoinCode: string;
        sxtUserId: string;
        sxtApiKey: string;
        account: string;
        version: string;
        sourcify: any;
    }
}

declare module 'hardhat/types/runtime' {
    interface HardhatRuntimeEnvironment {
        sxtSDK: SxTSDKInstance;  // No Promise wrapper
    }
}

class SDKInitializationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SDKInitializationError';
    }
}

async function createUnifiedClient(privateKey: string, chain: Chain = sepolia): Promise<MinimalSigner> {
    const viemAccount = privateKeyToAccount(`0x${privateKey}`);
    
    const publicClient = createPublicClient({
        chain,
        transport: http()
    }) as PublicClient & { readContract: any };
    
    const walletClient = createWalletClient({
        account: viemAccount,
        chain,
        transport: http()
    }) as WalletClient & { chain: Chain };
    
    return {
        getAddress: async () => viemAccount.address,
        signMessage: async (message: string) => {
            return await walletClient.signMessage({
                message,
                account: viemAccount
            });
        }
    };
}

export async function initSxTSDK(
    unifiedClient: MinimalSigner,
    sxtUri: string,
    sxtUserId: string,
    sxtJoinCode: string
): Promise<SxTSDKInstance> { 
    try {
        let session: SessionData;
        const sessionFilePath = 'tmp/session.json';
        if (existsSync(sessionFilePath)) {
            session = JSON.parse(readFileSync(sessionFilePath, 'utf8'));
        } else {
            session = {
                accessToken: '',
                refreshToken: '',
                accessTokenExpires: 0,
                refreshTokenExpires: 0
            };
            mkdirSync('tmp', { recursive: true });
            writeFileSync(sessionFilePath, JSON.stringify(session), 'utf8');
        }
        
        const sdkParams = {
            signer: unifiedClient,
            baseUrl: sxtUri,
            userId: sxtUserId,
            joinCode: sxtJoinCode,
            scheme: '1',
            authType: 'user',
            session: session
        };
        return SpaceAndTimeSDK.init(sdkParams);
    } catch (error) {
        console.error("Failed to initialize the SxT SDK:", error);
        throw new SDKInitializationError("SxT SDK initialization failed");
    }
}

export async function extendHRE(params: {
    hre: HardhatRuntimeEnvironment, 
    sxtUri: string,
    sxtJoinCode: string,
    sxtUserId: string, 
    account: string,
    version: string
}): Promise<void> {
    const { hre, sxtUri, sxtJoinCode, sxtUserId, account, version } = params;
    try {
        const unifiedClient = await createUnifiedClient(account);
        hre.sxtSDK = await initSxTSDK(unifiedClient, sxtUri, sxtUserId, sxtJoinCode);
    } catch (error) {
        console.error('An error occurred during Extend HRE:', error);
        throw new Error("Extend HRE failed");
    }
}