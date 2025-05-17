'use client';

import { LoadingSpinner } from './LoadingSpinner';

interface StandardFallbackProps {
  /**
   * Text to display below the spinner
   * @default 'Loading...'
   */
  text?: string;

  /**
   * Full height of the container
   * @default true
   */
  fullHeight?: boolean;

  /**
   * Additional class names
   */
  className?: string;
}

/**
 * StandardFallback
 * A consistent loading fallback for Suspense boundaries across the app
 * Ensures the background color is always applied properly with theme-aware styles
 */
export function StandardFallback({
  text = 'Loading...',
  fullHeight = true,
  className = '',
}: StandardFallbackProps) {
  return (
    <output
      className={`
        flex h-full w-full items-center justify-center 
        bg-background dark:bg-background 
        transition-colors duration-300
        ${fullHeight ? 'min-h-[50vh]' : ''}
        ${className}
      `}
      data-testid="standard-fallback"
      aria-label="Loading content"
    >
      <LoadingSpinner
        size="lg"
        color="primary"
        showText
        text={text}
        className="opacity-90 dark:opacity-80"
      />
    </output>
  );
}
