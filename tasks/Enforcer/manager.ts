import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EnforcerTaskArgs, Result } from "./types";
import { getInput } from '../utils';
import ora from 'ora';

async function requestNonce(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const spinner = ora('Requesting nonce...').start();
  try {
    const nonce = await hre.meshSDK.enforcer.requestNonce(taskArgs.deployer.address);
    spinner.succeed(`Nonce received: ${nonce.nonce}`);
    return { success: true, message: nonce.nonce };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to get challenge: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

async function invalidateNonce(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const spinner = ora('Invalidating nonce...').start();
  try {
    const nonce = await hre.meshSDK.enforcer.invalidateNonce(taskArgs.deployer.address);
    spinner.succeed(`New nonce received: ${nonce.nonce}`);
    return { success: true, message: nonce.nonce };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to invalidate nonce: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

async function accountDetail(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const spinner = ora('Getting account details...').start();
  try {
    const account = await hre.meshSDK.enforcer.accountDetail();
    spinner.succeed(`Account Details: ${account}`);
    return { success: true, message: account };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to get account details: ${errorMessage}`);
    return { success: false, message: errorMessage };
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
    console.log(`Using signer address: ${taskArgs.deployer.address}`);
    const signature = await taskArgs.deployer[0].signMessage(email);
    const registration = await hre.meshSDK.enforcer.registerAccount(username, email, taskArgs.deployer.address, signature, tenantCode);
    spinner.succeed(`Account Details: ${registration}`);
    return { success: true, message: 'Check for activation email to retrieve your first API KEY' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to register account: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

async function createAPIKey(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> { 
  const spinner = ora('Creating API Key...').start();
  try {   
    const apiKey = await hre.meshSDK.enforcer.createAPIKey();
    spinner.succeed(`API Key Created: ${apiKey}`);
    return { success: true, message: apiKey };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to create API Key: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

async function deleteAPIKey(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const apiKey = taskArgs.apikey || await getInput("apikey", "Enter the api key you want to delete");
  const spinner = ora('Deleting API Key...').start();
  try {
    const deleteApiKey = await hre.meshSDK.enforcer.deleteAPIKey(apiKey);
    spinner.succeed(`API Key Deleted: ${apiKey}`);
    return { success: true, message: deleteApiKey };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to delete API Key: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

async function deactivateAPIKey(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const apiKey = taskArgs.apikey || await getInput("apikey", "Enter the api key you want to delete");
  const spinner = ora('Deactivating API Key...').start();
  try {
    const deactivateAPIKey = await hre.meshSDK.enforcer.deactivateAPIKey(apiKey);
    spinner.succeed(`API Key Deactivated: ${deactivateAPIKey}`);
    return { success: true, message: deactivateAPIKey };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to deactivate API Key ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

async function activateAPIKey(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const apiKey = taskArgs.apikey || await getInput("apikey", "Enter the api key you want to activate");
  const spinner = ora('Activating API Key...').start();
  try {
    const activateAPIKey = await hre.meshSDK.enforcer.activateAPIKey(apiKey);
    spinner.succeed(`API Key Activated: ${activateAPIKey}`);
    return { success: true, message: activateAPIKey };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to activate API Key: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

async function accountAPIKeys(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const spinner = ora('Getting Account API Keys...').start();
  try {
    const apiKeys = await hre.meshSDK.enforcer.accountAPIKeys();
    spinner.succeed(`API Keys: ${activateAPIKey}`);
    return { success: true, message: apiKeys };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to get API Key for account: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

async function signEthMessage(hre: HardhatRuntimeEnvironment, taskArgs: EnforcerTaskArgs): Promise<Result> {
  const challenge = taskArgs.message || taskArgs.nonce || await getInput("message", "Enter the challenge to sign");
  const spinner = ora('Signing eth message...').start();
  try {
    const signEthMsgTxn = await taskArgs.deployer[0].signMessage(challenge);
    const messageHash = hre.ethers.utils.hashMessage(challenge);
    const recoveredAddress = hre.ethers.utils.recoverAddress(messageHash, signEthMsgTxn);
    if (recoveredAddress !== taskArgs.deployer.address) {
      throw new Error(`Recovered address ${recoveredAddress} does not match signer address ${taskArgs.deployer.address}`);
    }
    spinner.succeed(`Eth message signed: ${signEthMsgTxn}`);
    return { success: true, message: signEthMsgTxn };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    spinner.fail(`Failed to sign eth message: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

const enforcerActionDescriptions: { [key: string]: string } = {
  requestNonce: "Requests a nonce for the HRE signer. No CLI parameters required.",
  invalidateNonce: "Invalidates the HRE signer's latest nonce challenge. Any signatures generated using the retired nonce will be invalidated. No CLI parameters required.",
  registerAccount: "Registers an account with a Mesh API Gateway. CLI Parameters: --email --username --tenantcode (must be provided by the Mesh API administrator)",
  createAPIKey: "Creates an API key. No specific argument required.",
  deleteAPIKey: "Deletes the specified API key. CLI Parameters: --apikey",
  deactivateAPIKey: "Deactivates an API key. CLI Parameters: --apikey",
  activateAPIKey: "Activates an API key. CLI Parameters: --apikey",
  accountAPIKeys: "Gets account API keys. No specific argument required.",
  accountDetail: "Gets account details. No specific argument required.",
  signEthMsg: "Signs an Ethereum message. CLI Parameters: --message or --nonce",
};

const enforcerActions: { [key: string]: (hre: any, taskArgs: EnforcerTaskArgs) => Promise<Result> } = {
  requestNonce: async (hre, taskArgs) => await requestNonce(hre, taskArgs),
  invalidateNonce: async (hre, taskArgs) => await invalidateNonce(hre, taskArgs),
  //authorize: async (hre, taskArgs) => await authorize(hre, taskArgs),
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
    //.addOptionalParam<string>("chainid","The chain id for requesting policy attestations")
    //.addOptionalParam<string>("policy","The policy for to request authorization token")
    .addOptionalParam<string>("username","The username for the register-account action")
    .addOptionalParam<string>("email","The email for the register-account action")
    .addOptionalParam<string>("account","The accout for the register-account action")
    .addOptionalParam<string>("signature","The signature for the register-account action")
    .addOptionalParam<string>("tenantcode","The tenant code for the register-account action")
    .addOptionalParam<string>("apikey","The api key for various actions")
    .addOptionalParam<string>("nonce","The nonce for the sign-eth-msg action")
    .setAction(async (taskArgs: EnforcerTaskArgs, hre) => {
      try {
        const [deployer] = await hre.ethers.getSigners();
        taskArgs.deployer = deployer;
        await enforcerActions[enforcerAction](hre, taskArgs);
      } catch (error) {
        console.error("Mesh SDK not initialized:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, message: errorMessage };
      }
    });
}

export default {};