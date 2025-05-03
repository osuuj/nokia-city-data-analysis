'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';

/**
 * Props for the DashboardErrorMessage component
 */
interface DashboardErrorMessageProps {
  /**
   * The title of the error message
   */
  title?: string;

  /**
   * The error message to display
   */
  message: string;

  /**
   * Optional callback function for the retry button
   */
  onRetry?: () => void;

  /**
   * Optional additional information to display
   */
  details?: string;

  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * DashboardErrorMessage component
 *
 * A component for displaying error messages with consistent styling.
 *
 * @example
 * ```tsx
 * <DashboardErrorMessage
 *   title="Error Loading Data"
 *   message="Failed to load the requested data. Please try again."
 *   onRetry={() => window.location.reload()}
 * />
 * ```
 */
export const DashboardErrorMessage: React.FC<DashboardErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
  details,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-lg border border-danger-200 bg-danger-50 dark:bg-danger-900/10 dark:border-danger-800 ${className}`}
    >
      <div className="mb-4 text-danger-500">
        <Icon icon="solar:danger-triangle-bold" width={40} height={40} />
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-foreground-500 mb-4 text-center">{message}</p>

      {details && (
        <div className="mb-4 p-3 bg-danger-100 dark:bg-danger-900/20 rounded text-sm text-danger-700 dark:text-danger-300 overflow-auto max-h-32">
          <pre className="whitespace-pre-wrap">{details}</pre>
        </div>
      )}

      {onRetry && (
        <Button
          color="primary"
          variant="flat"
          onPress={onRetry}
          startContent={<Icon icon="solar:refresh-linear" width={16} height={16} />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
