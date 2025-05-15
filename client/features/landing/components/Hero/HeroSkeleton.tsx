'use client';

import type { HeroSkeletonProps } from '@/features/landing/types';
import { Skeleton } from '@heroui/react';
import { useTheme } from 'next-themes';
import type { FC } from 'react';

/**
 * HeroSkeleton Component
 *
 * A skeleton loading component that mimics the structure of the Hero component.
 * Used as a fallback during the loading state of the Hero component.
 *
 * @example
 * <Suspense fallback={<HeroSkeleton />}>
 *   <Hero />
 * </Suspense>
 */
export const HeroSkeleton: FC<HeroSkeletonProps> = ({ className = '' }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`relative h-[calc(100vh-24rem)] w-full overflow-hidden ${className}`}>
      {/* Background Skeleton */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />

      {/* Content Skeleton */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
        <div className="inline-block max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center">
          {/* Title Skeleton */}
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-8 w-1/2 rounded-lg" />
            <Skeleton className="h-8 w-2/3 rounded-lg" />
          </div>

          {/* Description Skeleton */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg mx-auto" />
            <Skeleton className="h-4 w-4/6 rounded-lg mx-auto" />
          </div>

          {/* Button Skeleton */}
          <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
