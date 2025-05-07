'use client';

import { Skeleton } from '@heroui/react';

export interface TableSkeletonProps {
  /**
   * Number of skeleton rows to display
   * @default 5
   */
  rows?: number;
  /**
   * Additional class name for the container
   */
  className?: string;
  /**
   * Number of columns to display in each row
   * @default 4
   */
  columns?: number;
  /**
   * Whether to show the table header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether to show pagination controls
   * @default true
   */
  showPagination?: boolean;
  /**
   * Whether to show a row selection checkbox
   * @default true
   */
  showRowSelection?: boolean;
}

/**
 * TableSkeleton component
 *
 * A reusable skeleton for tables showing a loading state with customizable
 * number of rows, columns, and optional header and pagination.
 */
export function TableSkeleton({
  rows = 5,
  className = '',
  columns = 4,
  showHeader = true,
  showPagination = true,
  showRowSelection = true,
}: TableSkeletonProps) {
  return (
    <div className={`w-full animate-pulse ${className}`}>
      {/* Table header */}
      {showHeader && (
        <div className="flex p-3 bg-default-100 dark:bg-default-50/5 rounded-t-lg">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      )}

      {/* Table rows */}
      <div className="border-x border-default-200 dark:border-default-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={`skeleton-table-row-${crypto.randomUUID()}`}
            className="flex items-center p-3 border-b border-default-200 dark:border-default-800"
          >
            {showRowSelection && <Skeleton className="h-5 w-6 rounded-md mr-3" />}

            {Array.from({ length: columns }).map((_, j) => {
              // Vary widths to make it look more realistic
              const width = j === 0 ? 'w-48' : j === 1 ? 'w-36' : 'w-24';
              const margin = j > 0 && j < columns - 1 ? 'mx-4' : '';

              return (
                <Skeleton
                  key={`skeleton-table-cell-${crypto.randomUUID()}`}
                  className={`h-5 ${width} ${margin} rounded-md`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Table pagination */}
      {showPagination && (
        <div className="flex justify-between items-center p-3 bg-default-50 dark:bg-default-50/5 rounded-b-lg">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
