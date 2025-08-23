'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { inviteWithFee } from '@/app/actions/invite-with-fee';

export function InviteWithFeeDialog({ invitation }: { invitation: { id: number; artistName: string } }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await inviteWithFee(formData);
    if (result?.success) {
      setTimeout(() => setOpen(false), 1500);
    }
    return result;
  }, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Invite </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="invitationId" value={invitation.id} />
          <DialogHeader>
            <DialogTitle>Invite {invitation.artistName}</DialogTitle>
            <DialogDescription>Set the performance fee for this artist</DialogDescription>
          </DialogHeader>
          
          {state?.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Invitation sent successfully! {invitation.artistName} will be notified.
              </AlertDescription>
            </Alert>
          )}
          
          {state?.success === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {state.message || 'Failed to send invitation. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="proposedFee">Performance Fee (XLM) <span className="text-red-500">*</span></Label>
              <Input 
                name="proposedFee" 
                type="number" 
                step="0.01" 
                min="0"
                placeholder="1000" 
                required 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea 
                name="message" 
                placeholder="We'd love to have you perform..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending || state?.success}>
              {pending ? 'Sending...' : state?.success ? 'Sent!' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}