import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';

type EventCardProps = {
  event: {
    id: number;
    title: string;
    date: Date;
    location: string;
    imageUrl: string;
    organizerId: number;
    tickets: { price: number }[];
    organizer: { name: string | null };
    _count: { purchasedTickets: number };
  };
  userRole?: string;
  userId?: number;
};

export function EventCard({ event, userRole, userId }: EventCardProps) {
  const isOwnEvent = userId === event.organizerId;
  const minPrice = Math.min(...event.tickets.map(t => t.price));
  const maxPrice = Math.max(...event.tickets.map(t => t.price));
  const priceDisplay = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
  const isUpcoming = new Date(event.date) > new Date();

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {isUpcoming ? (
            <Badge className="bg-green-500/90 hover:bg-green-500">Upcoming</Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-500/90 text-white">Past Event</Badge>
          )}
          {isOwnEvent && userRole === 'ORGANIZER' && (
            <Badge className="bg-primary/90 hover:bg-primary">Your Event</Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-black font-semibold">
            {priceDisplay}
          </Badge>
        </div>
        
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-headline text-xl font-bold text-white line-clamp-2 drop-shadow-lg">
            {event.title}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4 text-primary" />
              <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              <span className="truncate font-medium">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4 text-primary" />
              <span className="font-medium">{event._count.purchasedTickets} attending</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button asChild className="flex-1 shadow-sm">
              <Link href={`/events/${event.id}`}>
                View Details
              </Link>
            </Button>
            
            {isOwnEvent && userRole === 'ORGANIZER' && (
              <Button variant="outline" asChild className="shadow-sm">
                <Link href={`/dashboard/organizer/events/${event.id}`}>
                  Manage
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}