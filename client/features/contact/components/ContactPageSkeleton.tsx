'use client';

import { AnimatedBackgroundSkeleton } from '@/shared/components/loading';
import { Card, CardBody, Skeleton } from '@heroui/react';

/**
 * @deprecated - Use shared skeleton components directly in the future
 * A lightweight skeleton loading state for the contact page
 * Uses AnimatedBackgroundSkeleton for consistent gradient animation
 */
export function ContactPageSkeleton() {
  return (
    <AnimatedBackgroundSkeleton>
      <div className="px-4 py-8 md:px-6">
        {/* Header skeleton with shimmer effect */}
        <Skeleton className="h-10 w-48 mx-auto mb-12 rounded-md" />

        {/* Team section skeleton with subtle animation */}
        <div className="mb-16">
          <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team member cards with Card components matching final appearance */}
            <Card className="backdrop-blur-md bg-opacity-90 transition-colors">
              <CardBody className="flex flex-col items-center gap-4">
                <Skeleton className="rounded-full w-24 h-24" />
                <div className="text-center w-full">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2 mx-auto" />
                  <Skeleton className="h-4 w-full mb-2 mx-auto" />
                </div>
              </CardBody>
            </Card>
            <Card className="backdrop-blur-md bg-opacity-90 transition-colors">
              <CardBody className="flex flex-col items-center gap-4">
                <Skeleton className="rounded-full w-24 h-24" />
                <div className="text-center w-full">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2 mx-auto" />
                  <Skeleton className="h-4 w-full mb-2 mx-auto" />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Contact Info skeleton with Card matching final appearance */}
        <Card className="backdrop-blur-md bg-opacity-90 transition-colors mb-12">
          <CardBody className="p-6">
            <Skeleton className="h-6 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mx-auto mb-6" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-64 mx-auto mt-6" />
          </CardBody>
        </Card>
      </div>
    </AnimatedBackgroundSkeleton>
  );
}
