
'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

async function getAuthenticatedUser() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { organizerProfile: true }
  });

  if (!user || user.role !== 'ORGANIZER' || !user.organizerProfile) {
    // This case should ideally not happen if middleware and signup are correct
    redirect('/login');
  }

  return { userId: user.id, profileId: user.organizerProfile.id };
}


const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description is too short."),
  location: z.string().min(2, "Location is required."),
  country: z.string().min(2, "Country is required."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  time: z.string().min(1, "Time is required."),
  imageUrl: z.string().url("Please enter a valid image URL.").or(z.string().min(1, "Image is required.")),
  tickets: z.string().min(1, "At least one ticket tier is required."),
  imageUrl: z.string().url("Please enter a valid image URL."),
  ticketPrice: z.coerce.number().min(0, "Price must be a positive number."),
  ticketQuantity: z.coerce.number().int().min(1, "You must offer at least 1 ticket."),
  currency: z.string().min(2, "Currency is required."),
  artistSplit: z.coerce.number().int().min(0).max(100),
  venueSplit: z.coerce.number().int().min(0).max(100),
  passaSplit: z.coerce.number().int().min(0).max(100),
}).refine(data => data.artistSplit + data.venueSplit + data.passaSplit === 100, {
    message: "The sum of all splits must be exactly 100.",
    path: ["revenueSplits"], // Assign error to a custom path
});

export async function createEvent(prevState: unknown, formData: FormData) {
  const { userId } = await getAuthenticatedUser();

  const formDataObj = {
    title: formData.get('title'),
    description: formData.get('description'),
    location: formData.get('location'),
    country: formData.get('country'),
    date: formData.get('date'),
    time: formData.get('time'),
    imageUrl: formData.get('imageUrl'),
    tickets: formData.get('tickets'),
  };

  console.log('Server received form data:', formDataObj);

  const validatedFields = eventSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create event. Please check your inputs.',
      success: false,
    };
  }

  const {
      title,
      description,
      location,
      country,
      date,
      imageUrl,
      ticketPrice,
      ticketQuantity,
      artistSplit,
      venueSplit,
      passaSplit,
    } = validatedFields.data;

  try {
    await prisma.event.create({
      data: {
        title,
        description,
        location,
        country,
        date: eventDateTime,
        imageUrl,
        organizerId: userId,
        artistSplit,
        venueSplit,
        passaSplit,
        currency, // Add currency here
        tickets: {
          create: ticketTiers.map((tier: { name: string; price: string; quantity: string }) => ({
            name: tier.name,
            price: parseFloat(tier.price),
            quantity: parseInt(tier.quantity),
            sold: 0,
          }))
        }
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/organizer');

  } catch (error) {
    console.error('Event creation error:', error);
    return { success: false, message: 'An unexpected error occurred while saving to the database.', errors: {} };
  }

  redirect('/dashboard/organizer');
}

const organizerProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  companyName: z.string().optional(),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters." }).optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export async function updateOrganizerProfile(prevState: unknown, formData: FormData) {
  const { userId, profileId } = await getAuthenticatedUser();

  const rawData = {
    name: formData.get('name'),
    companyName: formData.get('companyName'),
    bio: formData.get('bio'),
    website: formData.get('website'),
  };

  const validatedFields = organizerProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update profile. Please check your inputs.',
      success: false,
    };
  }

  const { name, companyName, bio, website } = validatedFields.data;

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name },
      }),
      prisma.organizerProfile.update({
        where: { id: profileId },
        data: {
          companyName,
          bio,
          website,
        },
      }),
    ]);

    revalidatePath('/dashboard/organizer/profile');
    return { success: true, message: 'Profile updated successfully!', errors: {} };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update profile.', errors: {} };
  }
}

const submissionStatusSchema = z.object({
    submissionId: z.coerce.number(),
    status: z.enum(['APPROVED', 'REJECTED']),
    eventId: z.coerce.number(),
});

export async function updateSubmissionStatus(prevState: unknown, formData: FormData) {
    // Ensure the user is an organizer before proceeding
    await getAuthenticatedUser();

    const validatedFields = submissionStatusSchema.safeParse({
        submissionId: formData.get('submissionId'),
        status: formData.get('status'),
        eventId: formData.get('eventId'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid data provided.' };
    }

    const { submissionId, status, eventId } = validatedFields.data;

    try {
        await prisma.$transaction(async (tx) => {
            const submission = await tx.submission.update({
                where: { id: submissionId },
                data: { status },
            });

            if (status === 'APPROVED') {
                // Check if an attribution already exists for this submission
                const existingAttribution = await tx.attribution.findUnique({
                    where: { submissionId: submission.id }
                });

                if (!existingAttribution) {
                    await tx.attribution.create({
                        data: {
                            eventId: eventId,
                            userId: submission.creatorId,
                            submissionId: submission.id,
                            contributionType: 'CREATIVE',
                            // This is a placeholder. A real implementation would have a more dynamic way
                            // for organizers to set this, possibly splitting the artist share.
                            sharePercentage: 10,
                        }
                    });
                }
            }
        });

        revalidatePath(`/dashboard/organizer/events/${eventId}`);
        revalidatePath(`/events/${eventId}`);
        return { success: true, message: `Submission status updated to ${status}.` };
    } catch (error) {
        console.error('Error updating submission status:', error);
        return { success: false, message: 'Failed to update submission status.' };
    }
}


const sponsorshipSchema = z.object({
    eventId: z.coerce.number(),
});

export async function createSponsorship(prevState: unknown, formData: FormData) {
    const { userId } = await getAuthenticatedUser();

    const validatedFields = sponsorshipSchema.safeParse({
        eventId: formData.get('eventId'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid data provided.' };
    }

    const { eventId } = validatedFields.data;

    try {
        // Check if this user has already sponsored this event
        const existingSponsorship = await prisma.attribution.findFirst({
            where: {
                eventId: eventId,
                userId: userId,
                contributionType: 'SPONSORSHIP',
            }
        });

        if (existingSponsorship) {
            return { success: false, message: 'You have already sponsored this event.' };
        }

        await prisma.attribution.create({
            data: {
                eventId: eventId,
                userId: userId,
                contributionType: 'SPONSORSHIP',
                sharePercentage: 0, // Sponsors don't get a revenue share
            }
        });

        revalidatePath(`/events/${eventId}`);
        return { success: true, message: 'Thank you for sponsoring this event!' };

    } catch (error) {
        console.error('Error creating sponsorship:', error);
        return { success: false, message: 'Failed to sponsor event.' };
    }
}
