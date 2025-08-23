"use client";

import React, { useState } from "react";
import { ClientHeader } from "@/components/passa/client-header";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/passa/footer";
import { VideoModal } from "@/components/video-modal";
import { EventsSection } from "@/components/sections/events-section";

export default function Home() {
  const [events, setEvents] = React.useState<TranslatedEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const creatorStories = [
    {
      name: "Burna Boy",
      role: "Afrobeats Superstar",
      story:
        "“Passa changed the game. My fans get real tickets, and I see the revenue in my wallet in real-time. It’s transparent, it’s fair, it’s the future.”",
      image: "https://placehold.co/100x100.png",
      hint: "musician portrait",
    },
    {
      name: "Tusker Lager",
      role: "Event Sponsor",
      story:
        "“We sponsored Afrochella and for the first time, saw exactly where our marketing dollars went. The attribution data from Passa is unmatched.”",
      image: "https://placehold.co/100x100.png",
      hint: "corporate headshot",
    },
    {
      name: "Aisha Nabukeera",
      role: "Content Creator",
      story:
        "“As a creator, getting paid fairly and instantly is everything. Passa makes it happen without me having to chase invoices or wait for months.”",
      image: "https://placehold.co/100x100.png",
      hint: "female videographer",
    },
  ];

  // Rotating stories disabled for now to satisfy lint
  // const [currentStory, setCurrentStory] = React.useState(0);
  type TranslatedEvent = {
    id: number;
    title: string;
    description: string;
    date: Date;
    location: string;
    country: string;
    imageUrl: string;
    organizerId: number;
    artistSplit: number;
    venueSplit: number;
    passaSplit: number;
    createdAt: Date;
    updatedAt: Date;
    translatedTitle: string;
    price: number;
    currency: string;
    imageHint: string;
    published: boolean;
    totalBudget: number;
    tickets: { id: number; eventId: number; name: string; price: number; quantity: number; sold: number }[];
  };

  // Rotating stories disabled for now
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentStory((prev) => (prev + 1) % creatorStories.length);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, [creatorStories.length]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      // Mock data fetching with a delay to show skeleton loaders
      const mockEvents: TranslatedEvent[] = [
        {
          id: 1,
          title: "Afrochella Festival",
          description: "",
          date: new Date("2024-12-28"),
          location: "Nairobi, Kenya",
          country: "Kenya",
          imageUrl: "https://placehold.co/600x400.png",
          organizerId: 1,
          artistSplit: 70,
          venueSplit: 20,
          passaSplit: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          translatedTitle: "Afrochella Festival",
          price: 50,
          currency: "USD",
          imageHint: "music festival",
          published: true,
          totalBudget: 10000,
          tickets: [
            { id: 1, eventId: 1, name: "Regular", price: 50, quantity: 100, sold: 0 },
          ],
        },
        {
          id: 2,
          title: "Sauti Sol Live in Concert",
          description: "",
          date: new Date("2025-01-15"),
          location: "Lagos, Nigeria",
          country: "Nigeria",
          imageUrl: "https://placehold.co/600x400.png",
          organizerId: 1,
          artistSplit: 80,
          venueSplit: 15,
          passaSplit: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          translatedTitle: "Sauti Sol Live in Concert",
          price: 75,
          currency: "USD",
          imageHint: "live concert",
          published: true,
          totalBudget: 10000,
          tickets: [
            { id: 2, eventId: 2, name: "VIP", price: 75, quantity: 50, sold: 0 },
          ],
        },
        {
          id: 3,
          title: "Amapiano Night with Major League DJz",
          description: "",
          date: new Date("2025-02-02"),
          location: "Johannesburg, South Africa",
          country: "South Africa",
          imageUrl: "https://placehold.co/600x400.png",
          organizerId: 1,
          artistSplit: 65,
          venueSplit: 25,
          passaSplit: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          translatedTitle: "Amapiano Night with Major League DJz",
          price: 40,
          currency: "USD",
          imageHint: "amapiano dj set",
          published: true,
          totalBudget: 10000,
          tickets: [
            { id: 3, eventId: 3, name: "Standard", price: 40, quantity: 200, sold: 0 },
          ],
        },
        {
          id: 4,
          title: "Wizkid: Made in Lagos Tour",
          description: "",
          date: new Date("2025-02-20"),
          location: "Accra, Ghana",
          country: "Ghana",
          imageUrl: "https://placehold.co/600x400.png",
          organizerId: 1,
          artistSplit: 85,
          venueSplit: 10,
          passaSplit: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          translatedTitle: "Wizkid: Made in Lagos Tour",
          price: 100,
          currency: "USD",
          imageHint: "afrobeats concert",
          published: true,
          totalBudget: 10000,
          tickets: [
            { id: 4, eventId: 4, name: "Premium", price: 100, quantity: 75, sold: 0 },
          ],
        },
      ];

      const translatedEvents: TranslatedEvent[] = mockEvents.map((event) => ({
        ...event,
        translatedTitle: event.title, // Use original title for now
        price: 50,
        currency: "USD",
        imageHint: "music festival",
      }));

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
      <main className="flex-1">
        <HeroSection onWatchVideo={() => setIsVideoModalOpen(true)} />
        <FeaturesSection />
        <EventsSection events={events} loading={loading} />
        <CTASection />
      </main>

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
