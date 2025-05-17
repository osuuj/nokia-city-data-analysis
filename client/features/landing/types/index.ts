/**
 * Landing Feature Types
 *
 * This file contains TypeScript type definitions for the landing feature.
 */

import type { ReactNode } from 'react';

/**
 * Props for the Hero component.
 */
export interface HeroProps {
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Props for the ButtonStart component.
 */
export interface ButtonStartProps {
  /** Text to display on the button */
  label?: string;
  /** URL to navigate to when the button is clicked */
  href?: string;
  /** Optional className for custom styling */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Callback function to execute when the button is clicked */
  onPress?: () => void;
  /** ARIA label (defaults to label prop) */
  'aria-label'?: string;
}

/**
 * Props for the LandingErrorBoundary component.
 */
export interface LandingErrorBoundaryProps {
  /** Children to render if no error occurs */
  children: ReactNode;
  /** Optional fallback component to render when an error occurs */
  fallback?: ReactNode;
}

/**
 * State for the LandingErrorBoundary component.
 */
export interface LandingErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
}

/**
 * Props for the HeroSkeleton component.
 */
export interface HeroSkeletonProps {
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Video loading state.
 */
export interface VideoLoadingState {
  /** Whether the video is loading */
  isLoading: boolean;
  /** Whether the video has an error */
  hasError: boolean;
  /** The error message if the video has an error */
  errorMessage?: string;
}
