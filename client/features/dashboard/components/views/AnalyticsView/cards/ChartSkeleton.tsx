'use client';

import { ChartSkeleton as SharedChartSkeleton } from '@/shared/components/loading';
import type React from 'react';

interface ChartSkeletonProps {
  height?: string; // Allow customizing height, e.g., '300px', '400px'
  className?: string;
}

/**
 * @deprecated Use the shared ChartSkeleton component from '@/shared/components/loading' instead
 */
export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  height = '300px',
  className = '',
}) => {
  // Use the shared component with appropriate props
  return <SharedChartSkeleton height={height} className={className} chartType="bar" />;
};
