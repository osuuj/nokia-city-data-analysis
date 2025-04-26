'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '../../utils/errorLogger';

/**
 * Props for the DashboardErrorBoundary component
 */
interface DashboardErrorBoundaryProps {
  /**
   * The children to render
   */
  children: ReactNode;

  /**
   * Optional fallback component to render when an error occurs
   */
  fallback?: ReactNode;

  /**
   * Optional component name for better error tracking
   */
  componentName?: string;
}

/**
 * State for the DashboardErrorBoundary component
 */
interface DashboardErrorBoundaryState {
  /**
   * Whether an error has occurred
   */
  hasError: boolean;

  /**
   * The error that occurred, if any
   */
  error: Error | null;
}

/**
 * DashboardErrorBoundary component
 *
 * A class component that catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * ```tsx
 * <DashboardErrorBoundary componentName="AnalyticsView">
 *   <AnalyticsView />
 * </DashboardErrorBoundary>
 * ```
 */
export class DashboardErrorBoundary extends Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error using the dashboard error logger
    logError(error, errorInfo, this.props.componentName);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-danger-200 bg-danger-50 dark:bg-danger-900/10 dark:border-danger-800">
          <div className="mb-4 text-danger-500">
            <Icon icon="solar:danger-triangle-bold" width={48} height={48} />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-foreground-500 mb-4">
            {this.state.error?.message || 'An unexpected error occurred in the dashboard.'}
          </p>
          <Button
            color="primary"
            variant="flat"
            onPress={this.handleReset}
            startContent={<Icon icon="solar:refresh-linear" width={16} height={16} />}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
