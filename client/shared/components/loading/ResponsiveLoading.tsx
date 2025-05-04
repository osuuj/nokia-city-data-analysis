'use client';

import { useLoading } from '@/shared/context/loading';
import { Spinner } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ResponsiveLoadingProps {
  /** Minimum loading time in ms to avoid flickering */
  minLoadingTime?: number;
}

/**
 * ResponsiveLoading component that displays a loading indicator
 * when navigating between pages or when a loading state is active.
 *
 * @param props - Component props
 * @returns JSX.Element | null
 */
export const ResponsiveLoading = ({ minLoadingTime = 300 }: ResponsiveLoadingProps) => {
  const [showLoading, setShowLoading] = useState(false);
  const [latestPathname, setLatestPathname] = useState<string>('');
  const currentPathname = usePathname() || '';
  const loading = useLoading();

  // Track navigation changes
  useEffect(() => {
    if (latestPathname && latestPathname !== currentPathname) {
      setShowLoading(true);

      const timer = setTimeout(() => {
        setShowLoading(false);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }

    // Update latest pathname after initial render
    if (currentPathname && !latestPathname) {
      setLatestPathname(currentPathname);
    } else if (currentPathname !== latestPathname) {
      setLatestPathname(currentPathname);
    }
  }, [currentPathname, latestPathname, minLoadingTime]);

  // Also show when loading context is active
  useEffect(() => {
    if (loading?.isLoading) {
      setShowLoading(true);
    } else if (!loading?.isLoading && showLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [loading?.isLoading, minLoadingTime, showLoading]);

  if (!showLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] flex justify-center pt-4 pointer-events-none">
      <div className="bg-background/80 backdrop-blur-md shadow-md rounded-full py-1 px-4 flex items-center gap-2">
        <Spinner size="sm" color="primary" />
        <span className="text-sm text-default-700 dark:text-default-400">
          {loading?.currentLoadingState?.message || 'Loading...'}
        </span>
      </div>
    </div>
  );
};
