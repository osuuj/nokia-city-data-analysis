import { API_BASE_URL, API_RETRY_COUNT, API_RETRY_DELAY, API_TIMEOUT } from './endpoints';
import {
  ApiClientError,
  NetworkError,
  TimeoutError,
  handleApiError,
  parseErrorResponse,
} from './errors';
import type {
  ApiClient,
  ApiClientConfig,
  ApiRequestConfig,
  ApiResponse,
  HttpMethod,
} from './types';

/**
 * API client implementation
 */
export class ApiClientImpl implements ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = {
      baseURL: config.baseURL || API_BASE_URL,
      timeout: config.timeout || API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      retryCount: config.retryCount || API_RETRY_COUNT,
      retryDelay: config.retryDelay || API_RETRY_DELAY,
    };
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await this.makeRequest<T>(method, url, data, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw handleApiError(error);
    }
  }

  /**
   * Make an HTTP request with retry logic
   */
  private async makeRequest<T>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;
    const retryCount = this.config.retryCount ?? 3;

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const response = await fetch(this.buildUrl(url), {
          method,
          headers: this.buildHeaders(config?.headers),
          body: data ? JSON.stringify(data) : undefined,
          signal: config?.signal,
        });

        if (!response.ok) {
          const error = await parseErrorResponse(response);
          throw new ApiClientError(error);
        }

        const responseData = (await response.json()) as T;
        return {
          data: responseData,
          status: response.status,
        };
      } catch (error) {
        lastError = error as Error;
        if (error instanceof TimeoutError || error instanceof NetworkError) {
          if (attempt < retryCount - 1) {
            await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay));
            continue;
          }
        }
        throw error;
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * Build URL with base URL and query parameters
   */
  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    const baseUrl = this.config.baseURL.endsWith('/')
      ? this.config.baseURL.slice(0, -1)
      : this.config.baseURL;
    const apiUrl = url.startsWith('/') ? url : `/${url}`;
    const queryString = params
      ? `?${Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&')}`
      : '';
    return `${baseUrl}${apiUrl}${queryString}`;
  }

  /**
   * Build headers with default headers and custom headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    return {
      ...this.config.headers,
      ...customHeaders,
    };
  }

  /**
   * GET request
   */
  public async get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  /**
   * POST request
   */
  public async post<T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  /**
   * PUT request
   */
  public async put<T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  /**
   * DELETE request
   */
  public async delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  /**
   * PATCH request
   */
  public async patch<T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }
}
