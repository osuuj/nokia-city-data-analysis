'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

/**
 * Props for the ErrorDisplay component
 */
interface ErrorDisplayProps {
  /**
   * The error message to display
   */
  message?: string;

  /**
   * Whether to show error details
   */
  showDetails?: boolean;

  /**
   * The full error object for details
   */
  error?: Error;

  /**
   * Optional callback for retry operation
   */
  onRetry?: () => void;
}

/**
 * ErrorDisplay component
 *
 * Displays an error message with a retry button.
 * Consistent UI for error states across the dashboard.
 *
 * @param props - Component props
 * @returns The rendered error display
 */
export function ErrorDisplay({
  message = 'An unexpected error occurred in the dashboard.',
  showDetails = false,
  error,
  onRetry,
}: ErrorDisplayProps) {
  const [showErrorDetails, setShowErrorDetails] = useState(showDetails);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-danger-200 bg-danger-50 dark:bg-danger-900/10 dark:border-danger-800">
      <div className="mb-4 text-danger-500">
        <Icon icon="solar:danger-triangle-bold" width={48} height={48} />
      </div>
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-foreground-500 mb-4">{error?.message || message}</p>

      {error && (
        <div className="mb-4 w-full">
          <button
            type="button"
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="text-sm text-primary-500 flex items-center justify-center mb-2"
          >
            <Icon
              icon={showErrorDetails ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
              className="mr-1"
              width={16}
              height={16}
            />
            {showErrorDetails ? 'Hide details' : 'Show details'}
          </button>

          {showErrorDetails && (
            <pre className="text-sm p-4 bg-black/5 dark:bg-white/5 rounded-md overflow-auto text-left max-h-40">
              {error.stack || error.toString()}
            </pre>
          )}
        </div>
      )}

      <Button
        color="primary"
        variant="flat"
        onPress={handleRetry}
        startContent={<Icon icon="solar:refresh-linear" width={16} height={16} />}
      >
        Try Again
      </Button>
    </div>
  );
}
