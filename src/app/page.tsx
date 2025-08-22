'use client';

import { useState, useEffect } from "react";
import { ClientHeader } from '@/components/passa/client-header';
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/passa/footer";
import { VideoModal } from "@/components/video-modal";
import SectionDivider from "@/components/section-divider";

import { EventsSection } from "@/components/sections/events-section";
import type { Event } from '@prisma/client';
import { translateEventTitle } from '@/ai/flows/translate-event-title';

type TranslatedEvent = Event & {
    translatedTitle: string;
    price: number;
    currency: string;
    imageHint: string;
    tickets: { name: string; id: number; eventId: number; price: number; quantity: number; sold: number; }[];
};

export default function LandingPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [events, setEvents] = useState<TranslatedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const handleWatchVideo = () => {
    setIsVideoModalOpen(true);
  };

  useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const mockEvents: TranslatedEvent[] = [
                {
                    id: 1,
                    title: 'African Music Fest',
                    description: 'A vibrant celebration of African music and culture.',
                    date: new Date('2024-10-26'),
                    location: 'Accra, Ghana',
                    country: 'Ghana',
                    imageUrl: '/Event_001.jpeg',
                    organizerId: 1,
                    artistSplit: 70,
                    venueSplit: 20,
                    passaSplit: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    translatedTitle: 'African Music Fest',
                    price: 75,
                    currency: 'USD',
                    imageHint: 'music festival',
                    tickets: [{ id: 1, eventId: 1, name: 'Standard', price: 75, quantity: 100, sold: 0 }],
                },
                {
                    id: 2,
                    title: 'Cultural Dance Showcase',
                    description: 'Experience the rich diversity of African dance forms.',
                    date: new Date('2024-11-15'),
                    location: 'Lagos, Nigeria',
                    country: 'Nigeria',
                    imageUrl: '/Event_002.jpeg',
                    organizerId: 2,
                    artistSplit: 60,
                    venueSplit: 25,
                    passaSplit: 15,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    translatedTitle: 'Cultural Dance Showcase',
                    price: 40,
                    currency: 'USD',
                    imageHint: 'dance performance',
                    tickets: [{ id: 2, eventId: 2, name: 'General', price: 40, quantity: 80, sold: 0 }],
                },
                {
                    id: 3,
                    title: 'Afro-Tech Summit',
                    description: 'Innovations and discussions shaping the future of African technology.',
                    date: new Date('2024-12-01'),
                    location: 'Cape Town, South Africa',
                    country: 'South Africa',
                    imageUrl: '/Event_003.jpeg',
                    organizerId: 3,
                    artistSplit: 0,
                    venueSplit: 0,
                    passaSplit: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    translatedTitle: 'Afro-Tech Summit',
                    price: 120,
                    currency: 'USD',
                    imageHint: 'tech conference',
                    tickets: [{ id: 3, eventId: 3, name: 'VIP', price: 120, quantity: 50, sold: 0 }],
                },
                {
                    id: 4,
                    title: 'Traditional Art Exhibition',
                    description: 'A display of exquisite traditional African artworks.',
                    date: new Date('2025-01-20'),
                    location: 'Dakar, Senegal',
                    country: 'Senegal',
                    imageUrl: '/Event_004.jpeg',
                    organizerId: 4,
                    artistSplit: 50,
                    venueSplit: 30,
                    passaSplit: 20,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    translatedTitle: 'Traditional Art Exhibition',
                    price: 30,
                    currency: 'USD',
                    imageHint: 'art exhibition',
                    tickets: [{ id: 4, eventId: 4, name: 'Entry', price: 30, quantity: 150, sold: 0 }],
                },
            ];

            const translatedEvents: TranslatedEvent[] = await Promise.all(
                mockEvents.map(async (event) => {
                    try {
                        const { translatedTitle } = await translateEventTitle({
                            title: event.title,
                            country: event.country,
                        });
                        return {
                            ...event,
                            translatedTitle,
                            price: 50,
                            currency: 'USD',
                            imageHint: 'music festival',
                        };
                    } catch (error) {
                        console.error('Translation failed for event:', event.title, error);
                        return {
                            ...event,
                            translatedTitle: event.title,
                            price: 50,
                            currency: 'USD',
                            imageHint: 'music festival',
                        };
                    }
                })
            );

            setTimeout(() => {
                setEvents(translatedEvents);
                setLoading(false);
            }, 800);
        };

        fetchEvents();
    }, []);

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />
      <HeroSection onWatchVideo={handleWatchVideo} />
      
      <FeaturesSection />
      <SectionDivider thickness="8px" />
      <EventsSection events={events} loading={loading} />
      <CTASection />
      <Footer />
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="Passa: Celebrating African Culture"
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />
    </div>
  );
}
