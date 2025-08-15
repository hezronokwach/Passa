
'use client';

import { Header } from '@/components/passa/header';
import { Footer } from '@/components/passa/footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, BarChart, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function AboutPage() {

    const problems = [
        {
            icon: <ShieldCheck className="size-8 text-destructive" />,
            title: "Ticket Fraud & Scalping",
            description: "Fake tickets and unfair resale prices hurt both fans and artists. Passa uses blockchain to verify every ticket, ensuring authenticity and fair access.",
        },
        {
            icon: <Zap className="size-8 text-red-500" />,
            title: "Delayed Artist Payments",
            description: "Artists often wait months to get paid. Our smart contracts automate revenue splits, paying artists, venues, and creators instantly when a ticket is sold.",
        },
        {
            icon: <BarChart className="size-8 text-yellow-500" />,
            title: "Lack of Transparency",
            description: "Sponsors and creators struggle to prove their impact. Passa provides transparent, on-chain data to show exactly how contributions drive success.",
        },
    ];

    const team = [
        {
            name: "Jide Okonjo",
            role: "Founder & CEO",
            image: "https://placehold.co/150x150.png",
            hint: "male founder portrait",
            social: { twitter: "#", linkedin: "#" }
        },
        {
            name: "Amina Keita",
            role: "Head of Product",
            image: "https://placehold.co/150x150.png",
            hint: "female product manager",
            social: { twitter: "#", linkedin: "#" }
        },
        {
            name: "Kwame Appiah",
            role: "Lead Blockchain Engineer",
            image: "https://placehold.co/150x150.png",
            hint: "male software engineer",
            social: { twitter: "#", linkedin: "#" }
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
                            We&apos;re Building the Future of African Events.
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Passa is more than a ticketing platform; it&apos;s a movement to empower the African creative economy through transparency, security, and fairness.
                        </p>
                    </div>
                </section>

                {/* The Problem Section */}
                <section className="w-full bg-background py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="font-headline text-3xl font-bold md:text-4xl">The Challenges We Address</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                The African event landscape is vibrant and growing, but it faces unique challenges that hold back its full potential.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {problems.map((problem, index) => (
                                <Card key={index} className="text-center bg-card/50">
                                    <CardHeader>
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            {problem.icon}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="font-headline text-xl">{problem.title}</CardTitle>
                                        <p className="mt-2 text-muted-foreground">{problem.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Mission Section */}
                <section className="w-full py-16 md:py-24 bg-secondary/30">
                     <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="font-headline text-3xl font-bold md:text-4xl">Our Mission</h2>
                            <p className="mt-4 text-muted-foreground">
                                Our mission is to build the foundational infrastructure for the next generation of African events. We believe that by leveraging blockchain technology, we can create a transparent and equitable ecosystem where artists are paid fairly, fans can trust their tickets, and creators are rewarded for their value.
                            </p>
                            <p className="mt-4 text-muted-foreground">
                                We are committed to solving real-world problems and building a platform that not only showcases the richness of African culture but also provides sustainable economic opportunities for the millions of creatives who power it.
                            </p>
                             <Button size="lg" className="mt-6" asChild>
                                <Link href="/register">Join the Movement</Link>
                            </Button>
                        </div>
                        <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden">
                             <Image
                                src="https://placehold.co/600x400.png"
                                alt="A vibrant African concert"
                                fill
                                className="object-cover"
                                data-ai-hint="vibrant african concert"
                            />
                        </div>
                    </div>
                </section>
                
                {/* Team Section */}
                <section className="w-full bg-background py-16 md:py-24">
                     <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="font-headline text-3xl font-bold md:text-4xl">Meet the Team</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                We are a passionate team of builders, creators, and innovators dedicated to our mission.
                            </p>
                        </div>
                         <div className="grid gap-8 md:grid-cols-3 justify-center">
                            {team.map((member) => (
                                <div key={member.name} className="text-center flex flex-col items-center">
                                    <Avatar className="h-32 w-32 mb-4">
                                        <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.hint} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <p className="text-primary">{member.role}</p>
                                    <div className="flex gap-4 mt-2">
                                        <Link href={member.social.twitter} className="text-muted-foreground hover:text-primary"><Twitter/></Link>
                                        <Link href={member.social.linkedin} className="text-muted-foreground hover:text-primary"><Linkedin/></Link>
                                    </div>
                                </div>
                            ))}
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
                        <Button size="lg" variant="secondary" className="mt-8 font-bold text-primary hover:bg-white/90" asChild>
                             <Link href="/dashboard">Explore All Events</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
