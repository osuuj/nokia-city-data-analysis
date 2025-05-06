'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { memo, useEffect, useState } from 'react';

/**
 * AnimatedBackground
 * A reusable component that creates an animated gradient background.
 * Used on Resources, About, and Contact pages.
 *
 * Performance optimized:
 * - Uses static backgrounds on mobile devices
 * - Defers animation startup on all devices
 * - Memoized to prevent unnecessary re-renders
 */
export const AnimatedBackground = memo(() => {
  const { resolvedTheme: theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if mobile device
    const checkMobile = () => window.innerWidth <= 768;
    setIsMobile(checkMobile());

    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    // Defer animations until after content loads
    const markContentLoaded = () => {
      // Use requestIdleCallback for browsers that support it
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => setIsContentLoaded(true));
      } else {
        // Fallback to setTimeout for older browsers
        setTimeout(() => setIsContentLoaded(true), 1000);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', markContentLoaded);

    // Mark content loaded even if load event already fired
    if (document.readyState === 'complete') {
      markContentLoaded();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', markContentLoaded);
    };
  }, []);

  // If not mounted yet, return an empty div with the same sizing
  if (!mounted) {
    return <div className="fixed inset-0 z-0" aria-hidden="true" />;
  }

  // Define gradient colors based on theme
  const isDark = theme === 'dark';
  const gradientStart = isDark ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = isDark ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  // Static background for mobile devices or when animations are deferred
  if (isMobile || !isContentLoaded) {
    // For both mobile and initial desktop load - use static background for better performance
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

  // Only use animations on desktop devices after content has loaded
  return (
    <>
      {/* Primary animated layer */}
      <motion.div
        key={`primary-${theme}`} // Force remount when theme changes
        className="fixed inset-0 z-0"
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
          opacity: { duration: 0.5 },
          background: {
            duration: 20,
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
          opacity: { duration: 0.5 },
          background: {
            duration: 15,
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
