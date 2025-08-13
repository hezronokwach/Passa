

'use server';

import React from 'react';
import { Header } from '@/components/passa/header';
import Link from 'next/link';
import { ProfileForm } from './profile-form';
import type { User, OrganizerProfile } from '@prisma/client';
import { getSession } from '@/lib/session';
import prisma from '@/lib/db';
import { ArrowLeft } from 'lucide-react';

type UserWithProfile = User & { organizerProfile: OrganizerProfile | null };

async function getOrganizer(): Promise<UserWithProfile> {
    const session = await getSession();
    // Middleware protects this page
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: session!.userId },
        include: { organizerProfile: true }
    });

    if (!user.organizerProfile) {
        throw new Error("Organizer profile not found for authenticated user.");
    }

    return user;
}

export default async function OrganizerProfilePage() {
    const user = await getOrganizer();

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/dashboard/organizer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                            <ArrowLeft className="size-4" />
                            Back to Dashboard
                        </Link>
                        <ProfileForm user={user} profile={user.organizerProfile!} />
                    </div>
                </div>
            </main>
        </div>
    );
}
