import { useEffect, useRef, useState } from 'react';
import { debounce } from '../utils/debounce';

interface FetchOptions {
  /** Whether to use cache */
  useCache?: boolean;
  /** Dependencies array for refetching */
  deps?: unknown[];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Custom hook for optimized data fetching with caching and debouncing
 * @param url The URL to fetch from
 * @param options Fetch options
 * @returns The fetched data, loading state, and error
 */
export function useOptimizedFetch<T>(
  url: string | null,
  options: FetchOptions = {},
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { useCache = true, deps = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a debounced fetch function
  const debouncedFetch = debounce(async (fetchUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch(fetchUrl, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Cache the result if caching is enabled
      if (useCache) {
        cache.set(fetchUrl, {
          data: jsonData,
          timestamp: Date.now(),
          ttl: 5 * 60 * 1000, // 5 minutes
        });
      }

      setData(jsonData);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Ignore abort errors
        return;
      }
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, 300);

  // Effect for fetching data
  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first if enabled
    if (useCache) {
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        setData(cached.data as T);
        setLoading(false);
        setError(null);
        return;
      }
    }

    debouncedFetch(url);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      debouncedFetch.cancel();
    };
  }, [url, useCache, ...deps, debouncedFetch]);

  // Function to manually refetch data
  const refetch = () => {
    if (url) {
      debouncedFetch(url);
    }
  };

  return { data, loading, error, refetch };
}
