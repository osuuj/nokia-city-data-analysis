import apiClient from '@shared/api';
import type { ApiError, ApiRequestConfig, ApiResponse } from '@shared/api/types';
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from '../../api/service/ApiService';
import { useLoading } from '../loading/useLoading';

/**
 * Base query key factory
 */
export const createQueryKey = <T extends unknown[]>(key: string, ...args: T) => [key, ...args];

/**
 * Base useQuery hook with error handling and type safety
 */
export function useApiQuery<TData = unknown, TError = ApiError>(
  key: string | unknown[],
  url: string,
  config?: ApiRequestConfig,
  options?: Omit<UseQueryOptions<ApiResponse<TData>, TError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ApiResponse<TData>, TError>({
    queryKey: typeof key === 'string' ? createQueryKey(key, config?.params) : key,
    queryFn: () => apiClient.get<TData>(url, config),
    ...options,
  });
}

/**
 * Base useMutation hook with error handling and type safety
 */
export function useApiMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, TError, TVariables>, 'mutationFn'>,
) {
  return useMutation<ApiResponse<TData>, TError, TVariables>({
    mutationFn: (variables) => apiClient.post<TData>(url, variables),
    ...options,
  });
}

/**
 * Base usePutMutation hook with error handling and type safety
 */
export function useApiPutMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, TError, TVariables>, 'mutationFn'>,
) {
  return useMutation<ApiResponse<TData>, TError, TVariables>({
    mutationFn: (variables) => apiClient.put<TData>(url, variables),
    ...options,
  });
}

/**
 * Base useDeleteMutation hook with error handling and type safety
 */
export function useApiDeleteMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, TError, TVariables>, 'mutationFn'>,
) {
  return useMutation<ApiResponse<TData>, TError, TVariables>({
    mutationFn: (variables) => apiClient.delete<TData>(url),
    ...options,
  });
}

/**
 * Base usePatchMutation hook with error handling and type safety
 */
export function useApiPatchMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, TError, TVariables>, 'mutationFn'>,
) {
  return useMutation<ApiResponse<TData>, TError, TVariables>({
    mutationFn: (variables) => apiClient.patch<TData>(url, variables),
    ...options,
  });
}

/**
 * Hook for making API requests with loading and error states
 * @param url The URL to make the request to
 * @param method The HTTP method to use
 * @param config The request configuration
 * @param data The request data (for POST, PUT, PATCH)
 * @returns An object containing the response, loading state, error state, and a function to refetch the data
 */
export function useApi<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  config?: Partial<ApiRequestConfig>,
  data?: unknown,
) {
  const [response, setResponse] = useState<ApiResponse<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Start the loading indicator
    const loadingId = startLoading({
      message: `Loading data from ${url}`,
      priority: config?.priority || 'auto',
    });

    try {
      const apiService = ApiService.getInstance();
      let result: ApiResponse<T>;

      switch (method) {
        case 'GET':
          result = await apiService.get<T>(url, config);
          break;
        case 'POST':
          result = await apiService.post<T>(url, data, config);
          break;
        case 'PUT':
          result = await apiService.put<T>(url, data, config);
          break;
        case 'DELETE':
          result = await apiService.delete<T>(url, config);
          break;
        case 'PATCH':
          result = await apiService.patch<T>(url, data, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      setResponse(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
      stopLoading(loadingId);
    }
  }, [url, method, config, data, startLoading, stopLoading]);

  // Automatically fetch data on mount if autoFetch is true
  useEffect(() => {
    if (config?.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, config?.autoFetch]);

  return {
    response,
    isLoading,
    error,
    fetchData,
  };
}
