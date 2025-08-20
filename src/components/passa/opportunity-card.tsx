
"use client";

import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

import type { Event } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardTitle,
} from '../ui/card';

// This is the same data structure used by EventCard for consistency.
// It can be moved to a shared types file later.
interface TranslatedEvent extends Event {
  translatedTitle: string;
  price: number; // Represents budget/payout for the opportunity
  currency: string;
  imageHint: string;
}

export const OpportunityCard = ({ event }: { event: TranslatedEvent }) => {
  return (
    <Link href={`/dashboard/creator/opportunities/${event.id}`} className="group block">
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
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
             <Button size="sm" className="font-bold">
                View & Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
