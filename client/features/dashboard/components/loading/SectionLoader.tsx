'use client';

import type { DashboardLoadingSection } from '@/features/dashboard/hooks/data/useDashboardLoading';
import { LoadingSpinner, SkeletonLoader } from '@/shared/components/loading';
import { cn } from '@/shared/utils/cn';

interface SectionLoaderProps {
  /**
   * The section being loaded
   */
  section: DashboardLoadingSection;
  /**
   * Whether the section is currently loading
   */
  isLoading: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom loading message
   */
  message?: string;
  /**
   * Whether to use skeleton loader (true) or spinner (false)
   * @default true
   */
  useSkeleton?: boolean;
}

/**
 * SectionLoader component
 * Renders appropriate loading UI for a specific dashboard section
 */
export function SectionLoader({
  section,
  isLoading,
  className,
  message,
  useSkeleton = true,
}: SectionLoaderProps) {
  if (!isLoading) return null;

  // Determine height based on section
  const getHeight = () => {
    switch (section) {
      case 'header':
        return 'h-16';
      case 'map':
        return 'h-[400px]';
      case 'table':
        return 'h-[300px]';
      case 'filters':
        return 'h-12';
      case 'stats':
        return 'h-24';
      default:
        return 'h-32';
    }
  };

  // Determine width based on section
  const getWidth = () => {
    switch (section) {
      case 'header':
      case 'filters':
        return 'w-full';
      case 'map':
        return 'w-full';
      case 'table':
        return 'w-full';
      case 'stats':
        return 'w-full';
      default:
        return 'w-full';
    }
  };

  if (useSkeleton) {
    return (
      <div className={cn('animate-pulse', getWidth(), getHeight(), className)}>
        <SkeletonLoader className="w-full h-full rounded-md" />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center', getWidth(), getHeight(), className)}>
      <LoadingSpinner size="md" showText text={message || `Loading ${section}...`} />
    </div>
  );
}
