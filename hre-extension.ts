import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { MeshSDK } from '@instruxi-io/mesh-sdk-core';
import { SpaceAndTimeSDK, SessionData} from 'SpaceAndTimeSDK';
import { Wallet } from "ethers";
import fs from 'fs';

export type MeshSDKInstance = ReturnType<typeof MeshSDK.init>;
export type SxTSDKInstance = ReturnType<typeof SpaceAndTimeSDK.init>;


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
        meshSDK: MeshSDKInstance;
        sxtSDK: SxTSDKInstance;
    }
}

class SDKInitializationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'SDKInitializationError';
    }
}
  
export function initMeshSDK(
    signer: InstanceType<typeof Wallet>,
    meshUri: string,
    meshApiKey: string,
    version: string
): MeshSDKInstance {
    try {
        const sdkParams = {
            apiUri: meshUri,
            apiKey: meshApiKey,
            version: version,
            signer: signer
        };
        return MeshSDK.init(sdkParams);
    } catch (error) {
        console.error("Failed to initialize the Mesh SDK:", error);
        throw new SDKInitializationError("SxT SDK initialization failed");
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
        if (fs.existsSync('tmp/session.json')) {
            session = JSON.parse(fs.readFileSync('tmp/session.json', 'utf8'));
        } else {
            session = {accessToken: '', refreshToken: '', accessTokenExpires: 0, refreshTokenExpires: 0};
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
    meshUri: string, 
    meshApiKey: string, 
    sxtUri: string,
    sxtJoinCode: string,
    sxtUserId: string, 
    account: string,
    version: string
}
): void {
    const { hre, meshUri, meshApiKey, sxtUri, sxtJoinCode, sxtUserId, account, version } = params;
    try {
        const provider = hre.ethers.provider;
        const signer = new hre.ethers.Wallet(account, provider);
        hre.meshSDK = initMeshSDK(signer, meshUri, meshApiKey, version);
        hre.sxtSDK = initSxTSDK(signer, sxtUri, sxtUserId, sxtJoinCode);
    } catch (error) {
        console.error('An error occurred during Extend HRE:', error);
        throw new Error("Extend HRE failed");
    }
}