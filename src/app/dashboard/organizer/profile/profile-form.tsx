
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { updateOrganizerProfile } from '@/app/actions/organizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import type { User, OrganizerProfile } from '@prisma/client';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : children}
    </Button>
  );
}

interface ProfileFormProps {
    user: User;
    profile: OrganizerProfile;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const { toast } = useToast();

  const [state, formAction] = useActionState(updateOrganizerProfile, {
    errors: {},
    message: '',
    success: false,
  });

  React.useEffect(() => {
    if (state?.success) {
      toast({ title: 'Success!', description: state.message });
    } else if (state?.message && !state.success && Object.keys(state.errors).length === 0) {
      toast({ title: 'Error', description: state.message, variant: 'destructive' });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
        <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
            Organizer Profile
        </h1>
        <SubmitButton>Save Changes</SubmitButton>
        </div>

        <Card>
        <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>This information will be displayed publicly on your events.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" name="name" defaultValue={user.name || ''} />
            {state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} readOnly />
            </div>
            <div className="space-y-2">
            <Label htmlFor="companyName">Organization Name</Label>
            <Input id="companyName" name="companyName" defaultValue={profile.companyName || ''} />
            {state?.errors?.companyName && <p className="text-sm text-destructive">{state.errors.companyName[0]}</p>}
            </div>
            <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" defaultValue={profile.website || ''} placeholder="https://your-company.com" />
            {state?.errors?.website && <p className="text-sm text-destructive">{state.errors.website[0]}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Organization Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={profile.bio || ''} placeholder="Tell us about your organization..." />
            {state?.errors?.bio && <p className="text-sm text-destructive">{state.errors.bio[0]}</p>}
            </div>
        </CardContent>
        </Card>
    </form>
  );
}
