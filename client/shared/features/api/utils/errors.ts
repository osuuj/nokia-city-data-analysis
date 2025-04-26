import type { ApiError } from '../types';

/**
 * Base API client error class
 */
export class ApiClientError extends Error implements ApiError {
  public status: number;
  public code?: string;
  public details?: Record<string, unknown>;
  public timestamp: number;
  public requestId?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.timestamp = Date.now();
  }
}

/**
 * Network error class for connection issues
 */
export class NetworkError extends ApiClientError {
  constructor(message = 'Network error occurred') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * Timeout error class for request timeouts
 */
export class TimeoutError extends ApiClientError {
  constructor(message = 'Request timed out') {
    super(message, 408, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends ApiClientError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error class
 */
export class AuthorizationError extends ApiClientError {
  constructor(message = 'Not authorized') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'AuthorizationError';
  }
}

/**
 * Rate limit error class
 */
export class RateLimitError extends ApiClientError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

/**
 * Validation error class
 */
export class ValidationError extends ApiClientError {
  constructor(message = 'Validation failed', details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.details = details;
  }
}

/**
 * Server error class
 */
export class ServerError extends ApiClientError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

/**
 * Parse error response from API
 */
export function parseErrorResponse(response: Response, data?: unknown): ApiError {
  const timestamp = Date.now();
  const requestId = response.headers.get('x-request-id') || undefined;

  if (data && typeof data === 'object' && 'error' in data) {
    const errorData = data as {
      error: { message?: string; code?: string; details?: Record<string, unknown> };
    };
    return {
      status: response.status,
      message: String(errorData.error.message || 'Unknown error'),
      code: String(errorData.error.code || 'UNKNOWN_ERROR'),
      details: errorData.error.details || undefined,
      timestamp,
      requestId,
    };
  }

  return {
    status: response.status,
    message: response.statusText || 'Unknown error',
    code: `HTTP_${response.status}`,
    timestamp,
    requestId,
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiError): boolean {
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }

  // Retry on 5xx errors
  if (error.status >= 500) {
    return true;
  }

  // Retry on specific 4xx errors
  if (error.status === 408 || error.status === 429) {
    return true;
  }

  return false;
}

/**
 * Create appropriate error instance based on error type
 */
export function createErrorInstance(error: ApiError): ApiClientError {
  switch (error.code) {
    case 'AUTH_ERROR':
      return new AuthenticationError(error.message);
    case 'FORBIDDEN':
      return new AuthorizationError(error.message);
    case 'VALIDATION_ERROR':
      return new ValidationError(error.message, error.details);
    case 'RATE_LIMIT_ERROR':
      return new RateLimitError(error.message);
    case 'SERVER_ERROR':
      return new ServerError(error.message);
    case 'TIMEOUT_ERROR':
      return new TimeoutError(error.message);
    case 'NETWORK_ERROR':
      return new NetworkError(error.message);
    default:
      return new ApiClientError(error.message, error.status, error.code);
  }
}

/**
 * Handle API errors and convert them to appropriate error instances
 */
export function handleApiError(error: unknown): Error {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (error instanceof Error) {
    // Check if it's a network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new NetworkError(error.message);
    }

    // Check if it's a timeout error
    if (error.name === 'AbortError') {
      return new TimeoutError(error.message);
    }

    // Generic error
    return new ApiClientError(error.message);
  }

  // Unknown error type
  return new ApiClientError(String(error));
}
