import Redis from 'ioredis';

/**
 * Redis client configuration
 */
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  enableRedis?: boolean; // New option to control Redis usage
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
  enableRedis: process.env.ENABLE_REDIS === 'true', // Default to disabled
};

// Simple in-memory cache as a fallback
class MemoryCache {
  private cache: Map<string, { value: string; expiry: number | null }> = new Map();

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + ttl * 1000 : null;
    this.cache.set(key, { value, expiry });

    // Cleanup expired items
    if (expiry && ttl) {
      setTimeout(() => {
        const item = this.cache.get(key);
        if (item && item.expiry === expiry) {
          this.cache.delete(key);
        }
      }, ttl * 1000);
    }
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    return (
      this.cache.has(key) &&
      (!this.cache.get(key)?.expiry || this.cache.get(key)?.expiry > Date.now())
    );
  }
}

/**
 * Redis client singleton
 */
class RedisClient {
  private static instance: RedisClient;
  private client: Redis | null = null;
  private memoryCache: MemoryCache = new MemoryCache();
  private config: RedisConfig;
  private useRedis = false;

  private constructor(config: RedisConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.useRedis = !!config.enableRedis;
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
  public getClient(): Redis | null {
    if (!this.useRedis) {
      return null;
    }

    if (!this.client) {
      try {
        this.client = new Redis({
          host: this.config.host,
          port: this.config.port,
          password: this.config.password || undefined,
          db: this.config.db,
          keyPrefix: this.config.keyPrefix,
          lazyConnect: true,
        });

        this.client.on('error', (error) => {
          console.error('Redis client error:', error);
          this.useRedis = false;
          this.client = null;
        });

        this.client.on('connect', () => {
          console.log('Redis client connected');
          this.useRedis = true;
        });
      } catch (error) {
        console.error('Failed to initialize Redis client:', error);
        this.useRedis = false;
        this.client = null;
      }
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
   */
  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (this.useRedis && this.getClient()) {
      try {
        if (ttl) {
          await this.client?.set(key, value, 'EX', ttl);
        } else {
          await this.client?.set(key, value);
        }
        return;
      } catch (error) {
        console.error('Redis set error:', error);
        // Fallback to memory cache
      }
    }

    // Use memory cache if Redis is not available
    await this.memoryCache.set(key, value, ttl);
  }

  /**
   * Get a value from Redis by key
   */
  public async get(key: string): Promise<string | null> {
    if (this.useRedis && this.getClient()) {
      try {
        return await this.client?.get(key);
      } catch (error) {
        console.error('Redis get error:', error);
        // Fallback to memory cache
      }
    }

    // Use memory cache if Redis is not available
    return this.memoryCache.get(key);
  }

  /**
   * Delete a key from Redis
   */
  public async del(key: string): Promise<void> {
    if (this.useRedis && this.getClient()) {
      try {
        await this.client?.del(key);
      } catch (error) {
        console.error('Redis del error:', error);
      }
    }

    // Always delete from memory cache
    await this.memoryCache.del(key);
  }

  /**
   * Delete keys matching a pattern
   */
  public async delByPattern(pattern: string): Promise<void> {
    if (this.useRedis && this.getClient()) {
      try {
        const keys = await this.client?.keys(pattern);
        if (keys && keys.length > 0) {
          await this.client?.del(...keys);
        }
      } catch (error) {
        console.error('Redis delByPattern error:', error);
      }
    }

    // Always delete from memory cache
    await this.memoryCache.delByPattern(pattern);
  }

  /**
   * Check if a key exists in Redis
   */
  public async exists(key: string): Promise<boolean> {
    if (this.useRedis && this.getClient()) {
      try {
        const exists = await this.client?.exists(key);
        return exists === 1;
      } catch (error) {
        console.error('Redis exists error:', error);
      }
    }

    // Use memory cache if Redis is not available
    return this.memoryCache.exists(key);
  }
}

export const redisClient = RedisClient.getInstance();
