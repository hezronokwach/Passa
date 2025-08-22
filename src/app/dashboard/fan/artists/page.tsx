'use server';

import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Eye } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { MobileNav } from '@/components/passa/mobile-nav';

interface CreatorProfile {
  id: number;
  userId: number;
  bio: string | null;
  skills: string[];
  website: string | null;
  user: {
    id: number;
    name: string | null;
    email: string;
  };
  _count: {
    portfolio: number;
  };
}

async function getArtists(userId: number) {
  // Get creators from events the user has attended
  const attendedEvents = await prisma.purchasedTicket.findMany({
    where: {
      ownerId: userId,
      status: 'USED',
    },
    select: {
      eventId: true,
    }
  });
  
  const eventIds = attendedEvents.map(ticket => ticket.eventId);
  
  // Get unique creators from attributions in attended events
  const creators = await prisma.attribution.findMany({
    where: {
      eventId: {
        in: eventIds
      },
      contributionType: 'CREATIVE'
    },
    include: {
      user: {
        include: {
          creatorProfile: {
            include: {
              _count: {
                select: {
                  portfolio: true
                }
              }
            }
          }
        }
      }
    }
  });
  
  // Remove duplicates and return unique creators
  const uniqueCreators = creators.reduce((acc: CreatorProfile[], attribution) => {
    const creatorProfile = attribution.user.creatorProfile;
    if (creatorProfile && !acc.find(c => c.userId === attribution.userId)) {
      acc.push(creatorProfile);
    }
    return acc;
  }, []);
  
  return uniqueCreators;
}

export default async function FanArtistsPage() {
  const session = await getSession();
  
  if (!session) {
    return redirect('/login');
  }

  const artists = await getArtists(session.userId);

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
                Artists I&apos;ve Attended
              </h1>
            </div>
          </div>

          {artists.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist) => (
                <Card key={artist.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${artist.user.name || artist.user.email}`} />
                      <AvatarFallback>
                        {(artist.user.name || artist.user.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {artist.user.name || artist.user.email.split('@')[0]}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {artist.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {artist.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{artist.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-2 mb-4">
                      {artist.bio || "This creator hasn&apos;t added a bio yet."}
                    </CardDescription>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{artist._count.portfolio} portfolio items</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 size-4" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-lg border-2 border-dashed">
              <h2 className="text-2xl font-bold">No Artists Found</h2>
              <p className="text-muted-foreground mt-2">Check back soon for amazing creators on Passa!</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav userRole={session?.role} />
    </div>
  );
}