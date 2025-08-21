import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, UserCheck } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { ApplicationsClient } from '@/components/passa/applications-client';



async function getArtistActivity() {
  const session = await getSession();
  if (!session?.userId) return { invitations: [], applications: [] };

  // Get invitations received (organizer-initiated)
  const invitations = await prisma.artistInvitation.findMany({
    where: { artistId: session.userId },
    include: {
      event: {
        select: {
          title: true,
          date: true,
          location: true,
          organizer: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // For now, applications are the same as invitations
  // In the future, you could add an 'initiatedBy' field to distinguish
  const applications = invitations;

  return { invitations, applications };
}

export default async function ApplicationsPage() {
  const { invitations, applications } = await getArtistActivity();
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Performance Activity
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Track invitations received and applications sent for performance opportunities.
            </p>
          </div>

          <Tabs defaultValue="invitations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="invitations" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Invitations Received ({invitations.length})
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Applications Sent ({applications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invitations">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="size-5 text-primary" />
                    Invitations from Organizers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {invitations.length > 0 ? (
                    <ApplicationsClient invitations={invitations} type="invitations" />
                  ) : (
                    <div className="text-center py-16">
                      <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-6">
                        <Mail className="size-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Invitations Yet</h3>
                      <p className="text-muted-foreground mb-6">You haven&apos;t received any performance invitations from organizers.</p>
                      <Button asChild>
                        <Link href="/events">Browse Events</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="size-5 text-primary" />
                    Your Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <ApplicationsClient invitations={applications} type="applications" />
                  ) : (
                    <div className="text-center py-16">
                      <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-6">
                        <UserCheck className="size-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                      <p className="text-muted-foreground mb-6">You haven&apos;t applied to perform at any events yet.</p>
                      <Button asChild>
                        <Link href="/events">
                          Browse Events
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}