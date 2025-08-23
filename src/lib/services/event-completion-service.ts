import prisma from '@/lib/db';
import { sorobanService } from './soroban-service';

export class EventCompletionService {
  /**
   * Process automatic payments after event completion
   */
  async processEventCompletion(eventId: number) {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          artistInvitations: {
            where: { status: 'ACCEPTED' },
            include: { artist: true }
          },
          organizer: true
        }
      });

      if (!event || !event.contractAgreementId) {
        throw new Error('Event or contract not found');
      }

      // Check if event date has passed
      const now = new Date();
      if (event.date > now) {
        throw new Error('Event has not completed yet');
      }

      // Release all artist payments via smart contract
      if (event.organizer?.walletAddress) {
        // Skip contract payment release - organizer secret key needed
        console.log('Contract payment release skipped - organizer secret key required');
        const releaseResult = { success: false, message: 'Organizer secret key required' };

        if (releaseResult.success) {
          // Update all accepted invitations to indicate payment sent
          await prisma.artistInvitation.updateMany({
            where: {
              eventId: eventId,
              status: 'ACCEPTED'
            },
            data: {
              artistComments: 'Fixed payment automatically released via smart contract'
            }
          });

          console.log(`Released fixed payments to ${event.artistInvitations.length} artists via contract`);
        } else {
          throw new Error(`Contract payment release failed: ${releaseResult.message}`);
        }
      }

      return {
        success: true,
        message: 'Event completion processed successfully'
      };
    } catch (error) {
      console.error('Event completion processing failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Processing failed'
      };
    }
  }

  /**
   * Check for events that need completion processing
   */
  async checkCompletedEvents() {
    const now = new Date();
    const completedEvents = await prisma.event.findMany({
      where: {
        date: { lt: now },
        contractAgreementId: { not: null },
        // Could add a 'processed' field to avoid reprocessing
      },
      include: {
        artistInvitations: {
          where: { status: 'ACCEPTED' }
        }
      }
    });

    for (const event of completedEvents) {
      await this.processEventCompletion(event.id);
    }
  }
}

export const eventCompletionService = new EventCompletionService();