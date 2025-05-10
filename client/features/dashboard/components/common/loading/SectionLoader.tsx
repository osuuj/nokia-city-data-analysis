'use client';

import { FadeIn } from '../Animations';

/**
 * Dashboard sections that can be in a loading state
 */
export type DashboardLoadingSection =
  | 'header'
  | 'map'
  | 'table'
  | 'filters'
  | 'stats'
  | 'analytics';

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
      case 'analytics':
        return 'h-[450px]';
      default:
        return 'h-32';
    }
  };

  // Determine width based on section
  const getWidth = () => {
    switch (section) {
      case 'header':
      case 'filters':
      case 'map':
      case 'table':
      case 'stats':
      case 'analytics':
        return 'w-full';
      default:
        return 'w-full';
    }
  };

  if (useSkeleton) {
    return (
      <FadeIn>
        <div className={`animate-pulse ${getWidth()} ${getHeight()} ${className || ''}`}>
          <div className="w-full h-full rounded-md bg-default-100" />
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div
        className={`flex items-center justify-center ${getWidth()} ${getHeight()} ${className || ''}`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
          <p className="text-sm text-default-500">{message || `Loading ${section}...`}</p>
        </div>
      </div>
    </FadeIn>
  );
}
