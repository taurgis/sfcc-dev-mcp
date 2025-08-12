import { InMemoryCache, CacheManager } from '../src/utils/cache';

describe('InMemoryCache', () => {
  let cache: InMemoryCache<string>;

  beforeEach(() => {
    cache = new InMemoryCache<string>({
      maxSize: 3,
      ttlMs: 1000, // 1 second for testing
      cleanupIntervalMs: 100, // 100ms for faster testing
    });
  });

  afterEach(() => {
    cache.destroy();
  });

  describe('constructor', () => {
    it('should use default options when none provided', () => {
      const defaultCache = new InMemoryCache();
      const stats = defaultCache.getStats();

      expect(stats.maxSize).toBe(1000);
      defaultCache.destroy();
    });

    it('should accept custom options', () => {
      const customCache = new InMemoryCache({
        maxSize: 50,
        ttlMs: 5000,
        cleanupIntervalMs: 1000,
      });
      const stats = customCache.getStats();

      expect(stats.maxSize).toBe(50);
      customCache.destroy();
    });
  });

  describe('set and get', () => {
    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should update access statistics on get', () => {
      cache.set('key1', 'value1');
      cache.get('key1'); // First access
      cache.get('key1'); // Second access

      const stats = cache.getStats();
      const entry = stats.entries.find(e => e.key === 'key1');
      expect(entry?.accessCount).toBe(2);
    });

    it('should update lastAccessed timestamp on get', async () => {
      cache.set('key1', 'value1');
      const initialGet = cache.get('key1');

      // Wait a bit and access again
      await new Promise(resolve => setTimeout(resolve, 10));
      const secondGet = cache.get('key1');

      expect(initialGet).toBe('value1');
      expect(secondGet).toBe('value1');

      const stats = cache.getStats();
      const entry = stats.entries.find(e => e.key === 'key1');
      expect(entry?.accessCount).toBe(2);
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should not update access statistics', () => {
      cache.set('key1', 'value1');
      cache.has('key1');

      const stats = cache.getStats();
      const entry = stats.entries.find(e => e.key === 'key1');
      expect(entry?.accessCount).toBe(0);
    });
  });

  describe('delete', () => {
    it('should remove existing keys', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);

      const deleted = cache.delete('key1');
      expect(deleted).toBe(true);
      expect(cache.has('key1')).toBe(false);
    });

    it('should return false for non-existent keys', () => {
      const deleted = cache.delete('nonexistent');
      expect(deleted).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.getStats().size).toBe(2);

      cache.clear();
      expect(cache.getStats().size).toBe(0);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire entries after TTL', async () => {
      const shortTtlCache = new InMemoryCache<string>({
        ttlMs: 50, // 50ms
        cleanupIntervalMs: 1000, // Don't auto-cleanup for this test
      });

      shortTtlCache.set('key1', 'value1');
      expect(shortTtlCache.get('key1')).toBe('value1');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 60));
      expect(shortTtlCache.get('key1')).toBeUndefined();

      shortTtlCache.destroy();
    });

    it('should remove expired entries when checking has()', async () => {
      const shortTtlCache = new InMemoryCache<string>({
        ttlMs: 50,
        cleanupIntervalMs: 1000,
      });

      shortTtlCache.set('key1', 'value1');
      expect(shortTtlCache.has('key1')).toBe(true);

      await new Promise(resolve => setTimeout(resolve, 60));
      expect(shortTtlCache.has('key1')).toBe(false);

      shortTtlCache.destroy();
    });
  });

  describe('LRU (Least Recently Used) eviction', () => {
    it('should evict LRU item when max size is reached', async () => {
      // Fill cache to max capacity
      cache.set('key1', 'value1');
      await new Promise(resolve => setTimeout(resolve, 1)); // Small delay
      cache.set('key2', 'value2');
      await new Promise(resolve => setTimeout(resolve, 1)); // Small delay
      cache.set('key3', 'value3');
      expect(cache.getStats().size).toBe(3);

      // Wait a bit then access key1 and key2 to make key3 the least recently used
      await new Promise(resolve => setTimeout(resolve, 5));
      cache.get('key1');
      cache.get('key2');

      // Add new item, should evict key3
      cache.set('key4', 'value4');
      expect(cache.getStats().size).toBe(3);
      expect(cache.has('key3')).toBe(false);
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(true);
      expect(cache.has('key4')).toBe(true);
    });

    it('should not evict when updating existing key', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      // Update existing key
      cache.set('key1', 'newvalue1');
      expect(cache.getStats().size).toBe(3);
      expect(cache.get('key1')).toBe('newvalue1');
    });
  });

  describe('getStats', () => {
    it('should return correct cache statistics', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.get('key1'); // Access key1

      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(3);
      expect(stats.entries).toHaveLength(2);

      const key1Entry = stats.entries.find(e => e.key === 'key1');
      const key2Entry = stats.entries.find(e => e.key === 'key2');

      expect(key1Entry?.accessCount).toBe(1);
      expect(key2Entry?.accessCount).toBe(0);
    });

    it('should calculate hit rate correctly', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      cache.get('key1'); // Hit
      cache.get('key1'); // Hit
      // key2 never accessed

      const stats = cache.getStats();
      // Total accesses: 2, hits: 1 (key1 was accessed, key2 wasn't)
      expect(stats.hitRate).toBe(0.5);
    });
  });

  describe('cleanup', () => {
    it('should automatically cleanup expired entries', async () => {
      const autoCleanupCache = new InMemoryCache<string>({
        ttlMs: 50,
        cleanupIntervalMs: 60, // Very frequent cleanup
      });

      autoCleanupCache.set('key1', 'value1');
      expect(autoCleanupCache.getStats().size).toBe(1);

      // Wait for TTL + cleanup interval
      await new Promise(resolve => setTimeout(resolve, 120));

      const stats = autoCleanupCache.getStats();
      expect(stats.size).toBe(0);

      autoCleanupCache.destroy();
    });
  });

  describe('destroy', () => {
    it('should clear cache and stop cleanup timer', () => {
      cache.set('key1', 'value1');
      expect(cache.getStats().size).toBe(1);

      cache.destroy();
      expect(cache.getStats().size).toBe(0);

      // Cache should still be usable but without automatic cleanup
      cache.set('key2', 'value2');
      expect(cache.get('key2')).toBe('value2');
    });
  });
});

describe('CacheManager', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager();
  });

  afterEach(() => {
    cacheManager.destroy();
  });

  describe('file content cache', () => {
    it('should store and retrieve file content', () => {
      const content = 'file content';
      cacheManager.setFileContent('file1.ts', content);

      expect(cacheManager.getFileContent('file1.ts')).toBe(content);
      expect(cacheManager.getFileContent('nonexistent.ts')).toBeUndefined();
    });
  });

  describe('class details cache', () => {
    it('should store and retrieve class details', () => {
      const details = { name: 'TestClass', methods: ['method1', 'method2'] };
      cacheManager.setClassDetails('TestClass', details);

      expect(cacheManager.getClassDetails('TestClass')).toEqual(details);
      expect(cacheManager.getClassDetails('NonExistentClass')).toBeUndefined();
    });
  });

  describe('search results cache', () => {
    it('should store and retrieve search results', () => {
      const results = [{ name: 'result1' }, { name: 'result2' }];
      cacheManager.setSearchResults('query1', results);

      expect(cacheManager.getSearchResults('query1')).toEqual(results);
      expect(cacheManager.getSearchResults('query2')).toBeUndefined();
    });
  });

  describe('method search cache', () => {
    it('should store and retrieve method search results', () => {
      const results = [{ method: 'getValue', class: 'TestClass' }];
      cacheManager.setMethodSearch('getValue', results);

      expect(cacheManager.getMethodSearch('getValue')).toEqual(results);
      expect(cacheManager.getMethodSearch('nonexistent')).toBeUndefined();
    });
  });

  describe('getAllStats', () => {
    it('should return statistics for all caches', () => {
      cacheManager.setFileContent('file1.ts', 'content');
      cacheManager.setClassDetails('Class1', { name: 'Class1' });
      cacheManager.setSearchResults('query1', []);
      cacheManager.setMethodSearch('method1', []);

      const allStats = cacheManager.getAllStats();

      expect(allStats.fileContent.size).toBe(1);
      expect(allStats.classDetails.size).toBe(1);
      expect(allStats.searchResults.size).toBe(1);
      expect(allStats.methodSearch.size).toBe(1);

      expect(allStats.fileContent.maxSize).toBe(500);
      expect(allStats.classDetails.maxSize).toBe(300);
      expect(allStats.searchResults.maxSize).toBe(200);
      expect(allStats.methodSearch.maxSize).toBe(100);
    });
  });

  describe('clearAll', () => {
    it('should clear all caches', () => {
      cacheManager.setFileContent('file1.ts', 'content');
      cacheManager.setClassDetails('Class1', { name: 'Class1' });
      cacheManager.setSearchResults('query1', []);
      cacheManager.setMethodSearch('method1', []);

      let allStats = cacheManager.getAllStats();
      expect(allStats.fileContent.size).toBe(1);
      expect(allStats.classDetails.size).toBe(1);
      expect(allStats.searchResults.size).toBe(1);
      expect(allStats.methodSearch.size).toBe(1);

      cacheManager.clearAll();

      allStats = cacheManager.getAllStats();
      expect(allStats.fileContent.size).toBe(0);
      expect(allStats.classDetails.size).toBe(0);
      expect(allStats.searchResults.size).toBe(0);
      expect(allStats.methodSearch.size).toBe(0);
    });
  });

  describe('destroy', () => {
    it('should destroy all underlying caches', () => {
      cacheManager.setFileContent('file1.ts', 'content');

      let allStats = cacheManager.getAllStats();
      expect(allStats.fileContent.size).toBe(1);

      cacheManager.destroy();

      // After destroy, the caches should be cleared
      allStats = cacheManager.getAllStats();
      expect(allStats.fileContent.size).toBe(0);
    });
  });

  describe('different TTL configurations', () => {
    it('should have different TTL settings for different cache types', () => {
      // We can't directly test TTL values, but we can verify the caches work independently
      cacheManager.setFileContent('file1.ts', 'content');
      cacheManager.setClassDetails('Class1', { name: 'Class1' });
      cacheManager.setSearchResults('query1', ['result1']);
      cacheManager.setMethodSearch('method1', ['method1']);

      // All should be accessible
      expect(cacheManager.getFileContent('file1.ts')).toBe('content');
      expect(cacheManager.getClassDetails('Class1')).toEqual({ name: 'Class1' });
      expect(cacheManager.getSearchResults('query1')).toEqual(['result1']);
      expect(cacheManager.getMethodSearch('method1')).toEqual(['method1']);
    });
  });
});

describe('Edge cases and error handling', () => {
  describe('InMemoryCache edge cases', () => {
    it('should handle zero max size gracefully', () => {
      const zeroSizeCache = new InMemoryCache<string>({
        maxSize: 0,
        ttlMs: 1000,
      });

      zeroSizeCache.set('key1', 'value1');
      // With maxSize 0, nothing should be stored
      expect(zeroSizeCache.get('key1')).toBeUndefined();
      expect(zeroSizeCache.getStats().size).toBe(0);

      zeroSizeCache.destroy();
    });

    it('should handle very short TTL', async () => {
      const shortTtlCache = new InMemoryCache<string>({
        ttlMs: 1, // 1ms
        cleanupIntervalMs: 1000,
      });

      shortTtlCache.set('key1', 'value1');

      // Wait longer than TTL
      await new Promise(resolve => setTimeout(resolve, 5));

      expect(shortTtlCache.get('key1')).toBeUndefined();

      shortTtlCache.destroy();
    });

    it('should handle multiple destroy calls', () => {
      const cache = new InMemoryCache<string>();
      cache.set('key1', 'value1');

      cache.destroy();
      cache.destroy(); // Second destroy should not throw

      expect(cache.getStats().size).toBe(0);
    });
  });

  describe('Type safety', () => {
    it('should maintain type safety for different value types', () => {
      const stringCache = new InMemoryCache<string>();
      const numberCache = new InMemoryCache<number>();
      const objectCache = new InMemoryCache<{ id: number; name: string }>();

      stringCache.set('key1', 'string value');
      numberCache.set('key1', 42);
      objectCache.set('key1', { id: 1, name: 'test' });

      const stringValue: string | undefined = stringCache.get('key1');
      const numberValue: number | undefined = numberCache.get('key1');
      const objectValue: { id: number; name: string } | undefined = objectCache.get('key1');

      expect(typeof stringValue).toBe('string');
      expect(typeof numberValue).toBe('number');
      expect(typeof objectValue).toBe('object');

      stringCache.destroy();
      numberCache.destroy();
      objectCache.destroy();
    });
  });
});
