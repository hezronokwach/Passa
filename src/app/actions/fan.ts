
'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

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
});

const profileUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    walletAddress: z.string().optional(),
});

export async function purchaseTicket(input: { eventId: number; ticketId: number }) {
  const userId = await getAuthenticatedUserId();

  const validatedFields = purchaseSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid input provided.",
    };
  }
  
  const { eventId, ticketId } = validatedFields.data;

  try {
     // Use a transaction to ensure data integrity
     await prisma.$transaction(async (tx) => {
        const ticketTier = await tx.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticketTier) {
            throw new Error("Ticket tier not found.");
        }

        if (ticketTier.sold >= ticketTier.quantity) {
            throw new Error("This ticket tier is sold out.");
        }
        
        // Create the purchased ticket
        const purchasedTicket = await tx.purchasedTicket.create({
            data: {
                eventId: eventId,
                ticketId: ticketId,
                ownerId: userId,
                status: 'ACTIVE',
                // In a real app, a transaction record would be created here too
            }
        });

        // Increment the sold count on the ticket tier
        await tx.ticket.update({
            where: { id: ticketId },
            data: {
                sold: {
                    increment: 1
                }
            }
        });

        return purchasedTicket;
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
