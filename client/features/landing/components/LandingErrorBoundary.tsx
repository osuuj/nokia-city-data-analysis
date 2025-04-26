'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

/**
 * Props for the LandingErrorBoundary component.
 */
interface LandingErrorBoundaryProps {
  /** Children to render if no error occurs */
  children: React.ReactNode;
  /** Optional fallback component to render when an error occurs */
  fallback?: React.ReactNode;
}

/**
 * State for the LandingErrorBoundary component.
 */
interface LandingErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
}

/**
 * LandingErrorBoundary Component
 *
 * An error boundary component for the landing feature that catches and handles errors
 * that occur within its children components.
 *
 * @example
 * <LandingErrorBoundary>
 *   <Hero />
 * </LandingErrorBoundary>
 */
export class LandingErrorBoundary extends React.Component<
  LandingErrorBoundaryProps,
  LandingErrorBoundaryState
> {
  /**
   * Initialize the component state.
   */
  constructor(props: LandingErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Update the state when an error occurs.
   *
   * @param error - The error that occurred
   * @returns The updated state
   */
  static getDerivedStateFromError(error: Error): LandingErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Log the error to an error reporting service.
   *
   * @param error - The error that occurred
   * @param errorInfo - Additional information about the error
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Landing Error:', error, errorInfo);
  }

  /**
   * Reset the error state.
   */
  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * Render the component.
   *
   * @returns The rendered component
   */
  render(): React.ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, render it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render the default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
          <div className="mb-4 text-danger-500">
            <Icon icon="solar:danger-triangle-bold" width={48} height={48} />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-foreground-500 mb-4">
            We encountered an error while loading the landing page. Please try again.
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
