/**
 * Error types for the dashboard feature
 */

/**
 * Possible error codes for dashboard errors
 */
export type ErrorCode =
  | 'UNKNOWN_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'NETWORK_ERROR';

/**
 * API error interface
 */
export interface ApiError {
  status?: number;
  code?: string;
  message: string;
}

/**
 * Dashboard specific error interface
 */
export interface DashboardError {
  code: ErrorCode;
  message: string;
  status: number;
}

/**
 * Extended Error with additional properties
 */
export interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}
