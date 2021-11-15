/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";

// @ts-ignore
import * as Long from "long";

export const protobufPackage = "iotextypes";

/**
 * To compile the proto, run:
 *      protoc --go_out=plugins=grpc:$GOPATH/src *.proto
 */

export enum RewardType {
  BlockReward = 0,
  EpochReward = 1,
  UNRECOGNIZED = -1,
}

export function rewardTypeFromJSON(object: any): RewardType {
  switch (object) {
    case 0:
    case "BlockReward":
      return RewardType.BlockReward;
    case 1:
    case "EpochReward":
      return RewardType.EpochReward;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RewardType.UNRECOGNIZED;
  }
}

export function rewardTypeToJSON(object: RewardType): string {
  switch (object) {
    case RewardType.BlockReward:
      return "BlockReward";
    case RewardType.EpochReward:
      return "EpochReward";
    default:
      return "UNKNOWN";
  }
}

export interface Transfer {
  /** used by state-based model */
  amount: string;
  recipient: string;
  payload: Uint8Array;
}

/** Candidates and list of candidates */
export interface Candidate {
  address: string;
  votes: Uint8Array;
  pubKey: Uint8Array;
  rewardAddress: string;
}

export interface CandidateList {
  candidates: Candidate[];
}

export interface PutPollResult {
  height: number;
  candidates: CandidateList | undefined;
}

export interface Execution {
  amount: string;
  contract: string;
  data: Uint8Array;
}

/** create stake */
export interface StakeCreate {
  candidateName: string;
  stakedAmount: string;
  stakedDuration: number;
  autoStake: boolean;
  payload: Uint8Array;
}

/** unstake or withdraw */
export interface StakeReclaim {
  bucketIndex: number;
  payload: Uint8Array;
}

/** add the amount of bucket */
export interface StakeAddDeposit {
  bucketIndex: number;
  amount: string;
  payload: Uint8Array;
}

/** restake the duration and autoStake flag of bucket */
export interface StakeRestake {
  bucketIndex: number;
  stakedDuration: number;
  autoStake: boolean;
  payload: Uint8Array;
}

/** move the bucket to vote for another candidate or transfer the ownership of bucket to another voters */
export interface StakeChangeCandidate {
  bucketIndex: number;
  candidateName: string;
  payload: Uint8Array;
}

export interface StakeTransferOwnership {
  bucketIndex: number;
  voterAddress: string;
  payload: Uint8Array;
}

export interface CandidateBasicInfo {
  name: string;
  operatorAddress: string;
  rewardAddress: string;
}

export interface CandidateRegister {
  candidate: CandidateBasicInfo | undefined;
  stakedAmount: string;
  stakedDuration: number;
  autoStake: boolean;
  /** if ownerAddress is absent, owner of candidate is the sender */
  ownerAddress: string;
  payload: Uint8Array;
}

export interface StartSubChain {
  /** TODO: chainID chould be assigned by system and returned via a receipt */
  chainID: number;
  securityDeposit: string;
  operationDeposit: string;
  startHeight: number;
  parentHeightOffset: number;
}

export interface StopSubChain {
  chainID: number;
  stopHeight: number;
  subChainAddress: string;
}

export interface MerkleRoot {
  name: string;
  value: Uint8Array;
}

export interface PutBlock {
  subChainAddress: string;
  height: number;
  roots: MerkleRoot[];
}

export interface CreateDeposit {
  chainID: number;
  amount: string;
  recipient: string;
}

export interface SettleDeposit {
  amount: string;
  recipient: string;
  index: number;
}

/** plum main chain APIs */
export interface CreatePlumChain {}

export interface TerminatePlumChain {
  subChainAddress: string;
}

export interface PlumPutBlock {
  subChainAddress: string;
  height: number;
  roots: { [key: string]: Uint8Array };
}

export interface PlumPutBlock_RootsEntry {
  key: string;
  value: Uint8Array;
}

export interface PlumCreateDeposit {
  subChainAddress: string;
  amount: string;
  recipient: string;
}

export interface PlumStartExit {
  subChainAddress: string;
  previousTransfer: Uint8Array;
  previousTransferBlockProof: Uint8Array;
  previousTransferBlockHeight: number;
  exitTransfer: Uint8Array;
  exitTransferBlockProof: Uint8Array;
  exitTransferBlockHeight: number;
}

export interface PlumChallengeExit {
  subChainAddress: string;
  coinID: number;
  challengeTransfer: Uint8Array;
  challengeTransferBlockProof: Uint8Array;
  challengeTransferBlockHeight: number;
}

export interface PlumResponseChallengeExit {
  subChainAddress: string;
  coinID: number;
  challengeTransfer: Uint8Array;
  responseTransfer: Uint8Array;
  responseTransferBlockProof: Uint8Array;
  previousTransferBlockHeight: number;
}

export interface PlumFinalizeExit {
  subChainAddress: string;
  coinID: number;
}

/** plum sub chain APIs */
export interface PlumSettleDeposit {
  coinID: number;
}

export interface PlumTransfer {
  coinID: number;
  denomination: Uint8Array;
  owner: string;
  recipient: string;
}

export interface ActionCore {
  version: number;
  nonce: number;
  gasLimit: number;
  gasPrice: string;
  transfer: Transfer | undefined;
  execution: Execution | undefined;
  /** FedChain */
  startSubChain: StartSubChain | undefined;
  stopSubChain: StopSubChain | undefined;
  putBlock: PutBlock | undefined;
  createDeposit: CreateDeposit | undefined;
  settleDeposit: SettleDeposit | undefined;
  /** PlumChain */
  createPlumChain: CreatePlumChain | undefined;
  terminatePlumChain: TerminatePlumChain | undefined;
  plumPutBlock: PlumPutBlock | undefined;
  plumCreateDeposit: PlumCreateDeposit | undefined;
  plumStartExit: PlumStartExit | undefined;
  plumChallengeExit: PlumChallengeExit | undefined;
  plumResponseChallengeExit: PlumResponseChallengeExit | undefined;
  plumFinalizeExit: PlumFinalizeExit | undefined;
  plumSettleDeposit: PlumSettleDeposit | undefined;
  plumTransfer: PlumTransfer | undefined;
  /** Rewarding protocol actions */
  depositToRewardingFund: DepositToRewardingFund | undefined;
  claimFromRewardingFund: ClaimFromRewardingFund | undefined;
  grantReward: GrantReward | undefined;
  /** Native staking */
  stakeCreate: StakeCreate | undefined;
  stakeUnstake: StakeReclaim | undefined;
  stakeWithdraw: StakeReclaim | undefined;
  stakeAddDeposit: StakeAddDeposit | undefined;
  stakeRestake: StakeRestake | undefined;
  stakeChangeCandidate: StakeChangeCandidate | undefined;
  stakeTransferOwnership: StakeTransferOwnership | undefined;
  candidateRegister: CandidateRegister | undefined;
  candidateUpdate: CandidateBasicInfo | undefined;
  putPollResult: PutPollResult | undefined;
}

export interface Action {
  core: ActionCore | undefined;
  senderPubKey: Uint8Array;
  signature: Uint8Array;
}

export interface Receipt {
  status: number;
  blkHeight: number;
  actHash: Uint8Array;
  gasConsumed: number;
  contractAddress: string;
  logs: Log[];
}

export interface Log {
  contractAddress: string;
  topics: Uint8Array[];
  data: Uint8Array;
  blkHeight: number;
  actHash: Uint8Array;
  index: number;
}

export interface EvmTransfer {
  amount: Uint8Array;
  from: string;
  to: string;
}

export interface EvmTransferList {
  evmTransfers: EvmTransfer[];
}

export interface ActionEvmTransfer {
  actionHash: Uint8Array;
  numEvmTransfers: number;
  evmTransfers: EvmTransfer[];
}

export interface BlockEvmTransfer {
  blockHeight: number;
  numEvmTransfers: number;
  actionEvmTransfers: ActionEvmTransfer[];
}

export interface DepositToRewardingFund {
  amount: string;
  data: Uint8Array;
}

export interface ClaimFromRewardingFund {
  amount: string;
  data: Uint8Array;
}

export interface GrantReward {
  type: RewardType;
  height: number;
}

const baseTransfer: object = { amount: "", recipient: "" };

export const Transfer = {
  encode(message: Transfer, writer: Writer = Writer.create()): Writer {
    if (message.amount !== "") {
      writer.uint32(10).string(message.amount);
    }
    if (message.recipient !== "") {
      writer.uint32(18).string(message.recipient);
    }
    if (message.payload.length !== 0) {
      writer.uint32(26).bytes(message.payload);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Transfer {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTransfer } as Transfer;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.string();
          break;
        case 2:
          message.recipient = reader.string();
          break;
        case 3:
          message.payload = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Transfer {
    const message = { ...baseTransfer } as Transfer;
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? String(object.amount)
        : "";
    message.recipient =
      object.recipient !== undefined && object.recipient !== null
        ? String(object.recipient)
        : "";
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    return message;
  },

  toJSON(message: Transfer): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.recipient !== undefined && (obj.recipient = message.recipient);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<Transfer>): Transfer {
    const message = { ...baseTransfer } as Transfer;
    message.amount = object.amount ?? "";
    message.recipient = object.recipient ?? "";
    message.payload = object.payload ?? new Uint8Array();
    return message;
  },
};

const baseCandidate: object = { address: "", rewardAddress: "" };

export const Candidate = {
  encode(message: Candidate, writer: Writer = Writer.create()): Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.votes.length !== 0) {
      writer.uint32(18).bytes(message.votes);
    }
    if (message.pubKey.length !== 0) {
      writer.uint32(26).bytes(message.pubKey);
    }
    if (message.rewardAddress !== "") {
      writer.uint32(34).string(message.rewardAddress);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Candidate {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCandidate } as Candidate;
    message.votes = new Uint8Array();
    message.pubKey = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.votes = reader.bytes();
          break;
        case 3:
          message.pubKey = reader.bytes();
          break;
        case 4:
          message.rewardAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Candidate {
    const message = { ...baseCandidate } as Candidate;
    message.address =
      object.address !== undefined && object.address !== null
        ? String(object.address)
        : "";
    message.votes =
      object.votes !== undefined && object.votes !== null
        ? bytesFromBase64(object.votes)
        : new Uint8Array();
    message.pubKey =
      object.pubKey !== undefined && object.pubKey !== null
        ? bytesFromBase64(object.pubKey)
        : new Uint8Array();
    message.rewardAddress =
      object.rewardAddress !== undefined && object.rewardAddress !== null
        ? String(object.rewardAddress)
        : "";
    return message;
  },

  toJSON(message: Candidate): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.votes !== undefined &&
      (obj.votes = base64FromBytes(
        message.votes !== undefined ? message.votes : new Uint8Array()
      ));
    message.pubKey !== undefined &&
      (obj.pubKey = base64FromBytes(
        message.pubKey !== undefined ? message.pubKey : new Uint8Array()
      ));
    message.rewardAddress !== undefined &&
      (obj.rewardAddress = message.rewardAddress);
    return obj;
  },

  fromPartial(object: DeepPartial<Candidate>): Candidate {
    const message = { ...baseCandidate } as Candidate;
    message.address = object.address ?? "";
    message.votes = object.votes ?? new Uint8Array();
    message.pubKey = object.pubKey ?? new Uint8Array();
    message.rewardAddress = object.rewardAddress ?? "";
    return message;
  },
};

const baseCandidateList: object = {};

export const CandidateList = {
  encode(message: CandidateList, writer: Writer = Writer.create()): Writer {
    for (const v of message.candidates) {
      Candidate.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CandidateList {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCandidateList } as CandidateList;
    message.candidates = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.candidates.push(Candidate.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CandidateList {
    const message = { ...baseCandidateList } as CandidateList;
    message.candidates = (object.candidates ?? []).map((e: any) =>
      Candidate.fromJSON(e)
    );
    return message;
  },

  toJSON(message: CandidateList): unknown {
    const obj: any = {};
    if (message.candidates) {
      obj.candidates = message.candidates.map((e) =>
        e ? Candidate.toJSON(e) : undefined
      );
    } else {
      obj.candidates = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<CandidateList>): CandidateList {
    const message = { ...baseCandidateList } as CandidateList;
    message.candidates = (object.candidates ?? []).map((e) =>
      Candidate.fromPartial(e)
    );
    return message;
  },
};

const basePutPollResult: object = { height: 0 };

export const PutPollResult = {
  encode(message: PutPollResult, writer: Writer = Writer.create()): Writer {
    if (message.height !== 0) {
      writer.uint32(8).uint64(message.height);
    }
    if (message.candidates !== undefined) {
      CandidateList.encode(
        message.candidates,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PutPollResult {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePutPollResult } as PutPollResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.candidates = CandidateList.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PutPollResult {
    const message = { ...basePutPollResult } as PutPollResult;
    message.height =
      object.height !== undefined && object.height !== null
        ? Number(object.height)
        : 0;
    message.candidates =
      object.candidates !== undefined && object.candidates !== null
        ? CandidateList.fromJSON(object.candidates)
        : undefined;
    return message;
  },

  toJSON(message: PutPollResult): unknown {
    const obj: any = {};
    message.height !== undefined && (obj.height = message.height);
    message.candidates !== undefined &&
      (obj.candidates = message.candidates
        ? CandidateList.toJSON(message.candidates)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<PutPollResult>): PutPollResult {
    const message = { ...basePutPollResult } as PutPollResult;
    message.height = object.height ?? 0;
    message.candidates =
      object.candidates !== undefined && object.candidates !== null
        ? CandidateList.fromPartial(object.candidates)
        : undefined;
    return message;
  },
};

const baseExecution: object = { amount: "", contract: "" };

export const Execution = {
  encode(message: Execution, writer: Writer = Writer.create()): Writer {
    if (message.amount !== "") {
      writer.uint32(10).string(message.amount);
    }
    if (message.contract !== "") {
      writer.uint32(18).string(message.contract);
    }
    if (message.data.length !== 0) {
      writer.uint32(26).bytes(message.data);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Execution {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseExecution } as Execution;
    message.data = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.string();
          break;
        case 2:
          message.contract = reader.string();
          break;
        case 3:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Execution {
    const message = { ...baseExecution } as Execution;
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? String(object.amount)
        : "";
    message.contract =
      object.contract !== undefined && object.contract !== null
        ? String(object.contract)
        : "";
    message.data =
      object.data !== undefined && object.data !== null
        ? bytesFromBase64(object.data)
        : new Uint8Array();
    return message;
  },

  toJSON(message: Execution): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.contract !== undefined && (obj.contract = message.contract);
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<Execution>): Execution {
    const message = { ...baseExecution } as Execution;
    message.amount = object.amount ?? "";
    message.contract = object.contract ?? "";
    message.data = object.data ?? new Uint8Array();
    return message;
  },
};

const baseStakeCreate: object = {
  candidateName: "",
  stakedAmount: "",
  stakedDuration: 0,
  autoStake: false,
};

export const StakeCreate = {
  encode(message: StakeCreate, writer: Writer = Writer.create()): Writer {
    if (message.candidateName !== "") {
      writer.uint32(10).string(message.candidateName);
    }
    if (message.stakedAmount !== "") {
      writer.uint32(18).string(message.stakedAmount);
    }
    if (message.stakedDuration !== 0) {
      writer.uint32(24).uint32(message.stakedDuration);
    }
    if (message.autoStake === true) {
      writer.uint32(32).bool(message.autoStake);
    }
    if (message.payload.length !== 0) {
      writer.uint32(42).bytes(message.payload);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StakeCreate {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStakeCreate } as StakeCreate;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.candidateName = reader.string();
          break;
        case 2:
          message.stakedAmount = reader.string();
          break;
        case 3:
          message.stakedDuration = reader.uint32();
          break;
        case 4:
          message.autoStake = reader.bool();
          break;
        case 5:
          message.payload = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StakeCreate {
    const message = { ...baseStakeCreate } as StakeCreate;
    message.candidateName =
      object.candidateName !== undefined && object.candidateName !== null
        ? String(object.candidateName)
        : "";
    message.stakedAmount =
      object.stakedAmount !== undefined && object.stakedAmount !== null
        ? String(object.stakedAmount)
        : "";
    message.stakedDuration =
      object.stakedDuration !== undefined && object.stakedDuration !== null
        ? Number(object.stakedDuration)
        : 0;
    message.autoStake =
      object.autoStake !== undefined && object.autoStake !== null
        ? Boolean(object.autoStake)
        : false;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    return message;
  },

  toJSON(message: StakeCreate): unknown {
    const obj: any = {};
    message.candidateName !== undefined &&
      (obj.candidateName = message.candidateName);
    message.stakedAmount !== undefined &&
      (obj.stakedAmount = message.stakedAmount);
    message.stakedDuration !== undefined &&
      (obj.stakedDuration = message.stakedDuration);
    message.autoStake !== undefined && (obj.autoStake = message.autoStake);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<StakeCreate>): StakeCreate {
    const message = { ...baseStakeCreate } as StakeCreate;
    message.candidateName = object.candidateName ?? "";
    message.stakedAmount = object.stakedAmount ?? "";
    message.stakedDuration = object.stakedDuration ?? 0;
    message.autoStake = object.autoStake ?? false;
    message.payload = object.payload ?? new Uint8Array();
    return message;
  },
};

const baseStakeReclaim: object = { bucketIndex: 0 };

export const StakeReclaim = {
  encode(message: StakeReclaim, writer: Writer = Writer.create()): Writer {
    if (message.bucketIndex !== 0) {
      writer.uint32(8).uint64(message.bucketIndex);
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StakeReclaim {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStakeReclaim } as StakeReclaim;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bucketIndex = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.payload = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StakeReclaim {
    const message = { ...baseStakeReclaim } as StakeReclaim;
    message.bucketIndex =
      object.bucketIndex !== undefined && object.bucketIndex !== null
        ? Number(object.bucketIndex)
        : 0;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    return message;
  },

  toJSON(message: StakeReclaim): unknown {
    const obj: any = {};
    message.bucketIndex !== undefined &&
      (obj.bucketIndex = message.bucketIndex);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<StakeReclaim>): StakeReclaim {
    const message = { ...baseStakeReclaim } as StakeReclaim;
    message.bucketIndex = object.bucketIndex ?? 0;
    message.payload = object.payload ?? new Uint8Array();
    return message;
  },
};

const baseStakeAddDeposit: object = { bucketIndex: 0, amount: "" };

export const StakeAddDeposit = {
  encode(message: StakeAddDeposit, writer: Writer = Writer.create()): Writer {
    if (message.bucketIndex !== 0) {
      writer.uint32(8).uint64(message.bucketIndex);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.payload.length !== 0) {
      writer.uint32(26).bytes(message.payload);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StakeAddDeposit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStakeAddDeposit } as StakeAddDeposit;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bucketIndex = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.amount = reader.string();
          break;
        case 3:
          message.payload = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StakeAddDeposit {
    const message = { ...baseStakeAddDeposit } as StakeAddDeposit;
    message.bucketIndex =
      object.bucketIndex !== undefined && object.bucketIndex !== null
        ? Number(object.bucketIndex)
        : 0;
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? String(object.amount)
        : "";
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    return message;
  },

  toJSON(message: StakeAddDeposit): unknown {
    const obj: any = {};
    message.bucketIndex !== undefined &&
      (obj.bucketIndex = message.bucketIndex);
    message.amount !== undefined && (obj.amount = message.amount);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<StakeAddDeposit>): StakeAddDeposit {
    const message = { ...baseStakeAddDeposit } as StakeAddDeposit;
    message.bucketIndex = object.bucketIndex ?? 0;
    message.amount = object.amount ?? "";
    message.payload = object.payload ?? new Uint8Array();
    return message;
  },
};

const baseStakeRestake: object = {
  bucketIndex: 0,
  stakedDuration: 0,
  autoStake: false,
};

export const StakeRestake = {
  encode(message: StakeRestake, writer: Writer = Writer.create()): Writer {
    if (message.bucketIndex !== 0) {
      writer.uint32(8).uint64(message.bucketIndex);
    }
    if (message.stakedDuration !== 0) {
      writer.uint32(16).uint32(message.stakedDuration);
    }
    if (message.autoStake === true) {
      writer.uint32(24).bool(message.autoStake);
    }
    if (message.payload.length !== 0) {
      writer.uint32(34).bytes(message.payload);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StakeRestake {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStakeRestake } as StakeRestake;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bucketIndex = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.stakedDuration = reader.uint32();
          break;
        case 3:
          message.autoStake = reader.bool();
          break;
        case 4:
          message.payload = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StakeRestake {
    const message = { ...baseStakeRestake } as StakeRestake;
    message.bucketIndex =
      object.bucketIndex !== undefined && object.bucketIndex !== null
        ? Number(object.bucketIndex)
        : 0;
    message.stakedDuration =
      object.stakedDuration !== undefined && object.stakedDuration !== null
        ? Number(object.stakedDuration)
        : 0;
    message.autoStake =
      object.autoStake !== undefined && object.autoStake !== null
        ? Boolean(object.autoStake)
        : false;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    return message;
  },

  toJSON(message: StakeRestake): unknown {
    const obj: any = {};
    message.bucketIndex !== undefined &&
      (obj.bucketIndex = message.bucketIndex);
    message.stakedDuration !== undefined &&
      (obj.stakedDuration = message.stakedDuration);
    message.autoStake !== undefined && (obj.autoStake = message.autoStake);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<StakeRestake>): StakeRestake {
    const message = { ...baseStakeRestake } as StakeRestake;
    message.bucketIndex = object.bucketIndex ?? 0;
    message.stakedDuration = object.stakedDuration ?? 0;
    message.autoStake = object.autoStake ?? false;
    message.payload = object.payload ?? new Uint8Array();
    return message;
  },
};

const baseStakeChangeCandidate: object = { bucketIndex: 0, candidateName: "" };

export const StakeChangeCandidate = {
  encode(
    message: StakeChangeCandidate,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.bucketIndex !== 0) {
      writer.uint32(8).uint64(message.bucketIndex);
    }
    if (message.candidateName !== "") {
      writer.uint32(18).string(message.candidateName);
    }
    if (message.payload.length !== 0) {
      writer.uint32(26).bytes(message.payload);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StakeChangeCandidate {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStakeChangeCandidate } as StakeChangeCandidate;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bucketIndex = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.candidateName = reader.string();
          break;
        case 3:
          message.payload = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StakeChangeCandidate {
    const message = { ...baseStakeChangeCandidate } as StakeChangeCandidate;
    message.bucketIndex =
      object.bucketIndex !== undefined && object.bucketIndex !== null
        ? Number(object.bucketIndex)
        : 0;
    message.candidateName =
      object.candidateName !== undefined && object.candidateName !== null
        ? String(object.candidateName)
        : "";
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    return message;
  },

  toJSON(message: StakeChangeCandidate): unknown {
    const obj: any = {};
    message.bucketIndex !== undefined &&
      (obj.bucketIndex = message.bucketIndex);
    message.candidateName !== undefined &&
      (obj.candidateName = message.candidateName);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<StakeChangeCandidate>): StakeChangeCandidate {
    const message = { ...baseStakeChangeCandidate } as StakeChangeCandidate;
    message.bucketIndex = object.bucketIndex ?? 0;
    message.candidateName = object.candidateName ?? "";
    message.payload = object.payload ?? new Uint8Array();
    return message;
  },
};

const baseStakeTransferOwnership: object = { bucketIndex: 0, voterAddress: "" };

export const StakeTransferOwnership = {
  encode(
    message: StakeTransferOwnership,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.bucketIndex !== 0) {
      writer.uint32(8).uint64(message.bucketIndex);
    }
    if (message.voterAddress !== "") {
      writer.uint32(18).string(message.voterAddress);
    }
    if (message.payload.length !== 0) {
      writer.uint32(26).bytes(message.payload);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StakeTransferOwnership {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStakeTransferOwnership } as StakeTransferOwnership;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bucketIndex = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.voterAddress = reader.string();
          break;
        case 3:
          message.payload = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StakeTransferOwnership {
    const message = { ...baseStakeTransferOwnership } as StakeTransferOwnership;
    message.bucketIndex =
      object.bucketIndex !== undefined && object.bucketIndex !== null
        ? Number(object.bucketIndex)
        : 0;
    message.voterAddress =
      object.voterAddress !== undefined && object.voterAddress !== null
        ? String(object.voterAddress)
        : "";
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    return message;
  },

  toJSON(message: StakeTransferOwnership): unknown {
    const obj: any = {};
    message.bucketIndex !== undefined &&
      (obj.bucketIndex = message.bucketIndex);
    message.voterAddress !== undefined &&
      (obj.voterAddress = message.voterAddress);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(
    object: DeepPartial<StakeTransferOwnership>
  ): StakeTransferOwnership {
    const message = { ...baseStakeTransferOwnership } as StakeTransferOwnership;
    message.bucketIndex = object.bucketIndex ?? 0;
    message.voterAddress = object.voterAddress ?? "";
    message.payload = object.payload ?? new Uint8Array();
    return message;
  },
};

const baseCandidateBasicInfo: object = {
  name: "",
  operatorAddress: "",
  rewardAddress: "",
};

export const CandidateBasicInfo = {
  encode(
    message: CandidateBasicInfo,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.operatorAddress !== "") {
      writer.uint32(18).string(message.operatorAddress);
    }
    if (message.rewardAddress !== "") {
      writer.uint32(26).string(message.rewardAddress);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CandidateBasicInfo {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCandidateBasicInfo } as CandidateBasicInfo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.operatorAddress = reader.string();
          break;
        case 3:
          message.rewardAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CandidateBasicInfo {
    const message = { ...baseCandidateBasicInfo } as CandidateBasicInfo;
    message.name =
      object.name !== undefined && object.name !== null
        ? String(object.name)
        : "";
    message.operatorAddress =
      object.operatorAddress !== undefined && object.operatorAddress !== null
        ? String(object.operatorAddress)
        : "";
    message.rewardAddress =
      object.rewardAddress !== undefined && object.rewardAddress !== null
        ? String(object.rewardAddress)
        : "";
    return message;
  },

  toJSON(message: CandidateBasicInfo): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.operatorAddress !== undefined &&
      (obj.operatorAddress = message.operatorAddress);
    message.rewardAddress !== undefined &&
      (obj.rewardAddress = message.rewardAddress);
    return obj;
  },

  fromPartial(object: DeepPartial<CandidateBasicInfo>): CandidateBasicInfo {
    const message = { ...baseCandidateBasicInfo } as CandidateBasicInfo;
    message.name = object.name ?? "";
    message.operatorAddress = object.operatorAddress ?? "";
    message.rewardAddress = object.rewardAddress ?? "";
    return message;
  },
};

const baseCandidateRegister: object = {
  stakedAmount: "",
  stakedDuration: 0,
  autoStake: false,
  ownerAddress: "",
};

export const CandidateRegister = {
  encode(message: CandidateRegister, writer: Writer = Writer.create()): Writer {
    if (message.candidate !== undefined) {
      CandidateBasicInfo.encode(
        message.candidate,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.stakedAmount !== "") {
      writer.uint32(18).string(message.stakedAmount);
    }
    if (message.stakedDuration !== 0) {
      writer.uint32(24).uint32(message.stakedDuration);
    }
    if (message.autoStake === true) {
      writer.uint32(32).bool(message.autoStake);
    }
    if (message.ownerAddress !== "") {
      writer.uint32(42).string(message.ownerAddress);
    }
    if (message.payload.length !== 0) {
      writer.uint32(50).bytes(message.payload);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CandidateRegister {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCandidateRegister } as CandidateRegister;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.candidate = CandidateBasicInfo.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.stakedAmount = reader.string();
          break;
        case 3:
          message.stakedDuration = reader.uint32();
          break;
        case 4:
          message.autoStake = reader.bool();
          break;
        case 5:
          message.ownerAddress = reader.string();
          break;
        case 6:
          message.payload = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CandidateRegister {
    const message = { ...baseCandidateRegister } as CandidateRegister;
    message.candidate =
      object.candidate !== undefined && object.candidate !== null
        ? CandidateBasicInfo.fromJSON(object.candidate)
        : undefined;
    message.stakedAmount =
      object.stakedAmount !== undefined && object.stakedAmount !== null
        ? String(object.stakedAmount)
        : "";
    message.stakedDuration =
      object.stakedDuration !== undefined && object.stakedDuration !== null
        ? Number(object.stakedDuration)
        : 0;
    message.autoStake =
      object.autoStake !== undefined && object.autoStake !== null
        ? Boolean(object.autoStake)
        : false;
    message.ownerAddress =
      object.ownerAddress !== undefined && object.ownerAddress !== null
        ? String(object.ownerAddress)
        : "";
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    return message;
  },

  toJSON(message: CandidateRegister): unknown {
    const obj: any = {};
    message.candidate !== undefined &&
      (obj.candidate = message.candidate
        ? CandidateBasicInfo.toJSON(message.candidate)
        : undefined);
    message.stakedAmount !== undefined &&
      (obj.stakedAmount = message.stakedAmount);
    message.stakedDuration !== undefined &&
      (obj.stakedDuration = message.stakedDuration);
    message.autoStake !== undefined && (obj.autoStake = message.autoStake);
    message.ownerAddress !== undefined &&
      (obj.ownerAddress = message.ownerAddress);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<CandidateRegister>): CandidateRegister {
    const message = { ...baseCandidateRegister } as CandidateRegister;
    message.candidate =
      object.candidate !== undefined && object.candidate !== null
        ? CandidateBasicInfo.fromPartial(object.candidate)
        : undefined;
    message.stakedAmount = object.stakedAmount ?? "";
    message.stakedDuration = object.stakedDuration ?? 0;
    message.autoStake = object.autoStake ?? false;
    message.ownerAddress = object.ownerAddress ?? "";
    message.payload = object.payload ?? new Uint8Array();
    return message;
  },
};

const baseStartSubChain: object = {
  chainID: 0,
  securityDeposit: "",
  operationDeposit: "",
  startHeight: 0,
  parentHeightOffset: 0,
};

export const StartSubChain = {
  encode(message: StartSubChain, writer: Writer = Writer.create()): Writer {
    if (message.chainID !== 0) {
      writer.uint32(8).uint32(message.chainID);
    }
    if (message.securityDeposit !== "") {
      writer.uint32(18).string(message.securityDeposit);
    }
    if (message.operationDeposit !== "") {
      writer.uint32(26).string(message.operationDeposit);
    }
    if (message.startHeight !== 0) {
      writer.uint32(32).uint64(message.startHeight);
    }
    if (message.parentHeightOffset !== 0) {
      writer.uint32(40).uint64(message.parentHeightOffset);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StartSubChain {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStartSubChain } as StartSubChain;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chainID = reader.uint32();
          break;
        case 2:
          message.securityDeposit = reader.string();
          break;
        case 3:
          message.operationDeposit = reader.string();
          break;
        case 4:
          message.startHeight = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.parentHeightOffset = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartSubChain {
    const message = { ...baseStartSubChain } as StartSubChain;
    message.chainID =
      object.chainID !== undefined && object.chainID !== null
        ? Number(object.chainID)
        : 0;
    message.securityDeposit =
      object.securityDeposit !== undefined && object.securityDeposit !== null
        ? String(object.securityDeposit)
        : "";
    message.operationDeposit =
      object.operationDeposit !== undefined && object.operationDeposit !== null
        ? String(object.operationDeposit)
        : "";
    message.startHeight =
      object.startHeight !== undefined && object.startHeight !== null
        ? Number(object.startHeight)
        : 0;
    message.parentHeightOffset =
      object.parentHeightOffset !== undefined &&
      object.parentHeightOffset !== null
        ? Number(object.parentHeightOffset)
        : 0;
    return message;
  },

  toJSON(message: StartSubChain): unknown {
    const obj: any = {};
    message.chainID !== undefined && (obj.chainID = message.chainID);
    message.securityDeposit !== undefined &&
      (obj.securityDeposit = message.securityDeposit);
    message.operationDeposit !== undefined &&
      (obj.operationDeposit = message.operationDeposit);
    message.startHeight !== undefined &&
      (obj.startHeight = message.startHeight);
    message.parentHeightOffset !== undefined &&
      (obj.parentHeightOffset = message.parentHeightOffset);
    return obj;
  },

  fromPartial(object: DeepPartial<StartSubChain>): StartSubChain {
    const message = { ...baseStartSubChain } as StartSubChain;
    message.chainID = object.chainID ?? 0;
    message.securityDeposit = object.securityDeposit ?? "";
    message.operationDeposit = object.operationDeposit ?? "";
    message.startHeight = object.startHeight ?? 0;
    message.parentHeightOffset = object.parentHeightOffset ?? 0;
    return message;
  },
};

const baseStopSubChain: object = {
  chainID: 0,
  stopHeight: 0,
  subChainAddress: "",
};

export const StopSubChain = {
  encode(message: StopSubChain, writer: Writer = Writer.create()): Writer {
    if (message.chainID !== 0) {
      writer.uint32(8).uint32(message.chainID);
    }
    if (message.stopHeight !== 0) {
      writer.uint32(16).uint64(message.stopHeight);
    }
    if (message.subChainAddress !== "") {
      writer.uint32(26).string(message.subChainAddress);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StopSubChain {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStopSubChain } as StopSubChain;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chainID = reader.uint32();
          break;
        case 2:
          message.stopHeight = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.subChainAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StopSubChain {
    const message = { ...baseStopSubChain } as StopSubChain;
    message.chainID =
      object.chainID !== undefined && object.chainID !== null
        ? Number(object.chainID)
        : 0;
    message.stopHeight =
      object.stopHeight !== undefined && object.stopHeight !== null
        ? Number(object.stopHeight)
        : 0;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    return message;
  },

  toJSON(message: StopSubChain): unknown {
    const obj: any = {};
    message.chainID !== undefined && (obj.chainID = message.chainID);
    message.stopHeight !== undefined && (obj.stopHeight = message.stopHeight);
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    return obj;
  },

  fromPartial(object: DeepPartial<StopSubChain>): StopSubChain {
    const message = { ...baseStopSubChain } as StopSubChain;
    message.chainID = object.chainID ?? 0;
    message.stopHeight = object.stopHeight ?? 0;
    message.subChainAddress = object.subChainAddress ?? "";
    return message;
  },
};

const baseMerkleRoot: object = { name: "" };

export const MerkleRoot = {
  encode(message: MerkleRoot, writer: Writer = Writer.create()): Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MerkleRoot {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMerkleRoot } as MerkleRoot;
    message.value = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MerkleRoot {
    const message = { ...baseMerkleRoot } as MerkleRoot;
    message.name =
      object.name !== undefined && object.name !== null
        ? String(object.name)
        : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? bytesFromBase64(object.value)
        : new Uint8Array();
    return message;
  },

  toJSON(message: MerkleRoot): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.value !== undefined &&
      (obj.value = base64FromBytes(
        message.value !== undefined ? message.value : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<MerkleRoot>): MerkleRoot {
    const message = { ...baseMerkleRoot } as MerkleRoot;
    message.name = object.name ?? "";
    message.value = object.value ?? new Uint8Array();
    return message;
  },
};

const basePutBlock: object = { subChainAddress: "", height: 0 };

export const PutBlock = {
  encode(message: PutBlock, writer: Writer = Writer.create()): Writer {
    if (message.subChainAddress !== "") {
      writer.uint32(10).string(message.subChainAddress);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint64(message.height);
    }
    for (const v of message.roots) {
      MerkleRoot.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PutBlock {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePutBlock } as PutBlock;
    message.roots = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subChainAddress = reader.string();
          break;
        case 2:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.roots.push(MerkleRoot.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PutBlock {
    const message = { ...basePutBlock } as PutBlock;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    message.height =
      object.height !== undefined && object.height !== null
        ? Number(object.height)
        : 0;
    message.roots = (object.roots ?? []).map((e: any) =>
      MerkleRoot.fromJSON(e)
    );
    return message;
  },

  toJSON(message: PutBlock): unknown {
    const obj: any = {};
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    message.height !== undefined && (obj.height = message.height);
    if (message.roots) {
      obj.roots = message.roots.map((e) =>
        e ? MerkleRoot.toJSON(e) : undefined
      );
    } else {
      obj.roots = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<PutBlock>): PutBlock {
    const message = { ...basePutBlock } as PutBlock;
    message.subChainAddress = object.subChainAddress ?? "";
    message.height = object.height ?? 0;
    message.roots = (object.roots ?? []).map((e) => MerkleRoot.fromPartial(e));
    return message;
  },
};

const baseCreateDeposit: object = { chainID: 0, amount: "", recipient: "" };

export const CreateDeposit = {
  encode(message: CreateDeposit, writer: Writer = Writer.create()): Writer {
    if (message.chainID !== 0) {
      writer.uint32(8).uint32(message.chainID);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.recipient !== "") {
      writer.uint32(26).string(message.recipient);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CreateDeposit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCreateDeposit } as CreateDeposit;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chainID = reader.uint32();
          break;
        case 2:
          message.amount = reader.string();
          break;
        case 3:
          message.recipient = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateDeposit {
    const message = { ...baseCreateDeposit } as CreateDeposit;
    message.chainID =
      object.chainID !== undefined && object.chainID !== null
        ? Number(object.chainID)
        : 0;
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? String(object.amount)
        : "";
    message.recipient =
      object.recipient !== undefined && object.recipient !== null
        ? String(object.recipient)
        : "";
    return message;
  },

  toJSON(message: CreateDeposit): unknown {
    const obj: any = {};
    message.chainID !== undefined && (obj.chainID = message.chainID);
    message.amount !== undefined && (obj.amount = message.amount);
    message.recipient !== undefined && (obj.recipient = message.recipient);
    return obj;
  },

  fromPartial(object: DeepPartial<CreateDeposit>): CreateDeposit {
    const message = { ...baseCreateDeposit } as CreateDeposit;
    message.chainID = object.chainID ?? 0;
    message.amount = object.amount ?? "";
    message.recipient = object.recipient ?? "";
    return message;
  },
};

const baseSettleDeposit: object = { amount: "", recipient: "", index: 0 };

export const SettleDeposit = {
  encode(message: SettleDeposit, writer: Writer = Writer.create()): Writer {
    if (message.amount !== "") {
      writer.uint32(10).string(message.amount);
    }
    if (message.recipient !== "") {
      writer.uint32(18).string(message.recipient);
    }
    if (message.index !== 0) {
      writer.uint32(24).uint64(message.index);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SettleDeposit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSettleDeposit } as SettleDeposit;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.string();
          break;
        case 2:
          message.recipient = reader.string();
          break;
        case 3:
          message.index = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SettleDeposit {
    const message = { ...baseSettleDeposit } as SettleDeposit;
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? String(object.amount)
        : "";
    message.recipient =
      object.recipient !== undefined && object.recipient !== null
        ? String(object.recipient)
        : "";
    message.index =
      object.index !== undefined && object.index !== null
        ? Number(object.index)
        : 0;
    return message;
  },

  toJSON(message: SettleDeposit): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.recipient !== undefined && (obj.recipient = message.recipient);
    message.index !== undefined && (obj.index = message.index);
    return obj;
  },

  fromPartial(object: DeepPartial<SettleDeposit>): SettleDeposit {
    const message = { ...baseSettleDeposit } as SettleDeposit;
    message.amount = object.amount ?? "";
    message.recipient = object.recipient ?? "";
    message.index = object.index ?? 0;
    return message;
  },
};

const baseCreatePlumChain: object = {};

export const CreatePlumChain = {
  encode(_: CreatePlumChain, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CreatePlumChain {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCreatePlumChain } as CreatePlumChain;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): CreatePlumChain {
    const message = { ...baseCreatePlumChain } as CreatePlumChain;
    return message;
  },

  toJSON(_: CreatePlumChain): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<CreatePlumChain>): CreatePlumChain {
    const message = { ...baseCreatePlumChain } as CreatePlumChain;
    return message;
  },
};

const baseTerminatePlumChain: object = { subChainAddress: "" };

export const TerminatePlumChain = {
  encode(
    message: TerminatePlumChain,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.subChainAddress !== "") {
      writer.uint32(10).string(message.subChainAddress);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): TerminatePlumChain {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTerminatePlumChain } as TerminatePlumChain;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subChainAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TerminatePlumChain {
    const message = { ...baseTerminatePlumChain } as TerminatePlumChain;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    return message;
  },

  toJSON(message: TerminatePlumChain): unknown {
    const obj: any = {};
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    return obj;
  },

  fromPartial(object: DeepPartial<TerminatePlumChain>): TerminatePlumChain {
    const message = { ...baseTerminatePlumChain } as TerminatePlumChain;
    message.subChainAddress = object.subChainAddress ?? "";
    return message;
  },
};

const basePlumPutBlock: object = { subChainAddress: "", height: 0 };

export const PlumPutBlock = {
  encode(message: PlumPutBlock, writer: Writer = Writer.create()): Writer {
    if (message.subChainAddress !== "") {
      writer.uint32(10).string(message.subChainAddress);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint64(message.height);
    }
    Object.entries(message.roots).forEach(([key, value]) => {
      PlumPutBlock_RootsEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PlumPutBlock {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePlumPutBlock } as PlumPutBlock;
    message.roots = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subChainAddress = reader.string();
          break;
        case 2:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          const entry3 = PlumPutBlock_RootsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry3.value !== undefined) {
            message.roots[entry3.key] = entry3.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumPutBlock {
    const message = { ...basePlumPutBlock } as PlumPutBlock;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    message.height =
      object.height !== undefined && object.height !== null
        ? Number(object.height)
        : 0;
    message.roots = {};
    if (object.roots !== undefined && object.roots !== null) {
      Object.entries(object.roots).forEach(([key, value]) => {
        message.roots[key] = bytesFromBase64(value as string);
      });
    }
    return message;
  },

  toJSON(message: PlumPutBlock): unknown {
    const obj: any = {};
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    message.height !== undefined && (obj.height = message.height);
    obj.roots = {};
    if (message.roots) {
      Object.entries(message.roots).forEach(([k, v]) => {
        obj.roots[k] = base64FromBytes(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<PlumPutBlock>): PlumPutBlock {
    const message = { ...basePlumPutBlock } as PlumPutBlock;
    message.subChainAddress = object.subChainAddress ?? "";
    message.height = object.height ?? 0;
    message.roots = {};
    if (object.roots !== undefined && object.roots !== null) {
      Object.entries(object.roots).forEach(([key, value]) => {
        if (value !== undefined) {
          message.roots[key] = value;
        }
      });
    }
    return message;
  },
};

const basePlumPutBlock_RootsEntry: object = { key: "" };

export const PlumPutBlock_RootsEntry = {
  encode(
    message: PlumPutBlock_RootsEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PlumPutBlock_RootsEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...basePlumPutBlock_RootsEntry,
    } as PlumPutBlock_RootsEntry;
    message.value = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumPutBlock_RootsEntry {
    const message = {
      ...basePlumPutBlock_RootsEntry,
    } as PlumPutBlock_RootsEntry;
    message.key =
      object.key !== undefined && object.key !== null ? String(object.key) : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? bytesFromBase64(object.value)
        : new Uint8Array();
    return message;
  },

  toJSON(message: PlumPutBlock_RootsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = base64FromBytes(
        message.value !== undefined ? message.value : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(
    object: DeepPartial<PlumPutBlock_RootsEntry>
  ): PlumPutBlock_RootsEntry {
    const message = {
      ...basePlumPutBlock_RootsEntry,
    } as PlumPutBlock_RootsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? new Uint8Array();
    return message;
  },
};

const basePlumCreateDeposit: object = {
  subChainAddress: "",
  amount: "",
  recipient: "",
};

export const PlumCreateDeposit = {
  encode(message: PlumCreateDeposit, writer: Writer = Writer.create()): Writer {
    if (message.subChainAddress !== "") {
      writer.uint32(10).string(message.subChainAddress);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.recipient !== "") {
      writer.uint32(26).string(message.recipient);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PlumCreateDeposit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePlumCreateDeposit } as PlumCreateDeposit;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subChainAddress = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        case 3:
          message.recipient = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumCreateDeposit {
    const message = { ...basePlumCreateDeposit } as PlumCreateDeposit;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? String(object.amount)
        : "";
    message.recipient =
      object.recipient !== undefined && object.recipient !== null
        ? String(object.recipient)
        : "";
    return message;
  },

  toJSON(message: PlumCreateDeposit): unknown {
    const obj: any = {};
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    message.amount !== undefined && (obj.amount = message.amount);
    message.recipient !== undefined && (obj.recipient = message.recipient);
    return obj;
  },

  fromPartial(object: DeepPartial<PlumCreateDeposit>): PlumCreateDeposit {
    const message = { ...basePlumCreateDeposit } as PlumCreateDeposit;
    message.subChainAddress = object.subChainAddress ?? "";
    message.amount = object.amount ?? "";
    message.recipient = object.recipient ?? "";
    return message;
  },
};

const basePlumStartExit: object = {
  subChainAddress: "",
  previousTransferBlockHeight: 0,
  exitTransferBlockHeight: 0,
};

export const PlumStartExit = {
  encode(message: PlumStartExit, writer: Writer = Writer.create()): Writer {
    if (message.subChainAddress !== "") {
      writer.uint32(10).string(message.subChainAddress);
    }
    if (message.previousTransfer.length !== 0) {
      writer.uint32(18).bytes(message.previousTransfer);
    }
    if (message.previousTransferBlockProof.length !== 0) {
      writer.uint32(26).bytes(message.previousTransferBlockProof);
    }
    if (message.previousTransferBlockHeight !== 0) {
      writer.uint32(32).uint64(message.previousTransferBlockHeight);
    }
    if (message.exitTransfer.length !== 0) {
      writer.uint32(42).bytes(message.exitTransfer);
    }
    if (message.exitTransferBlockProof.length !== 0) {
      writer.uint32(50).bytes(message.exitTransferBlockProof);
    }
    if (message.exitTransferBlockHeight !== 0) {
      writer.uint32(56).uint64(message.exitTransferBlockHeight);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PlumStartExit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePlumStartExit } as PlumStartExit;
    message.previousTransfer = new Uint8Array();
    message.previousTransferBlockProof = new Uint8Array();
    message.exitTransfer = new Uint8Array();
    message.exitTransferBlockProof = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subChainAddress = reader.string();
          break;
        case 2:
          message.previousTransfer = reader.bytes();
          break;
        case 3:
          message.previousTransferBlockProof = reader.bytes();
          break;
        case 4:
          message.previousTransferBlockHeight = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 5:
          message.exitTransfer = reader.bytes();
          break;
        case 6:
          message.exitTransferBlockProof = reader.bytes();
          break;
        case 7:
          message.exitTransferBlockHeight = longToNumber(
            reader.uint64() as Long
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumStartExit {
    const message = { ...basePlumStartExit } as PlumStartExit;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    message.previousTransfer =
      object.previousTransfer !== undefined && object.previousTransfer !== null
        ? bytesFromBase64(object.previousTransfer)
        : new Uint8Array();
    message.previousTransferBlockProof =
      object.previousTransferBlockProof !== undefined &&
      object.previousTransferBlockProof !== null
        ? bytesFromBase64(object.previousTransferBlockProof)
        : new Uint8Array();
    message.previousTransferBlockHeight =
      object.previousTransferBlockHeight !== undefined &&
      object.previousTransferBlockHeight !== null
        ? Number(object.previousTransferBlockHeight)
        : 0;
    message.exitTransfer =
      object.exitTransfer !== undefined && object.exitTransfer !== null
        ? bytesFromBase64(object.exitTransfer)
        : new Uint8Array();
    message.exitTransferBlockProof =
      object.exitTransferBlockProof !== undefined &&
      object.exitTransferBlockProof !== null
        ? bytesFromBase64(object.exitTransferBlockProof)
        : new Uint8Array();
    message.exitTransferBlockHeight =
      object.exitTransferBlockHeight !== undefined &&
      object.exitTransferBlockHeight !== null
        ? Number(object.exitTransferBlockHeight)
        : 0;
    return message;
  },

  toJSON(message: PlumStartExit): unknown {
    const obj: any = {};
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    message.previousTransfer !== undefined &&
      (obj.previousTransfer = base64FromBytes(
        message.previousTransfer !== undefined
          ? message.previousTransfer
          : new Uint8Array()
      ));
    message.previousTransferBlockProof !== undefined &&
      (obj.previousTransferBlockProof = base64FromBytes(
        message.previousTransferBlockProof !== undefined
          ? message.previousTransferBlockProof
          : new Uint8Array()
      ));
    message.previousTransferBlockHeight !== undefined &&
      (obj.previousTransferBlockHeight = message.previousTransferBlockHeight);
    message.exitTransfer !== undefined &&
      (obj.exitTransfer = base64FromBytes(
        message.exitTransfer !== undefined
          ? message.exitTransfer
          : new Uint8Array()
      ));
    message.exitTransferBlockProof !== undefined &&
      (obj.exitTransferBlockProof = base64FromBytes(
        message.exitTransferBlockProof !== undefined
          ? message.exitTransferBlockProof
          : new Uint8Array()
      ));
    message.exitTransferBlockHeight !== undefined &&
      (obj.exitTransferBlockHeight = message.exitTransferBlockHeight);
    return obj;
  },

  fromPartial(object: DeepPartial<PlumStartExit>): PlumStartExit {
    const message = { ...basePlumStartExit } as PlumStartExit;
    message.subChainAddress = object.subChainAddress ?? "";
    message.previousTransfer = object.previousTransfer ?? new Uint8Array();
    message.previousTransferBlockProof =
      object.previousTransferBlockProof ?? new Uint8Array();
    message.previousTransferBlockHeight =
      object.previousTransferBlockHeight ?? 0;
    message.exitTransfer = object.exitTransfer ?? new Uint8Array();
    message.exitTransferBlockProof =
      object.exitTransferBlockProof ?? new Uint8Array();
    message.exitTransferBlockHeight = object.exitTransferBlockHeight ?? 0;
    return message;
  },
};

const basePlumChallengeExit: object = {
  subChainAddress: "",
  coinID: 0,
  challengeTransferBlockHeight: 0,
};

export const PlumChallengeExit = {
  encode(message: PlumChallengeExit, writer: Writer = Writer.create()): Writer {
    if (message.subChainAddress !== "") {
      writer.uint32(10).string(message.subChainAddress);
    }
    if (message.coinID !== 0) {
      writer.uint32(16).uint64(message.coinID);
    }
    if (message.challengeTransfer.length !== 0) {
      writer.uint32(26).bytes(message.challengeTransfer);
    }
    if (message.challengeTransferBlockProof.length !== 0) {
      writer.uint32(34).bytes(message.challengeTransferBlockProof);
    }
    if (message.challengeTransferBlockHeight !== 0) {
      writer.uint32(40).uint64(message.challengeTransferBlockHeight);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PlumChallengeExit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePlumChallengeExit } as PlumChallengeExit;
    message.challengeTransfer = new Uint8Array();
    message.challengeTransferBlockProof = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subChainAddress = reader.string();
          break;
        case 2:
          message.coinID = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.challengeTransfer = reader.bytes();
          break;
        case 4:
          message.challengeTransferBlockProof = reader.bytes();
          break;
        case 5:
          message.challengeTransferBlockHeight = longToNumber(
            reader.uint64() as Long
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumChallengeExit {
    const message = { ...basePlumChallengeExit } as PlumChallengeExit;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    message.coinID =
      object.coinID !== undefined && object.coinID !== null
        ? Number(object.coinID)
        : 0;
    message.challengeTransfer =
      object.challengeTransfer !== undefined &&
      object.challengeTransfer !== null
        ? bytesFromBase64(object.challengeTransfer)
        : new Uint8Array();
    message.challengeTransferBlockProof =
      object.challengeTransferBlockProof !== undefined &&
      object.challengeTransferBlockProof !== null
        ? bytesFromBase64(object.challengeTransferBlockProof)
        : new Uint8Array();
    message.challengeTransferBlockHeight =
      object.challengeTransferBlockHeight !== undefined &&
      object.challengeTransferBlockHeight !== null
        ? Number(object.challengeTransferBlockHeight)
        : 0;
    return message;
  },

  toJSON(message: PlumChallengeExit): unknown {
    const obj: any = {};
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    message.coinID !== undefined && (obj.coinID = message.coinID);
    message.challengeTransfer !== undefined &&
      (obj.challengeTransfer = base64FromBytes(
        message.challengeTransfer !== undefined
          ? message.challengeTransfer
          : new Uint8Array()
      ));
    message.challengeTransferBlockProof !== undefined &&
      (obj.challengeTransferBlockProof = base64FromBytes(
        message.challengeTransferBlockProof !== undefined
          ? message.challengeTransferBlockProof
          : new Uint8Array()
      ));
    message.challengeTransferBlockHeight !== undefined &&
      (obj.challengeTransferBlockHeight = message.challengeTransferBlockHeight);
    return obj;
  },

  fromPartial(object: DeepPartial<PlumChallengeExit>): PlumChallengeExit {
    const message = { ...basePlumChallengeExit } as PlumChallengeExit;
    message.subChainAddress = object.subChainAddress ?? "";
    message.coinID = object.coinID ?? 0;
    message.challengeTransfer = object.challengeTransfer ?? new Uint8Array();
    message.challengeTransferBlockProof =
      object.challengeTransferBlockProof ?? new Uint8Array();
    message.challengeTransferBlockHeight =
      object.challengeTransferBlockHeight ?? 0;
    return message;
  },
};

const basePlumResponseChallengeExit: object = {
  subChainAddress: "",
  coinID: 0,
  previousTransferBlockHeight: 0,
};

export const PlumResponseChallengeExit = {
  encode(
    message: PlumResponseChallengeExit,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.subChainAddress !== "") {
      writer.uint32(10).string(message.subChainAddress);
    }
    if (message.coinID !== 0) {
      writer.uint32(16).uint64(message.coinID);
    }
    if (message.challengeTransfer.length !== 0) {
      writer.uint32(26).bytes(message.challengeTransfer);
    }
    if (message.responseTransfer.length !== 0) {
      writer.uint32(34).bytes(message.responseTransfer);
    }
    if (message.responseTransferBlockProof.length !== 0) {
      writer.uint32(42).bytes(message.responseTransferBlockProof);
    }
    if (message.previousTransferBlockHeight !== 0) {
      writer.uint32(48).uint64(message.previousTransferBlockHeight);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): PlumResponseChallengeExit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...basePlumResponseChallengeExit,
    } as PlumResponseChallengeExit;
    message.challengeTransfer = new Uint8Array();
    message.responseTransfer = new Uint8Array();
    message.responseTransferBlockProof = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subChainAddress = reader.string();
          break;
        case 2:
          message.coinID = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.challengeTransfer = reader.bytes();
          break;
        case 4:
          message.responseTransfer = reader.bytes();
          break;
        case 5:
          message.responseTransferBlockProof = reader.bytes();
          break;
        case 6:
          message.previousTransferBlockHeight = longToNumber(
            reader.uint64() as Long
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumResponseChallengeExit {
    const message = {
      ...basePlumResponseChallengeExit,
    } as PlumResponseChallengeExit;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    message.coinID =
      object.coinID !== undefined && object.coinID !== null
        ? Number(object.coinID)
        : 0;
    message.challengeTransfer =
      object.challengeTransfer !== undefined &&
      object.challengeTransfer !== null
        ? bytesFromBase64(object.challengeTransfer)
        : new Uint8Array();
    message.responseTransfer =
      object.responseTransfer !== undefined && object.responseTransfer !== null
        ? bytesFromBase64(object.responseTransfer)
        : new Uint8Array();
    message.responseTransferBlockProof =
      object.responseTransferBlockProof !== undefined &&
      object.responseTransferBlockProof !== null
        ? bytesFromBase64(object.responseTransferBlockProof)
        : new Uint8Array();
    message.previousTransferBlockHeight =
      object.previousTransferBlockHeight !== undefined &&
      object.previousTransferBlockHeight !== null
        ? Number(object.previousTransferBlockHeight)
        : 0;
    return message;
  },

  toJSON(message: PlumResponseChallengeExit): unknown {
    const obj: any = {};
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    message.coinID !== undefined && (obj.coinID = message.coinID);
    message.challengeTransfer !== undefined &&
      (obj.challengeTransfer = base64FromBytes(
        message.challengeTransfer !== undefined
          ? message.challengeTransfer
          : new Uint8Array()
      ));
    message.responseTransfer !== undefined &&
      (obj.responseTransfer = base64FromBytes(
        message.responseTransfer !== undefined
          ? message.responseTransfer
          : new Uint8Array()
      ));
    message.responseTransferBlockProof !== undefined &&
      (obj.responseTransferBlockProof = base64FromBytes(
        message.responseTransferBlockProof !== undefined
          ? message.responseTransferBlockProof
          : new Uint8Array()
      ));
    message.previousTransferBlockHeight !== undefined &&
      (obj.previousTransferBlockHeight = message.previousTransferBlockHeight);
    return obj;
  },

  fromPartial(
    object: DeepPartial<PlumResponseChallengeExit>
  ): PlumResponseChallengeExit {
    const message = {
      ...basePlumResponseChallengeExit,
    } as PlumResponseChallengeExit;
    message.subChainAddress = object.subChainAddress ?? "";
    message.coinID = object.coinID ?? 0;
    message.challengeTransfer = object.challengeTransfer ?? new Uint8Array();
    message.responseTransfer = object.responseTransfer ?? new Uint8Array();
    message.responseTransferBlockProof =
      object.responseTransferBlockProof ?? new Uint8Array();
    message.previousTransferBlockHeight =
      object.previousTransferBlockHeight ?? 0;
    return message;
  },
};

const basePlumFinalizeExit: object = { subChainAddress: "", coinID: 0 };

export const PlumFinalizeExit = {
  encode(message: PlumFinalizeExit, writer: Writer = Writer.create()): Writer {
    if (message.subChainAddress !== "") {
      writer.uint32(10).string(message.subChainAddress);
    }
    if (message.coinID !== 0) {
      writer.uint32(16).uint64(message.coinID);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PlumFinalizeExit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePlumFinalizeExit } as PlumFinalizeExit;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subChainAddress = reader.string();
          break;
        case 2:
          message.coinID = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumFinalizeExit {
    const message = { ...basePlumFinalizeExit } as PlumFinalizeExit;
    message.subChainAddress =
      object.subChainAddress !== undefined && object.subChainAddress !== null
        ? String(object.subChainAddress)
        : "";
    message.coinID =
      object.coinID !== undefined && object.coinID !== null
        ? Number(object.coinID)
        : 0;
    return message;
  },

  toJSON(message: PlumFinalizeExit): unknown {
    const obj: any = {};
    message.subChainAddress !== undefined &&
      (obj.subChainAddress = message.subChainAddress);
    message.coinID !== undefined && (obj.coinID = message.coinID);
    return obj;
  },

  fromPartial(object: DeepPartial<PlumFinalizeExit>): PlumFinalizeExit {
    const message = { ...basePlumFinalizeExit } as PlumFinalizeExit;
    message.subChainAddress = object.subChainAddress ?? "";
    message.coinID = object.coinID ?? 0;
    return message;
  },
};

const basePlumSettleDeposit: object = { coinID: 0 };

export const PlumSettleDeposit = {
  encode(message: PlumSettleDeposit, writer: Writer = Writer.create()): Writer {
    if (message.coinID !== 0) {
      writer.uint32(8).uint64(message.coinID);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PlumSettleDeposit {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePlumSettleDeposit } as PlumSettleDeposit;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.coinID = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumSettleDeposit {
    const message = { ...basePlumSettleDeposit } as PlumSettleDeposit;
    message.coinID =
      object.coinID !== undefined && object.coinID !== null
        ? Number(object.coinID)
        : 0;
    return message;
  },

  toJSON(message: PlumSettleDeposit): unknown {
    const obj: any = {};
    message.coinID !== undefined && (obj.coinID = message.coinID);
    return obj;
  },

  fromPartial(object: DeepPartial<PlumSettleDeposit>): PlumSettleDeposit {
    const message = { ...basePlumSettleDeposit } as PlumSettleDeposit;
    message.coinID = object.coinID ?? 0;
    return message;
  },
};

const basePlumTransfer: object = { coinID: 0, owner: "", recipient: "" };

export const PlumTransfer = {
  encode(message: PlumTransfer, writer: Writer = Writer.create()): Writer {
    if (message.coinID !== 0) {
      writer.uint32(8).uint64(message.coinID);
    }
    if (message.denomination.length !== 0) {
      writer.uint32(18).bytes(message.denomination);
    }
    if (message.owner !== "") {
      writer.uint32(26).string(message.owner);
    }
    if (message.recipient !== "") {
      writer.uint32(34).string(message.recipient);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PlumTransfer {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePlumTransfer } as PlumTransfer;
    message.denomination = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.coinID = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.denomination = reader.bytes();
          break;
        case 3:
          message.owner = reader.string();
          break;
        case 4:
          message.recipient = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PlumTransfer {
    const message = { ...basePlumTransfer } as PlumTransfer;
    message.coinID =
      object.coinID !== undefined && object.coinID !== null
        ? Number(object.coinID)
        : 0;
    message.denomination =
      object.denomination !== undefined && object.denomination !== null
        ? bytesFromBase64(object.denomination)
        : new Uint8Array();
    message.owner =
      object.owner !== undefined && object.owner !== null
        ? String(object.owner)
        : "";
    message.recipient =
      object.recipient !== undefined && object.recipient !== null
        ? String(object.recipient)
        : "";
    return message;
  },

  toJSON(message: PlumTransfer): unknown {
    const obj: any = {};
    message.coinID !== undefined && (obj.coinID = message.coinID);
    message.denomination !== undefined &&
      (obj.denomination = base64FromBytes(
        message.denomination !== undefined
          ? message.denomination
          : new Uint8Array()
      ));
    message.owner !== undefined && (obj.owner = message.owner);
    message.recipient !== undefined && (obj.recipient = message.recipient);
    return obj;
  },

  fromPartial(object: DeepPartial<PlumTransfer>): PlumTransfer {
    const message = { ...basePlumTransfer } as PlumTransfer;
    message.coinID = object.coinID ?? 0;
    message.denomination = object.denomination ?? new Uint8Array();
    message.owner = object.owner ?? "";
    message.recipient = object.recipient ?? "";
    return message;
  },
};

const baseActionCore: object = {
  version: 0,
  nonce: 0,
  gasLimit: 0,
  gasPrice: "",
};

export const ActionCore = {
  encode(message: ActionCore, writer: Writer = Writer.create()): Writer {
    if (message.version !== 0) {
      writer.uint32(8).uint32(message.version);
    }
    if (message.nonce !== 0) {
      writer.uint32(16).uint64(message.nonce);
    }
    if (message.gasLimit !== 0) {
      writer.uint32(24).uint64(message.gasLimit);
    }
    if (message.gasPrice !== "") {
      writer.uint32(34).string(message.gasPrice);
    }
    if (message.transfer !== undefined) {
      Transfer.encode(message.transfer, writer.uint32(82).fork()).ldelim();
    }
    if (message.execution !== undefined) {
      Execution.encode(message.execution, writer.uint32(98).fork()).ldelim();
    }
    if (message.startSubChain !== undefined) {
      StartSubChain.encode(
        message.startSubChain,
        writer.uint32(106).fork()
      ).ldelim();
    }
    if (message.stopSubChain !== undefined) {
      StopSubChain.encode(
        message.stopSubChain,
        writer.uint32(114).fork()
      ).ldelim();
    }
    if (message.putBlock !== undefined) {
      PutBlock.encode(message.putBlock, writer.uint32(122).fork()).ldelim();
    }
    if (message.createDeposit !== undefined) {
      CreateDeposit.encode(
        message.createDeposit,
        writer.uint32(130).fork()
      ).ldelim();
    }
    if (message.settleDeposit !== undefined) {
      SettleDeposit.encode(
        message.settleDeposit,
        writer.uint32(138).fork()
      ).ldelim();
    }
    if (message.createPlumChain !== undefined) {
      CreatePlumChain.encode(
        message.createPlumChain,
        writer.uint32(146).fork()
      ).ldelim();
    }
    if (message.terminatePlumChain !== undefined) {
      TerminatePlumChain.encode(
        message.terminatePlumChain,
        writer.uint32(154).fork()
      ).ldelim();
    }
    if (message.plumPutBlock !== undefined) {
      PlumPutBlock.encode(
        message.plumPutBlock,
        writer.uint32(162).fork()
      ).ldelim();
    }
    if (message.plumCreateDeposit !== undefined) {
      PlumCreateDeposit.encode(
        message.plumCreateDeposit,
        writer.uint32(170).fork()
      ).ldelim();
    }
    if (message.plumStartExit !== undefined) {
      PlumStartExit.encode(
        message.plumStartExit,
        writer.uint32(178).fork()
      ).ldelim();
    }
    if (message.plumChallengeExit !== undefined) {
      PlumChallengeExit.encode(
        message.plumChallengeExit,
        writer.uint32(186).fork()
      ).ldelim();
    }
    if (message.plumResponseChallengeExit !== undefined) {
      PlumResponseChallengeExit.encode(
        message.plumResponseChallengeExit,
        writer.uint32(194).fork()
      ).ldelim();
    }
    if (message.plumFinalizeExit !== undefined) {
      PlumFinalizeExit.encode(
        message.plumFinalizeExit,
        writer.uint32(202).fork()
      ).ldelim();
    }
    if (message.plumSettleDeposit !== undefined) {
      PlumSettleDeposit.encode(
        message.plumSettleDeposit,
        writer.uint32(210).fork()
      ).ldelim();
    }
    if (message.plumTransfer !== undefined) {
      PlumTransfer.encode(
        message.plumTransfer,
        writer.uint32(218).fork()
      ).ldelim();
    }
    if (message.depositToRewardingFund !== undefined) {
      DepositToRewardingFund.encode(
        message.depositToRewardingFund,
        writer.uint32(242).fork()
      ).ldelim();
    }
    if (message.claimFromRewardingFund !== undefined) {
      ClaimFromRewardingFund.encode(
        message.claimFromRewardingFund,
        writer.uint32(250).fork()
      ).ldelim();
    }
    if (message.grantReward !== undefined) {
      GrantReward.encode(
        message.grantReward,
        writer.uint32(258).fork()
      ).ldelim();
    }
    if (message.stakeCreate !== undefined) {
      StakeCreate.encode(
        message.stakeCreate,
        writer.uint32(322).fork()
      ).ldelim();
    }
    if (message.stakeUnstake !== undefined) {
      StakeReclaim.encode(
        message.stakeUnstake,
        writer.uint32(330).fork()
      ).ldelim();
    }
    if (message.stakeWithdraw !== undefined) {
      StakeReclaim.encode(
        message.stakeWithdraw,
        writer.uint32(338).fork()
      ).ldelim();
    }
    if (message.stakeAddDeposit !== undefined) {
      StakeAddDeposit.encode(
        message.stakeAddDeposit,
        writer.uint32(346).fork()
      ).ldelim();
    }
    if (message.stakeRestake !== undefined) {
      StakeRestake.encode(
        message.stakeRestake,
        writer.uint32(354).fork()
      ).ldelim();
    }
    if (message.stakeChangeCandidate !== undefined) {
      StakeChangeCandidate.encode(
        message.stakeChangeCandidate,
        writer.uint32(362).fork()
      ).ldelim();
    }
    if (message.stakeTransferOwnership !== undefined) {
      StakeTransferOwnership.encode(
        message.stakeTransferOwnership,
        writer.uint32(370).fork()
      ).ldelim();
    }
    if (message.candidateRegister !== undefined) {
      CandidateRegister.encode(
        message.candidateRegister,
        writer.uint32(378).fork()
      ).ldelim();
    }
    if (message.candidateUpdate !== undefined) {
      CandidateBasicInfo.encode(
        message.candidateUpdate,
        writer.uint32(386).fork()
      ).ldelim();
    }
    if (message.putPollResult !== undefined) {
      PutPollResult.encode(
        message.putPollResult,
        writer.uint32(402).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ActionCore {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseActionCore } as ActionCore;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.uint32();
          break;
        case 2:
          message.nonce = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.gasLimit = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.gasPrice = reader.string();
          break;
        case 10:
          message.transfer = Transfer.decode(reader, reader.uint32());
          break;
        case 12:
          message.execution = Execution.decode(reader, reader.uint32());
          break;
        case 13:
          message.startSubChain = StartSubChain.decode(reader, reader.uint32());
          break;
        case 14:
          message.stopSubChain = StopSubChain.decode(reader, reader.uint32());
          break;
        case 15:
          message.putBlock = PutBlock.decode(reader, reader.uint32());
          break;
        case 16:
          message.createDeposit = CreateDeposit.decode(reader, reader.uint32());
          break;
        case 17:
          message.settleDeposit = SettleDeposit.decode(reader, reader.uint32());
          break;
        case 18:
          message.createPlumChain = CreatePlumChain.decode(
            reader,
            reader.uint32()
          );
          break;
        case 19:
          message.terminatePlumChain = TerminatePlumChain.decode(
            reader,
            reader.uint32()
          );
          break;
        case 20:
          message.plumPutBlock = PlumPutBlock.decode(reader, reader.uint32());
          break;
        case 21:
          message.plumCreateDeposit = PlumCreateDeposit.decode(
            reader,
            reader.uint32()
          );
          break;
        case 22:
          message.plumStartExit = PlumStartExit.decode(reader, reader.uint32());
          break;
        case 23:
          message.plumChallengeExit = PlumChallengeExit.decode(
            reader,
            reader.uint32()
          );
          break;
        case 24:
          message.plumResponseChallengeExit = PlumResponseChallengeExit.decode(
            reader,
            reader.uint32()
          );
          break;
        case 25:
          message.plumFinalizeExit = PlumFinalizeExit.decode(
            reader,
            reader.uint32()
          );
          break;
        case 26:
          message.plumSettleDeposit = PlumSettleDeposit.decode(
            reader,
            reader.uint32()
          );
          break;
        case 27:
          message.plumTransfer = PlumTransfer.decode(reader, reader.uint32());
          break;
        case 30:
          message.depositToRewardingFund = DepositToRewardingFund.decode(
            reader,
            reader.uint32()
          );
          break;
        case 31:
          message.claimFromRewardingFund = ClaimFromRewardingFund.decode(
            reader,
            reader.uint32()
          );
          break;
        case 32:
          message.grantReward = GrantReward.decode(reader, reader.uint32());
          break;
        case 40:
          message.stakeCreate = StakeCreate.decode(reader, reader.uint32());
          break;
        case 41:
          message.stakeUnstake = StakeReclaim.decode(reader, reader.uint32());
          break;
        case 42:
          message.stakeWithdraw = StakeReclaim.decode(reader, reader.uint32());
          break;
        case 43:
          message.stakeAddDeposit = StakeAddDeposit.decode(
            reader,
            reader.uint32()
          );
          break;
        case 44:
          message.stakeRestake = StakeRestake.decode(reader, reader.uint32());
          break;
        case 45:
          message.stakeChangeCandidate = StakeChangeCandidate.decode(
            reader,
            reader.uint32()
          );
          break;
        case 46:
          message.stakeTransferOwnership = StakeTransferOwnership.decode(
            reader,
            reader.uint32()
          );
          break;
        case 47:
          message.candidateRegister = CandidateRegister.decode(
            reader,
            reader.uint32()
          );
          break;
        case 48:
          message.candidateUpdate = CandidateBasicInfo.decode(
            reader,
            reader.uint32()
          );
          break;
        case 50:
          message.putPollResult = PutPollResult.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActionCore {
    const message = { ...baseActionCore } as ActionCore;
    message.version =
      object.version !== undefined && object.version !== null
        ? Number(object.version)
        : 0;
    message.nonce =
      object.nonce !== undefined && object.nonce !== null
        ? Number(object.nonce)
        : 0;
    message.gasLimit =
      object.gasLimit !== undefined && object.gasLimit !== null
        ? Number(object.gasLimit)
        : 0;
    message.gasPrice =
      object.gasPrice !== undefined && object.gasPrice !== null
        ? String(object.gasPrice)
        : "";
    message.transfer =
      object.transfer !== undefined && object.transfer !== null
        ? Transfer.fromJSON(object.transfer)
        : undefined;
    message.execution =
      object.execution !== undefined && object.execution !== null
        ? Execution.fromJSON(object.execution)
        : undefined;
    message.startSubChain =
      object.startSubChain !== undefined && object.startSubChain !== null
        ? StartSubChain.fromJSON(object.startSubChain)
        : undefined;
    message.stopSubChain =
      object.stopSubChain !== undefined && object.stopSubChain !== null
        ? StopSubChain.fromJSON(object.stopSubChain)
        : undefined;
    message.putBlock =
      object.putBlock !== undefined && object.putBlock !== null
        ? PutBlock.fromJSON(object.putBlock)
        : undefined;
    message.createDeposit =
      object.createDeposit !== undefined && object.createDeposit !== null
        ? CreateDeposit.fromJSON(object.createDeposit)
        : undefined;
    message.settleDeposit =
      object.settleDeposit !== undefined && object.settleDeposit !== null
        ? SettleDeposit.fromJSON(object.settleDeposit)
        : undefined;
    message.createPlumChain =
      object.createPlumChain !== undefined && object.createPlumChain !== null
        ? CreatePlumChain.fromJSON(object.createPlumChain)
        : undefined;
    message.terminatePlumChain =
      object.terminatePlumChain !== undefined &&
      object.terminatePlumChain !== null
        ? TerminatePlumChain.fromJSON(object.terminatePlumChain)
        : undefined;
    message.plumPutBlock =
      object.plumPutBlock !== undefined && object.plumPutBlock !== null
        ? PlumPutBlock.fromJSON(object.plumPutBlock)
        : undefined;
    message.plumCreateDeposit =
      object.plumCreateDeposit !== undefined &&
      object.plumCreateDeposit !== null
        ? PlumCreateDeposit.fromJSON(object.plumCreateDeposit)
        : undefined;
    message.plumStartExit =
      object.plumStartExit !== undefined && object.plumStartExit !== null
        ? PlumStartExit.fromJSON(object.plumStartExit)
        : undefined;
    message.plumChallengeExit =
      object.plumChallengeExit !== undefined &&
      object.plumChallengeExit !== null
        ? PlumChallengeExit.fromJSON(object.plumChallengeExit)
        : undefined;
    message.plumResponseChallengeExit =
      object.plumResponseChallengeExit !== undefined &&
      object.plumResponseChallengeExit !== null
        ? PlumResponseChallengeExit.fromJSON(object.plumResponseChallengeExit)
        : undefined;
    message.plumFinalizeExit =
      object.plumFinalizeExit !== undefined && object.plumFinalizeExit !== null
        ? PlumFinalizeExit.fromJSON(object.plumFinalizeExit)
        : undefined;
    message.plumSettleDeposit =
      object.plumSettleDeposit !== undefined &&
      object.plumSettleDeposit !== null
        ? PlumSettleDeposit.fromJSON(object.plumSettleDeposit)
        : undefined;
    message.plumTransfer =
      object.plumTransfer !== undefined && object.plumTransfer !== null
        ? PlumTransfer.fromJSON(object.plumTransfer)
        : undefined;
    message.depositToRewardingFund =
      object.depositToRewardingFund !== undefined &&
      object.depositToRewardingFund !== null
        ? DepositToRewardingFund.fromJSON(object.depositToRewardingFund)
        : undefined;
    message.claimFromRewardingFund =
      object.claimFromRewardingFund !== undefined &&
      object.claimFromRewardingFund !== null
        ? ClaimFromRewardingFund.fromJSON(object.claimFromRewardingFund)
        : undefined;
    message.grantReward =
      object.grantReward !== undefined && object.grantReward !== null
        ? GrantReward.fromJSON(object.grantReward)
        : undefined;
    message.stakeCreate =
      object.stakeCreate !== undefined && object.stakeCreate !== null
        ? StakeCreate.fromJSON(object.stakeCreate)
        : undefined;
    message.stakeUnstake =
      object.stakeUnstake !== undefined && object.stakeUnstake !== null
        ? StakeReclaim.fromJSON(object.stakeUnstake)
        : undefined;
    message.stakeWithdraw =
      object.stakeWithdraw !== undefined && object.stakeWithdraw !== null
        ? StakeReclaim.fromJSON(object.stakeWithdraw)
        : undefined;
    message.stakeAddDeposit =
      object.stakeAddDeposit !== undefined && object.stakeAddDeposit !== null
        ? StakeAddDeposit.fromJSON(object.stakeAddDeposit)
        : undefined;
    message.stakeRestake =
      object.stakeRestake !== undefined && object.stakeRestake !== null
        ? StakeRestake.fromJSON(object.stakeRestake)
        : undefined;
    message.stakeChangeCandidate =
      object.stakeChangeCandidate !== undefined &&
      object.stakeChangeCandidate !== null
        ? StakeChangeCandidate.fromJSON(object.stakeChangeCandidate)
        : undefined;
    message.stakeTransferOwnership =
      object.stakeTransferOwnership !== undefined &&
      object.stakeTransferOwnership !== null
        ? StakeTransferOwnership.fromJSON(object.stakeTransferOwnership)
        : undefined;
    message.candidateRegister =
      object.candidateRegister !== undefined &&
      object.candidateRegister !== null
        ? CandidateRegister.fromJSON(object.candidateRegister)
        : undefined;
    message.candidateUpdate =
      object.candidateUpdate !== undefined && object.candidateUpdate !== null
        ? CandidateBasicInfo.fromJSON(object.candidateUpdate)
        : undefined;
    message.putPollResult =
      object.putPollResult !== undefined && object.putPollResult !== null
        ? PutPollResult.fromJSON(object.putPollResult)
        : undefined;
    return message;
  },

  toJSON(message: ActionCore): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.gasLimit !== undefined && (obj.gasLimit = message.gasLimit);
    message.gasPrice !== undefined && (obj.gasPrice = message.gasPrice);
    message.transfer !== undefined &&
      (obj.transfer = message.transfer
        ? Transfer.toJSON(message.transfer)
        : undefined);
    message.execution !== undefined &&
      (obj.execution = message.execution
        ? Execution.toJSON(message.execution)
        : undefined);
    message.startSubChain !== undefined &&
      (obj.startSubChain = message.startSubChain
        ? StartSubChain.toJSON(message.startSubChain)
        : undefined);
    message.stopSubChain !== undefined &&
      (obj.stopSubChain = message.stopSubChain
        ? StopSubChain.toJSON(message.stopSubChain)
        : undefined);
    message.putBlock !== undefined &&
      (obj.putBlock = message.putBlock
        ? PutBlock.toJSON(message.putBlock)
        : undefined);
    message.createDeposit !== undefined &&
      (obj.createDeposit = message.createDeposit
        ? CreateDeposit.toJSON(message.createDeposit)
        : undefined);
    message.settleDeposit !== undefined &&
      (obj.settleDeposit = message.settleDeposit
        ? SettleDeposit.toJSON(message.settleDeposit)
        : undefined);
    message.createPlumChain !== undefined &&
      (obj.createPlumChain = message.createPlumChain
        ? CreatePlumChain.toJSON(message.createPlumChain)
        : undefined);
    message.terminatePlumChain !== undefined &&
      (obj.terminatePlumChain = message.terminatePlumChain
        ? TerminatePlumChain.toJSON(message.terminatePlumChain)
        : undefined);
    message.plumPutBlock !== undefined &&
      (obj.plumPutBlock = message.plumPutBlock
        ? PlumPutBlock.toJSON(message.plumPutBlock)
        : undefined);
    message.plumCreateDeposit !== undefined &&
      (obj.plumCreateDeposit = message.plumCreateDeposit
        ? PlumCreateDeposit.toJSON(message.plumCreateDeposit)
        : undefined);
    message.plumStartExit !== undefined &&
      (obj.plumStartExit = message.plumStartExit
        ? PlumStartExit.toJSON(message.plumStartExit)
        : undefined);
    message.plumChallengeExit !== undefined &&
      (obj.plumChallengeExit = message.plumChallengeExit
        ? PlumChallengeExit.toJSON(message.plumChallengeExit)
        : undefined);
    message.plumResponseChallengeExit !== undefined &&
      (obj.plumResponseChallengeExit = message.plumResponseChallengeExit
        ? PlumResponseChallengeExit.toJSON(message.plumResponseChallengeExit)
        : undefined);
    message.plumFinalizeExit !== undefined &&
      (obj.plumFinalizeExit = message.plumFinalizeExit
        ? PlumFinalizeExit.toJSON(message.plumFinalizeExit)
        : undefined);
    message.plumSettleDeposit !== undefined &&
      (obj.plumSettleDeposit = message.plumSettleDeposit
        ? PlumSettleDeposit.toJSON(message.plumSettleDeposit)
        : undefined);
    message.plumTransfer !== undefined &&
      (obj.plumTransfer = message.plumTransfer
        ? PlumTransfer.toJSON(message.plumTransfer)
        : undefined);
    message.depositToRewardingFund !== undefined &&
      (obj.depositToRewardingFund = message.depositToRewardingFund
        ? DepositToRewardingFund.toJSON(message.depositToRewardingFund)
        : undefined);
    message.claimFromRewardingFund !== undefined &&
      (obj.claimFromRewardingFund = message.claimFromRewardingFund
        ? ClaimFromRewardingFund.toJSON(message.claimFromRewardingFund)
        : undefined);
    message.grantReward !== undefined &&
      (obj.grantReward = message.grantReward
        ? GrantReward.toJSON(message.grantReward)
        : undefined);
    message.stakeCreate !== undefined &&
      (obj.stakeCreate = message.stakeCreate
        ? StakeCreate.toJSON(message.stakeCreate)
        : undefined);
    message.stakeUnstake !== undefined &&
      (obj.stakeUnstake = message.stakeUnstake
        ? StakeReclaim.toJSON(message.stakeUnstake)
        : undefined);
    message.stakeWithdraw !== undefined &&
      (obj.stakeWithdraw = message.stakeWithdraw
        ? StakeReclaim.toJSON(message.stakeWithdraw)
        : undefined);
    message.stakeAddDeposit !== undefined &&
      (obj.stakeAddDeposit = message.stakeAddDeposit
        ? StakeAddDeposit.toJSON(message.stakeAddDeposit)
        : undefined);
    message.stakeRestake !== undefined &&
      (obj.stakeRestake = message.stakeRestake
        ? StakeRestake.toJSON(message.stakeRestake)
        : undefined);
    message.stakeChangeCandidate !== undefined &&
      (obj.stakeChangeCandidate = message.stakeChangeCandidate
        ? StakeChangeCandidate.toJSON(message.stakeChangeCandidate)
        : undefined);
    message.stakeTransferOwnership !== undefined &&
      (obj.stakeTransferOwnership = message.stakeTransferOwnership
        ? StakeTransferOwnership.toJSON(message.stakeTransferOwnership)
        : undefined);
    message.candidateRegister !== undefined &&
      (obj.candidateRegister = message.candidateRegister
        ? CandidateRegister.toJSON(message.candidateRegister)
        : undefined);
    message.candidateUpdate !== undefined &&
      (obj.candidateUpdate = message.candidateUpdate
        ? CandidateBasicInfo.toJSON(message.candidateUpdate)
        : undefined);
    message.putPollResult !== undefined &&
      (obj.putPollResult = message.putPollResult
        ? PutPollResult.toJSON(message.putPollResult)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ActionCore>): ActionCore {
    const message = { ...baseActionCore } as ActionCore;
    message.version = object.version ?? 0;
    message.nonce = object.nonce ?? 0;
    message.gasLimit = object.gasLimit ?? 0;
    message.gasPrice = object.gasPrice ?? "";
    message.transfer =
      object.transfer !== undefined && object.transfer !== null
        ? Transfer.fromPartial(object.transfer)
        : undefined;
    message.execution =
      object.execution !== undefined && object.execution !== null
        ? Execution.fromPartial(object.execution)
        : undefined;
    message.startSubChain =
      object.startSubChain !== undefined && object.startSubChain !== null
        ? StartSubChain.fromPartial(object.startSubChain)
        : undefined;
    message.stopSubChain =
      object.stopSubChain !== undefined && object.stopSubChain !== null
        ? StopSubChain.fromPartial(object.stopSubChain)
        : undefined;
    message.putBlock =
      object.putBlock !== undefined && object.putBlock !== null
        ? PutBlock.fromPartial(object.putBlock)
        : undefined;
    message.createDeposit =
      object.createDeposit !== undefined && object.createDeposit !== null
        ? CreateDeposit.fromPartial(object.createDeposit)
        : undefined;
    message.settleDeposit =
      object.settleDeposit !== undefined && object.settleDeposit !== null
        ? SettleDeposit.fromPartial(object.settleDeposit)
        : undefined;
    message.createPlumChain =
      object.createPlumChain !== undefined && object.createPlumChain !== null
        ? CreatePlumChain.fromPartial(object.createPlumChain)
        : undefined;
    message.terminatePlumChain =
      object.terminatePlumChain !== undefined &&
      object.terminatePlumChain !== null
        ? TerminatePlumChain.fromPartial(object.terminatePlumChain)
        : undefined;
    message.plumPutBlock =
      object.plumPutBlock !== undefined && object.plumPutBlock !== null
        ? PlumPutBlock.fromPartial(object.plumPutBlock)
        : undefined;
    message.plumCreateDeposit =
      object.plumCreateDeposit !== undefined &&
      object.plumCreateDeposit !== null
        ? PlumCreateDeposit.fromPartial(object.plumCreateDeposit)
        : undefined;
    message.plumStartExit =
      object.plumStartExit !== undefined && object.plumStartExit !== null
        ? PlumStartExit.fromPartial(object.plumStartExit)
        : undefined;
    message.plumChallengeExit =
      object.plumChallengeExit !== undefined &&
      object.plumChallengeExit !== null
        ? PlumChallengeExit.fromPartial(object.plumChallengeExit)
        : undefined;
    message.plumResponseChallengeExit =
      object.plumResponseChallengeExit !== undefined &&
      object.plumResponseChallengeExit !== null
        ? PlumResponseChallengeExit.fromPartial(
            object.plumResponseChallengeExit
          )
        : undefined;
    message.plumFinalizeExit =
      object.plumFinalizeExit !== undefined && object.plumFinalizeExit !== null
        ? PlumFinalizeExit.fromPartial(object.plumFinalizeExit)
        : undefined;
    message.plumSettleDeposit =
      object.plumSettleDeposit !== undefined &&
      object.plumSettleDeposit !== null
        ? PlumSettleDeposit.fromPartial(object.plumSettleDeposit)
        : undefined;
    message.plumTransfer =
      object.plumTransfer !== undefined && object.plumTransfer !== null
        ? PlumTransfer.fromPartial(object.plumTransfer)
        : undefined;
    message.depositToRewardingFund =
      object.depositToRewardingFund !== undefined &&
      object.depositToRewardingFund !== null
        ? DepositToRewardingFund.fromPartial(object.depositToRewardingFund)
        : undefined;
    message.claimFromRewardingFund =
      object.claimFromRewardingFund !== undefined &&
      object.claimFromRewardingFund !== null
        ? ClaimFromRewardingFund.fromPartial(object.claimFromRewardingFund)
        : undefined;
    message.grantReward =
      object.grantReward !== undefined && object.grantReward !== null
        ? GrantReward.fromPartial(object.grantReward)
        : undefined;
    message.stakeCreate =
      object.stakeCreate !== undefined && object.stakeCreate !== null
        ? StakeCreate.fromPartial(object.stakeCreate)
        : undefined;
    message.stakeUnstake =
      object.stakeUnstake !== undefined && object.stakeUnstake !== null
        ? StakeReclaim.fromPartial(object.stakeUnstake)
        : undefined;
    message.stakeWithdraw =
      object.stakeWithdraw !== undefined && object.stakeWithdraw !== null
        ? StakeReclaim.fromPartial(object.stakeWithdraw)
        : undefined;
    message.stakeAddDeposit =
      object.stakeAddDeposit !== undefined && object.stakeAddDeposit !== null
        ? StakeAddDeposit.fromPartial(object.stakeAddDeposit)
        : undefined;
    message.stakeRestake =
      object.stakeRestake !== undefined && object.stakeRestake !== null
        ? StakeRestake.fromPartial(object.stakeRestake)
        : undefined;
    message.stakeChangeCandidate =
      object.stakeChangeCandidate !== undefined &&
      object.stakeChangeCandidate !== null
        ? StakeChangeCandidate.fromPartial(object.stakeChangeCandidate)
        : undefined;
    message.stakeTransferOwnership =
      object.stakeTransferOwnership !== undefined &&
      object.stakeTransferOwnership !== null
        ? StakeTransferOwnership.fromPartial(object.stakeTransferOwnership)
        : undefined;
    message.candidateRegister =
      object.candidateRegister !== undefined &&
      object.candidateRegister !== null
        ? CandidateRegister.fromPartial(object.candidateRegister)
        : undefined;
    message.candidateUpdate =
      object.candidateUpdate !== undefined && object.candidateUpdate !== null
        ? CandidateBasicInfo.fromPartial(object.candidateUpdate)
        : undefined;
    message.putPollResult =
      object.putPollResult !== undefined && object.putPollResult !== null
        ? PutPollResult.fromPartial(object.putPollResult)
        : undefined;
    return message;
  },
};

const baseAction: object = {};

export const Action = {
  encode(message: Action, writer: Writer = Writer.create()): Writer {
    if (message.core !== undefined) {
      ActionCore.encode(message.core, writer.uint32(10).fork()).ldelim();
    }
    if (message.senderPubKey.length !== 0) {
      writer.uint32(18).bytes(message.senderPubKey);
    }
    if (message.signature.length !== 0) {
      writer.uint32(26).bytes(message.signature);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Action {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAction } as Action;
    message.senderPubKey = new Uint8Array();
    message.signature = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.core = ActionCore.decode(reader, reader.uint32());
          break;
        case 2:
          message.senderPubKey = reader.bytes();
          break;
        case 3:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Action {
    const message = { ...baseAction } as Action;
    message.core =
      object.core !== undefined && object.core !== null
        ? ActionCore.fromJSON(object.core)
        : undefined;
    message.senderPubKey =
      object.senderPubKey !== undefined && object.senderPubKey !== null
        ? bytesFromBase64(object.senderPubKey)
        : new Uint8Array();
    message.signature =
      object.signature !== undefined && object.signature !== null
        ? bytesFromBase64(object.signature)
        : new Uint8Array();
    return message;
  },

  toJSON(message: Action): unknown {
    const obj: any = {};
    message.core !== undefined &&
      (obj.core = message.core ? ActionCore.toJSON(message.core) : undefined);
    message.senderPubKey !== undefined &&
      (obj.senderPubKey = base64FromBytes(
        message.senderPubKey !== undefined
          ? message.senderPubKey
          : new Uint8Array()
      ));
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(
        message.signature !== undefined ? message.signature : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<Action>): Action {
    const message = { ...baseAction } as Action;
    message.core =
      object.core !== undefined && object.core !== null
        ? ActionCore.fromPartial(object.core)
        : undefined;
    message.senderPubKey = object.senderPubKey ?? new Uint8Array();
    message.signature = object.signature ?? new Uint8Array();
    return message;
  },
};

const baseReceipt: object = {
  status: 0,
  blkHeight: 0,
  gasConsumed: 0,
  contractAddress: "",
};

export const Receipt = {
  encode(message: Receipt, writer: Writer = Writer.create()): Writer {
    if (message.status !== 0) {
      writer.uint32(8).uint64(message.status);
    }
    if (message.blkHeight !== 0) {
      writer.uint32(16).uint64(message.blkHeight);
    }
    if (message.actHash.length !== 0) {
      writer.uint32(26).bytes(message.actHash);
    }
    if (message.gasConsumed !== 0) {
      writer.uint32(32).uint64(message.gasConsumed);
    }
    if (message.contractAddress !== "") {
      writer.uint32(42).string(message.contractAddress);
    }
    for (const v of message.logs) {
      Log.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Receipt {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReceipt } as Receipt;
    message.logs = [];
    message.actHash = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.blkHeight = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.actHash = reader.bytes();
          break;
        case 4:
          message.gasConsumed = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.contractAddress = reader.string();
          break;
        case 6:
          message.logs.push(Log.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Receipt {
    const message = { ...baseReceipt } as Receipt;
    message.status =
      object.status !== undefined && object.status !== null
        ? Number(object.status)
        : 0;
    message.blkHeight =
      object.blkHeight !== undefined && object.blkHeight !== null
        ? Number(object.blkHeight)
        : 0;
    message.actHash =
      object.actHash !== undefined && object.actHash !== null
        ? bytesFromBase64(object.actHash)
        : new Uint8Array();
    message.gasConsumed =
      object.gasConsumed !== undefined && object.gasConsumed !== null
        ? Number(object.gasConsumed)
        : 0;
    message.contractAddress =
      object.contractAddress !== undefined && object.contractAddress !== null
        ? String(object.contractAddress)
        : "";
    message.logs = (object.logs ?? []).map((e: any) => Log.fromJSON(e));
    return message;
  },

  toJSON(message: Receipt): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    message.blkHeight !== undefined && (obj.blkHeight = message.blkHeight);
    message.actHash !== undefined &&
      (obj.actHash = base64FromBytes(
        message.actHash !== undefined ? message.actHash : new Uint8Array()
      ));
    message.gasConsumed !== undefined &&
      (obj.gasConsumed = message.gasConsumed);
    message.contractAddress !== undefined &&
      (obj.contractAddress = message.contractAddress);
    if (message.logs) {
      obj.logs = message.logs.map((e) => (e ? Log.toJSON(e) : undefined));
    } else {
      obj.logs = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Receipt>): Receipt {
    const message = { ...baseReceipt } as Receipt;
    message.status = object.status ?? 0;
    message.blkHeight = object.blkHeight ?? 0;
    message.actHash = object.actHash ?? new Uint8Array();
    message.gasConsumed = object.gasConsumed ?? 0;
    message.contractAddress = object.contractAddress ?? "";
    message.logs = (object.logs ?? []).map((e) => Log.fromPartial(e));
    return message;
  },
};

const baseLog: object = { contractAddress: "", blkHeight: 0, index: 0 };

export const Log = {
  encode(message: Log, writer: Writer = Writer.create()): Writer {
    if (message.contractAddress !== "") {
      writer.uint32(10).string(message.contractAddress);
    }
    for (const v of message.topics) {
      writer.uint32(18).bytes(v!);
    }
    if (message.data.length !== 0) {
      writer.uint32(26).bytes(message.data);
    }
    if (message.blkHeight !== 0) {
      writer.uint32(32).uint64(message.blkHeight);
    }
    if (message.actHash.length !== 0) {
      writer.uint32(42).bytes(message.actHash);
    }
    if (message.index !== 0) {
      writer.uint32(48).uint32(message.index);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Log {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLog } as Log;
    message.topics = [];
    message.data = new Uint8Array();
    message.actHash = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contractAddress = reader.string();
          break;
        case 2:
          message.topics.push(reader.bytes());
          break;
        case 3:
          message.data = reader.bytes();
          break;
        case 4:
          message.blkHeight = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.actHash = reader.bytes();
          break;
        case 6:
          message.index = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Log {
    const message = { ...baseLog } as Log;
    message.contractAddress =
      object.contractAddress !== undefined && object.contractAddress !== null
        ? String(object.contractAddress)
        : "";
    message.topics = (object.topics ?? []).map((e: any) => bytesFromBase64(e));
    message.data =
      object.data !== undefined && object.data !== null
        ? bytesFromBase64(object.data)
        : new Uint8Array();
    message.blkHeight =
      object.blkHeight !== undefined && object.blkHeight !== null
        ? Number(object.blkHeight)
        : 0;
    message.actHash =
      object.actHash !== undefined && object.actHash !== null
        ? bytesFromBase64(object.actHash)
        : new Uint8Array();
    message.index =
      object.index !== undefined && object.index !== null
        ? Number(object.index)
        : 0;
    return message;
  },

  toJSON(message: Log): unknown {
    const obj: any = {};
    message.contractAddress !== undefined &&
      (obj.contractAddress = message.contractAddress);
    if (message.topics) {
      obj.topics = message.topics.map((e) =>
        base64FromBytes(e !== undefined ? e : new Uint8Array())
      );
    } else {
      obj.topics = [];
    }
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    message.blkHeight !== undefined && (obj.blkHeight = message.blkHeight);
    message.actHash !== undefined &&
      (obj.actHash = base64FromBytes(
        message.actHash !== undefined ? message.actHash : new Uint8Array()
      ));
    message.index !== undefined && (obj.index = message.index);
    return obj;
  },

  fromPartial(object: DeepPartial<Log>): Log {
    const message = { ...baseLog } as Log;
    message.contractAddress = object.contractAddress ?? "";
    message.topics = (object.topics ?? []).map((e) => e);
    message.data = object.data ?? new Uint8Array();
    message.blkHeight = object.blkHeight ?? 0;
    message.actHash = object.actHash ?? new Uint8Array();
    message.index = object.index ?? 0;
    return message;
  },
};

const baseEvmTransfer: object = { from: "", to: "" };

export const EvmTransfer = {
  encode(message: EvmTransfer, writer: Writer = Writer.create()): Writer {
    if (message.amount.length !== 0) {
      writer.uint32(10).bytes(message.amount);
    }
    if (message.from !== "") {
      writer.uint32(18).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(26).string(message.to);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EvmTransfer {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEvmTransfer } as EvmTransfer;
    message.amount = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.bytes();
          break;
        case 2:
          message.from = reader.string();
          break;
        case 3:
          message.to = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EvmTransfer {
    const message = { ...baseEvmTransfer } as EvmTransfer;
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? bytesFromBase64(object.amount)
        : new Uint8Array();
    message.from =
      object.from !== undefined && object.from !== null
        ? String(object.from)
        : "";
    message.to =
      object.to !== undefined && object.to !== null ? String(object.to) : "";
    return message;
  },

  toJSON(message: EvmTransfer): unknown {
    const obj: any = {};
    message.amount !== undefined &&
      (obj.amount = base64FromBytes(
        message.amount !== undefined ? message.amount : new Uint8Array()
      ));
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    return obj;
  },

  fromPartial(object: DeepPartial<EvmTransfer>): EvmTransfer {
    const message = { ...baseEvmTransfer } as EvmTransfer;
    message.amount = object.amount ?? new Uint8Array();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    return message;
  },
};

const baseEvmTransferList: object = {};

export const EvmTransferList = {
  encode(message: EvmTransferList, writer: Writer = Writer.create()): Writer {
    for (const v of message.evmTransfers) {
      EvmTransfer.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EvmTransferList {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEvmTransferList } as EvmTransferList;
    message.evmTransfers = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.evmTransfers.push(
            EvmTransfer.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EvmTransferList {
    const message = { ...baseEvmTransferList } as EvmTransferList;
    message.evmTransfers = (object.evmTransfers ?? []).map((e: any) =>
      EvmTransfer.fromJSON(e)
    );
    return message;
  },

  toJSON(message: EvmTransferList): unknown {
    const obj: any = {};
    if (message.evmTransfers) {
      obj.evmTransfers = message.evmTransfers.map((e) =>
        e ? EvmTransfer.toJSON(e) : undefined
      );
    } else {
      obj.evmTransfers = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<EvmTransferList>): EvmTransferList {
    const message = { ...baseEvmTransferList } as EvmTransferList;
    message.evmTransfers = (object.evmTransfers ?? []).map((e) =>
      EvmTransfer.fromPartial(e)
    );
    return message;
  },
};

const baseActionEvmTransfer: object = { numEvmTransfers: 0 };

export const ActionEvmTransfer = {
  encode(message: ActionEvmTransfer, writer: Writer = Writer.create()): Writer {
    if (message.actionHash.length !== 0) {
      writer.uint32(10).bytes(message.actionHash);
    }
    if (message.numEvmTransfers !== 0) {
      writer.uint32(16).uint64(message.numEvmTransfers);
    }
    for (const v of message.evmTransfers) {
      EvmTransfer.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ActionEvmTransfer {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseActionEvmTransfer } as ActionEvmTransfer;
    message.evmTransfers = [];
    message.actionHash = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.actionHash = reader.bytes();
          break;
        case 2:
          message.numEvmTransfers = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.evmTransfers.push(
            EvmTransfer.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActionEvmTransfer {
    const message = { ...baseActionEvmTransfer } as ActionEvmTransfer;
    message.actionHash =
      object.actionHash !== undefined && object.actionHash !== null
        ? bytesFromBase64(object.actionHash)
        : new Uint8Array();
    message.numEvmTransfers =
      object.numEvmTransfers !== undefined && object.numEvmTransfers !== null
        ? Number(object.numEvmTransfers)
        : 0;
    message.evmTransfers = (object.evmTransfers ?? []).map((e: any) =>
      EvmTransfer.fromJSON(e)
    );
    return message;
  },

  toJSON(message: ActionEvmTransfer): unknown {
    const obj: any = {};
    message.actionHash !== undefined &&
      (obj.actionHash = base64FromBytes(
        message.actionHash !== undefined ? message.actionHash : new Uint8Array()
      ));
    message.numEvmTransfers !== undefined &&
      (obj.numEvmTransfers = message.numEvmTransfers);
    if (message.evmTransfers) {
      obj.evmTransfers = message.evmTransfers.map((e) =>
        e ? EvmTransfer.toJSON(e) : undefined
      );
    } else {
      obj.evmTransfers = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ActionEvmTransfer>): ActionEvmTransfer {
    const message = { ...baseActionEvmTransfer } as ActionEvmTransfer;
    message.actionHash = object.actionHash ?? new Uint8Array();
    message.numEvmTransfers = object.numEvmTransfers ?? 0;
    message.evmTransfers = (object.evmTransfers ?? []).map((e) =>
      EvmTransfer.fromPartial(e)
    );
    return message;
  },
};

const baseBlockEvmTransfer: object = { blockHeight: 0, numEvmTransfers: 0 };

export const BlockEvmTransfer = {
  encode(message: BlockEvmTransfer, writer: Writer = Writer.create()): Writer {
    if (message.blockHeight !== 0) {
      writer.uint32(8).uint64(message.blockHeight);
    }
    if (message.numEvmTransfers !== 0) {
      writer.uint32(16).uint64(message.numEvmTransfers);
    }
    for (const v of message.actionEvmTransfers) {
      ActionEvmTransfer.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): BlockEvmTransfer {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBlockEvmTransfer } as BlockEvmTransfer;
    message.actionEvmTransfers = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.blockHeight = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.numEvmTransfers = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.actionEvmTransfers.push(
            ActionEvmTransfer.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BlockEvmTransfer {
    const message = { ...baseBlockEvmTransfer } as BlockEvmTransfer;
    message.blockHeight =
      object.blockHeight !== undefined && object.blockHeight !== null
        ? Number(object.blockHeight)
        : 0;
    message.numEvmTransfers =
      object.numEvmTransfers !== undefined && object.numEvmTransfers !== null
        ? Number(object.numEvmTransfers)
        : 0;
    message.actionEvmTransfers = (object.actionEvmTransfers ?? []).map(
      (e: any) => ActionEvmTransfer.fromJSON(e)
    );
    return message;
  },

  toJSON(message: BlockEvmTransfer): unknown {
    const obj: any = {};
    message.blockHeight !== undefined &&
      (obj.blockHeight = message.blockHeight);
    message.numEvmTransfers !== undefined &&
      (obj.numEvmTransfers = message.numEvmTransfers);
    if (message.actionEvmTransfers) {
      obj.actionEvmTransfers = message.actionEvmTransfers.map((e) =>
        e ? ActionEvmTransfer.toJSON(e) : undefined
      );
    } else {
      obj.actionEvmTransfers = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<BlockEvmTransfer>): BlockEvmTransfer {
    const message = { ...baseBlockEvmTransfer } as BlockEvmTransfer;
    message.blockHeight = object.blockHeight ?? 0;
    message.numEvmTransfers = object.numEvmTransfers ?? 0;
    message.actionEvmTransfers = (object.actionEvmTransfers ?? []).map((e) =>
      ActionEvmTransfer.fromPartial(e)
    );
    return message;
  },
};

const baseDepositToRewardingFund: object = { amount: "" };

export const DepositToRewardingFund = {
  encode(
    message: DepositToRewardingFund,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.amount !== "") {
      writer.uint32(10).string(message.amount);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DepositToRewardingFund {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDepositToRewardingFund } as DepositToRewardingFund;
    message.data = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.string();
          break;
        case 2:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DepositToRewardingFund {
    const message = { ...baseDepositToRewardingFund } as DepositToRewardingFund;
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? String(object.amount)
        : "";
    message.data =
      object.data !== undefined && object.data !== null
        ? bytesFromBase64(object.data)
        : new Uint8Array();
    return message;
  },

  toJSON(message: DepositToRewardingFund): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(
    object: DeepPartial<DepositToRewardingFund>
  ): DepositToRewardingFund {
    const message = { ...baseDepositToRewardingFund } as DepositToRewardingFund;
    message.amount = object.amount ?? "";
    message.data = object.data ?? new Uint8Array();
    return message;
  },
};

const baseClaimFromRewardingFund: object = { amount: "" };

export const ClaimFromRewardingFund = {
  encode(
    message: ClaimFromRewardingFund,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.amount !== "") {
      writer.uint32(10).string(message.amount);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ClaimFromRewardingFund {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseClaimFromRewardingFund } as ClaimFromRewardingFund;
    message.data = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.string();
          break;
        case 2:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClaimFromRewardingFund {
    const message = { ...baseClaimFromRewardingFund } as ClaimFromRewardingFund;
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? String(object.amount)
        : "";
    message.data =
      object.data !== undefined && object.data !== null
        ? bytesFromBase64(object.data)
        : new Uint8Array();
    return message;
  },

  toJSON(message: ClaimFromRewardingFund): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(
    object: DeepPartial<ClaimFromRewardingFund>
  ): ClaimFromRewardingFund {
    const message = { ...baseClaimFromRewardingFund } as ClaimFromRewardingFund;
    message.amount = object.amount ?? "";
    message.data = object.data ?? new Uint8Array();
    return message;
  },
};

const baseGrantReward: object = { type: 0, height: 0 };

export const GrantReward = {
  encode(message: GrantReward, writer: Writer = Writer.create()): Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint64(message.height);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GrantReward {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGrantReward } as GrantReward;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        case 2:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GrantReward {
    const message = { ...baseGrantReward } as GrantReward;
    message.type =
      object.type !== undefined && object.type !== null
        ? rewardTypeFromJSON(object.type)
        : 0;
    message.height =
      object.height !== undefined && object.height !== null
        ? Number(object.height)
        : 0;
    return message;
  },

  toJSON(message: GrantReward): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = rewardTypeToJSON(message.type));
    message.height !== undefined && (obj.height = message.height);
    return obj;
  },

  fromPartial(object: DeepPartial<GrantReward>): GrantReward {
    const message = { ...baseGrantReward } as GrantReward;
    message.type = object.type ?? 0;
    message.height = object.height ?? 0;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
