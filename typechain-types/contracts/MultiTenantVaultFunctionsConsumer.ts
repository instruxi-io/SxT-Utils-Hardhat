/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface MultiTenantVaultFunctionsConsumerInterface
  extends utils.Interface {
  functions: {
    "ADMIN_ROLE()": FunctionFragment;
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "TENANT_ROLE()": FunctionFragment;
    "acceptOwnership()": FunctionFragment;
    "addAdminRole(address)": FunctionFragment;
    "addTenantRole(address)": FunctionFragment;
    "depositNFT(address,uint256,uint8,bytes,uint64,uint32)": FunctionFragment;
    "donId()": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "handleOracleFulfillment(bytes32,bytes,bytes)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "nftContractAddressToTokenIdToDepositor(address,uint256)": FunctionFragment;
    "nftContractAddressToTokenIdToSupplied(address,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "removeAdminRole(address)": FunctionFragment;
    "removeTenantRole(address)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "setDonId(bytes32)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdrawNFT(uint256,address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "ADMIN_ROLE"
      | "DEFAULT_ADMIN_ROLE"
      | "TENANT_ROLE"
      | "acceptOwnership"
      | "addAdminRole"
      | "addTenantRole"
      | "depositNFT"
      | "donId"
      | "getRoleAdmin"
      | "grantRole"
      | "handleOracleFulfillment"
      | "hasRole"
      | "nftContractAddressToTokenIdToDepositor"
      | "nftContractAddressToTokenIdToSupplied"
      | "owner"
      | "removeAdminRole"
      | "removeTenantRole"
      | "renounceRole"
      | "revokeRole"
      | "setDonId"
      | "supportsInterface"
      | "transferOwnership"
      | "withdrawNFT"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "TENANT_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "acceptOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addAdminRole",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "addTenantRole",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "depositNFT",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "donId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "handleOracleFulfillment",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "nftContractAddressToTokenIdToDepositor",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "nftContractAddressToTokenIdToSupplied",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeAdminRole",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeTenantRole",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDonId",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawNFT",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "ADMIN_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "TENANT_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "acceptOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addAdminRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addTenantRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "depositNFT", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "donId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "handleOracleFulfillment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "nftContractAddressToTokenIdToDepositor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nftContractAddressToTokenIdToSupplied",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeAdminRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeTenantRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setDonId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawNFT",
    data: BytesLike
  ): Result;

  events: {
    "OCRResponse(bytes)": EventFragment;
    "OwnershipTransferRequested(address,address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RequestFailed(bytes)": EventFragment;
    "RequestFulfilled(bytes32)": EventFragment;
    "RequestSent(bytes32)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OCRResponse"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferRequested"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestFailed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestFulfilled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
}

export interface OCRResponseEventObject {
  request: string;
}
export type OCRResponseEvent = TypedEvent<[string], OCRResponseEventObject>;

export type OCRResponseEventFilter = TypedEventFilter<OCRResponseEvent>;

export interface OwnershipTransferRequestedEventObject {
  from: string;
  to: string;
}
export type OwnershipTransferRequestedEvent = TypedEvent<
  [string, string],
  OwnershipTransferRequestedEventObject
>;

export type OwnershipTransferRequestedEventFilter =
  TypedEventFilter<OwnershipTransferRequestedEvent>;

export interface OwnershipTransferredEventObject {
  from: string;
  to: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface RequestFailedEventObject {
  err: string;
}
export type RequestFailedEvent = TypedEvent<[string], RequestFailedEventObject>;

export type RequestFailedEventFilter = TypedEventFilter<RequestFailedEvent>;

export interface RequestFulfilledEventObject {
  id: string;
}
export type RequestFulfilledEvent = TypedEvent<
  [string],
  RequestFulfilledEventObject
>;

export type RequestFulfilledEventFilter =
  TypedEventFilter<RequestFulfilledEvent>;

export interface RequestSentEventObject {
  id: string;
}
export type RequestSentEvent = TypedEvent<[string], RequestSentEventObject>;

export type RequestSentEventFilter = TypedEventFilter<RequestSentEvent>;

export interface RoleAdminChangedEventObject {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}
export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string],
  RoleAdminChangedEventObject
>;

export type RoleAdminChangedEventFilter =
  TypedEventFilter<RoleAdminChangedEvent>;

export interface RoleGrantedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleGrantedEvent = TypedEvent<
  [string, string, string],
  RoleGrantedEventObject
>;

export type RoleGrantedEventFilter = TypedEventFilter<RoleGrantedEvent>;

export interface RoleRevokedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleRevokedEvent = TypedEvent<
  [string, string, string],
  RoleRevokedEventObject
>;

export type RoleRevokedEventFilter = TypedEventFilter<RoleRevokedEvent>;

export interface MultiTenantVaultFunctionsConsumer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MultiTenantVaultFunctionsConsumerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    TENANT_ROLE(overrides?: CallOverrides): Promise<[string]>;

    acceptOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addAdminRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addTenantRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    depositNFT(
      nftContractAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      secretsLocation: PromiseOrValue<BigNumberish>,
      encryptedSecretsReference: PromiseOrValue<BytesLike>,
      subscriptionId: PromiseOrValue<BigNumberish>,
      callbackGasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    donId(overrides?: CallOverrides): Promise<[string]>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    handleOracleFulfillment(
      requestId: PromiseOrValue<BytesLike>,
      response: PromiseOrValue<BytesLike>,
      err: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    nftContractAddressToTokenIdToDepositor(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    nftContractAddressToTokenIdToSupplied(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    removeAdminRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removeTenantRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDonId(
      newDonId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    transferOwnership(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      tokenContractAddress: PromiseOrValue<string>,
      nftContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  TENANT_ROLE(overrides?: CallOverrides): Promise<string>;

  acceptOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addAdminRole(
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addTenantRole(
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  depositNFT(
    nftContractAddress: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    secretsLocation: PromiseOrValue<BigNumberish>,
    encryptedSecretsReference: PromiseOrValue<BytesLike>,
    subscriptionId: PromiseOrValue<BigNumberish>,
    callbackGasLimit: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  donId(overrides?: CallOverrides): Promise<string>;

  getRoleAdmin(
    role: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  grantRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  handleOracleFulfillment(
    requestId: PromiseOrValue<BytesLike>,
    response: PromiseOrValue<BytesLike>,
    err: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  nftContractAddressToTokenIdToDepositor(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  nftContractAddressToTokenIdToSupplied(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  removeAdminRole(
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removeTenantRole(
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDonId(
    newDonId: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  transferOwnership(
    to: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawNFT(
    tokenId: PromiseOrValue<BigNumberish>,
    tokenContractAddress: PromiseOrValue<string>,
    nftContractAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    TENANT_ROLE(overrides?: CallOverrides): Promise<string>;

    acceptOwnership(overrides?: CallOverrides): Promise<void>;

    addAdminRole(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    addTenantRole(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    depositNFT(
      nftContractAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      secretsLocation: PromiseOrValue<BigNumberish>,
      encryptedSecretsReference: PromiseOrValue<BytesLike>,
      subscriptionId: PromiseOrValue<BigNumberish>,
      callbackGasLimit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    donId(overrides?: CallOverrides): Promise<string>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    handleOracleFulfillment(
      requestId: PromiseOrValue<BytesLike>,
      response: PromiseOrValue<BytesLike>,
      err: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    nftContractAddressToTokenIdToDepositor(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    nftContractAddressToTokenIdToSupplied(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    removeAdminRole(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    removeTenantRole(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDonId(
      newDonId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferOwnership(
      to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      tokenContractAddress: PromiseOrValue<string>,
      nftContractAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OCRResponse(bytes)"(request?: null): OCRResponseEventFilter;
    OCRResponse(request?: null): OCRResponseEventFilter;

    "OwnershipTransferRequested(address,address)"(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferRequestedEventFilter;
    OwnershipTransferRequested(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferRequestedEventFilter;

    "OwnershipTransferred(address,address)"(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "RequestFailed(bytes)"(err?: null): RequestFailedEventFilter;
    RequestFailed(err?: null): RequestFailedEventFilter;

    "RequestFulfilled(bytes32)"(
      id?: PromiseOrValue<BytesLike> | null
    ): RequestFulfilledEventFilter;
    RequestFulfilled(
      id?: PromiseOrValue<BytesLike> | null
    ): RequestFulfilledEventFilter;

    "RequestSent(bytes32)"(
      id?: PromiseOrValue<BytesLike> | null
    ): RequestSentEventFilter;
    RequestSent(id?: PromiseOrValue<BytesLike> | null): RequestSentEventFilter;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;
    RoleAdminChanged(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;

    "RoleGranted(bytes32,address,address)"(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;
    RoleGranted(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;

    "RoleRevoked(bytes32,address,address)"(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
    RoleRevoked(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
  };

  estimateGas: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    TENANT_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    acceptOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addAdminRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addTenantRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    depositNFT(
      nftContractAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      secretsLocation: PromiseOrValue<BigNumberish>,
      encryptedSecretsReference: PromiseOrValue<BytesLike>,
      subscriptionId: PromiseOrValue<BigNumberish>,
      callbackGasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    donId(overrides?: CallOverrides): Promise<BigNumber>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    handleOracleFulfillment(
      requestId: PromiseOrValue<BytesLike>,
      response: PromiseOrValue<BytesLike>,
      err: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nftContractAddressToTokenIdToDepositor(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nftContractAddressToTokenIdToSupplied(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    removeAdminRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removeTenantRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDonId(
      newDonId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      tokenContractAddress: PromiseOrValue<string>,
      nftContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    TENANT_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    acceptOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addAdminRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addTenantRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    depositNFT(
      nftContractAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      secretsLocation: PromiseOrValue<BigNumberish>,
      encryptedSecretsReference: PromiseOrValue<BytesLike>,
      subscriptionId: PromiseOrValue<BigNumberish>,
      callbackGasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    donId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    handleOracleFulfillment(
      requestId: PromiseOrValue<BytesLike>,
      response: PromiseOrValue<BytesLike>,
      err: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nftContractAddressToTokenIdToDepositor(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nftContractAddressToTokenIdToSupplied(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeAdminRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removeTenantRole(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDonId(
      newDonId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      tokenContractAddress: PromiseOrValue<string>,
      nftContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}