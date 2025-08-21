

import { DashboardHeader } from '@/components/passa/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, BarChart2, User, Calendar, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { MiniChart } from '@/components/ui/mini-chart';
import Link from 'next/link';
import { PublishEventButton } from '@/components/passa/publish-event-button';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

async function getOrganizerData() {
    const session = await getSession();
    if (!session) {
        return {
            user: null,
            events: [],
            stats: {
                totalEvents: 0,
                totalRevenue: 0,
                totalTicketsSold: 0,
                upcomingEvents: 0,
                totalApplications: 0
            },
            error: 'No session found'
        };
    }
    
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: session.userId },
        include: { organizerProfile: true }
    });

    const events = await prisma.event.findMany({
        where: { organizerId: user.id },
        include: {
            tickets: true,
            purchasedTickets: true,
            artistInvitations: true,
            _count: {
                select: { 
                    purchasedTickets: true,
                    artistInvitations: true
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.date > new Date()).length;
    const totalApplications = events.reduce((sum, e) => sum + e._count.artistInvitations, 0);
    const totalTicketsSold = events.reduce((sum, e) => sum + e._count.purchasedTickets, 0);
    const totalRevenue = events.reduce((sum, event) => {
        return sum + event.purchasedTickets.reduce((eventSum, ticket) => {
            const ticketPrice = event.tickets.find(t => t.id === ticket.ticketId)?.price || 0;
            return eventSum + ticketPrice;
        }, 0);
    }, 0);

    return {
        user,
        events: events.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            country: event.country,
            date: event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            applications: event._count.artistInvitations,
            published: event.published,
            status: event.date > new Date() ? 'Upcoming' : 'Live'
        })),
        stats: {
            totalEvents,
            totalRevenue,
            totalTicketsSold,
            upcomingEvents,
            totalApplications
        }
    }
}

export default async function OrganizerDashboardPage() {
  const { user, events, stats, error } = await getOrganizerData();
  
  if (error || !user) {
    return redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Event Command Center
                </h1>
                <p className="text-muted-foreground mt-2">Manage your events, track performance, and grow your audience</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <Button size="lg" asChild className="shadow-lg">
                  <Link href="/dashboard/organizer/events/create">
                    <PlusCircle className="mr-2 size-5" />
                    Create Event
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Tickets Sold</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.totalTicketsSold}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+23% this month</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Users className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Events</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.upcomingEvents}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">of {stats.totalEvents} total</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Calendar className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Applications</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalApplications}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Awaiting review</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <TrendingUp className="size-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics & Actions */}
          <div className="grid gap-6 lg:grid-cols-3 mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Revenue Trend</CardTitle>
                <CardDescription>Last 6 months performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</span>
                    <span className="text-sm text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded-full">+23%</span>
                  </div>
                  <MiniChart data={[120, 180, 150, 220, 280, stats.totalRevenue]} className="text-green-500" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>6mo ago</span>
                    <span>Now</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Link href="/events" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                      <Eye className="size-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Explore Events</h3>
                      <p className="text-muted-foreground">Discover what's happening</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/organizer/profile" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                      <User className="size-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Manage Profile</h3>
                      <p className="text-muted-foreground">Update your information</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Card>
            <CardHeader>
                <CardTitle>My Events</CardTitle>
                <CardDescription>Manage your events and review creative submissions.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {events.map(event => (
                        <li key={event.id} className="flex items-center justify-between p-4 rounded-md border hover:bg-muted">
                            <div>
                                <p className="font-bold">{event.title}</p>
                                <p className="text-sm text-muted-foreground">{event.date} - <span className="text-primary font-medium">{event.location}</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                        event.published 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {event.published ? 'Published' : 'Draft'}
                                    </span>
                                    {!event.published && (
                                        <PublishEventButton event={{
                                            id: event.id,
                                            title: event.title,
                                            description: event.description,
                                            date: event.date,
                                            location: event.location,
                                            country: event.country
                                        }} />
                                    )}
                                    <Link href={`/dashboard/organizer/events/${event.id}`}>
                                        <Button variant="outline" size="sm">Manage</Button>
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                    {events.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        <p>You haven&apos;t created any events yet.</p>
                        <Button className="mt-4" asChild>
                          <Link href="/dashboard/organizer/events/create">
                            Create Your First Event
                          </Link>
                        </Button>
                    </div>
                    )}
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
