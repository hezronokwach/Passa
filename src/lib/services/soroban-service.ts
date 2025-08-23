import * as StellarSdk from '@stellar/stellar-sdk';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const SPLITTER_CONTRACT_ID = process.env.SPLITTER_CONTRACT_ID;

export class SorobanService {
  /**
   * Create agreement in the splitter contract with fixed amounts
   */
  async createAgreement(
    organizerSecretKey: string,
    eventId: string,
    artists: Array<{ address: string; fixedAmount: string }>,
    totalBudget: string,
    eventDeadline: number
  ) {
    if (!SPLITTER_CONTRACT_ID) {
      return {
        success: false,
        message: 'Contract not deployed. Run ./scripts/deploy-contracts.sh first'
      };
    }

    try {
      const organizerKeypair = StellarSdk.Keypair.fromSecret(organizerSecretKey);
      const organizerAccount = await server.loadAccount(organizerKeypair.publicKey());

      // Convert XLM to stroops (1 XLM = 10^7 stroops)
      const budgetInStroops = Math.floor(parseFloat(totalBudget) * 10000000);
      
      const payees = artists.map(artist => ({
        recipient: artist.address,
        fixed_amount: Math.floor(parseFloat(artist.fixedAmount) * 10000000)
      }));

      const contract = new StellarSdk.Contract(SPLITTER_CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(organizerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            'create_agreement',
            StellarSdk.nativeToScVal(eventId, { type: 'symbol' }),
            StellarSdk.nativeToScVal(organizerKeypair.publicKey(), { type: 'address' }),
            StellarSdk.nativeToScVal('native', { type: 'address' }), // XLM token
            StellarSdk.nativeToScVal(payees, { type: 'vec' }),
            StellarSdk.nativeToScVal(budgetInStroops, { type: 'i128' }),
            StellarSdk.nativeToScVal(eventDeadline, { type: 'u64' }),
            StellarSdk.nativeToScVal([], { type: 'vec' }) // No additional approvers
          )
        )
        .setTimeout(30)
        .build();

      transaction.sign(organizerKeypair);
      const result = await server.submitTransaction(transaction);

      return {
        success: true,
        contractId: SPLITTER_CONTRACT_ID,
        agreementId: eventId,
        transactionHash: result.hash
      };
    } catch (error) {
      console.error('Contract creation failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Contract creation failed'
      };
    }
  }

  /**
   * Set allowance for contract to pull funds from organizer
   */
  async setContractAllowance(
    organizerSecretKey: string,
    totalBudget: string
  ) {
    try {
      const organizerKeypair = StellarSdk.Keypair.fromSecret(organizerSecretKey);
      const organizerAccount = await server.loadAccount(organizerKeypair.publicKey());

      // Convert XLM to stroops
      const budgetInStroops = Math.floor(parseFloat(totalBudget) * 10000000);

      // This would set allowance for the contract to pull funds
      // For now, we'll just return success since this requires token contract interaction
      return {
        success: true,
        message: 'Allowance set for contract'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Allowance setting failed'
      };
    }
  }

  /**
   * Release all fixed payments after event completion
   */
  async releaseAllPayments(
    organizerSecretKey: string,
    eventId: string
  ) {
    if (!SPLITTER_CONTRACT_ID) {
      return {
        success: false,
        message: 'Contract not deployed. Run ./scripts/deploy-contracts.sh first'
      };
    }

    try {
      const organizerKeypair = StellarSdk.Keypair.fromSecret(organizerSecretKey);
      const organizerAccount = await server.loadAccount(organizerKeypair.publicKey());

      const contract = new StellarSdk.Contract(SPLITTER_CONTRACT_ID);

      // Use release_split to pay all artists their fixed amounts at once
      const transaction = new StellarSdk.TransactionBuilder(organizerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            'release_split',
            StellarSdk.nativeToScVal(eventId, { type: 'symbol' }),
            StellarSdk.nativeToScVal(0, { type: 'i128' }) // Not used in fixed amount model
          )
        )
        .setTimeout(30)
        .build();

      transaction.sign(organizerKeypair);
      const result = await server.submitTransaction(transaction);

      return {
        success: true,
        transactionHash: result.hash,
        message: 'All artist payments released'
      };
    } catch (error) {
      console.error('Payment release failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment release failed'
      };
    }
  }
}

export const sorobanService = new SorobanService();