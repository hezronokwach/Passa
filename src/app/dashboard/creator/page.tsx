

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
                totalSubmissions: 0,
                approvedCount: 0,
                portfolioCount: 0,
                totalEarnings: 0,
                contributedEvents: 0,
            },
            chartData: [],
            recentSubmissions: [],
            error: 'No session found'
        };
    }
    
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: session.userId }
    });

    const creatorProfile = await prisma.creatorProfile.findUnique({
        where: { userId: user.id },
        include: { _count: { select: { portfolio: true } } }
    });

    const submissions = await prisma.submission.findMany({
        where: { creatorId: user.id },
        include: { 
            brief: { 
                select: { 
                    title: true,
                    event: {
                        include: {
                            tickets: true,
                        }
                    } 
                } 
            },
            attribution: true,
        },
        orderBy: { createdAt: 'desc' }
    });

    const totalSubmissions = submissions.length;
    const approvedSubmissions = submissions.filter(s => s.status === 'APPROVED');
    const approvedCount = approvedSubmissions.length;
    const pendingCount = submissions.filter(s => s.status === 'PENDING').length;
    const rejectedCount = submissions.filter(s => s.status === 'REJECTED').length;

    // Calculate total earnings
    let totalEarnings = 0;
    const contributedEventIds = new Set<number>();

    for (const sub of approvedSubmissions) {
        if (sub.attribution && sub.brief.event) {
            const eventRevenue = sub.brief.event.tickets.reduce((sum, ticket) => sum + (ticket.sold * ticket.price), 0);
            const artistPool = eventRevenue * (sub.brief.event.artistSplit / 100);
            const creatorShare = artistPool * (sub.attribution.sharePercentage / 100);
            totalEarnings += creatorShare;
            contributedEventIds.add(sub.brief.event.id);
        }
    }

    const chartData = [
        { name: 'Approved', value: approvedCount, fill: 'hsl(var(--primary))' },
        { name: 'Pending', value: pendingCount, fill: 'hsl(var(--accent))' },
        { name: 'Rejected', value: rejectedCount, fill: 'hsl(var(--destructive))' }
    ];

    return {
        stats: {
            totalSubmissions,
            approvedCount,
            portfolioCount: creatorProfile?._count.portfolio ?? 0,
            totalEarnings,
            contributedEvents: contributedEventIds.size,
        },
        chartData,
        recentSubmissions: submissions.slice(0, 5).map(s => ({
            id: s.id,
            brief: { title: s.brief.title },
            status: s.status,
            createdAt: s.createdAt,
        })),
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'APPROVED': return <CheckCircle className="size-4 text-green-500" />;
        case 'REJECTED': return <XCircle className="size-4 text-destructive" />;
        default: return <Clock className="size-4 text-yellow-500" />;
    }
}


export default async function CreatorDashboardPage() {
  const { stats, chartData, recentSubmissions, error } = await getCreatorData();
  
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
                        My Applications
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
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                    <DollarSign className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">From all approved contributions</p>
                </CardContent>
             </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Submissions</CardTitle>
                    <CheckCircle className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.approvedCount} / {stats.totalSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Total work approved by organizers</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Events Contributed To</CardTitle>
                    <BarChart3 className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.contributedEvents}</div>
                    <p className="text-xs text-muted-foreground">Unique events you&apos;ve worked on</p>
                </CardContent>
             </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
                    <FolderKanban className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.portfolioCount}</div>
                    <p className="text-xs text-muted-foreground">Works showcased on your profile</p>
                </CardContent>
             </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-5">
             <Card className="md:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                    <CardDescription>Track the status of your creative work.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brief</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentSubmissions.map(sub => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">{sub.brief.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            sub.status === 'APPROVED' ? 'default' :
                                            sub.status === 'REJECTED' ? 'destructive' :
                                            'secondary'
                                        } className="capitalize gap-1 pl-1.5 pr-2.5">
                                            {getStatusIcon(sub.status)}
                                            <span>{sub.status.toLowerCase()}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs">{sub.createdAt.toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {recentSubmissions.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">
                            <FileText className="mx-auto size-12 mb-4" />
                            <h3 className="font-semibold">No submissions yet</h3>
                            <p>Apply to an opportunity to get started.</p>
                        </div>
                     )}
                </CardContent>
             </Card>
             <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Submissions Overview</CardTitle>
                    <CardDescription>A look at your submission success.</CardDescription>
                </CardHeader>
                <CardContent>
                     {stats.totalSubmissions > 0 ? (
                        <SubmissionsChart data={chartData} />
                     ) : (
                        <div className="text-center text-muted-foreground py-12">
                             <FileText className="mx-auto size-12 mb-4" />
                             <h3 className="font-semibold">No data to display</h3>
                             <p>Submit work to see your stats here.</p>
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
