'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, DollarSign, Users } from 'lucide-react';
import { releaseEventPayments } from '@/app/actions/release-payments';

interface ReleasePaymentsDialogProps {
  eventId: number;
  artistCount: number;
  totalAmount: number;
  eventTitle: string;
}

export function ReleasePaymentsDialog({ eventId, artistCount, totalAmount, eventTitle }: ReleasePaymentsDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await releaseEventPayments(formData);
    if (result?.success) {
      setTimeout(() => setOpen(false), 2000);
    }
    return result;
  }, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Release Payments
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="eventId" value={eventId} />
          <DialogHeader>
            <DialogTitle>Release Artist Payments</DialogTitle>
            <DialogDescription>
              Release payments to all artists for {eventTitle}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Payment Summary</span>
              </div>
              <div className="text-sm text-blue-700">
                <p>Artists to pay: {artistCount}</p>
                <p>Total amount: {totalAmount.toFixed(2)} XLM</p>
              </div>
            </div>

            {state?.success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {state.message}
                  {state.transactionHash && (
                    <div className="mt-2">
                      <p className="text-xs">Transaction: {state.transactionHash}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {state?.success === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {state.message || 'Failed to release payments. Please try again.'}
                </AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label htmlFor="secretKey">Your Secret Key <span className="text-red-500">*</span></Label>
              <Input 
                name="secretKey" 
                type="password" 
                placeholder="S..." 
                required 
                className="mt-1 font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Required to sign the payment release transaction
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={pending || state?.success}>
              {pending ? 'Releasing...' : state?.success ? 'Released!' : 'Release Payments'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}