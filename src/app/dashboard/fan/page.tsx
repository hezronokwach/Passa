'use server';

import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Star, Compass, GanttChart, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';

import { getSession } from '@/lib/session';


async function getFanData() {
    const session = await getSession();
    if (!session) {
        return {
            user: null,
            stats: {
                tickets: 0,
                favoriteArtists: 0,
                eventsAttended: 0,
            },
            popularEvents: [],
            error: 'No session found'
        };
    }
    
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: session.userId },
        include: {
            _count: {
                select: { purchasedTickets: true }
            }
        }
    });
    
    // Calculate events attended (tickets with USED status)
    const eventsAttended = await prisma.purchasedTicket.count({
        where: {
            ownerId: user.id,
            status: 'USED',
        }
    });
    
    // Calculate unique artists attended (based on events with attributions)
    const attendedEvents = await prisma.purchasedTicket.findMany({
        where: {
            ownerId: user.id,
            status: 'USED',
        },
        select: {
            eventId: true,
        }
    });
    
    const attendedEventIds = attendedEvents.map(ticket => ticket.eventId);
    
    // Get unique creators from attributions in attended events
    const artistAttributions = await prisma.attribution.findMany({
        where: {
            eventId: {
                in: attendedEventIds
            },
            contributionType: 'CREATIVE'
        },
        select: {
            userId: true,
        }
    });
    
    const uniqueArtistsCount = new Set(artistAttributions.map(attr => attr.userId)).size;

    // Get popular events sorted by ticket sales
    const popularEvents = await prisma.event.findMany({
        include: {
            _count: {
                select: { purchasedTickets: true }
            },
            organizer: {
                select: { name: true }
            }
        },
        orderBy: {
            purchasedTickets: {
                _count: 'desc'
            }
        },
        take: 6
    });

    return {
        user,
        stats: {
            tickets: user._count.purchasedTickets,
            favoriteArtists: uniqueArtistsCount,
            eventsAttended,
        },
        popularEvents,
        error: null
    };
}


export default async function FanDashboardPage() {
    const { user, stats, popularEvents, error } = await getFanData();
    
    if (error) {
        return redirect('/login');
    }
    
    // Get user's first name or full name
    const userName = user?.name?.split(' ')[0] || user?.name || user?.email || 'Fan';
    
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                 <div className="container mx-auto px-4 py-8">
                     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                        <div>
                            <h2 className="font-headline text-xl text-muted-foreground">Welcome back,</h2>
                            <h1 className="font-headline text-3xl font-bold md:text-4xl">
                                {userName}!
                            </h1>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <div className="flex gap-2">
                                <Link href="/events">
                                    <Button variant="outline" className="flex-1">
                                        <Compass className="mr-2 size-4" />
                                        <span className="hidden sm:inline">Discover Events</span>
                                        <span className="sm:hidden">Events</span>
                                    </Button>
                                </Link>
                                <Link href="/dashboard/fan/tickets">
                                    <Button className="flex-1">
                                        <Ticket className="mr-2 size-4" />
                                        <span className="hidden sm:inline">My Tickets</span>
                                        <span className="sm:hidden">Tickets</span>
                                    </Button>
                                </Link>
                            </div>
                            <Link href="/dashboard/fan/artists">
                                <Button variant="outline" className="flex-1">
                                    <Star className="mr-2 size-4" />
                                    <span className="hidden sm:inline">Artists I've Attended</span>
                                    <span className="sm:hidden">Artists</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3 mb-8">
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">My Tickets</CardTitle>
                                <Ticket className="size-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.tickets}</div>
                                <p className="text-xs text-muted-foreground">Active tickets for upcoming events</p>
                            </CardContent>
                         </Card>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Artists Attended</CardTitle>
                                <Star className="size-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.favoriteArtists}</div>
                                <p className="text-xs text-muted-foreground">Unique artists from events you've attended</p>
                            </CardContent>
                         </Card>
                           <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
                                <GanttChart className="size-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.eventsAttended}</div>
                                <p className="text-xs text-muted-foreground">Events you've attended with Passa</p>
                            </CardContent>
                         </Card>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-headline text-2xl font-bold">Popular Events</h2>
                            <Link href="/events">
                                <Button variant="outline" size="sm">
                                    View All Events
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {popularEvents.map((event) => (
                                <Card key={event.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            by {event.organizer.name}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Date:</span>
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Location:</span>
                                            <span className="truncate ml-2">{event.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Tickets sold:</span>
                                            <span className="font-medium">{event._count.purchasedTickets}</span>
                                        </div>
                                        <div className="pt-2">
                                            <Link href={`/events/${event.id}`}>
                                                <Button size="sm" className="w-full">
                                                    View Event
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        {popularEvents.length === 0 && (
                            <Card>
                                <CardContent className="py-8 text-center">
                                    <p className="text-muted-foreground">No events available yet.</p>
                                    <Link href="/events">
                                        <Button className="mt-4">
                                            Discover Events
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                </div>
            </main>
        </div>
    )
}
