'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { walletService } from '@/lib/services/wallet-service';
import { revalidatePath } from 'next/cache';

export async function regenerateWallet(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  try {
    const result = await walletService.createUserWallet(session.userId);
    
    if (result.success) {
      revalidatePath('/dashboard');
      return {
        success: true,
        message: 'New wallet generated successfully!',
        wallet: {
          publicKey: result.publicKey,
          secretKey: result.secretKey
        },
        errors: {}
      };
    } else {
      return {
        success: false,
        message: 'Failed to generate new wallet.',
        errors: {}
      };
    }
  } catch (error) {
    console.error('Wallet regeneration error:', error);
    return {
      success: false,
      message: 'Failed to regenerate wallet.',
      errors: {}
    };
  }
}

export async function fundAccount(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { walletAddress: true }
    });

    if (!user?.walletAddress) {
      return { success: false, message: 'No wallet found' };
    }

    const fundResult = await walletService.fundTestnetAccount(user.walletAddress);
    return fundResult;
  } catch (error) {
    console.error('Funding error:', error);
    return { success: false, message: 'Failed to fund account' };
  }
}

export async function getWalletBalance() {
  const session = await getSession();
  if (!session) redirect('/login');

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { walletAddress: true }
    });

    if (!user?.walletAddress) {
      return { success: false, message: 'No wallet found' };
    }

    const result = await walletService.getAccountBalance(user.walletAddress);
    return result;
  } catch (error) {
    console.error('Balance check error:', error);
    return { success: false, error };
  }
}