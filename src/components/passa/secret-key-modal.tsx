'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SecretKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: number;
  userRole: 'artist' | 'organizer';
  eventTitle: string;
  proposedFee: number;
}

export function SecretKeyModal({ 
  open, 
  onOpenChange, 
  invitationId, 
  userRole, 
  eventTitle, 
  proposedFee 
}: SecretKeyModalProps) {
  const [secretKey, setSecretKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      setError('Secret key is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/smart-contract/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId,
          secretKey: secretKey.trim(),
          userRole
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Smart Contract Initiated!',
          description: 'The escrow contract has been created successfully.',
        });
        onOpenChange(false);
        window.location.reload();
      } else {
        setError(result.message || 'Failed to initiate smart contract');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Initiate Smart Contract
          </DialogTitle>
          <DialogDescription>
            Enter your secret key to create the escrow contract for this agreement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{eventTitle}</strong><br />
              Fee: {proposedFee.toFixed(2)} XLM<br />
              Role: {userRole === 'artist' ? 'Artist' : 'Event Organizer'}
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Stellar Secret Key
              </Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="S..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your secret key will be used to sign the smart contract transaction
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Contract...' : 'Create Contract'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}