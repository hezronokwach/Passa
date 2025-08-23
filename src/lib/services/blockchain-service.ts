import * as StellarSdk from '@stellar/stellar-sdk';
const { 
  Keypair, 
  Networks, 
  TransactionBuilder, 
  BASE_FEE,
  Operation,
  Asset,
  Address,
  nativeToScVal
} = StellarSdk;
const { Server: SorobanRpcServer } = StellarSdk.rpc;
import { Client as SplitterClient } from '../../../passa-contracts/packages/splitter_v1/src/src';

const RPC_URL = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export interface ArtistShare {
  recipient: string;
  bps: number; // basis points (10000 = 100%)
}

export interface AgreementParams {
  id: string;
  payer: string;
  token: string;
  payees: ArtistShare[];
  budget: bigint;
  deadline: bigint;
  approvers: string[];
}

export class BlockchainService {
  private rpc: InstanceType<typeof SorobanRpcServer>;
  private splitterClient: SplitterClient;

  constructor() {
    this.rpc = new SorobanRpcServer(RPC_URL);
    this.splitterClient = new SplitterClient({
      networkPassphrase: NETWORK_PASSPHRASE,
      rpcUrl: RPC_URL,
      contractId: process.env.SPLITTER_CONTRACT_ID || 'CCCGG4XPEPSDHOH3O35B6MAR5IFIMA2ZEOHMIH5U3N2ARRSR3JEBQ5WW'
    });
  }

  /**
   * Create a new artist agreement smart contract
   */
  async createAgreement(params: AgreementParams, payerKeypair: Keypair) {
    try {
      // First approve the contract to spend tokens
      await this.approveTokenSpending(params.token, params.budget, payerKeypair);
      
      const tx = await this.splitterClient.create_agreement({
        id: params.id,
        payer: params.payer,
        token: params.token,
        payees: params.payees,
        budget: params.budget,
        deadline: params.deadline,
        approvers: params.approvers
      });

      tx.sign(payerKeypair);
      const result = await tx.send();
      return { success: true, result };
    } catch (error) {
      console.error('Failed to create agreement:', error);
      return { success: false, error };
    }
  }

  /**
   * Approve token spending for the contract
   */
  async approveTokenSpending(tokenAddress: string, amount: bigint, payerKeypair: Keypair) {
    try {
      const account = await this.rpc.getAccount(payerKeypair.publicKey());
      const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
        .addOperation(Operation.invokeContract({
          contract: tokenAddress,
          method: 'approve',
          args: [
            new Address(payerKeypair.publicKey()).toScVal(),
            new Address(this.splitterClient.options.contractId).toScVal(),
            nativeToScVal(amount, { type: 'i128' }),
            nativeToScVal(9999999, { type: 'u32' }) // expiration ledger
          ]
        }))
        .setTimeout(300)
        .build();
      
      tx.sign(payerKeypair);
      return await this.rpc.sendTransaction(tx);
    } catch (error) {
      console.error('Token approval failed:', error);
      throw error;
    }
  }

  /**
   * Release payment to a specific artist
   */
  async releasePayment(agreementId: string, contractor: string, amount: bigint, payerKeypair: Keypair) {
    try {
      const tx = await this.splitterClient.release({
        id: agreementId,
        contractor,
        amount
      });

      tx.sign(payerKeypair);
      const result = await tx.send();
      return { success: true, result };
    } catch (error) {
      console.error('Failed to release payment:', error);
      return { success: false, error };
    }
  }

  /**
   * Release payments using predefined split percentages
   */
  async releaseSplit(agreementId: string, totalAmount: bigint, payerKeypair: Keypair) {
    try {
      const tx = await this.splitterClient.release_split({
        id: agreementId,
        total_amount: totalAmount
      });

      tx.sign(payerKeypair);
      const result = await tx.send();
      return { success: true, result };
    } catch (error) {
      console.error('Failed to release split:', error);
      return { success: false, error };
    }
  }

  /**
   * Get agreement details
   */
  async getAgreement(agreementId: string) {
    try {
      const tx = await this.splitterClient.get({ id: agreementId });
      const result = await tx.simulate();
      return { success: true, agreement: result.result };
    } catch (error) {
      console.error('Failed to get agreement:', error);
      return { success: false, error };
    }
  }

  /**
   * Close an agreement
   */
  async closeAgreement(agreementId: string, payerKeypair: Keypair) {
    try {
      const tx = await this.splitterClient.close({ id: agreementId });
      tx.sign(payerKeypair);
      const result = await tx.send();
      return { success: true, result };
    } catch (error) {
      console.error('Failed to close agreement:', error);
      return { success: false, error };
    }
  }

  /**
   * Convert artist invitations to smart contract shares
   */
  static convertToShares(invitations: Array<{ artistEmail: string; proposedFee: number }>, totalBudget: number): ArtistShare[] {
    return invitations.map(inv => ({
      recipient: inv.artistEmail, // This should be wallet address in production
      bps: Math.round((inv.proposedFee / totalBudget) * 10000) // Convert to basis points
    }));
  }

  /**
   * Generate unique agreement ID for an event
   */
  static generateAgreementId(eventId: number): string {
    return `event_${eventId}_${Date.now()}`;
  }
}

export const blockchainService = new BlockchainService();