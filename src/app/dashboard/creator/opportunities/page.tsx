
import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Briefcase, DollarSign } from 'lucide-react';
import { OpportunityCard } from '@/components/passa/opportunity-card';
import type { Event } from '@prisma/client';

// The OpportunityCard expects a specific data structure. We define it here.
// This would typically be imported, but we define it here for clarity with hardcoded data.
interface TranslatedEvent extends Event {
  translatedTitle: string;
  price: number;
  currency: string;
  imageHint: string;
}

export default function OpportunitiesPage() {
    // Mock data shaped to fit the OpportunityCard component
    const events: TranslatedEvent[] = [
        {
            id: 'clxysp33s00001234abcd',
            title: 'Afrochella Festival 2025',
            translatedTitle: 'Afrochella Festival 2025',
            description: 'A celebration of African music, culture, and fashion.',
            imageUrl: '/passa-africantenge.webp',
            date: new Date('2025-12-28T12:00:00Z'),
            location: 'Accra, Ghana',
            organizerId: 'org_123',
            price: 75,
            currency: 'USD',
            imageHint: 'A vibrant, colorful photo of a crowd dancing at a music festival under the sun.',
            createdAt: new Date(),
            updatedAt: new Date(),
            venue: 'El Wak Stadium',
            startTime: '12:00',
            endTime: '23:00',
            category: 'Music Festival',
            status: 'PUBLISHED',
            capacity: 20000,
        },
        {
            id: 'clxysp33s00011234bcde',
            title: 'Lagos Art & Culture Expo',
            translatedTitle: 'Lagos Art & Culture Expo',
            description: 'Showcasing the best of contemporary and traditional Nigerian art.',
            imageUrl: '/logo.png', // Placeholder image
            date: new Date('2025-11-10T10:00:00Z'),
            location: 'Lagos, Nigeria',
            organizerId: 'org_456',
            price: 25,
            currency: 'USD',
            imageHint: 'A sophisticated gallery setting with diverse African art on display.',
            createdAt: new Date(),
            updatedAt: new Date(),
            venue: 'Eko Convention Centre',
            startTime: '10:00',
            endTime: '20:00',
            category: 'Art Exhibition',
            status: 'PUBLISHED',
            capacity: 5000,
        },
        {
            id: 'clxysp33s00021234bcde',
            title: 'Cape Town Food & Wine Festival',
            translatedTitle: 'Cape Town Food & Wine Festival',
            description: 'Experience the finest culinary delights and wines from the Western Cape.',
            imageUrl: '/passa-africantenge.webp', // Placeholder image
            date: new Date('2026-02-20T11:00:00Z'),
            location: 'Cape Town, South Africa',
            organizerId: 'org_789',
            price: 120,
            currency: 'ZAR',
            imageHint: 'A close-up shot of a gourmet dish with a glass of wine in a scenic vineyard background.',
            createdAt: new Date(),
            updatedAt: new Date(),
            venue: 'Cape Town International Convention Centre',
            startTime: '11:00',
            endTime: '21:00',
            category: 'Food & Drink',
            status: 'PUBLISHED',
            capacity: 8000,
        }
    ];

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                         <h1 className="font-headline text-4xl font-bold md:text-5xl">
                           Find Your Next Creative Gig
                         </h1>
                         <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            Browse opportunities from top event organizers and apply your skills to the most exciting events in Africa.
                         </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <Card className="p-4 mb-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search by title or keyword..." className="pl-10" />
                            </div>
                            <Select>
                                <SelectTrigger>
                                    <Briefcase className="mr-2 text-muted-foreground"/>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="music">Music</SelectItem>
                                    <SelectItem value="art">Art & Culture</SelectItem>
                                    <SelectItem value="food">Food & Drink</SelectItem>
                                    <SelectItem value="tech">Tech & Innovation</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <DollarSign className="mr-2 text-muted-foreground"/>
                                    <SelectValue placeholder="Any Budget" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<50">$50 or less</SelectItem>
                                    <SelectItem value="50-100">$50 - $100</SelectItem>
                                    <SelectItem value=">100">$100 or more</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="font-bold w-full">Search</Button>
                        </div>
                    </Card>

                    {/* Opportunities Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map(event => (
                            <OpportunityCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
