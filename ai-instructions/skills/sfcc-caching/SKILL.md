---
name: sfcc-caching
description: Unified caching playbook for SFCC (page cache vs custom cache vs service response cache). Use this when improving performance, reducing external calls, designing cache keys/TTLs, or debugging stale cache behavior.
---

# SFCC Caching (Unified Playbook)

Caching in SFCC has multiple layers. The most common failures come from:
- choosing the wrong cache layer
- unsafe population patterns
- invalidation assumptions (multi-node)
- caching the wrong data types (heavy API objects)

## Quick Checklist

```text
[ ] Choose cache layer: page cache (HTML) vs custom cache (data) vs service response cache
[ ] Design keys with site + locale scoping where needed
[ ] Use atomic get-or-load patterns (avoid double loaders)
[ ] Cache POJOs/DTOs, not dw.* API objects
[ ] Design around TTL, not cross-node invalidation
[ ] Monitor hit ratios and write failures in Business Manager
```

## Cache Layers (Pick the Right Tool)

| Layer | What it caches | When to use |
|---|---|---|
| Page cache | Rendered responses / fragments | High-traffic pages where output can be cached |
| Custom cache (`CacheMgr`) | Application data | Expensive computations, repeated DB lookups, third-party responses |
| Service response cache | HTTP responses inside service framework | Repeated calls to stable third-party APIs |

## Scope: request vs session vs CacheMgr

- `request.custom`: per-request scratchpad
- `session.custom` / `session.privacy`: per-user, per-session data (keep small)
- `CacheMgr`: app-server local cache shared by users on the same node

Never store user-specific data in a global custom cache.

## Custom Cache Mechanics (Non-Negotiable Rules)

### 1) Define caches in `caches.json` and register in cartridge `package.json`
- Cache IDs must be globally unique across the cartridge path.
- The `package.json` that declares `"caches"` must live in the cartridge root (cartridges/{{mycartridge}}/package.json), and the `caches.json` path is relative to that.

### 2) Use atomic “get-or-load”
Prefer `cache.get(key, loader)` (single step). Avoid:
- `if (!cache.get(key)) cache.put(key, load())`

### 3) Cache POJOs, not API objects
Don’t cache `dw.catalog.Product`, `dw.order.Order`, etc.
Map to a lightweight object with only the fields you need.

### 4) TTL over invalidation
Per-key invalidation across all nodes is unreliable.
Design for a small staleness window using `expireAfterSeconds`.

### 5) Watch size limits and monitoring
- Large entries can fail to store without throwing exceptions.
- Use Business Manager stats (hit ratio, write failures) to validate effectiveness.

## Service Response Caching (LocalServiceRegistry)

If your third-party data is stable for short periods:
- Enable response caching on the underlying HTTP client in the service definition
- Ensure you understand how to clear it (BM invalidation is typically global)

Key warnings:
- stale data risk
- debugging surprises (you may not hit the network)
- cached calls can still affect service stats / circuit breakers

## References
- Rhino Inquisitor: Field Guide to Custom Caches
  - https://www.rhino-inquisitor.com/field-guide-to-custom-caches-in-sfcc/
- Rhino Inquisitor: Third-Party API Caching in Commerce Cloud
  - https://www.rhino-inquisitor.com/third-party-api-caching-in-commerce-cloud/
- SFCC Docs: Custom Caches
  - https://developer.salesforce.com/docs/commerce/b2c-commerce/guide/b2c-custom-caches.html
- SFCC Script API: `dw.system.CacheMgr` (cartridge `package.json` cache registration)
  - https://salesforcecommercecloud.github.io/b2c-dev-doc/docs/current/scriptapi/html/api/class_dw_system_CacheMgr.html
