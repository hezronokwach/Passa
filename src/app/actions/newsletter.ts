'use server';

import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function subscribeToNewsletter(prevState: unknown, formData: FormData) {
  const validatedFields = newsletterSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please enter a valid email address',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    // In a real app, you would save to database or send to email service
    console.log(`Newsletter subscription for: ${email}`);
    
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!',
      errors: {},
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Failed to subscribe. Please try again.',
      errors: {},
    };
  }
}