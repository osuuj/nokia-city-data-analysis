'use client';

import { withErrorBoundary } from '@/shared/components/error';
import type React from 'react';

/**
 * Options for the withDashboardErrorBoundary HOC
 * @deprecated Use options from withErrorBoundary in shared/components/error instead
 */
interface WithDashboardErrorBoundaryOptions {
  /**
   * Optional fallback component to render when an error occurs
   */
  fallback?: React.ReactNode;

  /**
   * Optional component name for better error tracking
   */
  componentName?: string;
}

/**
 * Higher-order component that wraps a component with a DashboardErrorBoundary.
 * @deprecated Use withErrorBoundary from shared/components/error instead
 *
 * @param Component - The component to wrap
 * @param options - Options for the error boundary
 * @returns A component wrapped with ErrorBoundary
 *
 * @example
 * ```tsx
 * const SafeAnalyticsView = withDashboardErrorBoundary(AnalyticsView, {
 *   componentName: 'AnalyticsView',
 *   fallback: <CustomErrorFallback />
 * });
 * ```
 */
export function withDashboardErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: WithDashboardErrorBoundaryOptions = {},
) {
  // Use the new withErrorBoundary with compatible options
  return withErrorBoundary(Component, {
    componentName: options.componentName,
    fallback: options.fallback,
    errorTitle: `Error in ${options.componentName || Component.displayName || Component.name || 'component'}`,
    errorMessage: 'An error occurred in this component. Please try again.',
  });
}
