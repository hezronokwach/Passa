// lib/stellar/splitterRegistry.ts
import {
  Keypair,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Address,
  contract,
  nativeToScVal,
  scValToNative,
  rpc, // <-- correct Soroban RPC entrypoint
} from "@stellar/stellar-sdk";
import { Client } from "@stellar/stellar-sdk/contract";

// Configuration
const RPC_URL =
  process.env.NODE_ENV === "production"
    ? "https://soroban-mainnet.stellar.org"
    : "https://soroban-testnet.stellar.org";

const NETWORK_PASSPHRASE =
  process.env.NODE_ENV === "production"
    ? Networks.PUBLIC
    : Networks.TESTNET;

// Types matching your Rust contract
export interface Share {
  recipient: string;
  fixed_amount: bigint;
}

export interface Agreement {
  payer: string;
  token: string;
  payees: Share[];
  budget: bigint;
  released: bigint;
  deadline: bigint;
  approvers: string[];
  closed: boolean;
}

export class SplitterRegistryClient {
  private client: any;
  private rpcServer: rpc.Server;

  constructor(
    private contractId: string,
    private keypair?: Keypair,
    private networkPassphrase: string = NETWORK_PASSPHRASE,
    private rpcUrl: string = RPC_URL
  ) {
    this.rpcServer = new rpc.Server(rpcUrl);
  }

  // Initialize the contract client
  async initialize(wasmHash?: string) {
    if (wasmHash && this.keypair) {
      // Deploy new instance
      const { signTransaction } = this.getSignFunction();

      const deployTx = await Client.deploy(null, {
        networkPassphrase: this.networkPassphrase,
        rpcUrl: this.rpcUrl,
        wasmHash,
        publicKey: this.keypair.publicKey(),
        signTransaction,
      });

      const { result: client } = await deployTx.signAndSend();
      this.client = client;
    } else {
      // Connect to existing contract
      const { signTransaction } = this.getSignFunction();

      this.client = await Client.from({
        contractId: this.contractId,
        networkPassphrase: this.networkPassphrase,
        rpcUrl: this.rpcUrl,
        publicKey: this.keypair?.publicKey() || "", // Can be empty for read-only
        signTransaction,
      });
    }
  }

  private getSignFunction() {
    if (!this.keypair) {
      throw new Error("Keypair required for signing transactions");
    }

    return {
      signTransaction: async (tx: string) => {
        const transaction = TransactionBuilder.fromXDR(
          tx,
          this.networkPassphrase
        );
        transaction.sign(this.keypair!);
        return {
          signedTxXdr: transaction.toXDR(),
          signerAddress: this.keypair!.publicKey(),
        };
      },
    };
  }

  // Contract method: create_agreement
  async createAgreement(
    id: string,
    payer: string,
    token: string,
    payees: Share[],
    budget: bigint,
    deadline: bigint,
    approvers: string[]
  ): Promise<any> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    const tx = await this.client.create_agreement({
      id,
      payer,
      token,
      payees: payees.map((p) => ({
        recipient: p.recipient,
        fixed_amount: p.fixed_amount,
      })),
      budget,
      deadline,
      approvers,
    });

    return await tx.signAndSend();
  }

  // Contract method: release
  async release(id: string, contractor: string, amount: bigint): Promise<any> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    const tx = await this.client.release({
      id,
      contractor,
      amount,
    });

    return await tx.signAndSend();
  }

  // Contract method: release_split
  async releaseSplit(id: string, totalAmount: bigint): Promise<any> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    const tx = await this.client.release_split({
      id,
      total_amount: totalAmount,
    });

    return await tx.signAndSend();
  }

  // Contract method: close
  async close(id: string): Promise<any> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    const tx = await this.client.close({ id });
    return await tx.signAndSend();
  }

  // Contract method: get (read-only)
  async getAgreement(id: string): Promise<Agreement | null> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    try {
      const result = await this.client.get({ id });
      return result.result; // The result contains the agreement data
    } catch (error) {
      console.error("Error fetching agreement:", error);
      return null;
    }
  }

  // Utility method to convert XLM to stroops
  static xlmToStroops(xlm: number): bigint {
    return BigInt(Math.floor(xlm * 10_000_000));
  }

  // Utility method to convert stroops to XLM
  static stroopsToXlm(stroops: bigint): number {
    return Number(stroops) / 10_000_000;
  }
}
