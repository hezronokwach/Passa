

'use server';




import { InviteWithFeeDialog } from '@/components/passa/invite-with-fee-dialog';
import { DirectInviteDialog } from '@/components/passa/direct-invite-dialog';
import { Header } from '@/components/passa/header';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowLeft, CheckCircle, Clock, XCircle, FileText, Users, Ticket, DollarSign, Calendar, Settings, MapPin, Music, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/db';

import { getSession } from '@/lib/session';




async function getEventData(eventId: number) {
    const session = await getSession();
    const userId = session!.userId;

    const event = await prisma.event.findUnique({
        where: { id: eventId, organizerId: userId },
        include: {
            tickets: true,
            artistInvitations: {
                include: {
                    artist: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            },
            purchasedTickets: true,
            _count: {
                select: {
                    purchasedTickets: true,
                    artistInvitations: true
                }
            }
        }
    });
    return event;
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'APPROVED':
            return <CheckCircle className="size-5 text-green-500" />;
        case 'REJECTED':
            return <XCircle className="size-5 text-destructive" />;
        default:
            return <Clock className="size-5 text-yellow-500" />;
    }
}

function StatusBadge({ status }: { status: string }) {
    return (
        <Badge variant={
            status === 'APPROVED' ? 'default' :
            status === 'REJECTED' ? 'destructive' :
            'secondary'
        } className="capitalize">
            {getStatusIcon(status)}
            <span className="ml-2">{status.toLowerCase()}</span>
        </Badge>
    );
}



export default async function EventSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventId = parseInt(id, 10);
    const event = await getEventData(eventId);

    if (!event) {
        return (
            <div className="flex min-h-screen w-full flex-col bg-secondary/30">
                <Header />
                <main className="flex-1 text-center py-20">
                    <h1 className="text-2xl font-bold">Event not found.</h1>
                    <p className="text-muted-foreground">You may not have permission to view this event.</p>
                </main>
            </div>
        )
    }
    
    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                         <Link href="/dashboard/organizer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                            <ArrowLeft className="size-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="font-headline text-3xl font-bold">{event.title}</h1>
                                <p className="text-muted-foreground mt-1">Event Management Dashboard</p>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/dashboard/organizer/events/${event.id}/edit`}>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                                        <Settings className="size-4" />
                                        Edit Event
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Tickets Sold</p>
                                            <p className="text-2xl font-bold">{event._count.purchasedTickets}</p>
                                            <p className="text-xs text-muted-foreground">of {event.tickets.reduce((sum, t) => sum + t.quantity, 0)} total</p>
                                        </div>
                                        <Ticket className="size-8 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                            <p className="text-2xl font-bold">${(event.purchasedTickets.reduce((sum, ticket) => sum + (event.tickets.find(t => t.id === ticket.ticketId)?.price || 0), 0)).toFixed(2)}</p>
                                            <p className="text-xs text-green-600">+12% from last event</p>
                                        </div>
                                        <DollarSign className="size-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Artist Applications</p>
                                            <p className="text-2xl font-bold">{event._count.artistInvitations}</p>
                                            <p className="text-xs text-muted-foreground">{event.artistInvitations.filter(inv => inv.status === 'ACCEPTED').length} accepted</p>
                                        </div>
                                        <Users className="size-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Days Until Event</p>
                                            <p className="text-2xl font-bold">{Math.max(0, Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                                        </div>
                                        <Calendar className="size-8 text-orange-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Event Details & Management */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Event Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="text-primary" />
                                        Event Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                                        <p className="font-medium">{event.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                                        <p className="font-medium">{new Date(event.date).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <Badge variant={event.published ? 'default' : 'secondary'}>
                                            {event.published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Performing Artists */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Music className="text-primary" />
                                        Performing Artists
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {event.artistInvitations.filter(inv => inv.status === 'ACCEPTED').length > 0 ? (
                                        <div className="space-y-3">
                                            {event.artistInvitations.filter(inv => inv.status === 'ACCEPTED').map((invitation) => (
                                                <div key={invitation.id} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{invitation.artistName}</p>
                                                        <p className="text-sm text-muted-foreground">{invitation.artist?.email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-green-600">${invitation.proposedFee}</p>
                                                        <p className="text-xs text-muted-foreground">Performance fee</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Music className="mx-auto size-12 mb-4 opacity-50" />
                                            <p>No confirmed artists yet</p>
                                            <p className="text-sm">Review applications below</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <Link href={`/dashboard/organizer/events/${event.id}/analytics`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-6">
                                        <TrendingUp className="size-8 text-primary mb-3" />
                                        <h3 className="font-semibold mb-1">View Analytics</h3>
                                        <p className="text-sm text-muted-foreground">Detailed performance metrics</p>
                                    </CardContent>
                                </Card>
                            </Link>
                            <DirectInviteDialog eventId={event.id}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-6">
                                        <Users className="size-8 text-primary mb-3" />
                                        <h3 className="font-semibold mb-1">Invite Artists</h3>
                                        <p className="text-sm text-muted-foreground">Send direct invitations</p>
                                    </CardContent>
                                </Card>
                            </DirectInviteDialog>
                            <Link href={`/events/${event.id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-6">
                                        <Star className="size-8 text-primary mb-3" />
                                        <h3 className="font-semibold mb-1">View Public Page</h3>
                                        <p className="text-sm text-muted-foreground">See how fans see your event</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>

                        <div className="mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Artist Applications</CardTitle>
                                    <CardDescription>
                                        {event.artistInvitations.length} artist{event.artistInvitations.length !== 1 ? 's' : ''} applied to perform.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Artist</TableHead>
                                                <TableHead>Message</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {event.artistInvitations.map((invitation) => (
                                                <TableRow key={invitation.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium">{invitation.artistName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate text-muted-foreground">
                                                        {invitation.message}
                                                    </TableCell>
                                                     <TableCell className="text-center">
                                                        <StatusBadge status={invitation.status} />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {invitation.status === 'PENDING' && (
                                                            <InviteWithFeeDialog invitation={invitation} />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {event.artistInvitations.length === 0 && (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <FileText className="mx-auto size-12 mb-4" />
                                            <h3 className="font-semibold">No applications yet</h3>
                                            <p>Artists will apply to perform at your event here.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
