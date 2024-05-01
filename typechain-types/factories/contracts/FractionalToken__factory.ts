/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  FractionalToken,
  FractionalTokenInterface,
} from "../../contracts/FractionalToken";

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
        internalType: "address",
        name: "_feedAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_heartbeat",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "claimableAmounts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getFeed",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHeartbeat",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMaxHeartbeatDays",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxClaimAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newFeed",
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
        name: "_newHeartbeat",
        type: "uint256",
      },
    ],
    name: "setHeartbeat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_vault",
        type: "address",
      },
    ],
    name: "setVault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002b9538038062002b958339818101604052810190620000379190620003d2565b838381600390816200004a9190620006c3565b5080600490816200005c9190620006c3565b5050506200007f62000073620000d160201b60201c565b620000d960201b60201c565b81600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060098190555050505050620007aa565b600033905090565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200020882620001bd565b810181811067ffffffffffffffff821117156200022a5762000229620001ce565b5b80604052505050565b60006200023f6200019f565b90506200024d8282620001fd565b919050565b600067ffffffffffffffff82111562000270576200026f620001ce565b5b6200027b82620001bd565b9050602081019050919050565b60005b83811015620002a85780820151818401526020810190506200028b565b60008484015250505050565b6000620002cb620002c58462000252565b62000233565b905082815260208101848484011115620002ea57620002e9620001b8565b5b620002f784828562000288565b509392505050565b600082601f830112620003175762000316620001b3565b5b815162000329848260208601620002b4565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200035f8262000332565b9050919050565b620003718162000352565b81146200037d57600080fd5b50565b600081519050620003918162000366565b92915050565b6000819050919050565b620003ac8162000397565b8114620003b857600080fd5b50565b600081519050620003cc81620003a1565b92915050565b60008060008060808587031215620003ef57620003ee620001a9565b5b600085015167ffffffffffffffff81111562000410576200040f620001ae565b5b6200041e87828801620002ff565b945050602085015167ffffffffffffffff811115620004425762000441620001ae565b5b6200045087828801620002ff565b9350506040620004638782880162000380565b92505060606200047687828801620003bb565b91505092959194509250565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620004d557607f821691505b602082108103620004eb57620004ea6200048d565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620005557fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000516565b62000561868362000516565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620005a46200059e620005988462000397565b62000579565b62000397565b9050919050565b6000819050919050565b620005c08362000583565b620005d8620005cf82620005ab565b84845462000523565b825550505050565b600090565b620005ef620005e0565b620005fc818484620005b5565b505050565b5b81811015620006245762000618600082620005e5565b60018101905062000602565b5050565b601f82111562000673576200063d81620004f1565b620006488462000506565b8101602085101562000658578190505b62000670620006678562000506565b83018262000601565b50505b505050565b600082821c905092915050565b6000620006986000198460080262000678565b1980831691505092915050565b6000620006b3838362000685565b9150826002028217905092915050565b620006ce8262000482565b67ffffffffffffffff811115620006ea57620006e9620001ce565b5b620006f68254620004bc565b6200070382828562000628565b600060209050601f8311600181146200073b576000841562000726578287015190505b620007328582620006a5565b865550620007a2565b601f1984166200074b86620004f1565b60005b8281101562000775578489015182556001820191506020850194506020810190506200074e565b8683101562000795578489015162000791601f89168262000685565b8355505b6001600288020188555050505b505050505050565b6123db80620007ba6000396000f3fe608060405234801561001057600080fd5b50600436106101585760003560e01c8063715018a6116100c3578063a9059cbb1161007c578063a9059cbb146103c9578063aeef6439146103f9578063d29dba9114610417578063dbadb1d114610433578063dd62ed3e14610451578063f2fde38b1461048157610158565b8063715018a6146103195780638d20ff14146103235780638da5cb5b1461034157806395d89b411461035f5780639dc29fac1461037d578063a457c2d71461039957610158565b8063368e916411610115578063368e916414610247578063395093511461026557806340c10f191461029557806355b775ea146102b15780636817031b146102cd57806370a08231146102e957610158565b806306fdde031461015d578063095ea7b31461017b57806318160ddd146101ab57806323b872dd146101c95780632bc79c12146101f9578063313ce56714610229575b600080fd5b61016561049d565b604051610172919061169b565b60405180910390f35b61019560048036038101906101909190611756565b61052f565b6040516101a291906117b1565b60405180910390f35b6101b3610552565b6040516101c091906117db565b60405180910390f35b6101e360048036038101906101de91906117f6565b61055c565b6040516101f091906117b1565b60405180910390f35b610213600480360381019061020e9190611849565b61058b565b60405161022091906117db565b60405180910390f35b6102316105a3565b60405161023e9190611892565b60405180910390f35b61024f6105ac565b60405161025c91906117db565b60405180910390f35b61027f600480360381019061027a9190611756565b6105b5565b60405161028c91906117b1565b60405180910390f35b6102af60048036038101906102aa9190611756565b6105ec565b005b6102cb60048036038101906102c69190611849565b61081b565b005b6102e760048036038101906102e29190611849565b61089e565b005b61030360048036038101906102fe9190611849565b6108ea565b60405161031091906117db565b60405180910390f35b610321610932565b005b61032b610946565b60405161033891906117db565b60405180910390f35b610349610950565b60405161035691906118bc565b60405180910390f35b61036761097a565b604051610374919061169b565b60405180910390f35b61039760048036038101906103929190611756565b610a0c565b005b6103b360048036038101906103ae9190611756565b610aaa565b6040516103c091906117b1565b60405180910390f35b6103e360048036038101906103de9190611756565b610b21565b6040516103f091906117b1565b60405180910390f35b610401610b44565b60405161040e91906117db565b60405180910390f35b610431600480360381019061042c91906118d7565b610b4a565b005b61043b610b93565b60405161044891906118bc565b60405180910390f35b61046b60048036038101906104669190611904565b610bbd565b60405161047891906117db565b60405180910390f35b61049b60048036038101906104969190611849565b610c44565b005b6060600380546104ac90611973565b80601f01602080910402602001604051908101604052809291908181526020018280546104d890611973565b80156105255780601f106104fa57610100808354040283529160200191610525565b820191906000526020600020905b81548152906001019060200180831161050857829003601f168201915b5050505050905090565b60008061053a610cc7565b9050610547818585610ccf565b600191505092915050565b6000600254905090565b600080610567610cc7565b9050610574858285610e98565b61057f858585610f24565b60019150509392505050565b60076020528060005260406000206000915090505481565b60006012905090565b60006007905090565b6000806105c0610cc7565b90506105e18185856105d28589610bbd565b6105dc91906119d3565b610ccf565b600191505092915050565b3373ffffffffffffffffffffffffffffffffffffffff16600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461067c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067390611a79565b60405180910390fd5b600080600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa1580156106ec573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107109190611b26565b509350509250506000821361075a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161075190611bed565b60405180910390fd5b600954426107689190611c0d565b8110156107aa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107a190611c8d565b60405180910390fd5b600082905060006107b9610552565b90508185826107c891906119d3565b1115610809576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161080090611d1f565b60405180910390fd5b610813868661119a565b505050505050565b6108236112f0565b80600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507ffb87de77fbda385148da8fb8b91afa737d901d5863a4593c29de956aada8f5238160405161089391906118bc565b60405180910390a150565b6108a66112f0565b80600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b61093a6112f0565b610944600061136e565b565b6000600954905090565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606004805461098990611973565b80601f01602080910402602001604051908101604052809291908181526020018280546109b590611973565b8015610a025780601f106109d757610100808354040283529160200191610a02565b820191906000526020600020905b8154815290600101906020018083116109e557829003601f168201915b5050505050905090565b3373ffffffffffffffffffffffffffffffffffffffff16600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610a9c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a9390611a79565b60405180910390fd5b610aa68282611434565b5050565b600080610ab5610cc7565b90506000610ac38286610bbd565b905083811015610b08576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aff90611db1565b60405180910390fd5b610b158286868403610ccf565b60019250505092915050565b600080610b2c610cc7565b9050610b39818585610f24565b600191505092915050565b60085481565b610b526112f0565b806009819055507f573c5383b8e8bdce77e07118f29b330e315b91ecfacddb48bcedaba69922ee4c81604051610b8891906117db565b60405180910390a150565b6000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b610c4c6112f0565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610cbb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cb290611e43565b60405180910390fd5b610cc48161136e565b50565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610d3e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d3590611ed5565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610dad576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610da490611f67565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610e8b91906117db565b60405180910390a3505050565b6000610ea48484610bbd565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610f1e5781811015610f10576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f0790611fd3565b60405180910390fd5b610f1d8484848403610ccf565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610f93576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8a90612065565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611002576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ff9906120f7565b60405180910390fd5b61100d838383611601565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015611093576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161108a90612189565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161118191906117db565b60405180910390a3611194848484611606565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611209576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611200906121f5565b60405180910390fd5b61121560008383611601565b806002600082825461122791906119d3565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516112d891906117db565b60405180910390a36112ec60008383611606565b5050565b6112f8610cc7565b73ffffffffffffffffffffffffffffffffffffffff16611316610950565b73ffffffffffffffffffffffffffffffffffffffff161461136c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161136390612261565b60405180910390fd5b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036114a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161149a906122f3565b60405180910390fd5b6114af82600083611601565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015611535576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161152c90612385565b60405180910390fd5b8181036000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600260008282540392505081905550600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516115e891906117db565b60405180910390a36115fc83600084611606565b505050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561164557808201518184015260208101905061162a565b60008484015250505050565b6000601f19601f8301169050919050565b600061166d8261160b565b6116778185611616565b9350611687818560208601611627565b61169081611651565b840191505092915050565b600060208201905081810360008301526116b58184611662565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006116ed826116c2565b9050919050565b6116fd816116e2565b811461170857600080fd5b50565b60008135905061171a816116f4565b92915050565b6000819050919050565b61173381611720565b811461173e57600080fd5b50565b6000813590506117508161172a565b92915050565b6000806040838503121561176d5761176c6116bd565b5b600061177b8582860161170b565b925050602061178c85828601611741565b9150509250929050565b60008115159050919050565b6117ab81611796565b82525050565b60006020820190506117c660008301846117a2565b92915050565b6117d581611720565b82525050565b60006020820190506117f060008301846117cc565b92915050565b60008060006060848603121561180f5761180e6116bd565b5b600061181d8682870161170b565b935050602061182e8682870161170b565b925050604061183f86828701611741565b9150509250925092565b60006020828403121561185f5761185e6116bd565b5b600061186d8482850161170b565b91505092915050565b600060ff82169050919050565b61188c81611876565b82525050565b60006020820190506118a76000830184611883565b92915050565b6118b6816116e2565b82525050565b60006020820190506118d160008301846118ad565b92915050565b6000602082840312156118ed576118ec6116bd565b5b60006118fb84828501611741565b91505092915050565b6000806040838503121561191b5761191a6116bd565b5b60006119298582860161170b565b925050602061193a8582860161170b565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061198b57607f821691505b60208210810361199e5761199d611944565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006119de82611720565b91506119e983611720565b9250828201905080821115611a0157611a006119a4565b5b92915050565b7f4f6e6c7920746865207661756c742063616e2063616c6c2074686520746f6b6560008201527f6e20636f6e747261637400000000000000000000000000000000000000000000602082015250565b6000611a63602a83611616565b9150611a6e82611a07565b604082019050919050565b60006020820190508181036000830152611a9281611a56565b9050919050565b600069ffffffffffffffffffff82169050919050565b611ab881611a99565b8114611ac357600080fd5b50565b600081519050611ad581611aaf565b92915050565b6000819050919050565b611aee81611adb565b8114611af957600080fd5b50565b600081519050611b0b81611ae5565b92915050565b600081519050611b208161172a565b92915050565b600080600080600060a08688031215611b4257611b416116bd565b5b6000611b5088828901611ac6565b9550506020611b6188828901611afc565b9450506040611b7288828901611b11565b9350506060611b8388828901611b11565b9250506080611b9488828901611ac6565b9150509295509295909350565b7f696e76616c696420616e737765722066726f6d20506f52206665656400000000600082015250565b6000611bd7601c83611616565b9150611be282611ba1565b602082019050919050565b60006020820190508181036000830152611c0681611bca565b9050919050565b6000611c1882611720565b9150611c2383611720565b9250828203905081811115611c3b57611c3a6119a4565b5b92915050565b7f616e73776572206f757464617465640000000000000000000000000000000000600082015250565b6000611c77600f83611616565b9150611c8282611c41565b602082019050919050565b60006020820190508181036000830152611ca681611c6a565b9050919050565b7f746f74616c20737570706c7920776f756c64206578636565642072657365727660008201527f6573206166746572206d696e7400000000000000000000000000000000000000602082015250565b6000611d09602d83611616565b9150611d1482611cad565b604082019050919050565b60006020820190508181036000830152611d3881611cfc565b9050919050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6000611d9b602583611616565b9150611da682611d3f565b604082019050919050565b60006020820190508181036000830152611dca81611d8e565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611e2d602683611616565b9150611e3882611dd1565b604082019050919050565b60006020820190508181036000830152611e5c81611e20565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000611ebf602483611616565b9150611eca82611e63565b604082019050919050565b60006020820190508181036000830152611eee81611eb2565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000611f51602283611616565b9150611f5c82611ef5565b604082019050919050565b60006020820190508181036000830152611f8081611f44565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b6000611fbd601d83611616565b9150611fc882611f87565b602082019050919050565b60006020820190508181036000830152611fec81611fb0565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b600061204f602583611616565b915061205a82611ff3565b604082019050919050565b6000602082019050818103600083015261207e81612042565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b60006120e1602383611616565b91506120ec82612085565b604082019050919050565b60006020820190508181036000830152612110816120d4565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b6000612173602683611616565b915061217e82612117565b604082019050919050565b600060208201905081810360008301526121a281612166565b9050919050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b60006121df601f83611616565b91506121ea826121a9565b602082019050919050565b6000602082019050818103600083015261220e816121d2565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b600061224b602083611616565b915061225682612215565b602082019050919050565b6000602082019050818103600083015261227a8161223e565b9050919050565b7f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b60006122dd602183611616565b91506122e882612281565b604082019050919050565b6000602082019050818103600083015261230c816122d0565b9050919050565b7f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60008201527f6365000000000000000000000000000000000000000000000000000000000000602082015250565b600061236f602283611616565b915061237a82612313565b604082019050919050565b6000602082019050818103600083015261239e81612362565b905091905056fea2646970667358221220b786f2159b1355d99a3e2728cea32c4ce08da08bb01ca996073079184065ce3564736f6c63430008140033";

type FractionalTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FractionalTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FractionalToken__factory extends ContractFactory {
  constructor(...args: FractionalTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    _feedAddr: PromiseOrValue<string>,
    _heartbeat: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FractionalToken> {
    return super.deploy(
      _name,
      _symbol,
      _feedAddr,
      _heartbeat,
      overrides || {}
    ) as Promise<FractionalToken>;
  }
  override getDeployTransaction(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    _feedAddr: PromiseOrValue<string>,
    _heartbeat: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _name,
      _symbol,
      _feedAddr,
      _heartbeat,
      overrides || {}
    );
  }
  override attach(address: string): FractionalToken {
    return super.attach(address) as FractionalToken;
  }
  override connect(signer: Signer): FractionalToken__factory {
    return super.connect(signer) as FractionalToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FractionalTokenInterface {
    return new utils.Interface(_abi) as FractionalTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FractionalToken {
    return new Contract(address, _abi, signerOrProvider) as FractionalToken;
  }
}