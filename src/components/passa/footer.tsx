'use client';

import { FaGithub, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { AnimatedLogo } from "@/components/animated-logo";
import Link from "next/link";
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Check, Facebook, Linkedin, Instagram, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import React from 'react';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { Logo } from './logo';


function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" variant="default" className="font-semibold" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 animate-spin" /> Subscribing...
                </>
            ) : (
                <>
                    Subscribe <ArrowRight className="ml-2 size-4" />
                </>
            )}
        </Button>
    )
}

export const Footer = () => {
    const router = useRouter();
    const { toast } = useToast();
    const formRef = React.useRef<HTMLFormElement>(null);

    const [state, formAction] = React.useActionState(subscribeToNewsletter, {
        success: false,
        message: '',
        errors: {},
    });

    React.useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({
                    title: "Subscribed!",
                    description: state.message,
                    action: <div className="p-1"><Check className="text-primary"/></div>
                });
                formRef.current?.reset();
            } else {
                 toast({
                    title: "Whoops!",
                    description: state.message,
                    variant: "destructive"
                });
            }
        }
    }, [state, toast]);

    const navigateToAbout = () => {
        router.push('/about');
    }

    const navigateToFeatures = () => {
        router.push('/features');
    }

    const navigateToHowItWorks = () => {
        router.push('/how-it-works');
    }

    const navigateToContact = () => {
        router.push('/contact');
    }

    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-12">
                <div className="col-span-12 md:col-span-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="size-8 text-primary" />
                        <span className="font-headline text-xl font-bold">Passa</span>
                    </Link>
                    <p className="mt-4 text-sm text-muted-foreground">
                        The first African-built, blockchain-powered event platform.
                    </p>
                    <div className="mt-6 flex space-x-4">
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            <Facebook className="size-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            <Linkedin className="size-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            <Instagram className="size-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            <Send className="size-5" />
                        </Link>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Platform</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/events" className="hover:text-foreground transition-colors">Browse Events</Link></li>
                        <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                        <li><Link href="/auth/artist-signup" className="hover:text-foreground transition-colors">Join as Artist</Link></li>
                        <li><Link href="/auth/planner-signup" className="hover:text-foreground transition-colors">Event Planning</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4">Support</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                        <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                        <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    © 2025 Passa. All rights reserved.
                </p>
                <p className="text-sm text-muted-foreground">
                    Built with ❤️ for African culture
                </p>
            </div>
        </footer>
    );
}
