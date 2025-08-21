import { QRCodeService } from './qr-code-service';
import type { PurchasedTicket } from '@prisma/client';

// Example 1: Ticket QR Code
export interface TicketQRData {
  type: 'ticket';
  ticketId: number;
  eventId: number;
  ownerId: number;
  createdAt: string;
  status: string;
}

export class TicketQRCodeGenerator {
  static async generate(ticket: PurchasedTicket, options?: { width?: number; margin?: number }): Promise<string> {
    const qrData: TicketQRData = {
      type: 'ticket',
      ticketId: ticket.id,
      eventId: ticket.eventId,
      ownerId: ticket.ownerId,
      createdAt: ticket.createdAt.toISOString(),
      status: ticket.status,
    };

    return await QRCodeService.generateDataURL(qrData, {
      width: options?.width || 300,
      margin: options?.margin || 1,
      errorCorrectionLevel: 'H', // High error correction for tickets
    });
  }
}

// Example 2: Backstage Pass QR Code
export interface BackstagePassQRData {
  type: 'backstage-pass';
  passId: number;
  eventId: number;
  holderName: string;
  accessLevel: string;
  validFrom: string;
  validTo: string;
}

export class BackstagePassQRCodeGenerator {
  static async generate(
    passData: Omit<BackstagePassQRData, 'type'>,
    options?: { width?: number; margin?: number }
  ): Promise<string> {
    const qrData: BackstagePassQRData = {
      type: 'backstage-pass',
      ...passData,
    };

    return await QRCodeService.generateDataURL(qrData, {
      width: options?.width || 300,
      margin: options?.margin || 1,
      errorCorrectionLevel: 'H', // High error correction for important passes
    });
  }
}

// Example 3: Event Check-in QR Code
export interface EventCheckInQRData {
  type: 'event-checkin';
  eventId: number;
  eventName: string;
  checkInLocation: string;
  timestamp: string;
}

export class EventCheckInQRCodeGenerator {
  static async generate(
    checkInData: Omit<EventCheckInQRData, 'type' | 'timestamp'>,
    options?: { width?: number; margin?: number }
  ): Promise<string> {
    const qrData: EventCheckInQRData = {
      type: 'event-checkin',
      ...checkInData,
      timestamp: new Date().toISOString(),
    };

    return await QRCodeService.generateDataURL(qrData, {
      width: options?.width || 200,
      margin: options?.margin || 1,
      errorCorrectionLevel: 'M', // Medium error correction for check-ins
    });
  }
}