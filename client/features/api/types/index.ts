/**
 * Common API response types
 */

/**
 * Base API response interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Paginated API response interface
 */
export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API error response interface
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  status: number;
  details?: Record<string, unknown>;
}

/**
 * API success response interface
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}
