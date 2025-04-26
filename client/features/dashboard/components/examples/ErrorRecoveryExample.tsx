import type React from 'react';
import { useState } from 'react';
import useErrorRecovery from '../../hooks/useErrorRecovery';
import type { DashboardError } from '../../types/common';
import DataFetchError from '../ui/DataFetchError';
import ErrorBoundary from '../ui/ErrorBoundary';

/**
 * Example component that demonstrates how to use the error recovery system
 */
const ErrorRecoveryExample: React.FC = () => {
  const [error, setError] = useState<DashboardError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use the error recovery hook
  const { isRecovering, recoverySuccessful, attemptRecovery, resetRecovery } = useErrorRecovery({
    context: 'ErrorRecoveryExample',
    onRecoverySuccess: () => {
      console.log('Recovery successful!');
      // Refresh data or reset state
      setError(null);
    },
    onRecoveryFailure: (error) => {
      console.log('Recovery failed:', error);
      // Show a more detailed error message or fallback UI
    },
  });

  // Simulate a data fetching error
  const simulateError = () => {
    setIsLoading(true);

    // Simulate an API call that fails
    setTimeout(() => {
      setError({
        message: 'This is a simulated error',
        code: 'SIMULATED_ERROR',
        status: 500,
      });
      setIsLoading(false);
    }, 1000);
  };

  // Handle manual retry
  const handleRetry = async () => {
    if (!error) return;

    setIsLoading(true);

    try {
      // Attempt recovery
      const success = await attemptRecovery(error);

      if (success) {
        console.log('Manual recovery successful!');
        setError(null);
      } else {
        console.log('Manual recovery failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the example
  const handleReset = () => {
    setError(null);
    resetRecovery();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Error Recovery Example</h2>

      <div className="mb-6">
        <p className="mb-4">
          This example demonstrates how to use the error recovery system in your components. Click
          the button below to simulate a server error, then try to recover from it.
        </p>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={simulateError}
            disabled={isLoading || !!error}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Simulate Error'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={!error}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Reset Example
          </button>
        </div>
      </div>

      {/* Error Boundary Example */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Error Boundary Example</h3>
        <p className="mb-2">
          The ErrorBoundary component catches JavaScript errors in its child component tree. Click
          the button below to trigger an error in the child component.
        </p>

        <ErrorBoundary componentName="ErrorTriggerExample">
          <ErrorTriggerExample />
        </ErrorBoundary>
      </div>

      {/* Data Fetch Error Example */}
      {error && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Data Fetch Error Example</h3>
          <p className="mb-2">
            The DataFetchError component displays errors from data fetching operations and provides
            retry functionality.
          </p>

          <DataFetchError error={error} context="ErrorRecoveryExample" onRetry={handleRetry} />
        </div>
      )}

      {/* Recovery Status */}
      {isRecovering && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mb-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Attempting to recover from error...
          </p>
        </div>
      )}

      {recoverySuccessful && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md mb-4">
          <p className="text-green-800 dark:text-green-200">Successfully recovered from error!</p>
        </div>
      )}
    </div>
  );
};

/**
 * Component that intentionally throws an error when a button is clicked
 */
const ErrorTriggerExample: React.FC = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('This is a simulated error in the ErrorTriggerExample component');
  }

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
      <p className="mb-2">This component will throw an error when the button is clicked.</p>
      <button
        type="button"
        onClick={() => setShouldError(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Trigger Error
      </button>
    </div>
  );
};

export default ErrorRecoveryExample;
