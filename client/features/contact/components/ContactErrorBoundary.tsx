import { Button } from '@heroui/button';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ContactErrorBoundary Component
 *
 * An error boundary component for the contact feature.
 * Catches and handles errors that occur within the contact form.
 * Provides a fallback UI when errors occur.
 *
 * @example
 * ```tsx
 * import { ContactErrorBoundary } from '../components';
 *
 * const ContactPage = () => {
 *   return (
 *     <div>
 *       <h1>Contact Us</h1>
 *       <ContactErrorBoundary>
 *         <ContactForm />
 *       </ContactErrorBoundary>
 *     </div>
 *   );
 * };
 * ```
 */
class ContactErrorBoundaryClass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to error reporting service
    console.error('Contact Form Error:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <section
          className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800"
          aria-live="assertive"
        >
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
            Something went wrong
          </h2>
          <p className="mt-2 text-red-700 dark:text-red-300">
            {this.state.error?.message ||
              'An unexpected error occurred while loading the contact form.'}
          </p>
          <Button
            onClick={this.handleReset}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </section>
      );
    }

    return this.props.children;
  }
}

// Export memoized component to prevent unnecessary re-renders
export const ContactErrorBoundary = React.memo(ContactErrorBoundaryClass);
