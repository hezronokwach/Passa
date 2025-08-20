"use client";

import { useState, useEffect } from 'react';
import { useActionState } from 'react-dom';
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
import { Tag, DollarSign, Briefcase, PartyPopper } from 'lucide-react';
import { opportunities, Opportunity } from '@/lib/mock-data'; // We'll still use this for initial display
import { createSubmission } from '@/app/actions/creator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

// Define the type for a single opportunity to use with useState
type OpportunityState = Opportunity | null;

export function OpportunityDetailView({ id }: { id: string }) {
    const { toast } = useToast();
    const [opportunity, setOpportunity] = useState<OpportunityState>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form action state
    const [state, formAction] = useActionState(createSubmission, {
        message: '',
        errors: {},
        success: false,
    });

    useEffect(() => {
        const foundOpportunity = opportunities.find(op => op.id.toString() === id) || null;
        setOpportunity(foundOpportunity);
        setLoading(false);
    }, [id]);

    // Effect to handle toast notifications based on form state
    useEffect(() => {
        if (state.success) {
            setIsDialogOpen(false); // Close dialog on success
            toast({
                title: "Application Submitted!",
                description: state.message,
                action: <div className="p-1"><PartyPopper className="text-primary"/></div>
            });
        } else if (state.message && !state.success && Object.keys(state.errors || {}).length === 0) {
            toast({ title: 'Error', description: state.message, variant: 'destructive' });
        }
    }, [state, toast]);


    if (loading) {
        return <div className="flex items-center justify-center p-8"><p>Loading...</p></div>;
    }

    if (!opportunity) {
        return <div className="flex items-center justify-center p-8"><p>Opportunity not found.</p></div>;
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
                        <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
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
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button size="lg" className="w-full font-bold">Apply Now</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <form action={formAction}>
                            <input type="hidden" name="briefId" value={opportunity.id} />
                            <AlertDialogHeader>
                              <AlertDialogTitle>Submit Your Application</AlertDialogTitle>
                              <AlertDialogDescription>
                                Attach your work and a message for the organizer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            
                            <div className="space-y-4 my-4">
                                <div className="space-y-2">
                                    <Label htmlFor="file">Your Work</Label>
                                    <Input id="file" name="file" type="file" required />
                                    {state.errors?.file && <p className="text-sm text-destructive">{state.errors.file[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message (Optional)</Label>
                                    <Textarea id="message" name="message" placeholder="Add a personal note..." />
                                    {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
                                </div>
                            </div>

                            <AlertDialogFooter>
                              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                              <AlertDialogAction type="submit">Confirm Application</AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}