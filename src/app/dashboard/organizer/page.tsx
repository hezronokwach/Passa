

import { DashboardHeader } from '@/components/passa/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, User, Calendar, TrendingUp, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import Link from 'next/link';

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

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <Link href="/dashboard/organizer/events/create" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <PlusCircle className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Create Event</h3>
                      <p className="text-sm text-muted-foreground">Start planning</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/events" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Eye className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Explore Events</h3>
                      <p className="text-sm text-muted-foreground">See what&apos;s trending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/organizer/invitations" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                      <Users className="size-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Invitations</h3>
                      <p className="text-sm text-muted-foreground">Manage artists</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/organizer/profile" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                      <User className="size-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Profile</h3>
                      <p className="text-sm text-muted-foreground">Update details</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Events - Show only top 3 */}
          {events.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Events</CardTitle>
                    <CardDescription>Your latest event activities</CardDescription>
                  </div>
                  {events.length > 3 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/organizer/events">View All</Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.slice(0, 3).map(event => (
                    <Link key={event.id} href={`/dashboard/organizer/events/${event.id}`} className="block">
                      <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{event.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>{event.date}</span>
                              <span>•</span>
                              <span>{event.location}</span>
                              <span>•</span>
                              <span>{event.applications} applications</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={event.published ? 'default' : 'secondary'}>
                              {event.published ? 'Live' : 'Draft'}
                            </Badge>
                            <Badge variant="outline">{event.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {events.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Calendar className="size-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
                  <p className="text-muted-foreground mb-6">Start creating amazing events and building your audience</p>
                  <Button size="lg" asChild>
                    <Link href="/dashboard/organizer/events/create">
                      <PlusCircle className="mr-2 size-5" />
                      Create Your First Event
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
