'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { applyToPerform } from '@/app/actions/apply-to-perform';

export function ApplyToPerformDialog({ event }: { event: { id: number; title: string } }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await applyToPerform(formData);
    if (result?.success) {
      setTimeout(() => setOpen(false), 1500);
    }
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
          
          {state?.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Application sent successfully! The organizer will review it soon.
              </AlertDescription>
            </Alert>
          )}
          
          {state?.success === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {state.message || 'Failed to send application. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="py-4">
            <Label htmlFor="message">Why do you want to perform at this event? <span className="text-red-500">*</span></Label>
            <Textarea
              name="message"
              placeholder="Tell the organizer about yourself and why you'd be great for this event..."
              required
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending || state?.success}>
              {pending ? 'Sending...' : state?.success ? 'Sent!' : 'Send Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}