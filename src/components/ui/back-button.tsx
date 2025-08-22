'use client';

import { ArrowLeft } from 'lucide-react';

export function BackButton() {
    return (
        <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <ArrowLeft className="size-4" />
            Back
        </button>
    );
}