

'use server';

import React from 'react';
import { Header } from '@/components/passa/header';
import { ProfileForm } from './profile-form';
import { getCurrentUserWithCreatorProfileAndPortfolio } from '@/lib/auth/utils';

async function getCreatorProfile() {
    const user = await getCurrentUserWithCreatorProfileAndPortfolio();

    if (!user.creatorProfile) {
        // This case should not happen if signup logic is correct, but as a fallback
        throw new Error("Creator profile not found for authenticated user.");
    }
    
    return user;
}


export default async function CreatorProfilePage() {
    const userWithProfile = await getCreatorProfile();
    const { creatorProfile, ...user } = userWithProfile;

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <ProfileForm user={user} profile={creatorProfile!} portfolioItems={creatorProfile!.portfolio} />
                    </div>
                </div>
            </main>
        </div>
    );
}
