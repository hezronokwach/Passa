
'use server';

import { translateEventTitle } from '@/ai/flows/translate-event-title';
import React from 'react';
import { EventCard } from '@/components/passa/event-card';
import { DashboardHeader } from '@/components/passa/dashboard-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import prisma from '@/lib/db';
import type { Event, Ticket } from '@prisma/client';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation'; 


type EventWithTickets = Event & { tickets: Ticket[] };

type TranslatedEvent = EventWithTickets & {
  translatedTitle: string;
  price: number;
  currency: string;
  imageHint: string;
};

async function getUserRole() {
  const session = await getSession();
  return session?.role ?? 'FAN';
}

async function getUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  
  return user ?? null;
}

export default async function DashboardPage() {
  const user = await getUser();
  // const role = await getUserRole();

  if (!user) {
    return redirect('/login');
  }
  
  const userRole = await getUserRole();
  const rawEvents = await prisma.event.findMany({
    include: { tickets: true },
    orderBy: { date: 'asc' },
  });

  const events: TranslatedEvent[] = await Promise.all(
    rawEvents.map(async (event) => {
      try {
        const { translatedTitle } = await translateEventTitle({
          title: event.title,
          country: event.country,
        });
        
        return { 
            ...event, 
            translatedTitle,
            price: event.tickets[0]?.price ?? 0,
            currency: 'USD',
            imageHint: 'music festival',
        };
      } catch (error) {
        console.error('Translation failed for event:', event.title, error);
        return { 
            ...event, 
            translatedTitle: event.title,
            price: event.tickets[0]?.price ?? 0,
            currency: 'USD',
            imageHint: 'music festival',
        };
      }
    })
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-3xl font-bold md:text-4xl">
              Upcoming Events
            </h1>
            {userRole === 'ORGANIZER' && (
              <Link href="/dashboard/organizer/events/create">
                  <Button>
                      <PlusCircle className="mr-2 size-4" />
                      Create Event
                  </Button>
              </Link>
            )}
          </div>
          {events.length > 0 ? (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20">
                <h2 className="text-2xl font-bold">No Events Yet</h2>
                <p className="text-muted-foreground mt-2">Check back soon for exciting events on Passa!</p>
                 {userRole === 'ORGANIZER' && (
                    <Button className="mt-6" asChild>
                         <Link href="/dashboard/organizer/events/create">Create Your First Event</Link>
                    </Button>
                 )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
