/**
 * Base API client error class
 */
export class ApiClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiClientError';
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
export async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.message || response.statusText || 'Unknown error occurred';
  } catch {
    return response.statusText || 'Unknown error occurred';
  }
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): Error {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new NetworkError('Network error occurred');
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new TimeoutError('Request timeout');
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message);
  }

  return new ApiClientError('Unknown error occurred');
}
