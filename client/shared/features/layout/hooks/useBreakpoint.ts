'use client';

import { useEffect, useState } from 'react';
import type { Breakpoint, BreakpointOptions } from '../types';
import { getBreakpoint } from '../utils/responsive';

/**
 * Hook for accessing the current breakpoint
 *
 * @param options Hook options
 * @returns Current breakpoint
 *
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint();
 *
 * return (
 *   <div>
 *     Current breakpoint: {breakpoint}
 *   </div>
 * );
 * ```
 */
export function useBreakpoint(options: BreakpointOptions = {}): Breakpoint {
  const { defaultBreakpoint = 'xs' } = options;
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(defaultBreakpoint);

  useEffect(() => {
    // Function to update breakpoint based on window width
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const newBreakpoint = getBreakpoint(width);
      setBreakpoint(newBreakpoint);
    };

    // Initial update
    updateBreakpoint();

    // Add event listener for window resize
    window.addEventListener('resize', updateBreakpoint);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return breakpoint;
}
