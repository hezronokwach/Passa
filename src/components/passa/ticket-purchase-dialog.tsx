
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Event, Ticket } from '@prisma/client';
import { Confetti } from './confetti';
import { useToast } from '@/hooks/use-toast';
import { TicketStub } from './ticket-stub';
import { WalletConnector } from './wallet-connector';
import { handleTicketPurchase } from '@/lib/actions/purchase-client';


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
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [buyerSecretKey, setBuyerSecretKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchaseClick = () => {
    if (!selectedTicketId) {
        toast({
            title: "Error",
            description: "Please select a ticket tier.",
            variant: "destructive"
        });
        return;
    }
    setShowWalletConnect(true);
  };

  const handleWalletConnect = async (secretKey: string) => {
    setBuyerSecretKey(secretKey);
    setIsPurchasing(true);
    
    const result = await handleTicketPurchase(
      event.id, 
      selectedTicketId!, 
      secretKey
    );
    
    if (result.success) {
        toast({
        title: "Purchase Successful!",
        description: `You got 1 ticket for ${event.translatedTitle}.`,
        });
        setPurchaseSuccess(true);
        setShowWalletConnect(false);
        
        // Reset state and close dialog after animation
        setTimeout(() => {
            setIsOpen(false);
            setTimeout(() => {
                setPurchaseSuccess(false);
                setIsPurchasing(false);
                setQrCode(null);
                setBuyerSecretKey(null);
            }, 500);
        }, 3000);
    } else {
        toast({
            title: "Purchase Failed",
            description: result.message || "Something went wrong.",
            variant: "destructive"
        });
        setIsPurchasing(false);
        setShowWalletConnect(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    // Don't allow closing while purchasing
    if (isPurchasing) return;
    setIsOpen(open);
    // Reset success state if dialog is closed manually
    if (!open) {
        setPurchaseSuccess(false);
        setQrCode(null);
        setSelectedTicketId(null);
        setShowWalletConnect(false);
        setBuyerSecretKey(null);
    }
  }

  const selectedTicket = event.tickets?.find(t => t.id === selectedTicketId);
  const hasMultipleTickets = (event.tickets?.length || 0) > 1;

  return (
    <>
      <Confetti active={purchaseSuccess} />
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent 
          className={hasMultipleTickets ? "max-w-md" : "max-w-sm p-0 bg-transparent border-0 shadow-none"}
        >
          <DialogTitle className="sr-only">{event.translatedTitle}</DialogTitle>
          <DialogDescription className="sr-only">Purchase ticket for {event.translatedTitle}</DialogDescription>
          
          {showWalletConnect ? (
            <WalletConnector 
              onConnect={handleWalletConnect}
              isConnecting={isPurchasing}
            />
          ) : hasMultipleTickets && !selectedTicketId ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Select Ticket Type</h3>
                <p className="text-sm text-muted-foreground">{event.translatedTitle}</p>
              </div>
              
              <div className="space-y-3">
                {event.tickets?.map((ticket) => (
                  <Card key={ticket.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => setSelectedTicketId(ticket.id)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{ticket.name}</h4>
                          <p className="text-sm text-muted-foreground">{ticket.quantity - ticket.sold} available</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{ticket.price} XLM</p>
                          <p className="text-xs text-muted-foreground">Stellar Lumens</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <TicketStub 
              event={{
                ...event,
                price: selectedTicket?.price || event.tickets?.[0]?.price || event.price
              }} 
              onPurchase={handlePurchaseClick}
              isPurchasing={isPurchasing}
              isSuccess={purchaseSuccess}
              qrCode={qrCode || undefined}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
