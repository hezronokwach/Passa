'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { generateEmailVerificationToken, generatePasswordResetToken } from '@/lib/auth/utils';
import { blockchainAuthService } from '@/lib/auth/blockchain';

// Schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const walletLoginSchema = z.object({
    publicKey: z.string(),
    signature: z.string(),
    challenge: z.string(),
});

// Actions

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData));

  console.log(validatedFields);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data.', errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password, role } = validatedFields.data;
  console.log("Fields: ", validatedFields.data);

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = await generateEmailVerificationToken(email);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        verificationToken: verificationToken,
      },
    });

    // TODO: Send email verification email
    console.log(`Verification token for ${email}: ${verificationToken}`);

    if (role === Role.CREATOR) {
        await prisma.creatorProfile.create({ data: { userId: newUser.id, skills: [] } });
    } else if (role === Role.ORGANIZER) {
        await prisma.organizerProfile.create({ data: { userId: newUser.id } });
    }

    return { success: true, message: 'Signup successful. Please check your email to verify your account.' };

  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function login(prevState: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return { success: false, message: 'Invalid email or password.' };
        }

        if (!user.emailVerified) {
            return { success: false, message: 'Please verify your email before logging in.' };
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return { success: false, message: 'Invalid email or password.' };
        }

        await createSession(user.id, user.role);

        switch(user.role) {
            case Role.ADMIN: 
                redirect('/dashboard/admin');
                break;
            case Role.CREATOR: 
                redirect('/dashboard/creator');
                break;
            case Role.ORGANIZER: 
                redirect('/dashboard/organizer');
                break;
            case Role.FAN: 
                redirect('/dashboard/fan');
                break;
            default: 
                redirect('/dashboard');
        }

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function verifyEmail(token: string) {
    try {
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });

        if (!user) {
            return { success: false, message: 'Invalid verification token.' };
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date(), verificationToken: null },
        });

        return { success: true, message: 'Email verified successfully. You can now log in.' };
    } catch (error) {
        console.error('Email verification error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function forgotPassword(prevState: any, formData: FormData) {
    const validatedFields = forgotPasswordSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const resetToken = await generatePasswordResetToken(email);
            // TODO: Send password reset email
            console.log(`Password reset token for ${email}: ${resetToken}`);
        }

        return { success: true, message: 'If a user with that email exists, a password reset link has been sent.' };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const validatedFields = resetPasswordSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { token, password } = validatedFields.data;

    try {
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { gt: new Date() },
            },
        });

        if (!user) {
            return { success: false, message: 'Invalid or expired password reset token.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        return { success: true, message: 'Password has been reset successfully.' };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function loginWithWallet(prevState: any, formData: FormData) {
    const validatedFields = walletLoginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { publicKey, signature, challenge } = validatedFields.data;

    try {
        const { success, user } = await blockchainAuthService.verifySignature(publicKey, signature, challenge);

        if (!success || !user) {
            return { success: false, message: 'Wallet verification failed.' };
        }

        await createSession(user.id, user.role);

        // ✅ Use enum values and fix the switch logic
        switch(user.role) {
            case Role.ADMIN: 
                redirect('/dashboard/admin');
                break;
            case Role.CREATOR: 
                redirect('/dashboard/creator');
                break;
            case Role.ORGANIZER: 
                redirect('/dashboard/organizer');
                break;
            case Role.FAN: 
                redirect('/dashboard/fan');
                break;
            default: 
                redirect('/dashboard');
        }

    } catch (error) {
        console.error('Wallet login error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}