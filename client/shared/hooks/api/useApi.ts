import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useLoading } from '../loading/useLoading';

// Base API URL - this should come from environment variables in production
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Type definitions
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiRequestConfig {
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  priority?: 'high' | 'low' | 'auto';
  autoFetch?: boolean;
}

/**
 * Base query key factory
 */
export const createQueryKey = <T extends unknown[]>(key: string, ...args: T) => [key, ...args];

/**
 * Default fetcher function
 */
const defaultFetcher = async <T>(
  url: string,
  config?: ApiRequestConfig,
): Promise<ApiResponse<T>> => {
  let queryParams = '';

  if (config?.params) {
    const filteredParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(config.params)) {
      if (v !== undefined && v !== null) {
        filteredParams[k] = String(v);
      }
    }

    queryParams = `?${new URLSearchParams(filteredParams).toString()}`;
  }

  const response = await fetch(`${BASE_API_URL}/${url}${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw {
      message: error.message || 'An error occurred',
      status: response.status,
      errors: error.errors,
    };
  }

  const data = await response.json();
  return {
    data,
    success: true,
  };
};

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
    queryFn: () => defaultFetcher<TData>(url, config),
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
    mutationFn: async (variables) => {
      const response = await fetch(`${BASE_API_URL}/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw {
          message: error.message || 'An error occurred',
          status: response.status,
          errors: error.errors,
        };
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    },
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
    mutationFn: (variables) =>
      fetch(`${BASE_API_URL}/${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      }),
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
    mutationFn: (variables) =>
      fetch(`${BASE_API_URL}/${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      }),
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
    mutationFn: (variables) =>
      fetch(`${BASE_API_URL}/${url}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      }),
    ...options,
  });
}

/**
 * Hook for making API requests with loading and error states
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
      let queryParams = '';

      if (config?.params) {
        const filteredParams: Record<string, string> = {};
        for (const [k, v] of Object.entries(config.params)) {
          if (v !== undefined && v !== null) {
            filteredParams[k] = String(v);
          }
        }

        queryParams = `?${new URLSearchParams(filteredParams).toString()}`;
      }

      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers,
        },
      };

      if (method !== 'GET' && data) {
        requestOptions.body = JSON.stringify(data);
      }

      const res = await fetch(`${BASE_API_URL}/${url}${queryParams}`, requestOptions);

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      const apiResponse = {
        data: result,
        success: true,
      };

      setResponse(apiResponse);
      return apiResponse;
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
