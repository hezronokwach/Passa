'use server';

import prisma from '@/lib/db';
import { Header } from '@/components/passa/header';
import { getSession } from '@/lib/session';
import { EventCard } from '@/components/events/event-card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Link from 'next/link';

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
  const upcomingEvents = events.filter(e => e.date > new Date());
  const pastEvents = events.filter(e => e.date <= new Date());

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="font-headline text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Discover Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the best events across Africa. From concerts to conferences, find your next adventure.
            </p>
          </div>

          {/* Role-based welcome message */}
          {session && (
            <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {session.role === 'CREATOR' && <Users className="size-5 text-primary" />}
                  {session.role === 'ORGANIZER' && <Calendar className="size-5 text-primary" />}
                  {session.role === 'FAN' && <MapPin className="size-5 text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {session.role === 'CREATOR' && 'Find Performance Opportunities'}
                    {session.role === 'ORGANIZER' && 'Explore Other Events'}
                    {session.role === 'FAN' && 'Welcome Back!'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {session.role === 'CREATOR' && 'Apply to perform at events that match your skills'}
                    {session.role === 'ORGANIZER' && 'Get inspired by what other organizers are creating'}
                    {session.role === 'FAN' && 'Discover new events and get your tickets'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {events.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-6">
                  <Calendar className="size-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No Events Yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to discover amazing events when they&apos;re published.</p>
                {session?.role === 'ORGANIZER' && (
                  <Button asChild>
                    <Link href="/dashboard/organizer/events/create">
                      Create the First Event
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Calendar className="size-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Upcoming Events</h2>
                      <p className="text-muted-foreground">{upcomingEvents.length} events you can attend</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        userRole={session?.role}
                        userId={session?.userId}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                      <Clock className="size-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Past Events</h2>
                      <p className="text-muted-foreground">{pastEvents.length} events that have concluded</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        userRole={session?.role}
                        userId={session?.userId}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}