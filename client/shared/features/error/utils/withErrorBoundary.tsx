'use client';

import type React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ErrorMessage } from '../components/ErrorMessage';

export interface WithErrorBoundaryOptions {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary.
 *
 * @example
 * ```tsx
 * const MyComponentWithErrorBoundary = withErrorBoundary(MyComponent, {
 *   fallback: <ErrorMessage title="Custom error" />,
 *   onError: (error) => console.error(error)
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: WithErrorBoundaryOptions = {},
) {
  const WithErrorBoundary: React.FC<P> = (props) => {
    return (
      <ErrorBoundary fallback={options.fallback} onError={options.onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WithErrorBoundary.displayName = `WithErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithErrorBoundary;
}
