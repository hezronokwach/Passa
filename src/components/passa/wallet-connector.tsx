'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Eye, EyeOff } from 'lucide-react';

interface WalletConnectorProps {
  onConnect: (secretKey: string) => void;
  isConnecting?: boolean;
}

export function WalletConnector({ onConnect, isConnecting }: WalletConnectorProps) {
  const [secretKey, setSecretKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const handleConnect = () => {
    if (secretKey.trim()) {
      onConnect(secretKey.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Wallet className="mx-auto h-12 w-12 text-primary mb-2" />
        <h3 className="text-lg font-semibold">Connect Stellar Wallet</h3>
        <p className="text-sm text-muted-foreground">Payment goes to secure escrow contract</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="secretKey">Stellar Secret Key</Label>
        <div className="relative">
          <Input
            id="secretKey"
            type={showSecret ? 'text' : 'password'}
            placeholder="S..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowSecret(!showSecret)}
          >
            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Payment goes to organizer wallet. Smart contract will be used when deployed.
        </p>
      </div>

      <Button 
        onClick={handleConnect} 
        disabled={!secretKey.trim() || isConnecting}
        className="w-full"
      >
        {isConnecting ? 'Processing Payment...' : 'Pay with XLM'}
      </Button>
    </div>
  );
}