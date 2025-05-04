import { AnimatedBackground } from '@/shared/components/ui/background';
import { Skeleton } from '@heroui/react';

/**
 * Skeleton loading component for the Resources page.
 * Shows a loading state while resources are being fetched.
 */
export function ResourcesSkeleton() {
  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      <AnimatedBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>
        <div className="mb-12">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
