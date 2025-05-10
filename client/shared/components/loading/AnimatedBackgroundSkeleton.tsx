'use client';

import { TransitionBackground } from '@/shared/components/ui/background';
import type { ReactNode } from 'react';

export interface AnimatedBackgroundSkeletonProps {
  /**
   * Children to render on top of the animated background
   */
  children: ReactNode;
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
 * @deprecated Use TransitionBackground from '@/shared/components/ui/background' instead.
 * This component is kept for backward compatibility and will be removed in a future release.
 */
export function AnimatedBackgroundSkeleton({
  children,
  className = '',
  gradientDelay = 300,
  contentDelay = 600,
  style = {},
}: AnimatedBackgroundSkeletonProps) {
  // Use the new TransitionBackground component
  return (
    <TransitionBackground
      className={className}
      gradientDelay={gradientDelay}
      contentDelay={contentDelay}
      style={style}
      fadeFromBlack={true}
    >
      {children}
    </TransitionBackground>
  );
}
