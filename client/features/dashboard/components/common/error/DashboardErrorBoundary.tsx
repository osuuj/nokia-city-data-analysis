'use client';

import React from 'react';

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for the dashboard
 * Catches JavaScript errors anywhere in the child component tree
 */
export class DashboardErrorBoundary extends React.Component<
  DashboardErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error(`Error in component ${this.props.componentName || 'unknown'}:`, error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with an error boundary
 * @param Component - The component to wrap
 * @param fallback - The fallback UI to show when an error occurs
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
