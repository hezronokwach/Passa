import { Header } from '@/components/passa/header';
import { OpportunityDetailView } from './opportunity-detail-view';

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Pass the ID directly as a string prop */}
          <OpportunityDetailView id={params.id} />
        </div>
      </main>
    </div>
  );
}