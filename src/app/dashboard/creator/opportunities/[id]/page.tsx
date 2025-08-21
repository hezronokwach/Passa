import { Header } from '@/components/passa/header';
import { OpportunityDetailView } from './opportunity-detail-view';

interface BriefDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function BriefDetailPage({ params }: BriefDetailPageProps) {
    const { id } = await params;
    
    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <OpportunityDetailView id={id} />
                </div>
            </main>
        </div>
    );
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <BriefDetailClient id={id} />
                </div>
            </main>
=======
export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Pass the ID directly as a string prop */}
          <OpportunityDetailView id={params.id} />
>>>>>>> creator
        </div>
      </main>
    </div>
  );
}