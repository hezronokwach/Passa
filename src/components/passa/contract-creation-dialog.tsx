'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, FileContract } from 'lucide-react';

interface ContractCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateContract: (organizerKey: string, artistKey: string) => Promise<void>;
  eventTitle: string;
  artistName: string;
  agreedFee: number;
  isCreating: boolean;
}

export function ContractCreationDialog({
  isOpen,
  onClose,
  onCreateContract,
  eventTitle,
  artistName,
  agreedFee,
  isCreating
}: ContractCreationDialogProps) {
  const [organizerKey, setOrganizerKey] = useState('');
  const [artistKey, setArtistKey] = useState('');
  const [showOrganizerKey, setShowOrganizerKey] = useState(false);
  const [showArtistKey, setShowArtistKey] = useState(false);

  const handleCreate = async () => {
    if (organizerKey.trim() && artistKey.trim()) {
      await onCreateContract(organizerKey.trim(), artistKey.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileContract className="h-5 w-5" />
            Create Smart Contract
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold">Agreement Terms</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Event: {eventTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              Artist: {artistName}
            </p>
            <p className="text-sm font-medium text-green-600">
              Fixed Fee: {agreedFee} XLM
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Organizer Secret Key</Label>
              <div className="relative">
                <Input
                  type={showOrganizerKey ? 'text' : 'password'}
                  placeholder="S..."
                  value={organizerKey}
                  onChange={(e) => setOrganizerKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowOrganizerKey(!showOrganizerKey)}
                >
                  {showOrganizerKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Artist Secret Key</Label>
              <div className="relative">
                <Input
                  type={showArtistKey ? 'text' : 'password'}
                  placeholder="S..."
                  value={artistKey}
                  onChange={(e) => setArtistKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowArtistKey(!showArtistKey)}
                >
                  {showArtistKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Both parties must provide their secret keys to create a binding smart contract agreement.
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!organizerKey.trim() || !artistKey.trim() || isCreating}
              className="flex-1"
            >
              {isCreating ? 'Creating Contract...' : 'Create Contract'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}