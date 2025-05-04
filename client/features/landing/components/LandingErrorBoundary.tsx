'use client';

import { ErrorMessage } from '@/shared/components/error';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface LandingErrorBoundaryProps {
  children: ReactNode;
}

interface LandingErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for the landing page.
 * Catches errors in the landing page component tree.
 */
export class LandingErrorBoundary extends Component<
  LandingErrorBoundaryProps,
  LandingErrorBoundaryState
> {
  constructor(props: LandingErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): LandingErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Landing page error:', error, errorInfo);
    // You could also log to an error reporting service here
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <ErrorMessage
            title="Something went wrong on the landing page"
            message={this.state.error?.message || 'An unexpected error occurred'}
            onRetry={() => this.setState({ hasError: false, error: null })}
          />
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
