'use client';

import { type ApiError, apiClient } from '@/shared/utils/api';
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

/**
 * Base options for React Query hooks
 */
const defaultQueryOptions = {
  refetchOnWindowFocus: false,
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

/**
 * Custom hook factory that creates a React Query hook for any API endpoint
 * This builds on top of our existing apiClient but adds React Query's caching and state management
 *
 * @example
 * // Define a hook for fetching cities
 * export const useCities = () => {
 *   return useApiQuery(['cities'], () => apiClient.get('/cities'));
 * };
 */
export function useApiQuery<TData = unknown, TError = ApiError>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...defaultQueryOptions,
    ...options,
  });
}

/**
 * Hook for GET requests that automatically uses the endpoint as part of the query key
 */
export function useApiGet<TData = unknown, TError = ApiError>(
  endpoint: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>,
) {
  return useApiQuery<TData, TError>(
    [endpoint, params],
    () => apiClient.get<TData>(endpoint, { params }),
    options,
  );
}

/**
 * Hook for mutations (POST, PUT, DELETE) using React Query
 */
export function useApiMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>,
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
}

/**
 * Convenience hook for POST requests
 */
export function useApiPost<
  TData = unknown,
  TVariables = Record<string, unknown>,
  TError = ApiError,
>(endpoint: string, options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>) {
  return useApiMutation<TData, TVariables, TError>(
    (data) => apiClient.post<TData>(endpoint, data as Record<string, unknown>),
    options,
  );
}

/**
 * Convenience hook for PUT requests
 */
export function useApiPut<TData = unknown, TVariables = Record<string, unknown>, TError = ApiError>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>,
) {
  return useApiMutation<TData, TVariables, TError>(
    (data) => apiClient.put<TData>(endpoint, data as Record<string, unknown>),
    options,
  );
}

/**
 * Convenience hook for DELETE requests
 */
export function useApiDelete<TData = unknown, TError = ApiError>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, string>, 'mutationFn'>,
) {
  return useApiMutation<TData, string, TError>(
    (id) => apiClient.delete<TData>(`${endpoint}/${id}`),
    options,
  );
}
