

'use server';

import { DashboardHeader } from '@/components/passa/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, BarChart2, User } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

async function getOrganizerData() {
    // Middleware protects this page, so session is guaranteed.
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }
    
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: session.userId }
    });

    const events = await prisma.event.findMany({
        where: { organizerId: user.id },
        include: {
            _count: {
                select: { briefs: { where: { submissions: { some: {} } } } }
            },
            briefs: {
                include: {
                    submissions: {
                        include: {
                            creator: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    const totalEvents = events.length;

    const allSubmissions = events.flatMap(event => event.briefs.flatMap(brief => brief.submissions));
    const totalSubmissions = allSubmissions.length;

    const approvedCreatorIds = new Set<number>();
    allSubmissions.forEach(submission => {
        if (submission.status === 'APPROVED') {
            approvedCreatorIds.add(submission.creatorId);
        }
    });
    const approvedCreators = approvedCreatorIds.size;

    return {
        user,
        events: events.map(event => ({
            id: event.id,
            title: event.title,
            date: event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            submissions: event.briefs.reduce((acc, brief) => acc + brief.submissions.length, 0),
            status: event.date > new Date() ? 'Upcoming' : 'Live' // Simple status logic
        })),
        stats: {
            totalEvents,
            totalSubmissions,
            approvedCreators,
        }
    }
}

export default async function OrganizerDashboardPage() {
  const { user, events, stats } = await getOrganizerData();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-3xl font-bold md:text-4xl">
              Organization Dashboard
            </h1>
            <div className="flex gap-2">
                 <Link href="/dashboard/organizer/profile">
                    <Button variant="outline">
                        <User className="mr-2 size-4" />
                        My Profile
                    </Button>
                </Link>
                <Button asChild>
                  <Link href="/dashboard/organizer/events/create">
                    <PlusCircle className="mr-2 size-4" />
                    Create New Event
                  </Link>
                </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <BarChart2 className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    <p className="text-xs text-muted-foreground">Managed by you</p>
                </CardContent>
             </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Creative Submissions</CardTitle>
                    <Users className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.totalSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Across all events</p>
                </CardContent>
             </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Creators</CardTitle>
                    <Users className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.approvedCreators}</div>
                    <p className="text-xs text-muted-foreground">Collaborating on your events</p>
                </CardContent>
             </Card>
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
                                <p className="text-sm text-muted-foreground">{event.date} - <span className="text-primary font-medium">{event.submissions} submissions</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${event.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{event.status}</span>
                                <Link href={`/dashboard/organizer/events/${event.id}`}>
                                    <Button variant="outline">Manage Event</Button>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
                    {events.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        <p>You haven't created any events yet.</p>
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
