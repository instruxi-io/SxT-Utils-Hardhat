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

const SOLC_SETTINGS = {
    optimizer: {
      enabled: true,
      runs: 100000,
    },
};

const config: HardhatUserConfig = {
	solidity: {
        version: '0.8.20',
        settings: SOLC_SETTINGS,
    },
	sourcify: {
		enabled: false,
		apiUrl: "https://sourcify.dev/server",
		browserUrl: "https://repo.sourcify.dev",
	},
	defaultNetwork: "localTestnet",
	meshUri: process.env.MESH_URI || '',
	meshApiKey: process.env.MESH_API_KEY || '',
	sxtUri: process.env.SXT_URI || '',
	sxtJoinCode: process.env.SXT_JOIN_CODE || '',
	sxtApiKey: process.env.SXT_API_KEY || '',
	sxtUserId: process.env.SXT_USER_ID || '',
	account: process.env.PRIVATE_KEY || '',
	version: process.env.MESH_VERSION || '',
	networks: {
		...networks,
	  },
	etherscan: {
		apiKey: {
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
        account: config.account,
		version: config.version
    };
    extendHRE(initParams);
});
export default config;