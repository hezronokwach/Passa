'use server';

import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function getMyTickets() {
  const session = await getSession();
  if (!session) {
    return redirect('/login');
  }

  const tickets = await prisma.purchasedTicket.findMany({
    where: { ownerId: session.userId },
    include: {
      event: true,
      ticket: true,
    },
  });

  return tickets;
}
