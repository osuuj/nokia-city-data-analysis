'use client';

import { usePrefetchData } from '@/shared/hooks/api/usePrefetchData';
import { useEffect, useRef, useState } from 'react';

interface LandingPagePrefetcherProps {
  prefetchDelay?: number;
}

/**
 * Optimized component that selectively prefetches essential data in the background
 * - Only prefetches city list (small payload)
 * - Does NOT prefetch company data to prevent navigation issues
 * - Properly handles abort signals when navigating away
 */
export function LandingPagePrefetcher({ prefetchDelay = 1000 }: LandingPagePrefetcherProps) {
  const [isClient, setIsClient] = useState(false);
  const [shouldPrefetch, setShouldPrefetch] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Set isClient after component mounts and create abort controller
  useEffect(() => {
    setIsClient(true);

    // Create a new AbortController for this component lifecycle
    abortControllerRef.current = new AbortController();

    // Set up delay for prefetching
    if (prefetchDelay > 0) {
      const timer = setTimeout(() => {
        setShouldPrefetch(true);
        console.debug('Starting background city list prefetching');
      }, prefetchDelay);

      return () => {
        clearTimeout(timer);
        // Abort any in-flight requests when unmounting
        if (abortControllerRef.current) {
          console.debug('Aborting in-flight prefetch requests');
          abortControllerRef.current.abort();
        }
      };
    }

    setShouldPrefetch(true);

    return () => {
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
