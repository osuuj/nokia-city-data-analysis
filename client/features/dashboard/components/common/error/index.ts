/**
 * Dashboard Error Components
 *
 * This module re-exports the shared error components and dashboard-specific error utilities.
 */

// Re-export from shared components
export {
  FeatureErrorBoundary,
  ErrorBoundary,
  ErrorMessage,
  withErrorBoundary,
  ErrorDisplay,
  SimpleErrorMessage,
} from '@/shared/components/error';

// Export dashboard-specific components - deprecated
// @deprecated - Use SimpleErrorMessage from shared/components/error instead
export { DashboardErrorMessage } from './ErrorDisplay';

// Deprecated components (keep for backward compatibility)
export { DashboardErrorBoundary } from './DashboardErrorBoundary';

/**
 * @deprecated Use withErrorBoundary from shared/components/error instead
 */
export { withDashboardErrorBoundary } from './withDashboardErrorBoundary';

// Export error related hooks and utilities
export { logError } from '../../../utils';
