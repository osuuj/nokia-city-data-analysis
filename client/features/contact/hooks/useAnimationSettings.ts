'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

/**
 * Hook to determine whether to use animations based on user preferences and device
 * @returns Animation-related settings and props
 */
export function useAnimationSettings() {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Efficient mobile detection using matchMedia
  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Initial check
    handleMobileChange(mobileMediaQuery);

    // Add listener with browser compatibility
    if (typeof mobileMediaQuery.addEventListener === 'function') {
      mobileMediaQuery.addEventListener('change', handleMobileChange);
      return () => mobileMediaQuery.removeEventListener('change', handleMobileChange);
    }

    // Fallback for older browsers
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine if animations should be used
  const shouldAnimate = useMemo(() => {
    return !prefersReducedMotion && !isMobile;
  }, [prefersReducedMotion, isMobile]);

  // Motion props based on animation preference
  const fadeInProps = useMemo(() => {
    return shouldAnimate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        }
      : {};
  }, [shouldAnimate]);

  // Header animation props
  const headerFadeInProps = useMemo(() => {
    return shouldAnimate
      ? {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
        }
      : {};
  }, [shouldAnimate]);

  return {
    isMobile,
    shouldAnimate,
    fadeInProps,
    headerFadeInProps,
    prefersReducedMotion,
  };
}
