import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from 'lucide-react';
import { ApplyToPerformDialog } from '@/components/passa/apply-to-perform-dialog';
import { TicketPurchaseDialogWrapper } from '@/app/events/[id]/ticket-purchase-dialog-wrapper';

type TicketPurchaseProps = {
  event: {
    id: number;
    title: string;
    translatedTitle: string;
    price: number;
    artistSplit: number;
    venueSplit: number;
    passaSplit: number;
    tickets: Array<{ id: number; name: string; price: number; quantity: number; sold: number }>;
    imageUrl: string;
    date: Date;
    location: string;
    country: string;
    description: string;
    organizerId: number;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    totalBudget: number | null;
    artistInvitations: Array<{ id: number; artistId: number | null; status: 'PENDING' | 'ACCEPTED' | 'REJECTED'; proposedFee: number; artistComments: string | null }>;
  };
  session: {
    userId: number;
    role: string;
  } | null;
  hasApplied: boolean;
  applicationStatus?: string;
  isOwnEvent: boolean;
};

export function TicketPurchase({ 
  event, 
  session, 
  hasApplied, 
  applicationStatus, 
  isOwnEvent 
}: TicketPurchaseProps) {

  const eventWithEventIdInTickets = {
    ...event,
    tickets: event.tickets.map(ticket => ({ ...ticket, eventId: event.id }))
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Ticket className="size-6 text-primary" />
          Get Your Ticket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.tickets.length > 1 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground text-center">Ticket Options</p>
            {event.tickets.map((ticket) => (
              <div key={ticket.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{ticket.name}</p>
                  <p className="text-sm text-muted-foreground">{ticket.quantity - ticket.sold} left</p>
                </div>
                <p className="text-xl font-bold">${ticket.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-4xl font-bold text-center">
            ${event.tickets[0]?.price || 0} <span className="text-lg font-normal text-muted-foreground">USD</span>
          </div>
        )}

        {!session ? (
          <Button asChild className="w-full">
            <Link href="/login">Login to Buy Tickets</Link>
          </Button>
        ) : session.role === 'CREATOR' ? (
          <div className="space-y-2">
            {!hasApplied ? (
              <ApplyToPerformDialog event={{ id: event.id, title: event.title }} />
            ) : (
              <Button disabled className="w-full">
                {applicationStatus === 'PENDING' && 'Application Pending'}
                {applicationStatus === 'ACCEPTED' && 'Application Accepted'}
                {applicationStatus === 'REJECTED' && 'Application Rejected'}
              </Button>
            )}
            <TicketPurchaseDialogWrapper 
              event={{ ...eventWithEventIdInTickets, currency: 'USD' }} 
            />
          </div>
        ) : isOwnEvent && session.role === 'ORGANIZER' ? (
          <div className="text-center text-muted-foreground">
            <p>This is your event</p>
          </div>
        ) : (
          <TicketPurchaseDialogWrapper 
            event={{ ...eventWithEventIdInTickets, currency: 'USD' }} 
          />
        )}


      </CardContent>
    </Card>
  );
}