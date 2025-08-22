import prisma from '@/lib/db';

export interface TokenData {
  ticketId: number;
  eventId: number;
  ownerId: number;
  createdAt: Date;
}

export class QRTokenStorage {
  /**
   * Store token in database for verification
   */
  static async storeToken(
    token: string,
    ticketId: number,
    eventId: number,
    ownerId: number,
    expiresAt: Date
  ): Promise<void> {
    await prisma.qRToken.create({
      data: {
        token,
        ticketId,
        eventId,
        ownerId,
        expiresAt,
      }
    });
  }

  /**
   * Get token data from database
   */
  static async getToken(token: string): Promise<TokenData | null> {
    const tokenRecord = await prisma.qRToken.findUnique({
      where: { token }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return null;
    }

    return {
      ticketId: tokenRecord.ticketId,
      eventId: tokenRecord.eventId,
      ownerId: tokenRecord.ownerId,
      createdAt: tokenRecord.createdAt,
    };
  }

  /**
   * Mark token as used (delete from database)
   */
  static async markTokenAsUsed(token: string): Promise<boolean> {
    try {
      await prisma.qRToken.delete({
        where: { token }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clean up expired tokens (should be run periodically)
   */
  static async cleanupExpiredTokens(): Promise<number> {
    const result = await prisma.qRToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    return result.count;
  }
}