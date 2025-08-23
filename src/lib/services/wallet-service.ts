import * as StellarSdk from '@stellar/stellar-sdk';
const { Keypair, TransactionBuilder, BASE_FEE, Networks, Operation } = StellarSdk;
const { Server: SorobanRpcServer } = StellarSdk.rpc;
import prisma from '@/lib/db';

const RPC_URL = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export class WalletService {
  private rpc: InstanceType<typeof SorobanRpcServer>;

  constructor() {
    this.rpc = new SorobanRpcServer(RPC_URL);
  }

  /**
   * Get platform wallet keypair
   */
  getPlatformWallet() {
    const secret = process.env.PLATFORM_WALLET_SECRET;
    if (!secret) throw new Error('Platform wallet not configured');
    return Keypair.fromSecret(secret);
  }

  /**
   * Get platform wallet public key
   */
  getPlatformAddress() {
    return this.getPlatformWallet().publicKey();
  }

  /**
   * Generate new wallet keypair for user
   */
  generateWallet() {
    const keypair = Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret()
    };
  }

  /**
   * Fund testnet account using Friendbot
   */
  async fundTestnetAccount(publicKey: string) {
    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
      
      if (response.ok) {
        return { success: true, message: 'Account funded with 10,000 XLM!' };
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail?.includes('already funded')) {
            return { success: false, message: 'Account already funded' };
          }
        } catch {}
        return { success: false, message: 'Funding failed' };
      }
    } catch (error) {
      console.error('Friendbot funding failed:', error);
      return { success: false, message: 'Network error during funding' };
    }
  }

  /**
   * Create and fund wallet for new user
   */
  async createUserWallet(userId: number) {
    try {
      const wallet = this.generateWallet();
      
      // Fund testnet account
      const fundResult = await this.fundTestnetAccount(wallet.publicKey);
      if (!fundResult.success) throw new Error(fundResult.message);

      // Store wallet address in database (NEVER store secret key)
      await prisma.user.update({
        where: { id: userId },
        data: { walletAddress: wallet.publicKey }
      });

      return {
        success: true,
        publicKey: wallet.publicKey,
        secretKey: wallet.secretKey // Return once for user to save securely
      };
    } catch (error) {
      console.error('Wallet creation failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Check account balance
   */
  async getAccountBalance(publicKey: string) {
    try {
      const account = await this.rpc.getAccount(publicKey);
      return {
        success: true,
        balance: account.balances.find(b => b.asset_type === 'native')?.balance || '0'
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export const walletService = new WalletService();