/**
 * Cache utility for API routes
 * Provides functions for caching API responses and managing cache invalidation
 */

// Cache storage
const cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

/**
 * Cache options
 */
export interface CacheOptions {
  /** Time to live in milliseconds */
  ttl?: number;
  /** Whether to use stale data while revalidating */
  staleWhileRevalidate?: boolean;
}

/**
 * Default cache options
 */
const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 60000, // 1 minute
  staleWhileRevalidate: true,
};

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Get a value from the cache
 * @param key The cache key
 * @returns The cached value or undefined if not found or expired
 */
export function getFromCache<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return undefined;
  }

  return entry.data as T;
}

/**
 * Set a value in the cache
 * @param key The cache key
 * @param value The value to cache
 * @param ttl Time to live in milliseconds
 */
export function setInCache<T>(key: string, value: T, ttl: number): void {
  cache.set(key, {
    data: value,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Invalidate a cached value
 * @param key Cache key
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Invalidate all cached values
 */
export function invalidateAllCache(): void {
  cache.clear();
}

/**
 * Invalidate cached values by prefix
 * @param prefix Cache key prefix
 */
export function invalidateCacheByPrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

/**
 * Get cache statistics
 * @returns Cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
