import * as StellarSdk from '@stellar/stellar-sdk';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

export class EscrowService {
  /**
   * Send ticket payment to organizer (who has allowance set for contract)
   */
  async sendToEscrow(
    buyerSecretKey: string,
    organizerAddress: string,
    amount: string
  ) {
    try {
      const buyerKeypair = StellarSdk.Keypair.fromSecret(buyerSecretKey);
      const buyerAccount = await server.loadAccount(buyerKeypair.publicKey());

      // Send XLM to organizer who has set allowance for contract to pull
      const transaction = new StellarSdk.TransactionBuilder(buyerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: organizerAddress,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(buyerKeypair);
      const result = await server.submitTransaction(transaction);

      return {
        success: true,
        transactionHash: result.hash,
        message: 'Payment sent to organizer escrow'
      };
    } catch (error) {
      console.error('Escrow payment failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Escrow payment failed'
      };
    }
  }

  /**
   * Create escrow agreement for event (returns organizer address for now)
   */
  async createEventEscrow(
    organizerAddress: string,
    artistAddress: string,
    artistFixedAmount: string,
    eventDeadline: number
  ) {
    // For now, return organizer address since contract uses pull model
    // In full implementation, this would create agreement in Soroban contract
    return {
      success: true,
      contractAddress: organizerAddress,
      message: 'Escrow agreement ready'
    };
  }
}

export const escrowService = new EscrowService();