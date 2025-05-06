'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * AnimatedBackground
 * A reusable component that creates an animated gradient background.
 * Used on Resources, About, and Contact pages.
 *
 * Performance optimized: uses static backgrounds on mobile devices.
 */
export const AnimatedBackground = () => {
  const { resolvedTheme: theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if mobile device
    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If not mounted yet, return an empty div with the same sizing
  if (!mounted) {
    return <div className="fixed inset-0 z-0" />;
  }

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  // Static background style for mobile devices
  const staticBackground = {
    backgroundImage:
      theme === 'dark'
        ? 'radial-gradient(circle at 50% 50%, rgba(50, 50, 80, 0.5), rgba(30, 30, 60, 0.3))'
        : 'radial-gradient(circle at 50% 50%, rgba(240, 240, 255, 0.7), rgba(255, 255, 255, 0.5))',
  };

  // For mobile devices, return static background
  if (isMobile) {
    return <div className="fixed inset-0 z-0" style={staticBackground} />;
  }

  // Only use animations on desktop devices
  return (
    <>
      {/* Primary animated layer */}
      <motion.div
        key={`primary-${theme}`} // Force remount when theme changes
        className="fixed inset-0 z-0"
        animate={{
          background: [
            `radial-gradient(circle at 20% 20%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 80% 80%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 80% 20%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 20% 80%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 20% 20%, ${gradientStart}, transparent 60%)`,
          ],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />

      {/* Secondary animated layer */}
      <motion.div
        key={`secondary-${theme}`} // Force remount when theme changes
        className="fixed inset-0 z-0 opacity-50"
        animate={{
          background: [
            `radial-gradient(circle at 80% 80%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 20% 20%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 20% 80%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 80% 20%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 80% 80%, ${gradientEnd}, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />
    </>
  );
};
