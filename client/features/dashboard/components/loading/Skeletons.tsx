'use client';

import { SkeletonLoader } from '@/shared/components/loading';
import { cn } from '@/shared/utils/cn';
import type { ReactNode } from 'react';

// Types
export type DashboardSectionType =
  | 'header'
  | 'map'
  | 'table'
  | 'filters'
  | 'stats'
  | 'analytics'
  | 'all';

export type AnalyticsCardType =
  | 'distribution'
  | 'comparison'
  | 'trends'
  | 'cityComparison'
  | 'pieChart'
  | 'barChart';

// Props interfaces
interface BaseSkeleton {
  className?: string;
}

interface SectionSkeletonProps extends BaseSkeleton {
  section: DashboardSectionType;
  message?: string;
  children?: ReactNode;
}

interface AnalyticsSkeletonProps extends BaseSkeleton {
  type: AnalyticsCardType;
}

/**
 * SectionSkeleton
 * Renders a skeleton for a specific dashboard section
 */
export function SectionSkeleton({ section, className, message, children }: SectionSkeletonProps) {
  // Determine height based on section
  const getHeight = () => {
    switch (section) {
      case 'header':
        return 'h-16';
      case 'map':
        return 'h-[400px]';
      case 'table':
        return 'h-[300px]';
      case 'filters':
        return 'h-12';
      case 'stats':
        return 'h-24';
      case 'analytics':
        return 'h-[200px]';
      default:
        return 'h-32';
    }
  };

  // Custom content takes precedence over default skeleton
  if (children) {
    return <div className={cn('animate-pulse', getHeight(), 'w-full', className)}>{children}</div>;
  }

  // Default skeleton
  return (
    <div className={cn('animate-pulse', getHeight(), 'w-full', className)}>
      <SkeletonLoader className="w-full h-full rounded-md" />
    </div>
  );
}

/**
 * AnalyticsSkeleton
 * Renders a skeleton for analytics cards based on type
 */
export function AnalyticsSkeleton({ type, className }: AnalyticsSkeletonProps) {
  const baseClasses = 'p-6 bg-white rounded-lg shadow-sm animate-pulse';

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
                key={`distribution-skeleton-item-${i}-${Date.now()}`}
                height={16}
                className="w-full"
              />
            ))}
          </div>
        </div>
      );

    case 'comparison':
    case 'cityComparison':
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
                key={`trend-skeleton-item-${i}-${Date.now()}`}
                width={40}
                height={`${Math.floor(Math.random() * 100) + 50}%`}
              />
            ))}
          </div>
        </div>
      );

    case 'pieChart':
      return (
        <div className={cn(baseClasses, className)}>
          <div className="flex items-center justify-between mb-4">
            <SkeletonLoader width={150} height={24} />
            <SkeletonLoader width={80} height={24} />
          </div>
          <div className="flex justify-center">
            <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
              <SkeletonLoader className="w-full h-full" />
            </div>
          </div>
        </div>
      );

    case 'barChart':
      return (
        <div className={cn(baseClasses, className)}>
          <div className="flex items-center justify-between mb-4">
            <SkeletonLoader width={150} height={24} />
            <SkeletonLoader width={100} height={24} />
          </div>
          <div className="flex items-end h-[200px] justify-between gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonLoader
                key={`bar-skeleton-item-${i}-${Date.now()}`}
                width={30}
                height={`${Math.floor(Math.random() * 70) + 30}%`}
              />
            ))}
          </div>
        </div>
      );

    default:
      return <SkeletonLoader height={200} className="w-full" />;
  }
}

/**
 * DashboardSkeleton
 * Unified dashboard skeleton that shows loading state for all main sections
 */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionSkeleton section="header" />
      <SectionSkeleton section="filters" />
      <SectionSkeleton section="map" />
      <SectionSkeleton section="table" />
    </div>
  );
}

/**
 * AnalyticsDashboardSkeleton
 * Shows loading state for analytics dashboard with multiple card types
 */
export function AnalyticsDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionSkeleton section="header" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsSkeleton type="distribution" />
        <AnalyticsSkeleton type="pieChart" />
        <AnalyticsSkeleton type="comparison" />
        <AnalyticsSkeleton type="barChart" />
      </div>
    </div>
  );
}
