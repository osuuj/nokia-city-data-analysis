'use client';

import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { cn } from '@/shared/utils/cn';
import type React from 'react';

interface AnalyticsCardSkeletonProps {
  /**
   * The type of analytics card
   */
  type: 'distribution' | 'comparison' | 'trends';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * AnalyticsCardSkeleton component
 * Provides a skeleton loading state for analytics cards
 */
export const AnalyticsCardSkeleton: React.FC<AnalyticsCardSkeletonProps> = ({
  type,
  className,
}) => {
  const baseClasses = 'p-6 bg-white rounded-lg shadow-sm';

  switch (type) {
    case 'distribution':
      return (
        <div className={cn(baseClasses, className)}>
          <div className="flex items-center justify-between">
            <SkeletonLoader width={120} height={24} />
            <SkeletonLoader width={80} height={24} />
          </div>
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonLoader
                key={`distribution-skeleton-${i}-${Math.random()}`}
                height={16}
                className="w-full"
              />
            ))}
          </div>
        </div>
      );

    case 'comparison':
      return (
        <div className={cn(baseClasses, className)}>
          <div className="flex items-center justify-between">
            <SkeletonLoader width={150} height={24} />
            <SkeletonLoader width={100} height={24} />
          </div>
          <div className="mt-4">
            <SkeletonLoader height={200} className="w-full" />
          </div>
        </div>
      );

    case 'trends':
      return (
        <div className={cn(baseClasses, className)}>
          <div className="flex items-center justify-between">
            <SkeletonLoader width={180} height={24} />
            <SkeletonLoader width={120} height={24} />
          </div>
          <div className="h-[200px] flex items-end justify-between gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader
                key={`trend-skeleton-${i}-${Math.random()}`}
                width={40}
                height={`${Math.random() * 100 + 50}%`}
              />
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};
