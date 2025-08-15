
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { updateCreatorProfile, addPortfolioItem } from '@/app/actions/creator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Upload, PlusCircle, Video, Image as ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { User, CreatorProfile, PortfolioItem } from '@prisma/client';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : children}
    </Button>
  );
}

function AddWorkSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Uploading...' : 'Add Portfolio Item'}
        </Button>
    )
}

interface ProfileFormProps {
    user: User;
    profile: CreatorProfile;
    portfolioItems: PortfolioItem[];
}

export function ProfileForm({ user, profile, portfolioItems }: ProfileFormProps) {
  const { toast } = useToast();
  const [isAddWorkOpen, setIsAddWorkOpen] = React.useState(false);

  const [profileState, profileFormAction] = useActionState(updateCreatorProfile, {
    errors: {},
    message: '',
    success: false,
  });

  const [portfolioState, portfolioFormAction] = useActionState(addPortfolioItem, {
    message: '',
    success: false,
  });

  React.useEffect(() => {
    if (profileState?.success) {
      toast({ title: 'Success!', description: profileState.message });
    } else if (profileState?.message && !profileState.success && Object.keys(profileState.errors).length === 0) {
      toast({ title: 'Error', description: profileState.message, variant: 'destructive' });
    }
  }, [profileState, toast]);
  
  React.useEffect(() => {
    if (portfolioState?.success) {
      toast({ title: 'Success!', description: portfolioState.message });
      setIsAddWorkOpen(false);
    } else if (portfolioState?.message && !portfolioState.success) {
      toast({ title: 'Error', description: portfolioState.message, variant: 'destructive' });
    }
  }, [portfolioState, toast]);
  

  return (
    <>
        <form action={profileFormAction}>
        <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-3xl font-bold md:text-4xl">
            My Creator Profile
            </h1>
            <SubmitButton>Save Changes</SubmitButton>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.name || ''} />
                {profileState?.errors?.name && <p className="text-sm text-destructive">{profileState.errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} readOnly />
            </div>
            <div className="space-y-2">
                <Label htmlFor="skills">Specialties / Skills (comma-separated)</Label>
                <Input id="skills" name="skills" defaultValue={profile.skills.join(', ')} placeholder="e.g., Videography, Graphic Design" />
                {profileState?.errors?.skills && <p className="text-sm text-destructive">{profileState.errors.skills[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="website">Portfolio Website</Label>
                <Input id="website" name="website" defaultValue={profile.website || ''} placeholder="https://my-portfolio.com" />
                {profileState?.errors?.website && <p className="text-sm text-destructive">{profileState.errors.website[0]}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea id="bio" name="bio" defaultValue={profile.bio || ''} placeholder="Tell us about your creative journey..." />
                {profileState?.errors?.bio && <p className="text-sm text-destructive">{profileState.errors.bio[0]}</p>}
            </div>
            </CardContent>
        </Card>
        </form>

        <Card className="mt-8">
        <CardHeader>
            <div className="flex items-center justify-between">
            <div>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Showcase your best work.</CardDescription>
            </div>
            <Dialog open={isAddWorkOpen} onOpenChange={setIsAddWorkOpen}>
                <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle className="mr-2 size-4" />
                    Add Work
                </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Portfolio Item</DialogTitle>
                    <DialogDescription>
                    Upload a new video or image to showcase your skills.
                    </DialogDescription>
                </DialogHeader>
                <form action={portfolioFormAction} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Promotional Video" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="A short description of the work." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <Input id="file" name="file" type="file" accept="video/*,image/*" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <AddWorkSubmitButton />
                    </DialogFooter>
                </form>
                </DialogContent>
            </Dialog>

            </div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
            {portfolioItems.map(item => (
                <div key={item.id} className="relative group aspect-video rounded-lg overflow-hidden border">
                    {/* In a real app, item.url would point to the actual media. For now, it's a placeholder. */}
                    <Image src={'https://placehold.co/600x400.png'} alt={item.title} fill className="object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3 text-white">
                        <div className="flex items-center gap-2">
                            {item.type === 'VIDEO' ? <Video className="size-4" /> : <ImageIcon className="size-4" />}
                            <h3 className="font-bold text-sm">{item.title}</h3>
                        </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="destructive" size="icon" className="h-8 w-8">
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>
            ))}
            {/* Placeholder for new uploads */}
            <div className="relative group aspect-video rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer" onClick={() => setIsAddWorkOpen(true)}>
                <Upload className="size-8 mb-2" />
                <p className="text-sm text-center">Upload Video or Image</p>
            </div>
            </div>
        </CardContent>
        </Card>
    </>
  );
}
