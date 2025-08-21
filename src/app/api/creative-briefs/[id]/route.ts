import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const briefId = parseInt(id, 10);

  if (isNaN(briefId)) {
    return NextResponse.json({ error: 'Invalid brief ID' }, { status: 400 });
  }

  try {
    const brief = await prisma.creativeBrief.findUnique({
      where: { id: briefId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            country: true,
            published: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });

    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }

    if (!brief.event.published) {
      return NextResponse.json({ error: 'Event not published' }, { status: 403 });
    }

    return NextResponse.json(brief);
  } catch (error) {
    console.error('Creative brief fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch brief' }, { status: 500 });
  }
}