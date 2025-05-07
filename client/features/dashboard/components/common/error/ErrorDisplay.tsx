'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ErrorDisplayProps {
  /** The error message to display */
  message: string;
  /** The error object, if available */
  error?: Error | null;
  /** Whether to show detailed error information (stack trace) */
  showDetails?: boolean;
  /** Function to retry the operation that failed */
  onRetry?: () => void;
  /** Additional className for styling */
  className?: string;
}

/**
 * ErrorDisplay component
 * Shows an error message and optional details
 */
export function ErrorDisplay({
  message,
  error,
  showDetails = false,
  onRetry,
  className = '',
}: ErrorDisplayProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center rounded-lg border border-danger-200 bg-danger-50 dark:bg-danger-900/10 dark:border-danger-800 ${className}`}
    >
      <div className="mb-4 text-danger-500">
        <Icon icon="solar:danger-triangle-bold" width={48} height={48} />
      </div>
      <h2 className="text-xl font-bold mb-2">Error</h2>
      <p className="text-foreground-500 mb-4">{message}</p>

      {error && showDetails && (
        <div className="w-full mt-4 max-w-full overflow-auto">
          <div className="text-left p-4 bg-background-100 dark:bg-background-800 rounded border border-default-200 overflow-x-auto">
            <p className="font-mono text-sm whitespace-pre-wrap mb-2">{error.message}</p>
            {error.stack && (
              <details>
                <summary className="cursor-pointer text-sm text-default-500 mb-2">
                  Stack trace
                </summary>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-danger-600 dark:text-danger-400 mt-2">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {onRetry && (
        <Button
          color="primary"
          variant="flat"
          onPress={onRetry}
          startContent={<Icon icon="solar:refresh-linear" width={16} height={16} />}
          className="mt-4"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

/**
 * Creates a simple dashboard error message component
 * @param message The error message to display
 */
export function DashboardErrorMessage({ message }: { message: string }) {
  return (
    <div className="w-full p-4 bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-800 rounded-lg">
      <p className="text-sm text-danger-600 dark:text-danger-400">{message}</p>
    </div>
  );
}
