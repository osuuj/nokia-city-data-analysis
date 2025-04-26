'use client';

import { cn } from '@/shared/utils/cn';
import { transitionClasses } from '@/shared/utils/transitions';
import { type ReactNode, memo, useEffect, useState } from 'react';

export interface TransitionProps {
  /**
   * Whether the transition is active
   */
  show?: boolean;
  /**
   * The type of transition to use
   */
  type?: keyof typeof transitionClasses;
  /**
   * The content to transition
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Callback when transition completes
   */
  onComplete?: () => void;
  /**
   * Whether to unmount the component when hidden
   */
  unmount?: boolean;
}

/**
 * Transition component
 * Wraps content with a transition animation
 */
function TransitionComponent({
  show = true,
  type = 'fade',
  children,
  className,
  onComplete,
  unmount = true,
}: TransitionProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show !== isVisible) {
      setIsVisible(show);
      setIsAnimating(true);
    }
  }, [show, isVisible]);

  // Handle animation end
  const handleTransitionEnd = () => {
    setIsAnimating(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isAnimating && !isVisible && unmount) return null;

  const classes = transitionClasses[type];

  return (
    <div
      className={cn(
        classes.enter,
        isVisible ? classes.enterTo : classes.leaveTo,
        isAnimating && 'transition-all',
        className,
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const Transition = memo(TransitionComponent);
