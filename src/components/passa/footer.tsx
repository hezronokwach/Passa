
'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ArrowRight, Facebook, Instagram, Linkedin, Send, Twitter, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { useToast } from '../ui/use-toast';
import { cn } from '@/lib/utils';


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

            <div className="col-span-6 md:col-span-2">
                <h4 className="font-headline text-sm font-semibold">Company</h4>
                <ul className="mt-4 space-y-2 text-sm">
                <li><button onClick={navigateToAbout} className="text-muted-foreground hover:text-foreground">About Us</button></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                </ul>
            </div>

            <div className="col-span-6 md:col-span-2">
                <h4 className="font-headline text-sm font-semibold">Product</h4>
                <ul className="mt-4 space-y-2 text-sm">
                <li><button onClick={navigateToHowItWorks} className="text-muted-foreground hover:text-foreground">How it works</button></li>
                <li><button onClick={navigateToFeatures} className="text-muted-foreground hover:text-foreground">Features</button></li>
                <li><button onClick={navigateToContact} className="text-muted-foreground hover:text-foreground">Contact</button></li>
                </ul>
            </div>

            <div className="col-span-12 md:col-span-4">
                <h4 className="font-headline text-sm font-semibold">Newsletter</h4>
                <p className="mt-4 text-sm text-muted-foreground">
                Get tips, product updates, and insights on web3 ticketing.
                </p>
                <form ref={formRef} action={formAction} className="mt-4 flex w-full max-w-sm items-center space-x-2">
                    <Input name="email" type="email" placeholder="Email address" className="flex-1" required/>
                    <SubmitButton />
                </form>
                 <p className={cn("text-sm mt-2", state.success ? "text-green-600" : "text-destructive")}>
                    {state.errors?.email ? state.errors.email[0] : ''}
                </p>
            </div>
            </div>
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 border-t px-4 py-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Passa. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            </div>
            </div>
      </footer>
    )
}
