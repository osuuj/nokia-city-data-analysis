'use client';

import React from 'react';

/**
 * Client component that displays a fallback UI when an error occurs in the application.
 * This component is used by the ErrorBoundary in the root layout.
 */
export function ErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        We apologize for the inconvenience. Please try refreshing the page.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  );
}
