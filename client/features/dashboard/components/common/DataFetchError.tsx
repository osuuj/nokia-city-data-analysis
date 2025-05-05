import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import { Card } from '@heroui/react';
import type React from 'react';
import { useEffect } from 'react';
import type { DashboardError, ErrorWithStatus } from '../../types/error';
import { errorReporting } from '../../utils/errorReporting';
import { ErrorShake, FadeIn } from './Animations';

interface DataFetchErrorProps {
  error: DashboardError | ErrorWithStatus | null;
  onRetry?: () => void;
  className?: string;
  componentName?: string;
  errorId?: string;
}

/**
 * Component for displaying data fetching errors with retry functionality
 */
export const DataFetchError: React.FC<DataFetchErrorProps> = ({
  error,
  onRetry,
  className = '',
  componentName,
  errorId,
}) => {
  useEffect(() => {
    if (error && componentName) {
      // Report the error using the error reporting service
      errorReporting.reportError(error, componentName);

      // Store retry callback in a global map if errorId is provided
      if (errorId && onRetry) {
        // We'll use a custom event to handle retries instead
        const retryHandler = () => {
          onRetry();
        };

        // Add event listener for this specific error
        window.addEventListener(`retry-${errorId}`, retryHandler);

        // Clean up the event listener when component unmounts
        return () => {
          window.removeEventListener(`retry-${errorId}`, retryHandler);
        };
      }
    }
  }, [error, componentName, errorId, onRetry]);

  if (!error) return null;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }

    // Dispatch custom event for retry if errorId is provided
    if (errorId) {
      window.dispatchEvent(new CustomEvent(`retry-${errorId}`));
    }
  };

  // Check if error has details property (ErrorWithStatus type)
  const errorWithDetails = error as ErrorWithStatus;
  const hasDetails = 'details' in error || errorWithDetails.details !== undefined;

  return (
    <FadeIn duration={0.3}>
      <ErrorShake>
        <Card className={`bg-red-50 ${className}`}>
          <div className="flex p-4">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
                {hasDetails && errorWithDetails.details && (
                  <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs">
                    {JSON.stringify(errorWithDetails.details, null, 2)}
                  </pre>
                )}
              </div>
              {onRetry && (
                <div className="mt-4">
                  <Button onPress={handleRetry} color="danger" variant="light" size="sm">
                    Try again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </ErrorShake>
    </FadeIn>
  );
};
