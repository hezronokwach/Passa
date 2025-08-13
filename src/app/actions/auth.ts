'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role),
});

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, role } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
    
    // Create corresponding profile
    if (role === 'CREATOR') {
        await prisma.creatorProfile.create({ data: { userId: newUser.id, skills: [] } });
    } else if (role === 'ORGANIZER') {
        await prisma.organizerProfile.create({ data: { userId: newUser.id } });
    }

    await createSession(newUser.id, newUser.role);

  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  switch(role) {
      case 'ADMIN':
          redirect('/dashboard/admin');
      case 'CREATOR':
          redirect('/dashboard/creator');
      case 'ORGANIZER':
          redirect('/dashboard/organizer');
      default:
          redirect('/dashboard');
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export async function login(prevState: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Invalid form data',
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return { success: false, message: 'Invalid email or password.' };
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            return { success: false, message: 'Invalid email or password.' };
        }

        await createSession(user.id, user.role);

    } catch (error) {
         console.error('Login error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
    
    // The middleware will handle the redirect on the next request.
    // For a better UX, we can redirect from here.
    const user = await prisma.user.findUnique({ where: { email } });
     switch(user?.role) {
      case 'ADMIN':
          redirect('/dashboard/admin');
      case 'CREATOR':
          redirect('/dashboard/creator');
      case 'ORGANIZER':
          redirect('/dashboard/organizer');
      case 'FAN':
          redirect('/dashboard/fan');
      default:
          redirect('/dashboard');
  }
}

export async function logout() {
    // In a real app, you'd call a server action to clear the session cookie
    console.log('Logging out...');
    redirect('/login');
}
