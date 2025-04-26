'use client';

import { SectionLoader } from './SectionLoader';

/**
 * DashboardSkeleton component
 * Renders a skeleton loading state for the entire dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header skeleton */}
      <div className="relative">
        <SectionLoader section="header" isLoading={true} />
      </div>

      {/* Map skeleton */}
      <div className="relative">
        <SectionLoader section="map" isLoading={true} />
      </div>

      {/* Table skeleton */}
      <div className="relative">
        <SectionLoader section="table" isLoading={true} />
      </div>
    </div>
  );
}
