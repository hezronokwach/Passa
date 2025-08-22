import { QRCodeService } from './qr-code-service';
import { QRSecurityService } from './qr-security';
import { QRTokenStorage } from './qr-token-storage';
import type { PurchasedTicket } from '@prisma/client';

export interface SecureTicketQRData {
  type: 'secure-ticket';
  token: string;
  eventId: number;
  expiresAt: string;
  signature: string;
}

export interface TicketVerificationResult {
  isValid: boolean;
  isExpired: boolean;
  ticketId?: number;
  eventId?: number;
  ownerId?: number;
  error?: string;
}

export class SecureQRService {
  /**
   * Generate secure QR code for ticket
   */
  static async generateSecureTicketQR(
    ticket: PurchasedTicket,
    options?: { width?: number; margin?: number; expirationHours?: number }
  ): Promise<string> {
    // Set expiration (default 24 hours)
    const expiresAt = QRSecurityService.generateExpiration(options?.expirationHours || 24);
    
    // Generate secure token instead of exposing sensitive data
    const token = QRSecurityService.generateTicketToken(ticket.id, ticket.eventId, ticket.ownerId);
    
    // Store token for verification with matching expiration
    const expirationDate = new Date(expiresAt);
    await QRTokenStorage.storeToken(token, ticket.id, ticket.eventId, ticket.ownerId, expirationDate);
    
    // Create QR data without sensitive information
    const qrData: Omit<SecureTicketQRData, 'signature'> = {
      type: 'secure-ticket',
      token,
      eventId: ticket.eventId,
      expiresAt,
    };
    
    // Create signature
    const dataToSign = JSON.stringify(qrData);
    const signature = QRSecurityService.signQRData(dataToSign);
    
    const secureQRData: SecureTicketQRData = {
      ...qrData,
      signature,
    };

    return await QRCodeService.generateDataURL(secureQRData, {
      width: options?.width || 300,
      margin: options?.margin || 1,
      errorCorrectionLevel: 'H',
    });
  }



  /**
   * Verify QR code data
   */
  static async verifyQRCode(qrDataString: string): Promise<TicketVerificationResult> {
    try {
      const qrData = JSON.parse(qrDataString) as SecureTicketQRData;
      
      // Check if it's a secure ticket
      if (qrData.type !== 'secure-ticket') {
        return { isValid: false, isExpired: false, error: 'Invalid QR code type' };
      }

      // Verify signature
      const { signature, ...dataToVerify } = qrData;
      const dataToSign = JSON.stringify(dataToVerify);
      
      if (!QRSecurityService.verifySignature(dataToSign, signature)) {
        return { isValid: false, isExpired: false, error: 'Invalid signature' };
      }

      // Check expiration
      const isExpired = QRSecurityService.isExpired(qrData.expiresAt);
      if (isExpired) {
        return { isValid: false, isExpired: true, error: 'QR code expired' };
      }

      // Verify token exists in database
      const tokenData = await QRTokenStorage.getToken(qrData.token);
      if (!tokenData) {
        return { isValid: false, isExpired: false, error: 'Invalid token' };
      }

      // Verify event ID matches
      if (tokenData.eventId !== qrData.eventId) {
        return { isValid: false, isExpired: false, error: 'Event ID mismatch' };
      }

      return {
        isValid: true,
        isExpired: false,
        ticketId: tokenData.ticketId,
        eventId: tokenData.eventId,
        ownerId: tokenData.ownerId,
      };

    } catch (error) {
      return { isValid: false, isExpired: false, error: 'Invalid QR code format' };
    }
  }

  /**
   * Mark token as used (prevent reuse)
   */
  static async markTokenAsUsed(token: string): Promise<boolean> {
    return await QRTokenStorage.markTokenAsUsed(token);
  }
}