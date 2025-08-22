'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { generateEmailVerificationToken, generatePasswordResetToken } from '@/lib/auth/utils';
import { blockchainAuthService } from '@/lib/auth/blockchain';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email/service';

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

// Role → dashboard path mapping
const rolePaths: Record<string, string> = {
    [Role.ADMIN]: '/dashboard/admin',
    [Role.CREATOR]: '/dashboard/creator',
    [Role.ORGANIZER]: '/dashboard/organizer',
    [Role.FAN]: '/dashboard/fan',
};


export async function signup(prevState: unknown, formData: FormData) {
  try {
    const validatedFields = signupSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
      return { 
        success: false, 
        message: 'Invalid form data.', 
        errors: validatedFields.error.flatten().fieldErrors 
      };
    }

    const { email, password, role } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { 
        success: false, 
        message: 'User with this email already exists.',
        errors: { email: ['This email is already registered. Please use a different email or sign in.'] }
      };
    }

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

    // Send verification email
    try {
      await sendVerificationEmail(email, result.verificationToken!);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email sending fails
    }

    await createSession(result.id, result.role);

    return { 
      success: true, 
      message: 'Account created successfully! Please check your email to verify your account.',
      redirect: rolePaths[role] || '/dashboard' 
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      message: `Signup failed: ${(error as Error).message}` 
    };
  }
}

export async function login(prevState: unknown, formData: FormData) {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Invalid form data',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, role: true, password: true }, // only fetch what you need
        });

        if (!user?.password) {
            return { 
                success: false, 
                message: 'Invalid email or password.',
                errors: { email: ['No account found with this email address.'] }
            };
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return { 
                success: false, 
                message: 'Invalid email or password.',
                errors: { password: ['Incorrect password. Please try again.'] }
            };
        }

        await createSession(user.id, user.role);

        return { 
          success: true, 
          message: 'Login successful!',
          role: user.role,
          redirect: rolePaths[user.role] || '/dashboard' 
        };

    } catch (error) {
        console.error("Login error:", error);
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

export async function forgotPassword(prevState: unknown, formData: FormData) {
    const validatedFields = forgotPasswordSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const resetToken = await generatePasswordResetToken(email);
            try {
                await sendPasswordResetEmail(email, resetToken);
            } catch (emailError) {
                console.error('Failed to send password reset email:', emailError);
                // Continue with the flow even if email sending fails
            }
        }

        return { success: true, message: 'If a user with that email exists, a password reset link has been sent.' };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function resetPassword(prevState: unknown, formData: FormData) {
    const validatedFields = resetPasswordSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { token, password } = validatedFields.data;

    try {
        const providedHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: providedHash,
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

export async function loginWithWallet(prevState: unknown, formData: FormData) {
    try {
        const validatedFields = walletLoginSchema.safeParse(Object.fromEntries(formData));

        if (!validatedFields.success) {
            return { success: false, message: 'Invalid form data', errors: validatedFields.error.flatten().fieldErrors };
        }

        const { publicKey, signature, challenge } = validatedFields.data;
        const { success, user } = await blockchainAuthService.verifySignature(publicKey, signature, challenge);

        if (!success || !user) {
            return { success: false, message: 'Wallet verification failed.' };
        }

        await createSession(user.id, user.role);

        return { 
          success: true, 
          message: 'Account created successfully!',
          redirect: rolePaths[user.role] || '/dashboard' 
        };
    } catch (error) {
        if ((error as Error & { digest?: string })?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
        console.error('Wallet login error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function logout() {
    try {
        await deleteSession();
    } catch (error) {
        console.error('Logout error:', error);
    }
    redirect('/login');
}
