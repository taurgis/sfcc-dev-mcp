# ISML iscache Element

## Overview

The `<iscache>` element controls page caching to dramatically improve storefront performance. By caching pages, the server bypasses dynamic page generation and delivers pre-rendered content almost instantaneously. This element allows you to specify cache expiration strategies, personalization requirements, and conditional caching based on business rules.

**Performance Impact:** Cached pages are treated like static content, eliminating controller execution and template processing for subsequent requests.

## Syntax

```isml
<iscache
  status = "on"                      // optional (default: "on")
  type   = "relative" | "daily"      // optional (required if no varyby)
  hour   = integer_duration_hr       // optional
  minute = integer_duration_min      // optional
  varyby = "price_promotion"         // optional (required if no type)
  if     = boolean_expression        // optional
/>
```

## Attributes

### status

**Type:** String  
**Allowed Values:** `"on"` (default), `"off"` (deprecated)  
**Optional:** Yes

Controls whether page caching is enabled or disabled.

⚠️ **DEPRECATED:** `status="off"` is deprecated. To disable caching, simply omit the `<iscache>` element or use the `if` attribute for conditional disabling.

**Important:**
- Just including `<iscache/>` implicitly enables caching (no need to set `status="on"`)
- If `status="off"` is set anywhere (template or includes), caching cannot be re-enabled
- Using `status="off"` writes deprecation warnings to logs
- Disabling caching hurts performance—use the `if` attribute instead for conditional control

```isml
<!-- Modern: Caching enabled (recommended) -->
<iscache type="relative" hour="1"/>

<!-- Deprecated: Don't use status="off" -->
<iscache status="off"/>  <!-- DEPRECATED -->

<!-- Instead: Use if attribute for conditional caching -->
<iscache type="relative" hour="1" if="${!pdict.isPersonalized}"/>
```

### type

**Type:** String  
**Allowed Values:** `"relative"`, `"daily"`  
**Required:** Yes (unless `varyby` is specified)

Specifies the caching strategy—either relative to current time or at a specific daily time.

**`"relative"`**: Cache expires after a specified duration from the time the page was cached.
- Use `hour` and `minute` to specify duration
- Example: Cache for 2 hours and 30 minutes

**`"daily"`**: Cache expires at a specific time each day (GMT timezone, 24-hour format).
- Use `hour` and `minute` to specify time (0:00 - 23:59)
- Example: Expire at 6:30 AM GMT daily

```isml
<!-- Relative: Cache for 2 hours -->
<iscache type="relative" hour="2"/>

<!-- Daily: Expire at 6:30 AM GMT every day -->
<iscache type="daily" hour="6" minute="30"/>
```

### hour

**Type:** Integer or Integer Expression  
**Allowed Values:**
- `type="daily"`: 0–23 (24-hour format)
- `type="relative"`: 0–unlimited
**Default:** 0 (if `type` specified), next hour (if only `varyby` specified)

For `type="daily"`: The hour of day (GMT) when cache expires.  
For `type="relative"`: Number of hours from current time when cache expires.

```isml
<!-- Daily: Expire at 14:00 (2:00 PM) GMT -->
<iscache type="daily" hour="14"/>

<!-- Relative: Cache for 3 hours -->
<iscache type="relative" hour="3"/>

<!-- Expression: Dynamic hour value -->
<iscache type="relative" hour="${pdict.cacheHours}"/>
```

### minute

**Type:** Integer or Integer Expression  
**Allowed Values:**
- `type="daily"`: 0–59
- `type="relative"`: 0–unlimited
**Default:** 0 (if `type` specified), random 0–15 minutes (if only `varyby` specified)

For `type="daily"`: The minute of the hour when cache expires.  
For `type="relative"`: Number of minutes from current time when cache expires.

```isml
<!-- Daily: Expire at 6:30 AM GMT -->
<iscache type="daily" hour="6" minute="30"/>

<!-- Relative: Cache for 90 minutes -->
<iscache type="relative" minute="90"/>

<!-- Relative: Cache for 2 hours 30 minutes -->
<iscache type="relative" hour="2" minute="30"/>

<!-- Expression: Dynamic minute value -->
<iscache type="relative" minute="${pdict.cacheMinutes}"/>
```

### varyby

**Type:** String  
**Allowed Values:** `"price_promotion"`  
**Required:** Yes (unless `type` is specified)

Marks a page as personalized, instructing Commerce Cloud to cache different variations based on:
- Complete set of active promotions
- Complete set of active product sorting rules
- Complete set of applicable price books
- Complete set of active A/B test groups

**How it works:**
- Web adapter stores different page variations in cache
- Correct version delivered to shopper based on their promotion/price/sorting/AB test context
- Multiple shoppers with same context receive same cached page

⚠️ **Performance Warning:** Only use `varyby` when pages actually vary by these parameters. Unnecessary use causes cache fragmentation (multiple identical copies stored), degrading performance.

```isml
<!-- Personalized search results (vary by price/promotion) -->
<iscache type="relative" minute="30" varyby="price_promotion"/>

<!-- Category page with promotional pricing -->
<iscache type="relative" hour="2" varyby="price_promotion"/>

<!-- Only varyby (random expiration next hour) -->
<iscache varyby="price_promotion"/>
```

**Page Personalization Rule:** If any `<iscache>` element on a page has `varyby` set, the **entire page** is treated as personalized (even if other `<iscache>` elements don't have `varyby`).

### if

**Type:** Boolean Expression  
**Optional:** Yes

Conditionally disables caching based on an expression. When the expression evaluates to `false`, page caching is disabled.

⚠️ **Performance Warning:** Disabling caching significantly impacts performance. Use sparingly and only on pages with minimal persistent object interaction.

**Use Cases:**
- Einstein Predictive Sort (personalized sorting)
- Individual shopper personalization
- Dynamic content that can't use `varyby`

**Recommendation:** If possible, use `varyby="price_promotion"` instead of the `if` attribute for better performance.

```isml
<!-- Disable caching for personalized sort -->
<iscache hour="2" varyby="price_promotion" if="${!searchModel.isPersonalizedSort()}"/>

<!-- Cache only for non-logged-in users -->
<iscache type="relative" hour="1" if="${!customer.authenticated}"/>

<!-- Cache unless basket has items -->
<iscache type="relative" minute="30" if="${empty(pdict.Basket.productLineItems)}"/>
```

**Expression Requirements:**
- Must evaluate to boolean (`true` or `false`)
- Passing a non-boolean value throws an error
- Passing a value instead of expression throws an error

## Purpose and Behavior

### Performance Benefits

**Without Cache:**
1. Request arrives
2. Controller executes
3. ISML templates processed
4. Dynamic page generated
5. Response sent

**With Cache:**
1. Request arrives
2. Cached page delivered immediately (controller and templates bypassed)

**Result:** Near-instantaneous page delivery, significantly reduced server load.

### First Request Flow

1. **Initial Request:** Page not in cache
2. **Dynamic Generation:** Server executes controller and processes templates
3. **Cache Storage:** Generated page stored in cache with expiration settings
4. **Subsequent Requests:** Cached page delivered until expiration

### Cache Expiration

When cached page expires:
- Next request triggers dynamic generation
- Newly generated page replaces old cache entry
- Cache cycle continues

## Common Use Cases

### Homepage (Daily Expiration)

```isml
<!-- homepage.isml -->
<iscache type="daily" hour="0" minute="0"/>

<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our Store</title>
</head>
<body>
    <h1>Featured Products</h1>
    <!-- Static or rarely changing content -->
</body>
</html>
```

**Rationale:** Homepage changes once daily (new promotions, featured products), expires at midnight.

### Product Listing Page (Relative Expiration)

```isml
<!-- search/productListing.isml -->
<iscache type="relative" hour="1"/>

<div class="product-listing">
    <h2>Search Results</h2>
    <isloop items="${pdict.products}" var="product">
        <div class="product-tile">
            <h3>${product.name}</h3>
            <span>${product.price}</span>
        </div>
    </isloop>
</div>
```

**Rationale:** Product availability and pricing can change; cache for 1 hour to balance freshness and performance.

### Search Results with Personalization

```isml
<!-- search/searchResults.isml -->
<iscache type="relative" minute="30" varyby="price_promotion"/>

<div class="search-results">
    <isloop items="${pdict.searchResults}" var="result">
        <div class="result-item">
            <h4>${result.productName}</h4>
            <span class="price">${result.price}</span>
            <span class="promo">${result.promotionText}</span>
        </div>
    </isloop>
</div>
```

**Rationale:** Prices and promotions vary by customer segment; use `varyby` to cache variations.

### Category Landing Page

```isml
<!-- category/categoryLanding.isml -->
<iscache type="relative" hour="2" varyby="price_promotion"/>

<h1>${pdict.category.displayName}</h1>
<p>${pdict.category.description}</p>

<!-- Category navigation and products -->
```

**Rationale:** Categories show promotional content and varied pricing; cache for 2 hours with personalization.

### Product Detail Page (Non-Personalized)

```isml
<!-- product/productDetails.isml -->
<iscache type="relative" hour="1"/>

<div class="product-detail">
    <h1>${pdict.Product.name}</h1>
    <p>${pdict.Product.longDescription}</p>
    <span class="price">${pdict.Product.price}</span>
    
    <!-- Product details -->
</div>
```

**Rationale:** Product details are mostly static; cache for 1 hour to ensure price/availability freshness.

### Content Page (Long Cache)

```isml
<!-- content/aboutUs.isml -->
<iscache type="daily" hour="3"/>

<div class="content-page">
    <h1>About Us</h1>
    <p>Our company story...</p>
</div>
```

**Rationale:** Static content changes rarely; cache until 3:00 AM GMT daily.

### Einstein Predictive Sort

```isml
<!-- search/searchResults.isml -->
<iscache hour="2" varyby="price_promotion" if="${!searchModel.isPersonalizedSort()}"/>

<div class="search-results">
    <!-- Search results with optional personalized sorting -->
</div>
```

**Rationale:** Disable caching when Predictive Sort is active (personalized); otherwise cache for 2 hours.

### Conditional Caching (Logged-In Users)

```isml
<!-- homepage.isml -->
<iscache type="relative" hour="1" if="${!customer.authenticated}"/>

<div class="homepage">
    <!-- Content that's safe to cache for anonymous users only -->
</div>
```

**Rationale:** Cache for anonymous users, disable for logged-in users who see personalized content.

## Best Practices

1. **Place at Template Beginning:**
   ```isml
   <!-- Good: Near the top -->
   <iscache type="relative" hour="1"/>
   
   <!DOCTYPE html>
   <html>
   <!-- ... -->
   ```

2. **Never Cache Session-Specific Pages:**
   ```isml
   <!-- Bad: Caching basket page (session-specific) -->
   <iscache type="relative" hour="1"/>  <!-- DON'T DO THIS -->
   <div class="basket">
       ${pdict.Basket.totalGrossPrice}
   </div>
   
   <!-- Good: No caching for basket -->
   <div class="basket">
       ${pdict.Basket.totalGrossPrice}
   </div>
   ```

3. **Use varyby Only When Needed:**
   ```isml
   <!-- Good: Page actually varies by price/promotion -->
   <iscache type="relative" hour="1" varyby="price_promotion"/>
   
   <!-- Bad: Unnecessary varyby (causes cache fragmentation) -->
   <iscache type="relative" hour="1" varyby="price_promotion"/>
   <!-- On a page with no prices or promotions -->
   ```

4. **Avoid status="off" (Use if Instead):**
   ```isml
   <!-- Bad: Deprecated -->
   <iscache status="off"/>
   
   <!-- Good: Conditional caching -->
   <iscache type="relative" hour="1" if="${!pdict.requiresFreshData}"/>
   ```

5. **Choose Appropriate Cache Duration:**
   ```isml
   <!-- Static content: Long cache (24 hours or daily) -->
   <iscache type="daily"/>
   
   <!-- Dynamic content: Short cache (15-60 minutes) -->
   <iscache type="relative" minute="30"/>
   
   <!-- Frequently changing: Very short cache (5-15 minutes) -->
   <iscache type="relative" minute="10"/>
   ```

6. **Understand Precedence in Multiple Elements:**
   ```isml
   <!-- Most restrictive wins -->
   <iscache type="relative" hour="2"/>  <!-- 2 hours -->
   <isinclude template="components/header"/>  <!-- Contains: hour="1" -->
   
   <!-- Result: 1 hour cache (shortest time wins) -->
   ```

7. **Use Expressions for Dynamic Configuration:**
   ```isml
   <!-- Good: Configurable cache time -->
   <iscache type="relative" hour="${pdict.cacheConfig.hours}"/>
   
   <!-- Or from site preferences -->
   <isscript>
       var Site = require('dw/system/Site');
       var cacheHours = Site.current.getCustomPreferenceValue('categoryPageCacheHours') || 1;
   </isscript>
   <iscache type="relative" hour="${cacheHours}"/>
   ```

## Pages That Should NOT Be Cached

❌ **Never cache these page types:**

1. **Cart/Basket Pages**
   ```isml
   <!-- NO caching -->
   <div class="cart">
       ${pdict.Basket.totalGrossPrice}
   </div>
   ```

2. **Checkout Pages**
   ```isml
   <!-- NO caching -->
   <div class="checkout">
       <!-- Billing, shipping, payment info -->
   </div>
   ```

3. **Account Pages**
   ```isml
   <!-- NO caching -->
   <div class="account">
       ${customer.profile.firstName}
       <!-- Customer-specific information -->
   </div>
   ```

4. **Order Confirmation**
   ```isml
   <!-- NO caching -->
   <div class="order-confirmation">
       Order ${pdict.Order.orderNo}
   </div>
   ```

5. **Form Submission Results**
   ```isml
   <!-- NO caching -->
   <div class="form-result">
       <!-- Dynamic response to user action -->
   </div>
   ```

## Cache Precedence Rules

When multiple `<iscache>` elements exist (in template and includes):

### Rule 1: Caching Disabled Wins

```isml
<!-- main.isml -->
<iscache type="relative" hour="2"/>

<!-- include.isml (included in main.isml) -->
<iscache status="off"/>  <!-- or if="${false}" -->

<!-- Result: Caching DISABLED (off/false takes precedence) -->
```

### Rule 2: Shortest Cache Time Wins

```isml
<!-- main.isml -->
<iscache type="relative" hour="3"/>

<!-- include1.isml -->
<iscache type="relative" hour="1"/>

<!-- include2.isml -->
<iscache type="relative" minute="30"/>

<!-- Result: 30 minutes (shortest time) -->
```

### Rule 3: Personalized Wins

```isml
<!-- main.isml -->
<iscache type="relative" hour="2"/>

<!-- include.isml -->
<iscache type="relative" hour="2" varyby="price_promotion"/>

<!-- Result: Entire page treated as PERSONALIZED -->
```

## Template Decorator Considerations

⚠️ **Critical:** When using decorators (`<isdecorate>`), be careful with session information.

```isml
<!-- decorator.isml (DANGEROUS) -->
<iscache type="relative" hour="1"/>

<html>
<head>
    <title>${pdict.pageTitle}</title>
</head>
<body>
    <!-- Session info in decorator -->
    <div class="user-greeting">
        Welcome, ${customer.profile.firstName}!  <!-- DANGEROUS -->
    </div>
    
    <isreplace/>  <!-- Decorated content here -->
</body>
</html>

<!-- page.isml (uses decorator) -->
<isdecorate template="decorator"/>
<iscache type="relative" hour="2"/>  <!-- Can cache decorator's session data! -->

<div class="content">
    <!-- Page content -->
</div>
```

**Problem:** Decorator's session information gets cached and shown to all users.

**Solution:** Use remote includes for session-specific content:

```isml
<!-- decorator.isml (SAFE) -->
<iscache type="relative" hour="1"/>

<html>
<head>
    <title>${pdict.pageTitle}</title>
</head>
<body>
    <!-- Remote include for session data (not cached) -->
    <isinclude url="${URLUtils.url('Page-UserGreeting')}"/>
    
    <isreplace/>
</body>
</html>
```

## Relative Caching Examples

```isml
<!-- All equivalent: 150 minutes (2 hours 30 minutes) -->
<iscache type="relative" hour="2" minute="30"/>
<iscache type="relative" hour="1" minute="90"/>
<iscache type="relative" minute="150"/>

<!-- 1 hour -->
<iscache type="relative" hour="1"/>

<!-- 30 minutes -->
<iscache type="relative" minute="30"/>

<!-- 3 hours 45 minutes -->
<iscache type="relative" hour="3" minute="45"/>
```

## Daily Caching Examples

```isml
<!-- Expire at midnight (0:00 AM GMT) -->
<iscache type="daily"/>
<iscache type="daily" hour="0"/>
<iscache type="daily" hour="0" minute="0"/>

<!-- Expire at 6:30 AM GMT -->
<iscache type="daily" hour="6" minute="30"/>

<!-- Expire at 11:30 PM GMT (23:30) -->
<iscache type="daily" hour="23" minute="30"/>

<!-- Expire at noon GMT (12:00 PM) -->
<iscache type="daily" hour="12"/>

<!-- Expire at 3:15 AM GMT -->
<iscache type="daily" hour="3" minute="15"/>
```

## varyby Examples

```isml
<!-- Random expiration 1 second to 15 minutes after next hour -->
<iscache varyby="price_promotion"/>

<!-- 30-minute cache with personalization -->
<iscache type="relative" minute="30" varyby="price_promotion"/>

<!-- Daily expiration with personalization -->
<iscache type="daily" hour="3" varyby="price_promotion"/>

<!-- 2-hour cache with personalization -->
<iscache type="relative" hour="2" varyby="price_promotion"/>
```

## if Attribute Examples

```isml
<!-- Cache unless personalized sort -->
<iscache hour="2" varyby="price_promotion" if="${!searchModel.isPersonalizedSort()}"/>

<!-- Cache only for anonymous users -->
<iscache type="relative" hour="1" if="${!customer.authenticated}"/>

<!-- Cache unless basket has items -->
<iscache type="relative" minute="30" if="${empty(pdict.Basket.productLineItems)}"/>

<!-- Cache unless specific condition -->
<iscache type="relative" hour="2" if="${!pdict.disableCache}"/>

<!-- Cache during business hours only -->
<isscript>
    var now = new Date();
    var hour = now.getHours();
    var isBusinessHours = (hour >= 9 && hour < 17);
</isscript>
<iscache type="relative" hour="1" if="${isBusinessHours}"/>
```

## Exception Handling and Cache Limits

⚠️ **Important:** When exceptions occur, cache time is limited to **5 minutes** to prevent caching error states:

**Exceptions that limit cache:**
- `<isscript>` blocks finish with exceptions
- Database exceptions
- Persistent object operation failures

**Excluded:** Exceptions from script expressions within ISML (${...})

**Best Practice:** Review logs and fix exceptions to ensure optimal caching performance.

```isml
<iscache type="relative" hour="24"/>

<isscript>
    // If this throws exception, cache limited to 5 minutes
    var product = ProductMgr.getProduct('INVALID_ID');
    product.name;  // Throws exception if product is null
</isscript>

<!-- Cache time: 5 minutes (not 24 hours) due to exception -->
```

## Performance Guidelines

### Cache Everything Possible

```isml
<!-- Good: Cache static/semi-static pages -->
<iscache type="relative" hour="1"/>
```

### Leave Only Small Dynamic Snippets

```isml
<!-- Cached page with small dynamic section -->
<iscache type="relative" hour="2"/>

<div class="page-content">
    <!-- Cached content -->
    
    <!-- Small dynamic snippet (remote include, not cached) -->
    <isinclude url="${URLUtils.url('Account-MiniCart')}"/>
</div>
```

### Minimize Logic in Cached Pages

```isml
<!-- Bad: Heavy logic in cached template -->
<iscache type="relative" hour="1"/>

<isscript>
    // Expensive database operations
    var products = CustomObjectMgr.queryCustomObjects(...);
    // Complex calculations
</isscript>

<!-- Good: Prepare data in controller -->
<iscache type="relative" hour="1"/>

<isloop items="${pdict.products}" var="product">
    ${product.name}
</isloop>
```

## Debugging and Testing

### Verify Caching is Active

```bash
# Check response headers
curl -I https://yoursite.com/page

# Look for:
# X-IS-Cache-Key: [cache key]
# X-IS-Cache-Store: [cache store name]
```

### Test Cache Expiration

1. Load page first time (cache miss)
2. Load page again (cache hit)
3. Wait for expiration time
4. Load page again (cache miss, regenerated)

### Monitor Cache Performance

Check Business Manager:
- Operations > Site Cache > Cache Statistics
- Monitor hit rates, miss rates
- Identify cache fragmentation

## Related Elements

- `<isdecorate>` - Template decorators (be careful with session data)
- `<isinclude>` - Local includes (affected by page cache)
- `<isinclude url>` - Remote includes (not cached)
- `<isscript>` - Script blocks (exceptions limit cache to 5 minutes)

## Response API Alternative

Instead of `<iscache>` in templates, use Response API in controllers:

```javascript
// Controller
var Response = require('dw/system/Response');

// Relative expiration
Response.setExpires(new Date(Date.now() + 3600000)); // 1 hour

// Vary by price/promotion
Response.setVaryBy('price_promotion');
```

## Notes

- `<iscache>` can appear anywhere in template (recommended: near beginning)
- Multiple elements: most restrictive wins
- Caching disabled anywhere: entire page not cached
- Personalized anywhere (`varyby`): entire page personalized
- Session information must not be cached
- Decorator session data: use remote includes only
- Exceptions limit cache to 5 minutes
- Default (no element): page not cached
- Just including element enables caching (no `status="on"` needed)
- GMT timezone for daily caching
- Random 0-15 minute default with `varyby` only

## Migration Notes

### Updating Deprecated status="off"

```isml
<!-- Old (deprecated) -->
<iscache status="off"/>

<!-- New: Just omit element -->
<!-- (no iscache element) -->

<!-- Or: Use if attribute for conditional -->
<iscache type="relative" hour="1" if="${!pdict.disableCache}"/>
```

### SiteGenesis to SFRA

```isml
<!-- SiteGenesis -->
<iscache type="relative" hour="1" varyby="price_promotion"/>

<!-- SFRA (same syntax) -->
<iscache type="relative" hour="1" varyby="price_promotion"/>
```

Syntax remains the same; review all cached pages to ensure no session data is cached.