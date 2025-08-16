
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { createEvent } from '@/app/actions/organizer';
import { ClientHeader } from '@/components/passa/client-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, PartyPopper, Info } from 'lucide-react';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FormErrors = {
  title?: string[];
  description?: string[];
  location?: string[];
  country?: string[];
  date?: string[];
  imageUrl?: string[];
  ticketPrice?: string[];
  ticketQuantity?: string[];
  artistSplit?: string[];
  venueSplit?: string[];
  passaSplit?: string[];
  revenueSplits?: string[];
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending ? 'Creating Event...' : 'Create Event'}
        </Button>
    )
}

export default function CreateEventPage() {
    const { toast } = useToast();

    const [splits, setSplits] = React.useState({
        artist: 70,
        venue: 20,
        passa: 10,
    });

    const handleSliderChange = (newValues: number[]) => {
        const [artist, venue] = newValues;
        const passa = 100 - artist - venue;

        if (passa >= 0) {
            setSplits({ artist, venue, passa });
        }
    };


    const [state, formAction] = useActionState(createEvent, {
        message: '',
        errors: {},
        success: false,
    });

    React.useEffect(() => {
        if (state.success) {
            toast({
                title: 'Event Created!',
                description: state.message,
                action: <div className="p-1"><PartyPopper className="text-primary"/></div>
            });
            // The redirect will happen from the server action, so no need for router.push
        } else if (state.message && !state.success && Object.keys(state.errors).length === 0) {
            toast({ title: 'Error', description: state.message, variant: 'destructive' });
        }
    }, [state, toast]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <ClientHeader />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/dashboard/organizer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                            <ArrowLeft className="size-4" />
                            Back to Dashboard
                        </Link>
                        
                        <form action={formAction}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline text-3xl">Create a New Event</CardTitle>
                                    <CardDescription>Fill out the details below to get your event published on Passa.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Event Title</Label>
                                        <Input id="title" name="title" placeholder="e.g., Afrochella Festival" />
                                        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Event Description</Label>
                                        <Textarea id="description" name="description" placeholder="Tell everyone what makes your event special..." />
                                        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input id="location" name="location" placeholder="e.g., Nairobi" />
                                            {state.errors?.location && <p className="text-sm text-destructive">{state.errors.location[0]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="country">Country</Label>
                                            <Input id="country" name="country" placeholder="e.g., Kenya" />
                                            {state.errors?.country && <p className="text-sm text-destructive">{state.errors.country[0]}</p>}
                                        </div>
                                    </div>
                                     <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date & Time</Label>
                                            <Input id="date" name="date" type="datetime-local" />
                                            {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date[0]}</p>}
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="imageUrl">Event Image URL</Label>
                                            <Input id="imageUrl" name="imageUrl" placeholder="https://placehold.co/600x400.png" />
                                            {state.errors?.imageUrl && <p className="text-sm text-destructive">{state.errors.imageUrl[0]}</p>}
                                        </div>
                                    </div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Ticket Setup</CardTitle>
                                            <CardDescription>Define the price and quantity for your first ticket tier.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="ticketPrice">Price (USD)</Label>
                                                <Input id="ticketPrice" name="ticketPrice" type="number" step="0.01" placeholder="50.00" />
                                                {state.errors?.ticketPrice && <p className="text-sm text-destructive">{state.errors.ticketPrice[0]}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="ticketQuantity">Quantity</Label>
                                                <Input id="ticketQuantity" name="ticketQuantity" type="number" placeholder="1000" />
                                                 {state.errors?.ticketQuantity && <p className="text-sm text-destructive">{state.errors.ticketQuantity[0]}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Revenue Splits</CardTitle>
                                            <CardDescription>Define how revenue from ticket sales will be distributed.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <input type="hidden" name="artistSplit" value={splits.artist} />
                                            <input type="hidden" name="venueSplit" value={splits.venue} />
                                            <input type="hidden" name="passaSplit" value={splits.passa} />
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label>Artist / Creator Split</Label>
                                                    <span className="font-bold text-primary">{splits.artist}%</span>
                                                </div>
                                                <Slider
                                                    value={[splits.artist]}
                                                    max={100 - splits.venue}
                                                    step={1}
                                                    onValueChange={(v) => handleSliderChange([v[0], splits.venue])}
                                                />
                                            </div>

                                             <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label>Venue / Ops Split</Label>
                                                    <span className="font-bold text-primary">{splits.venue}%</span>
                                                </div>
                                                <Slider
                                                    value={[splits.venue]}
                                                    max={100 - splits.artist}
                                                    step={1}
                                                    onValueChange={(v) => handleSliderChange([splits.artist, v[0]])}
                                                />
                                            </div>

                                             <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertTitle className="font-semibold">Platform Fee</AlertTitle>
                                                <AlertDescription>
                                                    Passa takes a fixed <span className="font-bold">{splits.passa}%</span> fee to cover operational costs. The remaining splits must sum to {100 - splits.passa}%.
                                                </AlertDescription>
                                            </Alert>
                                            
                                             {(state.errors as FormErrors)?.revenueSplits && <p className="text-sm text-destructive">{(state.errors as FormErrors).revenueSplits?.[0]}</p>}
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-end">
                                        <SubmitButton />
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
