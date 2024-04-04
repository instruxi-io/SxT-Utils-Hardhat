import { HardhatUserConfig, extendEnvironment } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { config as dotEnvConfig } from "dotenv";
import { extendHRE } from './hre-extension';
import { networks } from "./networks";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";
import "hardhat-contract-sizer";
import "./tasks/index";
import "@nomiclabs/hardhat-ethers";

dotEnvConfig();

const REPORT_GAS = process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false;

/*
const SOLC_SETTINGS = {
	optimizer: {
	  enabled: true,
	  runs: 1_000,
	},
  };
*/

const config: HardhatUserConfig = {
	solidity: '0.8.20',
	defaultNetwork: "localTestnet",
	meshUri: process.env.MESH_URI || '',
	meshApiKey: process.env.MESH_API_KEY || '',
	sxtUri: process.env.SXT_URI || '',
	sxtJoinCode: process.env.SXT_JOIN_CODE || '',
	sxtApiKey: process.env.SXT_API_KEY || '',
	sxtUserId: process.env.SXT_USER_ID || '',
	account: process.env.PRIVATE_KEY || '',
	networks: {
		...networks,
	  },
	etherscan: {
		apiKey: {
		  mainnet: networks.ethereum.verifyApiKey,
		  avalanche: networks.avalanche.verifyApiKey,
		  polygon: networks.polygon.verifyApiKey,
		  sepolia: networks.ethereumSepolia.verifyApiKey,
		  polygonMumbai: networks.polygonMumbai.verifyApiKey,
		  avalancheFujiTestnet: networks.avalancheFuji.verifyApiKey,
		  base: networks.base.verifyApiKey,
		  arbitrum: networks.arbitrum.verifyApiKey,
		},
	  },
	gasReporter: {
		enabled: REPORT_GAS,
		currency: "USD",
		outputFile: "gas-report.txt",
		noColors: true,
	  },
	  contractSizer: {
		runOnCompile: false,
		only: [],
	  },
	  paths: {
		sources: "./contracts",
		tests: "./test",
		cache: "./build/cache",
		artifacts: "./build/artifacts",
	  },
	  mocha: {
		timeout: 200000, // 200 seconds max for running tests
	  },
};

extendEnvironment((hre: HardhatRuntimeEnvironment) => {  
    const initParams = {
        hre, 
        meshUri: config.meshUri, 
        meshApiKey: config.meshApiKey, 
        sxtUri: config.sxtUri,
        sxtJoinCode: config.sxtJoinCode,
        sxtUserId: config.sxtUserId, 
        account: config.account
    };
    extendHRE(initParams);
});
export default config;