import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from '../utils/debounce';

/**
 * Options for the useOptimizedQuery hook
 */
interface OptimizedQueryOptions<TData = unknown, TError = Error>
  extends Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> {
  /**
   * Whether to debounce the query
   */
  debounce?: boolean;

  /**
   * Debounce delay in milliseconds
   */
  debounceDelay?: number;

  /**
   * Whether to enable the query
   */
  enabled?: boolean;

  /**
   * Stale time in milliseconds
   */
  staleTime?: number;

  /**
   * Garbage collection time in milliseconds
   */
  gcTime?: number;

  /**
   * Retry count
   */
  retry?: number | boolean;

  /**
   * Retry delay in milliseconds
   */
  retryDelay?: number;
}

/**
 * Hook for optimized data fetching with caching and debouncing
 *
 * @param queryKey The query key
 * @param queryFn The function to fetch the data
 * @param options Options for the query
 * @returns The query result
 */
export function useOptimizedQuery<TData = unknown, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options: OptimizedQueryOptions<TData, TError> = {},
): UseQueryResult<TData, TError> {
  const {
    debounce: shouldDebounce = false,
    debounceDelay = 300,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    retryDelay = 1000,
    ...restOptions
  } = options;

  // State to track if the query is enabled
  const [isEnabled, setIsEnabled] = useState(enabled);

  // Create a debounced version of the query function if needed
  const debouncedQueryFn = useCallback(() => {
    if (!shouldDebounce) {
      return queryFn();
    }

    return new Promise<TData>((resolve, reject) => {
      const debouncedFn = debounce(async () => {
        try {
          const result = await queryFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, debounceDelay);

      debouncedFn();
    });
  }, [queryFn, shouldDebounce, debounceDelay]);

  // Use the query
  const queryResult = useQuery<TData, TError>({
    queryKey,
    queryFn: debouncedQueryFn,
    enabled: isEnabled,
    staleTime,
    gcTime,
    retry,
    retryDelay,
    ...restOptions,
  });

  // Update the enabled state when the options change
  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  return queryResult;
}
