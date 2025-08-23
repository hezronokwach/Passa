
'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { escrowService } from '@/lib/services/escrow-service';

// Mock user authentication for a fan
async function getAuthenticatedUserId() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session.userId;
}

const purchaseSchema = z.object({
    eventId: z.number(),
    ticketId: z.number(),
    buyerSecretKey: z.string().min(1, 'Wallet secret key required'),
});

const profileUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    walletAddress: z.string().optional(),
});

export async function purchaseTicket(input: { eventId: number; ticketId: number; buyerSecretKey: string }) {
  const userId = await getAuthenticatedUserId();

  const validatedFields = purchaseSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid input provided.",
    };
  }
  
  const { eventId, ticketId, buyerSecretKey } = validatedFields.data;

  try {
    // First, do all validations and get data (fast operations)
    const existingTicket = await prisma.purchasedTicket.findFirst({
      where: {
        eventId: eventId,
        ownerId: userId,
        status: 'ACTIVE'
      }
    });

    if (existingTicket) {
      throw new Error("You already have a ticket for this event.");
    }

    const ticketTier = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticketTier) {
      throw new Error("Ticket tier not found.");
    }

    if (ticketTier.sold >= ticketTier.quantity) {
      throw new Error("This ticket tier is sold out.");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true }
    });

    if (!event?.organizer?.walletAddress) {
      throw new Error("Organizer wallet address not found");
    }

    // Do blockchain operation outside transaction (slow operation)
    const escrowResult = await escrowService.sendToEscrow(
      buyerSecretKey,
      event.organizer.walletAddress,
      ticketTier.price.toString()
    );

    if (!escrowResult.success) {
      throw new Error(`Escrow payment failed: ${escrowResult.message}`);
    }

    // Now do fast database transaction with the blockchain result
    await prisma.$transaction(async (tx) => {
      // Double-check availability again inside transaction
      const currentTicket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!currentTicket || currentTicket.sold >= currentTicket.quantity) {
        throw new Error("Ticket sold out during purchase");
      }

      const purchasedTicket = await tx.purchasedTicket.create({
        data: {
          eventId: eventId,
          ticketId: ticketId,
          ownerId: userId,
          status: 'ACTIVE',
        }
      });

      await tx.transaction.create({
        data: {
          purchasedTicketId: purchasedTicket.id,
          amount: parseFloat(ticketTier.price.toString()),
          currency: 'XLM',
          blockchainTxId: escrowResult.transactionHash!,
          status: 'COMPLETED'
        }
      });

      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          sold: {
            increment: 1
          }
        }
      });
    });

    revalidatePath('/dashboard/fan/tickets');
    revalidatePath('/dashboard');
    return { success: true, message: 'Ticket purchased successfully!' };

  } catch (error: unknown) {
    console.error("Purchase error:", error);
    return { success: false, message: (error as Error).message || 'An unexpected error occurred during purchase.' };
  }
}

export async function updateUserProfile(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validatedFields = profileUpdateSchema.safeParse({
    name: formData.get('name'),
    walletAddress: formData.get('walletAddress'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid input provided.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedFields.data.name,
        walletAddress: validatedFields.data.walletAddress || null,
      },
    });

    revalidatePath('/dashboard/fan/profile');
    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, message: 'An unexpected error occurred while updating your profile.' };
  }
}
