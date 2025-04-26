import type { CSSProperties } from 'react';

/**
 * Transition timing options
 */
export type TransitionTiming = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Transition direction options
 */
export type TransitionDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Base transition options
 */
export interface TransitionOptions {
  duration?: number;
  delay?: number;
  timing?: TransitionTiming;
  direction?: TransitionDirection;
}

/**
 * Get transition styles for fade animation
 */
export function getFadeTransition(options: TransitionOptions = {}): CSSProperties {
  const { duration = 300, delay = 0, timing = 'ease-in-out' } = options;

  return {
    transition: `opacity ${duration}ms ${timing} ${delay}ms`,
  };
}

/**
 * Get transition styles for slide animation
 */
export function getSlideTransition(options: TransitionOptions = {}): CSSProperties {
  const { duration = 300, delay = 0, timing = 'ease-in-out', direction = 'down' } = options;

  const transform = {
    up: 'translateY(-100%)',
    down: 'translateY(100%)',
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
  }[direction];

  return {
    transition: `transform ${duration}ms ${timing} ${delay}ms`,
    transform,
  };
}

/**
 * Get transition styles for scale animation
 */
export function getScaleTransition(options: TransitionOptions = {}): CSSProperties {
  const { duration = 300, delay = 0, timing = 'ease-in-out' } = options;

  return {
    transition: `transform ${duration}ms ${timing} ${delay}ms`,
    transform: 'scale(0)',
  };
}

/**
 * Get transition styles for rotate animation
 */
export function getRotateTransition(options: TransitionOptions = {}): CSSProperties {
  const { duration = 300, delay = 0, timing = 'ease-in-out' } = options;

  return {
    transition: `transform ${duration}ms ${timing} ${delay}ms`,
    transform: 'rotate(0deg)',
  };
}

/**
 * Common transition class names for Tailwind CSS
 */
export const transitionClasses = {
  fade: {
    enter: 'transition-opacity duration-300 ease-in-out',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'transition-opacity duration-300 ease-in-out',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  },
  slide: {
    enter: 'transition-transform duration-300 ease-in-out',
    enterFrom: 'translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transition-transform duration-300 ease-in-out',
    leaveFrom: 'translate-y-0',
    leaveTo: 'translate-y-full',
  },
  scale: {
    enter: 'transition-transform duration-300 ease-in-out',
    enterFrom: 'scale-0',
    enterTo: 'scale-100',
    leave: 'transition-transform duration-300 ease-in-out',
    leaveFrom: 'scale-100',
    leaveTo: 'scale-0',
  },
  rotate: {
    enter: 'transition-transform duration-300 ease-in-out',
    enterFrom: 'rotate-0',
    enterTo: 'rotate-360',
    leave: 'transition-transform duration-300 ease-in-out',
    leaveFrom: 'rotate-360',
    leaveTo: 'rotate-0',
  },
};
