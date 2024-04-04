/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "FunctionsClient",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FunctionsClient__factory>;
    getContractFactory(
      name: "IFunctionsClient",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFunctionsClient__factory>;
    getContractFactory(
      name: "IFunctionsRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFunctionsRouter__factory>;
    getContractFactory(
      name: "IFunctionsSubscriptions",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFunctionsSubscriptions__factory>;
    getContractFactory(
      name: "FunctionsRequest",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FunctionsRequest__factory>;
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "ConfirmedOwner",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ConfirmedOwner__factory>;
    getContractFactory(
      name: "ConfirmedOwnerWithProposal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ConfirmedOwnerWithProposal__factory>;
    getContractFactory(
      name: "IOwnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOwnable__factory>;
    getContractFactory(
      name: "AccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControlUpgradeable__factory>;
    getContractFactory(
      name: "IAccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlUpgradeable__factory>;
    getContractFactory(
      name: "OwnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "ERC1155Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Upgradeable__factory>;
    getContractFactory(
      name: "ERC1155BurnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155BurnableUpgradeable__factory>;
    getContractFactory(
      name: "ERC1155SupplyUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155SupplyUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155MetadataURIUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155MetadataURIUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155ReceiverUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155ReceiverUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Upgradeable__factory>;
    getContractFactory(
      name: "ERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Upgradeable__factory>;
    getContractFactory(
      name: "ERC20BurnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20BurnableUpgradeable__factory>;
    getContractFactory(
      name: "IERC20MetadataUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20MetadataUpgradeable__factory>;
    getContractFactory(
      name: "IERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Upgradeable__factory>;
    getContractFactory(
      name: "ERC721Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721Upgradeable__factory>;
    getContractFactory(
      name: "IERC721MetadataUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721MetadataUpgradeable__factory>;
    getContractFactory(
      name: "IERC721ReceiverUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721ReceiverUpgradeable__factory>;
    getContractFactory(
      name: "IERC721Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Upgradeable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "ERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165Upgradeable__factory>;
    getContractFactory(
      name: "IERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165Upgradeable__factory>;
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC1155MetadataURI",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155MetadataURI__factory>;
    getContractFactory(
      name: "IERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155__factory>;
    getContractFactory(
      name: "IERC1155Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Receiver__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "CloneableDomainFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableDomainFactory__factory>;
    getContractFactory(
      name: "CloneableERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableERC1155__factory>;
    getContractFactory(
      name: "CloneableERC1155Delta",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableERC1155Delta__factory>;
    getContractFactory(
      name: "CloneableERC1155DeltaArmada",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableERC1155DeltaArmada__factory>;
    getContractFactory(
      name: "CloneableERC1155DeltaPayable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableERC1155DeltaPayable__factory>;
    getContractFactory(
      name: "CloneableERC1155DeltaSoulbound",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableERC1155DeltaSoulbound__factory>;
    getContractFactory(
      name: "CloneableERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableERC20__factory>;
    getContractFactory(
      name: "CloneableERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableERC721__factory>;
    getContractFactory(
      name: "ClearedERC1155Delta",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ClearedERC1155Delta__factory>;
    getContractFactory(
      name: "FractionalToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FractionalToken__factory>;
    getContractFactory(
      name: "ICloneable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICloneable__factory>;
    getContractFactory(
      name: "ICloneableBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICloneableBase__factory>;
    getContractFactory(
      name: "CloneableTypeA",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableTypeA__factory>;
    getContractFactory(
      name: "CloneableTypeA",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableTypeA__factory>;
    getContractFactory(
      name: "CloneableTypeA",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloneableTypeA__factory>;
    getContractFactory(
      name: "IFractionalNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFractionalNFT__factory>;
    getContractFactory(
      name: "IFractionalToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFractionalToken__factory>;
    getContractFactory(
      name: "MeshFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MeshFactory__factory>;
    getContractFactory(
      name: "MultiTenantVaultFunctionsConsumer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MultiTenantVaultFunctionsConsumer__factory>;
    getContractFactory(
      name: "SimpleToDo",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpleToDo__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "ERC1155Delta",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Delta__factory>;
    getContractFactory(
      name: "ERC1155DeltaUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155DeltaUpgradeable__factory>;
    getContractFactory(
      name: "ERC1155DeltaQueryable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155DeltaQueryable__factory>;
    getContractFactory(
      name: "ERC1155DeltaQueryableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155DeltaQueryableUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155DeltaQueryable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155DeltaQueryable__factory>;
    getContractFactory(
      name: "IERC1155Delta",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Delta__factory>;

    getContractAt(
      name: "FunctionsClient",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.FunctionsClient>;
    getContractAt(
      name: "IFunctionsClient",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFunctionsClient>;
    getContractAt(
      name: "IFunctionsRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFunctionsRouter>;
    getContractAt(
      name: "IFunctionsSubscriptions",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFunctionsSubscriptions>;
    getContractAt(
      name: "FunctionsRequest",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.FunctionsRequest>;
    getContractAt(
      name: "AggregatorV3Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AggregatorV3Interface>;
    getContractAt(
      name: "ConfirmedOwner",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ConfirmedOwner>;
    getContractAt(
      name: "ConfirmedOwnerWithProposal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ConfirmedOwnerWithProposal>;
    getContractAt(
      name: "IOwnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOwnable>;
    getContractAt(
      name: "AccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControlUpgradeable>;
    getContractAt(
      name: "IAccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlUpgradeable>;
    getContractAt(
      name: "OwnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "ERC1155Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Upgradeable>;
    getContractAt(
      name: "ERC1155BurnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155BurnableUpgradeable>;
    getContractAt(
      name: "ERC1155SupplyUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155SupplyUpgradeable>;
    getContractAt(
      name: "IERC1155MetadataURIUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155MetadataURIUpgradeable>;
    getContractAt(
      name: "IERC1155ReceiverUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155ReceiverUpgradeable>;
    getContractAt(
      name: "IERC1155Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Upgradeable>;
    getContractAt(
      name: "ERC20Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Upgradeable>;
    getContractAt(
      name: "ERC20BurnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20BurnableUpgradeable>;
    getContractAt(
      name: "IERC20MetadataUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20MetadataUpgradeable>;
    getContractAt(
      name: "IERC20Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Upgradeable>;
    getContractAt(
      name: "ERC721Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721Upgradeable>;
    getContractAt(
      name: "IERC721MetadataUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721MetadataUpgradeable>;
    getContractAt(
      name: "IERC721ReceiverUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721ReceiverUpgradeable>;
    getContractAt(
      name: "IERC721Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Upgradeable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "ERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165Upgradeable>;
    getContractAt(
      name: "IERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165Upgradeable>;
    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC1155MetadataURI",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155MetadataURI>;
    getContractAt(
      name: "IERC1155",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155>;
    getContractAt(
      name: "IERC1155Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Receiver>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "CloneableDomainFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableDomainFactory>;
    getContractAt(
      name: "CloneableERC1155",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableERC1155>;
    getContractAt(
      name: "CloneableERC1155Delta",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableERC1155Delta>;
    getContractAt(
      name: "CloneableERC1155DeltaArmada",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableERC1155DeltaArmada>;
    getContractAt(
      name: "CloneableERC1155DeltaPayable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableERC1155DeltaPayable>;
    getContractAt(
      name: "CloneableERC1155DeltaSoulbound",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableERC1155DeltaSoulbound>;
    getContractAt(
      name: "CloneableERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableERC20>;
    getContractAt(
      name: "CloneableERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableERC721>;
    getContractAt(
      name: "ClearedERC1155Delta",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ClearedERC1155Delta>;
    getContractAt(
      name: "FractionalToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.FractionalToken>;
    getContractAt(
      name: "ICloneable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICloneable>;
    getContractAt(
      name: "ICloneableBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICloneableBase>;
    getContractAt(
      name: "CloneableTypeA",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableTypeA>;
    getContractAt(
      name: "CloneableTypeA",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableTypeA>;
    getContractAt(
      name: "CloneableTypeA",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloneableTypeA>;
    getContractAt(
      name: "IFractionalNFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFractionalNFT>;
    getContractAt(
      name: "IFractionalToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFractionalToken>;
    getContractAt(
      name: "MeshFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MeshFactory>;
    getContractAt(
      name: "MultiTenantVaultFunctionsConsumer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MultiTenantVaultFunctionsConsumer>;
    getContractAt(
      name: "SimpleToDo",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpleToDo>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "ERC1155Delta",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Delta>;
    getContractAt(
      name: "ERC1155DeltaUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155DeltaUpgradeable>;
    getContractAt(
      name: "ERC1155DeltaQueryable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155DeltaQueryable>;
    getContractAt(
      name: "ERC1155DeltaQueryableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155DeltaQueryableUpgradeable>;
    getContractAt(
      name: "IERC1155DeltaQueryable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155DeltaQueryable>;
    getContractAt(
      name: "IERC1155Delta",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Delta>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
