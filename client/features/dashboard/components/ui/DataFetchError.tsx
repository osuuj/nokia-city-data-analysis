import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';
import type { DashboardError } from '../../types/common';
import { handleErrorWithRecovery } from '../../utils/errorHandling';
import ErrorDisplay from './ErrorDisplay';

export interface DataFetchErrorProps {
  error: DashboardError | Error | string;
  context?: string;
  onRetry?: () => Promise<void>;
  className?: string;
}

/**
 * A specialized error component for data fetching errors
 * Provides retry functionality and error recovery
 */
export const DataFetchError: React.FC<DataFetchErrorProps> = ({
  error,
  context = 'Data fetching',
  onRetry,
  className = '',
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [recoveryAttempted, setRecoveryAttempted] = React.useState(false);
  const [recoverySuccessful, setRecoverySuccessful] = React.useState(false);

  // Convert error to DashboardError format
  const dashboardError: DashboardError = React.useMemo(() => {
    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        severity: 'error',
        timestamp: new Date(),
      };
    }

    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        severity: 'error',
        timestamp: new Date(),
        details: { stack: error.stack },
      };
    }

    return error;
  }, [error]);

  // Handle retry with error recovery
  const handleRetry = async (): Promise<void> => {
    setIsRetrying(true);

    try {
      // If a custom retry function is provided, use it
      if (onRetry) {
        await onRetry();
        setRecoverySuccessful(true);
        return;
      }

      // Otherwise, attempt automatic recovery
      const success = await handleErrorWithRecovery(dashboardError, context);

      setRecoverySuccessful(success);
      setRecoveryAttempted(true);

      // If recovery was successful, refresh the page to get fresh data
      if (success) {
        window.location.reload();
      }
    } catch (retryError) {
      console.error('Error during retry:', retryError);
    } finally {
      setIsRetrying(false);
    }
  };

  // Determine error severity based on error code
  const getSeverity = (): 'error' | 'warning' | 'info' => {
    switch (dashboardError.code) {
      case 'AUTH_ERROR':
      case 'SERVER_ERROR':
        return 'error';
      case 'VALIDATION_ERROR':
      case 'RATE_LIMIT_ERROR':
        return 'warning';
      case 'NOT_FOUND_ERROR':
        return 'info';
      default:
        return 'error';
    }
  };

  // Get a user-friendly title based on error code
  const getTitle = (): string => {
    switch (dashboardError.code) {
      case 'AUTH_ERROR':
        return 'Authentication Error';
      case 'SERVER_ERROR':
        return 'Server Error';
      case 'VALIDATION_ERROR':
        return 'Validation Error';
      case 'RATE_LIMIT_ERROR':
        return 'Rate Limit Exceeded';
      case 'NOT_FOUND_ERROR':
        return 'Data Not Found';
      case 'NETWORK_ERROR':
        return 'Network Error';
      default:
        return 'Error Loading Data';
    }
  };

  // Get a user-friendly message based on error code
  const getMessage = (): string => {
    if (dashboardError.message && dashboardError.message !== '') {
      return dashboardError.message;
    }

    switch (dashboardError.code) {
      case 'AUTH_ERROR':
        return 'Your session may have expired. Please try logging in again.';
      case 'SERVER_ERROR':
        return 'The server encountered an error. Please try again later.';
      case 'VALIDATION_ERROR':
        return 'The data received was invalid. Please try again.';
      case 'RATE_LIMIT_ERROR':
        return 'Too many requests. Please wait a moment before trying again.';
      case 'NOT_FOUND_ERROR':
        return 'The requested data could not be found.';
      case 'NETWORK_ERROR':
        return 'There was a problem connecting to the server. Please check your internet connection.';
      default:
        return 'An unexpected error occurred while loading data.';
    }
  };

  // If recovery was successful, show a success message
  if (recoverySuccessful) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <ArrowPathIcon className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              Recovery Successful
            </h3>
            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>The error has been resolved. Refreshing data...</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorDisplay
      error={{
        ...dashboardError,
        message: getMessage(),
      }}
      severity={getSeverity()}
      title={getTitle()}
      onRetry={handleRetry}
      className={className}
    />
  );
};

export default DataFetchError;
