import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ContactFormData } from '../types';

/**
 * Response interface for contact API operations
 */
export interface ContactApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Error interface for contact API operations
 */
export interface ContactApiError {
  success: false;
  error: string;
  status: number;
}

const API_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Interface for cache entries
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Custom type for cache hit errors
interface CacheHitError extends AxiosError {
  __CACHE_HIT__?: boolean;
  data?: unknown;
}

interface ErrorResponse {
  message: string;
  code?: string;
  status?: number;
}

/**
 * ContactApiClient Class
 *
 * A client for interacting with the contact API. Provides methods for submitting contact forms
 * with built-in error handling, retries, and caching.
 *
 * Features:
 * - Automatic retries with exponential backoff
 * - Response caching for GET requests
 * - Comprehensive error handling
 * - Request/response logging
 *
 * @example
 * ```tsx
 * import { contactApi } from '../data/contactApi';
 *
 * // Submit a contact form
 * const response = await contactApi.submitContactForm({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   subject: 'General Inquiry',
 *   message: 'Hello, I have a question...'
 * });
 *
 * if (response.success) {
 *   console.log('Message sent successfully');
 * } else {
 *   console.error('Failed to send message:', response.error);
 * }
 * ```
 */
class ContactApiClient {
  private client: AxiosInstance;
  private retryCount = 0;
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * Creates a new instance of ContactApiClient
   * Sets up axios instance with interceptors for logging, caching, and error handling
   */
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging and caching
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Log request
        console.debug('Contact API Request:', {
          method: config.method,
          url: config.url,
          params: config.params,
          data: config.data,
        });

        // Check cache for GET requests
        if (config.method?.toLowerCase() === 'get' && config.url) {
          const cacheKey = this.getCacheKey(config);
          const cachedResponse = this.getCachedResponse(cacheKey);

          if (cachedResponse) {
            console.debug('Contact API Cache Hit:', cacheKey);
            return Promise.reject({
              __CACHE_HIT__: true,
              data: cachedResponse,
            });
          }
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('Contact API Request Error:', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for logging and caching
    this.client.interceptors.response.use(
      (response) => {
        // Cache successful responses
        const cacheKey = this.getCacheKey(response.config);
        this.cacheResponse(cacheKey, response.data);
        return response;
      },
      (error: CacheHitError) => {
        // Handle cache hits
        if (error.__CACHE_HIT__) {
          return Promise.resolve({ data: error.data });
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * Generates a cache key for a request configuration
   * @param config - Axios request configuration
   * @returns A string cache key
   */
  private getCacheKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${JSON.stringify(config.data || {})}`;
  }

  /**
   * Retrieves a cached response if it exists and is not expired
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  private getCachedResponse<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Stores a response in the cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  private cacheResponse<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Creates a delay for retry backoff
   * @param ms - Milliseconds to delay
   * @returns Promise that resolves after the delay
   */
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Handles API errors and converts them to standardized ContactApiError format
   * @param error - The error to handle
   * @returns Standardized error object
   */
  private async handleError(error: AxiosError<ErrorResponse>): Promise<ContactApiError> {
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Server error',
        status: error.response.status,
      };
    }
    if (error.request) {
      // Request made but no response received
      return {
        success: false,
        error: 'No response from server',
        status: 503,
      };
    }
    // Error setting up request
    return {
      success: false,
      error: 'Failed to send request',
      status: 500,
    };
  }

  /**
   * Determines if a request should be retried based on the error
   * @param error - The error to evaluate
   * @returns Boolean indicating if retry should occur
   */
  private shouldRetry(error: CacheHitError): boolean {
    // Don't retry if it's a cache hit
    if (error.__CACHE_HIT__) {
      return false;
    }

    // Don't retry if it's a client error (4xx)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return false;
    }

    // Retry on network errors or server errors (5xx)
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  /**
   * Retries a failed operation with exponential backoff
   * @param operation - The operation to retry
   * @param retryCount - Current retry attempt number
   * @returns Promise resolving to the operation result
   */
  private async retryWithBackoff<T>(operation: () => Promise<T>, retryCount = 0): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retryCount < MAX_RETRIES && this.shouldRetry(error as CacheHitError)) {
        // Calculate exponential backoff delay
        const delay = RETRY_DELAY * 2 ** retryCount;
        console.debug(
          `Retrying request after ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`,
        );
        await this.delay(delay);
        return this.retryWithBackoff(operation, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Submits a contact form to the API
   *
   * @param data - Contact form data to submit
   * @returns Promise resolving to API response
   *
   * @example
   * ```tsx
   * const response = await contactApi.submitContactForm({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   subject: 'General Inquiry',
   *   message: 'Hello, I have a question...'
   * });
   * ```
   */
  async submitContactForm(data: ContactFormData): Promise<ContactApiResponse> {
    try {
      const response = (await this.retryWithBackoff(() => this.client.post('/contact', data))) as {
        data: ContactApiResponse;
      };
      return response.data;
    } catch (error) {
      const apiError = await this.handleError(error as AxiosError<ErrorResponse>);
      return {
        success: false,
        message: 'Failed to submit contact form',
        error: apiError.error,
      };
    }
  }

  /**
   * Clears the API response cache
   * Useful for testing or when manual cache invalidation is needed
   */
  clearCache(): void {
    this.cache.clear();
    console.debug('Contact API cache cleared');
  }
}

// Export singleton instance
export const contactApi = new ContactApiClient();
