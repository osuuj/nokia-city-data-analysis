'use client';

import { ErrorMessage } from '@/shared/components/error';
import Link from 'next/link';
import { useEffect } from 'react';

interface CustomErrorProps {
  error: Error;
  reset: () => void;
}

/**
 * Enhanced error page that displays a fallback UI when an error occurs in the app.
 * Uses the shared ErrorMessage component for consistent styling and adds additional
 * functionality like error reporting and navigation options.
 *
 * @component
 * @param {CustomErrorProps} props - The error object and reset function
 */
export default function CustomError({ error, reset }: CustomErrorProps) {
  // Log the error to console (could be replaced with a proper error reporting service)
  useEffect(() => {
    console.error('Application error:', error);

    // Here you could add error reporting to a service like Sentry
    // reportErrorToService(error);
  }, [error]);

  // Extract error details for better display
  const errorDetails = {
    message: error.message || 'An unexpected error occurred',
    stack: error.stack,
    name: error.name,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <ErrorMessage
          title="Application Error"
          message={errorDetails.message}
          error={error}
          onRetry={reset}
          className="mb-6"
        />

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Error Details
          </h3>
          <div className="text-xs font-mono text-gray-600 dark:text-gray-400 overflow-auto max-h-40 p-2 bg-gray-50 dark:bg-gray-900 rounded">
            <p>
              <strong>Type:</strong> {errorDetails.name}
            </p>
            <p>
              <strong>Message:</strong> {errorDetails.message}
            </p>
            {errorDetails.stack && (
              <div className="mt-2">
                <p>
                  <strong>Stack:</strong>
                </p>
                <pre className="whitespace-pre-wrap">{errorDetails.stack}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Go to Home
          </Link>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
