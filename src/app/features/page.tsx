
import { Header } from '@/components/passa/header';
import { Footer } from '@/components/passa/footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, BarChart, Search, Palette, Handshake } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {

    const features = [
        {
            icon: <Search className="size-8 text-primary" />,
            title: "Live Event Discovery",
            description: "Explore a curated grid of the most exciting live events happening across the continent, from major festivals to intimate shows.",
        },
        {
            icon: <ShieldCheck className="size-8 text-primary" />,
            title: "Fraud-Proof Ticket NFTs",
            description: "Every ticket is a unique asset on the blockchain, eliminating fraud and ensuring your ticket is 100% authentic, always.",
        },
        {
            icon: <Zap className="size-8 text-primary" />,
            title: "Instant Revenue Splits",
            description: "Artists, venues, and creators get paid their share of ticket sales instantly. No more waiting, no more chasing payments.",
        },
        {
            icon: <Palette className="size-8 text-primary" />,
            title: "Creative Brief Marketplace",
            description: "Event organizers can post creative 'gigs' (briefs), allowing creators to find and apply for paid opportunities.",
        },
        {
            icon: <Handshake className="size-8 text-primary" />,
            title: "Transparent Sponsorships",
            description: "Sponsors can verifiably prove their involvement in an event, with on-chain records of their contribution for clear ROI.",
        },
        {
            icon: <BarChart className="size-8 text-primary" />,
            title: "On-Chain Attribution",
            description: "Creators receive undeniable, transparent proof of their contribution and its direct impact on an event's success.",
        },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full bg-secondary/30 py-20 md:py-32">
                     <div className="absolute inset-0 z-0 opacity-10 dark:[opacity-20] bg-grid-glow"></div>
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Features Built for the New Economy.
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Passa provides a powerful suite of tools designed to bring transparency, security, and fairness to the African event ecosystem.
                        </p>
                    </div>
                </section>

                {/* Features Grid Section */}
                <section className="w-full bg-background py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="font-headline text-3xl font-bold md:text-4xl">The Passa Toolkit</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                Everything you need, whether you&apos;re a fan, creator, or organizer.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <Card key={index} className="text-center bg-card/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <CardHeader>
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            {feature.icon}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                                        <p className="mt-2 text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                 {/* How it Works Visual Section */}
                <section className="w-full py-16 md:py-24 bg-secondary/30">
                     <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="font-headline text-3xl font-bold md:text-4xl">The Flow of Value</h2>
                            <p className="mt-4 text-muted-foreground">
                                See how a single ticket purchase on Passa creates a transparent and instantaneous chain of value distribution, ensuring every stakeholder is rewarded fairly the moment a transaction happens. This is the future of event financing.
                            </p>
                             <ul className="mt-6 space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                                    <div>
                                        <h4 className="font-semibold">Fan Purchases Ticket</h4>
                                        <p className="text-sm text-muted-foreground">A fan discovers your event and securely buys a ticket using their wallet or card.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                                    <div>
                                        <h4 className="font-semibold">Smart Contract Executes</h4>
                                        <p className="text-sm text-muted-foreground">The payment triggers a smart contract that holds the predefined revenue splits.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                                    <div>
                                        <h4 className="font-semibold">Instant Payouts</h4>
                                        <p className="text-sm text-muted-foreground">The funds are instantly distributed to the wallets of the artists, creators, venue, and platform. No delays.</p>
                                    </div>
                                </li>
                             </ul>
                        </div>
                        <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                             <Image
                                src="https://placehold.co/600x400.png"
                                alt="Visual representation of a blockchain transaction flow"
                                fill
                                className="object-cover"
                                data-ai-hint="blockchain transaction diagram"
                            />
                        </div>
                    </div>
                </section>

                <section className="w-full bg-primary py-16 text-primary-foreground md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">
                            Ready to Build with Us?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-80">
                         Join the platform that&apos;s designed for fairness and transparency.
                        </p>
                        <Button size="lg" variant="secondary" className="mt-8 font-bold text-primary hover:bg-white/90" asChild>
                             <Link href="/register">Get Started</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
