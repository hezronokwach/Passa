import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, MapPin, User } from 'lucide-react';

type EventDetailsProps = {
  event: {
    title: string;
    translatedTitle: string;
    description: string;
    date: Date;
    location: string;
    imageUrl: string;
    organizer: {
      name: string | null;
      organizerProfile: {
        companyName: string | null;
        bio: string | null;
      } | null;
    };
  };
  isAlreadySponsor?: boolean;
};

export function EventDetails({ event, isAlreadySponsor }: EventDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="music festival"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {isAlreadySponsor && (
            <div className="absolute bottom-4 right-4">
              <div className="text-sm py-2 px-3 bg-primary/90 text-primary-foreground backdrop-blur-sm rounded-lg font-medium">
                ✨ You are a sponsor!
              </div>
            </div>
          )}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {event.translatedTitle}
            </h1>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-x-6 gap-y-3 items-center text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <span className="font-medium">
                {new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'full' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-semibold mb-4">About this event</h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{event.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="text-primary size-5" />
            </div>
            <h3 className="text-xl font-semibold">About the Organizer</h3>
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="text-xl font-semibold mb-2">
            {event.organizer.organizerProfile?.companyName || event.organizer.name}
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            {event.organizer.organizerProfile?.bio || 'Professional event organizer bringing amazing experiences to life.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}