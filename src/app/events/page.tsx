'use server';

import prisma from '@/lib/db';
import { Header } from '@/components/passa/header';
import { getSession } from '@/lib/session';
import { EventCard } from '@/components/events/event-card';

async function getPublishedEvents() {
  return await prisma.event.findMany({
    where: { published: true },
    include: {
      tickets: true,
      organizer: {
        select: { name: true }
      },
      _count: {
        select: { purchasedTickets: true }
      }
    },
    orderBy: { date: 'asc' }
  });
}

export default async function EventsPage() {
  const events = await getPublishedEvents();
  const session = await getSession();

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-bold mb-2">Upcoming Events</h1>
            <p className="text-muted-foreground">Discover amazing events across Africa</p>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  userRole={session?.role}
                  userId={session?.userId}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}