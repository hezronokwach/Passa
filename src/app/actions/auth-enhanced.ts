'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { generateEmailVerificationToken } from '@/lib/auth/utils';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role),
});

export async function signupEnhanced(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return { 
      success: false, 
      message: 'Invalid form data.', 
      errors: validatedFields.error.flatten().fieldErrors 
    };
  }

  const { email, password, role } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'User with this email already exists.' };
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = await generateEmailVerificationToken(email);

      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          verificationToken: verificationToken,
        },
      });

      // Create role-specific profile
      if (role === Role.CREATOR) {
        await tx.creatorProfile.create({ 
          data: { userId: newUser.id, skills: [] } 
        });
      } else if (role === Role.ORGANIZER) {
        await tx.organizerProfile.create({ 
          data: { userId: newUser.id } 
        });
      }

      return newUser;
    });

    console.log(`✅ User created successfully: ${result.email} (ID: ${result.id})`);
    
    return { 
      success: true, 
      message: 'Signup successful. Please check your email to verify your account.' 
    };

  } catch (error) {
    console.error('❌ Signup error:', error);
    return { 
      success: false, 
      message: `Signup failed: ${(error as Error).message}` 
    };
  }
}
