/**
 * Base API response type that all API responses should extend
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: ApiRequestConfig;
  request: Response;
}

/**
 * Base API error type
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp?: number;
  requestId?: string;
  stack?: string;
}

/**
 * API request priority levels
 */
export type RequestPriority = 'high' | 'low' | 'auto';

/**
 * API request cache options
 */
export type RequestCache =
  | 'default'
  | 'no-store'
  | 'reload'
  | 'no-cache'
  | 'force-cache'
  | 'only-if-cached';

export interface CacheOptions {
  enabled?: boolean;
  ttl?: number;
  key?: string;
  strategy?: 'memory' | 'localStorage' | 'sessionStorage';
}

/**
 * API request retry options
 */
export interface RetryOptions {
  count: number;
  delay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableStatuses?: number[];
}

/**
 * Rate limiting options
 */
export interface RateLimitOptions {
  maxRequests: number;
  timeWindow: number;
  strategy?: 'token-bucket' | 'leaky-bucket' | 'fixed-window' | 'sliding-window';
  burstSize?: number;
  retryAfter?: number;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  validateBeforeRequest?: boolean;
  validateAfterResponse?: boolean;
  schema?: Record<string, unknown>;
  customValidators?: Array<(data: unknown) => boolean | Promise<boolean>>;
  errorMessages?: Record<string, string>;
}

/**
 * Base API request configuration
 */
export interface ApiRequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  cache?: RequestCache;
  params?: Record<string, string>;
  priority?: RequestPriority;
  autoFetch?: boolean;
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
  defaultHeaders?: Record<string, string>;
  defaultPriority?: RequestPriority;
  defaultCache?: boolean;
  defaultRateLimit?: RateLimitOptions;
  defaultValidation?: ValidationOptions;
  interceptors?: {
    request?: Array<(config: ApiRequestConfig) => Promise<ApiRequestConfig>>;
    response?: Array<(response: ApiResponse<unknown>) => Promise<ApiResponse<unknown>>>;
  };
}

/**
 * API request state
 */
export interface RequestState {
  id: string;
  url: string;
  method: string;
  priority: RequestPriority;
  status: 'pending' | 'completed' | 'error';
  startTime: number;
  endTime?: number;
  retryCount: number;
  error?: Error;
}

/**
 * Cache entry type
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  etag?: string;
  lastModified?: string;
}

/**
 * Rate limit state
 */
export interface RateLimitState {
  tokens: number;
  lastRefill: number;
  requests: number;
  windowStart: number;
}

/**
 * API client instance interface
 */
export interface ApiClient {
  get<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>>;
  patch<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>>;
  cancelRequest(requestId: string): void;
  getRequestState(requestId: string): RequestState | undefined;
  getAllRequestStates(): RequestState[];
  clearCache(): void;
  getRateLimitState(): RateLimitState;
}
