'use client';

import { FeatureErrorBoundary } from '@/shared/components/error';
import type React from 'react';

/**
 * @deprecated Use FeatureErrorBoundary from shared/components/error instead
 */
interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  componentName?: string;
}

/**
 * Error boundary component for the dashboard
 * Catches JavaScript errors anywhere in the child component tree
 *
 * @deprecated Use FeatureErrorBoundary from shared/components/error instead
 */
export function DashboardErrorBoundary({
  children,
  fallback,
  componentName = 'dashboard',
}: DashboardErrorBoundaryProps) {
  return (
    <FeatureErrorBoundary featureName={componentName} fallback={fallback}>
      {children}
    </FeatureErrorBoundary>
  );
}

/**
 * Higher-order component that wraps a component with an error boundary
 * @param Component - The component to wrap
 * @param fallback - The fallback UI to show when an error occurs
 *
 * @deprecated Use withErrorBoundary from shared/components/error instead
 */
export function withDashboardErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ReactNode,
  componentName?: string,
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <DashboardErrorBoundary fallback={fallback} componentName={componentName}>
      <Component {...props} />
    </DashboardErrorBoundary>
  );

  // Set displayName for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withDashboardErrorBoundary(${displayName})`;

  return WrappedComponent;
}
