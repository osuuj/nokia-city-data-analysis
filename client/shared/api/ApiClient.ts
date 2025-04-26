import {
  type ApiClientError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  ValidationError,
  createErrorInstance,
  isRetryableError,
  parseErrorResponse,
} from './errors/ApiErrors';
import type {
  ApiClientConfig,
  ApiRequestConfig,
  ApiResponse,
  CacheEntry,
  RateLimitOptions,
  RateLimitState,
  RequestPriority,
  RequestState,
  ValidationOptions,
} from './types/ApiTypes';

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultPriority: RequestPriority;
  private defaultCache: boolean;
  private defaultRateLimit?: RateLimitOptions;
  private defaultValidation?: ValidationOptions;
  private interceptors: {
    request: Array<(config: ApiRequestConfig) => Promise<ApiRequestConfig>>;
    response: Array<(response: ApiResponse<unknown>) => Promise<ApiResponse<unknown>>>;
  };
  private cache: Map<string, CacheEntry<unknown>>;
  private rateLimitState: RateLimitState;
  private activeRequests: Map<string, RequestState>;
  private abortControllers: Map<string, AbortController>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = config.defaultHeaders || {};
    this.defaultPriority = config.defaultPriority || 3;
    this.defaultCache = config.defaultCache ?? true;
    this.defaultRateLimit = config.defaultRateLimit;
    this.defaultValidation = config.defaultValidation;
    this.interceptors = {
      request: config.interceptors?.request || [],
      response: config.interceptors?.response || [],
    };
    this.cache = new Map();
    this.rateLimitState = {
      tokens: this.defaultRateLimit?.maxRequests || 100,
      lastRefill: Date.now(),
      requests: 0,
      windowStart: Date.now(),
    };
    this.activeRequests = new Map();
    this.abortControllers = new Map();
  }

  private async executeRequest<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const requestId = crypto.randomUUID();
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);

    const requestState: RequestState = {
      id: requestId,
      url: config.url,
      method: config.method,
      priority: config.priority || this.defaultPriority,
      status: 'pending',
      startTime: Date.now(),
      retryCount: 0,
    };
    this.activeRequests.set(requestId, requestState);

    try {
      // Apply request interceptors
      let finalConfig = { ...config };
      for (const interceptor of this.interceptors.request) {
        finalConfig = await interceptor(finalConfig);
      }

      // Check cache
      if (this.shouldUseCache(finalConfig)) {
        const cachedResponse = await this.getCachedResponse<T>(finalConfig);
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      // Check rate limit
      if (!this.checkRateLimit(finalConfig)) {
        throw new RateLimitError('Rate limit exceeded');
      }

      // Validate request
      if (finalConfig.validation?.validateBeforeRequest) {
        await this.validateRequest(finalConfig);
      }

      const response = await fetch(this.buildUrl(finalConfig), {
        method: finalConfig.method,
        headers: this.mergeHeaders(finalConfig.headers),
        body: finalConfig.body,
        signal: abortController.signal,
        credentials: finalConfig.credentials,
        mode: finalConfig.mode,
        redirect: finalConfig.redirect,
        referrer: finalConfig.referrer,
        referrerPolicy: finalConfig.referrerPolicy,
        integrity: finalConfig.integrity,
        keepalive: finalConfig.keepalive,
        cache: typeof finalConfig.cache === 'string' ? finalConfig.cache : undefined,
      });

      let data: ApiResponse<T>;
      if (response.ok) {
        const responseData = await response.json();
        data = {
          data: responseData,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          config: finalConfig,
          request: response,
        };

        // Validate response
        if (finalConfig.validation?.validateAfterResponse) {
          await this.validateResponse(data);
        }

        // Update cache
        if (this.shouldUseCache(finalConfig)) {
          this.setCachedResponse(finalConfig, data);
        }
      } else {
        const errorData = await response.json().catch(() => undefined);
        throw parseErrorResponse(response, errorData);
      }

      // Apply response interceptors
      for (const interceptor of this.interceptors.response) {
        data = (await interceptor(data)) as ApiResponse<T>;
      }

      // Update request state
      requestState.status = 'completed';
      requestState.endTime = Date.now();
      this.activeRequests.set(requestId, requestState);

      return data;
    } catch (error) {
      // Update request state with error
      requestState.status = 'error';
      requestState.endTime = Date.now();
      requestState.error = error instanceof Error ? error : new Error(String(error));
      this.activeRequests.set(requestId, requestState);

      // Handle retries
      if (
        isRetryableError(error as ApiClientError) &&
        (config.retry?.count || 0) > requestState.retryCount
      ) {
        requestState.retryCount++;
        this.activeRequests.set(requestId, requestState);
        return this.executeRequest<T>(config);
      }

      throw createErrorInstance(error as ApiClientError);
    } finally {
      this.abortControllers.delete(requestId);
    }
  }

  private buildUrl(config: ApiRequestConfig): string {
    const url = new URL(config.url, this.baseURL);
    if (config.params) {
      for (const [key, value] of Object.entries(config.params)) {
        url.searchParams.append(key, String(value));
      }
    }
    return url.toString();
  }

  private mergeHeaders(headers?: Record<string, string>): Headers {
    const mergedHeaders = new Headers(this.defaultHeaders);
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        mergedHeaders.set(key, value);
      }
    }
    return mergedHeaders;
  }

  private shouldUseCache(config: ApiRequestConfig): boolean {
    const cacheOptions = typeof config.cache === 'object' ? config.cache : undefined;
    return (cacheOptions?.enabled ?? this.defaultCache) && config.method === 'GET';
  }

  private async getCachedResponse<T>(config: ApiRequestConfig): Promise<ApiResponse<T> | null> {
    const cacheKey = this.getCacheKey(config);
    const cached = this.cache.get(cacheKey);

    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.data as ApiResponse<T>;
  }

  private setCachedResponse<T>(config: ApiRequestConfig, response: ApiResponse<T>): void {
    const cacheKey = this.getCacheKey(config);
    const cacheOptions = typeof config.cache === 'object' ? config.cache : undefined;
    const ttl = cacheOptions?.ttl || 60000; // Default 1 minute

    this.cache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
      ttl,
      etag: response.headers.etag,
      lastModified: response.headers['last-modified'],
    });
  }

  private getCacheKey(config: ApiRequestConfig): string {
    const cacheOptions = typeof config.cache === 'object' ? config.cache : undefined;
    if (cacheOptions?.key) return cacheOptions.key;

    const url = this.buildUrl(config);
    return `${config.method}:${url}`;
  }

  private checkRateLimit(config: ApiRequestConfig): boolean {
    const rateLimit = config.rateLimit || this.defaultRateLimit;
    if (!rateLimit) return true;

    const now = Date.now();
    const timeWindow = rateLimit.timeWindow * 1000; // Convert to milliseconds

    // Reset window if needed
    if (now - this.rateLimitState.windowStart >= timeWindow) {
      this.rateLimitState = {
        tokens: rateLimit.maxRequests,
        lastRefill: now,
        requests: 0,
        windowStart: now,
      };
    }

    // Check if we have tokens available
    if (this.rateLimitState.tokens <= 0) {
      return false;
    }

    // Consume a token
    this.rateLimitState.tokens--;
    this.rateLimitState.requests++;
    return true;
  }

  private async validateRequest(config: ApiRequestConfig): Promise<void> {
    const validation = config.validation || this.defaultValidation;
    if (!validation) return;

    if (validation.schema) {
      // Implement schema validation here
      // You can use libraries like Zod, Yup, or Joi
    }

    if (validation.customValidators) {
      for (const validator of validation.customValidators) {
        const isValid = await validator(config.body);
        if (!isValid) {
          throw new ValidationError('Request validation failed');
        }
      }
    }
  }

  private async validateResponse<T>(response: ApiResponse<T>): Promise<void> {
    const validation = response.config.validation || this.defaultValidation;
    if (!validation) return;

    if (validation.schema) {
      // Implement schema validation here
      // You can use libraries like Zod, Yup, or Joi
    }

    if (validation.customValidators) {
      for (const validator of validation.customValidators) {
        const isValid = await validator(response.data);
        if (!isValid) {
          throw new ValidationError('Response validation failed');
        }
      }
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getRateLimitState(): RateLimitState {
    return { ...this.rateLimitState };
  }

  public cancelRequest(requestId: string): void {
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
    }
  }

  public getRequestState(requestId: string): RequestState | undefined {
    return this.activeRequests.get(requestId);
  }

  public getAllRequestStates(): RequestState[] {
    return Array.from(this.activeRequests.values());
  }

  public async get<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      url,
      method: 'GET',
      ...config,
    });
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      url,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      url,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  public async delete<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({
      url,
      method: 'DELETE',
      ...config,
    });
  }
}
