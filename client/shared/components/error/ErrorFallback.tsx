'use client';

import { ErrorMessage } from './ErrorMessage';

/**
 * ErrorFallback component for error boundaries
 *
 * @returns JSX.Element
 */
export const ErrorFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <ErrorMessage
        title="Something went wrong"
        message="We've encountered an unexpected error. Please try again or contact support if the problem persists."
        onRetry={() => window.location.reload()}
      />
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
};
