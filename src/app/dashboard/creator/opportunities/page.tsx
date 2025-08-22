import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Briefcase, DollarSign, FileText, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { ApplyToPerformDialog } from '@/components/passa/apply-to-perform-dialog';
import { getSession } from '@/lib/session';

async function getOpportunities() {
  const session = await getSession();
  const userId = session?.userId;

  const events = await prisma.event.findMany({
    where: {
      published: true,
      date: {
        gte: new Date()
      }
    },
    include: {
      organizer: {
        select: {
          name: true
        }
      },
      artistInvitations: userId ? {
        where: {
          artistId: userId
        },
        select: {
          status: true
        }
      } : false,
      _count: {
        select: {
          artistInvitations: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  });

  return events;
}

export default async function OpportunitiesPage() {
    const events = await getOpportunities();

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-12">
                         <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                           Performance Opportunities
                         </h1>
                         <p className="text-xl text-muted-foreground max-w-2xl">
                            Browse upcoming events and apply to perform at the most exciting events in Africa.
                         </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <Card className="border-0 shadow-lg p-6 mb-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                                <Input placeholder="Search by title or keyword..." className="pl-10" />
                            </div>
                            <Select>
                                <SelectTrigger>
                                    <Briefcase className="mr-2 text-muted-foreground size-4"/>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video">Video & Animation</SelectItem>
                                    <SelectItem value="design">Graphic Design</SelectItem>
                                    <SelectItem value="writing">Writing & Translation</SelectItem>
                                    <SelectItem value="photo">Photography</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <DollarSign className="mr-2 text-muted-foreground size-4"/>
                                    <SelectValue placeholder="Any Budget" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<1000">Under $1,000</SelectItem>
                                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                                    <SelectItem value=">5000">Over $5,000</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="w-full shadow-sm">Search</Button>
                        </div>
                    </Card>

                    {/* Events Grid */}
                    {events.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.map(event => (
                                <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Performance</Badge>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Apply to Perform</p>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="size-4 text-primary" />
                                                    <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="size-4 text-primary" />
                                                    <span className="font-medium">{event.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                                                <span className="font-medium">Organizer:</span>
                                                <span>{event.organizer.name}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {event._count.artistInvitations} artist{event._count.artistInvitations !== 1 ? 's' : ''} applied
                                                </span>
                                                {event.artistInvitations && event.artistInvitations.length > 0 ? (
                                                    <Badge variant={
                                                        event.artistInvitations[0].status === 'ACCEPTED' ? 'default' :
                                                        event.artistInvitations[0].status === 'REJECTED' ? 'destructive' :
                                                        'secondary'
                                                    }>
                                                        {event.artistInvitations[0].status === 'PENDING' ? 'Applied' :
                                                         event.artistInvitations[0].status === 'ACCEPTED' ? 'Accepted' :
                                                         'Rejected'}
                                                    </Badge>
                                                ) : (
                                                    <ApplyToPerformDialog event={event} />
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-6">
                                <FileText className="size-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">No Events Available</h3>
                            <p className="text-muted-foreground mb-6">There are currently no upcoming events. Please check back later!</p>
                            <Button asChild>
                                <Link href="/events">Browse All Events</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
