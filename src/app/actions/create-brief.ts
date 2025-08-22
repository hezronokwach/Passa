'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createBrief(formData: FormData) {
  const eventId = parseInt(formData.get('eventId') as string);
  const title = formData.get('title') as string;
  const budget = parseFloat(formData.get('budget') as string);

  await prisma.creativeBrief.create({
    data: {
      eventId,
      title,
      description: `Looking for ${title.toLowerCase()} for this event`,
      budget,
      requiredSkills: [title],
      category: 'Creative Work'
    }
  });

  revalidatePath(`/dashboard/organizer/events/${eventId}`);
}