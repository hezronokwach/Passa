import { Header } from '@/components/passa/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Mail, UserCheck } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { ApplicationsClient } from '@/components/passa/applications-client';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return 'default';
    case 'PENDING':
      return 'secondary';
    case 'REJECTED':
      return 'destructive';
    default:
      return 'outline';
  }
};

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
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">
              My Performance Activity
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
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
              <Card>
                <CardHeader>
                  <CardTitle>Invitations from Organizers</CardTitle>
                </CardHeader>
                <CardContent>
                  {invitations.length > 0 ? (
                    <ApplicationsClient invitations={invitations} type="invitations" />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="mx-auto h-12 w-12 mb-4" />
                      <h3 className="font-semibold text-lg">No Invitations Yet</h3>
                      <p>You haven't received any performance invitations from organizers.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Your Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <ApplicationsClient invitations={applications} type="applications" />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <UserCheck className="mx-auto h-12 w-12 mb-4" />
                      <h3 className="font-semibold text-lg">No Applications Yet</h3>
                      <p>You haven't applied to perform at any events yet.</p>
                      <Link href="/dashboard/creator/opportunities">
                        <Button className="mt-4">
                          Browse Events
                        </Button>
                      </Link>
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