// hooks/useSplitterContract.ts
import { useState, useEffect, useCallback } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import { SplitterRegistryClient, Agreement, Share } from '../lib/stellar/splitterRegistry';

export interface ContractError {
  message: string;
  code?: number;
}

export const useSplitterContract = (
  contractId: string,
  keypair?: Keypair,
  wasmHash?: string
) => {
  const [client, setClient] = useState<SplitterRegistryClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize the contract client
  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const contractClient = new SplitterRegistryClient(contractId, keypair);
      await contractClient.initialize(wasmHash);
      
      setClient(contractClient);
      setInitialized(true);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to initialize contract',
        code: err.code
      });
    } finally {
      setLoading(false);
    }
  }, [contractId, keypair, wasmHash]);

  // Auto-initialize on mount
  useEffect(() => {
    if (!initialized && contractId) {
      initialize();
    }
  }, [initialize, initialized, contractId]);

  // Create Agreement
  const createAgreement = useCallback(async (params: {
    id: string;
    payer: string;
    token: string;
    payees: Share[];
    budget: bigint;
    deadline: number; // Unix timestamp
    approvers: string[];
  }) => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await client.createAgreement(
        params.id,
        params.payer,
        params.token,
        params.payees,
        params.budget,
        BigInt(params.deadline),
        params.approvers
      );
      
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || 'Failed to create agreement',
        code: err.code
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Release Payment
  const releasePayment = useCallback(async (
    id: string,
    contractor: string,
    amount: bigint
  ) => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await client.release(id, contractor, amount);
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || 'Failed to release payment',
        code: err.code
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Release Split Payment
  const releaseSplitPayment = useCallback(async (
    id: string,
    totalAmount: bigint
  ) => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await client.releaseSplit(id, totalAmount);
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || 'Failed to release split payment',
        code: err.code
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Close Agreement
  const closeAgreement = useCallback(async (id: string) => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await client.close(id);
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || 'Failed to close agreement',
        code: err.code
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Get Agreement (read-only)
  const getAgreement = useCallback(async (id: string): Promise<Agreement | null> => {
    if (!client) throw new Error('Client not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await client.getAgreement(id);
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || 'Failed to get agreement',
        code: err.code
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    // State
    initialized,
    loading,
    error,
    client,

    // Methods
    initialize,
    createAgreement,
    releasePayment,
    releaseSplitPayment,
    closeAgreement,
    getAgreement,

    // Utilities
    xlmToStroops: SplitterRegistryClient.xlmToStroops,
    stroopsToXlm: SplitterRegistryClient.stroopsToXlm,
  };
};