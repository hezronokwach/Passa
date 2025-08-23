'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { sorobanService } from '@/lib/services/soroban-service';
import * as StellarSdk from '@stellar/stellar-sdk';

const acceptSchema = z.object({
  invitationId: z.coerce.number(),
  comments: z.string().optional(),
});

export async function acceptArtistInvitation(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const validatedFields = acceptSchema.safeParse({
    invitationId: formData.get('invitationId'),
    comments: formData.get('comments'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input provided.',
    };
  }

  const { invitationId, comments } = validatedFields.data;

  try {
    // Update invitation status to accepted
    await prisma.artistInvitation.update({
      where: { id: invitationId },
      data: {
        status: 'ACCEPTED',
        artistComments: comments,
      }
    });

    return {
      success: true,
      message: 'Invitation accepted! Both parties must now provide secret keys to create the smart contract.',
      needsContract: true,
      invitationId
    };

  } catch (error) {
    console.error('Accept invitation error:', error);
    return {
      success: false,
      message: 'Failed to accept invitation.',
    };
  }
}

const contractSchema = z.object({
  invitationId: z.coerce.number(),
  organizerSecretKey: z.string().min(1),
  artistSecretKey: z.string().min(1),
});

export async function createSmartContract(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const validatedFields = contractSchema.safeParse({
    invitationId: formData.get('invitationId'),
    organizerSecretKey: formData.get('organizerSecretKey'),
    artistSecretKey: formData.get('artistSecretKey'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input provided.',
    };
  }

  const { invitationId, organizerSecretKey, artistSecretKey } = validatedFields.data;

  try {
    // Get invitation with event details
    const invitation = await prisma.artistInvitation.findUnique({
      where: { id: invitationId },
      include: {
        event: {
          include: {
            organizer: true,
            artistInvitations: {
              where: { status: 'ACCEPTED' },
              include: { artist: true }
            }
          }
        },
        artist: true
      }
    });

    if (!invitation || invitation.status !== 'ACCEPTED') {
      return {
        success: false,
        message: 'Invitation not found or not accepted.',
      };
    }

    // Verify secret keys match wallet addresses
    const organizerKeypair = StellarSdk.Keypair.fromSecret(organizerSecretKey);
    const artistKeypair = StellarSdk.Keypair.fromSecret(artistSecretKey);

    if (organizerKeypair.publicKey() !== invitation.event.organizer.walletAddress) {
      return {
        success: false,
        message: 'Organizer secret key does not match wallet address.',
      };
    }

    if (artistKeypair.publicKey() !== invitation.artist?.walletAddress) {
      return {
        success: false,
        message: 'Artist secret key does not match wallet address.',
      };
    }

    // Get all accepted artists for this event
    const allAcceptedArtists = invitation.event.artistInvitations
      .filter(inv => inv.artist?.walletAddress)
      .map(inv => ({
        address: inv.artist!.walletAddress!,
        fixedAmount: inv.proposedFee.toString()
      }));

    // Create smart contract agreement
    const contractResult = await sorobanService.createAgreement(
      organizerSecretKey,
      `event_${invitation.eventId}`,
      allAcceptedArtists,
      invitation.event.totalBudget?.toString() || '0',
      Math.floor(invitation.event.date.getTime() / 1000)
    );

    if (contractResult.success) {
      // Update event with contract ID
      await prisma.event.update({
        where: { id: invitation.eventId },
        data: { contractAgreementId: contractResult.contractId }
      });

      return {
        success: true,
        message: 'Smart contract created successfully!',
        contractId: contractResult.contractId
      };
    } else {
      return {
        success: false,
        message: contractResult.message || 'Failed to create contract'
      };
    }

  } catch (error) {
    console.error('Contract creation error:', error);
    return {
      success: false,
      message: 'Failed to create smart contract.',
    };
  }
}