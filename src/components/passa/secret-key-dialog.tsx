'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { enterOrganizerSecretKey } from '@/app/actions/organizer-secret-key';

export function SecretKeyDialog({ invitation }: { invitation: { id: number; artistName: string } }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await enterOrganizerSecretKey(formData);
    if (result?.success) {
      setTimeout(() => setOpen(false), 1500);
    }
    return result;
  }, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Enter Secret Key</Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="invitationId" value={invitation.id} />
          <DialogHeader>
            <DialogTitle>Enter Secret Key for {invitation.artistName}</DialogTitle>
            <DialogDescription>Enter your secret key to initiate the contract.</DialogDescription>
          </DialogHeader>
          
          {state?.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Secret key entered successfully!
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
              <Label htmlFor="secretKey">Secret Key <span className="text-red-500">*</span></Label>
              <Input 
                name="secretKey" 
                type="password" 
                placeholder="Your secret key" 
                required 
                className="mt-1"
              />
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
