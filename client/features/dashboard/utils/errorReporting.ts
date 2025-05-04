import type { ApiError } from '../types/error';
import { createSingleton } from './singleton';

/**
 * Error reporting service for centralized error logging and reporting
 * Provides methods for reporting errors, warnings, and info messages
 */
export class ErrorReportingService {
  private isInitialized = false;
  private errorListeners: ((error: unknown, context?: string) => void)[] = [];

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
    this.logError(normalizedError, context, source);

    // Send to error service
    this.sendToErrorService(normalizedError, context, source);
  }

  /**
   * Log an error with context information
   */
  private logError(error: Error, context?: string, source?: string): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[${new Date().toISOString()}] Error${source ? ` in ${source}` : ''}${
          context ? ` (${context})` : ''
        }:`,
        error,
      );
    }
  }

  /**
   * Report a warning
   */
  public reportWarning(message: string, source?: string, context?: string): void {
    // Log the warning
    this.logWarning(message, source, context);

    // Send to monitoring service
    this.sendToMonitoringService({
      level: 'warning',
      message,
      context,
      source,
    });
  }

  /**
   * Log a warning message
   */
  private logWarning(message: string, source?: string, context?: string): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[${new Date().toISOString()}] Warning${source ? ` in ${source}` : ''}${
          context ? ` (${context})` : ''
        }:`,
        message,
      );
    }
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
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${source || 'Error'}] ${error.message}${context ? ` (${context})` : ''}`);
    }
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
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[${data.source || data.level}] ${data.message}${data.context ? ` (${data.context})` : ''}`,
      );
    }
  }
}

// Use the singleton factory to create a getter for the error reporting service
export const getErrorReporting = createSingleton(ErrorReportingService);

// Backward compatibility - provide the instance directly
export const errorReporting = getErrorReporting();
