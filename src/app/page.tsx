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
                    title: 'Afrochella Festival',
                    description: '',
                    date: new Date('2024-12-28'),
                    location: 'Nairobi, Kenya',
                    country: 'Kenya',
                    imageUrl: 'https://placehold.co/600x400.png',
                    organizerId: 1,
                    artistSplit: 70,
                    venueSplit: 20,
                    passaSplit: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    translatedTitle: 'Afrochella Festival',
                    price: 50,
                    currency: 'USD',
                    imageHint: 'music festival',
                    tickets: [{ id: 1, eventId: 1, name: 'Regular', price: 50, quantity: 100, sold: 0 }],
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
            }, 1500);
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
