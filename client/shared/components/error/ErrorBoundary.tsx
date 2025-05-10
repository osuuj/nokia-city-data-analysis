'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  /** The child components to be wrapped by the error boundary */
  children: ReactNode;
  /** Optional fallback UI to display when an error occurs */
  fallback?: ReactNode;
  /** Optional callback function to handle errors */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional aria-label for the error message container */
  ariaLabel?: string;
  /** Optional className for styling the error container */
  className?: string;
}

interface State {
  /** Indicates whether an error has occurred */
  hasError: boolean;
  /** The error object if an error has occurred */
  error: Error | null;
  /** Indicates whether the component is recovering from an error */
  isRecovering: boolean;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in its child
 * component tree and displays a fallback UI instead of the component tree that crashed.
 *
 * @component
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={<ErrorMessage />}
 *   onError={(error, errorInfo) => console.error(error, errorInfo)}
 *   ariaLabel="Error boundary container"
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 *
 * @remarks
 * - This component uses the class component pattern because error boundaries must be class components
 * - The component provides a default fallback UI if none is provided
 * - The component supports error recovery through a "Try again" button
 * - The component is fully accessible with proper ARIA attributes
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isRecovering: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isRecovering: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console
    console.error('Uncaught error:', error, errorInfo);

    // Call the onError prop if provided
    this.props.onError?.(error, errorInfo);

    // Here you could also send the error to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  private handleRetry = () => {
    this.setState({ isRecovering: true }, () => {
      // Attempt to recover by resetting the error state
      this.setState({ hasError: false, error: null, isRecovering: false });
    });
  };

  public render() {
    if (this.state.hasError) {
      const defaultFallback = (
        <div
          className={`flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 dark:bg-red-900/10 ${this.props.className || ''}`}
          aria-label={this.props.ariaLabel || 'Error message container'}
        >
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            type="button"
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
            onClick={this.handleRetry}
            disabled={this.state.isRecovering}
            aria-label="Try again to recover from error"
          >
            {this.state.isRecovering ? 'Recovering...' : 'Try again'}
          </button>
        </div>
      );

      return this.props.fallback || defaultFallback;
    }

    return this.props.children;
  }
}
