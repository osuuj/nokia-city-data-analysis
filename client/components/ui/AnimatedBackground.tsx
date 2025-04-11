'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import React from 'react';

/**
 * AnimatedBackground
 * A reusable component that creates an animated gradient background.
 * Used on Resources, About, and Contact pages.
 */
export const AnimatedBackground = () => {
  const { resolvedTheme: theme } = useTheme();

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  return (
    <>
      {/* Primary animated layer */}
      <motion.div
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
