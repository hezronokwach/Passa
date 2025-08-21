'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function inviteWithFee(formData: FormData) {
  const invitationId = parseInt(formData.get('invitationId') as string);
  const proposedFee = parseFloat(formData.get('proposedFee') as string);
  const message = formData.get('message') as string;

  const invitation = await prisma.artistInvitation.update({
    where: { id: invitationId },
    data: {
      proposedFee,
      message,
      status: 'PENDING'
    },
    include: {
      event: true,
      artist: true
    }
  });

  // Create invitation history
  await prisma.invitationHistory.create({
    data: {
      invitationId,
      action: 'UPDATED',
      newStatus: 'PENDING',
      newFee: proposedFee,
      comments: message
    }
  });

  // Notify the artist
  if (invitation.artistId) {
    await prisma.notification.create({
      data: {
        userId: invitation.artistId,
        type: 'ARTIST_INVITATION',
        title: 'Performance Invitation',
        message: `You've been invited to perform at ${invitation.event.title} for $${proposedFee}`,
        data: { invitationId, eventId: invitation.eventId }
      }
    });
  }

  revalidatePath('/dashboard/organizer/events');
}