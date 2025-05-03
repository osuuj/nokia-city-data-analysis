'use client';

import type { LoadingPriority, LoadingType } from '@/shared/context/LoadingContext';
// Removed: import { useLoading } from '@/shared/hooks/loading/useLoading';
import { cn } from '@/shared/utils/cn';
import { Spinner } from '@heroui/react';
import { memo } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { SkeletonLoader } from './SkeletonLoader';

interface ResponsiveLoadingProps {
  /**
   * Override the loading type
   */
  type?: LoadingType;
  /**
   * Override the loading priority
   */
  priority?: LoadingPriority;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom loading message
   */
  message?: string;
  /**
   * Show loading (controlled)
   */
  isLoading?: boolean;
  /**
   * Progress (for progress type)
   */
  progress?: number;
}

/**
 * ResponsiveLoading component
 * Adapts its appearance based on loading type and priority
 * Now controlled via props only (no context)
 */
function ResponsiveLoadingComponent({
  type = 'spinner',
  priority = 'auto',
  className,
  message = 'Loading...',
  isLoading = true,
  progress = 0,
}: ResponsiveLoadingProps) {
  if (!isLoading) return null;

  // Determine size based on priority
  const size = priority === 'high' ? 'lg' : priority === 'auto' ? 'md' : 'sm';

  // Render appropriate loading component based on type
  switch (type) {
    case 'overlay':
      return <LoadingOverlay visible={true} message={message} className={cn('z-50', className)} />;
    case 'skeleton':
      return (
        <SkeletonLoader
          className={cn(
            'w-full',
            priority === 'high' && 'h-32',
            priority === 'auto' && 'h-24',
            priority === 'low' && 'h-16',
            className,
          )}
        />
      );
    case 'spinner':
      return (
        <div className="flex justify-center items-center p-4">
          <Spinner size={size} />
        </div>
      );
    case 'progress':
      return (
        <div className="flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>
      );
    default:
      return (
        <div className="flex justify-center items-center p-4">
          <Spinner size="lg" />
        </div>
      );
  }
}

// Memoize the component to prevent unnecessary re-renders
export const ResponsiveLoading = memo(ResponsiveLoadingComponent);
