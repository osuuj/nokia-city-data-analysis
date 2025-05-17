'use client';

import { usePrefetchData } from '@/shared/hooks/api/usePrefetchData';
import { useEffect, useRef, useState } from 'react';

/**
 * Props for the LandingPagePrefetcher component
 */
interface LandingPagePrefetcherProps {
  /**
   * Delay in milliseconds before starting prefetch
   * Set to 0 to prefetch immediately after mount
   */
  prefetchDelay?: number;
}

/**
 * Optimized component that selectively prefetches essential data in the background
 * - Only prefetches city list (small payload)
 * - Does NOT prefetch company data to prevent navigation issues
 * - Properly handles abort signals when navigating away
 *
 * @example
 * <LandingPagePrefetcher prefetchDelay={1500} />
 */
export function LandingPagePrefetcher({ prefetchDelay = 1000 }: LandingPagePrefetcherProps) {
  const [isClient, setIsClient] = useState(false);
  const [shouldPrefetch, setShouldPrefetch] = useState(prefetchDelay === 0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Set up client-side initialization and cleanup
  useEffect(() => {
    // Set client-side flag
    setIsClient(true);

    // Create a new AbortController for this component lifecycle
    abortControllerRef.current = new AbortController();

    // Set up delay for prefetching if needed
    let timer: NodeJS.Timeout | undefined;

    if (prefetchDelay > 0) {
      timer = setTimeout(() => {
        setShouldPrefetch(true);
        console.debug('Starting background city list prefetching');
      }, prefetchDelay);
    }

    // Cleanup function
    return () => {
      // Clear timer if it exists
      if (timer) clearTimeout(timer);

      // Abort any in-flight requests when unmounting
      if (abortControllerRef.current) {
        console.debug('Aborting in-flight prefetch requests');
        abortControllerRef.current.abort();
      }
    };
  }, [prefetchDelay]);

  // Use the shared prefetch hook with conservative settings
  usePrefetchData({
    prefetchCityList: true, // Only prefetch city list (small payload)
    prefetchCompanyData: false, // Disable company data prefetching
    citiesToPrefetch: [], // No cities to prefetch
    shouldPrefetch: isClient && shouldPrefetch,
    abortSignal: abortControllerRef.current?.signal, // Pass abort signal to the fetch requests
  });

  // Hidden component - doesn't render anything visible
  return <span className="hidden" aria-hidden="true" />;
}
