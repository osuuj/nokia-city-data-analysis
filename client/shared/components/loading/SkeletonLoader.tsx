'use client';

import { cn } from '@/shared/utils/cn';

export interface SkeletonLoaderProps {
  /**
   * The width of the skeleton
   * Can be a number (px) or a string (%, rem, etc.)
   * @default "100%"
   */
  width?: number | string;
  /**
   * The height of the skeleton
   * Can be a number (px) or a string (%, rem, etc.)
   * @default "1rem"
   */
  height?: number | string;
  /**
   * Whether the skeleton should be rounded
   * @default true
   */
  rounded?: boolean;
  /**
   * Additional CSS classes to apply to the skeleton
   */
  className?: string;
  /**
   * Whether to animate the skeleton
   * @default true
   */
  animate?: boolean;
}

/**
 * SkeletonLoader component
 * A reusable skeleton component for loading states
 */
export function SkeletonLoader({
  width = '100%',
  height = '1rem',
  rounded = true,
  className,
  animate = true,
}: SkeletonLoaderProps) {
  return (
    <div
      className={cn(
        'bg-default-200',
        rounded && 'rounded-md',
        animate && 'animate-pulse',
        className,
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
