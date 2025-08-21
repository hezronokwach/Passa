import { QRCodeService } from '@/lib/services/qr-code-service';

export async function GET() {
  try {
    // Test generating a simple QR code
    const testQR = await QRCodeService.generateDataURL('Test QR Code');
    
    return new Response(JSON.stringify({ success: true, qrCode: testQR }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to generate QR code' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}