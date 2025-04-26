import Redis from 'ioredis';

/**
 * Redis client configuration
 */
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

/**
 * Default Redis configuration
 */
const DEFAULT_CONFIG: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: Number.parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'nokia-city:',
};

/**
 * Redis client singleton
 */
class RedisClient {
  private static instance: RedisClient;
  private client: Redis | null = null;
  private config: RedisConfig;

  private constructor(config: RedisConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Get Redis client instance
   */
  public static getInstance(config?: RedisConfig): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient(config);
    }
    return RedisClient.instance;
  }

  /**
   * Get Redis client connection
   */
  public getClient(): Redis {
    if (!this.client) {
      this.client = new Redis({
        ...this.config,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.client.on('error', (error: Error) => {
        console.error('Redis client error:', error);
      });

      this.client.on('connect', () => {
        console.log('Redis client connected');
      });
    }
    return this.client;
  }

  /**
   * Close Redis client connection
   */
  public async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  /**
   * Set a key-value pair in Redis
   * @param key Cache key
   * @param value Cache value
   * @param ttl Time to live in seconds
   */
  public async set(key: string, value: string, ttl?: number): Promise<void> {
    const client = this.getClient();
    if (ttl) {
      await client.setex(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  }

  /**
   * Get a value from Redis by key
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  public async get(key: string): Promise<string | null> {
    const client = this.getClient();
    return client.get(key);
  }

  /**
   * Delete a key from Redis
   * @param key Cache key
   */
  public async del(key: string): Promise<void> {
    const client = this.getClient();
    await client.del(key);
  }

  /**
   * Delete keys by pattern
   * @param pattern Key pattern
   */
  public async delByPattern(pattern: string): Promise<void> {
    const client = this.getClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  }

  /**
   * Check if a key exists in Redis
   * @param key Cache key
   * @returns true if key exists, false otherwise
   */
  public async exists(key: string): Promise<boolean> {
    const client = this.getClient();
    const result = await client.exists(key);
    return result === 1;
  }

  /**
   * Set key expiration
   * @param key Cache key
   * @param ttl Time to live in seconds
   */
  public async expire(key: string, ttl: number): Promise<void> {
    const client = this.getClient();
    await client.expire(key, ttl);
  }
}

export const redisClient = RedisClient.getInstance();
