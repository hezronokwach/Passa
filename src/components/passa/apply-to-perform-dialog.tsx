'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { applyToPerform } from '@/app/actions/apply-to-perform';

export function ApplyToPerformDialog({ event }: { event: { id: number; title: string } }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await applyToPerform(formData);
    setOpen(false);
    return result;
  }, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Apply to Perform</Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="eventId" value={event.id} />
          <DialogHeader>
            <DialogTitle>Apply to Perform</DialogTitle>
            <DialogDescription>Apply to perform at {event.title}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="message">Why do you want to perform at this event?</Label>
            <Textarea
              name="message"
              placeholder="Tell the organizer about yourself and why you'd be great for this event..."
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? 'Sending...' : 'Send Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}