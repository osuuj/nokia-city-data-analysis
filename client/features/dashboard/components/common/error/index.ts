// Export error handling components and utilities
export { DashboardErrorBoundary } from './DashboardErrorBoundary';
export { DashboardErrorMessage } from './DashboardErrorMessage';
export { withDashboardErrorBoundary } from './withDashboardErrorBoundary';
export {
  logError,
  logWarning,
  withErrorLogging,
} from '@/features/dashboard/utils/errorHandling';
export { ErrorDisplay } from './ErrorDisplay';
