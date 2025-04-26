import { ApiClientImpl } from '../client/ApiClient';
import { handleApiError } from '../errors/ApiErrors';
import type { ApiClient, ApiClientConfig, ApiRequestConfig, ApiResponse } from '../types/ApiTypes';

/**
 * ApiService class that provides a higher-level interface for making API requests
 * It wraps the ApiClient and provides additional functionality like caching, retries, etc.
 */
export class ApiService {
  private client: ApiClient;
  private static instance: ApiService | null = null;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor(config: ApiClientConfig) {
    this.client = new ApiClientImpl(config);
  }

  /**
   * Get the singleton instance of ApiService
   */
  public static getInstance(config?: ApiClientConfig): ApiService {
    if (!ApiService.instance) {
      if (!config) {
        throw new Error('ApiService configuration is required for initialization');
      }
      ApiService.instance = new ApiService(config);
    }
    return ApiService.instance;
  }

  /**
   * Make a GET request
   */
  public async get<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    try {
      return await this.client.get<T>(url, config);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a POST request
   */
  public async post<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    try {
      return await this.client.post<T>(url, data, config);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a PUT request
   */
  public async put<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    try {
      return await this.client.put<T>(url, data, config);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    try {
      return await this.client.delete<T>(url, config);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a PATCH request
   */
  public async patch<T>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>,
  ): Promise<ApiResponse<T>> {
    try {
      return await this.client.patch<T>(url, data, config);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Cancel a specific request by ID
   */
  public cancelRequest(requestId: string): void {
    this.client.cancelRequest(requestId);
  }

  /**
   * Get the state of a specific request
   */
  public getRequestState(requestId: string) {
    return this.client.getRequestState(requestId);
  }

  /**
   * Get all active request states
   */
  public getAllRequestStates() {
    return this.client.getAllRequestStates();
  }

  /**
   * Clear the request cache
   */
  public clearCache(): void {
    this.client.clearCache();
  }

  /**
   * Get the current rate limit state
   */
  public getRateLimitState() {
    return this.client.getRateLimitState();
  }
}
