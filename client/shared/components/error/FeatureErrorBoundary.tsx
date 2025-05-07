'use client';

import type React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorMessage } from './ErrorMessage';

interface FeatureErrorBoundaryProps {
  /** The children to render */
  children: React.ReactNode;
  /** The name of the feature (for error messages) */
  featureName: string;
  /** Optional custom error title */
  errorTitle?: string;
  /** Optional custom error message */
  errorMessage?: string;
  /** Optional custom fallback component */
  fallback?: React.ReactNode;
  /** Optional error handler function */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * A generic error boundary for feature components.
 * This component can be used to replace all the feature-specific error boundaries.
 *
 * @example
 * ```tsx
 * <FeatureErrorBoundary featureName="Dashboard">
 *   <DashboardContent />
 * </FeatureErrorBoundary>
 * ```
 */
export function FeatureErrorBoundary({
  children,
  featureName,
  errorTitle,
  errorMessage,
  fallback,
  onError,
}: FeatureErrorBoundaryProps) {
  // Create a default fallback UI if none is provided
  const defaultFallback = (
    <ErrorMessage
      title={errorTitle || `Error Loading ${featureName}`}
      message={
        errorMessage ||
        `There was an error loading the ${featureName.toLowerCase()} content. Please try again later.`
      }
    />
  );

  return (
    <ErrorBoundary
      fallback={fallback || defaultFallback}
      onError={(error, errorInfo) => {
        console.error(`${featureName} error:`, error, errorInfo);

        // Call custom error handler if provided
        if (onError) {
          onError(error, errorInfo);
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
