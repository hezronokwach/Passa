

'use server';

import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { Header } from '@/components/passa/header';
import Image from 'next/image';
import { Calendar, MapPin, Users, Ticket, Percent, User, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TicketPurchaseDialogWrapper } from './ticket-purchase-dialog-wrapper';
import { createSponsorship } from '@/app/actions/organizer';
import { translateEventTitle } from '@/ai/flows/translate-event-title';
import type { Event, OrganizerProfile, Attribution, User as UserType, Ticket as TicketTier } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getSession } from '@/lib/session';

type SponsorWithProfile = Attribution & { user: UserType & { organizerProfile: OrganizerProfile | null }};

type EventWithDetails = Event & {
    tickets: TicketTier[],
    organizer: { name: string | null, organizerProfile: OrganizerProfile | null },
    attributions: SponsorWithProfile[],
}

async function getEventDetails(eventId: string): Promise<EventWithDetails | null> {
    const id = parseInt(eventId, 10);
    if (isNaN(id)) return null;

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            tickets: true,
            organizer: {
                select: {
                    name: true,
                    organizerProfile: true
                }
            },
            attributions: {
                where: {
                    contributionType: 'SPONSORSHIP'
                },
                include: {
                    user: {
                        include: {
                            organizerProfile: true
                        }
                    }
                }
            }
        }
    });
    return event;
}


function SponsorEventForm({ eventId }: { eventId: number }) {
    return (
        <form action={async (formData: FormData) => {
            'use server';
            await createSponsorship(undefined, formData);
        }}>
            <input type="hidden" name="eventId" value={eventId} />
            <Button className="w-full font-bold mt-4" type="submit">
                <Handshake className="mr-2"/>
                Sponsor this Event
            </Button>
        </form>
    );
}


export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventDetails(id);
    const session = await getSession();

    if (!event) {
        notFound();
    }
    
    const { translatedTitle } = await translateEventTitle({
      title: event.title,
      country: event.country,
    });
    
    const price = event.tickets[0]?.price ?? 0;
    const isAlreadySponsor = event.attributions.some(attr => attr.userId === session?.userId);
    const canSponsor = session?.role === 'ORGANIZER' && session?.userId !== event.organizerId;

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="overflow-hidden">
                                <div className="relative h-64 md:h-96 w-full">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        data-ai-hint="music festival"
                                    />
                                    <div className="absolute bottom-4 right-4">
                                        {isAlreadySponsor && <Badge variant="secondary" className="text-base py-2 px-4 bg-background/80 backdrop-blur-sm">You are a sponsor!</Badge>}
                                    </div>
                                </div>
                                <CardHeader>
                                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{translatedTitle}</h1>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 items-center text-muted-foreground mt-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-4" />
                                            <span>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h2 className="font-headline text-2xl font-semibold mb-4">About this event</h2>
                                    <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
                                </CardContent>
                            </Card>
                            
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="text-primary"/>
                                        About the Organizer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <h3 className="text-xl font-semibold">{event.organizer.organizerProfile?.companyName || event.organizer.name}</h3>
                                    <p className="text-muted-foreground mt-2">{event.organizer.organizerProfile?.bio}</p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                                        <Ticket className="size-6 text-primary"/>
                                        Get Your Ticket
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-4xl font-bold text-center">
                                        ${price} <span className="text-lg font-normal text-muted-foreground">USD</span>
                                    </div>

                                    <TicketPurchaseDialogWrapper event={{...event, price, translatedTitle, currency: 'USD' }} />

                                    <div className="space-y-2 pt-4">
                                        <p className="text-sm font-semibold flex items-center gap-2"><Percent className="text-accent" /> Revenue Splits</p>
                                        <div className="flex justify-between text-muted-foreground text-sm">
                                            <span>Artist / Creator</span>
                                            <span className="font-medium text-foreground">{event.artistSplit}%</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground text-sm">
                                            <span>Venue / Ops</span>
                                            <span className="font-medium text-foreground">{event.venueSplit}%</span>
                                        </div>
                                         <div className="flex justify-between text-muted-foreground text-sm">
                                            <span>Passa Platform</span>
                                            <span className="font-medium text-foreground">{event.passaSplit}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="text-primary"/>
                                        Event Sponsors
                                    </CardTitle>
                                     <CardDescription>This event is proudly supported by:</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {event.attributions.length > 0 ? (
                                        <div className="flex flex-wrap gap-4">
                                        <TooltipProvider>
                                            {event.attributions.map(attr => (
                                                <Tooltip key={attr.id}>
                                                    <TooltipTrigger asChild>
                                                        <a href={attr.user.organizerProfile?.website || '#'} target="_blank" rel="noopener noreferrer">
                                                            <Avatar className="h-12 w-12 border-2 border-primary/50">
                                                                <AvatarImage src={`https://logo.clearbit.com/${attr.user.organizerProfile?.website}`} alt={attr.user.organizerProfile?.companyName || 'Sponsor'} />
                                                                <AvatarFallback>{(attr.user.organizerProfile?.companyName || 'S').charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{attr.user.organizerProfile?.companyName}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                            </TooltipProvider>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Be the first to sponsor this event!</p>
                                    )}
                                    {canSponsor && !isAlreadySponsor && <SponsorEventForm eventId={event.id} />}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
