import { config as envConfig } from "@chainlink/env-enc";
import dotenv from "dotenv";

envConfig();
dotenv.config();

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2;
const SHARED_DON_PUBLIC_KEY =
  "a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c";

const npmCommand = process.env.npm_lifecycle_event;
const isTestEnvironment = npmCommand === "test" || npmCommand === "test:unit";


const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SECOND_PRIVATE_KEY = process.env.SECOND_PRIVATE_KEY;

if (!isTestEnvironment && !PRIVATE_KEY) {
  throw Error("Set the PRIVATE_KEY environment variable with your EVM wallet private key");
}

const accounts: string[] = [];
if (PRIVATE_KEY) {
  accounts.push(PRIVATE_KEY);
}
if (SECOND_PRIVATE_KEY) {
  accounts.push(SECOND_PRIVATE_KEY);
}

interface NetworkConfig {
  url: string;
  gasPrice?: number;
  nonce?: number;
  accounts: string[];
  verifyApiKey: string;
  chainId: number;
  confirmations: number;
  nativeCurrencySymbol: string;
  linkToken: string;
  linkPriceFeed: string;
  nativeUSDPriceFeed: string;
  functionsRouter: string;
  donIdBytes: string;
  donId: string;
  gatewayUrls: string[];
}

interface Networks {
  ethereum: NetworkConfig;
  avalanche: NetworkConfig;
  polygon: NetworkConfig;
  ethereumSepolia: NetworkConfig;
  polygonMumbai: NetworkConfig;
  avalancheFuji: NetworkConfig;
  arbitrum: NetworkConfig;
  base: NetworkConfig;
  localTestnet: NetworkConfig;
  [key: string]: NetworkConfig;
}

const networks: Networks = {
  ethereum: {
    url: process.env.ETHEREUM_RPC_URL || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.ETHERSCAN_API_KEY || "UNSET",
    chainId: 1,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    linkToken: process.env.LINK_TOKEN_ADDRESS_ETHEREUM || "UNSET",
    linkPriceFeed: process.env.LINK_ETH_PRICE_FEED_ETHEREUM || "UNSET", // LINK/ETH
    nativeUSDPriceFeed: process.env.NATIVE_USD_PRICE_FEED_ETHEREUM || "UNSET",
    functionsRouter: process.env.FUNCTIONS_ORACLE_PROXY_ETHEREUM || "UNSET",
    donIdBytes: "0x66756e2d657468657265756d2d6d61696e6e65742d3100000000000000000000",
    donId: "fun-ethereum-mainnet-1",
    gatewayUrls: ["https://01.functions-gateway.chain.link/", "https://02.functions-gateway.chain.link/"],
  },
  avalanche: {
    url: process.env.AVALANCHE_RPC_URL || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    verifyApiKey: process.env.SNOWTRACE_API_KEY || "UNSET",
    chainId: 43114,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "AVAX",
    linkToken: process.env.LINK_TOKEN_ADDRESS_AVALANCHE || "UNSET",
    linkPriceFeed: process.env.LINK_ETH_PRICE_FEED_AVALANCHE || "UNSET", // LINK/AVAX
    nativeUSDPriceFeed: process.env.NATIVE_USD_PRICE_FEED_AVALANCHE || "UNSET",
    functionsRouter: process.env.FUNCTIONS_ORACLE_PROXY_AVALANCHE || "UNSET",
    donIdBytes: "0x66756e2d6176616c616e6368652d6d61696e6e65742d31000000000000000000",
    donId: "fun-avalanche-mainnet-1",
    gatewayUrls: ["https://01.functions-gateway.chain.link/", "https://02.functions-gateway.chain.link/"],
  },
  polygon: {
    url: process.env.POLYGON_RPC_URL || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.POLYGONSCAN_API_KEY || "UNSET",
    chainId: 137,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    linkToken: process.env.LINK_TOKEN_ADDRESS_POLYGON || "UNSET",
    linkPriceFeed: process.env.LINK_ETH_PRICE_FEED_POLYGON || "UNSET", // LINK/MATIC
    nativeUSDPriceFeed: process.env.NATIVE_USD_PRICE_FEED_POLYGON || "UNSET",
    functionsRouter: process.env.FUNCTIONS_ORACLE_PROXY_POLYGON || "UNSET",
    donIdBytes: "0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000",
    donId: "fun-polygon-mainnet-1",
    gatewayUrls: ["https://01.functions-gateway.chain.link/", "https://02.functions-gateway.chain.link/"],
  },
  ethereumSepolia: {
    url: process.env.ETHEREUM_SEPOLIA_RPC_URL || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.ETHERSCAN_API_KEY || "UNSET",
    chainId: 11155111,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    linkToken: process.env.LINK_TOKEN_ADDRESS_SEPOLIA || "UNSET",
    linkPriceFeed: process.env.LINK_ETH_PRICE_FEED_SEPOLIA || "UNSET", // LINK/ETH
    nativeUSDPriceFeed: process.env.NATIVE_USD_PRICE_FEED_SEPOLIA || "UNSET",
    functionsRouter: process.env.FUNCTIONS_ORACLE_PROXY_SEPOLIA || "UNSET",
    donIdBytes: "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000",
    donId: "fun-ethereum-sepolia-1",
    gatewayUrls: [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/",
    ],
  },
  polygonMumbai: {
    url: process.env.POLYGON_MUMBAI_RPC_URL || "UNSET",
    gasPrice: 20_000_000_000,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.POLYGONSCAN_API_KEY || "UNSET",
    chainId: 80001,
    confirmations: 10,
    nativeCurrencySymbol: "MATIC",
    linkToken: process.env.LINK_TOKEN_ADDRESS_MUMBAI || "UNSET",
    linkPriceFeed: process.env.LINK_ETH_PRICE_FEED_MUMBAI || "UNSET", // LINK/MATIC
    nativeUSDPriceFeed: process.env.NATIVE_USD_PRICE_FEED_MUMBAI || "UNSET",
    functionsRouter: process.env.FUNCTIONS_ORACLE_PROXY_MUMBAI || "UNSET",
    donIdBytes: "0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000",
    donId: "fun-polygon-mumbai-1",
    gatewayUrls: [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/",
    ],
  },
  avalancheFuji: {
    url: process.env.AVALANCHE_FUJI_RPC_URL || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    verifyApiKey: process.env.SNOWTRACE_API_KEY || "UNSET",
    chainId: 43113,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "AVAX",
    linkToken: process.env.LINK_TOKEN_ADDRESS_AVALANCHE || "UNSET",
    linkPriceFeed: process.env.LINK_TOKEN_ADDRESS_FUJI || "UNSET", // LINK/AVAX
    nativeUSDPriceFeed: process.env.NATIVE_USD_PRICE_FEED_FUJI || "UNSET",
    functionsRouter: process.env.FUNCTIONS_ORACLE_PROXY_FUJI || "UNSET",
    donIdBytes: "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000",
    donId: "fun-avalanche-fuji-1",
    gatewayUrls: [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/",
    ],
  },
  arbitrum: {
    url: process.env.ARBITRUM_RPC_URL || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    verifyApiKey: process.env.ARBISCAN_API_KEY || "UNSET",
    chainId: 43113,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    linkToken: process.env.LINK_TOKEN_ADDRESS_ARBITRUM || "UNSET",
    linkPriceFeed: process.env.LINK_ETH_PRICE_FEED_ARBITRUM || "UNSET", // LINK/ETH
    nativeUSDPriceFeed: process.env.NATIVE_USD_PRICE_FEED_ARBITRUM|| "UNSET",
    functionsRouter: process.env.FUNCTIONS_ORACLE_PROXY_ARBITRUM || "UNSET",
    donIdBytes: "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000",
    donId: "fun-arbitrum-mainnet-1",
    gatewayUrls: [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/",
    ],
  },
  base: {
    url: process.env.BASE_RPC_URL || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    verifyApiKey: process.env.ARBISCAN_API_KEY || "UNSET",
    chainId: 43113,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    linkToken: process.env.LINK_TOKEN_ADDRESS_BASE || "UNSET",
    linkPriceFeed: process.env.LINK_ETH_PRICE_FEED_BASE || "UNSET", // LINK/ETH
    nativeUSDPriceFeed: process.env.NATIVE_USD_PRICE_FEED_BASE || "UNSET",
    functionsRouter: process.env.FUNCTIONS_ORACLE_PROXY_BASE || "UNSET",
    donIdBytes: "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000",
    donId: "fun-base-mainnet-1",
    gatewayUrls: [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/",
    ],
  },
  localTestnet: {
    url: "http://localhost:8545/",
    gasPrice: 0,
    nonce: 0,
    accounts,
    verifyApiKey: "",
    chainId: 0,
    confirmations: 1,
    nativeCurrencySymbol: "ETH",
    linkToken: "0x94d3C68A91C972388d7863D25EDD2Be7e2F21F21",
    linkPriceFeed: "",
    nativeUSDPriceFeed: "",
    functionsRouter: "0xCbfD616baE0F13EFE0528c446184C9C0EAa8040e",
    donIdBytes: "",
    donId: "local-functions-testnet",
    gatewayUrls: [],
  },
};

export { networks };
