/**
 * Error type definitions for the dashboard
 */

/**
 * Basic error type with status code and possible details object
 */
export interface ErrorWithStatus extends Error {
  status?: number;
  details?: unknown;
}

/**
 * Dashboard-specific error type
 */
export type DashboardError = Error | ErrorWithStatus;

/**
 * Error types for different sections of the dashboard
 */
export interface DashboardErrors {
  geojson?: DashboardError;
  cities?: DashboardError;
  companies?: DashboardError;
  analytics?: DashboardError;
  industries?: DashboardError;
}
