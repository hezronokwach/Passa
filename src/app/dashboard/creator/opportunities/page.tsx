import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Briefcase, DollarSign, FileText, Calendar, MapPin } from 'lucide-react';
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
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                         <h1 className="font-headline text-4xl font-bold md:text-5xl">
                           Find Events to Perform At
                         </h1>
                         <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            Browse upcoming events and apply to perform at the most exciting events in Africa.
                         </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <Card className="p-4 mb-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search by title or keyword..." className="pl-10" />
                            </div>
                            <Select>
                                <SelectTrigger>
                                    <Briefcase className="mr-2 text-muted-foreground"/>
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
                                    <DollarSign className="mr-2 text-muted-foreground"/>
                                    <SelectValue placeholder="Any Budget" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<1000">Under $1,000</SelectItem>
                                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                                    <SelectItem value=">5000">Over $5,000</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="font-bold w-full">Search</Button>
                        </div>
                    </Card>

                    {/* Events Grid */}
                    {events.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.map(event => (
                                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <Badge variant="secondary">Performance</Badge>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Apply to Perform</p>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl">{event.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                                <MapPin className="h-4 w-4 ml-2" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium">Organizer:</span>
                                                <span>{event.organizer.name}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {event._count.artistInvitations} artist{event._count.artistInvitations !== 1 ? 's' : ''} invited
                                                </span>
                                                {event.artistInvitations && event.artistInvitations.length > 0 ? (
                                                    <Button size="sm" variant="outline" disabled>
                                                        {event.artistInvitations[0].status === 'PENDING' ? 'Applied' :
                                                         event.artistInvitations[0].status === 'ACCEPTED' ? 'Accepted' :
                                                         'Rejected'}
                                                    </Button>
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
                        <div className="text-center text-muted-foreground py-24">
                            <FileText className="mx-auto size-16 mb-4" />
                            <h3 className="font-semibold text-xl">No Events Available</h3>
                            <p>There are currently no upcoming events. Please check back later!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
