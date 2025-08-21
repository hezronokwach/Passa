import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const invitationId = parseInt(id, 10);

  try {
    const invitation = await prisma.artistInvitation.findUnique({
      where: { 
        id: invitationId,
        organizerId: session.userId 
      },
      include: {
        event: {
          select: {
            title: true
          }
        },
        history: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Organizer invitation fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch invitation' }, { status: 500 });
  }
}