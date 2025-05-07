'use client';

import { useEffect, useState } from 'react';

export interface AnimatedBackgroundSkeletonProps {
  /**
   * Children to render on top of the animated background
   */
  children: React.ReactNode;
  /**
   * Optional class name to apply to the container
   */
  className?: string;
  /**
   * Delay before showing the gradient background (ms)
   * @default 300
   */
  gradientDelay?: number;
  /**
   * Delay before showing the content (ms)
   * @default 600
   */
  contentDelay?: number;
  /**
   * Optional additional styling
   */
  style?: React.CSSProperties;
}

/**
 * AnimatedBackgroundSkeleton
 *
 * A reusable animated background skeleton component that provides
 * consistent transition animations for loading states.
 *
 * It starts with a black background, transitions to a gradient,
 * and then reveals content with a staggered animation.
 */
export function AnimatedBackgroundSkeleton({
  children,
  className = '',
  gradientDelay = 300,
  contentDelay = 600,
  style = {},
}: AnimatedBackgroundSkeletonProps) {
  // States for animation phases
  const [showGradient, setShowGradient] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Common gradient colors shared across the application
  const lightGradientStart = 'rgba(240, 240, 255, 0.7)';
  const lightGradientEnd = 'rgba(255, 255, 255, 0.5)';
  const darkGradientStart = 'rgba(50, 50, 80, 0.5)';
  const darkGradientEnd = 'rgba(30, 30, 60, 0.3)';

  // Handle transition animations
  useEffect(() => {
    // First show gradient after delay
    const gradientTimer = setTimeout(() => {
      setShowGradient(true);
    }, gradientDelay);

    // Then show content after additional delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, contentDelay);

    return () => {
      clearTimeout(gradientTimer);
      clearTimeout(contentTimer);
    };
  }, [gradientDelay, contentDelay]);

  return (
    <div className={`relative w-full min-h-screen ${className}`} style={style}>
      {/* Initial black background */}
      <div
        className={`fixed inset-0 z-0 bg-black transition-opacity duration-1000 ${
          showGradient ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Static backgrounds that match AnimatedBackground */}
      <div
        className={`fixed inset-0 z-0 dark:hidden transition-opacity duration-1000 ${
          showGradient ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${lightGradientStart}, ${lightGradientEnd})`,
          backdropFilter: 'blur(8px)',
        }}
      />
      <div
        className={`fixed inset-0 z-0 hidden dark:block transition-opacity duration-1000 ${
          showGradient ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${darkGradientStart}, ${darkGradientEnd})`,
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Semi-transparent overlay */}
      <div
        className={`fixed inset-0 bg-black/35 dark:bg-black/50 z-0 transition-opacity duration-1000 ${
          showGradient ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content container */}
      <div
        className={`relative z-10 max-w-5xl mx-auto transition-opacity duration-700 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
