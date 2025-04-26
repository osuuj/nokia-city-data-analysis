'use client';

import type { ErrorInfo } from 'react';

/**
 * Log levels for error logging
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Error context information
 */
interface ErrorContext {
  componentName?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  additionalInfo?: Record<string, unknown>;
}

/**
 * Log an error with context information
 *
 * @param error - The error object
 * @param errorInfo - React error info
 * @param componentName - Optional name of the component where the error occurred
 * @param additionalInfo - Optional additional information to log
 */
export function logError(
  error: Error,
  errorInfo: ErrorInfo,
  componentName?: string,
  additionalInfo?: Record<string, unknown>,
): void {
  const context: ErrorContext = {
    componentName,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server-side',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server-side',
    additionalInfo,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `[Dashboard Error] ${componentName ? `[${componentName}] ` : ''}${error.message}`,
      {
        error,
        errorInfo,
        context,
      },
    );
  }

  // In a real application, you would send this to an error tracking service
  // like Sentry, LogRocket, or a custom API endpoint
  // sendErrorToService(error, errorInfo, context);
}

/**
 * Log a warning with context information
 *
 * @param message - The warning message
 * @param componentName - Optional name of the component where the warning occurred
 * @param additionalInfo - Optional additional information to log
 */
export function logWarning(
  message: string,
  componentName?: string,
  additionalInfo?: Record<string, unknown>,
): void {
  const context: ErrorContext = {
    componentName,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server-side',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server-side',
    additionalInfo,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Dashboard Warning] ${componentName ? `[${componentName}] ` : ''}${message}`, {
      context,
    });
  }

  // In a real application, you would send this to a monitoring service
  // sendWarningToService(message, context);
}

/**
 * Create a higher-order function that logs errors for async operations
 *
 * @param operation - The async operation to wrap
 * @param componentName - Optional name of the component where the operation is performed
 * @returns A function that wraps the operation with error logging
 */
export function withErrorLogging<T extends (...args: unknown[]) => Promise<unknown>>(
  operation: T,
  componentName?: string,
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await operation(...args);
    } catch (error) {
      if (error instanceof Error) {
        logError(error, { componentStack: '' }, componentName);
      } else {
        logError(
          new Error(typeof error === 'string' ? error : 'Unknown error'),
          { componentStack: '' },
          componentName,
        );
      }
      throw error;
    }
  }) as T;
}
