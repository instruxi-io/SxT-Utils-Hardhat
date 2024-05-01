/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IFractionalToken,
  IFractionalTokenInterface,
} from "../../../contracts/interfaces/IFractionalToken";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newFeed",
        type: "address",
      },
    ],
    name: "ReserveFeedSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newHeartbeat",
        type: "uint256",
      },
    ],
    name: "ReserveHeartbeatSet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newFeed",
        type: "address",
      },
    ],
    name: "setFeed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newHeartbeat",
        type: "uint256",
      },
    ],
    name: "setHeartbeat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IFractionalToken__factory {
  static readonly abi = _abi;
  static createInterface(): IFractionalTokenInterface {
    return new utils.Interface(_abi) as IFractionalTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IFractionalToken {
    return new Contract(address, _abi, signerOrProvider) as IFractionalToken;
  }
}