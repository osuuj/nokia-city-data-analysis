import { type NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Message to return when rate limit is exceeded */
  message?: string;
}

interface RateLimitResult {
  success: boolean;
  error?: NextResponse;
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
};

const ipRequests = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware using token bucket algorithm
 * @param options Rate limiting configuration
 * @returns NextResponse or undefined if request should proceed
 */
export function rateLimit(
  req: NextRequest,
  options: Partial<RateLimitOptions> = {},
): RateLimitResult {
  const { maxRequests, windowMs } = { ...DEFAULT_OPTIONS, ...options };
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const now = Date.now();

  // Get or create rate limit data for this IP
  let rateLimitData = ipRequests.get(ip);
  if (!rateLimitData || now > rateLimitData.resetTime) {
    rateLimitData = { count: 0, resetTime: now + windowMs };
    ipRequests.set(ip, rateLimitData);
  }

  // Increment request count
  rateLimitData.count++;

  // Check if rate limit exceeded
  if (rateLimitData.count > maxRequests) {
    return {
      success: false,
      error: NextResponse.json({ error: 'Too many requests' }, { status: 429 }),
    };
  }

  return { success: true };
}

/**
 * Clean up old rate limit buckets periodically
 */
export function cleanupRateLimitBuckets() {
  const now = Date.now();
  for (const [ip, data] of ipRequests.entries()) {
    if (now > data.resetTime) {
      ipRequests.delete(ip);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupRateLimitBuckets, 3600000);
