import { ApiClientImpl } from './client';
import { API_BASE_URL, API_RETRY_COUNT, API_RETRY_DELAY, API_TIMEOUT } from './endpoints';

/**
 * Create API client instance
 */
const apiClient = new ApiClientImpl({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  retryCount: API_RETRY_COUNT,
  retryDelay: API_RETRY_DELAY,
});

/**
 * Export API client instance
 */
export default apiClient;

/**
 * Export API endpoints
 */
export { API_ENDPOINTS } from './endpoints';

/**
 * Export API types
 */
export * from './types';

/**
 * Export API errors
 */
export * from './errors';
