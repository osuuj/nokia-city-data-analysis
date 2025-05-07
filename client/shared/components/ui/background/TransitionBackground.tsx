'use client';

import { animationTiming, gradientColors } from '@/shared/utils/backgroundConfig';
import { useTheme } from 'next-themes';
import { memo, useEffect, useState } from 'react';

interface TransitionBackgroundProps {
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
  /**
   * Whether to start with black background (for transitions from black)
   * @default true
   */
  fadeFromBlack?: boolean;
}

/**
 * TransitionBackground
 *
 * A background component with fade-in transitions.
 * Similar to AnimatedBackgroundSkeleton but refactored for better reuse.
 * Useful for loading states and page transitions.
 *
 * It fades from a black background to the gradient background,
 * and then reveals content with a staggered animation.
 */
export const TransitionBackground = memo(
  ({
    children,
    className = '',
    gradientDelay = animationTiming.delay.gradient,
    contentDelay = animationTiming.delay.content,
    style = {},
    fadeFromBlack = true,
  }: TransitionBackgroundProps) => {
    // States for animation phases
    const [showGradient, setShowGradient] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const { resolvedTheme: theme } = useTheme();
    const isDark = theme === 'dark';

    // Get the appropriate colors based on theme
    const themeColors = isDark ? gradientColors.dark : gradientColors.light;

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
        {/* Initial black background (if fadeFromBlack is true) */}
        {fadeFromBlack && (
          <div
            className={`fixed inset-0 z-0 bg-black transition-opacity duration-${animationTiming.duration.gradient} ${
              showGradient ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}

        {/* Light theme gradient background */}
        <div
          className={`fixed inset-0 z-0 dark:hidden transition-opacity duration-${animationTiming.duration.gradient} ${
            showGradient ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${gradientColors.light.primary.start}, ${gradientColors.light.primary.end})`,
            backdropFilter: 'blur(8px)',
          }}
        />

        {/* Dark theme gradient background */}
        <div
          className={`fixed inset-0 z-0 hidden dark:block transition-opacity duration-${animationTiming.duration.gradient} ${
            showGradient ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${gradientColors.dark.primary.start}, ${gradientColors.dark.primary.end})`,
            backdropFilter: 'blur(8px)',
          }}
        />

        {/* Semi-transparent overlay */}
        <div
          className={`fixed inset-0 bg-black/35 dark:bg-black/50 z-0 transition-opacity duration-${animationTiming.duration.overlay} ${
            showGradient ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Content container */}
        <div
          className={`relative z-10 max-w-5xl mx-auto transition-opacity duration-${animationTiming.duration.content} ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {children}
        </div>
      </div>
    );
  },
);

TransitionBackground.displayName = 'TransitionBackground';
