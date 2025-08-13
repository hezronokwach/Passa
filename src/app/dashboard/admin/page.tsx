

'use server';

import { Header } from '@/components/passa/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/db';
import { BarChart2, Users, DollarSign } from 'lucide-react';

async function getTotalUsers() {
    return prisma.user.count();
}

async function getTotalEvents() {
    return prisma.event.count();
}

async function getTotalRevenue() {
    const purchasedTickets = await prisma.purchasedTicket.findMany({
        include: {
            ticket: {
                select: {
                    price: true
                }
            }
        }
    });

    return purchasedTickets.reduce((total, pt) => total + (pt.ticket?.price ?? 0), 0);
}


export default async function AdminDashboardPage() {
  const [totalUsers, totalEvents, totalRevenue] = await Promise.all([
    getTotalUsers(),
    getTotalEvents(),
    getTotalRevenue(),
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-3xl font-bold md:text-4xl">
              Admin Dashboard
            </h1>
          </div>
          
           <div className="grid gap-6 md:grid-cols-3 mb-8">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">From all ticket sales</p>
                </CardContent>
             </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground">Fans, Creators, and Organizers</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <BarChart2 className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalEvents}</div>
                    <p className="text-xs text-muted-foreground">Events created on the platform</p>
                </CardContent>
             </Card>
          </div>

          <Card>
            <CardHeader>
                <CardTitle>Welcome, Admin!</CardTitle>
                <CardDescription>This is the central control panel for managing the Passa platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>From here, you will be able to manage users, view platform-wide analytics, and oversee events.</p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
