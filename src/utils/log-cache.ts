import { SFCCLogClient } from '../clients/log-client.js';

/**
 * Simple in-memory cache for log operations
 * Provides short-term caching to avoid repeated API calls for common operations
 */
export class LogCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 5000; // 5 seconds default TTL
  private readonly MAX_CACHE_SIZE = 100; // Prevent memory bloat

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data with TTL
   */
  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    // Implement basic LRU by removing oldest entries when cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Generate cache key for log operations
   */
  static generateKey(operation: string, args: Record<string, any>): string {
    const sortedArgs = Object.keys(args)
      .sort()
      .map(key => `${key}=${args[key]}`)
      .join('&');

    return `${operation}:${sortedArgs}`;
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries (can be called periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Enhanced log client wrapper with caching capabilities
 * Provides transparent caching for frequently accessed log operations
 */
export class CachedLogClient {
  private cache = new LogCache();
  private readonly CACHEABLE_OPERATIONS = new Set([
    'list_log_files',
    'get_latest_job_log_files',
    'summarize_logs',
  ]);

  constructor(private logClient: SFCCLogClient) {}

  /**
   * Execute operation with caching if applicable
   */
  async executeWithCache<T>(
    operation: string,
    args: Record<string, any>,
    executor: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    // Only cache certain operations to avoid stale data issues
    if (!this.CACHEABLE_OPERATIONS.has(operation)) {
      return executor();
    }

    const cacheKey = LogCache.generateKey(operation, args);
    const cached = this.cache.get<T>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    const result = await executor();
    this.cache.set(cacheKey, result, ttl);
    return result;
  }

  /**
   * Clear cache - useful when log state might have changed
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Cleanup expired cache entries
   */
  cleanupCache(): void {
    this.cache.cleanup();
  }
}
