/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ICloneableBase,
  ICloneableBaseInterface,
} from "../../../contracts/interfaces/ICloneableBase";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ICloneableBase__factory {
  static readonly abi = _abi;
  static createInterface(): ICloneableBaseInterface {
    return new utils.Interface(_abi) as ICloneableBaseInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICloneableBase {
    return new Contract(address, _abi, signerOrProvider) as ICloneableBase;
  }
}