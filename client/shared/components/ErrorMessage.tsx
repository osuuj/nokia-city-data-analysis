'use client';

import type React from 'react';

interface ErrorMessageProps {
  /** The title of the error message */
  title?: string;
  /** The main error message to display */
  message?: string;
  /** Optional Error object to extract message from */
  error?: Error | null;
  /** Optional callback function to handle retry action */
  onRetry?: () => void;
  /** Optional className for styling the error container */
  className?: string;
  /** Optional aria-label for the error message container */
  ariaLabel?: string;
  /** Optional flag to show/hide the retry button */
  showRetryButton?: boolean;
  /** Optional loading state for the retry button */
  isRetrying?: boolean;
}

/**
 * A reusable error message component that displays error information
 * and optionally provides a retry button.
 *
 * @component
 * @example
 * ```tsx
 * <ErrorMessage
 *   title="Failed to load data"
 *   message="Please try again later"
 *   error={error}
 *   onRetry={() => fetchData()}
 *   ariaLabel="Data loading error"
 *   showRetryButton={true}
 *   isRetrying={false}
 * />
 * ```
 *
 * @remarks
 * - The component is fully accessible with proper ARIA attributes
 * - The component supports dark mode through Tailwind CSS
 * - The component can display error messages from either the message prop or an Error object
 * - The retry button is only shown if onRetry is provided
 * - The component supports loading states for the retry action
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  className = '',
  ariaLabel = 'Error message',
  showRetryButton = true,
  isRetrying = false,
}) => {
  const errorMessage = message || error?.message || 'An unexpected error occurred';

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 dark:bg-red-900/10 ${className}`}
      aria-label={ariaLabel}
    >
      <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">{title}</h2>
      <p className="mt-2 text-sm text-red-600 dark:text-red-300">{errorMessage}</p>
      {showRetryButton && onRetry && (
        <button
          type="button"
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onRetry}
          disabled={isRetrying}
          aria-label="Try again to recover from error"
        >
          {isRetrying ? 'Retrying...' : 'Try again'}
        </button>
      )}
    </div>
  );
};
