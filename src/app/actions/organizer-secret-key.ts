'use server';

import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { sorobanService } from '@/lib/services/soroban-service';
import * as StellarSdk from '@stellar/stellar-sdk';

export async function enterOrganizerSecretKey(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: 'Not authenticated' };
  }

  const invitationId = formData.get('invitationId');
  const secretKey = formData.get('secretKey');

  if (!invitationId || !secretKey) {
    return { success: false, message: 'Missing required fields' };
  }

  try {
    const invitation = await prisma.artistInvitation.findUnique({
      where: { id: Number(invitationId) },
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

    if (!invitation) {
      return { success: false, message: 'Invitation not found' };
    }

    // Verify secret key matches organizer's wallet
    try {
      const organizerKeypair = StellarSdk.Keypair.fromSecret(String(secretKey));
      if (organizerKeypair.publicKey() !== invitation.event.organizer.walletAddress) {
        return { success: false, message: 'Secret key does not match your wallet address' };
      }
    } catch {
      return { success: false, message: 'Invalid secret key format' };
    }

    const updatedInvitation = await prisma.artistInvitation.update({
      where: { id: Number(invitationId) },
      data: { organizerSecret: String(secretKey) },
    });

    // Check if both keys are now present
    if (updatedInvitation.artistSecret && updatedInvitation.organizerSecret) {
      // Both keys are present, initiate the contract
      await initiateContract(invitation.eventId, String(secretKey), updatedInvitation.artistSecret);
    }

    revalidatePath(`/dashboard/organizer/events/${invitation.eventId}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred' };
  }
}

async function initiateContract(eventId: number, organizerSecret: string, artistSecret: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: true,
        artistInvitations: {
          where: { status: 'ACCEPTED' },
          include: { artist: true }
        }
      }
    });

    if (!event || event.contractAgreementId) {
      return; // Contract already exists or event not found
    }

    // Get all accepted artists with wallet addresses
    const allAcceptedArtists = event.artistInvitations
      .filter(inv => inv.artist?.walletAddress)
      .map(inv => ({
        address: inv.artist!.walletAddress!,
        fixedAmount: inv.proposedFee.toString()
      }));

    if (allAcceptedArtists.length === 0) {
      return;
    }

    // Create smart contract agreement
    const contractResult = await sorobanService.createAgreement(
      organizerSecret,
      `event_${eventId}`,
      allAcceptedArtists,
      event.totalBudget?.toString() || '0',
      Math.floor(event.date.getTime() / 1000)
    );

    if (contractResult.success) {
      // Update event with contract ID
      await prisma.event.update({
        where: { id: eventId },
        data: { contractAgreementId: contractResult.contractId }
      });

      console.log(`Contract created successfully for event ${eventId}: ${contractResult.contractId}`);
    } else {
      console.error(`Contract creation failed for event ${eventId}: ${contractResult.message}`);
    }
  } catch (error) {
    console.error('Contract initiation error:', error);
  }
}
