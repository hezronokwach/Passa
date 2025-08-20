
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { Tag, DollarSign, Briefcase } from 'lucide-react';
import { opportunities, Opportunity } from '@/lib/mock-data';

// Define the type for a single opportunity to use with useState
type OpportunityState = Opportunity | null;

export function OpportunityDetailView({ id }: { id: string }) {
    const { toast } = useToast();
    const [opportunity, setOpportunity] = useState<OpportunityState>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const foundOpportunity = opportunities.find(op => op.id.toString() === id) || null;
        setOpportunity(foundOpportunity);
        setLoading(false);
    }, [id]);

    const handleApplyConfirm = () => {
      if (!opportunity) return;
      toast({
        title: "Application Submitted!",
        description: `Your application for "${opportunity.title}" has been sent.`,
      });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p>Loading...</p>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="flex items-center justify-center p-8">
                <p>Opportunity not found.</p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-headline">{opportunity.title}</CardTitle>
                <CardDescription>by {opportunity.organizer}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                    <p className="text-muted-foreground">{opportunity.description}</p>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="size-5 text-primary" />
                                <span className="font-bold text-lg">${opportunity.budget}</span>
                                <span className="text-muted-foreground">Budget</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Briefcase className="size-5 text-primary mt-1" />
                                <div>
                                    <h4 className="font-semibold">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {opportunity.skills.map(skill => (
                                            <div key={skill} className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                                                <Tag className="size-3"/>
                                                <span>{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="lg" className="w-full font-bold">Apply Now</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will submit your application for the opportunity titled "{opportunity.title}". You cannot undo this action.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleApplyConfirm}>Confirm Application</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
