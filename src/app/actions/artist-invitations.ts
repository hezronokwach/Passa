'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { sorobanService } from '@/lib/services/soroban-service';

const invitationSchema = z.object({
  eventId: z.coerce.number(),
  totalBudget: z.coerce.number().min(0),
  eventMessage: z.string().optional(),
  artists: z.string().min(1, "At least one artist is required"),
});

export async function sendArtistInvitations(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const validatedFields = invitationSchema.safeParse({
    eventId: formData.get('eventId'),
    totalBudget: formData.get('totalBudget'),
    eventMessage: formData.get('eventMessage'),
    artists: formData.get('artists'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to send invitations. Please check your inputs.',
      success: false,
    };
  }

  const { eventId, totalBudget, eventMessage, artists } = validatedFields.data;

  try {
    const artistList = JSON.parse(artists);
    const totalFees = artistList.reduce((sum: number, artist: { fee: string }) => sum + parseFloat(artist.fee), 0);

    if (totalFees > totalBudget) {
      return {
        errors: { artists: ['Total artist fees exceed the budget'] },
        message: 'Budget exceeded',
        success: false,
      };
    }

    // Verify event exists and belongs to organizer
    const event = await prisma.event.findFirst({
      where: { 
        id: eventId,
        organizerId: session.userId 
      }
    });

    if (!event) {
      return {
        errors: { eventId: ['Event not found or access denied'] },
        message: 'Event not found',
        success: false,
      };
    }

    // Update event with budget
    await prisma.event.update({
      where: { id: eventId },
      data: { totalBudget }
    });

    // Create invitations and notifications
    const invitations = await Promise.all(
      artistList.map(async (artist: { email: string; name: string; fee: string; userId?: number }) => {
        const invitation = await prisma.artistInvitation.create({
          data: {
            eventId,
            organizerId: session.userId,
            artistEmail: artist.email,
            artistName: artist.name,
            proposedFee: parseFloat(artist.fee),
            message: eventMessage,
            artistId: artist.userId || null,
          }
        });

        // Create history record
        await prisma.invitationHistory.create({
          data: {
            invitationId: invitation.id,
            action: 'CREATED',
            newStatus: 'PENDING',
            newFee: parseFloat(artist.fee),
            comments: `Initial invitation sent to ${artist.name}`
          }
        });

        // Create notification for existing platform users
        if (artist.userId) {
          await prisma.notification.create({
            data: {
              userId: artist.userId,
              type: 'ARTIST_INVITATION',
              title: 'New Artist Invitation',
              message: `You've been invited to perform at an event. Fee: ${artist.fee} XLM`,
              data: {
                eventId,
                invitationId: invitation.id,
                organizerId: session.userId
              }
            }
          });
        }

        return invitation;
      })
    );

    // Contract creation will happen when artists accept invitations
    console.log(`Invitations sent for event ${eventId} with total budget: ${totalBudget}`);

    return {
      success: true,
      message: `Sent ${invitations.length} invitation(s) successfully!`,
      errors: {},
      invitationIds: invitations.map(inv => inv.id)
    };

  } catch (error) {
    console.error('Invitation sending error:', error);
    return { success: false, message: 'Failed to send invitations.', errors: {} };
  }
}