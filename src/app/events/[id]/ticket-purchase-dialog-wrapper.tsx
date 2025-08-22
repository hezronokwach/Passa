
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { TicketPurchaseDialog } from '@/components/passa/ticket-purchase-dialog';
import type { Event, Ticket as TicketTier } from '@prisma/client';

interface TranslatedEvent extends Event {
  translatedTitle: string;
  price: number;
  currency: string;
}

interface WrapperProps {
    event: TranslatedEvent & { tickets?: TicketTier[] };
    userHasTicket?: boolean;
}

export function TicketPurchaseDialogWrapper({ event, userHasTicket }: WrapperProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    // Ensure tickets property is an array
    const eventWithTickets = {
        ...event,
        tickets: event.tickets || [],
    };

    return (
        <>
            <Button
                className="w-full font-bold"
                onClick={() => setIsDialogOpen(true)}
                disabled={userHasTicket}
            >
                {userHasTicket ? 'You have a ticket' : 'Get Ticket'}
            </Button>
            {!userHasTicket && (
                <TicketPurchaseDialog event={eventWithTickets} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
            )}
        </>
    );
}
