'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { memo, useEffect, useMemo, useState } from 'react';

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
 */
export const AnimatedBackground = memo(() => {
  const { resolvedTheme: theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    return <div className="fixed inset-0 z-0" aria-hidden="true" />;
  }

  const { gradientStart, gradientEnd, isDark } = gradientColors;

  // Static background for mobile devices
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle at 50% 50%, rgba(50, 50, 80, 0.5), rgba(30, 30, 60, 0.3))'
            : 'radial-gradient(circle at 50% 50%, rgba(240, 240, 255, 0.7), rgba(255, 255, 255, 0.5))',
        }}
        aria-hidden="true"
      />
    );
  }

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
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          },
        }}
        aria-hidden="true"
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
            duration: 20,
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
