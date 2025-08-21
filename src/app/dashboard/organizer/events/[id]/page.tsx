

'use server';




import { InviteWithFeeDialog } from '@/components/passa/invite-with-fee-dialog';
import { Header } from '@/components/passa/header';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowLeft, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
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
        select: {
            id: true,
            title: true,
            artistInvitations: {
                include: {
                    artist: true,
                },
                orderBy: {
                    createdAt: 'desc',
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
                        <div>
                            <h1 className="font-headline text-3xl font-bold">Artist Applications: {event.title}</h1>
                            <p className="text-muted-foreground mt-1">Review artists who want to perform at your event.</p>
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
