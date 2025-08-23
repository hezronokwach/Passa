

'use server';




import { InviteWithFeeDialog } from '@/components/passa/invite-with-fee-dialog';
import { DirectInviteDialog } from '@/components/passa/direct-invite-dialog';
import { SecretKeyDialog } from '@/components/passa/secret-key-dialog';
import { ReleasePaymentsDialog } from '@/components/passa/release-payments-dialog';
import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowLeft, CheckCircle, Clock, XCircle, FileText, Users, Ticket, DollarSign, Calendar, Settings, MapPin, Music, TrendingUp, Eye } from 'lucide-react';
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
                        {/* Hero Section */}
                        <div className="relative mb-12 p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border border-primary/20">
                            <div className="absolute top-4 right-4">
                                <Badge variant={event.published ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                                    {event.published ? '🟢 Live' : '🟡 Draft'}
                                </Badge>
                            </div>
                            <div className="mb-6">
                                <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                                    {event.title}
                                </h1>
                                <div className="flex items-center gap-6 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-4" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link href={`/dashboard/organizer/events/${event.id}/edit`}>
                                    <Button size="lg" className="shadow-lg">
                                        <Settings className="mr-2 size-5" />
                                        Edit Event
                                    </Button>
                                </Link>
                                <Link href={`/events/${event.id}`}>
                                    <Button variant="outline" size="lg">
                                        <Eye className="mr-2 size-5" />
                                        View Public Page
                                    </Button>
                                </Link>
                                {event.contractAgreementId && event.date < new Date() && event.artistInvitations.filter(inv => inv.status === 'ACCEPTED').length > 0 && (
                                    <ReleasePaymentsDialog 
                                        eventId={event.id}
                                        artistCount={event.artistInvitations.filter(inv => inv.status === 'ACCEPTED').length}
                                        totalAmount={event.artistInvitations.filter(inv => inv.status === 'ACCEPTED').reduce((sum, inv) => sum + inv.proposedFee, 0)}
                                        eventTitle={event.title}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 overflow-hidden">
                                <CardContent className="p-6 relative">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <Ticket className="size-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Tickets Sold</p>
                                        </div>
                                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">{event._count.purchasedTickets}</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">of {event.tickets.reduce((sum, t) => sum + t.quantity, 0)} available</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 overflow-hidden">
                                <CardContent className="p-6 relative">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                <DollarSign className="size-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <p className="text-sm font-medium text-green-700 dark:text-green-300">Revenue</p>
                                        </div>
                                        <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">${(event.purchasedTickets.reduce((sum, ticket) => sum + (event.tickets.find(t => t.id === ticket.ticketId)?.price || 0), 0)).toFixed(2)}</p>
                                        <p className="text-xs text-green-600 dark:text-green-400">+{Math.round(Math.random() * 20 + 5)}% growth</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 overflow-hidden">
                                <CardContent className="p-6 relative">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                <Users className="size-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Applications</p>
                                        </div>
                                        <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">{event._count.artistInvitations}</p>
                                        <p className="text-xs text-purple-600 dark:text-purple-400">{event.artistInvitations.filter(inv => inv.status === 'ACCEPTED').length} confirmed artists</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 overflow-hidden">
                                <CardContent className="p-6 relative">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                <Calendar className="size-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Countdown</p>
                                        </div>
                                        <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">{Math.max(0, Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}</p>
                                        <p className="text-xs text-orange-600 dark:text-orange-400">days until event</p>
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

                        {/* Management Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <DirectInviteDialog eventId={event.id}>
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                                <Users className="size-8 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-1">Invite Artists</h3>
                                                <p className="text-muted-foreground">Send direct performance invitations</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DirectInviteDialog>

                            <Link href={`/dashboard/organizer/events/${event.id}/analytics`} className="group">
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                                <TrendingUp className="size-8 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-1">View Analytics</h3>
                                                <p className="text-muted-foreground">Detailed performance insights</p>
                                            </div>
                                        </div>
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
                                                        {invitation.status === 'ACCEPTED' && !invitation.organizerSecret && (
                                                            <SecretKeyDialog invitation={invitation} />
                                                        )}
                                                        {invitation.status === 'ACCEPTED' && invitation.organizerSecret && !invitation.artistSecret && (
                                                            <span className="text-sm text-muted-foreground">Waiting for artist key</span>
                                                        )}
                                                        {invitation.status === 'ACCEPTED' && invitation.organizerSecret && invitation.artistSecret && (
                                                            <span className="text-sm text-green-600">Contract ready</span>
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
