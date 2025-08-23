'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Key } from 'lucide-react';
import { enterArtistSecretKey } from '@/app/actions/artist-secret-key';

export function ArtistSecretKeyDialog({ invitation }: { invitation: { id: number; event: { title: string } } }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await enterArtistSecretKey(formData);
    if (result?.success) {
      setTimeout(() => setOpen(false), 1500);
    }
    return result;
  }, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          Enter Secret Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="invitationId" value={invitation.id} />
          <DialogHeader>
            <DialogTitle>Enter Your Secret Key</DialogTitle>
            <DialogDescription>
              Enter your Stellar secret key to initiate the smart contract for {invitation.event.title}.
            </DialogDescription>
          </DialogHeader>
          
          {state?.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Secret key entered successfully! Contract will be created when both parties have provided their keys.
              </AlertDescription>
            </Alert>
          )}
          
          {state?.success === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {state.message || 'Failed to enter secret key. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="secretKey">Stellar Secret Key <span className="text-red-500">*</span></Label>
              <Input 
                name="secretKey" 
                type="password" 
                placeholder="S..." 
                required 
                className="mt-1 font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your secret key must match your connected wallet address
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending || state?.success}>
              {pending ? 'Saving...' : state?.success ? 'Saved!' : 'Save Secret Key'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}