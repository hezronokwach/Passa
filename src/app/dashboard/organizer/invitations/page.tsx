'use server';

import { Header } from '@/components/passa/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import Link from 'next/link';
import { OrganizerInvitationsClient } from '@/components/passa/organizer-invitations-client';
import { DollarSign } from 'lucide-react';

async function getOrganizerInvitations() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const invitations = await prisma.artistInvitation.findMany({
    where: { organizerId: session.userId },
    include: {
      event: {
        select: {
          title: true,
          date: true,
          location: true,
          country: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return invitations;
}

export default async function OrganizerInvitationsPage() {
  const invitations = await getOrganizerInvitations();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-headline text-3xl font-bold md:text-4xl">
                Artist Invitations
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage invitations you&apos;ve sent to artists and view responses
              </p>
            </div>
            <Link href="/dashboard/organizer">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sent Invitations</CardTitle>
              <CardDescription>
                All invitations you&apos;ve sent to artists for your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No invitations sent yet</h3>
                  <p className="text-muted-foreground">
                    Create an event and publish it to start inviting artists
                  </p>
                </div>
              ) : (
                <OrganizerInvitationsClient invitations={invitations} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}