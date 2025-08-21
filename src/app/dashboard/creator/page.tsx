

'use server';

import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Eye, FileText, CheckCircle, Clock, XCircle, FolderKanban, DollarSign, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SubmissionsChart } from './submissions-chart';
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
    
    const creatorProfile = await prisma.creatorProfile.findUnique({
        where: { userId: session.userId },
        include: { _count: { select: { portfolio: true } } }
    });

    const invitations = await prisma.artistInvitation.findMany({
        where: { artistId: session.userId },
        include: {
            event: {
                select: {
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-3xl font-bold md:text-4xl">
              Creator Dashboard
            </h1>
            <div className="flex gap-2">

                <Link href="/dashboard/creator/profile">
                    <Button variant="outline">
                        <Eye className="mr-2 size-4" />
                        View My Profile
                    </Button>
                </Link>
                <Link href="/dashboard/creator/applications">
                    <Button variant="outline">
                        <FileText className="mr-2 size-4" />
                        My Activity
                    </Button>
                </Link>
                <Link href="/dashboard/creator/opportunities">
                    <Button>
                        <PlusCircle className="mr-2 size-4" />
                        Find New Work
                    </Button>
                </Link>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Potential Earnings</CardTitle>
                    <DollarSign className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">From accepted invitations</p>
                </CardContent>
             </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accepted Invitations</CardTitle>
                    <CheckCircle className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.acceptedCount}</div>
                    <p className="text-xs text-muted-foreground">Performance opportunities confirmed</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
                    <Clock className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingCount}</div>
                    <p className="text-xs text-muted-foreground">Awaiting your response</p>
                </CardContent>
             </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
                    <BarChart3 className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalInvitations}</div>
                    <p className="text-xs text-muted-foreground">All performance invitations received</p>
                </CardContent>
             </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-5">
             <Card className="md:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Invitations</CardTitle>
                    <CardDescription>Your latest performance opportunities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Fee</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentInvitations.map(inv => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-medium">{inv.event.title}</TableCell>
                                    <TableCell>${inv.proposedFee.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            inv.status === 'ACCEPTED' ? 'default' :
                                            inv.status === 'REJECTED' ? 'destructive' :
                                            'secondary'
                                        } className="capitalize gap-1 pl-1.5 pr-2.5">
                                            {getStatusIcon(inv.status)}
                                            <span>{inv.status.toLowerCase()}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs">{inv.createdAt.toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {recentInvitations.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">
                            <FileText className="mx-auto size-12 mb-4" />
                            <h3 className="font-semibold">No invitations yet</h3>
                            <p>Organizers will send you performance invitations here.</p>
                        </div>
                     )}
                </CardContent>
             </Card>
             <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Invitations Overview</CardTitle>
                    <CardDescription>Your invitation response breakdown.</CardDescription>
                </CardHeader>
                <CardContent>
                     {stats.totalInvitations > 0 ? (
                        <SubmissionsChart data={chartData} />
                     ) : (
                        <div className="text-center text-muted-foreground py-12">
                             <FileText className="mx-auto size-12 mb-4" />
                             <h3 className="font-semibold">No invitations yet</h3>
                             <p>Your invitation stats will appear here.</p>
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
