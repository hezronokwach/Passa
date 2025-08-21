'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Users } from 'lucide-react';
import { createDirectInvite } from '@/app/actions/direct-invite';

export function DirectInviteDialog({ eventId, children }: { eventId: number; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await createDirectInvite(formData);
    if (result?.success) {
      setTimeout(() => setOpen(false), 1500);
    }
    return result;
  }, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full">
            <Users className="size-4 mr-2" />
            Invite Artist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="eventId" value={eventId} />
          <DialogHeader>
            <DialogTitle>Invite Artist to Perform</DialogTitle>
            <DialogDescription>Send a direct invitation to an artist</DialogDescription>
          </DialogHeader>
          
          {state?.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Invitation sent successfully!
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
              <Label htmlFor="artistName">Artist Name <span className="text-red-500">*</span></Label>
              <Input name="artistName" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="artistEmail">Artist Email <span className="text-red-500">*</span></Label>
              <Input name="artistEmail" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="proposedFee">Performance Fee ($) <span className="text-red-500">*</span></Label>
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
                placeholder="We'd love to have you perform at our event..."
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