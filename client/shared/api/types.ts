/**
 * Base API response type that all API responses should extend
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Base API error type
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Base API request configuration
 */
export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * HTTP method type
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * API client instance interface
 */
export interface ApiClient {
  get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
}

/**
 * Filter type for selection components
 */
export interface Filter {
  id: string;
  name: string;
  value: string;
  count?: number;
}
