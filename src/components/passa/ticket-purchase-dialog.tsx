
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Event, Ticket } from '@prisma/client';
import { Confetti } from './confetti';
import { useToast } from '@/components/ui/use-toast';
import { TicketStub } from './ticket-stub';
import { purchaseTicket } from '@/app/actions/fan';

interface TicketPurchaseDialogProps {
  event: Event & { 
    totalBudget: number | null;
    published: boolean;
    tickets?: Ticket[];
    translatedTitle: string;
    price: number;
    currency: string;
  };
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function TicketPurchaseDialog({ event, isOpen, setIsOpen }: TicketPurchaseDialogProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    setIsPurchasing(true);
    
    // In a real app, you might have multiple ticket tiers. We'll use the first one.
    const ticketTier = event.tickets?.[0];
    if (!ticketTier) {
        toast({
            title: "Error",
            description: "No tickets available for this event.",
            variant: "destructive"
        });
        setIsPurchasing(false);
        return;
    }

    const result = await purchaseTicket({ eventId: event.id, ticketId: ticketTier.id });
    
    if (result.success) {
        toast({
        title: "Purchase Successful!",
        description: `You got 1 ticket for ${event.translatedTitle}.`,
        });
        setPurchaseSuccess(true);
        
        // Reset state and close dialog after animation
        setTimeout(() => {
            setIsOpen(false);
            // A slight delay before resetting purchase success to let dialog close animation finish
            setTimeout(() => {
                setPurchaseSuccess(false);
                setIsPurchasing(false);
            }, 500);
        }, 3000);
    } else {
        toast({
            title: "Purchase Failed",
            description: result.message || "Something went wrong.",
            variant: "destructive"
        });
        setIsPurchasing(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    // Don't allow closing while purchasing
    if (isPurchasing) return;
    setIsOpen(open);
    // Reset success state if dialog is closed manually
    if (!open) {
        setPurchaseSuccess(false);
    }
  }

  return (
    <>
      <Confetti active={purchaseSuccess} />
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-sm p-0 bg-transparent border-0 shadow-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <DialogTitle className="sr-only">{event.translatedTitle}</DialogTitle>
          <DialogDescription className="sr-only">Purchase ticket for {event.translatedTitle}</DialogDescription>
          <TicketStub 
            event={event} 
            onPurchase={handlePurchase}
            isPurchasing={isPurchasing}
            isSuccess={purchaseSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
