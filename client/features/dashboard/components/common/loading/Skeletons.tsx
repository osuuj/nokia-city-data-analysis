'use client';

import type { ReactNode } from 'react';
import { FadeIn } from '../Animations';

// Define static keys for skeleton elements
const SKELETON_ROW_KEYS = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5'];

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
 * DashboardSkeleton
 * Skeleton loader for the entire dashboard view
 */
export function DashboardSkeleton() {
  return (
    <FadeIn>
      <div className="w-full space-y-4">
        <div className="h-12 bg-default-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-40 bg-default-100 rounded-lg animate-pulse" />
          <div className="h-40 bg-default-100 rounded-lg animate-pulse" />
          <div className="h-40 bg-default-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-[60vh] bg-default-100 rounded-lg animate-pulse" />
      </div>
    </FadeIn>
  );
}

/**
 * SectionSkeleton
 * Skeleton loader for a specific dashboard section
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
    return (
      <div className={`animate-pulse ${getHeight()} w-full ${className || ''}`}>{children}</div>
    );
  }

  // Default skeleton
  return (
    <div className={`animate-pulse ${getHeight()} w-full ${className || ''}`}>
      <div className="w-full h-full rounded-md bg-default-100">
        {message && (
          <div className="flex items-center justify-center h-full">
            <p className="text-default-500">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * AnalyticsSkeleton
 * Renders a skeleton for analytics cards based on type
 */
export function AnalyticsSkeleton({ type, className }: AnalyticsSkeletonProps) {
  const baseClasses = 'p-6 bg-default-50 dark:bg-default-900/10 rounded-lg shadow-sm animate-pulse';

  switch (type) {
    case 'distribution':
      return (
        <FadeIn>
          <div className={`${baseClasses} ${className || ''}`}>
            <div className="flex items-center justify-between">
              <div className="w-[120px] h-6 bg-default-100 rounded-md" />
              <div className="w-[80px] h-6 bg-default-100 rounded-md" />
            </div>
            <div className="mt-4 space-y-2">
              {SKELETON_ROW_KEYS.slice(0, 3).map((key) => (
                <div
                  key={`distribution-skeleton-${key}`}
                  className="h-4 bg-default-100 rounded-md w-full"
                />
              ))}
            </div>
          </div>
        </FadeIn>
      );

    case 'comparison':
    case 'cityComparison':
      return (
        <FadeIn>
          <div className={`${baseClasses} ${className || ''}`}>
            <div className="flex items-center justify-between">
              <div className="w-[150px] h-6 bg-default-100 rounded-md" />
              <div className="w-[100px] h-6 bg-default-100 rounded-md" />
            </div>
            <div className="mt-4">
              <div className="h-[200px] bg-default-100 rounded-md w-full" />
            </div>
          </div>
        </FadeIn>
      );

    case 'trends':
      return (
        <FadeIn>
          <div className={`${baseClasses} ${className || ''}`}>
            <div className="flex items-center justify-between">
              <div className="w-[180px] h-6 bg-default-100 rounded-md" />
              <div className="w-[120px] h-6 bg-default-100 rounded-md" />
            </div>
            <div className="h-[200px] flex items-end justify-between gap-2 mt-4">
              {SKELETON_ROW_KEYS.slice(0, 6).map((key, i) => (
                <div
                  key={`trend-skeleton-${key}`}
                  className="w-[40px] bg-default-100 rounded-md"
                  style={{
                    height: `${Math.floor(Math.random() * 100) + 50}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </FadeIn>
      );

    case 'pieChart':
      return (
        <FadeIn>
          <div className={`${baseClasses} ${className || ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-[150px] h-6 bg-default-100 rounded-md" />
              <div className="w-[80px] h-6 bg-default-100 rounded-md" />
            </div>
            <div className="flex justify-center">
              <div className="w-[200px] h-[200px] rounded-full overflow-hidden bg-default-100" />
            </div>
          </div>
        </FadeIn>
      );

    case 'barChart':
      return (
        <FadeIn>
          <div className={`${baseClasses} ${className || ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-[150px] h-6 bg-default-100 rounded-md" />
              <div className="w-[100px] h-6 bg-default-100 rounded-md" />
            </div>
            <div className="flex items-end h-[200px] justify-between gap-1">
              {SKELETON_ROW_KEYS.slice(0, 5).map((key, i) => (
                <div
                  key={`bar-skeleton-${key}`}
                  className="w-[30px] bg-default-100 rounded-md"
                  style={{
                    height: `${Math.floor(Math.random() * 70) + 30}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </FadeIn>
      );

    default:
      return (
        <FadeIn>
          <div className="w-full h-[200px] bg-default-100 rounded-md animate-pulse" />
        </FadeIn>
      );
  }
}

/**
 * AnalyticsDashboardSkeleton
 * Shows loading state for analytics dashboard with multiple card types
 */
export function AnalyticsDashboardSkeleton() {
  return (
    <FadeIn>
      <div className="flex flex-col gap-4 w-full">
        <SectionSkeleton section="header" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnalyticsSkeleton type="distribution" />
          <AnalyticsSkeleton type="pieChart" />
          <AnalyticsSkeleton type="comparison" />
          <AnalyticsSkeleton type="barChart" />
        </div>
      </div>
    </FadeIn>
  );
}
