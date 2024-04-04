import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EthersHelpers } from "@nomiclabs/hardhat-ethers/types";
import { MeshSDK } from '@instruxi-io/mesh-sdk-core';
import { SpaceAndTimeSDK } from 'SpaceAndTimeSDK';

declare module 'BiscuitMaker';
declare module "@openzeppelin/test-helpers"
declare module "solidity-coverage"

// not convinced this is making any effect
declare module "hardhat/types" {
  export interface HardhatRuntimeEnvironment {
    ethers: EthersHelpers;
    meshSDK: MeshSDK;
    sxtSDK: SxTSDK;
  }
}