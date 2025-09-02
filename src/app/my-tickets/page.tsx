'use server';

import { getMyTickets } from '@/app/actions/get-my-tickets';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function MyTicketsPage() {
  const tickets = await getMyTickets();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
        <p className="text-muted-foreground mb-8">
          View and manage your event tickets.
        </p>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              You don&apos;t have any tickets yet.
            </p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-xl">{ticket.event.title}</h2>
                  <p className="text-muted-foreground">{ticket.ticket.name}</p>
                </div>
                <div>
                  <Button asChild>
                    <Link href={`/events/${ticket.eventId}`}>View Event</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
