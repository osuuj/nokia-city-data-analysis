'use client';

import { HeaderSectionSkeleton, ResourceCardSkeleton } from '@/shared/components/loading';
import { TransitionBackground } from '@/shared/components/ui/background';
import { Card, CardBody, CardHeader } from '@heroui/react';

/**
 * @deprecated - Individual parts should use shared skeleton components instead
 * This component will be updated in a future release to use shared components exclusively.
 *
 * Skeleton loading component for the Resources page.
 * Uses shared AnimatedBackgroundSkeleton for consistent background animation
 * and ResourceCardSkeleton for resource items.
 */
export function ResourcesSkeleton() {
  return (
    <TransitionBackground>
      <div className="px-4 py-8 md:px-6">
        {/* Header skeleton */}
        <HeaderSectionSkeleton titleWidth="w-64" descriptionLines={2} className="mb-10" />

        {/* Categories skeleton - cards appear before their content */}
        <div className="mb-12 space-y-6">
          {/* First category - simulate opened state */}
          <Card className="shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2">
            <CardHeader className="flex items-center gap-2 p-4 border-b border-default-200/50 dark:border-default-700/30">
              <div className="h-6 w-6 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
              <div className="h-6 w-48 bg-gray-400/70 dark:bg-gray-600/70" />
            </CardHeader>
            <CardBody className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResourceCardSkeleton key="resource-skeleton-1" />
                <ResourceCardSkeleton key="resource-skeleton-2" />
                <ResourceCardSkeleton key="resource-skeleton-3" />
                <ResourceCardSkeleton key="resource-skeleton-4" />
              </div>
            </CardBody>
          </Card>

          {/* More closed categories */}
          <Card
            key="category-skeleton-1"
            className="shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2"
          >
            <CardHeader className="flex items-center gap-2 p-4">
              <div className="h-6 w-6 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
              <div className="h-6 w-40 bg-gray-400/70 dark:bg-gray-600/70" />
            </CardHeader>
          </Card>

          <Card
            key="category-skeleton-2"
            className="shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2"
          >
            <CardHeader className="flex items-center gap-2 p-4">
              <div className="h-6 w-6 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
              <div className="h-6 w-40 bg-gray-400/70 dark:bg-gray-600/70" />
            </CardHeader>
          </Card>
        </div>
      </div>
    </TransitionBackground>
  );
}
