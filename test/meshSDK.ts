import { expect } from 'chai';
import { Wallet } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { initMeshSDK } from '../hre-extension'; 
import hre from 'hardhat'; 

describe('Init', () => {

  it('should call MeshSDK.init with correct arguments', () => {
    const provider = hre.ethers.provider;
    // well known private key for testing
    const signer = new hre.ethers.Wallet('b6b08906be38f1bb2148ff77738b079165d5b0ac78be875c914534bc9b44d88f', provider);
    const meshUri = 'https://gatway-staging.instruxi.dev';
    const meshApiKey = '';

    // Pass the real hre object to your function
    initMeshSDK(signer, meshUri, meshApiKey);
  });

});