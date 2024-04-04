import { task } from "hardhat/config";
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { v4 as uuidv4 } from 'uuid';
import { DeployerActions, ContractType, DeployerTaskArgs } from "./types";

const contractNames: Record<ContractType, string> = {
  'todo': 'SimpleToDo'
};

type ParentContractTypeId = 'SimpleToDo';

interface ParentContractTypeIdRecord extends Record<ParentContractTypeId, string> {
  [key: string]: string;
}

const parentContractTypeId: ParentContractTypeIdRecord = {
  'SimpleToDo': '00000000-0000-0000-0000-000000000000'
};

type ChainId = 43113 | 43114 | 1 | 80001 | 137 | 1337 | 11155111;

interface ChainIdRecord extends Record<ChainId, string> {
  [key: string]: string;
}

const chainIds: ChainIdRecord = {
  43113: '00000000-0000-0000-0000-000000043113',
  43114: '00000000-0000-0000-0000-000000043114',
  1: '00000000-0000-0000-0000-000000000001',
  80001: '00000000-0000-0000-0000-000000080001',
  137: '00000000-0000-0000-0000-000000000137',
  1337: '00000000-0000-0000-0000-000000001337',
  11155111: '00000000-0000-0000-0000-000011155111', 
  8453: '00000000-0000-0000-0000-000000008453',
};

async function deployContract(hre: HardhatRuntimeEnvironment, taskArgs: DeployerTaskArgs) {
  try {
    const [deployer] = await hre.ethers.getSigners();
    const admin = deployer.address;
    console.log('Deploying contracts with the account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());

    const contractName = contractNames[taskArgs.type as ContractType];
    if (!contractName) {
      throw new Error(`Unknown contract type: ${taskArgs.type}.\n\tKnown contract types are: ${Object.keys(contractNames).join(', ')}`);
    }
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = await contractFactory.deploy(admin);
    await contract.deployed();
    console.log(`[${hre.network.name}] ${taskArgs.type} contract deployed to: ${contract.address}`);
    const chainId = hre.network.config.chainId;
    if (!chainId) {
      console.error('No chainId found in the network config');
      return;
    }
    
    const contractData = {
      id: uuidv4(), 
      code: contractName,
      note: null, 
      blockchain_id: chainIds[chainId], 
      contract_address: contract.address,
      transaction_hash: contract.deployTransaction.hash,
      smart_contract_type_id: parentContractTypeId[contractName], 
      model_id: null,
      deployed_at: new Date().toISOString(),
      deployed_by: admin,
      deployed_from: null
    };

    let data;
    const filePath = `data/insert/SMART_CONTRACTS.json`;
    
    if (existsSync(filePath)) {
      const fileContent = readFileSync(filePath, 'utf-8');
      data = fileContent ? JSON.parse(fileContent) : [];
    } else {
      data = [];
    }

    data.push(contractData);
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error in deployContract:\n \t${(error as Error).message}`);
  }
}

async function verifyContract(hre: HardhatRuntimeEnvironment, taskArgs: DeployerTaskArgs) {
  try {
    const [deployer] = await hre.ethers.getSigners();
    const admin = deployer.address;
    console.log('Verifying contract with the account:', deployer.address);
    const contractAddress = taskArgs.contractaddress;
    if (!contractAddress) {
      console.error(`No contract address provided. usage:\n hardhat verify-contract --address <contract-address>`);
      return;
    }

    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: [
        admin
      ],
    });
    console.log(`Contract verified: ${contractAddress}`);
  } catch (error) {
    console.error(`Error in verify: ${(error as Error).message}`);
  }
}

const actions: DeployerActions = {
  deploy: (hre: HardhatRuntimeEnvironment, taskArgs: DeployerTaskArgs) => deployContract(hre, taskArgs),
  verify: (hre: HardhatRuntimeEnvironment, taskArgs: DeployerTaskArgs) => verifyContract(hre, taskArgs),
};

const deployActionDescriptions: { [key: string]: string } = {
  deploy: "Deploy smart contracts. Requires 'type' set to one of [erc1155, erc1155delta, erc20, erc721, domainFactory, meshFactory]",
  verify: "Verify a smart contract. Requires 'address' to verify the contract on etherscan"
};

for (const actionName in actions) {
  const description = deployActionDescriptions[actionName] || "No description available";
  task(`deployer:${actionName}`, description)
    .addOptionalParam("type", "The contract type to deploy [erc1155, erc1155delta, erc20, erc721, domainFactory, meshFactory]")
    .addOptionalParam("contractaddress", "The contract address to verify")
    .setAction(async (taskArgs: DeployerTaskArgs, hre) => {
      try {
        await actions[actionName](hre, taskArgs);
      } catch (error) {
        console.error(`Action ${actionName} failed: ${(error as Error).message}`);
      }
    });
}

export default {};