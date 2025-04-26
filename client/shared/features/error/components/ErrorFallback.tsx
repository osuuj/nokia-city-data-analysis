'use client';

import React, { useState } from 'react';

export interface ErrorFallbackProps {
  /** Optional custom error message to display */
  message?: string;
  /** Optional custom title to display */
  title?: string;
  /** Optional className for styling the container */
  className?: string;
  /** Optional aria-label for the error container */
  ariaLabel?: string;
}

/**
 * Client component that displays a fallback UI when an error occurs in the application.
 * This component is used by the ErrorBoundary in the root layout.
 *
 * @component
 * @example
 * ```tsx
 * <ErrorFallback
 *   title="Application Error"
 *   message="We encountered an unexpected error. Please try refreshing the page."
 *   ariaLabel="Application error message"
 * />
 * ```
 *
 * @remarks
 * - The component provides a full-screen error message with a refresh button
 * - The component is fully accessible with proper ARIA attributes
 * - The component supports dark mode through Tailwind CSS
 * - The component handles the page refresh action
 * - The component shows loading state during refresh
 */
export function ErrorFallback({
  message = 'We apologize for the inconvenience. Please try refreshing the page.',
  title = 'Something went wrong',
  className = '',
  ariaLabel = 'Application error message',
}: ErrorFallbackProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <section
      aria-live="polite"
      className={`flex min-h-screen flex-col items-center justify-center p-4 text-center ${className}`}
    >
      <h1 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="Refresh page to recover from error"
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh Page'}
      </button>
    </section>
  );
}
