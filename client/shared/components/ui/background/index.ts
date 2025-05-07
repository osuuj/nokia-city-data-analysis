/**
 * Background Components
 *
 * A collection of background components for consistent styling across the application.
 */

// Export components
export * from './AnimatedBackground';
export * from './StaticBackground';
export * from './TransitionBackground';

// Export background configuration from utils
export { gradientColors, animationTiming } from '@/shared/utils/backgroundConfig';
