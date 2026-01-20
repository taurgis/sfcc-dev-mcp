# ISML Remote Includes Reference

Comprehensive guide for local vs remote includes, caching strategies, and security.

## Local vs Remote Includes

| Attribute | Local Include | Remote Include |
|-----------|---------------|----------------|
| Syntax | `<isinclude template="...">` | `<isinclude url="...">` |
| Processing | Single request on Application Server | Parent + secondary request via Web Adapter |
| Data Scope | Full access to parent `pdict` & variables | Isolated – only URL query params available |
| Cache Policy | Inherits parent (lowest TTL wins) | Independent TTL per fragment |
| Typical Use | Reusable markup, partials | Mini-cart, personalized slots, dynamic widgets |
| Overhead | Minimal | Extra HTTP round trip |
| Security | Inherits parent auth state | New unauthenticated request |
| Failure Mode | Template error breaks page | Fragment timeout can delay assembly |

## When to Use Remote Includes

Use a **local include** unless ALL are true:
1. Fragment volatility differs meaningfully from page shell
2. Output can be parameterized via simple query params
3. Performance gain from separate caching outweighs added request
4. Security implications are understood and mitigated

## Implementing Remote Includes

### Template Example

Mini-cart header icon (uncached) while page shell cached for hours:

```html
<div class="header-cart" data-component="mini-cart">
    <isinclude url="${URLUtils.url('Cart-MiniCart')}" />
</div>
```

### Controller Pattern

```javascript
var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('MiniCart',
    server.middleware.include, // Gatekeeper: only valid inside remote include
    cache.applyShortPromotionSensitiveCache, // Or cache.disableCaching()
    function (req, res, next) {
        // Build isolated model – no parent pdict access
        res.render('components/header/miniCart');
        next();
    }
);

module.exports = server.exports();
```

## Passing Data

All context must be URL params:

```html
<isinclude url="${URLUtils.url('Page-Include', 'cid', 'footer-content-asset')}" />
```

**Warning:** Each unique full URL becomes a distinct cache entry (cache fragmentation risk).

## Caching Strategy Patterns

| Scenario | Page Shell TTL | Remote Include TTL | Rationale |
|----------|----------------|--------------------|-----------|
| Marketing landing + live inventory | 12h | 5m | Keep inventory fresh |
| Category grid + personalized banner | 4h | 15m | Personalized offers rotate |
| PDP + mini-cart | 2h | 0 (uncached) | Basket state = current session |

Keep total remote includes per page conservative (<20 recommended).

## Performance Anti-Patterns

| Anti-Pattern | Why Harmful | Better Alternative |
|--------------|-------------|-------------------|
| Remote include per product tile | N extra HTTP requests | Single parent with local includes |
| Position/index params that vary | Creates unique cache keys | Omit non-functional params |
| Deep nesting (include chain) | Compounding latency | Flatten architecture |

## Security Requirements

Remote include endpoints are effectively **public** unless you add authentication middleware.

**NEVER** expose PII or account state in an unprotected include.

```javascript
server.get('SensitiveFragment',
    server.middleware.include,
    userLoggedIn.validateLoggedIn, // if user-specific
    function (req, res, next) { ... }
);
```

## Checklist

```text
[ ] Justified different cache TTL
[ ] URL params minimal & non-sensitive
[ ] server.middleware.include first
[ ] Additional auth middleware if user data
[ ] Explicit cache middleware (or disabled)
[ ] Fragment count on page < 20
[ ] No nested chains beyond depth 2
```

## When NOT to Use Remote Includes

- Pure presentational partials (icons, button groups)
- Iterative children of a paginated list
- Form bodies requiring parent validation context
- Anything requiring parent `pdict` without trivial serialization
