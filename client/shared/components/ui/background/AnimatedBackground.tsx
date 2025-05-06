'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { memo, useEffect, useMemo, useState } from 'react';

interface AnimatedBackgroundProps {
  priority?: 'high' | 'low';
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
 */
export const AnimatedBackground = memo(({ priority = 'low' }: AnimatedBackgroundProps = {}) => {
  const { resolvedTheme: theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isPriority = priority === 'high';

  // Define gradient colors based on theme - memoize to prevent recalculation
  const gradientColors = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      gradientStart: isDark ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)',
      gradientEnd: isDark ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)',
      isDark,
    };
  }, [theme]);

  // Setup mobile detection and basic initialization
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
        className="fixed inset-0 z-0"
        aria-hidden="true"
        data-priority={isPriority ? 'high' : undefined}
      />
    );
  }

  const { gradientStart, gradientEnd, isDark } = gradientColors;

  // Static background for mobile devices - optimized for performance
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-0"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(30, 30, 60, 0.8), rgba(20, 20, 40, 0.6))'
            : 'linear-gradient(to bottom, rgba(240, 240, 255, 0.8), rgba(255, 255, 255, 0.6))',
        }}
        aria-hidden="true"
        data-priority={isPriority ? 'high' : undefined}
      />
    );
  }

  // Use simplified animation for high priority cases
  const animationDuration = isPriority ? 30 : 25;
  const secondaryDuration = isPriority ? 25 : 20;

  // Desktop animated version
  return (
    <>
      {/* Primary animated layer */}
      <motion.div
        key={`primary-${theme}`} // Force remount when theme changes
        className="fixed inset-0 z-0"
        style={{ willChange: 'opacity, background' }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          background: [
            `radial-gradient(circle at 20% 20%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 80% 80%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 80% 20%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 20% 80%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 20% 20%, ${gradientStart}, transparent 60%)`,
          ],
        }}
        transition={{
          opacity: { duration: 0.3 },
          background: {
            duration: animationDuration,
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
        className="fixed inset-0 z-0 opacity-50"
        style={{ willChange: 'opacity, background' }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.5,
          background: [
            `radial-gradient(circle at 80% 80%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 20% 20%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 20% 80%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 80% 20%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 80% 80%, ${gradientEnd}, transparent 50%)`,
          ],
        }}
        transition={{
          opacity: { duration: 0.3 },
          background: {
            duration: secondaryDuration,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          },
        }}
        aria-hidden="true"
      />
    </>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';
