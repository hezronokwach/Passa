'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Copy, CheckCircle } from 'lucide-react';

interface WalletInfo {
  publicKey: string;
  secretKey: string;
  balance?: string;
}

export function WalletConnection({ userWallet }: { userWallet?: string }) {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wallet/generate', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setWallet(data.wallet);
      }
    } catch (error) {
      console.error('Wallet generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (userWallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Public Key:</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted p-2 rounded flex-1">{userWallet}</code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(userWallet)}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet ? (
          <Button onClick={generateWallet} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Wallet'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ Save your secret key securely!
              </p>
              <p className="text-xs text-yellow-700">
                This is the only time you'll see your secret key. Store it safely.
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Public Key:</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted p-2 rounded flex-1">{wallet.publicKey}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(wallet.publicKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Secret Key:</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted p-2 rounded flex-1 font-mono">
                    {wallet.secretKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(wallet.secretKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}