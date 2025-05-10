/**
 * Error reporting service for dashboard components
 */

interface ErrorReportingService {
  /**
   * Report an error to the error tracking service
   */
  reportError: (error: Error, componentName?: string, metadata?: Record<string, unknown>) => void;

  /**
   * Record a custom error message
   */
  recordError: (
    message: string,
    componentName?: string,
    metadata?: Record<string, unknown>,
  ) => void;
}

/**
 * Simple error reporting implementation
 * In a production environment, this would send errors to a service like Sentry
 */
class ErrorReportingImpl implements ErrorReportingService {
  private isDev = process.env.NODE_ENV === 'development';

  reportError(error: Error, componentName?: string, metadata?: Record<string, unknown>): void {
    // In development, log to console
    if (this.isDev) {
      const logPayload = {
        component: componentName || 'Unknown',
        message: error.message,
        stack: error.stack,
        ...metadata,
      };
      console.error(`[${componentName || 'Error'}]`, logPayload);
      return;
    }

    // In production, would send to error tracking service
    // Example: Sentry.captureException(error, { tags: { component: componentName }, extra: metadata });
    console.error(`[${componentName || 'Error'}]`, error.message);
  }

  recordError(message: string, componentName?: string, metadata?: Record<string, unknown>): void {
    // Create error object for consistency
    const error = new Error(message);
    this.reportError(error, componentName, metadata);
  }
}

// Export a singleton instance
export const errorReporting = new ErrorReportingImpl();
