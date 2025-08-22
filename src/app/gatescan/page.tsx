'use client';

import { useState, useEffect, useRef } from 'react';
import { ClientHeader } from '@/components/passa/client-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, CheckCircle, XCircle, Users, Scan } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import jsQR from 'jsqr';

interface ScanResult {
  success: boolean;
  message: string;
  ticket?: {
    id: number;
    owner: { name: string; email: string };
  };
  event?: {
    title: string;
  };
}

export default function GateScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (qrCode) {
        await verifyTicket(qrCode.data);
      }
    } catch (error) {
      console.error('QR scan error:', error);
    }
  };

  const verifyTicket = async (qrData: string) => {
    try {
      const response = await fetch('/api/qr-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData })
      });

      const result = await response.json();
      setScanResult(result);
      
      if (result.success) {
        setScanCount(prev => prev + 1);
        toast({
          title: 'Valid Ticket',
          description: `Welcome ${result.ticket?.owner.name}!`
        });
      } else {
        toast({
          title: 'Invalid Ticket',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Scan Error',
        description: 'Failed to verify ticket. Please try again.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(scanQRCode, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <ClientHeader />
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="font-headline text-3xl font-bold">Gate Scanner</h1>
            <p className="text-muted-foreground">Scan tickets to verify entry</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Scanner Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="size-5" />
                  QR Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button onClick={startCamera} size="lg">
                        <Camera className="mr-2 size-4" />
                        Start Scanner
                      </Button>
                    </div>
                  )}

                  {isScanning && (
                    <div className="absolute inset-4 border-2 border-primary rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isScanning ? (
                    <Button onClick={startCamera} className="flex-1">
                      <Camera className="mr-2 size-4" />
                      Start Scanner
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="outline" className="flex-1">
                      Stop Scanner
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  Scan Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">Tickets Scanned</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {scanCount}
                  </Badge>
                </div>

                {scanResult && (
                  <div className={`p-4 rounded-lg border ${
                    scanResult.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {scanResult.success ? (
                        <CheckCircle className="size-5 text-green-600" />
                      ) : (
                        <XCircle className="size-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {scanResult.success ? 'Valid Ticket' : 'Invalid Ticket'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {scanResult.message}
                    </p>
                    {scanResult.ticket && (
                      <div className="text-sm">
                        <p><strong>Attendee:</strong> {scanResult.ticket.owner.name}</p>
                        <p><strong>Event:</strong> {scanResult.event?.title}</p>
                      </div>
                    )}
                  </div>
                )}

                {!scanResult && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scan className="size-12 mx-auto mb-2 opacity-50" />
                    <p>Scan a ticket to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}