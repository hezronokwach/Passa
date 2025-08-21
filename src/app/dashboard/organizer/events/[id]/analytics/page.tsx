'use server';

import { Header } from '@/components/passa/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Users, DollarSign, Eye } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';

async function getEventAnalytics(eventId: number) {
    const session = await getSession();
    const event = await prisma.event.findUnique({
        where: { id: eventId, organizerId: session!.userId },
        include: {
            tickets: true,
            purchasedTickets: true,
            artistInvitations: true
        }
    });
    return event;
}

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventId = parseInt(id, 10);
    const event = await getEventAnalytics(eventId);

    if (!event) return <div>Event not found</div>;

    const totalRevenue = event.purchasedTickets.reduce((sum, ticket) => 
        sum + (event.tickets.find(t => t.id === ticket.ticketId)?.price || 0), 0);

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        <Link href={`/dashboard/organizer/events/${event.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                            <ArrowLeft className="size-4" />
                            Back to Event Dashboard
                        </Link>

                        <h1 className="font-headline text-3xl font-bold mb-8">Analytics: {event.title}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                            <p className="text-2xl font-bold">1,247</p>
                                        </div>
                                        <Eye className="size-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                                            <p className="text-2xl font-bold">12.3%</p>
                                        </div>
                                        <TrendingUp className="size-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Tickets Sold</p>
                                            <p className="text-2xl font-bold">{event.purchasedTickets.length}</p>
                                        </div>
                                        <Users className="size-8 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                                            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                                        </div>
                                        <DollarSign className="size-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ticket Sales by Tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {event.tickets.map((ticket) => (
                                        <div key={ticket.id} className="flex justify-between items-center p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{ticket.name}</p>
                                                <p className="text-sm text-muted-foreground">${ticket.price} each</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold">{ticket.sold} sold</p>
                                                <p className="text-sm text-muted-foreground">of {ticket.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}