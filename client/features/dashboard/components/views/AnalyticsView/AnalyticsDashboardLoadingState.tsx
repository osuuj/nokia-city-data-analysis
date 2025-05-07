'use client';

import { ChartSkeleton, HeaderSectionSkeleton } from '@/shared/components/loading';
import React from 'react';

/**
 * AnalyticsDashboardLoadingState component
 *
 * Replacement for the deprecated AnalyticsDashboardSkeleton component
 * Uses shared skeleton components for consistent loading experience
 */
export function AnalyticsDashboardLoadingState() {
  return (
    <div className="space-y-6 w-full">
      {/* Header section */}
      <HeaderSectionSkeleton titleWidth="w-64" descriptionLines={1} className="mb-6" />

      {/* Chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton chartType="distribution" height="h-[300px]" />
        <ChartSkeleton chartType="pie" height="h-[300px]" />
        <ChartSkeleton chartType="comparison" height="h-[300px]" />
        <ChartSkeleton chartType="bar" height="h-[300px]" />
      </div>
    </div>
  );
}
