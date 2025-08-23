
"use client";

import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import type { Event } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardTitle,
} from '../ui/card';
import { TicketPurchaseDialog } from './ticket-purchase-dialog';
import Link from 'next/link';

export interface TranslatedEvent extends Event {
  totalBudget: number | null;
  published: boolean;
  tickets: { id: number; name: string; eventId: number; price: number; quantity: number; sold: number; }[];
  translatedTitle: string;
  price: number;
  currency: string;
  imageHint: string;
  ticketBuyers?: {
    id: number;
    name: string | null;
    email: string;
  }[];
  _count?: {
    purchasedTickets: number;
  };
}

export const EventCard = ({ event, userRole }: { event: TranslatedEvent; userRole?: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const router = useRouter();

  const ticketCount = event._count?.purchasedTickets || 0;
  const displayBuyers = event.ticketBuyers?.slice(0, 3) || [];
  const remainingCount = Math.max(0, ticketCount - 3);

  const handleViewOpportunitiesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/events/${event.id}/opportunities`);
  }

  const handleBuyTicketClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDialogOpen(true);
  }

  return (
    <>
      <Link href={`/events/${event.id}`} className="group block">
        <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <Image
              src={event.imageUrl || 'https://placehold.co/600x400/E0E0E0/FFFFFF/png?text=Event+Image'}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            {/* Ticket Buyers Section */}
            {ticketCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {displayBuyers.map((buyer) => (
                    <Avatar key={buyer.id} className="size-6 border-2 border-background">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${buyer.name || buyer.email}`} />
                      <AvatarFallback className="text-xs">
                        {(buyer.name || buyer.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {remainingCount > 0 && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-muted border-2 border-background text-xs font-medium">
                      +{remainingCount}
                    </div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {ticketCount} {ticketCount === 1 ? 'person' : 'people'} going
                </span>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
               <p className="text-xl font-bold text-primary">
                ${event.price} <span className="text-sm font-normal text-muted-foreground">{event.currency}</span>
              </p>
               {userRole === 'FAN' ? (
                 <Button onClick={handleBuyTicketClick} size="sm" className="font-bold">
                   Buy Ticket
                 </Button>
               ) : userRole === 'CREATOR' ? (
                 <Button onClick={handleViewOpportunitiesClick} size="sm" className="font-bold">
                   View Opportunities
                 </Button>
               ) : (
                 <Button onClick={handleViewOpportunitiesClick} size="sm" className="font-bold">
                   View Details
                 </Button>
               )}
            </div>
          </CardContent>
        </Card>
      </Link>
      {/* TicketPurchaseDialog is still here but not directly used by the button anymore */}
      <TicketPurchaseDialog event={event} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};
