import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDSQI2GWKWN6Z2K37EL35ONYGGEJK74PVX3MZJOX7EOLQBY5W5LR4Y4A",
  }
} as const

export const Err = {
  1: {message:"AlreadyExists"},
  2: {message:"NotFound"},
  3: {message:"NotPayer"},
  4: {message:"NotApprover"},
  5: {message:"BadPercents"},
  6: {message:"ZeroPayees"},
  7: {message:"Closed"},
  8: {message:"OverBudget"},
  9: {message:"PastDeadline"}
}


export interface Share {
  bps: u32;
  recipient: string;
}


export interface Agreement {
  approvers: Array<string>;
  budget: i128;
  closed: boolean;
  deadline: u64;
  payees: Array<Share>;
  payer: string;
  released: i128;
  token: string;
}

export type DataKey = {tag: "Agreement", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a create_agreement transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Create a new agreement (job) under a unique id.
   * Caller must be the payer (require_auth).
   */
  create_agreement: ({id, payer, token, payees, budget, deadline, approvers}: {id: string, payer: string, token: string, payees: Array<Share>, budget: i128, deadline: u64, approvers: Array<string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a release transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pay out a portion of the budget to a specific contractor (ad-hoc amount).
   * Must be called by the `payer` or any address in `approvers`.
   */
  release: ({id, contractor, amount}: {id: string, contractor: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a release_split transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Release using the stored default bps split over a specific `total_amount`.
   * Useful for one-click split when milestones are met.
   */
  release_split: ({id, total_amount}: {id: string, total_amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a close transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Close/refund path: prevents further releases.
   * Only the payer can close; typically called after deadline (you can enforce or relax).
   */
  close: ({id}: {id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Read helpers
   */
  get: ({id}: {id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Agreement>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAAA0VycgAAAAAJAAAAAAAAAA1BbHJlYWR5RXhpc3RzAAAAAAAAAQAAAAAAAAAITm90Rm91bmQAAAACAAAAAAAAAAhOb3RQYXllcgAAAAMAAAAAAAAAC05vdEFwcHJvdmVyAAAAAAQAAAAAAAAAC0JhZFBlcmNlbnRzAAAAAAUAAAAAAAAAClplcm9QYXllZXMAAAAAAAYAAAAAAAAABkNsb3NlZAAAAAAABwAAAAAAAAAKT3ZlckJ1ZGdldAAAAAAACAAAAAAAAAAMUGFzdERlYWRsaW5lAAAACQ==",
        "AAAAAQAAAAAAAAAAAAAABVNoYXJlAAAAAAAAAgAAAAAAAAADYnBzAAAAAAQAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAACUFncmVlbWVudAAAAAAAAAgAAAAAAAAACWFwcHJvdmVycwAAAAAAA+oAAAATAAAAAAAAAAZidWRnZXQAAAAAAAsAAAAAAAAABmNsb3NlZAAAAAAAAQAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAAZwYXllZXMAAAAAA+oAAAfQAAAABVNoYXJlAAAAAAAAAAAAAAVwYXllcgAAAAAAABMAAAAAAAAACHJlbGVhc2VkAAAACwAAAAAAAAAFdG9rZW4AAAAAAAAT",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAACUFncmVlbWVudAAAAAAAAAEAAAAR",
        "AAAAAAAAAFhDcmVhdGUgYSBuZXcgYWdyZWVtZW50IChqb2IpIHVuZGVyIGEgdW5pcXVlIGlkLgpDYWxsZXIgbXVzdCBiZSB0aGUgcGF5ZXIgKHJlcXVpcmVfYXV0aCkuAAAAEGNyZWF0ZV9hZ3JlZW1lbnQAAAAHAAAAAAAAAAJpZAAAAAAAEQAAAAAAAAAFcGF5ZXIAAAAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABnBheWVlcwAAAAAD6gAAB9AAAAAFU2hhcmUAAAAAAAAAAAAABmJ1ZGdldAAAAAAACwAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAAlhcHByb3ZlcnMAAAAAAAPqAAAAEwAAAAA=",
        "AAAAAAAAAIZQYXkgb3V0IGEgcG9ydGlvbiBvZiB0aGUgYnVkZ2V0IHRvIGEgc3BlY2lmaWMgY29udHJhY3RvciAoYWQtaG9jIGFtb3VudCkuCk11c3QgYmUgY2FsbGVkIGJ5IHRoZSBgcGF5ZXJgIG9yIGFueSBhZGRyZXNzIGluIGBhcHByb3ZlcnNgLgAAAAAAB3JlbGVhc2UAAAAAAwAAAAAAAAACaWQAAAAAABEAAAAAAAAACmNvbnRyYWN0b3IAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAH5SZWxlYXNlIHVzaW5nIHRoZSBzdG9yZWQgZGVmYXVsdCBicHMgc3BsaXQgb3ZlciBhIHNwZWNpZmljIGB0b3RhbF9hbW91bnRgLgpVc2VmdWwgZm9yIG9uZS1jbGljayBzcGxpdCB3aGVuIG1pbGVzdG9uZXMgYXJlIG1ldC4AAAAAAA1yZWxlYXNlX3NwbGl0AAAAAAAAAgAAAAAAAAACaWQAAAAAABEAAAAAAAAADHRvdGFsX2Ftb3VudAAAAAsAAAAA",
        "AAAAAAAAAINDbG9zZS9yZWZ1bmQgcGF0aDogcHJldmVudHMgZnVydGhlciByZWxlYXNlcy4KT25seSB0aGUgcGF5ZXIgY2FuIGNsb3NlOyB0eXBpY2FsbHkgY2FsbGVkIGFmdGVyIGRlYWRsaW5lICh5b3UgY2FuIGVuZm9yY2Ugb3IgcmVsYXgpLgAAAAAFY2xvc2UAAAAAAAABAAAAAAAAAAJpZAAAAAAAEQAAAAA=",
        "AAAAAAAAAAxSZWFkIGhlbHBlcnMAAAADZ2V0AAAAAAEAAAAAAAAAAmlkAAAAAAARAAAAAQAAA+gAAAfQAAAACUFncmVlbWVudAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    create_agreement: this.txFromJSON<null>,
        release: this.txFromJSON<null>,
        release_split: this.txFromJSON<null>,
        close: this.txFromJSON<null>,
        get: this.txFromJSON<Option<Agreement>>
  }
}