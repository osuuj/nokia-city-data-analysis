import { API_ENDPOINTS } from '@/shared/api';
import apiClient from '@/shared/api';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Helper function to create a query key
 */
function createQueryKey(base: string, params?: Record<string, unknown>): string[] {
  const key = [base];
  if (params) {
    for (const [param, value] of Object.entries(params)) {
      key.push(`${param}:${String(value)}`);
    }
  }
  return key;
}

/**
 * Hook for prefetching data when a user hovers over a view option
 *
 * @param queryKey The query key to prefetch
 * @param queryFn The function to fetch the data
 * @param options Options for prefetching
 * @returns A function to trigger prefetching
 */
export function usePrefetch<TData = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options: {
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
  } = {},
) {
  const queryClient = useQueryClient();
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { staleTime = 5 * 60 * 1000, gcTime = 10 * 60 * 1000, enabled = true } = options;

  // Function to prefetch data
  const prefetch = useCallback(() => {
    if (!enabled) return;

    // Clear any existing timeout
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }

    // Set a small delay to avoid prefetching on every hover
    prefetchTimeoutRef.current = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
        gcTime,
      });
    }, 100);
  }, [queryClient, queryKey, queryFn, staleTime, gcTime, enabled]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  return prefetch;
}

/**
 * Hook for prefetching multiple queries at once
 *
 * @param queries Array of queries to prefetch
 * @param options Options for prefetching
 * @returns A function to trigger prefetching
 */
export function usePrefetchMultiple(
  queries: Array<{
    queryKey: string[];
    queryFn: () => Promise<unknown>;
  }>,
  options: {
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
  } = {},
) {
  const queryClient = useQueryClient();
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { staleTime = 5 * 60 * 1000, gcTime = 10 * 60 * 1000, enabled = true } = options;

  // Function to prefetch all queries
  const prefetchAll = useCallback(() => {
    if (!enabled) return;

    // Clear any existing timeout
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }

    // Set a small delay to avoid prefetching on every hover
    prefetchTimeoutRef.current = setTimeout(() => {
      for (const { queryKey, queryFn } of queries) {
        queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime,
          gcTime,
        });
      }
    }, 100);
  }, [queryClient, queries, staleTime, gcTime, enabled]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  return prefetchAll;
}

/**
 * Hook to prefetch dashboard data
 * Provides methods for prefetching cities, companies, and other dashboard data
 */
export function usePrefetchData() {
  const queryClient = useQueryClient();

  /**
   * Prefetch cities data
   */
  const prefetchCities = useCallback(async () => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey('cities'),
      queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.LIST),
    });
  }, [queryClient]);

  /**
   * Prefetch companies data for a city
   */
  const prefetchCompanies = useCallback(
    async (city: string) => {
      await queryClient.prefetchQuery({
        queryKey: createQueryKey('companies', { city }),
        queryFn: () =>
          apiClient.get(API_ENDPOINTS.COMPANIES.LIST, {
            params: { city },
          }),
      });
    },
    [queryClient],
  );

  /**
   * Prefetch company data by ID
   */
  const prefetchCompany = useCallback(
    async (id: string) => {
      await queryClient.prefetchQuery({
        queryKey: createQueryKey('company', { id }),
        queryFn: () => apiClient.get(API_ENDPOINTS.COMPANIES.DETAIL(id)),
      });
    },
    [queryClient],
  );

  /**
   * Prefetch city statistics
   */
  const prefetchCityStatistics = useCallback(
    async (id: string) => {
      await queryClient.prefetchQuery({
        queryKey: createQueryKey('city-statistics', { id }),
        queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.STATISTICS(id)),
      });
    },
    [queryClient],
  );

  /**
   * Prefetch company statistics
   */
  const prefetchCompanyStatistics = useCallback(
    async (id: string) => {
      await queryClient.prefetchQuery({
        queryKey: createQueryKey('company-statistics', { id }),
        queryFn: () => apiClient.get(API_ENDPOINTS.COMPANIES.STATISTICS(id)),
      });
    },
    [queryClient],
  );

  return {
    prefetchCities,
    prefetchCompanies,
    prefetchCompany,
    prefetchCityStatistics,
    prefetchCompanyStatistics,
  };
}
