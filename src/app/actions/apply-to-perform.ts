'use server';

import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function applyToPerform(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'Please login first' };
    }

    const eventId = parseInt(formData.get('eventId') as string);
    const message = formData.get('message') as string;

    if (!message?.trim()) {
      return { success: false, message: 'Please tell us why you want to perform at this event' };
    }

    // Check if already applied
    const existingApplication = await prisma.artistInvitation.findFirst({
      where: {
        eventId,
        artistId: session.userId
      }
    });

    if (existingApplication) {
      return { success: false, message: 'You have already applied to this event' };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { organizerId: true }
    });

    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    await prisma.artistInvitation.create({
      data: {
        eventId,
        organizerId: event.organizerId,
        artistEmail: user!.email,
        artistName: user!.name || user!.email,
        artistId: session.userId,
        proposedFee: 0,
        message,
        status: 'PENDING'
      }
    });

    // Notify the organizer
    await prisma.notification.create({
      data: {
        userId: event.organizerId,
        type: 'ARTIST_APPLICATION',
        title: 'New Artist Application',
        message: `${user!.name || user!.email} applied to perform at ${event.title}`,
        data: { eventId, artistId: session.userId }
      }
    });

    revalidatePath('/dashboard/creator/opportunities');
    return { success: true, message: 'Application sent successfully!' };
  } catch (error) {
    console.error('Apply to perform error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}