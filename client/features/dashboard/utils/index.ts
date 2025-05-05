/**
 * Export all utility functions
 */

// Error handling utilities
export { errorReporting } from './errorReporting';

// Lazy loading utilities
export * from './lazyLoading';

// Geo utilities
export * from './geo';

// Generic logging function
export const logError = (error: Error, errorInfo: React.ErrorInfo, componentName?: string) => {
  console.error(`Error in ${componentName || 'unknown component'}:`, error, errorInfo);
};
