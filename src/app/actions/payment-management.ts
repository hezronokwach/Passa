'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { blockchainService } from '@/lib/services/blockchain-service';
import { Keypair } from '@stellar/stellar-sdk';

const depositPaymentSchema = z.object({
  eventId: z.coerce.number(),
});

export async function triggerDepositPayments(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  const validatedFields = depositPaymentSchema.safeParse({
    eventId: formData.get('eventId'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Invalid data.', success: false };
  }

  const { eventId } = validatedFields.data;

  try {
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizerId: session.userId },
      include: { artistInvitations: { where: { status: 'ACCEPTED' } } }
    });

    if (!event?.contractAgreementId) {
      return { success: false, message: 'No smart contract found for this event.', errors: {} };
    }

    const platformSecret = process.env.PLATFORM_WALLET_SECRET;
    if (!platformSecret) throw new Error('Platform wallet not configured');

    const platformKeypair = Keypair.fromSecret(platformSecret);
    const totalAmount = event.artistInvitations.reduce((sum, inv) => sum + inv.proposedFee, 0);

    const result = await blockchainService.releaseSplit(
      event.contractAgreementId,
      BigInt(Math.round(totalAmount * 0.5 * 1000000)), // 50% deposit in stroops
      platformKeypair
    );

    if (result.success) {
      // Update invitations to mark deposits as paid
      await prisma.artistInvitation.updateMany({
        where: { eventId, status: 'ACCEPTED' },
        data: { /* Add depositPaid field if needed */ }
      });

      return { success: true, message: 'Deposit payments triggered successfully!', errors: {} };
    } else {
      return { success: false, message: 'Failed to trigger deposit payments.', errors: {} };
    }
  } catch (error) {
    console.error('Deposit payment error:', error);
    return { success: false, message: 'Failed to process deposit payments.', errors: {} };
  }
}

const confirmPerformanceSchema = z.object({
  eventId: z.coerce.number(),
  artistId: z.coerce.number(),
});

export async function confirmArtistPerformance(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  const validatedFields = confirmPerformanceSchema.safeParse({
    eventId: formData.get('eventId'),
    artistId: formData.get('artistId'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Invalid data.', success: false };
  }

  const { eventId, artistId } = validatedFields.data;

  try {
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizerId: session.userId },
      include: { artistInvitations: true }
    });

    if (!event?.contractAgreementId) {
      return { success: false, message: 'No smart contract found for this event.', errors: {} };
    }

    const invitation = event.artistInvitations.find(inv => inv.artistId === artistId);
    if (!invitation) {
      return { success: false, message: 'Artist invitation not found.', errors: {} };
    }

    const platformSecret = process.env.PLATFORM_WALLET_SECRET;
    if (!platformSecret) throw new Error('Platform wallet not configured');

    const platformKeypair = Keypair.fromSecret(platformSecret);

    // Release final payment for this specific artist
    const result = await blockchainService.releasePayment(
      event.contractAgreementId,
      invitation.artistEmail, // In production, this should be wallet address
      BigInt(Math.round(invitation.proposedFee * 0.5 * 1000000)), // Remaining 50%
      platformKeypair
    );

    if (result.success) {
      // Create notification for artist
      await prisma.notification.create({
        data: {
          userId: artistId,
          type: 'PAYMENT_RELEASED',
          title: 'Final Payment Released',
          message: `Your final payment of $${invitation.proposedFee * 0.5} for "${event.title}" has been released.`,
          data: { eventId, amount: invitation.proposedFee * 0.5 }
        }
      });

      return { success: true, message: 'Performance confirmed and final payment released!', errors: {} };
    } else {
      return { success: false, message: 'Failed to release final payment.', errors: {} };
    }
  } catch (error) {
    console.error('Performance confirmation error:', error);
    return { success: false, message: 'Failed to confirm performance.', errors: {} };
  }
}

export async function getContractStatus(eventId: number) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { contractAgreementId: true }
    });

    if (!event?.contractAgreementId) {
      return { success: false, message: 'No contract found' };
    }

    const result = await blockchainService.getAgreement(event.contractAgreementId);
    return result;
  } catch (error) {
    console.error('Contract status error:', error);
    return { success: false, error };
  }
}