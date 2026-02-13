# Remote Include Architecture Reference

Comprehensive reference for remote include patterns in SFRA controllers.

## Execution Model

Remote includes bridge controller design, caching, and security. Each `<isinclude url="...">` triggers a secondary request whose lifecycle is independent of the parent page.

### Execution Flow

1. Parent controller builds main page (may be fully cached)
2. Application Server streams HTML with remote include placeholders
3. Web Adapter detects placeholders → performs new HTTP requests to each include URL
4. Include controller runs with `req.includeRequest === true`
5. Web Adapter stitches fragment responses into final payload

## Mandatory Middleware Ordering

Always begin remote include routes with the gatekeeper:

```javascript
server.get('MiniCart',
  server.middleware.include,  // Ensures only include-origin requests allowed
  /* cache or auth middleware here */
  function (req, res, next) {
     // Build fragment model – NO parent pdict access
     res.render('components/header/miniCart');
     return next();
  }
);
```

Add authentication right AFTER the gatekeeper if user‑specific:

```javascript
server.get('AccountSummary',
  server.middleware.include,
  userLoggedIn.validateLoggedIn,
  cache.applyShortPromotionSensitiveCache,
  function (req, res, next) {
     res.render('account/summary');
     next();
  }
);
```

## Data Passing Constraints

Include controllers cannot see parent `pdict`. All inputs must be query parameters defined in the template:

```isml
<isinclude url="${URLUtils.url('PromoSlot-Include', 'slotId', 'hp_banner_1')}" />
```

**Important**: Avoid volatile params that reduce cache hits (e.g., timestamps, indexes, random tokens).

## Caching Strategy Patterns

| Fragment | Typical TTL | Notes |
|----------|------------|-------|
| MiniCart | 0 (uncached) | Basket must reflect real-time state |
| Personalized Banner | 5–15m | Balance freshness vs recompute cost |
| Static Navigation | 12–24h | Rarely changes; high CDN / app cache hit rate |
| Inventory Badge | 1–5m | Short TTL isolates volatility |

## Performance Guardrails

| Concern | Guidance |
|---------|----------|
| Count per page | Target < 20 (soft). Overuse causes waterfall latency. |
| Nesting depth | Keep ≤ 2. Depth 3+ complicates tracing & raises miss amplification. |
| Fragment size | Keep payload lean (<10KB ideal) – remote includes are for targeted data. |
| Parallelism | Web Adapter fetches includes concurrently; slowest fragment = page delay. Optimize worst offender first. |

## Observability & Tracing

Search logs by extended request ID pattern: `baseId-depth-index`.

Example sequence:
- `Qx1Ab-0-00` (page) 
- `Qx1Ab-1-01` (first fragment) 
- `Qx1Ab-2-03` (nested fragment)

Add structured logging:

```javascript
Logger.info('Include {0} depth={1} start', request.httpPath, request.requestID);
```

## Security Checklist

```text
[ ] server.middleware.include first
[ ] Auth middleware if user-specific data
[ ] No PII in query params
[ ] Explicit cache middleware (or intentional no-cache)
[ ] Fragment output sanitized (no raw user input)
[ ] Error handling returns safe minimal content
```

If any box unchecked → treat as deployment blocker.

## Anti‑Patterns & Refactors

| Anti‑Pattern | Risk | Refactor |
|--------------|------|----------|
| Remote include per search result | N network calls, poor TTFB | Single controller renders list with local includes |
| Passing large serialized JSON in query | URL length + logging exposure | Use lightweight ID → lookup inside fragment |
| Relying on parent csrf/viewData | Undefined behavior, security gaps | Regenerate context in fragment |
| Deep chain (>2 levels) | Hard to debug, compounded latency | Flatten – merge sibling fragments |

## Example: Structured Composite Page

Home page shell (24h cache) + fragments:
- `MiniCart` (0 TTL)
- `PromoBanner` (15m)
- `CategoryRefinements` (1h)

Each can be independently invalidated without purging page shell cache.

## Decision Flow

```text
Need different TTL? ── no ─▶ Local include
    │
    yes
Is data easily param encoded? ── no ─▶ Controller aggregation instead
    │
    yes
Contains sensitive data? ── yes ─▶ Add auth middleware
    │
    (Proceed) Remote include
```

## Common Include Controller Patterns

### Header Mini Cart

```javascript
server.get('MiniCart',
    server.middleware.include,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var currentBasket = BasketMgr.getCurrentBasket();
        var quantityTotal = 0;
        
        if (currentBasket) {
            quantityTotal = currentBasket.productQuantityTotal;
        }
        
        res.render('components/header/miniCart', {
            quantityTotal: quantityTotal
        });
        next();
    }
);
```

### Cached Navigation

```javascript
server.get('Navigation',
    server.middleware.include,
    cache.applyDefaultCache,
    function (req, res, next) {
        var CatalogMgr = require('dw/catalog/CatalogMgr');
        var categories = CatalogMgr.getSiteCatalog().getRoot().getSubCategories();
        
        res.render('components/header/navigation', {
            categories: categories
        });
        next();
    }
);
```

### User-Specific Content

```javascript
server.get('WelcomeMessage',
    server.middleware.include,
    function (req, res, next) {
        var viewData = {
            isLoggedIn: req.currentCustomer.authenticated,
            customerName: req.currentCustomer.profile ? 
                req.currentCustomer.profile.firstName : null
        };
        
        res.render('components/header/welcomeMessage', viewData);
        next();
    }
);
```
