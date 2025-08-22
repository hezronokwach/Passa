import prisma from '@/lib/db';
import { SecureQRService, type TicketVerificationResult } from './secure-qr-service';

export interface TicketScanResult {
  success: boolean;
  message: string;
  ticket?: {
    id: number;
    eventId: number;
    ownerId: number;
    status: string;
  };
  event?: {
    id: number;
    title: string;
    date: Date;
  };
}

export class QRVerificationService {
  /**
   * Verify and process ticket scan
   */
  static async scanTicket(qrDataString: string, scannerId: number): Promise<TicketScanResult> {
    // First verify the QR code cryptographically
    const verification: TicketVerificationResult = await SecureQRService.verifyQRCode(qrDataString);
    
    if (!verification.isValid) {
      return {
        success: false,
        message: verification.error || 'Invalid QR code',
      };
    }

    if (verification.isExpired) {
      return {
        success: false,
        message: 'QR code has expired',
      };
    }

    try {
      // Get ticket from database
      const ticket = await prisma.purchasedTicket.findUnique({
        where: { id: verification.ticketId },
        include: {
          event: {
            select: { id: true, title: true, date: true }
          }
        }
      });

      if (!ticket) {
        return {
          success: false,
          message: 'Ticket not found',
        };
      }

      // Check if ticket is already used
      if (ticket.status === 'USED') {
        return {
          success: false,
          message: 'Ticket already used',
        };
      }

      // Check if ticket is valid
      if (ticket.status !== 'VALID') {
        return {
          success: false,
          message: 'Ticket is not valid',
        };
      }

      // Use transaction to ensure atomicity
      await prisma.$transaction(async (tx) => {
        // Mark ticket as used
        await tx.purchasedTicket.update({
          where: { id: ticket.id },
          data: { status: 'USED' }
        });

        // Log the scan (create scan record)
        await tx.ticketScan.create({
          data: {
            ticketId: ticket.id,
            scannerId,
            scannedAt: new Date(),
          }
        });

        // Add user to event attendance
        await tx.eventAttendance.upsert({
          where: {
            ticketId: ticket.id
          },
          update: {},
          create: {
            eventId: ticket.eventId,
            userId: ticket.ownerId,
            ticketId: ticket.id,
          }
        });
      });

      // Mark token as used to prevent reuse
      try {
        const qrData = JSON.parse(qrDataString);
        if (qrData.token) {
          await SecureQRService.markTokenAsUsed(qrData.token);
        }
      } catch (parseError) {
        console.error('Error parsing QR data for token removal:', parseError);
        // Continue as the ticket has already been marked as used
      }

      return {
        success: true,
        message: 'Ticket verified successfully',
        ticket: {
          id: ticket.id,
          eventId: ticket.eventId,
          ownerId: ticket.ownerId,
          status: 'USED',
        },
        event: ticket.event,
      };

    } catch (error) {
      console.error('Error scanning ticket:', error);
      return {
        success: false,
        message: 'Database error during verification',
      };
    }
  }

  /**
   * Get scan history for an event
   */
  static async getEventScanHistory(eventId: number) {
    return await prisma.ticketScan.findMany({
      where: {
        ticket: {
          eventId: eventId
        }
      },
      include: {
        ticket: {
          include: {
            owner: {
              select: { name: true, email: true }
            }
          }
        },
        scanner: {
          select: { name: true }
        }
      },
      orderBy: {
        scannedAt: 'desc'
      }
    });
  }

  /**
   * Get event attendance list
   */
  static async getEventAttendance(eventId: number) {
    return await prisma.eventAttendance.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        ticket: {
          include: {
            ticket: {
              select: { name: true, price: true }
            }
          }
        }
      },
      orderBy: {
        checkedInAt: 'desc'
      }
    });
  }
}