'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const responseSchema = z.object({
  invitationId: z.coerce.number(),
  status: z.enum(['ACCEPTED', 'REJECTED']),
  comments: z.string().optional(),
});

export async function respondToInvitation(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const validatedFields = responseSchema.safeParse({
    invitationId: formData.get('invitationId'),
    status: formData.get('status'),
    comments: formData.get('comments'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid response data.',
      success: false,
    };
  }

  const { invitationId, status, comments } = validatedFields.data;

  try {
    // Get current invitation for history
    const currentInvitation = await prisma.artistInvitation.findUnique({
      where: { id: invitationId },
      include: { event: { select: { title: true, organizerId: true } } }
    });

    if (!currentInvitation || currentInvitation.artistId !== session.userId) {
      return { success: false, message: 'Invitation not found.', errors: {} };
    }

    // Update invitation
    const invitation = await prisma.artistInvitation.update({
      where: { id: invitationId },
      data: { 
        status,
        artistComments: comments 
      },
      include: {
        event: { 
          include: {
            artistInvitations: true
          }
        }
      }
    });

    // Create history record
    await prisma.invitationHistory.create({
      data: {
        invitationId,
        action: status,
        oldStatus: currentInvitation.status,
        newStatus: status,
        comments: comments || `Artist ${status.toLowerCase()} the invitation`
      }
    });

    // Check if all invitations are accepted to publish event
    const allInvitations = invitation.event.artistInvitations;
    const allAccepted = allInvitations.every(inv => inv.status === 'ACCEPTED');
    
    if (allAccepted && status === 'ACCEPTED') {
      await prisma.event.update({
        where: { id: invitation.event.id },
        data: { published: true }
      });
      
      // Notify organizer that event is published
      await prisma.notification.create({
        data: {
          userId: invitation.event.organizerId,
          type: 'EVENT_PUBLISHED',
          title: 'Event Published!',
          message: `"${invitation.event.title}" is now live - all artists have accepted!`,
          data: { eventId: invitation.event.id }
        }
      });
    }

    // Create notification for organizer
    await prisma.notification.create({
      data: {
        userId: invitation.event.organizerId,
        type: 'INVITATION_RESPONSE',
        title: `Artist ${status.toLowerCase()} invitation`,
        message: `${invitation.artistName} ${status.toLowerCase()} your invitation for "${invitation.event.title}"`,
        data: {
          eventId: invitation.eventId,
          invitationId: invitation.id,
          artistId: session.userId,
          status
        }
      }
    });

    revalidatePath('/dashboard/creator');
    return {
      success: true,
      message: `Invitation ${status.toLowerCase()} successfully!`,
      errors: {},
    };

  } catch (error) {
    console.error('Invitation response error:', error);
    return { success: false, message: 'Failed to respond to invitation.', errors: {} };
  }
}

const editInvitationSchema = z.object({
  invitationId: z.coerce.number(),
  proposedFee: z.coerce.number().min(0),
  message: z.string().optional(),
});

export async function editInvitation(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const validatedFields = editInvitationSchema.safeParse({
    invitationId: formData.get('invitationId'),
    proposedFee: formData.get('proposedFee'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data.',
      success: false,
    };
  }

  const { invitationId, proposedFee, message } = validatedFields.data;

  try {
    // Get current invitation for history
    const currentInvitation = await prisma.artistInvitation.findUnique({
      where: { id: invitationId },
      include: { event: { select: { title: true } } }
    });

    if (!currentInvitation || currentInvitation.organizerId !== session.userId) {
      return { success: false, message: 'Invitation not found.', errors: {} };
    }

    // Update invitation and reset status to PENDING
    const invitation = await prisma.artistInvitation.update({
      where: { id: invitationId },
      data: { 
        proposedFee,
        message,
        status: 'PENDING',
        artistComments: null
      },
      include: {
        event: { select: { title: true } }
      }
    });

    // Create history record
    await prisma.invitationHistory.create({
      data: {
        invitationId,
        action: 'UPDATED',
        oldStatus: currentInvitation.status,
        newStatus: 'PENDING',
        oldFee: currentInvitation.proposedFee,
        newFee: proposedFee,
        comments: `Organizer updated invitation: ${message || 'No message'}`
      }
    });

    // Notify artist if they exist on platform
    if (invitation.artistId) {
      await prisma.notification.create({
        data: {
          userId: invitation.artistId,
          type: 'ARTIST_INVITATION',
          title: 'Updated Artist Invitation',
          message: `Your invitation for "${invitation.event.title}" has been updated. New fee: $${proposedFee}`,
          data: {
            eventId: invitation.eventId,
            invitationId: invitation.id,
            organizerId: session.userId
          }
        }
      });
    }

    revalidatePath('/dashboard/organizer');
    return {
      success: true,
      message: 'Invitation updated and resent!',
      errors: {},
    };

  } catch (error) {
    console.error('Edit invitation error:', error);
    return { success: false, message: 'Failed to update invitation.', errors: {} };
  }
}