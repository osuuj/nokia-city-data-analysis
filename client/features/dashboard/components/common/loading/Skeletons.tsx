'use client';

import { Skeleton } from '@heroui/react';
import type { ReactNode } from 'react';
import React from 'react';
import { FadeIn } from '../Animations';

// Define static keys for skeleton elements
const SKELETON_ROW_KEYS = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5'];

// At the top of the file near other constants
const SKELETON_KEYS = {
  TABLE_ROW: 'skeleton-table-row',
  BAR_COMPARISON: 'skeleton-bar-comparison',
  BAR_DISTRIBUTION: 'skeleton-bar-distribution',
};

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
    <div className="space-y-4 w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <Skeleton className="h-12 w-48 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </div>

      {/* Control panel */}
      <div className="flex flex-wrap gap-2 p-4 bg-default-50 dark:bg-default-50/5 rounded-lg">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* Content area */}
      <div className="h-[calc(100vh-300px)] min-h-[400px]">
        <TableSkeleton rows={8} />
      </div>
    </div>
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
 * TableSkeleton component to show a loading state for table data
 * @param rows Number of skeleton rows to display
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full animate-pulse">
      {/* Table header */}
      <div className="flex p-3 bg-default-100 dark:bg-default-50/5 rounded-t-lg">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      {/* Table rows */}
      <div className="border-x border-default-200 dark:border-default-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={`${SKELETON_KEYS.TABLE_ROW}-${i}`}
            className="flex items-center p-3 border-b border-default-200 dark:border-default-800"
          >
            <Skeleton className="h-5 w-6 rounded-md mr-3" />
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-5 w-36 rounded-md mx-4" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
        ))}
      </div>

      {/* Table pagination */}
      <div className="flex justify-between items-center p-3 bg-default-50 dark:bg-default-50/5 rounded-b-lg">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * MapSkeleton component to show a loading state for the map view
 */
export function MapSkeleton() {
  return (
    <div className="w-full h-[70vh] min-h-[400px] bg-default-100 dark:bg-default-50/5 rounded-lg animate-pulse overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-default-200 dark:bg-default-800 mb-2" />
          <div className="w-32 h-4 bg-default-200 dark:bg-default-800 rounded-md" />
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="w-8 h-8 bg-default-200 dark:bg-default-800 rounded-md" />
        <div className="w-8 h-8 bg-default-200 dark:bg-default-800 rounded-md" />
      </div>
    </div>
  );
}

/**
 * AnalyticsSkeleton component to show a loading state for analytics
 * @param type The type of analytics visualization to show a skeleton for
 */
export function AnalyticsSkeleton({
  type = 'distribution',
}: { type?: 'distribution' | 'comparison' | 'trends' }) {
  if (type === 'comparison') {
    return (
      <div className="w-full h-[400px] flex flex-col animate-pulse">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
        <div className="flex-1 flex items-end gap-6 pb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`${SKELETON_KEYS.BAR_COMPARISON}-${i}`}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <Skeleton
                className="w-full rounded-t-md"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'trends') {
    return (
      <div className="w-full h-[400px] flex flex-col animate-pulse">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
        <div className="flex-1 relative">
          {/* Line chart placeholder */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-default-300 dark:bg-default-700" />
          <svg className="w-full h-full" aria-label="Loading trend line chart">
            <title>Loading chart animation</title>
            <path
              d={`M0,${Math.random() * 50 + 50} ${Array.from({ length: 10 })
                .map((_, i) => {
                  const x = (i + 1) * (100 / 10);
                  const y = Math.random() * 50 + 50;
                  return `L${x},${y}`;
                })
                .join(' ')}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-default-300 dark:text-default-700"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Default to distribution
  return (
    <div className="w-full h-[400px] flex flex-col animate-pulse">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
      <div className="flex-1 flex items-end gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`${SKELETON_KEYS.BAR_DISTRIBUTION}-${i}`} className="flex-1">
            <Skeleton
              className="w-full rounded-t-md"
              style={{ height: `${Math.random() * 60 + 10}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
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

/**
 * Skeleton for a section in the dashboard
 */
export function SectionLoader({
  height = 'h-[400px]',
  type = 'default',
}: { height?: string; type?: string }) {
  return (
    <div
      className={`flex items-center justify-center w-full ${height} bg-default-50 dark:bg-default-50/5 rounded-lg animate-pulse`}
    >
      <div className="text-center">
        <div className="inline-block w-12 h-12 rounded-full border-4 border-t-primary border-r-primary border-b-default-200 border-l-default-200 animate-spin" />
        <p className="mt-4 text-default-500">Loading {type === 'default' ? 'data' : type}...</p>
      </div>
    </div>
  );
}
