'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/passa/event-card';
import { EventCardSkeleton } from '@/components/passa/event-card-skeleton';
import Link from 'next/link';
import type { Event } from '@prisma/client';

type TranslatedEvent = Event & {
    translatedTitle: string;
    price: number;
    currency: string;
    imageHint: string;
    tickets: { name: string; id: number; eventId: number; price: number; quantity: number; sold: number; }[];
};

interface EventsSectionProps {
    events: TranslatedEvent[];
    loading: boolean;
}

export function EventsSection({ events, loading }: EventsSectionProps) {
    return (
        <section id="events" className="relative w-full py-16 md:py-24" style={{ backgroundColor: 'rgba(41, 111, 94, 0.15)' }}>
            {/* African Pattern Border Strip */}
            <div 
                className="absolute top-0 left-0 right-0 h-2 opacity-60"
                style={{
                    backgroundImage: 'url(/passa-africantenge.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat-x'
                }}
            />
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold md:text-4xl text-foreground">Featured Events</h2>
                    <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                        Discover the best events happening across the continent. Your next experience awaits.
                    </p>
                </div>
                <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
                        : events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                </div>
                <div className="mt-12 text-center">
                    <Button 
                        size="lg" 
                        className="text-white hover:opacity-90 border-2 hover:scale-105 transition-all duration-300" 
                        style={{ backgroundColor: '#296F5E', borderColor: '#E99125' }}
                        asChild
                    >
                        <Link href="/dashboard">View All Events <ArrowRight className="ml-2 size-4" /></Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}