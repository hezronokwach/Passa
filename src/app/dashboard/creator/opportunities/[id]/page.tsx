'use client';

import { useToast } from "@/components/ui/use-toast";
import { useActionState } from "react";
import { createSubmission } from "@/app/actions/creator";
import { PartyPopper } from "lucide-react";
import React from "react";
import { Header } from '@/components/passa/header';
import { OpportunityDetailView } from './opportunity-detail-view';

export default function BriefDetailPage({ params: { id } }: { params: { id: string } }) {
    const { toast } = useToast();

    const [submissionState] = useActionState(createSubmission, {
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
