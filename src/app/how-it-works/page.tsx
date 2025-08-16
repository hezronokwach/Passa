
import { Header } from '@/components/passa/header';
import { Footer } from '@/components/passa/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Search, CheckCircle, UploadCloud, DollarSign, Palette, PlusCircle, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {

    const fanFlow = [
        {
            icon: <Search className="size-8 text-primary" />,
            title: "1. Discover Events",
            description: "Browse our curated marketplace to find the best concerts, festivals, and live shows across Africa.",
        },
        {
            icon: <Ticket className="size-8 text-primary" />,
            title: "2. Purchase Securely",
            description: "Buy your ticket as a secure NFT. Your ownership is guaranteed on the blockchain, making fraud impossible.",
        },
        {
            icon: <CheckCircle className="size-8 text-primary" />,
            title: "3. Attend & Enjoy",
            description: "Use your digital ticket for seamless entry. Enjoy the event knowing your ticket is 100% authentic.",
        },
    ];

    const creatorFlow = [
        {
            icon: <Palette className="size-8 text-primary" />,
            title: "1. Find Creative Briefs",
            description: "Explore our marketplace of paid 'gigs' posted by event organizers looking for your creative talent.",
        },
        {
            icon: <UploadCloud className="size-8 text-primary" />,
            title: "2. Submit Your Work",
            description: "Apply to briefs by submitting your content (videos, graphics, etc.) directly through the platform.",
        },
        {
            icon: <DollarSign className="size-8 text-primary" />,
            title: "3. Get Paid Instantly",
            description: "When your work is used and tickets are sold, your revenue share is deposited into your wallet instantly.",
        },
    ];
    
    const organizerFlow = [
        {
            icon: <PlusCircle className="size-8 text-primary" />,
            title: "1. Create Your Event",
            description: "List your event, set up ticket tiers, and define fair, transparent revenue splits for your team and artists.",
        },
        {
            icon: <Palette className="size-8 text-primary" />,
            title: "2. Hire Creative Talent",
            description: "Post creative briefs to hire talented creators who will promote your event and drive ticket sales.",
        },
        {
            icon: <BarChart3 className="size-8 text-primary" />,
            title: "3. Track Success",
            description: "Monitor ticket sales and revenue in real-time. See exactly how creator content impacts your bottom line.",
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
                            A Fairer System for Everyone.
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Passa redefines the event ecosystem by creating a transparent, automated, and equitable process for fans, creators, and organizers.
                        </p>
                    </div>
                </section>

                {/* For Fans Section */}
                <section className="w-full bg-background py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="font-headline text-3xl font-bold md:text-4xl">For the Fans</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                A simple and secure way to experience the events you love.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {fanFlow.map((step) => (
                                <Card key={step.title} className="text-center bg-card/50">
                                    <CardHeader>
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            {step.icon}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                                        <p className="mt-2 text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* For Creators Section */}
                <section className="w-full bg-secondary/30 py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="font-headline text-3xl font-bold md:text-4xl">For the Creators & Artists</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                               Get rewarded for your talent, instantly and transparently.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {creatorFlow.map((step) => (
                                <Card key={step.title} className="text-center bg-card/50">
                                    <CardHeader>
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            {step.icon}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                                        <p className="mt-2 text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                
                 {/* For Organizers Section */}
                <section className="w-full bg-background py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="font-headline text-3xl font-bold md:text-4xl">For the Organizers & Sponsors</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                The tools you need to create successful, data-driven events.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {organizerFlow.map((step) => (
                                <Card key={step.title} className="text-center bg-card/50">
                                    <CardHeader>
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            {step.icon}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                                        <p className="mt-2 text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full bg-primary py-16 text-primary-foreground md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">
                            Ready to Join the New Standard?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-80">
                         Create an account and see how Passa can work for you.
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
