
"use client";

import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
}

export const EventCard = ({ event }: { event: TranslatedEvent }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  
  const handleViewOpportunitiesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card navigation
    e.preventDefault();
    router.push(`/events/${event.id}/opportunities`);
  }

  return (
    <>
      <Link href={`/events/${event.id}`} className="group block">
        <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="relative h-48 w-full overflow-hidden">
            {/* <Image
              src={imageError ? 'https://placehold.co/600x400/E0E0E0/FFFFFF/png?text=No+Image' : event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={event.imageHint}
              onError={() => setImageError(true)}
            /> */}
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
               <Button onClick={handleViewOpportunitiesClick} size="sm" className="font-bold">
                  View Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
      {/* TicketPurchaseDialog is still here but not directly used by the button anymore */}
      <TicketPurchaseDialog event={event} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};
