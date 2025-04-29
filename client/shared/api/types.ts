/**
 * API Types
 * Common types used for API interactions
 */

/**
 * Standard API error interface
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** HTTP status code */
  status?: number;
  /** Optional error code */
  code?: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Standard API response interface
 */
export interface ApiResponse<T = unknown> {
  /** Response data */
  data: T;
  /** Response status */
  status: string;
  /** Optional metadata */
  meta?: Record<string, unknown>;
}
