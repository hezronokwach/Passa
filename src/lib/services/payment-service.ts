import * as StellarSdk from '@stellar/stellar-sdk';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

export class PaymentService {
  /**
   * Transfer XLM from buyer to organizer
   */
  async processTicketPayment(
    buyerSecretKey: string,
    organizerAddress: string,
    amount: string
  ) {
    try {
      const buyerKeypair = StellarSdk.Keypair.fromSecret(buyerSecretKey);
      const buyerAccount = await server.loadAccount(buyerKeypair.publicKey());

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
        message: 'Payment successful'
      };
    } catch (error) {
      console.error('Payment failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  /**
   * Verify transaction exists on blockchain
   */
  async verifyTransaction(transactionHash: string) {
    try {
      const transaction = await server.transactions().transaction(transactionHash).call();
      return {
        success: true,
        transaction
      };
    } catch (error) {
      return {
        success: false,
        message: 'Transaction not found'
      };
    }
  }
}

export const paymentService = new PaymentService();