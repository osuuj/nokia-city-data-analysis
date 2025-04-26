import type { ReactNode } from 'react';

/**
 * Base animation properties
 */
export interface AnimationProps {
  /** Content to be animated */
  children: ReactNode;
  /** Initial animation state */
  initial?: Record<string, number | string>;
  /** Animated state */
  animate?: Record<string, number | string>;
  /** Exit animation state */
  exit?: Record<string, number | string>;
  /** Animation transition configuration */
  transition?: {
    /** Duration of the animation in seconds */
    duration?: number;
    /** Delay before the animation starts in seconds */
    delay?: number;
    /** Easing function for the animation */
    ease?: string;
  };
  /** Additional CSS class name */
  className?: string;
}

/**
 * Fade-in animation properties
 */
export interface FadeInProps {
  /** Content to be animated */
  children: ReactNode;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Delay before the animation starts in seconds */
  delay?: number;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Slide-in animation properties
 */
export interface SlideInProps {
  /** Content to be animated */
  children: ReactNode;
  /** Direction of the slide animation */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Duration of the animation in seconds */
  duration?: number;
  /** Delay before the animation starts in seconds */
  delay?: number;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Scale-in animation properties
 */
export interface ScaleInProps {
  /** Content to be animated */
  children: ReactNode;
  /** Scale factor for the animation */
  scale?: number;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Delay before the animation starts in seconds */
  delay?: number;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Animation hook options
 */
export interface AnimationOptions {
  /** Threshold for triggering the animation (0-1) */
  threshold?: number;
  /** Whether to trigger the animation only once */
  triggerOnce?: boolean;
  /** Root margin for the intersection observer */
  rootMargin?: string;
}

/**
 * Scroll animation hook options
 */
export interface ScrollAnimationOptions {
  /** Whether to disable the animation */
  disabled?: boolean;
  /** Custom scroll container */
  container?: HTMLElement | null;
}

/**
 * Animation result from hooks
 */
export interface AnimationResult {
  /** Ref to attach to the element to be animated */
  ref: React.RefObject<HTMLElement>;
  /** Whether the element is in view */
  inView: boolean;
  /** Animation controls */
  controls?: {
    /** Start the animation */
    start: (
      variants?: Record<string, string | number | Record<string, string | number>>,
    ) => Promise<void>;
    /** Stop the animation */
    stop: () => void;
  };
}

/**
 * Scroll animation result
 */
export interface ScrollAnimationResult {
  /** Ref to attach to the element to be animated */
  ref: React.RefObject<HTMLElement>;
  /** Progress of the animation (0-1) */
  progress: number;
  /** Whether the element is in view */
  inView: boolean;
}

/**
 * Animation variants
 */
export type AnimationVariants = Record<string, Record<string, number | string>>;

/**
 * Animation transition
 */
export type AnimationTransition = {
  /** Duration of the animation in seconds */
  duration?: number;
  /** Delay before the animation starts in seconds */
  delay?: number;
  /** Easing function for the animation */
  ease?: string;
  /** Whether to animate children */
  staggerChildren?: number;
};

/**
 * Animation keyframes
 */
export type AnimationKeyframes = Record<string, (number | string)[]>;
