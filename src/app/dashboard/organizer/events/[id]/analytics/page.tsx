'use server';

import { DashboardHeader } from '@/components/passa/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Users, DollarSign, Eye, BarChart3, Target } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';


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
    const session = await getSession();
    const user = await prisma.user.findUnique({ where: { id: session!.userId } });

    if (!event || !user) return <div>Event not found</div>;

    const totalRevenue = event.purchasedTickets.reduce((sum, ticket) => 
        sum + (event.tickets.find(t => t.id === ticket.ticketId)?.price || 0), 0);
    
    const totalCapacity = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const soldPercentage = totalCapacity > 0 ? (event.purchasedTickets.length / totalCapacity) * 100 : 0;
    const conversionRate = 12.3; // Mock data
    const totalViews = 1247; // Mock data

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <DashboardHeader user={user} />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <Link href={`/dashboard/organizer/events/${event.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                            <ArrowLeft className="size-4" />
                            Back to Event Dashboard
                        </Link>

                        <div className="mb-8">
                            <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                                Event Analytics
                            </h1>
                            <p className="text-xl text-muted-foreground">{event.title}</p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Views</p>
                                            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalViews.toLocaleString()}</p>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">+15% vs last week</p>
                                        </div>
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                            <Eye className="size-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-700 dark:text-green-300">Conversion Rate</p>
                                            <p className="text-3xl font-bold text-green-900 dark:text-green-100">{conversionRate}%</p>
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Above average</p>
                                        </div>
                                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                            <Target className="size-6 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Tickets Sold</p>
                                            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{event.purchasedTickets.length}</p>
                                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">of {totalCapacity} available</p>
                                        </div>
                                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                            <Users className="size-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Revenue</p>
                                            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">${totalRevenue.toFixed(0)}</p>
                                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">+{soldPercentage.toFixed(1)}% capacity</p>
                                        </div>
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                            <DollarSign className="size-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 mb-8">
                            {/* Sales Progress */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="size-5 text-primary" />
                                        Sales Progress
                                    </CardTitle>
                                    <CardDescription>Track your ticket sales performance</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Overall Sales</span>
                                            <span className="text-sm text-muted-foreground">{event.purchasedTickets.length}/{totalCapacity}</span>
                                        </div>
                                        <Progress value={soldPercentage} className="h-3" />
                                        <p className="text-xs text-muted-foreground mt-1">{soldPercentage.toFixed(1)}% of capacity sold</p>
                                    </div>
                                    
                                    {event.tickets.map((ticket) => {
                                        const ticketSold = event.purchasedTickets.filter(pt => 
                                            event.tickets.find(t => t.id === pt.ticketId)?.name === ticket.name
                                        ).length;
                                        const ticketProgress = (ticketSold / ticket.quantity) * 100;
                                        
                                        return (
                                            <div key={ticket.id}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium">{ticket.name}</span>
                                                    <span className="text-sm text-muted-foreground">{ticketSold}/{ticket.quantity}</span>
                                                </div>
                                                <Progress value={ticketProgress} className="h-2" />
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            {/* Artist Applications */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="size-5 text-primary" />
                                        Artist Applications
                                    </CardTitle>
                                    <CardDescription>Manage creative talent for your event</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                            <div>
                                                <p className="font-medium">Total Applications</p>
                                                <p className="text-sm text-muted-foreground">Artists interested in your event</p>
                                            </div>
                                            <Badge variant="secondary" className="text-lg px-3 py-1">
                                                {event.artistInvitations.length}
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">
                                                    {event.artistInvitations.filter(inv => inv.status === 'ACCEPTED').length}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Accepted</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-yellow-600">
                                                    {event.artistInvitations.filter(inv => inv.status === 'PENDING').length}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Pending</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-red-600">
                                                    {event.artistInvitations.filter(inv => inv.status === 'REJECTED').length}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Declined</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Ticket Tiers Performance */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Ticket Tier Performance</CardTitle>
                                <CardDescription>Detailed breakdown of each ticket type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {event.tickets.map((ticket) => {
                                        const ticketSold = event.purchasedTickets.filter(pt => 
                                            event.tickets.find(t => t.id === pt.ticketId)?.name === ticket.name
                                        ).length;
                                        const ticketRevenue = ticketSold * ticket.price;
                                        const sellRate = (ticketSold / ticket.quantity) * 100;
                                        
                                        return (
                                            <div key={ticket.id} className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{ticket.name}</h4>
                                                        <p className="text-muted-foreground">${ticket.price} per ticket</p>
                                                    </div>
                                                    <Badge variant={sellRate > 75 ? 'default' : sellRate > 50 ? 'secondary' : 'outline'}>
                                                        {sellRate.toFixed(1)}% sold
                                                    </Badge>
                                                </div>
                                                
                                                <div className="grid grid-cols-3 gap-4 text-center">
                                                    <div>
                                                        <p className="text-2xl font-bold">{ticketSold}</p>
                                                        <p className="text-sm text-muted-foreground">Sold</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-bold">{ticket.quantity - ticketSold}</p>
                                                        <p className="text-sm text-muted-foreground">Remaining</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-bold text-green-600">${ticketRevenue}</p>
                                                        <p className="text-sm text-muted-foreground">Revenue</p>
                                                    </div>
                                                </div>
                                                
                                                <Progress value={sellRate} className="mt-4" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}