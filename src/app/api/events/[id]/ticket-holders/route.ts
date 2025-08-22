import { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ORGANIZER') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const eventId = parseInt(id);

    // Verify organizer owns this event
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizerId: session.userId }
    });

    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    // Get all ticket holders and their attendance status
    const ticketHolders = await prisma.purchasedTicket.findMany({
      where: { eventId },
      include: {
        owner: {
          select: { name: true, email: true }
        },
        ticket: {
          select: { name: true }
        },
        attendance: {
          select: { id: true }
        }
      }
    });

    const formattedHolders = ticketHolders.map(holder => ({
      id: holder.id,
      name: holder.owner.name,
      email: holder.owner.email,
      ticketType: holder.ticket.name,
      isCheckedIn: holder.attendance.length > 0
    }));

    return Response.json({ ticketHolders: formattedHolders });
  } catch (error) {
    console.error('Error fetching ticket holders:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}