'use client';

import { Skeleton } from '@heroui/react';

export type ChartType = 'bar' | 'line' | 'pie' | 'distribution' | 'comparison';

export interface ChartSkeletonProps {
  /**
   * Type of chart to display skeleton for
   * @default 'bar'
   */
  chartType?: ChartType;
  /**
   * Height of the chart skeleton
   * @default 'h-[400px]'
   */
  height?: string;
  /**
   * Additional class name for the container
   */
  className?: string;
  /**
   * Whether to show a chart title
   * @default true
   */
  showTitle?: boolean;
  /**
   * Whether to show chart controls/legend
   * @default true
   */
  showControls?: boolean;
  /**
   * Number of bars/categories to show (for bar charts)
   * @default 5
   */
  dataPoints?: number;
}

/**
 * ChartSkeleton component
 *
 * A reusable skeleton for various chart types showing a loading state
 * with customizable options. Supports bar, line, pie, distribution and comparison charts.
 */
export function ChartSkeleton({
  chartType = 'bar',
  height = 'h-[400px]',
  className = '',
  showTitle = true,
  showControls = true,
  dataPoints = 5,
}: ChartSkeletonProps) {
  // Render common header/title section
  const renderHeader = () => {
    if (!showTitle && !showControls) return null;

    return (
      <div className="flex justify-between mb-4">
        {showTitle && <Skeleton className="h-6 w-48 rounded-md" />}
        {showControls && <Skeleton className="h-6 w-24 rounded-md" />}
      </div>
    );
  };

  // Bar chart skeleton
  if (chartType === 'bar') {
    return (
      <div className={`w-full ${height} flex flex-col animate-pulse ${className}`}>
        {renderHeader()}
        <div className="flex-1 flex items-end gap-6 pb-10">
          {Array.from({ length: dataPoints }).map(() => (
            <div
              key={`bar-chart-${crypto.randomUUID()}`}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <Skeleton
                className="w-full rounded-t-md"
                style={{ height: `${Math.random() * 70 + 15}%` }}
              />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Line chart skeleton
  if (chartType === 'line') {
    return (
      <div className={`w-full ${height} flex flex-col animate-pulse ${className}`}>
        {renderHeader()}
        <div className="flex-1 relative">
          {/* Line chart placeholder */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-default-300 dark:bg-default-700" />
          <svg className="w-full h-full" aria-label="Loading trend line chart">
            <title>Loading chart animation</title>
            <path
              d={`M0,${Math.random() * 50 + 50} ${Array.from({ length: dataPoints + 5 })
                .map((_, i) => {
                  const x = (i + 1) * (100 / (dataPoints + 5));
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

  // Pie chart skeleton
  if (chartType === 'pie') {
    return (
      <div className={`w-full ${height} flex flex-col animate-pulse ${className}`}>
        {renderHeader()}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-default-200 dark:bg-default-700 relative overflow-hidden">
            {/* Simulate pie chart segments */}
            <div
              className="absolute inset-0"
              style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
            >
              <div className="w-full h-full bg-default-300 dark:bg-default-600" />
            </div>
            <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%)' }}>
              <div className="w-full h-full bg-default-400 dark:bg-default-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Comparison chart (side-by-side bars)
  if (chartType === 'comparison') {
    return (
      <div className={`w-full ${height} flex flex-col animate-pulse ${className}`}>
        {renderHeader()}
        <div className="flex-1 flex items-end gap-6 pb-10">
          {Array.from({ length: dataPoints }).map(() => (
            <div
              key={`comparison-chart-${crypto.randomUUID()}`}
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

  // Distribution chart (dense bars)
  return (
    <div className={`w-full ${height} flex flex-col animate-pulse ${className}`}>
      {renderHeader()}
      <div className="flex-1 flex items-end gap-2">
        {Array.from({ length: dataPoints * 2 }).map(() => (
          <div key={`distribution-chart-${crypto.randomUUID()}`} className="flex-1">
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
