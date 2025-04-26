import { Button } from '@heroui/button';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
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

    // Here you could integrate with your error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  private getErrorMessage = (error: Error): string => {
    // Customize error messages based on error type
    if (error.name === 'NetworkError') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.name === 'ValidationError') {
      return 'There was a problem with the form data. Please check your inputs.';
    }
    return error.message || 'An unexpected error occurred while loading the contact form.';
  };

  private getRecoverySteps = (error: Error): string[] => {
    // Provide specific recovery steps based on error type
    if (error.name === 'NetworkError') {
      return [
        'Check your internet connection',
        'Try refreshing the page',
        'If the problem persists, try again later',
      ];
    }
    if (error.name === 'ValidationError') {
      return [
        'Review your form inputs',
        'Make sure all required fields are filled',
        'Check for any formatting errors',
      ];
    }
    return [
      'Try refreshing the page',
      'Clear your browser cache',
      'If the problem persists, contact support',
    ];
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800"
          aria-live="assertive"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Icon icon="mdi:alert-circle" className="w-6 h-6 text-red-500 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
                Something went wrong
              </h2>
              <p className="mt-2 text-red-700 dark:text-red-300">
                {this.state.error && this.getErrorMessage(this.state.error)}
              </p>

              {this.state.error && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Try these steps:
                  </h3>
                  <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-300">
                    {this.getRecoverySteps(this.state.error).map((step) => (
                      <li key={`recovery-step-${step.slice(0, 20)}`}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={this.handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      );
    }

    return this.props.children;
  }
}

// Export memoized component to prevent unnecessary re-renders
export const ContactErrorBoundary = React.memo(ContactErrorBoundaryClass);
