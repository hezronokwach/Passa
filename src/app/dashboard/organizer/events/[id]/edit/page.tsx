'use server';

import { Header } from '@/components/passa/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

async function getEvent(eventId: number) {
    const session = await getSession();
    if (!session) redirect('/login');

    const event = await prisma.event.findUnique({
        where: { id: eventId, organizerId: session.userId },
        include: { tickets: true }
    });
    
    return event;
}

async function updateEvent(formData: FormData) {
    'use server';
    
    const session = await getSession();
    if (!session) redirect('/login');

    const eventId = parseInt(formData.get('eventId') as string);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const date = formData.get('date') as string;

    await prisma.event.update({
        where: { id: eventId, organizerId: session.userId },
        data: {
            title,
            description,
            location,
            date: new Date(date)
        }
    });

    redirect(`/dashboard/organizer/events/${eventId}`);
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventId = parseInt(id, 10);
    const event = await getEvent(eventId);

    if (!event) {
        return (
            <div className="flex min-h-screen w-full flex-col bg-secondary/30">
                <Header />
                <main className="flex-1 text-center py-20">
                    <h1 className="text-2xl font-bold">Event not found</h1>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <Link href={`/dashboard/organizer/events/${event.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                            <ArrowLeft className="size-4" />
                            Back to Event Dashboard
                        </Link>

                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Event: {event.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form action={updateEvent} className="space-y-6">
                                    <input type="hidden" name="eventId" value={event.id} />
                                    
                                    <div>
                                        <Label htmlFor="title">Event Title</Label>
                                        <Input id="title" name="title" defaultValue={event.title} required />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" defaultValue={event.description} rows={4} required />
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" name="location" defaultValue={event.location} required />
                                    </div>

                                    <div>
                                        <Label htmlFor="date">Date & Time</Label>
                                        <Input 
                                            id="date" 
                                            name="date" 
                                            type="datetime-local" 
                                            defaultValue={new Date(event.date).toISOString().slice(0, 16)} 
                                            required 
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="submit">Save Changes</Button>
                                        <Button type="button" variant="outline" asChild>
                                            <Link href={`/dashboard/organizer/events/${event.id}`}>Cancel</Link>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}