
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Verified, Zap, Search } from 'lucide-react';
import { ClientHeader } from '@/components/passa/client-header';
import type { Event } from '@prisma/client';
import { EventCard } from '@/components/passa/event-card';
import { translateEventTitle } from '@/ai/flows/translate-event-title';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EventCardSkeleton } from '@/components/passa/event-card-skeleton';
import { Footer } from '@/components/passa/footer';


type TranslatedEvent = Event & {
  totalBudget: number | null;
  published: boolean;
  tickets?: { id: number; name: string; eventId: number; price: number; quantity: number; sold: number; }[];
  translatedTitle: string;
  price: number;
  currency: string;
  imageHint: string;
};

// --- Real Data Fetching (Commented Out) ---
// In a real application, you would uncomment this and use it instead of mock data.
/*
async function getFeaturedEvents() {
  const rawEvents = await prisma.event.findMany({
    include: { tickets: true },
    orderBy: { date: 'asc' },
    take: 4, // Fetch only 4 events
  });

  const events: TranslatedEvent[] = await Promise.all(
    rawEvents.map(async (event) => {
      try {
        const { translatedTitle } = await translateEventTitle({
          title: event.title,
          country: event.country,
        });
        
        return { 
            ...event, 
            translatedTitle,
            price: event.tickets[0]?.price ?? 0,
            currency: 'USD',
            imageHint: 'music festival',
        };
      } catch (error) {
        console.error('Translation failed for event:', event.title, error);
        return { 
            ...event, 
            translatedTitle: event.title,
            price: event.tickets[0]?.price ?? 0,
            currency: 'USD',
            imageHint: 'music festival',
        };
      }
    })
  );
  return events;
}
*/

const MotionBadge = motion(Badge);

const HeroVisual = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative mt-12 lg:mt-0 lg:col-span-6 h-[450px] lg:h-auto"
    >
      {/* Main Ticket */}
      <motion.div variants={itemVariants} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[280px] sm:w-[320px]">
        <Card className="rounded-2xl shadow-2xl bg-card/60 backdrop-blur-lg border-white/20">
          <CardHeader className="p-4">
            <div className="aspect-video relative rounded-lg overflow-hidden">
               <Image src="https://placehold.co/600x400.png" alt="Afrochella" data-ai-hint="music festival" fill className="object-cover" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
             <h3 className="font-bold font-headline text-lg">Afrochella Festival</h3>
             <p className="text-sm text-muted-foreground">Dec 28, 2024 - Accra, Ghana</p>
             <div className="flex justify-between items-center mt-3">
                <p className="text-xl font-bold text-primary">$50</p>
                <Button size="sm" className="font-bold">Get Ticket</Button>
             </div>
          </CardContent>
        </Card>
      </motion.div>

       {/* Live Payout card */}
      <motion.div variants={itemVariants} className="absolute top-[10%] left-[5%] sm:left-[15%] w-[180px]">
        <Card className="rounded-xl shadow-xl bg-card/60 backdrop-blur-lg border-white/20 p-3">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-500/20 rounded-full"><Zap className="size-4 text-green-400" /></div>
                <p className="text-sm font-semibold">Live Payout</p>
            </div>
            <p className="text-muted-foreground text-xs">Artist Share (70%)</p>
            <p className="text-xl font-bold text-green-400">+$35.00</p>
        </Card>
      </motion.div>

      {/* Sponsor card */}
       <motion.div variants={itemVariants} className="absolute bottom-[10%] right-[5%] sm:right-[15%] w-[200px]">
        <Card className="rounded-xl shadow-xl bg-card/60 backdrop-blur-lg border-white/20 p-3">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="corporate logo" />
                    <AvatarFallback>T</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold">Tusker</p>
                  <p className="text-xs text-green-400 font-semibold flex items-center gap-1"><Verified className="size-3"/> Sponsor Verified</p>
                </div>
            </div>
        </Card>
      </motion.div>
      
       {/* Verified Tickets Badge */}
       <motion.div variants={itemVariants} className="absolute bottom-[15%] left-[2%] sm:left-[10%]">
          <MotionBadge variant="secondary" className="bg-card/60 backdrop-blur-lg border-white/20 shadow-lg text-sm gap-2 p-2 pr-3">
             <Verified className="size-5 text-primary" /> Verified Tickets
          </MotionBadge>
       </motion.div>
       
       {/* Instant Payouts Badge */}
       <motion.div variants={itemVariants} className="absolute top-[12%] right-[2%] sm:right-[8%]">
          <MotionBadge variant="secondary" className="bg-card/60 backdrop-blur-lg border-white/20 shadow-lg text-sm gap-2 p-2 pr-3">
             <Zap className="size-5 text-accent" /> Instant Payouts
          </MotionBadge>
       </motion.div>

    </motion.div>
  );
}


export default function Home() {
  const [events, setEvents] = React.useState<TranslatedEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const creatorStories = [
    {
      name: 'Burna Boy',
      role: 'Afrobeats Superstar',
      story: '“Passa changed the game. My fans get real tickets, and I see the revenue in my wallet in real-time. It’s transparent, it’s fair, it’s the future.”',
      image: 'https://placehold.co/100x100.png',
      hint: 'musician portrait',
    },
    {
      name: 'Tusker Lager',
      role: 'Event Sponsor',
      story: '“We sponsored Afrochella and for the first time, saw exactly where our marketing dollars went. The attribution data from Passa is unmatched.”',
      image: 'https://placehold.co/100x100.png',
      hint: 'corporate headshot',
    },
     {
      name: 'Aisha Nabukeera',
      role: 'Content Creator',
      story: '“As a creator, getting paid fairly and instantly is everything. Passa makes it happen without me having to chase invoices or wait for months.”',
      image: 'https://placehold.co/100x100.png',
      hint: 'female videographer',
    },
  ];

  const [currentStory, setCurrentStory] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
        setCurrentStory((prev) => (prev + 1) % creatorStories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [creatorStories.length]);


   React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      // Mock data fetching with a delay to show skeleton loaders
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
          published: true,
          totalBudget: null,
          translatedTitle: 'Afrochella Festival',
          price: 50,
          currency: 'USD',
          imageHint: 'music festival',
        },
        {
          id: 2,
          title: 'Sauti Sol Live in Concert',
          description: '',
          date: new Date('2025-01-15'),
          location: 'Lagos, Nigeria',
          country: 'Nigeria',
          imageUrl: 'https://placehold.co/600x400.png',
          organizerId: 1,
          artistSplit: 80,
          venueSplit: 15,
          passaSplit: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          published: true,
          totalBudget: null,
          translatedTitle: 'Sauti Sol Live in Concert',
          price: 75,
          currency: 'USD',
          imageHint: 'live concert',
        },
        {
          id: 3,
          title: 'Amapiano Night with Major League DJz',
          description: '',
          date: new Date('2025-02-02'),
          location: 'Johannesburg, South Africa',
          country: 'South Africa',
          imageUrl: 'https://placehold.co/600x400.png',
          organizerId: 1,
          artistSplit: 65,
          venueSplit: 25,
          passaSplit: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          published: true,
          totalBudget: null,
          translatedTitle: 'Amapiano Night with Major League DJz',
          price: 40,
          currency: 'USD',
          imageHint: 'amapiano dj set',
        },
        {
          id: 4,
          title: 'Wizkid: Made in Lagos Tour',
          description: '',
          date: new Date('2025-02-20'),
          location: 'Accra, Ghana',
          country: 'Ghana',
          imageUrl: 'https://placehold.co/600x400.png',
          organizerId: 1,
          artistSplit: 85,
          venueSplit: 10,
          passaSplit: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          published: true,
          totalBudget: null,
          translatedTitle: 'Wizkid: Made in Lagos Tour',
          price: 100,
          currency: 'USD',
          imageHint: 'afrobeats concert',
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
                price: 50, // Mock price
                currency: 'USD',
                imageHint: 'music festival',
            };
          } catch (error) {
            console.error('Translation failed for event:', event.title, error);
            return { 
                ...event, 
                translatedTitle: event.title,
                price: 50, // Mock price
                currency: 'USD',
                imageHint: 'music festival',
            };
          }
        })
      );
      
      // Simulate network delay
      setTimeout(() => {
        setEvents(translatedEvents);
        setLoading(false);
      }, 1500);
    };

    fetchEvents();
  }, []);

  const navigateToLogin = () => {
    router.push('/events');
  };

  const navigateToRegister = () => {
    router.push('/events');
  }

  const howItWorks = [
    {
      icon: <Search className="size-8 text-primary" />,
      title: 'Discover & Buy',
      description: 'Find the hottest events and buy authentic tickets in seconds. No fakes, no fuss.',
    },
    {
      icon: <Zap className="size-8 text-primary" />,
      title: 'Artists Get Paid Instantly',
      description: 'Revenue from every ticket is split and sent directly to artists the moment it\'s sold.',
    },
    {
      icon: <Verified className="size-8 text-primary" />,
      title: 'Prove Your Impact',
      description: 'Creators and brands get transparent, on-chain proof of their promotional impact.',
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <ClientHeader />
      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-background py-12 md:py-20 lg:py-24">
          <div className="absolute inset-0 z-0 opacity-10 dark:[opacity-20] bg-grid-glow"></div>
           <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 text-center lg:text-left">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Experience Events.
                            <br />
                            <span className="text-primary">Transparent.</span> Secure.
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl lg:mx-0">
                          The future of African events is here. Real tickets, instant artist payouts, and fraud-proof experiences powered by the blockchain.
                        </p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                      <Button size="lg" className="font-semibold w-full sm:w-auto" onClick={navigateToLogin}>
                        Explore Events
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                      <Button size="lg" variant="outline" className="font-semibold w-full sm:w-auto" onClick={navigateToRegister}>
                        Become a Creator
                      </Button>
                    </motion.div>
                </div>
                <HeroVisual />
            </div>
        </section>

        <section id="how-it-works" className="w-full bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">How It Works</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                A simple, transparent, and powerful new way to do events.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <Card key={index} className="text-center transition-transform duration-300 hover:-translate-y-2">
                  <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      {step.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                    <CardDescription className="mt-2">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="w-full py-16 md:py-24 bg-secondary/50 dark:bg-card">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">Featured Events</h2>
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
                <Button size="lg" asChild>
                    <Link href="/events">View All Events <ArrowRight className="ml-2 size-4" /></Link>
                </Button>
            </div>
          </div>
        </section>

        <section id="stories" className="w-full bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">Why The Continent Trusts Passa</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                See how we&apos;re empowering the African creative economy.
              </p>
            </div>
            <div className="relative min-h-[250px] max-w-3xl mx-auto">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        <Card className="flex flex-col items-center p-6 text-center h-full justify-center">
                            <Image
                                src={creatorStories[currentStory].image}
                                alt={creatorStories[currentStory].name}
                                width={100}
                                height={100}
                                className="h-24 w-24 rounded-full object-cover mb-4"
                                data-ai-hint={creatorStories[currentStory].hint}
                            />
                            <div className="mt-4">
                                <blockquote className="text-xl italic text-foreground max-w-2xl mx-auto">
                                {creatorStories[currentStory].story}
                                </blockquote>
                                <p className="mt-4 font-bold">{creatorStories[currentStory].name}</p>
                                <p className="text-sm text-primary">{creatorStories[currentStory].role}</p>
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="w-full bg-primary py-16 text-primary-foreground md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Ready to Join the Revolution?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg opacity-80">
              Whether you&apos;re a fan, an artist, or a creator, there&apos;s a place for you on Passa.
            </p>
            <Button size="lg" variant="secondary" className="mt-8 font-bold text-primary hover:bg-white/90" onClick={navigateToLogin}>
              Explore All Events
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
