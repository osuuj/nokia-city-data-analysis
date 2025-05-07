'use client';

import { HeaderSectionSkeleton, TableSkeleton } from '@/shared/components/loading';

/**
 * Dashboard loading state component
 *
 * Replacement for the deprecated DashboardSkeleton component
 * Uses shared skeleton components for consistent loading experience
 */
export function DashboardLoadingState() {
  return (
    <div className="space-y-4 w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-default-200 dark:bg-default-700 rounded-lg" />
        </div>
        <div className="flex gap-2 animate-pulse">
          <div className="h-12 w-32 bg-default-200 dark:bg-default-700 rounded-lg" />
          <div className="h-12 w-12 bg-default-200 dark:bg-default-700 rounded-lg" />
        </div>
      </div>

      {/* Control panel */}
      <div className="flex flex-wrap gap-2 p-4 bg-default-50 dark:bg-default-50/5 rounded-lg">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-default-200 dark:bg-default-700 rounded-lg" />
        </div>
        <div className="animate-pulse">
          <div className="h-10 w-32 bg-default-200 dark:bg-default-700 rounded-lg" />
        </div>
        <div className="ml-auto flex gap-2 animate-pulse">
          <div className="h-10 w-24 bg-default-200 dark:bg-default-700 rounded-lg" />
          <div className="h-10 w-10 bg-default-200 dark:bg-default-700 rounded-lg" />
        </div>
      </div>

      {/* Content area */}
      <div className="h-[calc(100vh-300px)] min-h-[400px]">
        <TableSkeleton rows={8} columns={4} showHeader={true} showPagination={true} />
      </div>
    </div>
  );
}
