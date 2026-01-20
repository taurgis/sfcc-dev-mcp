---
name: sfcc-performance
description: Performance optimization strategies for Salesforce B2C Commerce Cloud including caching, efficient data retrieval, index-friendly APIs, and job optimization. Use when asked about SFCC performance, caching strategies, or optimization.
---

# Salesforce B2C Commerce Cloud: Performance Best Practices

This document outlines key performance optimization strategies for Salesforce B2C Commerce Cloud, focusing on caching and efficient data retrieval.

---

## Performance and Stability Coding Standards

Ecommerce applications built on Salesforce B2C Commerce can run fast and perform reliably. Use B2C Commerce within its capabilities and ensure that your customizations follow coding best practices. Identify permissible designs that ensure the scalability and robustness of your customizations.

### Data Transfer Volume

B2C Commerce imposes limits on incoming and outgoing network traffic for B2C Commerce instances and the Content Delivery Network.

These limits are relative to the Gross Merchandise Value (GMV) and are defined in the Main Subscription Agreement (MSA). Data transfers within the limits are at no additional charge (are included in the subscription fee). There is a fee for data transfers exceeding the limits.

### Storefront Development for Performance and Stability

When developing your storefront, consider storefront development best practices:

#### Search and Product Processing

- **Don't post-process product or content search results.** Search results can be large sets. Instead, all search criteria must go into the query for efficiency execution. Don't post-process with custom code.

- **Don't iterate over variations of a base product on a search result page** (or any page where multiple base products appear). This approach can significantly increase the number of touched business objects. Instead, use native Salesforce B2C Commerce features:
  - Use pipelet Search with input parameter `OrderableProductsOnly` to deal with variation product availability
  - Use `dw.catalog.ProductSearchHit.getRepresentedVariationValues()` to determine available variation values  
  - Use `dw.catalog.ProductSearchHit.minPrice` or `Product.priceMode.minPrice` to determine price ranges

- **Break search results into pages** before processing or displaying in the storefront (pipelet Paging, class PagingModel). Limit the maximum page size, for example, a maximum of 120 products per page, especially if the "View All" functionality is provided.

#### External System Integration

- **Don't trigger live calls to external systems on frequently visited pages** (homepage, category, search result pages, and product pages). Where live calls are needed, specify a low timeout value (for example, 1 second). A B2C Commerce application server thread waiting for a response from an external system can't serve other requests. Many threads waiting for responses can make the entire cluster unresponsive.

#### Long-Running Operations

- **Don't execute any long running operations in a storefront controller or pipeline** (for example, import or export). Instead, use "jobs" for all long running tasks. The web tier closes browser connections after 5 minutes. The controller or pipeline could still be running at this time.

#### Concurrency and Data Integrity

- **Avoid concurrent changes to the same object.** Storefront controllers and pipelines should only:
  - Read shared data (for example, catalogs and prices)
  - Read or write customer-specific data (for example, customer profiles, shopping carts or orders)

- The inventory framework is designed to support concurrent change (for example, two customers buying the same product at the same time or a customer buying a product while the inventory import is running).

- The storefront controller or pipeline marks the order with `EXPORT_STATUS_READY` as the last step in order creation. Then order processing jobs can start modifying the order object.

- Concurrent requests for the same session are serialized at the application server. Concurrent Script API controller or pipeline requests can lead to Optimistic Locking exceptions.

#### Transaction Management

- **Limit transaction size.** The system is designed to deal with transactions with up to 1,000 modified business objects. A storefront controller or pipeline shouldn't even come close to this number.

#### Critical Page Performance

- **Make sure that the most visited pages are cacheable and well performing.** These controllers and pages are usually:
  - Category page or search result pages (Search-Show)
  - Product detail pages (Product-Show)  
  - Home pages (Default-Start, Home-Show)
  - Cart Page (Cart-Show)
  - Checkout pages

- **Limit expensive (> 10 ms) custom server logic** on OnSession and OnRequest controllers.

### Use Index-Friendly APIs

Replace database intensive or inefficient APIs with appropriate index-friendly APIs. Check code for database intensive APIs in most-visited pages:

#### Avoid These Database-Intensive APIs:
- `Category.getProducts()`
- `Category.getOnlineProducts()`  
- `Category.getProductAssignments()`
- `Category.getOnlineCategoryAssignments()`
- `ProductMgr.queryAllSiteProducts()`
- `Product.getPriceModel()`
- `Product.getVariants()`
- `Product.getVariationModel()`

#### Use These Index-Friendly APIs Instead:
- `ProductSearchModel.search()`
- `ProductSearchModel.orderableProductsOnly(true)`
- `ProductSearchModel.getRefinements()`
- `ProductSearchRefinements.getNextLevelRefinementValues()`
- `ProductSearchModel.getProductSearchHits()`
- `ProductSearchHit.getMinPrice()`
- `ProductSearchHit.getMaxPrice()`
- `ProductSearchHit.getRepresentedProductIDs()`
- `ProductSearchHit.getRepresentedVariationValues(attribute)`

### Additional Performance Requirements

- **Ensure all direct 3rd-party HTTP calls are migrated to Web Service Framework**
- **Ensure no Enforced quota violations** are reported in STAGING and PRODUCTION, and that Quota Dashboard alerts have been subscribed by all site admins
- **Ensure there isn't unnecessary creation** of custom Session objects, productlist objects, or cookies
- **Ensure a WishList isn't created for every anonymous user** (e.g., created at the end of every product item add to cart calls)
- **Ensure Custom Object volume is kept in check** with purge jobs

#### OCAPI Specific Requirements:
- **Ensure Shop API GET requests are limited to smaller blocks of data.** Instead of 200 products payload, retrieve 100 or 50
- **Ensure there's no OCAPI request of persistent objects within a hook customization** such as `ProductMgr.getProduct()` or `product.getVariations()`

#### SFRA Specific Requirements:
- **Ensure SFRA templates don't include multi-part, embedded, or nested forms.** We don't recommend them as a best practice
- **Ensure that controllers don't call each other,** because controller functionality should be self-contained to avoid circular dependencies
- **Ensure no calling pipelets from within a controller.** It's allowed while there are still pipelets that don't have equivalent B2C Commerce script methods, but won't be supported in future

### Job Development for Performance and Stability

To optimize job performance, follow the job development standards:

#### Import and Data Processing

- **To modify objects in Salesforce B2C Commerce, use standard imports instead of customizations.** In jobs, use B2C Commerce Job Steps for imports.

- **B2C Commerce standard imports are designed to process arbitrary feed sizes.** Changes are committed to the database on a per business object basis. If related changes must be committed in a single transaction, enclose the import pipelets in an explicit controller or pipeline transaction. Choose this approach only as an exception.

- **The transaction size is limited to 1,000 modified business objects.** Ensure that this limit isn't exceeded. B2C Commerce does not enforce this limit today, but might in the future.

#### Data Quality and Validation

- **Don't implement data validation jobs on B2C Commerce** (for example, products with no names or $0 prices). Instead, ensure that the feeds into B2C Commerce are of high quality, and don't include products with incomplete attribution or are marked offline. You can manually review catalog data on a staging instance.

#### Memory Management

When processing large data sets, pay attention to the memory footprint:

- **Design loop logic so that memory consumption doesn't increase with result set size**
- **Keep only currently processed objects in memory,** and do not retain references to that object (so that the object can be freed from memory). Specifically, don't perform sorting or other types of collections in memory
- **Stream data to file regularly** (do not build large structures in memory)
- **Read feeds record by record** (do not read an entire file into memory)
- **If you must create multiple feeds,** query the objects once and write records to all feeds as you iterate over the results. This approach saves time because the objects must be created in memory only once

#### Concurrency and Resource Management

- **Avoid concurrent changes to the same object.** Use the locking framework to ensure exclusive access. Specify named resources for job schedules.

- **Keep application server utilization by jobs to a minimum.** Calculate the job load factor: total number of seconds of job execution time on an instance (Staging or Production) on a day divided by 86,400 (number of seconds in a day). Try to keep the job load factor below 0.20.

#### Recovery and Reliability

- **Pay attention to recovery in solution design.** A job might end abnormally, for example, server restart or application server failure. The job can be resumed or restarted. Design the job so that it recovers gracefully. It must be possible to repeat a job step that was aborted.

- **Don't start many jobs at the same time.** Instead, disperse job start times to balance the job load.

---

## 1. Page Caching

The web-server page cache is the most critical performance feature for server-rendered storefronts. The goal is to serve fully rendered HTML from this cache to avoid hitting the application server.

### Controller-Driven Caching (Best Practice)

Control caching within your controller using the response object. This is superior to the legacy `<iscache>` tag.

`response.setExpires(milliseconds)`: Sets a cache duration for the entire page response.

**Example:**

```javascript
// cartridge/controllers/Product.js
var server = require('server');

server.get('Show', function (req, res, next) {
    // Cache for 24 hours
    var oneDay = 24 * 60 * 60 * 1000;
    response.setExpires(Date.now() + oneDay);

    res.render('product/productDetails');
    next();
});
```

### Remote Includes for Dynamic Content

Use remote includes (`<isinclude url="..." />`) to assemble pages from components with different cache policies. A long-cached main page can include a dynamic, non-cached header with user-specific info. [1, 2]

**Anti-Pattern:** Avoid creating remote includes with unique URL parameters for each item in a list (e.g., `&position=1`, `&position=2`). This creates an N+1 request problem at the HTTP level and defeats the cache. [1, 3]

### Cache Key Strategy

The cache key is the full URL. To maximize the cache hit ratio:

- **Ignore Volatile Parameters:** Use Business Manager (`Administration > Sites > Feature Switches`) to ignore marketing parameters (e.g., `utm_source`, `utm_campaign`) when generating the cache key. [4, 5]
- **Personalized Caching:** Use `response.setVaryBy('price_promotion')` to create separate cache entries for users with different prices or promotions. Use this carefully, as it can fragment the cache. [4, 5]

---

## 2. Custom Caches (`CacheMgr`)

Use custom caches for application-level data caching within dynamic requests (e.g., cart, checkout) where page caching isn't possible. 

**Use Cases:**
- Caching expensive calculations (e.g., iterating variants to check for a sale). 
- Caching responses from external services (e.g., inventory, ratings).

### Implementation

1. **Define in `caches.json`:**
   ```json
   {
       "caches": [
           {
               "id": "ExternalAPICache",
               "expireAfterSeconds": 300
           }
       ]
   }
   ```

2. **Register in `package.json`:**
   ```json
   {
     "caches": "./caches.json"
   }
   ```

### Practical Constraints (Why Cache Design Matters)

- Custom cache memory is limited (roughly tens of MB per app server for all custom caches combined).
- Individual entries have size limits; store only primitives / arrays / plain objects (use `null`, not `undefined`).
- Caches are **per app server** (no cross-node synchronization). Always handle cache misses gracefully.

### Recommended Usage Pattern: `get(key, loader)`

Prefer the loader form so the expensive work only runs on cache miss:

```javascript
var CacheMgr = require('dw/system/CacheMgr');
var Site = require('dw/system/Site');

var cache = CacheMgr.getCache('ExternalAPICache');

function getSiteScopedValue(keySuffix, loader) {
    var key = Site.current.ID + '_' + keySuffix;
    return cache.get(key, loader);
}
```

### Cache Invalidation Reality

Custom caches can be cleared by operational events (code changes/activation, replications). Design code so cache eviction is safe and does not break core flows.

### The "Get-or-Load" Pattern (Required)

Always use the atomic `cache.get(key, loader)` method to prevent a "thundering herd" problem on cache misses. [6, 9]

**Example:**

```javascript
var CacheMgr = require('dw/system/CacheMgr');
var MyHTTPService = require('~/cartridge/scripts/services/myHTTPService');

function getExternalData() {
    var apiCache = CacheMgr.getCache('ExternalAPICache');
    var cacheKey = 'myExternalData';

    // get() executes the loader function ONLY on a cache miss.
    var data = apiCache.get(cacheKey, function () {
        // This expensive call only runs if data is not in cache.
        var result = MyHTTPService.getService().call();
        return result.ok ? JSON.parse(result.object.text) : null;
    });

    return data;
}
```

**Key Limitation:** Custom caches are local to each application server pod and are not a distributed, instance-wide cache. Data stored on one pod is not visible to others.

## 3. ProductSearchModel vs. ProductMgr

This is a critical performance distinction.

- **ProductSearchModel (PSM):** Queries the fast, optimized Search Index. Use for any list of products (PLPs, search results, filtering).
- **ProductMgr:** Queries the live Database. Use only to get a single, known product by its ID (e.g., on a PDP).

### The N+1 Anti-Pattern (CRITICAL)

**NEVER** use `ProductMgr.getProduct()` inside a loop over ProductSearchModel results. This causes one fast index query followed by N slow database queries, which will crash a site under load.

**Incorrect (Anti-Pattern):**

```javascript
// In a PLP template, looping over search results
var psm = new ProductSearchModel();
//... configure psm...
psm.search();
var hits = psm.getProductSearchHits();
while (hits.hasNext()) {
    var hit = hits.next();
    // ANTI-PATTERN: Calling ProductMgr in a loop!
    var product = ProductMgr.getProduct(hit.getProductID()); 
    //... do something with the full product object...
}
```

**Correct:**

Use the ProductSearchHit object directly. It contains all necessary data from the index for display on a listing page. If data is missing, add it to the search index configuration.

```javascript
// In a PLP template, looping over search results
var psm = new ProductSearchModel();
//... configure psm...
psm.search();
var hits = psm.getProductSearchHits();
while (hits.hasNext()) {
    var hit = hits.next();
    // CORRECT: Use the hit object directly for name, price, etc.
    var minPrice = hit.getMinPrice();
    var variationValues = hit.getRepresentedVariationValues('color');
    //... render tile using data from 'hit'...
}
```

## 4. Caching in OCAPI/SCAPI Hooks

The caching models for OCAPI and SCAPI are fundamentally different.

- **OCAPI:** The hook runs before the response is cached. The modified response is what gets stored in OCAPI's application-tier cache.
- **SCAPI:** The web-tier cache is checked before the hook runs. The hook only executes on a cache miss. The original, unmodified response from the platform is what gets cached.

### SCAPI Web-Tier Cache Fundamentals

One of the Commerce Cloud application layer components performs web-tier caching for SCAPI **GET** requests across multiple API families. This cache lives on the server side and is applied only after a request reaches the platform. Any additional caching layers you add (CDN, browser, SPA state) operate independently—you could have a cache miss on the web tier but a hit in your edge cache, and vice versa. Plan your caching strategy with this multi-layer reality in mind.

### Personalized Cache Keys

When personalization is enabled for a SCAPI resource, the cache key includes the following in addition to the URL string:

- Active promotions
- Active product sorting rules
- Applicable price books
- Active AB test groups

The platform keeps separate cache entries for each combination. For example, if shopper A qualifies for promotion X and shopper B qualifies for promotion Y, the same product URL produces two cache entries. This segmentation can be powerful but also multiplies cache storage. Use personalization only when you have well-sized groups and a clear business reason.

By default, product requests that expand prices or promotions—and product search requests with the `prices` expand—are already personalized. Calling `response.setVaryBy('price_promotion')` in a script reinforces that behavior. Note that `price_promotion` is the only supported value; other strings have no effect.

### Script-Level Cache Controls

Use the Script API to adjust cache policies dynamically:

- `dw.system.Response#setExpires(milliseconds)`: Sets an explicit expiration timestamp. The value must be at least 1,000 ms in the future and no more than 86,400,000 ms (24 hours).
- `dw.system.Response#setVaryBy('price_promotion')`: Opts into personalized caching for price- or promotion-sensitive responses.

```javascript
exports.modifyGETResponse = function (scriptCategory, categoryWO) {
    // Cache for one hour instead of the default TTL
    response.setExpires(Date.now() + 3_600_000);

    // Optional: personalize by price & promotion eligibility
    response.setVaryBy('price_promotion');

    return new Status(Status.OK);
};
```

### Best Practices

- **OCAPI Hook:** Your modifications will be cached. Keep the logic simple and avoid slow calls like `ProductMgr.getProduct()`.
- **SCAPI Hook:** To cache a modification, you must create a unique cache key by adding a custom query parameter to the URL.

**Example (SCAPI):**

```javascript
// Client makes a call with a custom parameter
// GET /shopper-products/v1/.../products/my-prod?c_view=light

// SCAPI Hook Script (product.js)
exports.modifyResponse = function (product, productResponse) {
    // Logic is conditional on the custom parameter
    if (request.httpParameters.c_view === 'light') {
        delete productResponse.long_description;
    }
};
```

This creates a separate, cacheable version of the response for the `c_view=light` URL.

**SCAPI expand Parameter:** The cache TTL for a SCAPI response is determined by the lowest TTL of all requested expand parameters. Avoid requesting volatile data (like availability, 60s TTL) alongside stable data (like images, 24hr TTL).

## 5. Caching in Custom SCAPI Endpoints

You can build your own REST endpoints that integrate with SCAPI's caching, security, and other framework features.

### Implementation

Custom endpoints can leverage the same powerful web-tier page cache. Enable it by calling `response.setExpires()` in your implementation script.

**Example:**

```javascript
// cartridge/rest-apis/my-api/v1/script.js
var RESTResponseMgr = require('dw/system/RESTResponseMgr');

exports.getLoyaltyInfo = function (params) {
    var loyaltyData = { id: params.c_customer_id, points: 1234 };

    // Cache this custom API response for 5 minutes
    response.setExpires(Date.now() + (5 * 60 * 1000));

    RESTResponseMgr.createSuccess(loyaltyData).render();
};
exports.getLoyaltyInfo.public = true;
```

### Two-Tier Caching Pattern (for External Services)

For maximum resilience and performance when calling external systems, combine both cache layers:

1. **Tier 1 (Application Cache):** Use CacheMgr with the "get-or-load" pattern to cache the raw data from the external service. This acts as a buffer if the service is slow or down.

2. **Tier 2 (Web-Tier Cache):** In your custom endpoint script, after getting data from the Tier 1 cache, format the final JSON response and set a web-tier cache policy on it using `response.setExpires()`.

This pattern ensures that most requests are served instantly from the web-tier, and even on a miss, the data is likely served from the fast application-tier cache, minimizing slow calls to the external dependency.
