# Salesforce B2C Commerce SFRA Controllers: Best Practices & Examples

This guide provides a condensed overview of best practices and code patterns for developing controllers within the Salesforce B2C Commerce Storefront Reference Architecture (SFRA).

**IMPORTANT**: Before developing SFRA controllers, consult the **Performance and Stability Best Practices** guide from this MCP server. Review the storefront development guidelines, index-friendly APIs, and critical page performance requirements to ensure your controllers follow SFCC performance standards and avoid database-intensive operations.

## 🚀 Enhanced SFRA Documentation Access

This MCP server provides comprehensive access to SFRA documentation through enhanced tools that can help you understand SFRA architecture and develop better controllers:

### **Essential SFRA Documentation Tools**

1. **`get_sfra_categories`** - Discover all available SFRA documentation categories
2. **`get_sfra_documents_by_category`** - Explore documents by functional area (core, product, order, customer, pricing, store)
3. **`get_sfra_document`** - Get detailed information about specific SFRA classes or models
4. **`search_sfra_documentation`** - Find specific functionality across all SFRA documentation

### **Recommended Documentation Workflow for Controller Development**

Before writing SFRA controllers, use these tools to understand the available functionality:

```javascript
// 1. Explore core SFRA classes essential for controllers
get_sfra_documents_by_category("core")
// Returns: server, request, response, querystring, render

// 2. Get detailed Server class documentation
get_sfra_document("server") 
// Comprehensive server.js documentation with middleware patterns

// 3. Understand Request and Response objects
get_sfra_document("request")
get_sfra_document("response")

// 4. For product controllers, explore product models
get_sfra_documents_by_category("product")
// Returns: product-full, product-bundle, product-tile, product-search, product-line-items

// 5. For cart/checkout controllers, explore order models  
get_sfra_documents_by_category("order")
// Returns: cart, order, billing, shipping, payment, totals

// 6. Search for specific functionality
search_sfra_documentation("middleware")
search_sfra_documentation("validation")
```

### **SFRA Model Documentation for Controller Development**

The enhanced documentation system provides access to comprehensive model documentation that's essential for controller development:

- **Product Models**: `product-full`, `product-bundle`, `product-tile` - Understanding product data structures
- **Cart Models**: `cart`, `billing`, `shipping`, `payment`, `totals` - Essential for checkout controllers  
- **Customer Models**: `account`, `address` - For customer management controllers
- **Pricing Models**: `price-default`, `price-range`, `price-tiered` - For pricing logic in controllers

Always consult the relevant model documentation before implementing controller logic to understand available properties and methods.

## Core Concepts

### MVC Pattern & Cartridge Path

SFRA uses a Model-View-Controller (MVC) pattern to enforce separation of concerns.

- **Controller** (`/controllers`): Handles user requests, calls models for data, and determines which view to render.
- **Model** (`/models`): Contains business logic, interacts with the B2C Commerce Script API, and returns pure JSON objects to the controller.
- **View** (`/templates`): ISML templates responsible only for rendering data (pdict) provided by the controller. Business logic in templates is an anti-pattern.

**Cartridge Path**: A colon-separated list of cartridges that dictates the code execution order. Custom cartridges must be placed before the `app_storefront_base` cartridge to override or extend functionality.

> **Never edit the `app_storefront_base` cartridge directly.**

## Routing & Middleware

SFRA's routing is inspired by Express.js, using a chain of middleware functions to process requests.

- **Endpoint Syntax**: URLs map to Controller-RouteName (e.g., `Home-Show` maps to the `Show` route in `Home.js`).
- **server Object**: The core of routing, required in every controller (`var server = require('server');`). It provides methods like `get`, `post`, `append`, etc., to define and modify routes.

### Storefront URL Patterns

SFRA storefront URLs follow a predictable pattern that maps directly to your controller and route structure:

```
https://{instance-hostname}/on/demandware.store/Sites-{site-id}-Site/{locale}/{Controller-Route}
```

**URL Components:**
- **Instance Hostname**: Your SFCC instance domain (e.g., `your-instance.dx.commercecloud.salesforce.com`)
- **Site ID**: The site identifier configured in Business Manager (e.g., `RefArchGlobal`)
- **Locale**: Language and region code, format depends on site configuration
- **Controller-Route**: Maps to your controller file and route method

#### URL Examples

**Standard locale in path:**
```
https://your-instance.dx.commercecloud.salesforce.com/on/demandware.store/Sites-RefArchGlobal-Site/en_GB/Home-Show
https://your-instance.dx.commercecloud.salesforce.com/on/demandware.store/Sites-RefArchGlobal-Site/en_US/Product-Show?pid=12345
https://your-instance.dx.commercecloud.salesforce.com/on/demandware.store/Sites-RefArchGlobal-Site/fr_FR/Account-Login
```

**Locale as query parameter (alternative configuration):**
```
https://your-instance.dx.commercecloud.salesforce.com/on/demandware.store/Sites-RefArchGlobal-Site/Home-Show?lang=en_GB
https://your-instance.dx.commercecloud.salesforce.com/on/demandware.store/Sites-RefArchGlobal-Site/jsPDF-Test?lang=en_GB
```

#### Controller Mapping Examples

| URL | Controller File | Route Method |
|-----|----------------|--------------|
| `/Home-Show` | `controllers/Home.js` | `server.get('Show', ...)` |
| `/Product-Show` | `controllers/Product.js` | `server.get('Show', ...)` |
| `/Cart-AddProduct` | `controllers/Cart.js` | `server.post('AddProduct', ...)` |
| `/Account-Login` | `controllers/Account.js` | `server.get('Login', ...)` |
| `/CheckoutServices-SubmitPayment` | `controllers/CheckoutServices.js` | `server.post('SubmitPayment', ...)` |

**Important Notes:**
- The locale format (`en_GB` in path vs `?lang=en_GB` parameter) depends on your site's locale configuration in Business Manager
- Custom controllers follow the same pattern: if you create `controllers/MyCustom.js` with route `Test`, it's accessible at `/MyCustom-Test`
- Route names are case-sensitive and must match exactly what you define in your controller

### Middleware Chain (req, res, next)

Each route is a series of functions:

- **req**: The request object, containing query strings (`req.querystring`), form data (`req.form`), etc.
- **res**: The response object, used to render templates (`res.render()`), return JSON (`res.json()`), or modify view data (`res.setViewData()`).
- **next()**: A callback that passes control to the next function in the chain. It must be called to avoid a request timeout, unless the function terminates the request (e.g., with `res.render()`).

## Controller Extension APIs

The primary goal is to customize functionality without modifying base code. Always start by importing the base controller: `var page = module.superModule;`.

| Method | Use Case | Description |
|--------|----------|-------------|
| `server.append()` | **Most Common**. Add or modify data for the view after base logic runs. | Adds middleware to the end of the route's chain. Ideal for using `res.getViewData()` to get base data, modifying it, and using `res.setViewData()` to pass it to the template. |
| `server.prepend()` | Perform validation or setup before base logic runs. | Adds middleware to the beginning of the route's chain. Useful for permission checks or preparing data the base controller needs. |
| `server.replace()` | Fundamentally change a route's behavior or prevent base logic from running. | Discards the original middleware chain and replaces it with a new one. Use this for state-changing actions like payment calls to avoid double execution. |

> **Critical Rule**: Never use `server.append` for routes that perform state-changing actions (e.g., payment authorizations, inventory updates). The base logic will execute first, and your appended logic will run second, potentially causing duplicate transactions. Use `server.replace` for these scenarios.

## Built-in SFRA Middlewares

SFRA provides several pre-built middleware functions in `app_storefront_base/cartridge/scripts/middleware/` that handle common functionality. These middlewares follow the standard `(req, res, next)` pattern and can be chained together.

### Cache Middlewares (`cache.js`)

These middlewares set appropriate cache headers for different types of content:

#### `applyDefaultCache`
Sets standard 24-hour cache for general content.
```javascript
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    // Your controller logic here
    // Page will be cached for 24 hours
    next();
});
```

#### `applyPromotionSensitiveCache`
Sets 24-hour cache with personalization flag for promotion-sensitive pages.
```javascript
server.get('ProductList', cache.applyPromotionSensitiveCache, function (req, res, next) {
    // Page cached for 24 hours but marked as personalized
    // Useful for pages that show different content based on promotions
    next();
});
```

#### `applyShortPromotionSensitiveCache`
Sets 1-hour cache with personalization for highly dynamic promotional content.
```javascript
server.get('FlashSale', cache.applyShortPromotionSensitiveCache, function (req, res, next) {
    // Short cache for time-sensitive promotional content
    next();
});
```

#### `applyInventorySensitiveCache`
Sets 30-minute cache for inventory-dependent pages.
```javascript
server.get('ProductAvailability', cache.applyInventorySensitiveCache, function (req, res, next) {
    // Short cache for pages that depend on inventory levels
    next();
});
```

### CSRF Protection (`csrf.js`)

Critical security middlewares for preventing Cross-Site Request Forgery attacks:

#### `generateToken`
Generates and adds CSRF token to view data. Required for forms that will be submitted via POST.
```javascript
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

server.get('ShowForm', csrfProtection.generateToken, function (req, res, next) {
    res.render('myForm', {
        // csrf token automatically available in pdict.csrf
    });
    next();
});
```

#### `validateRequest`
Validates CSRF token for standard form submissions. Logs out user and redirects on failure.
```javascript
server.post('SubmitForm', csrfProtection.validateRequest, function (req, res, next) {
    // Process form submission - token has been validated
    next();
});
```

#### `validateAjaxRequest`
Validates CSRF token for AJAX requests. Redirects to AJAX-specific error page on failure.
```javascript
server.post('AjaxSubmit', csrfProtection.validateAjaxRequest, function (req, res, next) {
    // Process AJAX form submission
    res.json({ success: true });
    next();
});
```

#### CRITICAL: CSRF Middleware Automation

**❌ COMMON MISTAKE**: Manually adding CSRF tokens to viewData

```javascript
// ❌ WRONG - Don't do this in SFRA controllers!
server.get('ShowForm', csrfProtection.generateToken, function(req, res, next) {
    res.render('myForm', {
        csrf: res.getViewData().csrf,    // ❌ Redundant
        // OR
        csrf: {
            tokenName: req.csrf.tokenName,  // ❌ Redundant
            token: req.csrf.token           // ❌ Redundant  
        }
    });
});
```

**✅ CORRECT APPROACH**: Let middleware handle it automatically

```javascript
// ✅ CORRECT - Middleware automatically adds CSRF to pdict
server.get('ShowForm', csrfProtection.generateToken, function(req, res, next) {
    res.render('myForm', {
        // No need to manually add CSRF - middleware does this
        pageTitle: 'My Form',
        otherData: 'value'
    });
    // pdict.csrf.tokenName and pdict.csrf.token are automatically available
    next();
});
```

**How CSRF Middleware Works in SFRA:**
- `csrfProtection.generateToken` automatically adds `csrf.tokenName` and `csrf.token` to viewData
- Templates access tokens directly via `${pdict.csrf.tokenName}` and `${pdict.csrf.token}`
- `csrfProtection.validateRequest` and `validateAjaxRequest` handle validation automatically
- **Never manually add CSRF data to viewData** - it's redundant and can cause issues

### User Authentication (`userLoggedIn.js`)

Middlewares for protecting routes that require authentication:

#### `validateLoggedIn`
Ensures user is logged in, redirects to login page if not. Preserves query parameters.
```javascript
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');

server.get('AccountDashboard', userLoggedIn.validateLoggedIn, function (req, res, next) {
    // User is guaranteed to be logged in here
    next();
});
```

#### `validateLoggedInAjax`
AJAX-friendly version that returns JSON response instead of redirecting.
```javascript
server.post('UpdateProfile', userLoggedIn.validateLoggedInAjax, function (req, res, next) {
    var viewData = res.getViewData();
    if (viewData.loggedin) {
        // Process the request
        res.json({ success: true });
    } else {
        // viewData.redirectUrl contains login URL for client-side redirect
        res.json({ 
            success: false, 
            redirectUrl: viewData.redirectUrl 
        });
    }
    next();
});
```

### Consent Tracking (`consentTracking.js`)

Handles privacy consent management and tracking permissions:

#### `consent`
Manages tracking consent state and generates CSRF tokens when needed.
```javascript
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.get('Home', consentTracking.consent, function (req, res, next) {
    // Consent status available in pdict.tracking_consent
    // Can be: true (consented), false (declined), null (not set)
    next();
});
```

### Page Metadata (`pageMetaData.js`)

Processes and computes page metadata for SEO:

#### `computedPageMetaData`
Consolidates page metadata from various sources into a single object.
```javascript
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.get('ProductDetail', pageMetaData.computedPageMetaData, function (req, res, next) {
    // Computed metadata available in pdict.CurrentPageMetaData
    // Includes title, description, keywords, and pageMetaTags array
    next();
});
```

### Middleware Chaining Examples

#### Complete Product Detail Page
```javascript
var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.get('Show', 
    cache.applyPromotionSensitiveCache,
    consentTracking.consent,
    pageMetaData.computedPageMetaData,
    function (req, res, next) {
        // All middleware has executed:
        // - Page cached for 24 hours with personalization
        // - Consent tracking set up
        // - Page metadata computed
        // - CSRF token generated (by consent middleware)
        
        var pid = req.querystring.pid;
        // Product logic here...
        next();
    }
);
```

#### Secure Form Submission
```javascript
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');

// Show form
server.get('ShowContactForm', 
    userLoggedIn.validateLoggedIn,
    csrfProtection.generateToken,
    function (req, res, next) {
        res.render('contactForm');
        next();
    }
);

// Process form
server.post('SubmitContactForm',
    userLoggedIn.validateLoggedIn,
    csrfProtection.validateRequest,
    function (req, res, next) {
        // User authenticated and CSRF validated
        // Process form safely
        next();
    }
);
```

### Custom Middleware Best Practices

When creating custom middleware:

1. **Follow the Pattern**: Always accept `(req, res, next)` parameters
2. **Call next()**: Always call `next()` unless terminating the request
3. **Handle Errors**: Use try-catch and pass errors to `next(error)`
4. **Set View Data**: Use `res.setViewData()` to pass data to templates
5. **Check Existing Data**: Use `res.getViewData()` to avoid overwriting existing data

```javascript
// Custom middleware example
function customMiddleware(req, res, next) {
    try {
        var viewData = res.getViewData() || {};
        viewData.customProperty = 'customValue';
        res.setViewData(viewData);
        next();
    } catch (error) {
        next(error);
    }
}
```

## Remote Include Architecture (Controller Perspective)

Remote includes bridge controller design, caching, and security. Each `<isinclude url="...">` triggers a secondary request whose lifecycle is independent of the parent page.

### 1. Execution Model Recap
1. Parent controller builds main page (may be fully cached)
2. Application Server streams HTML with remote include placeholders
3. Web Adapter detects placeholders → performs new HTTP requests to each include URL
4. Include controller runs with `req.includeRequest === true`
5. Web Adapter stitches fragment responses into final payload

### 2. Mandatory Middleware Ordering
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

### 3. Data Passing Constraints
Include controllers cannot see parent `pdict`. All inputs must be query parameters defined in the template:
```isml
<isinclude url="${URLUtils.url('PromoSlot-Include', 'slotId', 'hp_banner_1')}" />
```
Avoid volatile params that reduce cache hits (e.g., timestamps, indexes, random tokens).

### 4. Caching Strategy Patterns
| Fragment | Typical TTL | Notes |
|----------|------------|-------|
| MiniCart | 0 (uncached) | Basket must reflect real-time state |
| Personalized Banner | 5–15m | Balance freshness vs recompute cost |
| Static Navigation | 12–24h | Rarely changes; high CDN / app cache hit rate |
| Inventory Badge | 1–5m | Short TTL isolates volatility |

### 5. Performance Guardrails
| Concern | Guidance |
|---------|----------|
| Count per page | Target < 20 (soft). Overuse causes waterfall latency. |
| Nesting depth | Keep ≤ 2. Depth 3+ complicates tracing & raises miss amplification. |
| Fragment size | Keep payload lean (<10KB ideal) – remote includes are for targeted data. |
| Parallelism | Web Adapter fetches includes concurrently; slowest fragment = page delay. Optimize worst offender first. |

### 6. Observability & Tracing
Search logs by extended request ID pattern: `baseId-depth-index`.
Example sequence: `Qx1Ab-0-00` (page) → `Qx1Ab-1-01` (first fragment) → `Qx1Ab-2-03` (nested fragment).

Add structured logging:
```javascript
Logger.info('Include {0} depth={1} start', request.httpPath, request.requestID);
```

### 7. Security Checklist
```text
[ ] server.middleware.include first
[ ] Auth middleware if user-specific data
[ ] No PII in query params
[ ] Explicit cache middleware (or intentional no-cache)
[ ] Fragment output sanitized (no raw user input)
[ ] Error handling returns safe minimal content
```

If any box unchecked → treat as deployment blocker.

### 8. Anti‑Patterns & Refactors
| Anti‑Pattern | Risk | Refactor |
|--------------|------|----------|
| Remote include per search result | N network calls, poor TTFB | Single controller renders list with local includes |
| Passing large serialized JSON in query | URL length + logging exposure | Use lightweight ID → lookup inside fragment |
| Relying on parent csrf/viewData | Undefined behavior, security gaps | Regenerate context in fragment |
| Deep chain (>2 levels) | Hard to debug, compounded latency | Flatten – merge sibling fragments |

### 9. Example: Structured Composite Page
Home page shell (24h cache) + fragments:
- `MiniCart` (0 TTL)
- `PromoBanner` (15m)
- `CategoryRefinements` (1h)
Each can be independently invalidated without purging page shell cache.

### 10. Decision Flow
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

---

## Code Examples

### 1. Basic Controller: Hello World

**File**: `cartridges/my_cartridge/cartridge/controllers/Hello.js`

```javascript
'use strict';
var server = require('server');

server.get('Show', function (req, res, next) {
    res.print('<h1>Hello World!</h1>');
    next();
});

module.exports = server.exports();
```

**Access via URL**: `.../default/Hello-Show`

### 2. Rendering an ISML Template with Data

```javascript
'use strict';
var server = require('server');
var ProductFactory = require('*/cartridge/scripts/factories/product');

server.get('Show', function (req, res, next) {
    var product = ProductFactory.get({ pid: req.querystring.pid });
    res.render('product/productDetails', {
        product: product // This object becomes 'pdict' in the template
    });
    next();
});

module.exports = server.exports();
```

The `product/productDetails.isml` template can then access `${pdict.product.productName}`.

### 3. Returning JSON for an AJAX Call

```javascript
'use strict';
var server = require('server');
var CartModel = require('*/cartridge/models/cart');
var BasketMgr = require('dw/order/BasketMgr');

server.get('GetCart', function (req, res, next) {
    var basket = BasketMgr.getCurrentBasket();
    var cart = new CartModel(basket);
    res.json(cart); // Serializes the 'cart' object to JSON
    next();
});

module.exports = server.exports();
```

The `res.json()` method is the standard way to create API endpoints for client-side JavaScript.

### 4. Extending a Base Controller (Product-Show)

**File**: `cartridges/my_cartridge/cartridge/controllers/Product.js`

```javascript
'use strict';
var server = require('server');
var page = module.superModule; // Get the base controller
server.extend(page);

// Add a new step to the end of the 'Show' route
server.append('Show', function (req, res, next) {
    var viewData = res.getViewData(); // Get data prepared by the base controller

    // Add custom property
    viewData.exampleData = 'This is custom data!';
    
    res.setViewData(viewData); // Pass modified data to the template
    next();
});

module.exports = server.exports();
```

This non-intrusively adds `exampleData` to the pdict object on the Product Detail Page.

### 5. Handling a Form Submission with CSRF Protection

```javascript
'use strict';
var server = require('server');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

// Route to display the form
server.get('ShowForm', csrfProtection.generateToken, function (req, res, next) {
    //... logic to render form...
    res.render('myFormTemplate', {
        // ✅ CORRECT: No need to manually pass CSRF - middleware handles this
        formData: someData
    });
    // CSRF token automatically available as pdict.csrf.tokenName and pdict.csrf.token
    next();
});

// Route to handle the submission
server.post('SubmitForm', csrfProtection.validateRequest, function (req, res, next) {
    var myForm = server.forms.getForm('myForm');
    if (myForm.valid) {
        // Process valid form
        res.json({ success: true });
    } else {
        // Handle invalid form
        res.json({ success: false, error: 'Invalid form data' });
    }
    next();
});

module.exports = server.exports();
```

The template must include a hidden input for the CSRF token: `<input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>`

## Key Best Practices

### Security

- Always use the `csrfProtection` middleware for any POST request that changes state.
- Enforce HTTPS for sensitive routes using `server.middleware.https`.
- Apply the principle of least privilege for user access control.

### Performance

- Use page caching via `res.cacheExpiration(hours)` or the cache middleware.
- Lazy load modules by placing `require()` statements inside the route functions where they are used, not at the top of the file. This reduces initial load time.
- Offload long-running tasks to asynchronous Jobs instead of running them in a synchronous controller request.

### Error Handling

- Wrap potentially failing code (especially Script API calls) in `try...catch` blocks.
- Leverage the global `Error.js` controller for uncaught exceptions. It correctly handles both page renders and AJAX JSON responses.
- Log detailed errors for developers but show user-friendly messages on the storefront.

### Testing

- Controllers should be tested with integration tests, not unit tests.
- Use a stack of Mocha, Chai, and request-promise to make HTTP requests to controller endpoints on a sandbox and assert the response.
- It is mandatory to provide integration tests for controllers that return JSON.

## Standard SFRA Controllers

SFRA provides a comprehensive set of base controllers that handle core ecommerce functionality. Understanding these controllers is essential for customization and extension. Each controller returns specific model structures that provide data to templates and AJAX responses.

**Note**: The following documentation is based on actual SFRA controller implementations found in the base cartridge.

### Core Page Controllers

#### **Home Controller** (`Home.js`)
Handles homepage rendering with Page Designer integration.

**Key Routes:**

##### `Home-Show`: Main homepage endpoint
- **Returns**: Homepage view with Page Designer content or fallback template
- **Models Returned**:
  - Uses Page Designer page 'homepage' if available and visible
  - Falls back to `home/homePage.isml` template with no explicit model data
  - Page metadata is set via `pageMetaHelper.setPageMetaTags()`
- **Template**: Page Designer 'homepage' or `home/homePage.isml`
- **Middlewares**: `consentTracking.consent`, `cache.applyDefaultCache`, `pageMetaData.computedPageMetaData`

##### `Home-ErrorNotFound`: 404 error handling
- **Returns**: 404 error page with status code 404
- **Models Returned**: No explicit model data passed
- **Template**: `error/notFound.isml`

#### **Product Controller** (`Product.js`)
Manages product detail pages, variations, and product-related functionality.

**Key Routes:**

##### `Product-Show`: Main product detail page
- **Returns**: Complete product detail information with Page Designer support
- **Models Returned**:
  - `pdict.product` - Complete product model from `productHelper.showProductPage()`
  - `pdict.addToCartUrl` - URL for adding product to cart
  - `pdict.resources` - Localized resource strings from `productHelper.getResources()`
  - `pdict.breadcrumbs` - Navigation breadcrumb array
  - `pdict.canonicalUrl` - SEO canonical URL
  - `pdict.schemaData` - Schema.org structured data
  - Uses Page Designer product page if available, otherwise falls back to standard template
- **Template**: Page Designer page or `product/productDetails.isml`
- **Middlewares**: `cache.applyPromotionSensitiveCache`, `consentTracking.consent`, `pageMetaData.computedPageMetaData`
- **Notes**: Sets `res.cachePeriod = 0` for pages with visibility rules; returns 404 for offline products (except sets/bundles)

##### `Product-ShowInCategory`: Product detail within category context
- **Returns**: Product detail with category navigation context
- **Models Returned**: Same as `Product-Show` plus:
  - Category-aware breadcrumbs from `productHelper.showProductPage()`
- **Template**: Standard product template (no Page Designer support)

##### `Product-Variation`: AJAX endpoint for product variation selection
- **Returns**: JSON response with updated product data and rendered HTML components
- **Models Returned**:
```javascript
{
    "product": {
        // Full product model with updated variation data
        "price": {...}, // With rendered HTML via priceHelper
        "attributesHtml": "...", // Rendered attributes template
        "promotionsHtml": "...", // Rendered promotions template  
        "optionsHtml": "..." // Rendered options template
    },
    "resources": {...} // Localized strings from productHelper.getResources()
}
```

### Shopping Cart & Checkout Controllers

#### **Cart Controller** (`Cart.js`)
Manages shopping cart functionality and basket operations.

**Key Routes:**

##### `Cart-Show`: Shopping cart page display
- **Returns**: Complete shopping cart page
- **Models Returned**:
  - Returns the entire `CartModel(currentBasket)` object directly to template
  - Includes automatic currency update and shipping method validation
  - `reportingURLs` set in viewData for analytics
- **Template**: `cart/cart.isml`
- **Middlewares**: `server.middleware.https`, `consentTracking.consent`, `csrfProtection.generateToken`

##### `Cart-MiniCart`: Header mini-cart component
- **Returns**: Mini-cart icon with quantity
- **Models Returned**:
  - `pdict.quantityTotal` - Total quantity of items in basket
- **Template**: `/components/header/miniCart.isml`
- **Middlewares**: `server.middleware.include`

##### `Cart-AddProduct`: Add products to cart (POST)
- **Returns**: JSON response with comprehensive cart update information
- **Models Returned**:
```javascript
{
    "reportingURL": "...", // Analytics reporting URL
    "quantityTotal": 5, // Total quantity in cart
    "message": "Product added to cart", // Success/error message
    "cart": {...}, // Complete CartModel object
    "newBonusDiscountLineItem": {...}, // Bonus product info if applicable
    "error": false, // Boolean error flag
    "pliUUID": "uuid-string", // Product line item UUID
    "minicartCountOfItems": "5 Items" // Localized item count string
}
```

##### `Cart-Get`: Get current cart data
- **Returns**: JSON response with current cart state
- **Models Returned**: Complete `CartModel(currentBasket)` object as JSON

##### `Cart-RemoveProductLineItem`: Remove items from cart
- **Returns**: JSON response with updated cart data
- **Models Returned**: Similar structure to `Cart-AddProduct` with updated cart state

#### **Checkout Controller** (`Checkout.js`)
Manages the complete checkout process including shipping, billing, and payment.

**Key Routes:**

##### `Checkout-Begin`: Main checkout entry point
- **Returns**: Checkout page with customer, shipping, and billing forms
- **Models Returned**:
  - `pdict.order` - Complete `OrderModel` with basket data, customer info, and shipping/billing forms
  - `pdict.customer` - `AccountModel` with customer profile and address book
  - `pdict.forms` - Form objects for guest customer, registered customer, shipping, and billing
  - `pdict.expirationYears` - Array of credit card expiration years (current + 10 years)
  - `pdict.currentStage` - Current checkout stage ('customer', 'shipping', 'payment', 'placeOrder')
  - `pdict.reportingURLs` - Analytics reporting URLs
  - `pdict.oAuthReentryEndpoint` - OAuth reentry point identifier
- **Template**: `checkout/checkout.isml`
- **Middlewares**: `server.middleware.https`, `consentTracking.consent`, `csrfProtection.generateToken`
- **Notes**: Validates basket, handles multi-shipping, updates currency, calculates totals, and determines appropriate checkout stage

#### **CheckoutServices Controller** (`CheckoutServices.js`)
Provides AJAX services for checkout process steps including customer information, payment processing, and order placement.

**Key Routes:**

##### `CheckoutServices-Get`: Get current checkout state for multi-shipping
- **Returns**: JSON response with current basket and customer state
- **Models Returned**:
    - `order` - Complete `OrderModel` with basket data for multi-shipping context
    - `customer` - `AccountModel` with customer profile information
    - `error` - Boolean indicating validation status
    - `message` - Error message if shipping addresses are invalid
- **Middlewares**: `server.middleware.https`
- **Notes**: Only used in multi-ship checkout when clicking "Next: Payment"

##### `CheckoutServices-SubmitCustomer`: Submit guest customer information (POST)
- **Returns**: JSON response with customer submission result
- **Models Returned**:
```javascript
// Success
{
    "customer": {...}, // AccountModel
    "error": false,
    "order": {...}, // OrderModel with updated customer email
    "csrfToken": "...", // New CSRF token
    "redirectUrl": null
}

// Error
{
    "form": {...}, // Customer form with validation state
    "fieldErrors": [...], // Array of field-specific errors
    "serverErrors": [],
    "error": true
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Notes**: Validates guest customer form and sets customer email in basket

##### `CheckoutServices-LoginCustomer`: Submit registered customer login (POST)
- **Returns**: JSON response with login result
- **Models Returned**:
```javascript
// Success
{
    "customer": {...}, // AccountModel for authenticated customer
    "error": false,
    "order": {...}, // OrderModel
    "csrfToken": "...", // Refreshed CSRF token after login
    "redirectUrl": "https://checkout-begin-shipping-url"
}

// Error - Invalid credentials
{
    "form": {...}, // Customer form
    "fieldErrors": [...],
    "serverErrors": [],
    "customerErrorMessage": "Invalid login credentials",
    "error": true
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Notes**: Authenticates customer and refreshes session tokens

##### `CheckoutServices-SubmitPayment`: Submit payment and billing information (POST)
- **Returns**: JSON response with payment processing result
- **Models Returned**:
```javascript
// Success
{
    "renderedPaymentInstruments": "...", // HTML for stored payment instruments
    "customer": {...}, // AccountModel
    "order": {...}, // OrderModel with updated totals and payment
    "form": {...}, // Billing form (with sensitive data cleared)
    "error": false
}

// Error - Form validation
{
    "form": {...}, // Billing form with validation state
    "fieldErrors": [...], // Array of form field errors
    "serverErrors": [...], // Array of payment processing errors
    "error": true
}

// Error - Cart issues
{
    "error": true,
    "cartError": true,
    "fieldErrors": [],
    "serverErrors": [],
    "redirectUrl": "cart-show-url"
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Form Parameters**: Complete billing address, contact info, and credit card fields
- **Notes**: Validates billing form, processes payment via hooks, calculates totals, and handles payment instrument storage

##### `CheckoutServices-PlaceOrder`: Place the final order (POST)
- **Returns**: JSON response with order placement result
- **Models Returned**:
```javascript
// Success
{
    "error": false,
    "orderID": "order-number",
    "orderToken": "order-token",
    "continueUrl": "order-confirmation-url"
}

// Error - Validation failure
{
    "error": true,
    "errorStage": {
        "stage": "shipping|payment",
        "step": "address|paymentInstrument"
    },
    "errorMessage": "Specific error message"
}

// Error - Fraud detection
{
    "error": true,
    "cartError": true,
    "redirectUrl": "fraud-error-url",
    "errorMessage": "Technical error message"
}
```
- **Middlewares**: `server.middleware.https`
- **Notes**: Comprehensive order validation, fraud detection, payment authorization, and order creation

#### **CheckoutAddressServices Controller** (`CheckoutAddressServices.js`)
Handles address-related AJAX services during checkout, specifically for multi-shipping scenarios.

**Key Routes:**

##### `CheckoutAddressServices-CreateNewAddress`: Create new shipment for multi-shipping (POST)
- **Returns**: JSON response with new shipment information
- **Models Returned**:
```javascript
// Success
{
    "uuid": "new-shipment-uuid", // UUID of created shipment
    "customer": {...}, // AccountModel
    "order": {...} // OrderModel with new shipment structure
}

// Error - No basket
{
    "redirectUrl": "cart-show-url",
    "error": true
}

// Error - Shipment creation failed
{
    "redirectUrl": "checkout-begin-url",
    "error": true
}
```
- **Middlewares**: `server.middleware.https`
- **Parameters**: `productLineItemUUID` - Product line item to move to new shipment
- **Notes**: Creates new shipment and moves specified product line item to it

##### `CheckoutAddressServices-AddNewAddress`: Save shipping address in multi-shipping (POST)
- **Returns**: JSON response with address save result
- **Models Returned**:
```javascript
// Success
{
    "customer": {...}, // AccountModel
    "order": {...}, // OrderModel with updated shipping addresses
    "error": false
}

// Error - Form validation
{
    "form": {...}, // Shipping form with validation state
    "fieldErrors": [...], // Array of address validation errors
    "serverErrors": [],
    "error": true
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Form Parameters**: Complete shipping address fields, shipping method, gift options
- **Notes**: Validates shipping form and applies address to appropriate shipment in multi-shipping context

##### `CheckoutAddressServices-SelectShippingAddress`: Select existing address (POST)
- **Returns**: JSON response with address selection result
- **Models Returned**:
```javascript
{
    "customer": {...}, // AccountModel
    "order": {...}, // OrderModel with selected address applied
    "error": false
}
```
- **Notes**: Applies selected address from customer's address book to shipment

#### **CheckoutShippingServices Controller** (`CheckoutShippingServices.js`)
Manages shipping method selection and calculation during checkout.

**Key Routes:**

##### `CheckoutShippingServices-ToggleMultiShip`: Toggle multi-shipping mode (POST)
- **Returns**: JSON response with multi-shipping toggle result
- **Models Returned**:
```javascript
// Success
{
    "customer": {...}, // AccountModel
    "order": {...}, // OrderModel with updated shipment structure
    "error": false
}

// Error - No basket
{
    "error": true,
    "cartError": true,
    "fieldErrors": [],
    "serverErrors": [],
    "redirectUrl": "cart-show-url"
}
```
- **Middlewares**: `server.middleware.https`
- **Parameters**: `usingMultiShip` - Boolean flag to enable/disable multi-shipping
- **Notes**: Either splits line items into separate shipments or consolidates them into single shipment

##### `CheckoutShippingServices-UpdateShippingMethodsList`: Get available shipping methods (POST)
- **Returns**: JSON response with shipping methods for specific shipment
- **Models Returned**:
```javascript
{
    "order": {...}, // OrderModel with updated shipping options
    "customer": {...}, // AccountModel
    "error": false
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Notes**: Updates available shipping methods based on shipment address

##### `CheckoutShippingServices-SelectShippingMethod`: Select shipping method (POST)
- **Returns**: JSON response with shipping method selection result
- **Models Returned**:
```javascript
{
    "order": {...}, // OrderModel with updated shipping costs and totals
    "customer": {...}, // AccountModel
    "error": false
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Parameters**: `shipmentUUID`, `shippingMethodID`
- **Notes**: Applies selected shipping method to specified shipment and recalculates totals

##### `CheckoutShippingServices-SubmitShipping`: Submit shipping information (POST)
- **Returns**: JSON response with shipping submission result
- **Models Returned**:
```javascript
// Success
{
    "order": {...}, // OrderModel with finalized shipping information
    "customer": {...}, // AccountModel
    "error": false,
    "csrfToken": "..." // Refreshed CSRF token
}

// Error
{
    "form": {...}, // Shipping form with validation errors
    "fieldErrors": [...],
    "serverErrors": [],
    "error": true
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Notes**: Final shipping step validation and preparation for payment stage

### Order Management Controllers

#### **Order Controller** (`Order.js`)
Manages order confirmation, history, and details.

**Key Routes:**

##### `Order-Confirm`: Order confirmation page (POST)
- **Returns**: Order confirmation page with order details
- **Models Returned**:
  - `pdict.order` - Complete `OrderModel` with all order details, line items, and totals
  - `pdict.returningCustomer` - Boolean indicating if customer is registered
  - `pdict.passwordForm` - Password creation form for guest customers (optional)
  - `pdict.reportingURLs` - Analytics URLs for order tracking
  - `pdict.orderUUID` - Order UUID for tracking
- **Template**: `checkout/confirmation/confirmation.isml`
- **Middlewares**: `consentTracking.consent`, `server.middleware.https`, `csrfProtection.generateToken`
- **Notes**: Validates order ID and token, prevents duplicate confirmations, handles both guest and registered customer confirmations

##### `Order-History`: Customer order history
- **Returns**: List of customer's past orders
- **Models Returned**:
  - `pdict.orders` - Paginated list of customer orders
  - `pdict.orderPagination` - Pagination information
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/orderHistory.isml`
- **Middlewares**: `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

##### `Order-Details`: Individual order details
- **Returns**: Detailed view of specific order
- **Models Returned**:
  - `pdict.order` - Complete `OrderModel` with full order details
  - `pdict.exitLinkUrl` - URL to return to order history
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/orderDetails.isml`
- **Middlewares**: `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

### Account Management Controllers

#### **Account Controller** (`Account.js`)
Manages customer account functionality and authentication.

**Key Routes:**

##### `Account-Show`: Account dashboard
- **Returns**: Complete customer account dashboard
- **Models Returned**:
  - `pdict.account` - Account model from `accountHelpers.getAccountModel(req)`
  - `pdict.accountlanding` - Boolean flag set to true
  - `pdict.breadcrumbs` - Navigation breadcrumbs array
  - `pdict.reportingURLs` - Analytics URLs (if registration completion)
  - `pdict.payment` - Payment information from account model
  - `pdict.viewSavedPaymentsUrl` - URL to payment instruments list
  - `pdict.addPaymentUrl` - URL to add new payment method
- **Template**: `account/accountDashboard.isml`
- **Middlewares**: `server.middleware.https`, `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

##### `Account-Login`: Customer login (POST)
- **Returns**: JSON response with authentication result
- **Models Returned**:
```javascript
// Success
{
    "success": true,
    "redirectUrl": "redirect-url-from-accountHelpers.getLoginRedirectURL()"
}

// Failure (various error scenarios)
{
    "error": ["Error message from Resource bundle or custom message"]
}
```
- **Special Handling**: Account lockout triggers email notification via hooks

##### `Account-SubmitRegistration`: New customer registration
- **Returns**: JSON response with registration result
- **Models Returned**: Uses form validation with `server.forms.getForm('profile')`
```javascript
// Success response structure varies based on form validation
// Error responses include field-specific validation errors
{
    // Form validation errors for specific fields
    "fieldErrors": {...},
    // General registration errors
    "error": [...]
}
```

#### **Address Controller** (`Address.js`)
Manages customer address book functionality.

**Key Routes:**

##### `Address-List`: Display customer's address book
- **Returns**: List of customer's saved addresses
- **Models Returned**:
  - `pdict.addressBook` - Array of `AddressModel` objects from customer's address book
  - `pdict.actionUrls` - URLs for delete and list actions
  - `pdict.breadcrumbs` - Navigation breadcrumbs array
- **Template**: `account/addressBook.isml`
- **Middlewares**: `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

##### `Address-AddAddress`: Add new address form (GET)
- **Returns**: New address creation form
- **Models Returned**:
  - `pdict.addressForm` - Empty address form for new address creation
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/addEditAddress.isml`
- **Middlewares**: `csrfProtection.generateToken`, `consentTracking.consent`, `userLoggedIn.validateLoggedIn`

##### `Address-EditAddress`: Edit existing address form (GET)
- **Returns**: Pre-populated address edit form
- **Models Returned**:
  - `pdict.addressForm` - Address form populated with existing address data
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/addEditAddress.isml`

##### `Address-SaveAddress`: Save address (POST)
- **Returns**: JSON response with save result
- **Models Returned**: Form validation results and success/error status

##### `Address-DeleteAddress`: Delete address (POST)
- **Returns**: JSON response with deletion result
- **Models Returned**: Success/error status for address deletion

#### **PaymentInstruments Controller** (`PaymentInstruments.js`)
Manages customer's saved payment methods.

**Key Routes:**

##### `PaymentInstruments-List`: Display saved payment methods
- **Returns**: List of customer's saved payment instruments
- **Models Returned**:
  - `pdict.paymentInstruments` - Array of customer's saved payment methods
  - `pdict.actionUrls` - URLs for payment instrument management
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/payment/paymentMethods.isml`
- **Middlewares**: `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

##### `PaymentInstruments-AddPayment`: Add new payment method form
- **Returns**: New payment method creation form
- **Models Returned**:
  - `pdict.paymentForm` - Payment instrument form
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/payment/addPayment.isml`

##### `PaymentInstruments-SavePayment`: Save payment method (POST)
- **Returns**: JSON response with save result
- **Models Returned**: Form validation and success/error status

### Search & Navigation Controllers

#### **Search Controller** (`Search.js`)
Handles product search, category navigation, and refinements.

**Key Routes:**

##### `Search-Show`: Main search/category listing page
- **Returns**: Product listing page with search results or category products
- **Models Returned**:
  - `pdict.productSearch` - Complete `ProductSearchModel` with search results, refinements, and pagination
  - `pdict.maxSlots` - Maximum recommendation slots
  - `pdict.reportingURLs` - Analytics reporting URLs
  - `pdict.refineurl` - Base URL for refinements
  - `pdict.breadcrumbs` - Category/search breadcrumbs
  - `pdict.apiProductSearch` - Raw search API results for analytics
- **Template**: `search/searchResults.isml`
- **Middlewares**: `cache.applyPromotionSensitiveCache`, `consentTracking.consent`, `pageMetaData.computedPageMetaData`

##### `Search-UpdateGrid`: AJAX grid update for sorting/pagination
- **Returns**: Updated product grid HTML
- **Models Returned**:
  - `pdict.productSearch` - Updated search results with new sorting/pagination
- **Template**: `/search/productGrid.isml`
- **Notes**: Called when shopper changes sort order or requests more results

##### `Search-Refinebar`: Refinement sidebar component
- **Returns**: Refinement filters sidebar
- **Models Returned**:
  - `pdict.productSearch` - Search model with available refinements
- **Template**: `/search/refinementBar.isml`
- **Middlewares**: `cache.applyDefaultCache`

##### `Search-GetSuggestions`: Search suggestions for autocomplete
- **Returns**: JSON search suggestions
- **Models Returned**:
```javascript
{
    "suggestions": [...], // Array of search term suggestions
    "productSuggestions": [...], // Array of product suggestions
    "categorySuggestions": [...] // Array of category suggestions
}
```

#### **SearchServices Controller** (`SearchServices.js`)
Provides AJAX services for search functionality including autocomplete and refinements.

### Content & Utility Controllers

#### **Page Controller** (`Page.js`)
Handles content pages and Page Designer content.

**Key Routes:**

##### `Page-Show`: Display content pages
- **Returns**: Content page with Page Designer or static content
- **Models Returned**:
  - `pdict.page` - Page model with content and metadata
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: Page Designer page or content template
- **Middlewares**: `cache.applyDefaultCache`, `consentTracking.consent`, `pageMetaData.computedPageMetaData`

#### **PageDesigner Controller** (`PageDesigner.js`)
Handles Page Designer specific functionality and components.

#### **ContactUs Controller** (`ContactUs.js`)
Manages contact forms and customer inquiries.

**Key Routes:**

##### `ContactUs-Show`: Display contact form
- **Returns**: Contact us form page
- **Models Returned**:
  - `pdict.contactUsForm` - Contact form object
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `contactUs/contactUs.isml`
- **Middlewares**: `csrfProtection.generateToken`, `consentTracking.consent`

##### `ContactUs-Submit`: Process contact form submission (POST)
- **Returns**: JSON response with submission result
- **Models Returned**: Form validation results and success/error status

### Authentication & Security Controllers

#### **Login Controller** (`Login.js`)
Handles customer authentication flows.

**Key Routes:**

##### `Login-Show`: Display login form
- **Returns**: Login page with forms
- **Models Returned**:
  - `pdict.loginForm` - Customer login form
  - `pdict.profileForm` - New customer registration form
  - `pdict.breadcrumbs` - Navigation breadcrumbs
  - `pdict.oAuthReentryEndpoint` - OAuth reentry point
- **Template**: `account/login.isml`
- **Middlewares**: `csrfProtection.generateToken`, `consentTracking.consent`

##### `Login-Logout`: Customer logout
- **Returns**: Redirect to home page after logout
- **Models Returned**: No models (redirect response)

##### `Login-OAuthReentry`: Handle OAuth authentication reentry
- **Returns**: Continues checkout or redirects based on context
- **Models Returned**: Varies based on OAuth flow context

#### **CSRF Controller** (`CSRF.js`)
Provides CSRF token management services.

**Key Routes:**

##### `CSRF-Generate`: Generate new CSRF token
- **Returns**: JSON response with new CSRF token
- **Models Returned**:
```javascript
{
    "csrf": {
        "tokenName": "csrf_token",
        "token": "generated-token-value"
    }
}
```

### Privacy & Compliance Controllers

#### **ConsentTracking Controller** (`ConsentTracking.js`)
Manages privacy consent and tracking preferences.

**Key Routes:**

##### `ConsentTracking-SetSession`: Set tracking consent preference
- **Returns**: JSON response with consent status
- **Models Returned**: Consent preference status and updates

##### `ConsentTracking-GetContent`: Get consent banner content
- **Returns**: HTML content for consent banner
- **Models Returned**:
  - `pdict.consentContent` - Localized consent text and options

### Communication Controllers

#### **EmailSubscribe Controller** (`EmailSubscribe.js`)
Manages email subscription functionality.

**Key Routes:**

##### `EmailSubscribe-Subscribe`: Newsletter subscription (POST)
- **Returns**: JSON response with subscription result
- **Models Returned**: Subscription status and validation results

### Store Locator Controllers

#### **Stores Controller** (`Stores.js`)
Handles store locator functionality.

**Key Routes:**

##### `Stores-Find`: Store locator search
- **Returns**: Store search results page
- **Models Returned**:
  - `pdict.stores` - Array of store locations
  - `pdict.searchKey` - Current search terms
  - `pdict.googleMapsApi` - Google Maps API configuration
- **Template**: `storeLocator/storeLocator.isml`

##### `Stores-Details`: Individual store details
- **Returns**: Detailed store information
- **Models Returned**:
  - `pdict.store` - Complete store model with details
  - `pdict.breadcrumbs` - Navigation breadcrumbs

### Error Handling Controllers

#### **Error Controller** (`Error.js`)
Provides centralized error handling for the application.

**Key Routes:**

##### `Error-ErrorHandling`: Global error handler
- **Returns**: Error page or JSON error response based on request type
- **Models Returned**:
  - `pdict.error` - Error information and message
  - `pdict.message` - User-friendly error message
- **Template**: `error/error.isml`
- **Notes**: Handles both page requests and AJAX requests appropriately

##### `Error-Start`: Application startup error handling
- **Returns**: Startup error page
- **Models Returned**: Application startup error information

### Recommendation Controllers

#### **EinsteinCarousel Controller** (`EinsteinCarousel.js`)
Handles Einstein product recommendations and carousels.

**Key Routes:**

##### `EinsteinCarousel-GetRecommendations`: Get product recommendations
- **Returns**: JSON response with recommended products
- **Models Returned**:
```javascript
{
    "recommendations": [...], // Array of recommended products
    "errorMessage": "...", // Error message if recommendations fail
    "product": {...} // Context product for recommendations
}
```

### Reporting & Analytics Controllers

#### **ReportingEvent Controller** (`ReportingEvent.js`)
Handles analytics event tracking.

**Key Routes:**

##### `ReportingEvent-Track`: Track analytics events
- **Returns**: JSON response confirming event tracking
- **Models Returned**: Event tracking confirmation and status

### URL Management Controllers

#### **RedirectURL Controller** (`RedirectURL.js`)
Manages URL redirects and rewrites.

#### **Link Controller** (`Link.js`)
Handles dynamic link generation and routing.

#### **SourceCodeRedirect Controller** (`SourceCodeRedirect.js`)
Manages source code-based redirects for campaign tracking.

### Component Controllers

#### **Tile Controller** (`Tile.js`)
Handles tile components for product grids and carousels.

#### **Default Controller** (`Default.js`)
Provides fallback functionality and default route handling.

### Model Integration Notes from Actual Implementation

Based on examination of the actual controller code:

1. **Product Controllers**: Use `productHelper.showProductPage()` which returns a comprehensive result object with product, template, URLs, and metadata
2. **Cart Controllers**: Extensively use `CartModel` class and include transaction wrapping for basket modifications
3. **Account Controllers**: Use `accountHelpers.getAccountModel()` and form validation through `server.forms.getForm()`
4. **Template vs Page Designer**: Many controllers check for Page Designer pages first, then fall back to standard ISML templates
5. **Analytics Integration**: Controllers frequently include `reportingURLs` for analytics tracking
6. **Error Handling**: Controllers return appropriate HTTP status codes (404, etc.) and error templates
7. **Middleware Patterns**: Consistent use of HTTPS, CSRF protection, consent tracking, and caching middlewares
8. **Transaction Management**: Cart operations wrapped in `Transaction.wrap()` for data integrity

**Important**: The actual SFRA implementations include more complex logic for basket calculations, Page Designer integration, form validation, and error handling than initially documented. Controllers frequently delegate to helper modules for business logic implementation.
