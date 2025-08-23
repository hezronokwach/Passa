'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Wallet, Copy, CheckCircle, RefreshCw, Eye, EyeOff, AlertTriangle, Coins } from 'lucide-react';
import { regenerateWallet, fundAccount } from '@/app/actions/wallet-actions';
import { getSecretKey } from '@/app/actions/get-secret-key';

interface WalletProfileProps {
  userWallet?: string;
}

export function WalletProfile({ userWallet }: WalletProfileProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState('');
  const [newWallet, setNewWallet] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [state, formAction, pending] = useActionState(regenerateWallet, { success: false, message: '', errors: {} });
  const [fundState, fundAction, fundPending] = useActionState(fundAccount, { success: false, message: '' });

  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleShowSecretKey = async () => {
    if (showSecret) {
      setShowSecret(false);
      return;
    }

    const { secretKey, error } = await getSecretKey();
    if (error) {
      setError(error);
      return;
    }
    setSecretKey(secretKey);
    setShowSecret(true);
  };

  const fetchBalance = async (publicKey: string) => {
    setLoadingBalance(true);
    try {
      const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
      if (response.ok) {
        const data = await response.json();
        const xlmBalance = data.balances.find((b: any) => b.asset_type === 'native')?.balance || '0';
        setBalance(parseFloat(xlmBalance).toFixed(2));
      } else {
        setBalance('0');
      }
    } catch {
      setBalance('0');
    }
    setLoadingBalance(false);
  };

  useEffect(() => {
    const publicKey = newWallet?.publicKey || userWallet;
    if (publicKey) {
      fetchBalance(publicKey);
    }
  }, [newWallet, userWallet]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  // Show new wallet if regenerated
  if (state.success && state.wallet) {
    if (!newWallet) setNewWallet(state.wallet);
  }

  const currentWallet = newWallet || { publicKey: userWallet, secretKey: null };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Stellar Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!userWallet && !newWallet ? (
          <p className="text-muted-foreground">No wallet found. Contact support.</p>
        ) : (
          <>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Public Key (Address):</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted p-2 rounded flex-1 break-all">
                    {currentWallet.publicKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(currentWallet.publicKey!, 'public')}
                  >
                    {copied === 'public' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Balance:</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-green-600">
                    {loadingBalance ? 'Loading...' : `${balance || '0'} XLM`}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => currentWallet.publicKey && fetchBalance(currentWallet.publicKey)}
                    disabled={loadingBalance}
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingBalance ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">Secret Key</p>
                </div>
                <p className="text-xs text-blue-700 mb-3">
                  Your secret key is needed for smart contract transactions. Keep it secure.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleShowSecretKey}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <span className="text-xs text-blue-700">
                      {showSecret ? 'Hide' : 'Show'} Secret Key
                    </span>
                  </div>
                  
                  {showSecret && (
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-blue-100 p-2 rounded flex-1 break-all font-mono">
                        {secretKey || 'Could not retrieve secret key.'}
                      </code>
                      {(secretKey) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(secretKey, 'secret')}
                        >
                          {copied === 'secret' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  )}
                  {showSecret && error && (
                    <p className="text-red-500 text-xs">{error}</p>
                  )}
                </div>
              </div>
              
              {newWallet?.secretKey && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800">New Secret Key Generated</p>
                  </div>
                  <p className="text-xs text-yellow-700">
                    Save this secret key immediately. It won't be shown again after you leave this page.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <form action={fundAction}>
                  <Button type="submit" variant="outline" disabled={fundPending}>
                    <Coins className="h-4 w-4 mr-2" />
                    {fundPending ? 'Funding...' : 'Fund Account'}
                  </Button>
                </form>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={pending}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {pending ? 'Generating...' : 'Generate New Address'}
                    </Button>
                  </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Generate New Wallet Address?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will create a completely new wallet address with a new secret key. Your current address ({currentWallet.publicKey?.slice(0, 8)}...) and any funds in it will be abandoned. 
                      Transfer your funds first or save your current secret key before proceeding.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <form action={formAction}>
                        <Button type="submit" variant="destructive">
                          Generate New Address
                        </Button>
                      </form>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </div>
            </div>

            {(state.message || fundState.message) && (
              <p className={`text-sm ${(state.success || fundState.success) ? 'text-green-600' : 'text-red-600'}`}>
                {fundState.message || state.message}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}