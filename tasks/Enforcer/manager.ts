import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EnforcerTaskArgs, Result } from "./types";
import { getInput } from '../utils';
import ora from 'ora';

async function requestNonce(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const spinner = ora('Requesting nonce...').start();
  try {
    const signers = await hre.ethers.getSigners();
    const signerAddress = await signers[0].getAddress();
    const nonce = await hre.meshSDK.enforcer.requestNonce(signerAddress);
    spinner.succeed(`Nonce received: ${nonce.nonce}`);
    return { success: true, message: nonce.nonce };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

async function invalidateNonce(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const spinner = ora('Invalidating nonce...').start();
  try {
    const signers = await hre.ethers.getSigners();
    const signerAddress = await signers[0].getAddress();
    const nonce = await hre.meshSDK.enforcer.invalidateNonce(signerAddress);
    spinner.succeed(`New nonce received: ${nonce.nonce}`);
    return { success: true, message: nonce.nonce };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

async function accountDetail(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const spinner = ora('Getting account details...').start();
  try {
    const account = await hre.meshSDK.enforcer.accountDetail();
    spinner.succeed(`Account detail: ${JSON.stringify(account, null, 2)}`);
    return { success: true, message: account };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

// Release 1.1.0
/*
async function authorize(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  try {
    const signers = await hre.ethers.getSigners();
    const signerAddress = await signers[0].getAddress();
    console.log(`Signer Address: ${signerAddress}`);

    if (!chainId || !policy){
      throw new Error("Missing required parameters for the authorize action");
    }

    const authorizeTxn = await hre.meshSDK.enforcer.authorize(chainId, policy);
    console.log("Authorized:", authorzieTxn);

    return { success: true, message: '' };
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}
*/

async function registerAccount(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const username = taskArgs.username || await getInput("username", "Enter your preferred username");
  const email = taskArgs.email || await getInput("email", "Enter the email address you want to use for your account");
  const tenantCode = taskArgs.tenantcode || await getInput("tenantcode", "Enter the tenantcode provided by your Mesh API administrator");
  const spinner = ora(`Registering account...`).start();
  try {
    const signers = await hre.ethers.getSigners();
    const signerAddress = await signers[0].getAddress();
    const signature = await signers[0].signMessage(email);
    const registration = await hre.meshSDK.enforcer.registerAccount(username, email, signerAddress, signature, tenantCode);
    spinner.succeed(`Account details: ${registration}`);
    return { success: true, message: 'Check for activation email to retrieve your first API KEY' };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

async function createAPIKey(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> { 
  const spinner = ora('Creating API key...').start();
  try {
    const apiKey = await hre.meshSDK.enforcer.createAPIKey();
    console.log("API Key Created:", apiKey);
    spinner.succeed('API Key created successfully');
    return { success: true, message: apiKey };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

async function deleteAPIKey(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const apiKey = taskArgs.apikey || await getInput("apikey", "Enter the api key you want to delete");
  const spinner = ora('Deleting API key...').start();
  try {
    const deleteApiKey = await hre.meshSDK.enforcer.deleteAPIKey(apiKey);
    spinner.succeed(`API key deleted: ${deleteApiKey}`);
    return { success: true, message: deleteApiKey };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

async function deactivateAPIKey(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const apiKey = taskArgs.apikey || await getInput("apikey", "Enter the api key you want to delete");
  const spinner = ora('Deactivating API key...').start();
  try {
    const deactivateAPIKey = await hre.meshSDK.enforcer.deactivateAPIKey(apiKey);
    spinner.succeed(`API key deactivated: ${deactivateAPIKey}`);
    return { success: true, message: deactivateAPIKey };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

async function activateAPIKey(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const apiKey = taskArgs.apikey || await getInput("apikey", "Enter the api key you want to activate");
  const spinner = ora('Activating API key...').start();
  try {
    const activateAPIKey = await hre.meshSDK.enforcer.activateAPIKey(apiKey);
    spinner.succeed(`API key activated: ${activateAPIKey}`);
    return { success: true, message: activateAPIKey };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

async function accountAPIKeys(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const spinner = ora('Getting account API keys...').start();
  try {
    const apiKeys = await hre.meshSDK.enforcer.accountAPIKeys();
    spinner.succeed(`API keys: ${JSON.stringify(apiKeys, null, 2)}`);
    return { success: true, message: apiKeys };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

async function signEthMessage(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const challenge = taskArgs.message || taskArgs.nonce || await getInput("message", "Enter the challenge to sign");
  const spinner = ora('Creating API Key...').start();
  try {
    const signers = await hre.ethers.getSigners();
    const signerAddress = await signers[0].getAddress();
    console.log(`Signer address: ${signerAddress}`);
    const signEthMsgTxn = await signers[0].signMessage(challenge);;
    const messageHash = hre.ethers.utils.hashMessage(challenge);
    const recoveredAddress = hre.ethers.utils.recoverAddress(messageHash, signEthMsgTxn);
    spinner.succeed(`Recovered address: ${recoveredAddress}`);
    return { success: true, message: signEthMsgTxn };
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

const enforcerActionDescriptions: { [key: string]: string } = {
  requestNonce: "Requests a nonce for the HRE signer. No parameters required.",
  invalidateNonce: "Invalidates the HRE signer's latest nonce challenge.  Any signatures generated using the retired nonce will be invalidated. No parameters required.",
  registerAccount: "Registers an account with a Mesh API Gateway. Requires 'email', 'username', and 'tenantcode'.",
  createAPIKey: "Creates an API key. Requires 'tenantid' that must be provided by the Mesh API administrator.",
  deleteAPIKey: "Deletes the specified API key. Requires 'apikey'.",
  deactivateAPIKey: "Deactivates an API key. Requires 'apikey'.",
  activateAPIKey: "Activates an API key. Requires 'apikey'.",
  accountAPIKeys: "Gets account API keys. No specific argument required.",
  accountDetail: "Gets account details. No specific argument required.",
  signEthMsg: "Signs an Ethereum message. Requires 'message' or 'nonce'.",
};

const enforcerActions: { [key: string]: (hre: any, taskArgs: EnforcerTaskArgs) => Promise<Result> } = {
  requestNonce: async (hre, taskArgs) => await requestNonce(hre, taskArgs),
  invalidateNonce: async (hre, taskArgs) => await invalidateNonce(hre, taskArgs),
  // authorize: async (hre, taskArgs) => await authorize(hre, taskArgs),
  registerAccount: async (hre, taskArgs) => await registerAccount(hre, taskArgs),
  createAPIKey: async (hre, taskArgs) => await createAPIKey(hre, taskArgs),
  deleteAPIKey: async (hre, taskArgs) => await deleteAPIKey(hre, taskArgs),
  deactivateAPIKey: async (hre, taskArgs) => await deactivateAPIKey(hre, taskArgs),
  activateAPIKey: async (hre, taskArgs) => await activateAPIKey(hre, taskArgs),
  accountAPIKeys: async (hre, taskArgs) => await accountAPIKeys(hre, taskArgs),
  accountDetail: async (hre, taskArgs) => await accountDetail(hre, taskArgs),
  signEthMessage: async (hre, taskArgs) => await signEthMessage(hre, taskArgs),
};

for (const enforcerAction in enforcerActions) {
  const description = enforcerActionDescriptions[enforcerAction] || "No description available";
  task(`enforcer:${enforcerAction}`, description)
    .addOptionalParam<string>("signedchallenge","The signed challenge for various authorization")
    .addOptionalParam<string>("chainid","The chain id for requesting policy attestations")
    .addOptionalParam<string>("policy","The policy for to request authorization token")
    .addOptionalParam<string>("username","The username for the register-account action")
    .addOptionalParam<string>("email","The email for the register-account action")
    .addOptionalParam<string>("account","The accout for the register-account action")
    .addOptionalParam<string>("signature","The signature for the register-account action")
    .addOptionalParam<string>("tenantcode","The tenant code for the register-account action")
    .addOptionalParam<string>("apikey","The api key for various actions")
    .addOptionalParam<string>("tenantid","The tenant id for the create-api-key action")
    .addOptionalParam<string>("nonce","The nonce for the sign-eth-msg action")
    .setAction(async (taskArgs: EnforcerTaskArgs, hre) => {
      try {
        if (!hre.meshSDK) {
          throw new Error("Mesh SDK not initialized");
        }
        await enforcerActions[enforcerAction](hre, taskArgs);
      } catch (error) {
        console.error("Mesh SDK not initialized:", error);
        return { success: false, message: "Mesh SDK not initialized" };
      }
    });
}

export default {};