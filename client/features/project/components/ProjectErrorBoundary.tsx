'use client';

import { ErrorMessage } from '@/shared/components/error';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for the project feature.
 * Catches and handles errors that occur within the project feature components.
 */
export class ProjectErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Project error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage
            title="Something went wrong"
            message="An error occurred while loading the project content. Please try refreshing the page."
            error={this.state.error}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
