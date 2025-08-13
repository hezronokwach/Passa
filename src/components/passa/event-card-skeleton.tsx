
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const EventCardSkeleton = () => {
  return (
    <div className="shimmer">
        <Card className="w-full overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-9 w-24 rounded-md" />
            </div>
        </CardContent>
        </Card>
    </div>
  );
};
