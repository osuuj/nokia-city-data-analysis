'use client';

import type React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorMessage } from './ErrorMessage';

/**
 * Higher-order component that wraps a component with an error boundary
 * @param Component - The component to wrap
 * @param fallback - The fallback UI to show when an error occurs (optional)
 * @param componentName - The name of the component (for error reporting)
 * @param errorTitle - The title for the error message
 * @param errorMessage - The message to display when an error occurs
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    componentName?: string;
    errorTitle?: string;
    errorMessage?: string;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
): React.FC<P> {
  const {
    fallback,
    componentName,
    errorTitle = 'Something went wrong',
    errorMessage = "We're having trouble displaying this content. Please try again.",
    onError,
  } = options || {};

  // Create default fallback if none is provided
  const defaultFallback = <ErrorMessage title={errorTitle} message={errorMessage} />;

  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary
      fallback={fallback || defaultFallback}
      onError={(error, errorInfo) => {
        // Log the error with component name if available
        console.error(`Error in component ${componentName || 'unknown'}:`, error, errorInfo);

        // Call custom error handler if provided
        if (onError) {
          onError(error, errorInfo);
        }
      }}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  // Set displayName for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;

  return WrappedComponent;
}
