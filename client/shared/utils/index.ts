/**
 * Utility functions for common operations across the application
 * Export all utility functions from this file
 */

// Example: export { default as formatDate } from './date';
// Example: export { default as validateEmail } from './validation';

// Performance monitoring utilities
export {
  PerformanceMonitor,
  withPerformanceTracking,
  useDashboardPerformanceTracking,
  usePerformanceTracking,
  useInteractionTracking,
  type PerformanceMonitoringOptions,
} from './performance';
