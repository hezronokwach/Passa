import crypto from 'crypto';

export class QRSecurityService {
  private static readonly SECRET_KEY = process.env.QR_SECRET_KEY || 'default-secret-key-change-in-production';
  private static readonly ALGORITHM = 'sha256';

  /**
   * Generate a secure token for a ticket
   */
  static generateTicketToken(ticketId: number, eventId: number, ownerId: number): string {
    const data = `${ticketId}-${eventId}-${ownerId}-${Date.now()}`;
    return crypto.createHash(this.ALGORITHM).update(data + this.SECRET_KEY).digest('hex');
  }

  /**
   * Create cryptographic signature for QR data
   */
  static signQRData(data: string): string {
    return crypto.createHmac(this.ALGORITHM, this.SECRET_KEY).update(data).digest('hex');
  }

  /**
   * Verify cryptographic signature
   */
  static verifySignature(data: string, signature: string): boolean {
    const expectedSignature = this.signQRData(data);
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  }

  /**
   * Check if timestamp is expired
   */
  static isExpired(expiresAt: string): boolean {
    return new Date() > new Date(expiresAt);
  }

  /**
   * Generate expiration timestamp (24 hours from now by default)
   */
  static generateExpiration(hoursFromNow: number = 24): string {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + hoursFromNow);
    return expiration.toISOString();
  }
}