'use client';

import { animationTiming, gradientColors } from '@/shared/utils/backgroundConfig';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { memo, useEffect, useRef, useState } from 'react';

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
    const [themeTransition, setThemeTransition] = useState(false);
    const prevThemeRef = useRef(theme);

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

    // Handle theme transitions more smoothly
    useEffect(() => {
      if (mounted && prevThemeRef.current !== theme) {
        // Theme is changing
        setThemeTransition(true);

        // Delay to align with other theme transitions
        const timer = setTimeout(() => {
          prevThemeRef.current = theme;
          setThemeTransition(false);
        }, 350); // Slightly longer than the theme transition duration

        return () => clearTimeout(timer);
      }
    }, [theme, mounted]);

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

    // Skip animations during theme transition to avoid visual conflicts
    const skipAnimation = themeTransition;
    const timings = {
      primary: skipAnimation ? 0 : animationTiming.animatedGradient.primary,
      secondary: skipAnimation ? 0 : animationTiming.animatedGradient.secondary,
    };

    // Mobile static version with transition support
    if (isMobile) {
      return (
        <div
          key={`bg-${theme}`}
          className={`fixed inset-0 z-0 transition-colors duration-300 ${className}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.primary.start}, ${colors.primary.end})`,
            backdropFilter: 'blur(8px)',
          }}
          aria-hidden="true"
          data-priority={isPriority ? 'high' : undefined}
        />
      );
    }

    // Desktop animated version with transition support
    return (
      <>
        {/* Primary animated layer */}
        <motion.div
          key={`primary-bg-${isDark ? 'dark' : 'light'}`}
          className={`fixed inset-0 z-0 ${className}`}
          style={{
            willChange: 'opacity, background',
            opacity: themeTransition ? 0.5 : 1, // Fade during transition
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: themeTransition ? 0.5 : 1,
            background: skipAnimation
              ? `radial-gradient(circle at 50% 50%, ${colors.primary.start}, ${colors.primary.end})`
              : [
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
              repeat: skipAnimation ? 0 : Number.POSITIVE_INFINITY,
              ease: 'linear',
            },
          }}
          aria-hidden="true"
          data-priority={isPriority ? 'high' : undefined}
        />

        {/* Secondary animated layer with transition support */}
        <motion.div
          key={`secondary-bg-${isDark ? 'dark' : 'light'}`}
          className={`fixed inset-0 z-0 opacity-50 ${className}`}
          style={{
            willChange: 'opacity, background',
            opacity: themeTransition ? 0.2 : 0.5, // Fade during transition
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: themeTransition ? 0.2 : 0.5,
            background: skipAnimation
              ? `radial-gradient(circle at 50% 50%, ${colors.primary.end}, transparent 50%)`
              : [
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
              repeat: skipAnimation ? 0 : Number.POSITIVE_INFINITY,
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
