

'use server';

import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Eye, FileText, CheckCircle, Clock, XCircle, DollarSign, BarChart3, Calendar, Music, TrendingUp, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { getSession } from '@/lib/session';

async function getCreatorData() {
    const session = await getSession();
    if (!session) {
        return {
            stats: {
                totalInvitations: 0,
                acceptedCount: 0,
                pendingCount: 0,
                totalEarnings: 0,
            },
            chartData: [],
            recentInvitations: [],
            error: 'No session found'
        };
    }
    
    await prisma.creatorProfile.findUnique({
        where: { userId: session.userId },
        include: { _count: { select: { portfolio: true } } }
    });

    const invitations = await prisma.artistInvitation.findMany({
        where: { artistId: session.userId },
        include: {
            event: {
                select: {
                    id: true,
                    title: true,
                    date: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const totalInvitations = invitations.length;
    const acceptedInvitations = invitations.filter(i => i.status === 'ACCEPTED');
    const acceptedCount = acceptedInvitations.length;
    const pendingCount = invitations.filter(i => i.status === 'PENDING').length;
    const rejectedCount = invitations.filter(i => i.status === 'REJECTED').length;

    // Calculate potential earnings from accepted invitations
    const totalEarnings = acceptedInvitations.reduce((sum, inv) => sum + inv.proposedFee, 0);

    const chartData = [
        { name: 'Accepted', value: acceptedCount, fill: 'hsl(var(--primary))' },
        { name: 'Pending', value: pendingCount, fill: 'hsl(var(--accent))' },
        { name: 'Rejected', value: rejectedCount, fill: 'hsl(var(--destructive))' }
    ];

    return {
        stats: {
            totalInvitations,
            acceptedCount,
            pendingCount,
            totalEarnings,
        },
        chartData,
        recentInvitations: invitations.slice(0, 5).map(i => ({
            id: i.id,
            eventId: i.eventId,
            event: { title: i.event.title },
            status: i.status,
            proposedFee: i.proposedFee,
            createdAt: i.createdAt,
        })),
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'ACCEPTED': return <CheckCircle className="size-4 text-green-500" />;
        case 'REJECTED': return <XCircle className="size-4 text-destructive" />;
        default: return <Clock className="size-4 text-yellow-500" />;
    }
}


export default async function CreatorDashboardPage() {
  const { stats, chartData, recentInvitations, error } = await getCreatorData();
  
  if (error) {
    return redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Creator Studio
                </h1>
                <p className="text-muted-foreground mt-2">Track your performance journey and discover new opportunities</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalInvitations > 0 ? Math.round((stats.acceptedCount / stats.totalInvitations) * 100) : 0}%</p>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <Button size="lg" asChild className="shadow-lg">
                  <Link href="/events">
                    <Zap className="mr-2 size-5" />
                    Find Gigs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Performance Overview */}
          <div className="grid gap-6 md:grid-cols-4 mb-12">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Earnings</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">${stats.totalEarnings.toFixed(2)}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">Potential income</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <DollarSign className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Confirmed</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.acceptedCount}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Ready to perform</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <CheckCircle className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.pendingCount}</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Awaiting response</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Clock className="size-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalInvitations}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">All invitations</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Award className="size-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Link href="/dashboard/creator/applications" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                      <Music className="size-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">My Applications</h3>
                      <p className="text-muted-foreground">Track your performance submissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/creator/profile" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                      <Eye className="size-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Update Profile</h3>
                      <p className="text-muted-foreground">Showcase your creative talents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Performance Analytics */}
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Recent Invitations</CardTitle>
                <CardDescription>Your latest performance opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvitations.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div className="flex-1">
                        <p className="font-medium">{inv.event.title}</p>
                        <p className="text-sm text-muted-foreground">${inv.proposedFee.toFixed(2)} • {inv.createdAt.toLocaleDateString()}</p>
                      </div>
                      <Badge variant={
                        inv.status === 'ACCEPTED' ? 'default' :
                        inv.status === 'REJECTED' ? 'destructive' :
                        'secondary'
                      } className="capitalize gap-1 pl-1.5 pr-2.5">
                        {getStatusIcon(inv.status)}
                        <span>{inv.status.toLowerCase()}</span>
                      </Badge>
                    </div>
                  ))}
                  {recentInvitations.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                      <Music className="mx-auto size-12 mb-4 opacity-50" />
                      <h3 className="font-semibold">No invitations yet</h3>
                      <p>Start applying to events to receive invitations</p>
                      <Button asChild className="mt-4">
                        <Link href="/events">Browse Events</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Upcoming Performances</CardTitle>
                <CardDescription>Your confirmed gigs</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.acceptedCount > 0 ? (
                  <div className="space-y-3">
                    {recentInvitations
                      .filter(inv => inv.status === 'ACCEPTED')
                      .slice(0, 4)
                      .map(inv => (
                      <Link key={inv.id} href={`/events/${inv.eventId}`} className="block group">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200 group-hover:scale-[1.02]">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                              <Music className="size-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-green-900 dark:text-green-100 group-hover:text-green-800 dark:group-hover:text-green-50">{inv.event.title}</p>
                              <p className="text-sm text-green-700 dark:text-green-300">{inv.createdAt.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-800 dark:text-green-200">${inv.proposedFee.toFixed(2)}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">Performance fee</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {stats.acceptedCount > 4 && (
                      <div className="text-center pt-2">
                        <p className="text-sm text-muted-foreground">+{stats.acceptedCount - 4} more confirmed gigs</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Calendar className="mx-auto size-12 mb-4 opacity-50" />
                    <p className="font-semibold">No confirmed gigs</p>
                    <p className="text-sm">Apply to events to book performances</p>
                    <Button asChild className="mt-4" size="sm">
                      <Link href="/events">Find Events</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
