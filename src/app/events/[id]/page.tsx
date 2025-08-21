

'use server';

import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { Header } from '@/components/passa/header';
import { Users, Handshake, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { createSponsorship } from '@/app/actions/organizer';
import { translateEventTitle } from '@/ai/flows/translate-event-title';
import type { Event, OrganizerProfile, Attribution, User as UserType, Ticket as TicketTier, ArtistInvitation } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getSession } from '@/lib/session';
import { EventDetails } from '@/components/events/event-details';
import { TicketPurchase } from '@/components/events/ticket-purchase';

type SponsorWithProfile = Attribution & { user: UserType & { organizerProfile: OrganizerProfile | null }};

type EventWithDetails = Event & {
    tickets: TicketTier[],
    organizer: { name: string | null, organizerProfile: OrganizerProfile | null },
    attributions: SponsorWithProfile[],
    artistInvitations: ArtistInvitation[],
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
            },
            artistInvitations: {
                where: {
                    artistId: { not: null }
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
    const isOwnEvent = session?.userId === event.organizerId;
    const hasApplied = event.artistInvitations.some(inv => inv.artistId === session?.userId);
    const userInvitation = event.artistInvitations.find(inv => inv.artistId === session?.userId);
    const applicationStatus = userInvitation?.status;

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                        <ArrowLeft className="size-4" />
                        Back to Events
                    </Link>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <EventDetails 
                                event={{
                                    ...event,
                                    translatedTitle
                                }}
                                isAlreadySponsor={isAlreadySponsor}
                            />
                        </div>
                        
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Organizer Management Section */}
                            {isOwnEvent && session?.role === 'ORGANIZER' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Event Management</CardTitle>
                                        <CardDescription>Manage your event</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button asChild className="w-full">
                                            <a href={`/dashboard/organizer/events/${event.id}`}>Manage Event Dashboard</a>
                                        </Button>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>• Review artist applications</p>
                                            <p>• Send invitations</p>
                                            <p>• View analytics</p>
                                            <p>• Edit event details</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            
                            {/* Creator Invitation Details */}
                            {session?.role === 'CREATOR' && userInvitation && userInvitation.status === 'ACCEPTED' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-green-600">🎉 You're Performing!</CardTitle>
                                        <CardDescription>Congratulations! You've been accepted to perform at this event.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Performance Fee:</span>
                                                <span className="font-semibold">${userInvitation.proposedFee}</span>
                                            </div>
                                            {userInvitation.artistComments && (
                                                <div>
                                                    <span className="text-muted-foreground text-sm">Your Comments:</span>
                                                    <p className="text-sm mt-1">{userInvitation.artistComments}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            
                            <TicketPurchase
                                event={{
                                    ...event,
                                    price,
                                    translatedTitle
                                }}
                                session={session}
                                hasApplied={hasApplied}
                                applicationStatus={applicationStatus}
                                isOwnEvent={isOwnEvent}
                            />

                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="text-primary"/>
                                        Event Sponsors
                                    </CardTitle>
                                     <CardDescription>This event is proudly supported by:</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4">
                                        <TooltipProvider>
                                            {/* Constant Sponsors */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-12 w-12 border-2 border-primary/50">
                                                        <AvatarFallback className="bg-blue-100 text-blue-600">MT</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>MTN Africa</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-12 w-12 border-2 border-primary/50">
                                                        <AvatarFallback className="bg-green-100 text-green-600">SF</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Safaricom</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-12 w-12 border-2 border-primary/50">
                                                        <AvatarFallback className="bg-red-100 text-red-600">AB</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Absa Bank</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-12 w-12 border-2 border-primary/50">
                                                        <AvatarFallback className="bg-purple-100 text-purple-600">EC</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ecobank</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
