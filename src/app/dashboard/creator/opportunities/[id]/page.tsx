
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { createSubmission } from '@/app/actions/creator';
import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tag, DollarSign, ArrowLeft, Upload, FileCheck, PartyPopper } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Submitting...' : 'Submit Your Work'}
            {!pending && <Upload className="ml-2 size-4" />}
        </Button>
    )
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
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/dashboard/creator/opportunities" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                            <ArrowLeft className="size-4" />
                            Back to Opportunities
                        </Link>
                        
                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Left Column - Brief Details */}
                            <div className="md:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-3xl">{brief.title}</CardTitle>
                                        <CardDescription>Posted by {brief.organizer}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-semibold mb-2">Creative Brief</h3>
                                                <p className="text-muted-foreground">{brief.description}</p>
                                            </div>
                                            {hasSubmitted ? (
                                                <div className="rounded-lg border-2 border-dashed border-green-500 bg-green-500/10 p-8 text-center">
                                                    <FileCheck className="mx-auto size-12 text-green-500 mb-4" />
                                                    <h3 className="text-xl font-bold text-green-600">Your work has been submitted!</h3>
                                                    <p className="text-muted-foreground mt-2">The organizer has been notified. We&apos;ll let you know when they review your submission.</p>
                                                </div>
                                            ) : (
                                                <Card className="bg-background">
                                                    <CardHeader>
                                                        <CardTitle>Submit Your Work</CardTitle>
                                                        <CardDescription>Upload your file and add a message for the organizer.</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <form action={formAction} className="space-y-4">
                                                            <input type="hidden" name="briefId" value={brief.id} />
                                                            <div className="space-y-2">
                                                                <Label htmlFor="file">Your File</Label>
                                                                <Input id="file" name="file" type="file" accept="video/*,image/*,.pdf,.doc,.docx" required />
                                                                {submissionState?.errors?.file && <p className="text-sm text-destructive">{submissionState.errors.file[0]}</p>}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="message">Message (Optional)</Label>
                                                                <Textarea id="message" name="message" placeholder="Anything you&apos;d like to add?" />
                                                                {submissionState?.errors?.message && <p className="text-sm text-destructive">{submissionState.errors.message[0]}</p>}
                                                            </div>
                                                            <SubmitButton />
                                                        </form>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Meta Info */}
                            <div className="md:col-span-1">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Opportunity Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="size-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-bold text-primary text-lg">${brief.budget}</p>
                                                <p className="text-xs text-muted-foreground">Budget</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Required Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {brief.skills.map(skill => (
                                                    <div key={skill} className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                                                        <Tag className="size-3"/>
                                                        <span>{skill}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
