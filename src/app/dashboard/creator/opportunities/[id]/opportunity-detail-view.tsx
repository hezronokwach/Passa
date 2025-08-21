"use client";

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Tag, PartyPopper, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { createSubmission } from '@/app/actions/creator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

type CreativeBrief = {
  id: number;
  title: string;
  description: string;
  budget: number;
  requiredSkills: string[];
  category: string;
  createdAt: string;
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    country: string;
  };
  _count: {
    submissions: number;
  };
};

type OpportunityState = CreativeBrief | null;

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
        const fetchOpportunity = async () => {
            try {
                const response = await fetch(`/api/creative-briefs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setOpportunity(data);
                }
            } catch (error) {
                console.error('Failed to fetch opportunity:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOpportunity();
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
        <div className="max-w-4xl mx-auto">
            <Link href="/dashboard/creator/opportunities" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="size-4" />
                Back to Opportunities
            </Link>
            
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <Badge variant="secondary" className="mb-2">{opportunity.category}</Badge>
                            <CardTitle className="text-3xl font-headline">{opportunity.title}</CardTitle>
                            <CardDescription className="text-lg mt-2">For {opportunity.event.title}</CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-2xl text-primary">${opportunity.budget}</p>
                            <p className="text-sm text-muted-foreground">Budget</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Brief Description</h3>
                            <p className="text-muted-foreground leading-relaxed">{opportunity.description}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(opportunity.event.date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{opportunity.event.location}, {opportunity.event.country}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Required Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {opportunity.requiredSkills.map(skill => (
                                        <div key={skill} className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                                            <Tag className="size-3"/>
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {opportunity._count.submissions} application{opportunity._count.submissions !== 1 ? 's' : ''} submitted
                                    </p>
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
        </div>
    );
}