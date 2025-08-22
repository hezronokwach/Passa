import { NextRequest } from 'next/server';
import { QRVerificationService } from '@/lib/services/qr-verification-service';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { qrData } = await request.json();
    
    if (!qrData) {
      return Response.json({ error: 'QR data is required' }, { status: 400 });
    }

    // Verify and process the ticket scan
    const result = await QRVerificationService.scanTicket(qrData, session.userId);
    
    if (result.success) {
      return Response.json({
        success: true,
        message: result.message,
        ticket: result.ticket,
        event: result.event,
      });
    } else {
      return Response.json({
        success: false,
        message: result.message,
      }, { status: 400 });
    }

  } catch (error) {
    console.error('QR verification error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const type = searchParams.get('type') || 'scans';
    
    if (!eventId) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    if (type === 'attendance') {
      // Get attendance list for the event
      const attendance = await QRVerificationService.getEventAttendance(parseInt(eventId));
      return Response.json({ attendance });
    } else {
      // Get scan history for the event
      const scanHistory = await QRVerificationService.getEventScanHistory(parseInt(eventId));
      return Response.json({ scanHistory });
    }

  } catch (error) {
    console.error('Error fetching scan history:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}