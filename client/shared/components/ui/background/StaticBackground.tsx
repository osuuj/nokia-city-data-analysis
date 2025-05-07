'use client';

import { useTheme } from 'next-themes';
import { memo, useEffect, useState } from 'react';
import { gradientColors } from './config';

interface StaticBackgroundProps {
  /**
   * Visual priority of the background (high for important content)
   * @default 'low'
   */
  priority?: 'high' | 'low';
  /**
   * Whether to show the additional overlay for better content visibility
   * @default true
   */
  showOverlay?: boolean;
  /**
   * Additional class name for the background
   */
  className?: string;
}

/**
 * StaticBackground
 *
 * A simpler, non-animated background component that provides consistent styling.
 * Use this for pages where animation might be distracting or when performance is a concern.
 *
 * @param props.priority - Set to 'high' to optimize for LCP (Largest Contentful Paint)
 * @param props.showOverlay - Whether to show the semi-transparent overlay for better content visibility
 * @param props.className - Additional class names to apply to the container
 */
export const StaticBackground = memo(
  ({ priority = 'low', showOverlay = true, className = '' }: StaticBackgroundProps = {}) => {
    const { resolvedTheme: theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isPriority = priority === 'high';

    // Set mounted state
    useEffect(() => {
      setMounted(true);
    }, []);

    // Early return for server-side rendering
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

    return (
      <>
        {/* Static gradient background */}
        <div
          className={`fixed inset-0 z-0 ${className}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${
              colors.primary.start
            }, ${colors.primary.end})`,
            backdropFilter: 'blur(8px)',
          }}
          aria-hidden="true"
          data-priority={isPriority ? 'high' : undefined}
        />

        {/* Optional overlay for better content visibility */}
        {showOverlay && (
          <div
            className={`fixed inset-0 z-0 ${className}`}
            style={{
              backgroundColor: colors.overlay,
            }}
            aria-hidden="true"
          />
        )}
      </>
    );
  },
);

StaticBackground.displayName = 'StaticBackground';
