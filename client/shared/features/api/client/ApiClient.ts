import {
  type ApiClient,
  type ApiClientConfig,
  type ApiRequestConfig,
  type ApiResponse,
  type HttpMethod,
  type RateLimitState,
  RequestPriority,
  type RequestState,
} from '../types';
import {
  ApiClientError,
  NetworkError,
  TimeoutError,
  handleApiError,
  parseErrorResponse,
} from '../utils/errors';

// Default API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const API_TIMEOUT = 30000; // 30 seconds
const API_RETRY_COUNT = 3;
const API_RETRY_DELAY = 1000; // 1 second

/**
 * API client implementation
 */
export class ApiClientImpl implements ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;
  private defaultRetryCount: number;
  private defaultRetryDelay: number;
  private activeRequests: Map<string, AbortController>;
  private requestStates: Map<string, RequestState>;
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private rateLimitState: RateLimitState;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL || API_BASE_URL;
    this.defaultHeaders = config.defaultHeaders || {};
    this.defaultTimeout = API_TIMEOUT;
    this.defaultRetryCount = API_RETRY_COUNT;
    this.defaultRetryDelay = API_RETRY_DELAY;
    this.activeRequests = new Map();
    this.requestStates = new Map();
    this.cache = new Map();
    this.rateLimitState = {
      tokens: 100,
      lastRefill: Date.now(),
      requests: 0,
      windowStart: Date.now(),
    };
  }

  /**
   * Make a request to the API
   */
  private async request<T>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    const requestId = crypto.randomUUID();
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);

    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const requestState: RequestState = {
        id: requestId,
        url,
        method,
        priority: config?.priority || 'auto',
        status: 'pending',
        startTime: Date.now(),
        retryCount: 0,
      };
      this.requestStates.set(requestId, requestState);

      const fullUrl = this.buildUrl(url, config?.params);
      const headers = this.buildHeaders(config?.headers);

      const requestConfig: RequestInit = {
        method,
        headers,
        signal: controller.signal,
        body: data ? JSON.stringify(data) : undefined,
        credentials: config?.credentials,
        mode: config?.mode,
        redirect: config?.redirect,
        referrer: config?.referrer,
        referrerPolicy: config?.referrerPolicy,
        integrity: config?.integrity,
        keepalive: config?.keepalive,
        cache: config?.cache,
      };

      const response = await fetch(fullUrl, requestConfig);
      const responseData = await response.json();

      const apiResponse: ApiResponse<T> = {
        data: responseData as T,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()) as Record<string, string>,
        config: requestConfig as ApiRequestConfig,
        request: response,
      };

      // Update request state
      requestState.status = 'completed';
      requestState.endTime = Date.now();
      this.requestStates.set(requestId, requestState);

      return apiResponse;
    } catch (error) {
      // Update request state with error
      const requestState = this.requestStates.get(requestId);
      if (requestState) {
        requestState.status = 'error';
        requestState.endTime = Date.now();
        requestState.error = error instanceof Error ? error : new Error(String(error));
        this.requestStates.set(requestId, requestState);
      }

      throw handleApiError(error);
    } finally {
      clearTimeout(timeoutId);
      this.activeRequests.delete(requestId);
    }
  }

  /**
   * Build URL with base URL and query parameters
   */
  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    const baseUrl = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const apiUrl = url.startsWith('/') ? url : `/${url}`;
    const queryString = params
      ? `?${Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')}`
      : '';
    return `${baseUrl}${apiUrl}${queryString}`;
  }

  /**
   * Build headers with default headers and custom headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  /**
   * GET request
   */
  public async get<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  /**
   * POST request
   */
  public async post<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  /**
   * PUT request
   */
  public async put<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  /**
   * DELETE request
   */
  public async delete<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  /**
   * PATCH request
   */
  public async patch<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  /**
   * Cancel a specific request by ID
   */
  public cancelRequest(requestId: string): void {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }

  /**
   * Get the state of a specific request
   */
  public getRequestState(requestId: string): RequestState | undefined {
    return this.requestStates.get(requestId);
  }

  /**
   * Get all active request states
   */
  public getAllRequestStates(): RequestState[] {
    return Array.from(this.requestStates.values());
  }

  /**
   * Clear the request cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get the current rate limit state
   */
  public getRateLimitState(): RateLimitState {
    return { ...this.rateLimitState };
  }
}
