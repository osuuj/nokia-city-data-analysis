'use client';

import { cn } from '@/shared/utils/cn';
import { LoadingSpinner } from './LoadingSpinner';

export interface LoadingOverlayProps {
  /**
   * Whether the overlay is visible
   * @default true
   */
  visible?: boolean;
  /**
   * The message to display below the spinner
   * @default "Loading..."
   */
  message?: string;
  /**
   * Additional CSS classes to apply to the overlay
   */
  className?: string;
  /**
   * Whether to blur the background
   * @default true
   */
  blur?: boolean;
  /**
   * The z-index of the overlay
   * @default 50
   */
  zIndex?: number;
}

/**
 * LoadingOverlay component
 * A full-screen overlay with a loading spinner and message
 */
export function LoadingOverlay({
  visible = true,
  message = 'Loading...',
  className,
  blur = true,
  zIndex = 50,
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <output
      className={cn(
        'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm',
        className,
      )}
      style={{ zIndex }}
      aria-label="Loading overlay"
    >
      <LoadingSpinner size="lg" showText text={message} />
    </output>
  );
}
