/**
 * Cache time configurations for dashboard queries
 */

export const CACHE_CONFIG = {
  // Analytics cache times
  ANALYTICS: {
    STALE_TIME: 1000 * 60 * 10, // 10 minutes
    GC_TIME: 1000 * 60 * 30, // 30 minutes
  },
} as const;
