import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import type { DashboardError } from '../../types/common';
import { errorReporting } from '../../utils/errorReporting';
import ErrorDisplay from './ErrorDisplay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error reporting service
    errorReporting.reportError(
      error,
      `Error in component: ${this.props.componentName || 'Unknown'}`,
      'ErrorBoundary',
    );

    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      errorInfo,
    });
  }

  handleRetry = (): void => {
    // Reset the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render our default error UI
      const dashboardError: DashboardError = {
        code: 'COMPONENT_ERROR',
        message: this.state.error?.message || 'An error occurred in this component',
        severity: 'error',
        timestamp: new Date(),
        details: {
          component: this.props.componentName || 'Unknown',
          stack: this.state.error?.stack,
          componentStack: this.state.errorInfo?.componentStack,
        },
      };

      return (
        <div className="p-4">
          <ErrorDisplay error={dashboardError} title="Component Error" onRetry={this.handleRetry} />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
