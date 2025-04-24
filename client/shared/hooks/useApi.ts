import apiClient from '@shared/api';
import type { ApiError, ApiRequestConfig, ApiResponse } from '@shared/api/types';
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

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
