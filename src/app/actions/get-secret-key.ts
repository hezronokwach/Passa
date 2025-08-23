'use server';

import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function getSecretKey() {
  const session = await getSession();
  if (!session) {
    return redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { walletSecretKey: true },
  });

  if (!user) {
    return { error: 'User not found' };
  }

  return { secretKey: user.walletSecretKey };
}
