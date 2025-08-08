## Package: dw.system

# Class Cache

## Inheritance Hierarchy

- Object
  - dw.system.Cache

## Description

The Cache class represents a custom cache. A cache stores data over multiple requests. Each cartridge can define its own caches for different business requirements. To limit the visibility of cache entries by scope, for example, by site, catalog, or external system, include the scope reference when constructing the key. For example: var cache = CacheMgr.getCache( 'SiteConfigurations' ); cache.get( Site.current.ID + "config", function loadSiteConfiguration() {return loadCfg( Site.current );} ); Do not build the cache key using personal user data, since the key might be visible in log messages. There is never a guarantee that a stored object can be retrieved from the cache. The storage allocated for entries is limited and clearing or invalidation might occur at any time. To maintain the cache size limits, the cache evicts entries that are less likely to be used again. For example, the cache might evict an entry because it hasn't been used recently or very often. Cache entries aren't synchronized between different application servers. The cache returns immutable copies of the original objects put into the cache. Lists are converted to arrays during this process. Only JavaScript primitive values and tree-like object structures can be stored as entries. Object structures can consist of arrays, lists, and basic JavaScript objects. Script API classes are not supported, except List and its subclasses. null can be stored as a value. undefined can't be stored. See CacheMgr for details about how to configure a custom cache.

## Constructor Summary

## Method Summary

### get

**Signature:** `get(key : String, loader : Function) : Object`

Returns the value associated with key in this cache, or invokes the loader function to generate the entry if there is no entry found.

### get

**Signature:** `get(key : String) : Object`

Returns the value associated with key in this cache.

### invalidate

**Signature:** `invalidate(key : String) : void`

Removes the cache entry for key (if one exists) manually before the cache's eviction strategy goes into effect.

### put

**Signature:** `put(key : String, value : Object) : void`

Stores the specified entry directly into the cache, replacing any previously cached entry for key if one exists.

## Method Detail

## Method Details

### get

**Signature:** `get(key : String, loader : Function) : Object`

**Description:** Returns the value associated with key in this cache, or invokes the loader function to generate the entry if there is no entry found. The generated entry is stored for future retrieval. If the loader function returns undefined, this value is not stored in the cache.

**Parameters:**

- `key`: The cache key.
- `loader`: The loader function that is called if no value is stored in the cache.

**Returns:**

The value found in the cache or the value returned from the loader function call.

---

### get

**Signature:** `get(key : String) : Object`

**Description:** Returns the value associated with key in this cache. If there is no entry in the cache then undefined is returned.

**Parameters:**

- `key`: The cache key.

**Returns:**

The stored value or undefined if no value is found in the cache.

---

### invalidate

**Signature:** `invalidate(key : String) : void`

**Description:** Removes the cache entry for key (if one exists) manually before the cache's eviction strategy goes into effect.

**Parameters:**

- `key`: The cache key.

---

### put

**Signature:** `put(key : String, value : Object) : void`

**Description:** Stores the specified entry directly into the cache, replacing any previously cached entry for key if one exists. Storing undefined as value has the same effect as calling invalidate(String) for that key.

**Parameters:**

- `key`: The cache key.
- `value`: The value to be store in the cache.

---