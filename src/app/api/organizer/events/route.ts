import { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ORGANIZER') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: { organizerId: session.userId },
      select: {
        id: true,
        title: true,
        date: true,
      },
      orderBy: { date: 'desc' }
    });

    return Response.json({ events });
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}