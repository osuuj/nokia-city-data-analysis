'use client';

import { useInView, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { ScrollAnimationOptions, ScrollAnimationResult } from '../types';

/**
 * Hook for creating scroll-based animations
 *
 * @param options Scroll animation options
 * @returns Scroll animation result with ref, progress, and inView state
 *
 * @example
 * ```tsx
 * const { ref, progress, inView } = useScrollAnimation();
 *
 * return (
 *   <div ref={ref} style={{ opacity: progress }}>
 *     Content that animates based on scroll position
 *   </div>
 * );
 * ```
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}): ScrollAnimationResult {
  const { disabled = false, container = null } = options;

  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: container || undefined,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    if (disabled) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setProgress(latest);
    });

    return () => unsubscribe();
  }, [scrollYProgress, disabled]);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      {
        root: container,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [container]);

  return { ref, progress, inView };
}
