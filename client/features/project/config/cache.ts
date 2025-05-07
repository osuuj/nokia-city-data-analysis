import { QueryClient } from '@tanstack/react-query';

/**
 * Cache time presets for different types of data
 */
export const CACHE_TIMES = {
  STATIC: {
    staleTime: Number.POSITIVE_INFINITY, // Data that rarely changes
    gcTime: Number.POSITIVE_INFINITY, // Keep in cache indefinitely
  },
  SEMI_STATIC: {
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  },
  DYNAMIC: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  },
} as const;

/**
 * Cache optimization settings
 */
export const CACHE_OPTIMIZATION = {
  retry: {
    count: 3,
    delay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  backgroundRefetch: {
    enabled: true,
    interval: 1000 * 60 * 5, // 5 minutes
  },
  prefetch: {
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  },
} as const;

/**
 * Cache invalidation rules
 */
export const CACHE_RULES = {
  invalidateOnMutation: true,
  invalidateOnError: true,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;

/**
 * Helper function to create a query client with optimized settings
 */
export function createOptimizedQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...CACHE_RULES,
        retry: CACHE_OPTIMIZATION.retry.count,
        retryDelay: CACHE_OPTIMIZATION.retry.delay,
      },
      mutations: {
        retry: CACHE_OPTIMIZATION.retry.count,
        retryDelay: CACHE_OPTIMIZATION.retry.delay,
      },
    },
  });
}

/**
 * Helper function to prefetch project data
 */
export async function prefetchProject(queryClient: QueryClient, projectId: string) {
  await queryClient.prefetchQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetch(`/api/projects/${projectId}`).then((res) => res.json()),
    ...CACHE_OPTIMIZATION.prefetch,
  });
}

/**
 * Helper function to invalidate project cache
 */
export function invalidateProjectCache(queryClient: QueryClient, projectId?: string) {
  if (projectId) {
    queryClient.invalidateQueries({ queryKey: ['project', projectId] });
  } else {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }
}
