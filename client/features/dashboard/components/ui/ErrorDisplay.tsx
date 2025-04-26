import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type React from 'react';
import type { DashboardError } from '../../types/common';

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface ErrorDisplayProps {
  error: DashboardError | string;
  severity?: ErrorSeverity;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * A reusable error display component that shows error messages with appropriate styling
 * based on severity level.
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  severity = 'error',
  title,
  onRetry,
  onDismiss,
  className = '',
}) => {
  // Convert string errors to DashboardError format
  const dashboardError =
    typeof error === 'string'
      ? {
          code: 'UNKNOWN_ERROR',
          message: error,
          severity: 'error',
          timestamp: new Date(),
          details: {},
        }
      : error;

  // Get icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  // Get background color based on severity
  const getBgColor = () => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'bg-red-50 dark:bg-red-900/20';
    }
  };

  // Get text color based on severity
  const getTextColor = () => {
    switch (severity) {
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-red-800 dark:text-red-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`rounded-md p-4 ${getBgColor()} ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3">
          {title && <h3 className={`text-sm font-medium ${getTextColor()}`}>{title}</h3>}
          <div className={`mt-2 text-sm ${getTextColor()}`}>
            <p>{dashboardError.message}</p>
            {dashboardError.details && (
              <pre className="mt-2 text-xs overflow-auto max-h-32">
                {JSON.stringify(dashboardError.details, null, 2)}
              </pre>
            )}
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`rounded-md px-2 py-1.5 text-sm font-medium ${getTextColor()} hover:bg-opacity-20 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${severity}-50 focus:ring-${severity}-600`}
                >
                  Try again
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className={`ml-3 rounded-md px-2 py-1.5 text-sm font-medium ${getTextColor()} hover:bg-opacity-20 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${severity}-50 focus:ring-${severity}-600`}
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorDisplay;
