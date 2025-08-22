'use client';

import { useToast } from "@/components/ui/use-toast";
import { useActionState, useEffect } from "react";
import { createSubmission } from "@/app/actions/creator";
import { PartyPopper } from "lucide-react";
import React from "react";
import { Header } from '@/components/passa/header';
import { OpportunityDetailView } from './opportunity-detail-view';

interface BriefDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function BriefDetailPage({ params: { id } }: { params: { id: string } }) {
    const { toast } = useToast();

    // Mock data - In a real app, you would fetch this from the DB using params.id
    const brief = {
        id: parseInt(id),
        title: 'Promotional Video for Afrochella',
        organizer: 'Afrochella Events',
        budget: 5000,
        skills: ['Videography', 'Video Editing', 'Storytelling'],
        description: 'We need a stunning 2-minute promotional video to capture the vibrant energy of the Afrochella festival. The video should highlight key performances, audience reactions, and the overall cultural experience. The final deliverable should be a 16:9 MP4 file, under 100MB. We are looking for creative storytelling that captures the essence of Afrofuturism and community. Submissions will be reviewed on a rolling basis.'
    };

    const [submissionState, formAction] = useActionState(createSubmission, {
        message: '',
        errors: {},
        success: false,
    });

    React.useEffect(() => {
        if (submissionState?.success) {
          toast({
            title: 'Submission Successful!',
            description: submissionState.message,
            action: <div className="p-1"><PartyPopper className="text-primary"/></div>
          });
        } else if (submissionState?.message && !submissionState.success && !submissionState.errors) {
          toast({ title: 'Error', description: submissionState.message, variant: 'destructive' });
        }
    }, [submissionState, toast]);

    const hasSubmitted = submissionState?.success;

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <OpportunityDetailView id={id} />
                </div>
            </main>
        </div>
    );
}
