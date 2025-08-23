'use client';

import { purchaseTicket } from '@/app/actions/fan';

export async function handleTicketPurchase(
  eventId: number, 
  ticketId: number, 
  buyerSecretKey: string
) {
  try {
    const result = await purchaseTicket({
      eventId,
      ticketId,
      buyerSecretKey
    });
    return result;
  } catch (error) {
    console.error('Purchase error:', error);
    return {
      success: false,
      message: 'Failed to process purchase'
    };
  }
}