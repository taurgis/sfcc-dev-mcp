/**
 * In-Memory Caching Module
 *
 * Provides efficient caching with TTL (Time-To-Live) and LRU (Least Recently Used) eviction
 * to reduce IO operations and improve response times for SFCC documentation queries.
 */

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  maxSize?: number;
  ttlMs?: number;
  cleanupIntervalMs?: number;
}

export class InMemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly maxSize: number;
  private readonly ttlMs: number;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 1000;
    this.ttlMs = options.ttlMs ?? 60 * 60 * 1000; // 1 hour default for static data

    // Setup automatic cleanup - less frequent for static data
    const cleanupInterval = options.cleanupIntervalMs ?? 10 * 60 * 1000; // 10 minutes
    this.cleanupTimer = setInterval(() => this.cleanup(), cleanupInterval);
  }

  /**
   * Store a value in the cache
   */
  set(key: string, value: T): void {
    const now = Date.now();

    // Handle zero max size - don't store anything
    if (this.maxSize === 0) {
      return;
    }

    // If at max capacity and adding a new key, remove LRU item first
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now,
    });
  }

  /**
   * Retrieve a value from the cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    const now = Date.now();

    // Check if entry has expired
    if (now - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return undefined;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;

    return entry.value;
  }

  /**
   * Check if a key exists in the cache (without updating access stats)
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove a specific key from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{ key: string; accessCount: number; age: number }>;
    } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      accessCount: entry.accessCount,
      age: now - entry.timestamp,
    }));

    const totalAccesses = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const totalHits = entries.filter(entry => entry.accessCount > 0).length;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalAccesses > 0 ? totalHits / totalAccesses : 0,
      entries,
    };
  }

  /**
   * Remove expired entries from the cache
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttlMs) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  /**
   * Evict the least recently used item
   */
  private evictLRU(): void {
    let oldestKey: string | undefined;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.clear();
  }
}

/**
 * Multi-layer cache manager for different types of data
 */
export class CacheManager {
  private fileContentCache: InMemoryCache<string>;
  private classDetailsCache: InMemoryCache<any>;
  private searchResultsCache: InMemoryCache<any>;
  private methodSearchCache: InMemoryCache<any>;

  constructor() {
    // Much longer TTL for static documentation data that doesn't change during server runtime
    this.fileContentCache = new InMemoryCache<string>({
      maxSize: 500,
      ttlMs: 4 * 60 * 60 * 1000, // 4 hours - raw file content is completely static
      cleanupIntervalMs: 30 * 60 * 1000, // 30 minutes cleanup interval
    });

    this.classDetailsCache = new InMemoryCache({
      maxSize: 300,
      ttlMs: 2 * 60 * 60 * 1000, // 2 hours - parsed data is static
      cleanupIntervalMs: 20 * 60 * 1000, // 20 minutes cleanup interval
    });

    this.searchResultsCache = new InMemoryCache({
      maxSize: 200,
      ttlMs: 60 * 60 * 1000, // 1 hour - search results are static
      cleanupIntervalMs: 15 * 60 * 1000, // 15 minutes cleanup interval
    });

    this.methodSearchCache = new InMemoryCache({
      maxSize: 100,
      ttlMs: 60 * 60 * 1000, // 1 hour - method search results are static
      cleanupIntervalMs: 15 * 60 * 1000, // 15 minutes cleanup interval
    });
  }

  getFileContent(key: string): string | undefined {
    return this.fileContentCache.get(key);
  }

  setFileContent(key: string, content: string): void {
    this.fileContentCache.set(key, content);
  }

  getClassDetails(key: string): any {
    return this.classDetailsCache.get(key);
  }

  setClassDetails(key: string, details: any): void {
    this.classDetailsCache.set(key, details);
  }

  getSearchResults(key: string): any {
    return this.searchResultsCache.get(key);
  }

  setSearchResults(key: string, results: any): void {
    this.searchResultsCache.set(key, results);
  }

  getMethodSearch(key: string): any {
    return this.methodSearchCache.get(key);
  }

  setMethodSearch(key: string, results: any): void {
    this.methodSearchCache.set(key, results);
  }

  /**
   * Get comprehensive cache statistics
   */
  getAllStats(): {
    fileContent: ReturnType<InMemoryCache<any>['getStats']>;
    classDetails: ReturnType<InMemoryCache<any>['getStats']>;
    searchResults: ReturnType<InMemoryCache<any>['getStats']>;
    methodSearch: ReturnType<InMemoryCache<any>['getStats']>;
    } {
    return {
      fileContent: this.fileContentCache.getStats(),
      classDetails: this.classDetailsCache.getStats(),
      searchResults: this.searchResultsCache.getStats(),
      methodSearch: this.methodSearchCache.getStats(),
    };
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.fileContentCache.clear();
    this.classDetailsCache.clear();
    this.searchResultsCache.clear();
    this.methodSearchCache.clear();
  }

  /**
   * Cleanup all resources
   */
  destroy(): void {
    this.fileContentCache.destroy();
    this.classDetailsCache.destroy();
    this.searchResultsCache.destroy();
    this.methodSearchCache.destroy();
  }
}
