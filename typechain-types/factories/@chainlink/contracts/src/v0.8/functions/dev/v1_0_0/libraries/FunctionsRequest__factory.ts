/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../../../../common";
import type {
  FunctionsRequest,
  FunctionsRequestInterface,
} from "../../../../../../../../../@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest";

const _abi = [
  {
    inputs: [],
    name: "EmptyArgs",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptySecrets",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptySource",
    type: "error",
  },
  {
    inputs: [],
    name: "NoInlineSecrets",
    type: "error",
  },
  {
    inputs: [],
    name: "REQUEST_DATA_VERSION",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c1610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c80635d641dfc146038575b600080fd5b603e6052565b604051604991906072565b60405180910390f35b600181565b600061ffff82169050919050565b606c816057565b82525050565b6000602082019050608560008301846065565b9291505056fea264697066735822122050fdb2d55c6bbc0d34ab9d4e3eed99da6cc46c926ff89d8d73e6fd90f419ea3e64736f6c63430008140033";

type FunctionsRequestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FunctionsRequestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FunctionsRequest__factory extends ContractFactory {
  constructor(...args: FunctionsRequestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FunctionsRequest> {
    return super.deploy(overrides || {}) as Promise<FunctionsRequest>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): FunctionsRequest {
    return super.attach(address) as FunctionsRequest;
  }
  override connect(signer: Signer): FunctionsRequest__factory {
    return super.connect(signer) as FunctionsRequest__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FunctionsRequestInterface {
    return new utils.Interface(_abi) as FunctionsRequestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FunctionsRequest {
    return new Contract(address, _abi, signerOrProvider) as FunctionsRequest;
  }
}
