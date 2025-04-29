import type { ApiError } from '@/shared/api/types';
import { logError, logWarning } from './errorHandling';

/**
 * Error reporting service for centralized error logging and reporting
 * Provides methods for reporting errors, warnings, and info messages
 */
export class ErrorReportingService {
  private static instance: ErrorReportingService;
  private isInitialized = false;
  private errorListeners: ((error: unknown, context?: string) => void)[] = [];

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the singleton instance of the error reporting service
   */
  public static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  /**
   * Initialize the error reporting service
   */
  public initialize(): void {
    if (this.isInitialized) return;

    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.reportError(event.error || event.message, 'window.onerror');
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.reportError(event.reason, 'unhandledrejection');
      });
    }

    this.isInitialized = true;
  }

  /**
   * Add an error listener
   */
  public addErrorListener(listener: (error: unknown, context?: string) => void): void {
    if (!this.errorListeners.includes(listener)) {
      this.errorListeners.push(listener);
    }
  }

  /**
   * Remove an error listener
   */
  public removeErrorListener(listener: (error: unknown, context?: string) => void): void {
    this.errorListeners = this.errorListeners.filter((l) => l !== listener);
  }

  /**
   * Report an error
   */
  public reportError(error: unknown, context?: string, source?: string): void {
    const normalizedError = this.normalizeError(error);

    // Notify listeners
    for (const listener of this.errorListeners) {
      try {
        listener(normalizedError, context);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    }

    // Log the error
    logError(normalizedError, undefined, context);

    // Send to error service
    this.sendToErrorService(normalizedError, context, source);
  }

  /**
   * Report a warning
   */
  public reportWarning(message: string, source?: string, context?: string): void {
    // Log the warning
    logWarning(message, source, context ? { context } : undefined);

    // Send to monitoring service
    this.sendToMonitoringService({
      level: 'warning',
      message,
      context,
      source,
    });
  }

  /**
   * Report an info message
   */
  public reportInfo(message: string, source?: string, context?: string): void {
    // Log the info message
    console.info(`[${source || 'Info'}] ${message}${context ? ` (${context})` : ''}`);

    // Send to monitoring service
    this.sendToMonitoringService({
      level: 'info',
      message,
      context,
      source,
    });
  }

  /**
   * Normalize an error to a standard Error object
   */
  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    if (error && typeof error === 'object') {
      const apiError = error as ApiError;
      if (apiError.message) {
        const err = new Error(apiError.message);
        if (apiError.status) {
          (err as Error & { status?: number }).status = apiError.status;
        }
        if (apiError.code) {
          (err as Error & { code?: string }).code = apiError.code;
        }
        return err;
      }

      return new Error(JSON.stringify(error));
    }

    return new Error('Unknown error');
  }

  /**
   * Send an error to the error service
   */
  private sendToErrorService(error: Error, context?: string, source?: string): void {
    // Here you would typically send to an error reporting service
    // e.g., Sentry, LogRocket, etc.
    console.error(`[${source || 'Error'}] ${error.message}${context ? ` (${context})` : ''}`);
  }

  /**
   * Send data to the monitoring service
   */
  private sendToMonitoringService(data: {
    level: 'info' | 'warning' | 'error';
    message: string;
    context?: string;
    source?: string;
  }): void {
    // Here you would typically send to a monitoring service
    // e.g., Datadog, New Relic, etc.
    console.log(
      `[${data.source || data.level}] ${data.message}${data.context ? ` (${data.context})` : ''}`,
    );
  }
}

// Export a singleton instance
export const errorReporting = ErrorReportingService.getInstance();
