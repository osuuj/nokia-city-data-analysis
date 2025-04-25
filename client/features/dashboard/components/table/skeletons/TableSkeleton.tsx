'use client';

import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { cn } from '@/shared/utils/cn';

interface TableSkeletonProps {
  /**
   * The number of rows to show
   * @default 5
   */
  rows?: number;
  /**
   * The number of columns to show
   * @default 6
   */
  columns?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * TableSkeleton component
 * Provides a skeleton loading state for tables
 */
export function TableSkeleton({ rows = 5, columns = 6, className }: TableSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <SkeletonLoader width={200} height={32} />
          <SkeletonLoader width={120} height={32} />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonLoader width={100} height={32} />
          <SkeletonLoader width={100} height={32} />
        </div>
      </div>

      {/* Table */}
      <div className="border border-default-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-default-50">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonLoader
              key={`header-skeleton-${Math.random().toString(36).substring(2, 9)}`}
              height={24}
            />
          ))}
        </div>

        {/* Table Body */}
        <div className="divide-y divide-default-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-skeleton-${Math.random().toString(36).substring(2, 9)}`}
              className="grid grid-cols-6 gap-4 p-4 hover:bg-default-50"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <SkeletonLoader
                  key={`cell-skeleton-${Math.random().toString(36).substring(2, 9)}`}
                  height={20}
                  className="w-full"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <SkeletonLoader width={100} height={32} />
        <div className="flex items-center gap-2">
          <SkeletonLoader width={32} height={32} rounded />
          <SkeletonLoader width={32} height={32} rounded />
          <SkeletonLoader width={32} height={32} rounded />
        </div>
        <SkeletonLoader width={100} height={32} />
      </div>
    </div>
  );
}
