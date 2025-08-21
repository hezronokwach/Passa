'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Download, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { QRCodeService } from '@/lib/services/qr-code-service';

export default function QRCodeDemoPage() {
  const { toast } = useToast();
  const [text, setText] = useState('Hello, Passa!');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateQRCode = async () => {
    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to generate a QR code',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const qrCodeData = await QRCodeService.generateDataURL(text);
      setQrCode(qrCodeData);
      
      toast({
        title: 'Success',
        description: 'QR code generated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      });
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      toast({
        title: 'Copied',
        description: 'QR code data copied to clipboard',
      });
    }
  };

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Generate QR codes for any text or data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text">Text to encode</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to encode in QR code"
              />
            </div>
            
            <Button 
              onClick={generateQRCode} 
              disabled={isLoading}
              className="w-full"
            >
              <QrCode className="mr-2 size-4" />
              {isLoading ? 'Generating...' : 'Generate QR Code'}
            </Button>
            
            {qrCode && (
              <div className="flex flex-col items-center space-y-4">
                <Image 
                  src={qrCode} 
                  alt="Generated QR Code" 
                  width={256}
                  height={256}
                  className="border rounded-lg p-4"
                />
                
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline">
                    <Copy className="mr-2 size-4" />
                    Copy Data
                  </Button>
                  <Button onClick={downloadQRCode}>
                    <Download className="mr-2 size-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>How to use the QR code service in your application</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="client">
            <TabsList>
              <TabsTrigger value="client">Client Component</TabsTrigger>
              <TabsTrigger value="server">Server Action</TabsTrigger>
              <TabsTrigger value="api">API Route</TabsTrigger>
            </TabsList>
            
            <TabsContent value="client" className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {`import { QRCodeService } from '@/lib/services/qr-code-service';

// Generate QR code as Data URL
const qrCode = await QRCodeService.generateDataURL('Hello, Passa!');

// Generate QR code with options
const qrCodeWithOptions = await QRCodeService.generateDataURL(
  { eventId: 123, ticketId: 456 },
  { width: 400, margin: 2 }
);`}
              </pre>
            </TabsContent>
            
            <TabsContent value="server" className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {`'use server';

import { QRCodeService } from '@/lib/services/qr-code-service';

export async function generateEventQRCode(eventId: number) {
  const qrCode = await QRCodeService.generateDataURL({
    type: 'event',
    eventId,
    timestamp: new Date().toISOString()
  });
  
  return qrCode;
}`}
              </pre>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {`// POST /api/qr-code
{
  "data": "Hello, Passa!",
  "options": {
    "width": 300,
    "margin": 1
  }
}`}
              </pre>
              <p className="text-sm text-muted-foreground">
                Response: {`{ "qrCode": "data:image/png;base64,..." }`}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}