/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ICloneable,
  ICloneableInterface,
} from "../../../contracts/interfaces/ICloneable";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
      {
        internalType: "address",
        name: "_tenant",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ICloneable__factory {
  static readonly abi = _abi;
  static createInterface(): ICloneableInterface {
    return new utils.Interface(_abi) as ICloneableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICloneable {
    return new Contract(address, _abi, signerOrProvider) as ICloneable;
  }
}
