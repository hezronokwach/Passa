import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Events</h1>
        <p className="text-muted-foreground mb-8">
          Discover amazing events happening across Africa.
        </p>
        
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            Events listing coming soon!
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}