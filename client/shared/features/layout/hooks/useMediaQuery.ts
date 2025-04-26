'use client';

import { useEffect, useState } from 'react';
import type { MediaQueryOptions } from '../types';

/**
 * Hook for responding to media queries
 *
 * @param query Media query string
 * @param options Hook options
 * @returns Whether the media query matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * return (
 *   <div>
 *     {isMobile ? 'Mobile View' : 'Desktop View'}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery(query: string, options: MediaQueryOptions = {}): boolean {
  const { defaultMatches = false } = options;
  const [matches, setMatches] = useState(defaultMatches);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Function to update matches state
    const updateMatches = (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    };

    // Initial check
    updateMatches(mediaQuery);

    // Add event listener for media query changes
    mediaQuery.addEventListener('change', updateMatches);

    // Clean up event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}
