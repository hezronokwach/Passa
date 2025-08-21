'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const invitationFromSubmissionSchema = z.object({
  submissionId: z.coerce.number(),
  proposedFee: z.coerce.number().min(0),
  message: z.string().optional(),
});

export async function createInvitationFromSubmission(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const validatedFields = invitationFromSubmissionSchema.safeParse({
    submissionId: formData.get('submissionId'),
    proposedFee: formData.get('proposedFee'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to send invitation. Please check your inputs.',
      success: false,
    };
  }

  const { submissionId, proposedFee, message } = validatedFields.data;

  try {
    // Get submission with related data
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        brief: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                organizerId: true
              }
            }
          }
        }
      }
    });

    if (!submission) {
      return {
        errors: { submissionId: ['Submission not found'] },
        message: 'Submission not found',
        success: false,
      };
    }

    // Verify organizer owns the event
    if (submission.brief.event.organizerId !== session.userId) {
      return {
        errors: { submissionId: ['Access denied'] },
        message: 'Access denied',
        success: false,
      };
    }

    // Check if invitation already exists for this submission
    const existingInvitation = await prisma.artistInvitation.findFirst({
      where: {
        eventId: submission.brief.event.id,
        artistId: submission.creator.id,
        sourceBriefId: submission.briefId
      }
    });

    if (existingInvitation) {
      return {
        errors: { submissionId: ['Invitation already sent for this submission'] },
        message: 'Invitation already exists',
        success: false,
      };
    }

    // Create invitation
    const invitation = await prisma.artistInvitation.create({
      data: {
        eventId: submission.brief.event.id,
        organizerId: session.userId,
        artistEmail: submission.creator.email,
        artistName: submission.creator.name || 'Unknown Artist',
        proposedFee,
        message: message || `We'd like to invite you to work on "${submission.brief.title}" for our event "${submission.brief.event.title}".`,
        artistId: submission.creator.id,
        sourceBriefId: submission.briefId
      }
    });

    // Create history record
    await prisma.invitationHistory.create({
      data: {
        invitationId: invitation.id,
        action: 'CREATED',
        newStatus: 'PENDING',
        newFee: proposedFee,
        comments: `Invitation created from submission to "${submission.brief.title}"`
      }
    });

    // Create notification for artist
    await prisma.notification.create({
      data: {
        userId: submission.creator.id,
        type: 'ARTIST_INVITATION',
        title: 'New Artist Invitation',
        message: `You've been invited to work on "${submission.brief.title}". Fee: $${proposedFee}`,
        data: {
          eventId: submission.brief.event.id,
          invitationId: invitation.id,
          organizerId: session.userId,
          sourceBriefId: submission.briefId
        }
      }
    });

    revalidatePath('/dashboard/organizer');
    return {
      success: true,
      message: `Invitation sent to ${submission.creator.name || submission.creator.email}!`,
      errors: {},
      invitationId: invitation.id
    };

  } catch (error) {
    console.error('Invitation creation error:', error);
    return { success: false, message: 'Failed to send invitation.', errors: {} };
  }
}