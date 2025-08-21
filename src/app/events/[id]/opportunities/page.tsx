import { OpportunityCard } from '@/components/passa/opportunity-card';
import prisma from '@/lib/db';
import { FileText } from 'lucide-react';

interface EventOpportunitiesPageProps {
  params: { id: string };
}

export default async function EventOpportunitiesPage({ params }: EventOpportunitiesPageProps) {
  const eventId = parseInt((await params).id);

  if (isNaN(eventId)) {
    return (
      <div className="text-center text-muted-foreground py-24">
        <FileText className="mx-auto size-16 mb-4" />
        <h3 className="font-semibold text-xl">Invalid Event ID</h3>
        <p>The provided event ID is not valid.</p>
      </div>
    );
  }

  const creativeBriefs = await prisma.creativeBrief.findMany({
    where: {
      eventId: eventId,
    },
    include: {
      event: {
        include: {
          organizer: true,
        },
      },
    },
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">
              Opportunities for Event
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Browse creative briefs associated with this event.
            </p>
          </div>

          {creativeBriefs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creativeBriefs.map(brief => (
                <OpportunityCard
                  key={brief.id}
                  job={{
                    id: brief.id,
                    title: brief.title,
                    description: brief.description,
                    budget: brief.budget,
                    organizer: brief.event.organizer.name || brief.event.organizer.email,
                    skills: brief.requiredSkills,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-24">
              <FileText className="mx-auto size-16 mb-4" />
              <h3 className="font-semibold text-xl">No Opportunities Available</h3>
              <p>There are currently no creative briefs for this event. Please check back later!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}