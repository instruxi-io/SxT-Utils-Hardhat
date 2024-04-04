import { HardhatRuntimeEnvironment } from "hardhat/types";

export interface DeployerTaskArgs {
  contractaddress?: string;
  type?: string;
}

export interface Result {
  success: boolean;
  message: string;
}

export interface SignMessageTaskArgs {
  message: string;
}

export interface PromptResponse {
  input: string;
}

export interface DeployerAction {
  (hre: HardhatRuntimeEnvironment, taskArgs: DeployerTaskArgs): void;
}

export interface DeployerActions {
  [key: string]: DeployerAction;
}

export type ContractType = 'todo';