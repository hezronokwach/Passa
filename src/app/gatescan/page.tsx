'use client';

import { useState, useEffect, useRef } from 'react';
import { ClientHeader } from '@/components/passa/client-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, CheckCircle, XCircle, Users, Scan } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import jsQR from 'jsqr';

interface Event {
  id: number;
  title: string;
  date: string;
}

interface TicketHolder {
  id: number;
  name: string | null;
  email: string;
  ticketType: string;
  isCheckedIn: boolean;
}

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
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketHolders, setTicketHolders] = useState<TicketHolder[]>([]);
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

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/organizer/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchTicketHolders = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/ticket-holders`);
      const data = await response.json();
      setTicketHolders(data.ticketHolders || []);
    } catch (error) {
      console.error('Failed to fetch ticket holders:', error);
    }
  };

  const verifyTicket = async (qrData: string) => {
    try {
      console.log('QR Data scanned:', qrData);
      
      const response = await fetch('/api/qr-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData })
      });

      const result = await response.json();
      console.log('API Response:', result);
      setScanResult(result);
      
      if (result.success) {
        setScanCount(prev => prev + 1);
        // Update ticket holders list to mark as checked in
        setTicketHolders(prev => prev.map(holder => 
          holder.email === result.ticket?.owner.email 
            ? { ...holder, isCheckedIn: true }
            : holder
        ));
        toast({
          title: 'Valid Ticket',
          description: `Welcome ${result.ticket?.owner.name || result.ticket?.owner.email}!`
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
    fetchEvents();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchTicketHolders(selectedEventId);
    }
  }, [selectedEventId]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <ClientHeader />
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="font-headline text-3xl font-bold">Gate Scanner</h1>
            <p className="text-muted-foreground">Select an event and scan tickets to verify entry</p>
            
            <div className="mt-4 max-w-md">
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event to scan for" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title} - {new Date(event.date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedEventId ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Scan className="size-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select an Event</h3>
                <p className="text-muted-foreground">Choose an event from the dropdown above to start scanning tickets.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
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
                        <p><strong>Attendee:</strong> {scanResult.ticket.owner.name || scanResult.ticket.owner.email}</p>
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

            {/* Ticket Holders List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  Ticket Holders ({ticketHolders.filter(h => h.isCheckedIn).length}/{ticketHolders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {ticketHolders.map((holder) => (
                    <div key={holder.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                      holder.isCheckedIn ? 'bg-green-50 border-green-200' : 'bg-background'
                    }`}>
                      <div className={holder.isCheckedIn ? 'line-through opacity-60' : ''}>
                        <p className="font-medium">{holder.name || holder.email}</p>
                        <p className="text-sm text-muted-foreground">{holder.ticketType}</p>
                      </div>
                      {holder.isCheckedIn && (
                        <CheckCircle className="size-5 text-green-600" />
                      )}
                    </div>
                  ))}
                  {ticketHolders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="size-12 mx-auto mb-2 opacity-50" />
                      <p>No ticket holders found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}