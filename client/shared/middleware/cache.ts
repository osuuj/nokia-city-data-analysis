import { type NextRequest, NextResponse } from 'next/server';
import { redisClient } from '../utils/redis';

/**
 * Cache middleware options
 */
export interface CacheOptions {
  /** Time to live in seconds */
  ttl?: number;
  /** Whether to use stale data while revalidating */
  staleWhileRevalidate?: boolean;
  /** Cache key prefix */
  keyPrefix?: string;
}

/**
 * Default cache options
 */
const DEFAULT_OPTIONS: Required<CacheOptions> = {
  ttl: 300, // 5 minutes
  staleWhileRevalidate: true,
  keyPrefix: 'api:',
};

/**
 * Generate cache key from request
 * @param req Next.js request
 * @param keyPrefix Cache key prefix
 * @returns Cache key
 */
function generateCacheKey(req: NextRequest, keyPrefix: string): string {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const params = Array.from(searchParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return `${keyPrefix}${url.pathname}${params ? `?${params}` : ''}`;
}

/**
 * Cache middleware for API routes
 * @param handler API route handler
 * @param options Cache options
 * @returns Next.js middleware handler
 */
export function withCache(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: CacheOptions = {},
): (req: NextRequest) => Promise<NextResponse> {
  const {
    ttl = DEFAULT_OPTIONS.ttl,
    staleWhileRevalidate = DEFAULT_OPTIONS.staleWhileRevalidate,
    keyPrefix = DEFAULT_OPTIONS.keyPrefix,
  } = options;

  return async (req: NextRequest) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return handler(req);
    }

    const cacheKey = generateCacheKey(req, keyPrefix);

    try {
      // Try to get cached response
      const cachedResponse = await redisClient.get(cacheKey);

      if (cachedResponse) {
        const { data, timestamp } = JSON.parse(cachedResponse);
        const isExpired = Date.now() - timestamp > ttl * 1000;

        if (!isExpired) {
          return NextResponse.json(data);
        }

        if (staleWhileRevalidate) {
          // Return stale data while revalidating
          void handler(req).then(async (response) => {
            const responseData = await response.json();
            await redisClient.set(
              cacheKey,
              JSON.stringify({
                data: responseData,
                timestamp: Date.now(),
              }),
              ttl,
            );
          });

          return NextResponse.json(data);
        }
      }

      // No cache hit or expired, handle request
      const response = await handler(req);
      const responseData = await response.json();

      // Cache response
      await redisClient.set(
        cacheKey,
        JSON.stringify({
          data: responseData,
          timestamp: Date.now(),
        }),
        ttl,
      );

      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Cache middleware error:', error);
      // Fallback to handler on error
      return handler(req);
    }
  };
}

/**
 * Invalidate cache by pattern
 * @param pattern Cache key pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  await redisClient.delByPattern(pattern);
}

/**
 * Invalidate all cache
 */
export async function invalidateAllCache(): Promise<void> {
  await redisClient.delByPattern('api:*');
}
