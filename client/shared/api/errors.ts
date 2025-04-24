import type { ApiError } from './types';

/**
 * Custom API error class
 */
export class ApiClientError extends Error {
  public status: number;
  public code?: string;
  public details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
  }
}

/**
 * Network error class
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Timeout error class
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Parse error response from API
 */
export function parseErrorResponse(response: Response): Promise<ApiError> {
  return response.json().then((data: ApiError) => {
    return {
      status: response.status,
      message: data.message || 'An unknown error occurred',
      code: data.code,
      details: data.details,
    };
  });
}

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

/**
 * Handle API error
 */
export function handleApiError(error: unknown): never {
  if (isApiError(error)) {
    throw error;
  }
  if (isNetworkError(error)) {
    throw new ApiClientError({
      status: 0,
      message: 'Network error occurred',
      code: 'NETWORK_ERROR',
    });
  }
  if (isTimeoutError(error)) {
    throw new ApiClientError({
      status: 408,
      message: 'Request timeout',
      code: 'TIMEOUT_ERROR',
    });
  }
  throw new ApiClientError({
    status: 500,
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
  });
}
