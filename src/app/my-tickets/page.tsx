import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyTicketsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
        <p className="text-muted-foreground mb-8">
          View and manage your event tickets.
        </p>
        
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            You don't have any tickets yet.
          </p>
          <Button asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}