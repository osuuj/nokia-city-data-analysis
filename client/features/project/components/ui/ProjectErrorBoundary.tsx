'use client';

import { Button } from '@heroui/react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Props for the ProjectErrorBoundary component
 */
interface ProjectErrorBoundaryProps {
  /**
   * The children to render
   */
  children: ReactNode;

  /**
   * Optional fallback component to render when an error occurs
   */
  fallback?: ReactNode;
}

/**
 * State for the ProjectErrorBoundary component
 */
interface ProjectErrorBoundaryState {
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
 * ProjectErrorBoundary component
 *
 * A class component that catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * ```tsx
 * <ProjectErrorBoundary>
 *   <ProjectDetail project={project} />
 * </ProjectErrorBoundary>
 * ```
 */
export class ProjectErrorBoundary extends Component<
  ProjectErrorBoundaryProps,
  ProjectErrorBoundaryState
> {
  constructor(props: ProjectErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ProjectErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Project Error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={() => this.setState({ hasError: false, error: null })} variant="primary">
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProjectErrorBoundary;
