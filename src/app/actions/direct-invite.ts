'use server';

import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createDirectInvite(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'Please login first' };
    }

    const eventId = parseInt(formData.get('eventId') as string);
    const artistName = formData.get('artistName') as string;
    const artistEmail = formData.get('artistEmail') as string;
    const proposedFee = parseFloat(formData.get('proposedFee') as string);
    const message = formData.get('message') as string;

    if (!artistName?.trim() || !artistEmail?.trim()) {
      return { success: false, message: 'Artist name and email are required' };
    }

    if (!proposedFee || proposedFee <= 0) {
      return { success: false, message: 'Please enter a valid performance fee' };
    }

    // Check if event exists and user owns it
    const event = await prisma.event.findUnique({
      where: { id: eventId, organizerId: session.userId }
    });

    if (!event) {
      return { success: false, message: 'Event not found or access denied' };
    }

    // Create the invitation
    const invitation = await prisma.artistInvitation.create({
      data: {
        eventId,
        organizerId: session.userId,
        artistEmail,
        artistName,
        proposedFee,
        message,
        status: 'PENDING'
      }
    });

    // Create invitation history
    await prisma.invitationHistory.create({
      data: {
        invitationId: invitation.id,
        action: 'CREATED',
        newStatus: 'PENDING',
        newFee: proposedFee,
        comments: message
      }
    });

    revalidatePath(`/dashboard/organizer/events/${eventId}`);
    return { success: true, message: 'Invitation sent successfully!' };
  } catch (error) {
    console.error('Direct invite error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}