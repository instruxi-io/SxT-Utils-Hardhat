/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IERC1155Delta,
  IERC1155DeltaInterface,
} from "../../../erc1155delta/contracts/IERC1155Delta";

const _abi = [
  {
    inputs: [],
    name: "ApprovalCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceQueryForZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "BurnFromNonOnwerAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "BurnFromZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InputLengthMistmatch",
    type: "error",
  },
  {
    inputs: [],
    name: "MintToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "MintZeroQuantity",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromIncorrectOwnerOrInvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToNonERC1155ReceiverImplementer",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToZeroAddress",
    type: "error",
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
        name: "id",
        type: "uint256",
      },
    ],
    name: "isOwnerOf",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IERC1155Delta__factory {
  static readonly abi = _abi;
  static createInterface(): IERC1155DeltaInterface {
    return new utils.Interface(_abi) as IERC1155DeltaInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IERC1155Delta {
    return new Contract(address, _abi, signerOrProvider) as IERC1155Delta;
  }
}
