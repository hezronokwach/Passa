
'use server';

import { z } from 'zod';
import prisma from '@/lib/db';

const subscribeSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const validatedFields = subscribeSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return {
        success: false,
        message: 'This email is already subscribed to our newsletter.',
        errors: {}
      };
    }

    await prisma.newsletterSubscription.create({
      data: {
        email,
      },
    });

    return {
      success: true,
      message: "You've been successfully subscribed. Welcome!",
      errors: {}
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      errors: {}
    };
  }
}
