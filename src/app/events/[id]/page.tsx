

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
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
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
                        <div className="lg:col-span-1 space-y-6">
                            {/* Organizer Management Section */}
                            {isOwnEvent && session?.role === 'ORGANIZER' && (
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Users className="size-5 text-primary" />
                                            </div>
                                            Event Management
                                        </CardTitle>
                                        <CardDescription>Control your event from here</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Button asChild className="w-full shadow-sm">
                                            <Link href={`/dashboard/organizer/events/${event.id}`}>
                                                Open Dashboard
                                            </Link>
                                        </Button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/dashboard/organizer/events/${event.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/dashboard/organizer/events/${event.id}/analytics`}>Analytics</Link>
                                            </Button>
                                        </div>
                                        <div className="p-3 bg-background/50 rounded-lg">
                                            <p className="text-sm font-medium mb-2">Quick Stats</p>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <p>• {event.artistInvitations.length} applications received</p>
                                                <p>• {event.tickets.reduce((sum, t) => sum + t.sold, 0)} tickets sold</p>
                                                <p>• Event status: {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            
                            {/* Creator Performance Status */}
                            {session?.role === 'CREATOR' && userInvitation && (
                                <Card className={`border-0 shadow-lg ${
                                    userInvitation.status === 'ACCEPTED' 
                                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
                                        : userInvitation.status === 'PENDING'
                                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20'
                                        : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20'
                                }`}>
                                    <CardHeader>
                                        <CardTitle className={`flex items-center gap-2 ${
                                            userInvitation.status === 'ACCEPTED' ? 'text-green-700 dark:text-green-300' :
                                            userInvitation.status === 'PENDING' ? 'text-yellow-700 dark:text-yellow-300' :
                                            'text-red-700 dark:text-red-300'
                                        }`}>
                                            {userInvitation.status === 'ACCEPTED' && '🎉 You\'re Performing!'}
                                            {userInvitation.status === 'PENDING' && '⏳ Application Pending'}
                                            {userInvitation.status === 'REJECTED' && '❌ Application Declined'}
                                        </CardTitle>
                                        <CardDescription>
                                            {userInvitation.status === 'ACCEPTED' && 'Congratulations! You\'ve been selected to perform.'}
                                            {userInvitation.status === 'PENDING' && 'Your application is being reviewed by the organizer.'}
                                            {userInvitation.status === 'REJECTED' && 'Unfortunately, your application was not selected.'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Performance Fee:</span>
                                                <span className="font-semibold">${userInvitation.proposedFee}</span>
                                            </div>
                                            {userInvitation.artistComments && (
                                                <div className="p-3 bg-background/50 rounded-lg">
                                                    <p className="text-sm font-medium mb-1">Your Application:</p>
                                                    <p className="text-sm text-muted-foreground">{userInvitation.artistComments}</p>
                                                </div>
                                            )}
                                            {userInvitation.status === 'ACCEPTED' && (
                                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Next Steps:</p>
                                                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                                        The organizer will contact you with performance details and logistics.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            
                            {/* Fan Welcome Message */}
                            {session?.role === 'FAN' && (
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <Users className="size-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Ready to Attend?</h3>
                                                <p className="text-sm text-blue-700 dark:text-blue-300">Secure your spot at this amazing event</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                                            <p>✓ Instant ticket confirmation</p>
                                            <p>✓ Mobile-friendly tickets</p>
                                            <p>✓ Secure payment processing</p>
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

                             <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="text-primary size-5"/>
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
                                                    <Avatar className="h-12 w-12 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                                                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">MT</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>MTN Africa</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-12 w-12 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                                                        <AvatarFallback className="bg-green-100 text-green-600 font-semibold">SF</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Safaricom</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-12 w-12 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                                                        <AvatarFallback className="bg-red-100 text-red-600 font-semibold">AB</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Absa Bank</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-12 w-12 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                                                        <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">EC</AvatarFallback>
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
