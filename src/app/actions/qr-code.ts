'use server';

import { SecureQRService } from '@/lib/services/secure-qr-service';
import type { PurchasedTicket } from '@prisma/client';

export async function generateTicketQRCode(ticket: PurchasedTicket): Promise<string> {
  // Generate secure QR code with cryptographic signature and expiration
  return await SecureQRService.generateSecureTicketQR(ticket, {
    width: 300,
    margin: 1,
    expirationHours: 24, // QR code expires in 24 hours
  });
}