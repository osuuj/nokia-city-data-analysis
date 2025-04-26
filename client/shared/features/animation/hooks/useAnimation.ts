'use client';

import { AnimationControls, useAnimation as useFramerAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { AnimationOptions, AnimationResult } from '../types';

/**
 * Hook for creating animations based on element visibility
 *
 * @param options Animation options
 * @returns Animation result with ref and inView state
 *
 * @example
 * ```tsx
 * const { ref, inView, controls } = useAnimation({
 *   threshold: 0.5,
 *   triggerOnce: true
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {inView ? 'Element is in view' : 'Element is out of view'}
 *   </div>
 * );
 * ```
 */
export function useAnimation(options: AnimationOptions = {}): AnimationResult {
  const { threshold = 0.1, triggerOnce = false, rootMargin = '0px' } = options;

  const framerControls = useFramerAnimation();
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  useEffect(() => {
    if (inView) {
      framerControls.start('visible');
    } else {
      framerControls.start('hidden');
    }
  }, [framerControls, inView]);

  // Create a compatible controls object
  const controls = {
    start: (variants?: Record<string, string | number | Record<string, string | number>>) => {
      return framerControls.start(variants);
    },
    stop: () => {
      framerControls.stop();
    },
  };

  return {
    ref: ref as unknown as React.RefObject<HTMLElement>,
    inView,
    controls,
  };
}
