import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const artists = await prisma.user.findMany({
      where: {
        role: 'CREATOR',
        creatorProfile: {
          isNot: null
        },
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        creatorProfile: {
          select: {
            skills: true,
            bio: true
          }
        }
      },
      take: 10
    });

    const formattedArtists = artists.map(artist => ({
      id: artist.id,
      name: artist.name || 'Unknown',
      email: artist.email,
      skills: artist.creatorProfile?.skills || []
    }));

    return NextResponse.json(formattedArtists);
  } catch (error) {
    console.error('Artist search error:', error);
    return NextResponse.json([], { status: 500 });
  }
}