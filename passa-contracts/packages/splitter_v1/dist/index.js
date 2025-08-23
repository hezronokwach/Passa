import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CDSQI2GWKWN6Z2K37EL35ONYGGEJK74PVX3MZJOX7EOLQBY5W5LR4Y4A",
    }
};
export const Err = {
    1: { message: "AlreadyExists" },
    2: { message: "NotFound" },
    3: { message: "NotPayer" },
    4: { message: "NotApprover" },
    5: { message: "BadPercents" },
    6: { message: "ZeroPayees" },
    7: { message: "Closed" },
    8: { message: "OverBudget" },
    9: { message: "PastDeadline" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAAA0VycgAAAAAJAAAAAAAAAA1BbHJlYWR5RXhpc3RzAAAAAAAAAQAAAAAAAAAITm90Rm91bmQAAAACAAAAAAAAAAhOb3RQYXllcgAAAAMAAAAAAAAAC05vdEFwcHJvdmVyAAAAAAQAAAAAAAAAC0JhZFBlcmNlbnRzAAAAAAUAAAAAAAAAClplcm9QYXllZXMAAAAAAAYAAAAAAAAABkNsb3NlZAAAAAAABwAAAAAAAAAKT3ZlckJ1ZGdldAAAAAAACAAAAAAAAAAMUGFzdERlYWRsaW5lAAAACQ==",
            "AAAAAQAAAAAAAAAAAAAABVNoYXJlAAAAAAAAAgAAAAAAAAADYnBzAAAAAAQAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
            "AAAAAQAAAAAAAAAAAAAACUFncmVlbWVudAAAAAAAAAgAAAAAAAAACWFwcHJvdmVycwAAAAAAA+oAAAATAAAAAAAAAAZidWRnZXQAAAAAAAsAAAAAAAAABmNsb3NlZAAAAAAAAQAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAAZwYXllZXMAAAAAA+oAAAfQAAAABVNoYXJlAAAAAAAAAAAAAAVwYXllcgAAAAAAABMAAAAAAAAACHJlbGVhc2VkAAAACwAAAAAAAAAFdG9rZW4AAAAAAAAT",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAACUFncmVlbWVudAAAAAAAAAEAAAAR",
            "AAAAAAAAAFhDcmVhdGUgYSBuZXcgYWdyZWVtZW50IChqb2IpIHVuZGVyIGEgdW5pcXVlIGlkLgpDYWxsZXIgbXVzdCBiZSB0aGUgcGF5ZXIgKHJlcXVpcmVfYXV0aCkuAAAAEGNyZWF0ZV9hZ3JlZW1lbnQAAAAHAAAAAAAAAAJpZAAAAAAAEQAAAAAAAAAFcGF5ZXIAAAAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABnBheWVlcwAAAAAD6gAAB9AAAAAFU2hhcmUAAAAAAAAAAAAABmJ1ZGdldAAAAAAACwAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAAlhcHByb3ZlcnMAAAAAAAPqAAAAEwAAAAA=",
            "AAAAAAAAAIZQYXkgb3V0IGEgcG9ydGlvbiBvZiB0aGUgYnVkZ2V0IHRvIGEgc3BlY2lmaWMgY29udHJhY3RvciAoYWQtaG9jIGFtb3VudCkuCk11c3QgYmUgY2FsbGVkIGJ5IHRoZSBgcGF5ZXJgIG9yIGFueSBhZGRyZXNzIGluIGBhcHByb3ZlcnNgLgAAAAAAB3JlbGVhc2UAAAAAAwAAAAAAAAACaWQAAAAAABEAAAAAAAAACmNvbnRyYWN0b3IAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAH5SZWxlYXNlIHVzaW5nIHRoZSBzdG9yZWQgZGVmYXVsdCBicHMgc3BsaXQgb3ZlciBhIHNwZWNpZmljIGB0b3RhbF9hbW91bnRgLgpVc2VmdWwgZm9yIG9uZS1jbGljayBzcGxpdCB3aGVuIG1pbGVzdG9uZXMgYXJlIG1ldC4AAAAAAA1yZWxlYXNlX3NwbGl0AAAAAAAAAgAAAAAAAAACaWQAAAAAABEAAAAAAAAADHRvdGFsX2Ftb3VudAAAAAsAAAAA",
            "AAAAAAAAAINDbG9zZS9yZWZ1bmQgcGF0aDogcHJldmVudHMgZnVydGhlciByZWxlYXNlcy4KT25seSB0aGUgcGF5ZXIgY2FuIGNsb3NlOyB0eXBpY2FsbHkgY2FsbGVkIGFmdGVyIGRlYWRsaW5lICh5b3UgY2FuIGVuZm9yY2Ugb3IgcmVsYXgpLgAAAAAFY2xvc2UAAAAAAAABAAAAAAAAAAJpZAAAAAAAEQAAAAA=",
            "AAAAAAAAAAxSZWFkIGhlbHBlcnMAAAADZ2V0AAAAAAEAAAAAAAAAAmlkAAAAAAARAAAAAQAAA+gAAAfQAAAACUFncmVlbWVudAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        create_agreement: (this.txFromJSON),
        release: (this.txFromJSON),
        release_split: (this.txFromJSON),
        close: (this.txFromJSON),
        get: (this.txFromJSON)
    };
}
