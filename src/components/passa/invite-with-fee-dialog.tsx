'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { inviteWithFee } from '@/app/actions/invite-with-fee';

export function InviteWithFeeDialog({ invitation }: { invitation: { id: number; artistName: string } }) {
  const [open, setOpen] = useState(false);
  const [, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await inviteWithFee(formData);
    setOpen(false);
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
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="proposedFee">Performance Fee ($)</Label>
              <Input name="proposedFee" type="number" step="0.01" placeholder="1000" required />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea name="message" placeholder="We'd love to have you perform..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}