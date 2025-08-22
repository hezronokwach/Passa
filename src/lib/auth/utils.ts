import crypto from 'crypto';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';

/**
 * Generates a unique token and stores it in the database.
 * @param email - The email of the user to associate the token with.
 * @param tokenType - The type of token to generate ('verification' or 'passwordReset').
 * @returns The generated token.
 */
async function generateToken(
  email: string,
  tokenType: 'plain' | 'verification' | 'passwordReset'
): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

  const user = await prisma.user.findUnique({ where: { email } });

  if(tokenType == 'verification' && user) {
      await prisma.user.update({
        where: { email },
        data: { verificationToken: token },
      });
  } else if(tokenType == 'passwordReset' && user) {
      await prisma.user.update({
        where: { email },
        data: {
          passwordResetToken: token,
          passwordResetExpires: expires,
        },
      });
  } else if (tokenType == 'plain') {
    // does not require a user to be present
  }

  return token;
}

export async function generateEmailVerificationToken(email: string) {
  return generateToken(email, 'plain');
}

export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  });

  return token;
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session?.userId) {
      // This should not happen for protected routes,
      // but it's a safeguard.
      throw new Error('Unauthenticated: No active session found.');
    }
  
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
  
    if (!user) {
      // This case might happen if the user has been deleted
      // but the session cookie still exists.
      throw new Error('User not found.');
    }
  
    return user;
}

export async function getCurrentUserWithProfile() {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('Unauthenticated: No active session found.');
    }
  
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        creatorProfile: true,
        organizerProfile: true,
      }
    });
  
    if (!user) {
      throw new Error('User not found.');
    }
  
    return user;
}

export async function getCurrentUserWithCreatorProfileAndPortfolio() {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error('Unauthenticated: No active session found.');
    }
  
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        creatorProfile: {
            include: {
                portfolio: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        }
      }
    });
  
    if (!user) {
      throw new Error('User not found.');
    }
  
    return user;
}