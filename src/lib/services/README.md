# QR Code Service

A flexible QR code generation service for the Passa platform that can be used for tickets, backstage passes, event check-ins, and more.

## Features

- Generate QR codes as Data URLs, SVGs, or Buffers
- Support for custom options (size, colors, error correction)
- Generic service that can encode any string or JSON data
- Pre-built examples for common use cases:
  - Event tickets
  - Backstage passes
  - Event check-ins

## Installation

The service uses the `qrcode` package which has already been installed:

```bash
npm install qrcode
```

## Usage

### 1. Generic QR Code Service

```typescript
import { QRCodeService } from '@/lib/services/qr-code-service';

// Generate QR code for simple text
const qrCode = await QRCodeService.generateDataURL('Hello, Passa!');

// Generate QR code for JSON data
const eventData = {
  type: 'event',
  eventId: 123,
  eventName: 'Music Festival'
};
const qrCode = await QRCodeService.generateDataURL(eventData);

// Generate with custom options
const qrCode = await QRCodeService.generateDataURL('Hello, Passa!', {
  width: 400,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
});
```

### 2. Pre-built Examples

#### Ticket QR Codes

```typescript
import { TicketQRCodeGenerator } from '@/lib/services/qr-code-examples';

const ticket = {
  id: 123,
  eventId: 456,
  ownerId: 789,
  createdAt: new Date(),
  status: 'ACTIVE'
};

const qrCode = await TicketQRCodeGenerator.generate(ticket);
```

#### Backstage Pass QR Codes

```typescript
import { BackstagePassQRCodeGenerator } from '@/lib/services/qr-code-examples';

const passData = {
  passId: 123,
  eventId: 456,
  holderName: 'John Doe',
  accessLevel: 'VIP',
  validFrom: new Date().toISOString(),
  validTo: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};

const qrCode = await BackstagePassQRCodeGenerator.generate(passData);
```

### 3. Server Actions

```typescript
'use server';

import { QRCodeService } from '@/lib/services/qr-code-service';

export async function generateEventQRCode(eventId: number) {
  const qrCode = await QRCodeService.generateDataURL({
    type: 'event',
    eventId,
    timestamp: new Date().toISOString()
  });
  
  return qrCode;
}
```

### 4. API Route

POST `/api/qr-code`

```json
{
  "data": "Hello, Passa!",
  "options": {
    "width": 300,
    "margin": 1
  }
}
```

Response:
```json
{
  "qrCode": "data:image/png;base64,..."
}
```

## Error Handling

All methods throw errors that should be handled appropriately:

```typescript
try {
  const qrCode = await QRCodeService.generateDataURL(data);
} catch (error) {
  console.error('Failed to generate QR code:', error);
  // Handle error appropriately
}
```

## Customization

To create custom QR code generators for specific use cases:

```typescript
import { QRCodeService } from '@/lib/services/qr-code-service';

interface CustomQRData {
  type: 'custom';
  id: number;
  // ... other properties
}

export class CustomQRCodeGenerator {
  static async generate(data: Omit<CustomQRData, 'type'>): Promise<string> {
    const qrData: CustomQRData = {
      type: 'custom',
      ...data
    };

    return await QRCodeService.generateDataURL(qrData, {
      // Custom options
    });
  }
}
```