

'use server';

import { updateSubmissionStatus } from '@/app/actions/organizer';
import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Clock, XCircle, FileText, Download } from 'lucide-react';
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
import type { Submission, User, CreativeBrief } from '@prisma/client';
import React from 'react';
import { getSession } from '@/lib/session';


type SubmissionWithCreator = Submission & { creator: User };
type BriefWithSubmissions = CreativeBrief & { submissions: SubmissionWithCreator[] };

async function getEventData(eventId: number) {
    const session = await getSession();
    // Middleware protects this page, so user session is guaranteed to exist.
    const userId = session!.userId;

    const event = await prisma.event.findUnique({
        where: { id: eventId, organizerId: userId }, // Ensure user owns the event
        select: {
            id: true,
            title: true,
            briefs: {
                include: {
                    submissions: {
                        include: {
                            creator: true,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        }
                    }
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

function ActionButtons({ submission, eventId }: { submission: Submission, eventId: number }) {
    const updateStatusWithId = updateSubmissionStatus.bind(null, undefined);

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
                <a href={submission.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2"/> Download
                </a>
            </Button>
            {submission.status === 'PENDING' && (
                <>
                    <form action={updateStatusWithId}>
                        <input type="hidden" name="submissionId" value={submission.id} />
                        <input type="hidden" name="eventId" value={eventId} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive"><XCircle className="mr-2"/> Reject</Button>
                    </form>
                    <form action={updateStatusWithId}>
                        <input type="hidden" name="submissionId" value={submission.id} />
                        <input type="hidden" name="eventId" value={eventId} />
                        <input type="hidden" name="status" value="APPROVED" />
                        <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-2"/> Approve</Button>
                    </form>
                </>
            )}
        </div>
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
                        <h1 className="font-headline text-3xl font-bold">Submissions for: {event.title}</h1>
                        <p className="text-muted-foreground mt-1">Review and manage content submitted by creators.</p>

                        <div className="mt-8 space-y-8">
                            {event.briefs.map((brief: BriefWithSubmissions) => (
                                <Card key={brief.id}>
                                    <CardHeader>
                                        <CardTitle>{brief.title}</CardTitle>
                                        <CardDescription>
                                            {brief.submissions.length} submission(s) for this creative brief.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Creator</TableHead>
                                                    <TableHead>Message</TableHead>
                                                    <TableHead className="text-center">Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {brief.submissions.map((sub: SubmissionWithCreator) => (
                                                    <TableRow key={sub.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-medium">{sub.creator.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate text-muted-foreground">
                                                            {sub.message}
                                                        </TableCell>
                                                         <TableCell className="text-center">
                                                            <StatusBadge status={sub.status} />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionButtons submission={sub} eventId={event.id}/>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        {brief.submissions.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <FileText className="mx-auto size-12 mb-4" />
                                                <h3 className="font-semibold">No submissions yet</h3>
                                                <p>Creators will be able to submit their work here.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
