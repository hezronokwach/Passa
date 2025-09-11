'use client';

import { useState, useEffect } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import { useSplitterContract } from '@/hooks/useSplitterContract';
import { Share } from '@/lib/stellar/splitterRegistry';

// Replace with your deployed contract ID
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || 'CAM4B6252SLGII7RXXYUSX4FOZFYI4XU4SDOVCS7HTPDRBIMQT7QUKGB';

export default function SplitterPage() {
  const [keypair, setKeypair] = useState<Keypair | undefined>();
  const [agreementId, setAgreementId] = useState('');
  const [agreementData, setAgreementData] = useState<any>(null);
  
  const {
    initialized,
    loading,
    error,
    createAgreement,
    releasePayment,
    releaseSplitPayment,
    closeAgreement,
    getAgreement,
    xlmToStroops,
    stroopsToXlm
  } = useSplitterContract(CONTRACT_ID, keypair);

  // Initialize or load keypair
  useEffect(() => {
    const loadKeypair = () => {
      const saved = localStorage.getItem('stellar-keypair');
      if (saved) {
        setKeypair(Keypair.fromSecret(saved));
      } else {
        const newKeypair = Keypair.random();
        localStorage.setItem('stellar-keypair', newKeypair.secret());
        setKeypair(newKeypair);
        console.log('Generated new keypair:', newKeypair.publicKey());
      }
    };
    
    loadKeypair();
  }, []);

  // Handle creating a new agreement
  const handleCreateAgreement = async () => {
    if (!keypair) {
      alert('Keypair not initialized');
      return;
    }

    try {
      const payees: Share[] = [
        {
          recipient: 'RECIPIENT_ADDRESS_1',
          fixed_amount: xlmToStroops(50) // 50 XLM
        },
        {
          recipient: 'RECIPIENT_ADDRESS_2', 
          fixed_amount: xlmToStroops(30) // 30 XLM
        }
      ];

      const agreementParams = {
        id: 'test-agreement-' + Date.now(),
        payer: keypair.publicKey(),
        token: 'NATIVE', // XLM token address
        payees,
        budget: xlmToStroops(100), // 100 XLM budget
        deadline: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
        approvers: [keypair.publicKey()] // Self as approver for demo
      };

      const result = await createAgreement(agreementParams);
      console.log('Agreement created:', result);
      setAgreementId(agreementParams.id);
      alert('Agreement created successfully!');
    } catch (err: any) {
      console.error('Failed to create agreement:', err);
      alert('Failed to create agreement: ' + err.message);
    }
  };

  // Handle releasing payment to a specific contractor
  const handleReleasePayment = async () => {
    if (!agreementId) {
      alert('Please enter an agreement ID');
      return;
    }

    try {
      const result = await releasePayment(
        agreementId,
        'CONTRACTOR_ADDRESS_HERE', // Replace with actual contractor address
        xlmToStroops(25) // Release 25 XLM
      );
      
      console.log('Payment released:', result);
      alert('Payment released successfully!');
    } catch (err: any) {
      console.error('Failed to release payment:', err);
      alert('Failed to release payment: ' + err.message);
    }
  };

  // Handle releasing split payment
  const handleReleaseSplit = async () => {
    if (!agreementId) {
      alert('Please enter an agreement ID');
      return;
    }

    try {
      const result = await releaseSplitPayment(
        agreementId,
        xlmToStroops(80) // Release 80 XLM total (split among payees)
      );
      
      console.log('Split payment released:', result);
      alert('Split payment released successfully!');
    } catch (err: any) {
      console.error('Failed to release split payment:', err);
      alert('Failed to release split payment: ' + err.message);
    }
  };

  // Handle getting agreement details
  const handleGetAgreement = async () => {
    if (!agreementId) {
      alert('Please enter an agreement ID');
      return;
    }

    try {
      const agreement = await getAgreement(agreementId);
      setAgreementData(agreement);
      console.log('Agreement data:', agreement);
    } catch (err: any) {
      console.error('Failed to get agreement:', err);
      alert('Failed to get agreement: ' + err.message);
    }
  };

  // Handle closing agreement
  const handleCloseAgreement = async () => {
    if (!agreementId) {
      alert('Please enter an agreement ID');
      return;
    }

    try {
      const result = await closeAgreement(agreementId);
      console.log('Agreement closed:', result);
      alert('Agreement closed successfully!');
    } catch (err: any) {
      console.error('Failed to close agreement:', err);
      alert('Failed to close agreement: ' + err.message);
    }
  };

  if (!keypair) {
    return <div>Loading keypair...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Splitter Registry Contract</h1>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <p><strong>Status:</strong> {initialized ? 'Connected' : 'Connecting...'}</p>
        <p><strong>Public Key:</strong> {keypair?.publicKey()}</p>
        {error && <p className="text-red-500"><strong>Error:</strong> {error.message}</p>}
      </div>

      {/* Agreement ID Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Agreement ID:
        </label>
        <input
          type="text"
          value={agreementId}
          onChange={(e) => setAgreementId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter agreement ID"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={handleCreateAgreement}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Create Agreement
        </button>
        
        <button
          onClick={handleReleasePayment}
          disabled={loading || !agreementId}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Release Payment
        </button>
        
        <button
          onClick={handleReleaseSplit}
          disabled={loading || !agreementId}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Release Split
        </button>
        
        <button
          onClick={handleGetAgreement}
          disabled={loading || !agreementId}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Get Agreement
        </button>
        
        <button
          onClick={handleCloseAgreement}
          disabled={loading || !agreementId}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Close Agreement
        </button>
      </div>

      {/* Agreement Data Display */}
      {agreementData && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2">Agreement Details:</h3>
          <pre className="text-sm bg-white p-4 rounded overflow-auto">
            {JSON.stringify(agreementData, null, 2)}
          </pre>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}