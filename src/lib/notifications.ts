import prisma from '@/lib/db';

export async function createNotification({
  userId,
  type,
  title,
  message,
  data = {}
}: {
  userId: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
      }
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

export const NotificationTypes = {
  ARTIST_INVITATION: 'ARTIST_INVITATION',
  INVITATION_RESPONSE: 'INVITATION_RESPONSE',
  ARTIST_APPLICATION: 'ARTIST_APPLICATION',
  EVENT_PUBLISHED: 'EVENT_PUBLISHED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
} as const;