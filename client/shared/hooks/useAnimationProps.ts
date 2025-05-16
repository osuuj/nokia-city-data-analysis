import { useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Animation preset types
 */
export type AnimationPreset = 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scale';

/**
 * Default animation configuration
 */
const DEFAULT_ANIMATION = {
  duration: 0.5,
  delay: 0,
};

/**
 * Interface for animation options
 */
export interface AnimationOptions {
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Whether to run animation when element is in view */
  whileInView?: boolean;
  /** Whether to run animation only once */
  once?: boolean;
  /** Amount of element that needs to be in view before triggering animation (0-1) */
  threshold?: number;
  /** Custom initial animation values */
  initial?: Record<string, number | string | boolean>;
  /** Custom animate animation values */
  animate?: Record<string, number | string | boolean>;
}

/**
 * Hook to get animation properties based on user preferences
 *
 * @param preset - Animation preset to use
 * @param options - Animation options
 * @param index - Optional index for staggered animations
 * @returns Animation properties object to spread into a motion component
 *
 * @example
 * ```tsx
 * const animationProps = useAnimationProps('fadeInUp', { delay: 0.2 });
 * return <motion.div {...animationProps}>Content</motion.div>;
 * ```
 */
export function useAnimationProps(
  preset: AnimationPreset = 'fadeIn',
  options: AnimationOptions = {},
  index = 0,
) {
  const prefersReducedMotion = useReducedMotion();

  return useMemo(() => {
    // Return empty animation objects if user prefers reduced motion
    if (prefersReducedMotion) {
      return {};
    }

    const delay = options.delay !== undefined ? options.delay : index * 0.1;
    const duration = options.duration || DEFAULT_ANIMATION.duration;
    const useWhileInView = options.whileInView || false;

    // Preset animation configurations
    const presets = {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      },
      fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      },
      fadeInLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
      },
      fadeInRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
      },
      scale: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      },
    };

    // Get the selected preset
    const selectedPreset = presets[preset];

    // Mix custom values with preset values
    const initial = { ...selectedPreset.initial, ...options.initial };
    const animate = { ...selectedPreset.animate, ...options.animate };

    // Base animation props
    const animationProps = {
      initial,
      transition: { duration, delay },
    };

    // Add the correct animation target property
    if (useWhileInView) {
      return {
        ...animationProps,
        whileInView: animate,
        viewport: { once: options.once !== false, threshold: options.threshold || 0.2 },
      };
    }

    return {
      ...animationProps,
      animate,
    };
  }, [preset, options, prefersReducedMotion, index]);
}

export default useAnimationProps;
