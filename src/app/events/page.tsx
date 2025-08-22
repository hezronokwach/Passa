'use server';

import { translateEventTitle } from '@/ai/flows/translate-event-title';
import React from 'react';
import { EventCard } from '@/components/passa/event-card';
import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import type { Event } from '@prisma/client';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation'; 
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type TranslatedEvent = Event & {
  translatedTitle: string;
  price: number;
  currency: string;
  imageHint: string;
};

async function getEvents() {
  const rawEvents = await prisma.event.findMany({
    include: { 
      tickets: true,
      _count: {
        select: { purchasedTickets: true }
      },
      purchasedTickets: {
        take: 3,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
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
            ticketBuyers: event.purchasedTickets.map(ticket => ticket.owner)
        };
      } catch (error) {
        console.error('Translation failed for event:', event.title, error);
        return { 
            ...event, 
            translatedTitle: event.title,
            price: event.tickets[0]?.price ?? 0,
            currency: 'USD',
            imageHint: 'music festival',
            ticketBuyers: event.purchasedTickets.map(ticket => ticket.owner)
        };
      }
    })
  );
  return events;
}

export default async function EventsPage() {
  const session = await getSession();
  const isAuthenticated = !!session;
  
  const events = await getEvents();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="ghost" asChild className="pl-0 mb-2">
                <Link href="/dashboard/fan">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="font-headline text-3xl font-bold md:text-4xl">
                All Events
              </h1>
            </div>
          </div>
          {events.length > 0 ? (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} userRole={session?.role} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20">
                <h2 className="text-2xl font-bold">No Events Yet</h2>
                <p className="text-muted-foreground mt-2">Check back soon for exciting events on Passa!</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}