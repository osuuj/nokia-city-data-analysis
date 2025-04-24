'use client';

import type React from 'react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

/**
 * A reusable error message component that displays error information
 * and optionally provides a retry button.
 *
 * @example
 * ```tsx
 * <ErrorMessage
 *   title="Failed to load data"
 *   message="Please try again later"
 *   onRetry={() => fetchData()}
 * />
 * ```
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 dark:bg-red-900/10 ${className}`}
    >
      <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">{title}</h2>
      <p className="mt-2 text-sm text-red-600 dark:text-red-300">
        {message || error?.message || 'An unexpected error occurred'}
      </p>
      {onRetry && (
        <button
          type="button"
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
};
