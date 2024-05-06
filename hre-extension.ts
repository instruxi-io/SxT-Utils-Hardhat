import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { SpaceAndTimeSDK, SessionData} from '@instruxi-io/sxt-typescript-sdk';
import { Wallet } from "ethers";
import { writeFileSync, readFileSync, existsSync } from 'fs';

export type SxTSDKInstance = ReturnType<typeof SpaceAndTimeSDK.init>;


declare module 'hardhat/types/config' {
    interface HardhatUserConfig {
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
        sxtSDK: SxTSDKInstance;
    }
}

class SDKInitializationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'SDKInitializationError';
    }
}

export function initSxTSDK(
    signer: InstanceType<typeof Wallet>,
    sxtUri: string,
    sxtUserId: string,
    sxtJoinCode: string
): SxTSDKInstance {
    try {
        let session: SessionData;
        const sessionFilePath = 'tmp/session.json';
        if (existsSync(sessionFilePath)) {
            session = JSON.parse(readFileSync(sessionFilePath, 'utf8'));
        } else {
            session = {accessToken: '', refreshToken: '', accessTokenExpires: 0, refreshTokenExpires: 0};
            writeFileSync(sessionFilePath, JSON.stringify(session), 'utf8');
        }
        const sdkParams = {
            signer: signer,
            baseUrl: sxtUri,
            userId: sxtUserId,
            joinCode: sxtJoinCode,
            scheme: '1',
            session: session
        };
        return SpaceAndTimeSDK.init(sdkParams);
    } catch (error) {
        console.error("Failed to initialize the SxT SDK:", error);
        throw new SDKInitializationError("SxT SDK initialization failed");
    }
}

export function extendHRE(params: {
    hre: HardhatRuntimeEnvironment, 
    sxtUri: string,
    sxtJoinCode: string,
    sxtUserId: string, 
    account: string,
    version: string
}
): void {
    const { hre, sxtUri, sxtJoinCode, sxtUserId, account, version } = params;
    try {
        const provider = hre.ethers.provider;
        const signer = new hre.ethers.Wallet(account, provider);
        hre.sxtSDK = initSxTSDK(signer, sxtUri, sxtUserId, sxtJoinCode);
    } catch (error) {
        console.error('An error occurred during Extend HRE:', error);
        throw new Error("Extend HRE failed");
    }
}
