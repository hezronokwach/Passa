
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';

import type { Event } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardTitle,
} from '../ui/card';
import { TicketPurchaseDialog } from './ticket-purchase-dialog';
import Link from 'next/link';

interface TranslatedEvent extends Event {
  translatedTitle: string;
  price: number;
  currency: string;
  imageHint: string;
  tickets: { name: string; id: number; eventId: number; price: number; quantity: number; sold: number; }[];
}

export const EventCard = ({ event }: { event: TranslatedEvent }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleGetTicketClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card navigation
    e.preventDefault();
    setIsDialogOpen(true);
  }

  return (
    <>
      <Link href={`/events/${event.id}`} className="group block">
        <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={event.imageHint}
            />
          </div>
          <CardContent className="flex flex-1 flex-col justify-between p-4">
            <div>
              <CardTitle className="font-headline text-2xl leading-tight">
                {event.translatedTitle}
              </CardTitle>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
               <p className="text-xl font-bold text-primary">
                ${event.price} <span className="text-sm font-normal text-muted-foreground">{event.currency}</span>
              </p>
               <Button onClick={handleGetTicketClick} size="sm" className="font-bold">
                  Get Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
      <TicketPurchaseDialog event={event} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};
