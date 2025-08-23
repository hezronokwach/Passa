

'use server';

import React from 'react';
import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ticket, Download } from 'lucide-react';
import Link from 'next/link';
import { TicketStub } from '@/components/passa/ticket-stub';
import type { Event, PurchasedTicket } from '@prisma/client';
import prisma from '@/lib/db';

import { getSession } from '@/lib/session';
import { generateTicketQRCode } from '@/app/actions/qr-code';
import { MobileNav } from '@/components/passa/mobile-nav';

type TranslatedPurchasedTicket = PurchasedTicket & {
    event: Event & {
        translatedTitle: string;
        price: number;
        currency: string;
        imageHint: string;
    };
    qrCode?: string;
    owner: { name: string | null } | null;
};

async function getAuthenticatedFanId() {
  const session = await getSession();
  // Middleware handles the redirect, so we can assume session exists.
  return session!.userId;
}


async function getFanTickets(): Promise<TranslatedPurchasedTicket[]> {
    const fanId = await getAuthenticatedFanId();
    
    const purchasedTickets = await prisma.purchasedTicket.findMany({
        where: { ownerId: fanId },
        include: {
            event: {
                include: {
                    tickets: true,
                }
            },
            owner: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const translatedTickets: TranslatedPurchasedTicket[] = await Promise.all(
        purchasedTickets.map(async (ticket) => {
            const ticketTier = ticket.event.tickets.find(t => t.id === ticket.ticketId);
            
            // Generate QR code for the ticket
            let qrCode: string | undefined;
            try {
                qrCode = await generateTicketQRCode(ticket);
            } catch (error) {
                console.error('Error generating QR code for ticket:', error);
            }

            return {
                ...ticket,
                event: {
                    ...ticket.event,
                    translatedTitle: ticket.event.title,
                    price: ticketTier?.price ?? 0,
                    currency: 'USD',
                    imageHint: 'music festival',
                },
                qrCode
            };
        })
    );
    
    return translatedTickets;
}


export default async function MyTicketsPage() {
    
    const tickets = await getFanTickets();

    const session = await getSession();

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                 <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/dashboard/fan" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                            <ArrowLeft className="size-4" />
                            Back to Fan Dashboard
                        </Link>

                        <div className="flex items-center justify-between mb-8">
                            <h1 className="font-headline text-3xl font-bold md:text-4xl">
                              My Tickets
                            </h1>
                            <Button variant="outline">
                                <Download className="mr-2 size-4" />
                                Download All
                            </Button>
                        </div>
                        
                        {tickets.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2">
                                {tickets.map(ticket => (
                                    <div key={ticket.id} className="w-full max-w-sm mx-auto">
                                        <TicketStub 
                                            event={ticket.event}
                                            isPurchased={true}
                                            qrCode={ticket.qrCode}
                                            ownerName={ticket.owner?.name || 'Ticket Holder'}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 rounded-lg border-2 border-dashed">
                                <Ticket className="mx-auto size-16 text-muted-foreground mb-4" />
                                <h2 className="text-2xl font-bold">You have no tickets yet.</h2>
                                <p className="text-muted-foreground mt-2">When you purchase a ticket, it will appear here.</p>
                                <Button className="mt-6" asChild>
                                    <Link href="/events">Discover Events</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <MobileNav 
                isAuthenticated={!!session}
                dashboardPath="/dashboard/fan"
                navItems={[]}
            />
        </div>
    );
}
