/**
 * @deprecated Use ErrorBoundary from @/shared/components/error instead
 * This component is kept for backward compatibility but will be removed in a future version.
 *
 * Example usage of the shared component:
 * import { ErrorBoundary } from '@/shared/components/error';
 */

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import type { DashboardError } from '../../types/common';
import { errorReporting } from '../../utils/errorReporting';
import { ErrorShake, FadeIn } from './animations';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
  errorId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary component for catching and handling React errors
 * Provides a fallback UI when errors occur and allows for error reporting
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryHandler: (() => void) | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Update state with error info
    this.setState({ errorInfo });

    // Report the error using the error reporting service
    errorReporting.reportError(error, 'ErrorBoundary caught an error', this.props.componentName);

    // Set up retry handler if errorId is provided
    if (this.props.errorId) {
      this.retryHandler = this.handleReset;

      // Add event listener for this specific error
      window.addEventListener(`retry-${this.props.errorId}`, this.retryHandler);
    }
  }

  componentWillUnmount(): void {
    // Clean up event listener when component unmounts
    if (this.props.errorId && this.retryHandler) {
      window.removeEventListener(`retry-${this.props.errorId}`, this.retryHandler);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });

    // Dispatch custom event for retry if errorId is provided
    if (this.props.errorId) {
      window.dispatchEvent(new CustomEvent(`retry-${this.props.errorId}`));
    }
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <FadeIn duration={0.3}>
          <ErrorShake>
            <Card className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Something went wrong</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <div className="mt-6">
                  <Button onPress={this.handleReset} color="danger" variant="solid" size="sm">
                    Try again
                  </Button>
                </div>
              </div>
            </Card>
          </ErrorShake>
        </FadeIn>
      );
    }

    return this.props.children;
  }
}
