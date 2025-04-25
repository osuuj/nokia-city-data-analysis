'use client';

import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { cn } from '@/shared/utils/cn';

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
export function AnalyticsCardSkeleton({ type, className }: AnalyticsCardSkeletonProps) {
  const getSkeletonContent = () => {
    switch (type) {
      case 'distribution':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <SkeletonLoader width={120} height={24} />
              <SkeletonLoader width={80} height={24} />
            </div>
            <div className="flex items-center justify-center h-[200px]">
              <SkeletonLoader width={200} height={200} rounded />
            </div>
            <div className="mt-4 space-y-2">
              <SkeletonLoader lines={3} height={16} gap="0.5rem" />
            </div>
          </>
        );
      case 'comparison':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <SkeletonLoader width={150} height={24} />
              <SkeletonLoader width={100} height={24} />
            </div>
            <div className="space-y-4">
              <SkeletonLoader height={40} />
              <SkeletonLoader height={40} />
              <SkeletonLoader height={40} />
            </div>
          </>
        );
      case 'trends':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <SkeletonLoader width={100} height={24} />
              <SkeletonLoader width={80} height={24} />
            </div>
            <div className="h-[200px] flex items-end justify-between gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonLoader
                  key={`skeleton-bar-${i}-${Math.random().toString(36).substring(2, 9)}`}
                  width={40}
                  height={`${Math.random() * 100 + 50}%`}
                />
              ))}
            </div>
          </>
        );
    }
  };

  return <div className={cn('p-4', className)}>{getSkeletonContent()}</div>;
}
