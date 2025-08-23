'use server';

import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalletProfile } from '@/components/passa/wallet-profile';
import { updateUserProfile } from '@/app/actions/fan';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { MobileNav } from '@/components/passa/mobile-nav';

async function getFanProfile() {
  const session = await getSession();
  if (!session) {
    return redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return user;
}

export default async function FanProfilePage() {
  const session = await getSession();
  if (!session) {
    return redirect('/login');
  }
  
  const user = await getFanProfile();

  if (!user) {
    return redirect('/login');
  }

  const session = await getSession();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link 
                href="/dashboard/fan" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
              >
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </Link>
              <h1 className="font-headline text-3xl font-bold md:text-4xl">
                My Profile
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            <WalletProfile userWallet={user.walletAddress} />
            
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here. Click save when you&apos;re done.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={async (formData) => {await updateUserProfile(formData)}} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        defaultValue={user.name || ''} 
                        placeholder="Enter your full name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        defaultValue={user.email || ''} 
                        placeholder="Enter your email" 
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed for security reasons.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Wallet Address</Label>
                      <Input 
                        id="walletAddress" 
                        name="walletAddress" 
                        defaultValue={user.walletAddress || ''} 
                        placeholder="Enter your wallet address" 
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>
                    Manage your profile picture and visibility settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center rounded-full bg-muted p-8">
                    <User className="size-16 text-muted-foreground" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Profile pictures are coming soon!
                  </p>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account type</span>
                    <span className="capitalize">{user.role.toLowerCase()}</span>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
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