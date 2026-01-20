---
name: sfcc-sfra-controllers
description: Guide for developing SFRA controllers in Salesforce B2C Commerce. Use this when asked to create controllers, extend base functionality, implement middleware chains, handle routing, or customize storefront behavior.
---

# SFRA Controllers Skill

This skill guides you through creating storefront controllers for Salesforce B2C Commerce using the Storefront Reference Architecture (SFRA).

## Overview

Controllers are JavaScript modules that handle storefront requests. A controller URL has this structure:

```
https://{domain}/on/demandware.store/Sites-{SiteName}-Site/{locale}/{ControllerName}-{FunctionName}
```

**Example:** `https://example.com/on/demandware.store/Sites-RefArch-Site/en_US/Home-Show`

## MVC Pattern

SFRA uses Model-View-Controller pattern:

- **Controller** (`/controllers`): Handles requests, calls models, determines view
- **Model** (`/models`): Business logic, returns JSON objects
- **View** (`/templates`): ISML templates, renders pdict data only

**Cartridge Path**: Custom cartridges must precede `app_storefront_base` to override functionality. Never edit the base cartridge directly.

## File Location

Controllers reside in the cartridge's `controllers` directory:

```
/my-cartridge
    /cartridge
        /controllers
            Home.js           # URL: Home-{function}
            Product.js        # URL: Product-{function}
            Cart.js           # URL: Cart-{function}
```

## Basic Controller Pattern

```javascript
'use strict';

var server = require('server');

// Handle GET request
server.get('Show', function (req, res, next) {
    res.render('home/homepage');
    next();
});

// Handle POST request
server.post('Subscribe', function (req, res, next) {
    var email = req.form.email;
    res.json({ success: true });
    next();
});

module.exports = server.exports();
```

## Request & Response Objects

### Request (req)

```javascript
req.querystring          // Query parameters: ?q=shoes -> req.querystring.q
req.form                 // Form POST data: req.form.email
req.httpMethod           // HTTP method: 'GET', 'POST', etc.
req.httpHeaders          // Request headers
req.currentCustomer      // Current customer object
req.locale               // Current locale
req.session              // Session object
```

### Response (res)

```javascript
res.render('template', model)   // Render ISML template with data
res.json(object)                // Return JSON response
res.redirect(url)               // Redirect to URL
res.setViewData(data)           // Add data to view model
res.getViewData()               // Get current view model
res.setStatusCode(code)         // Set HTTP status code
res.cacheExpiration(hours)      // Set cache duration
```

## Middleware Chain

Each route is a series of functions with `(req, res, next)`:

```javascript
server.get('Show', 
    middleware1,
    middleware2,
    function (req, res, next) {
        // Main handler
        next();
    }
);
```

**Critical**: Always call `next()` to pass control, unless terminating the request.

### Common Built-in Middleware

| Middleware | Purpose |
|------------|---------|
| `server.middleware.https` | Require HTTPS connection |
| `server.middleware.include` | Mark as remote include only |
| `cache.applyDefaultCache` | Apply 24-hour page caching |
| `csrfProtection.generateToken` | Generate CSRF token |
| `csrfProtection.validateRequest` | Validate CSRF for POST |
| `userLoggedIn.validateLoggedIn` | Require authenticated user |
| `consentTracking.consent` | Check tracking consent |

## Controller Extension

Customize without modifying base code. Always import base first:

```javascript
'use strict';
var server = require('server');
var page = module.superModule; // Get base controller
server.extend(page);
```

### Extension Methods

| Method | Use Case |
|--------|----------|
| `server.append()` | Add/modify data after base logic (most common) |
| `server.prepend()` | Run validation before base logic |
| `server.replace()` | Completely replace route behavior |

### Append Example (Most Common)

```javascript
server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    viewData.customData = 'My custom value';
    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
```

### Replace Example (State-Changing Actions)

```javascript
// Use replace for payment, inventory updates, etc.
server.replace('Submit', function (req, res, next) {
    // Custom implementation
    res.json({ success: true });
    next();
});
```

**Critical**: Never use `append` for state-changing routes (payments, inventory). Use `replace` to prevent duplicate transactions.

## CSRF Protection

```javascript
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

// Display form - generates token automatically
server.get('ShowForm', csrfProtection.generateToken, function (req, res, next) {
    res.render('myForm', { pageTitle: 'Contact' });
    // pdict.csrf.tokenName and pdict.csrf.token auto-available
    next();
});

// Process form - validates token
server.post('Submit', csrfProtection.validateRequest, function (req, res, next) {
    // Token validated, safe to process
    next();
});
```

**Important**: Middleware automatically adds CSRF to pdict. Never manually add tokens to viewData.

Template usage:
```html
<input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>
```

## Error Handling

```javascript
server.get('Show', function (req, res, next) {
    try {
        var product = ProductMgr.getProduct(req.querystring.pid);
        
        if (!product) {
            res.setStatusCode(404);
            res.render('error/notfound');
            return next();
        }
        
        res.render('product/detail', { product: product });
    } catch (e) {
        Logger.error('Product error: ' + e.message);
        res.setStatusCode(500);
        res.render('error/general');
    }
    next();
});
```

## Module Imports

```javascript
// B2C Commerce APIs
var ProductMgr = require('dw/catalog/ProductMgr');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');
var URLUtils = require('dw/web/URLUtils');

// Cartridge modules (use */ for path resolution)
var collections = require('*/cartridge/scripts/util/collections');
var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
```

**Best Practice**: Require modules inside route functions, not at file top.

## URL Generation

```javascript
var URLUtils = require('dw/web/URLUtils');

// Controller URL
var productUrl = URLUtils.url('Product-Show', 'pid', 'ABC123');

// HTTPS URL
var loginUrl = URLUtils.https('Login-Show');

// Static resource URL
var imageUrl = URLUtils.staticURL('/images/logo.png');
```

## Route Events

Execute code at specific points in request lifecycle:

```javascript
server.get('Show', function (req, res, next) {
    res.setViewData({ email: req.form.email });
    next();
});

// Execute after all middleware, before render
this.on('route:BeforeComplete', function (req, res) {
    var viewData = res.getViewData();
    // Modify view data if needed
});
```

## JSON API Endpoints

```javascript
server.get('GetCart', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var CartModel = require('*/cartridge/models/cart');
    
    var basket = BasketMgr.getCurrentBasket();
    var cart = new CartModel(basket);
    
    res.json(cart);
    next();
});
```

## Complete Controller Example

```javascript
'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');

// Public page with caching
server.get('Show',
    cache.applyDefaultCache,
    function (req, res, next) {
        var ProductMgr = require('dw/catalog/ProductMgr');
        var product = ProductMgr.getProduct(req.querystring.pid);
        
        res.render('product/detail', { product: product });
        next();
    }
);

// Protected form display
server.get('EditProfile',
    server.middleware.https,
    userLoggedIn.validateLoggedIn,
    csrfProtection.generateToken,
    function (req, res, next) {
        res.render('account/editProfile');
        next();
    }
);

// Protected form submission
server.post('SaveProfile',
    server.middleware.https,
    userLoggedIn.validateLoggedIn,
    csrfProtection.validateRequest,
    function (req, res, next) {
        // Process form...
        res.json({ success: true });
        next();
    }
);

module.exports = server.exports();
```

## Best Practices

1. **Always call `next()`** in middleware chain
2. **Use ViewModels** to prepare data for templates
3. **Keep controllers thin** - move logic to scripts/helpers
4. **Use hooks** for functionality that works for storefront and OCAPI
5. **Handle errors gracefully** - never expose stack traces
6. **Use `*/cartridge/...`** for portable module paths
7. **Lazy load modules** - require inside functions, not at file top
8. **Use page caching** via middleware or `res.cacheExpiration()`

## Related Skills

- **[sfcc-localization](../sfcc-localization/SKILL.md)** - Essential for localizing controller responses. Use `Resource.msg()` for all user-facing messages, error strings, and JSON responses. Never hardcode text in controllers.
- **[sfcc-logging](../sfcc-logging/SKILL.md)** - Comprehensive logging patterns including categories, custom log files, and log level checks for debugging controllers.

## Detailed References

For comprehensive patterns and examples:
- [Middleware Reference](references/MIDDLEWARE-REFERENCE.md) - Full middleware documentation
- [Remote Includes](references/REMOTE-INCLUDES.md) - Remote include patterns
- [Standard SFRA Controllers](references/STANDARD-SFRA-CONTROLLERS.md) - Complete route reference
