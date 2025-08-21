
import Image from 'next/image';
import { Button } from '../ui/button';
import { Barcode } from './barcode';
import { CheckCircle, Ticket, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Event } from '@prisma/client';

interface TicketStubProps {
    event: Event & { translatedTitle: string; price: number; currency: string; imageHint?: string; };
    onPurchase?: () => void;
    isPurchasing?: boolean;
    isSuccess?: boolean;
    isPurchased?: boolean;
    qrCode?: string; // Add QR code as a prop
}

export const TicketStub = ({ event, onPurchase, isPurchasing, isSuccess, isPurchased = false, qrCode }: TicketStubProps) => {
    return (
        <div className={cn(
            "bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden font-sans transition-all duration-500",
            isSuccess && "rotate-[15deg] scale-110"
        )}>
            <div className="p-6 relative">
                 {isSuccess && (
                    <div className="absolute inset-0 bg-green-500/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-primary-foreground p-4">
                        <CheckCircle className="size-16 mb-4"/>
                        <h3 className="text-2xl font-bold">Ticket Secured!</h3>
                        <p className="text-center">Your ticket has been sent to your wallet.</p>
                    </div>
                 )}
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">You're invited to</p>
                    <h2 className="text-2xl font-bold font-headline">{event.translatedTitle}</h2>
                </div>
                <div className="relative h-48 w-full rounded-md overflow-hidden mb-4 border">
                    <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="400px"
                        data-ai-hint={event.imageHint}
                    />
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div>
                        <p className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-muted-foreground">{event.location}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-bold text-lg text-primary">${event.price}</p>
                    </div>
                </div>
                
                {/* QR Code Display */}
                {qrCode && (
                    <div className="mt-4 flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-2">Your Ticket QR Code</p>
                        <div className="bg-white p-2 rounded-lg">
                            <img src={qrCode} alt="Ticket QR Code" className="w-32 h-32" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Show this QR code at the entrance for entry
                        </p>
                    </div>
                )}
            </div>
            <div className="border-t-2 border-dashed border-border" />
            <div className="p-4 bg-muted/50 flex items-center justify-between gap-4">
                <div className='w-24 text-muted-foreground'>
                    <Barcode />
                </div>
                <Button 
                    className="w-full font-bold"
                    onClick={onPurchase}
                    disabled={isPurchasing || isSuccess || isPurchased}
                >
                    {isPurchased ? (
                        <>
                            <QrCode className="mr-2" /> View Ticket
                        </>
                    ) : isPurchasing ? 'Processing...' : (
                        <>
                            <Ticket className="mr-2"/> Buy Ticket
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
