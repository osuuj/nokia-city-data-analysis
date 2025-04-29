'use client';

import type { LoadingPriority, LoadingType } from '@/shared/context/loading/LoadingContext';
import { useLoading } from '@/shared/hooks/loading/useLoading';
import { cn } from '@/shared/utils/cn';
import { Spinner } from '@heroui/react';
import { memo } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { SkeletonLoader } from './SkeletonLoader';

interface ResponsiveLoadingProps {
  /**
   * Override the loading type from context
   */
  type?: LoadingType;
  /**
   * Override the loading priority from context
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
}

/**
 * ResponsiveLoading component
 * Adapts its appearance based on loading type and priority
 */
function ResponsiveLoadingComponent({
  type,
  priority,
  className,
  message,
}: ResponsiveLoadingProps) {
  const { isLoading, currentLoadingState } = useLoading();

  // Use props over context values
  const currentType = type || currentLoadingState?.type || 'spinner';
  const currentPriority = priority || currentLoadingState?.priority || 'auto';
  const currentMessage = message || currentLoadingState?.message || 'Loading...';

  if (!isLoading) return null;

  // Determine size based on priority
  const size = currentPriority === 'high' ? 'lg' : currentPriority === 'auto' ? 'md' : 'sm';

  // Render appropriate loading component based on type
  switch (currentType) {
    case 'overlay':
      return (
        <LoadingOverlay visible={true} message={currentMessage} className={cn('z-50', className)} />
      );
    case 'skeleton':
      return (
        <SkeletonLoader
          className={cn(
            'w-full',
            currentPriority === 'high' && 'h-32',
            currentPriority === 'auto' && 'h-24',
            currentPriority === 'low' && 'h-16',
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
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${currentLoadingState?.progress || 0}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">{currentMessage}</p>
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
