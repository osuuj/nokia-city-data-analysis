/**
 * Background Theme Configuration
 *
 * This file contains theme constants for background components including:
 * - Gradient colors for light and dark themes
 * - Animation timing configurations for transitions
 *
 * Use these values to ensure consistency across different background components.
 */

/**
 * Common gradient colors for light and dark themes
 */
export const gradientColors = {
  // Light theme
  light: {
    // Primary gradient colors
    primary: {
      start: 'rgba(240, 240, 255, 0.7)',
      end: 'rgba(255, 255, 255, 0.5)',
    },
    // Secondary overlay colors
    overlay: 'rgba(0, 0, 0, 0.35)',
  },

  // Dark theme
  dark: {
    // Primary gradient colors
    primary: {
      start: 'rgba(50, 50, 80, 0.5)',
      end: 'rgba(30, 30, 60, 0.3)',
    },
    // Secondary overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

/**
 * Animation durations and timing for animated backgrounds
 */
export const animationTiming = {
  // Standard animation durations
  duration: {
    gradient: 1000, // 1s for gradient transition
    content: 700, // 0.7s for content transition
    overlay: 1000, // 1s for overlay transition
  },
  // Animation delays
  delay: {
    gradient: 300, // 0.3s delay before gradient appears
    content: 600, // 0.6s delay before content appears
  },
  // Animated gradient timing (in seconds)
  animatedGradient: {
    primary: 25, // 25s for primary animation
    secondary: 20, // 20s for secondary animation
    highPriority: {
      primary: 30, // 30s for high priority primary animation
      secondary: 25, // 25s for high priority secondary animation
    },
  },
};
