

'use server';

import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Star, Compass, User, GanttChart } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { MobileNav } from '@/components/passa/mobile-nav';
import { getSession } from '@/lib/session';


async function getFanStats() {
    const session = await getSession();
    // Middleware protects this page, so session is guaranteed.
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: session!.userId },
        include: {
            _count: {
                select: { purchasedTickets: true }
            }
        }
    });
    
    // This is mock data, as we don't have these features yet.
    // We would build these out with relations in the Prisma schema.
    const favoriteArtists = 5; 
    const eventsAttended = await prisma.purchasedTicket.count({
        where: {
            ownerId: user.id,
            status: 'USED', // Assuming a 'USED' status for attended events
        }
    });

    return {
        tickets: user._count.purchasedTickets,
        favoriteArtists,
        eventsAttended,
    };
}


export default async function FanDashboardPage() {
    const stats = await getFanStats();
    
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                 <div className="container mx-auto px-4 py-8">
                     <div className="flex items-center justify-between mb-8">
                        <h1 className="font-headline text-3xl font-bold md:text-4xl">
                            My Dashboard
                        </h1>
                        <div className="flex gap-2">
                            <Link href="/dashboard">
                                <Button variant="outline">
                                    <Compass className="mr-2 size-4" />
                                    Discover Events
                                </Button>
                            </Link>
                             <Link href="/dashboard/fan/tickets">
                                <Button>
                                    <Ticket className="mr-2 size-4" />
                                    View My Tickets
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
                                <CardTitle className="text-sm font-medium">Favorite Artists</CardTitle>
                                <Star className="size-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.favoriteArtists}</div>
                                <p className="text-xs text-muted-foreground">Artists you are following</p>
                            </CardContent>
                         </Card>
                           <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
                                <GanttChart className="size-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.eventsAttended}</div>
                                <p className="text-xs text-muted-foreground">Events you've been to with Passa</p>
                            </CardContent>
                         </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to Passa!</CardTitle>
                            <CardContent className="pt-4">
                               <p className="text-muted-foreground">This is your personal hub. Discover new events, view your tickets, and manage your profile.</p>
                            </CardContent>
                        </CardHeader>
                    </Card>

                </div>
            </main>
            <MobileNav />
        </div>
    )
}
