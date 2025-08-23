'use server';

import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { sorobanService } from '@/lib/services/soroban-service';
import * as StellarSdk from '@stellar/stellar-sdk';

export async function releaseEventPayments(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: 'Not authenticated' };
  }

  const eventId = formData.get('eventId');
  const secretKey = formData.get('secretKey');

  if (!eventId || !secretKey) {
    return { success: false, message: 'Missing required fields' };
  }

  try {
    const event = await prisma.event.findUnique({
      where: { 
        id: Number(eventId),
        organizerId: session.userId 
      },
      include: {
        organizer: true,
        artistInvitations: {
          where: { status: 'ACCEPTED' },
          include: { artist: true }
        }
      }
    });

    if (!event) {
      return { success: false, message: 'Event not found or unauthorized' };
    }

    if (!event.contractAgreementId) {
      return { success: false, message: 'No contract found for this event' };
    }

    // Check if event has completed
    if (event.date > new Date()) {
      return { success: false, message: 'Event has not completed yet' };
    }

    // Verify secret key matches organizer's wallet
    try {
      const organizerKeypair = StellarSdk.Keypair.fromSecret(String(secretKey));
      if (organizerKeypair.publicKey() !== event.organizer.walletAddress) {
        return { success: false, message: 'Secret key does not match your wallet address' };
      }
    } catch {
      return { success: false, message: 'Invalid secret key format' };
    }

    // Release payments via smart contract
    const releaseResult = await sorobanService.releaseAllPayments(
      String(secretKey),
      `event_${eventId}`
    );

    if (releaseResult.success) {
      // Update event to mark payments as released
      await prisma.event.update({
        where: { id: Number(eventId) },
        data: { 
          // Add a field to track payment release if needed
          updatedAt: new Date()
        }
      });

      revalidatePath(`/dashboard/organizer/events/${eventId}`);

      return { 
        success: true, 
        message: `Payments released to ${event.artistInvitations.length} artists`,
        transactionHash: releaseResult.transactionHash
      };
    } else {
      return { 
        success: false, 
        message: releaseResult.message || 'Failed to release payments' 
      };
    }

  } catch (error) {
    console.error('Payment release error:', error);
    return { success: false, message: 'An error occurred while releasing payments' };
  }
}