import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const eventId = parseInt(id, 10);

    const event = await prisma.event.findUnique({
      where: { 
        id: eventId,
        organizerId: session.userId 
      },
      include: {
        tickets: true,
        artistInvitations: {
          include: {
            artist: true,
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
        purchasedTickets: true,
        _count: {
          select: {
            purchasedTickets: true,
            artistInvitations: true
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}