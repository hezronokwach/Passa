
import Image from 'next/image';
import { Button } from '../ui/button';
import { Barcode } from './barcode';
import { CheckCircle, Ticket, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Event } from '@prisma/client';

interface TicketStubProps {
    event: Event & { translatedTitle: string; price: number; currency: string; imageHint?: string; };
    onPurchase?: () => void;
    onViewTicket?: () => void;
    isPurchasing?: boolean;
    isSuccess?: boolean;
    isPurchased?: boolean;
    qrCode?: string;
    ownerName?: string;
}

export const TicketStub = ({ event, onPurchase, onViewTicket, isPurchasing, isSuccess, isPurchased = false, qrCode, ownerName }: TicketStubProps) => {
    return (
        <div className={cn(
            "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-2xl overflow-hidden font-sans transition-all duration-500 max-w-sm mx-auto",
            isSuccess && "rotate-[15deg] scale-110"
        )}>
            {/* Top Section */}
            <div className="p-6 relative">
                {isSuccess && (
                    <div className="absolute inset-0 bg-green-500/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white p-4">
                        <CheckCircle className="size-16 mb-4"/>
                        <h3 className="text-2xl font-bold">Ticket Secured!</h3>
                        <p className="text-center">Your ticket has been sent to your wallet.</p>
                    </div>
                )}
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-white/80 text-sm font-medium">PASSA</p>
                        <p className="text-white/60 text-xs">Digital Ticket</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/80 text-sm">${event.price}</p>
                        <p className="text-white/60 text-xs">{event.currency}</p>
                    </div>
                </div>

                {/* Event Image */}
                <div className="relative h-32 w-full rounded-lg overflow-hidden mb-4">
                    <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="400px"
                    />
                </div>

                {/* Event Info */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">{event.translatedTitle}</h2>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-white/60 text-xs uppercase tracking-wide">Date</p>
                            <p className="text-white/90">
                                {new Date(event.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        
                        <div>
                            <p className="text-white/60 text-xs uppercase tracking-wide">Time</p>
                            <p className="text-white/90">
                                {new Date(event.date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        
                        <div>
                            <p className="text-white/60 text-xs uppercase tracking-wide">Location</p>
                            <p className="text-white/90">{event.location}</p>
                        </div>
                        
                        {ownerName && (
                            <div>
                                <p className="text-white/60 text-xs uppercase tracking-wide">Attendee</p>
                                <p className="text-white/90 font-medium">{ownerName}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Perforated Line */}
            <div className="relative">
                <div className="border-t-2 border-dashed border-white/30" />
                <div className="absolute -left-4 top-0 w-8 h-8 bg-secondary rounded-full transform -translate-y-1/2" />
                <div className="absolute -right-4 top-0 w-8 h-8 bg-secondary rounded-full transform -translate-y-1/2" />
            </div>

            {/* Bottom Section */}
            <div className="p-6 bg-white/10 backdrop-blur-sm">
                {qrCode ? (
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-xl mb-3">
                            <img src={qrCode} alt="Ticket QR Code" className="w-32 h-32" />
                        </div>
                        <p className="text-white/80 text-xs text-center">Scan at entrance</p>
                    </div>
                ) : (
                    !isPurchased && (
                        <Button 
                            className="w-full font-bold bg-white text-purple-600 hover:bg-white/90"
                            onClick={onPurchase}
                            disabled={isPurchasing || isSuccess}
                        >
                            {isPurchasing ? 'Processing...' : (
                                <>
                                    <Ticket className="mr-2 size-4"/> Buy Ticket
                                </>
                            )}
                        </Button>
                    )
                )}
            </div>
        </div>
    )
}
