'use client';

import type React from 'react';
import { DashboardErrorBoundary } from './DashboardErrorBoundary';

/**
 * Options for the withDashboardErrorBoundary HOC
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
 *
 * @param Component - The component to wrap
 * @param options - Options for the error boundary
 * @returns A component wrapped with DashboardErrorBoundary
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
  const WithDashboardErrorBoundary: React.FC<P> = (props) => {
    return (
      <DashboardErrorBoundary
        fallback={options.fallback}
        componentName={options.componentName || Component.displayName || Component.name}
      >
        <Component {...props} />
      </DashboardErrorBoundary>
    );
  };

  WithDashboardErrorBoundary.displayName = `WithDashboardErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithDashboardErrorBoundary;
}
