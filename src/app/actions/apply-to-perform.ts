'use server';

import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function applyToPerform(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, message: 'Please login first' };

  const eventId = parseInt(formData.get('eventId') as string);
  const message = formData.get('message') as string;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { organizerId: true }
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  await prisma.artistInvitation.create({
    data: {
      eventId,
      organizerId: event!.organizerId,
      artistEmail: user!.email,
      artistName: user!.name || user!.email,
      artistId: session.userId,
      proposedFee: 0,
      message,
      status: 'PENDING'
    }
  });

  revalidatePath('/dashboard/creator/opportunities');
  return { success: true, message: 'Application sent!' };
}