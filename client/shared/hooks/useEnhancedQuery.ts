import type { ApiError, ApiRequestConfig, ApiResponse } from '@shared/api/types';
import { useQuery, type useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { createQueryKey, useApiQuery } from './useApi';

/**
 * Enhanced query hook with improved caching, error handling, and retry logic
 *
 * @param key - Query key or key factory function
 * @param url - API endpoint URL
 * @param config - Request configuration
 * @param options - Query options
 * @returns Query result with enhanced error handling
 */
export function useEnhancedQuery<TData = unknown, TError = ApiError>(
  key: string | unknown[],
  url: string,
  config?: ApiRequestConfig,
  options?: Omit<UseQueryOptions<ApiResponse<TData>, TError>, 'queryKey' | 'queryFn'>,
) {
  // Default options for better caching and error handling
  const defaultOptions: Omit<
    UseQueryOptions<ApiResponse<TData>, TError>,
    'queryKey' | 'queryFn'
  > = {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch when reconnecting to the internet
    refetchOnMount: true, // Refetch when component mounts
  };

  // Merge default options with provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  // Use the base API query hook with enhanced options
  return useApiQuery<TData, TError>(key, url, config, mergedOptions);
}

/**
 * Prefetch data for a query
 *
 * @param queryClient - React Query client
 * @param key - Query key
 * @param url - API endpoint URL
 * @param config - Request configuration
 */
export function prefetchQuery<TData = unknown>(
  queryClient: ReturnType<typeof useQueryClient>,
  key: string | unknown[],
  url: string,
  config?: ApiRequestConfig,
) {
  return queryClient.prefetchQuery({
    queryKey: typeof key === 'string' ? createQueryKey(key, config?.params) : key,
    queryFn: () => fetch(url, config).then((res) => res.json()),
  });
}

/**
 * Invalidate and refetch a query
 *
 * @param queryClient - React Query client
 * @param key - Query key
 */
export function invalidateQuery(
  queryClient: ReturnType<typeof useQueryClient>,
  key: string | unknown[],
) {
  return queryClient.invalidateQueries({
    queryKey: typeof key === 'string' ? [key] : key,
  });
}
