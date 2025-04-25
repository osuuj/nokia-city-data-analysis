'use client';

import { useLoading } from '@/shared/context/LoadingContext';
import { cn } from '@/shared/utils/cn';
import { Spinner } from '@heroui/react';
import { LoadingOverlay } from '../LoadingOverlay';
import { LoadingSpinner } from '../LoadingSpinner';
import { SkeletonLoader } from '../SkeletonLoader';

interface ResponsiveLoadingProps {
  /**
   * Override the loading type from context
   */
  type?: 'overlay' | 'inline' | 'skeleton';
  /**
   * Override the loading priority from context
   */
  priority?: 'high' | 'medium' | 'low';
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
export function ResponsiveLoading({ type, priority, className, message }: ResponsiveLoadingProps) {
  const { loadingState } = useLoading();
  const { isLoading, type: contextType, priority: contextPriority } = loadingState;

  // Use props over context values
  const currentType = type || contextType;
  const currentPriority = priority || contextPriority;
  const currentMessage = message || loadingState.message;

  if (!isLoading) return null;

  // Determine size based on priority
  const size = currentPriority === 'high' ? 'lg' : currentPriority === 'medium' ? 'md' : 'sm';

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
            currentPriority === 'medium' && 'h-24',
            currentPriority === 'low' && 'h-16',
            className,
          )}
        />
      );
    case 'inline':
      return (
        <div className="flex justify-center items-center p-4">
          <Spinner size="lg" />
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
