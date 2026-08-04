'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function NearbyPlacesSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <div className="mb-8 flex gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 rounded-md" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
