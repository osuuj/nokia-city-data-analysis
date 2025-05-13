'use client';

import { animationTiming, gradientColors } from '@/shared/utils/backgroundConfig';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { memo, useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  /**
   * Visual priority of the animation
   * Set to 'high' for important pages that load immediately
   * @default 'low'
   */
  priority?: 'high' | 'low';
  /**
   * Additional class name for the background container
   */
  className?: string;
}

/**
 * AnimatedBackground
 * A reusable component that creates an animated gradient background.
 * Used on Resources, About, and Contact pages.
 *
 * Performance optimized:
 * - Uses static backgrounds on mobile devices
 * - Simplified approach with fewer state changes
 * - Uses will-change for hardware acceleration
 * - Properly memoizes gradient values
 *
 * @param props.priority - Set to 'high' to indicate importance for LCP optimization
 * @param props.className - Additional class names to apply
 */
export const AnimatedBackground = memo(
  ({ priority = 'low', className = '' }: AnimatedBackgroundProps = {}) => {
    const { resolvedTheme: theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const isPriority = priority === 'high';

    // Setup mobile detection and initialization
    useEffect(() => {
      // Set mounted state
      setMounted(true);

      // Simple mobile check
      setIsMobile(window.innerWidth <= 768);

      // Simple resize handler with debounce
      let resizeTimer: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setIsMobile(window.innerWidth <= 768);
        }, 100);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
      };
    }, []);

    // If not mounted yet, return an empty div with the same sizing
    if (!mounted) {
      return (
        <div
          className={`fixed inset-0 z-0 ${className}`}
          aria-hidden="true"
          data-priority={isPriority ? 'high' : undefined}
        />
      );
    }

    const isDark = theme === 'dark';
    const colors = isDark ? gradientColors.dark : gradientColors.light;

    // Static background for mobile devices - optimized for performance
    if (isMobile) {
      return (
        <div
          className={`fixed inset-0 z-0 ${className}`}
          style={{
            background: isDark
              ? `linear-gradient(to bottom, ${gradientColors.dark.primary.start}, ${gradientColors.dark.primary.end})`
              : `linear-gradient(to bottom, ${gradientColors.light.primary.start}, ${gradientColors.light.primary.end})`,
          }}
          aria-hidden="true"
          data-priority={isPriority ? 'high' : undefined}
        />
      );
    }

    // Use animation durations based on priority
    const timings = isPriority
      ? {
          primary: animationTiming.animatedGradient.highPriority.primary,
          secondary: animationTiming.animatedGradient.highPriority.secondary,
        }
      : {
          primary: animationTiming.animatedGradient.primary,
          secondary: animationTiming.animatedGradient.secondary,
        };

    // Desktop animated version
    return (
      <>
        {/* Primary animated layer */}
        <motion.div
          key={`primary-${theme}`} // Force remount when theme changes
          className={`fixed inset-0 z-0 ${className}`}
          style={{ willChange: 'opacity, background' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            background: [
              `radial-gradient(circle at 20% 20%, ${colors.primary.start}, transparent 60%)`,
              `radial-gradient(circle at 80% 80%, ${colors.primary.start}, transparent 60%)`,
              `radial-gradient(circle at 80% 20%, ${colors.primary.start}, transparent 60%)`,
              `radial-gradient(circle at 20% 80%, ${colors.primary.start}, transparent 60%)`,
              `radial-gradient(circle at 20% 20%, ${colors.primary.start}, transparent 60%)`,
            ],
          }}
          transition={{
            opacity: { duration: 0.3 },
            background: {
              duration: timings.primary,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            },
          }}
          aria-hidden="true"
          data-priority={isPriority ? 'high' : undefined}
        />

        {/* Secondary animated layer */}
        <motion.div
          key={`secondary-${theme}`} // Force remount when theme changes
          className={`fixed inset-0 z-0 opacity-50 ${className}`}
          style={{ willChange: 'opacity, background' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.5,
            background: [
              `radial-gradient(circle at 80% 80%, ${colors.primary.end}, transparent 50%)`,
              `radial-gradient(circle at 20% 20%, ${colors.primary.end}, transparent 50%)`,
              `radial-gradient(circle at 20% 80%, ${colors.primary.end}, transparent 50%)`,
              `radial-gradient(circle at 80% 20%, ${colors.primary.end}, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, ${colors.primary.end}, transparent 50%)`,
            ],
          }}
          transition={{
            opacity: { duration: 0.3 },
            background: {
              duration: timings.secondary,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            },
          }}
          aria-hidden="true"
        />
      </>
    );
  },
);

AnimatedBackground.displayName = 'AnimatedBackground';
