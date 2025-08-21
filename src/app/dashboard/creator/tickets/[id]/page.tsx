
import { Header } from '@/components/passa/header';
import { TicketStub } from '@/components/passa/ticket-stub';
import { applications, opportunities } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

// In a real app, this would be a database query.
async function getTicketData(id: string) {
  const application = applications.find(app => app.id === id);

  // Only approved applications get tickets.
  if (!application || application.status !== 'Approved') {
    return null;
  }

  // Find the original opportunity to get more details.
  const opportunity = opportunities.find(op => op.title === application.opportunityTitle);

  if (!opportunity) {
    return null;
  }

  // Adapt the opportunity data to the shape the TicketStub component expects.
  const ticketEventData = {
    id: opportunity.id.toString(),
    title: opportunity.title,
    translatedTitle: opportunity.title, // Assuming no translation for now
    description: opportunity.description,
    // These fields are not in the opportunity data, so we'll use placeholders.
    imageUrl: '/passa-africantenge.webp', 
    date: new Date('2025-10-26T10:00:00Z'), // Placeholder date
    location: 'Venue To Be Confirmed', // Placeholder location
    price: opportunity.budget, // Using budget as the "price"
    currency: 'USD',
    imageHint: 'An image related to the event',
    // Dummy data for fields required by Prisma types but not used in the stub
    organizerId: 'org_abc',
    createdAt: new Date(),
    updatedAt: new Date(),
    venue: 'TBC',
    startTime: '18:00',
    endTime: '23:00',
    category: 'Special Event',
    status: 'PUBLISHED',
    capacity: 100,
    artistSplit: 0,
    venueSplit: 0,
    passaSplit: 0,
    country: 'TBC'
  };

  return ticketEventData;
}

export default async function CreatorTicketPage({ params }: { params: { id: string } }) {
  const ticketData = await getTicketData(params.id);

  if (!ticketData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto flex flex-col items-center gap-8">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold md:text-5xl">Your Ticket</h1>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                    This is your verified credential for the event. Present this at the venue.
                </p>
            </div>
            <div className="max-w-sm w-full">
                <TicketStub event={ticketData} isPurchased={true} />
            </div>
        </div>
      </main>
    </div>
  );
}
