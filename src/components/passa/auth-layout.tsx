
"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './logo';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

const testimonials = [
    {
        quote: "Passa changed the game. My fans get real tickets, and I see the revenue in my wallet in real-time. It’s transparent, it’s fair, it’s the future.",
        name: "Burna Boy",
        role: "Afrobeats Superstar",
        image: "https://placehold.co/100x100.png",
        imageHint: "musician portrait"
    },
    {
        quote: "As a creator, getting paid fairly and instantly is everything. Passa makes it happen without me having to chase invoices.",
        name: "Aisha Nabukeera",
        role: "Content Creator & Videographer",
        image: "https://placehold.co/100x100.png",
        imageHint: "female videographer"
    },
    {
        quote: "We sponsored Afrochella and for the first time, saw exactly where our marketing dollars went. The attribution data from Passa is unmatched.",
        name: "Tusker Lager",
        role: "Event Sponsor",
        image: "https://placehold.co/100x100.png",
        imageHint: "corporate headshot"
    }
];

const TestimonialCarousel = () => {
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000); // Change testimonial every 5 seconds
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div className="relative h-full w-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-16 py-12 text-center"
                >
                    <p className="font-headline text-2xl lg:text-3xl font-medium text-primary-foreground">
                        &ldquo;{testimonials[index].quote}&rdquo;
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <Image 
                            src={testimonials[index].image}
                            alt={testimonials[index].name}
                            width={50}
                            height={50}
                            className="rounded-full"
                            data-ai-hint={testimonials[index].imageHint}
                        />
                        <div>
                             <p className="font-bold text-lg text-white">{testimonials[index].name}</p>
                             <p className="text-primary-foreground/80">{testimonials[index].role}</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

interface AuthLayoutProps {
    children: React.ReactNode;
    formPosition?: 'left' | 'right';
    title: string;
    description: string;
}

export const AuthLayout = ({ children, formPosition = 'left', title, description }: AuthLayoutProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="relative flex h-screen w-full flex-col lg:flex-row">
                {/* Back to home button */}
                <Link href="/" className="absolute top-4 left-4 z-20 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <button className="flex items-center gap-2 rounded-md bg-background/50 px-3 py-2 text-sm backdrop-blur-sm hover:bg-background/80">
                        <ArrowLeft className="size-4" />
                        Back to Home
                    </button>
                </Link>

                {/* Form Panel */}
                <motion.div
                    initial={{ x: formPosition === 'left' ? '-100%' : '100%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                    className={cn(
                        "flex w-full flex-col items-center justify-center p-8 lg:w-2/5",
                        formPosition === 'left' ? 'lg:order-1' : 'lg:order-2'
                    )}
                >
                    <div className="w-full max-w-sm">
                        <div className="text-center mb-8">
                            <Link href="/" className="inline-block mb-4">
                                <Logo className="size-12 text-primary" />
                            </Link>
                            <h1 className="font-headline text-3xl font-bold">{title}</h1>
                            <p className="text-muted-foreground mt-2">{description}</p>
                        </div>
                        <div className="bg-card/60 dark:bg-card/20 backdrop-blur-sm p-8 rounded-xl border border-border/20">
                            {children}
                        </div>
                    </div>
                </motion.div>

                {/* Testimonial Panel */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={cn(
                        "hidden w-full items-center justify-center bg-primary lg:flex lg:w-3/5 relative overflow-hidden",
                        formPosition === 'left' ? 'lg:order-2' : 'lg:order-1'
                    )}
                >
                    <Image
                        src="/passa-africantenge.webp"
                        alt="African pattern background"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-primary/80" />
                    <div className="z-10">
                        <TestimonialCarousel />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
