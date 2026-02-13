# SFRA Middleware Reference

Comprehensive reference for built-in SFRA middlewares and custom middleware patterns.

## Cache Middlewares (`cache.js`)

These middlewares set appropriate cache headers for different types of content.

### `applyDefaultCache`
Sets standard 24-hour cache for general content.
```javascript
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    // Your controller logic here
    // Page will be cached for 24 hours
    next();
});
```

### `applyPromotionSensitiveCache`
Sets 24-hour cache with personalization flag for promotion-sensitive pages.
```javascript
server.get('ProductList', cache.applyPromotionSensitiveCache, function (req, res, next) {
    // Page cached for 24 hours but marked as personalized
    // Useful for pages that show different content based on promotions
    next();
});
```

### `applyShortPromotionSensitiveCache`
Sets 1-hour cache with personalization for highly dynamic promotional content.
```javascript
server.get('FlashSale', cache.applyShortPromotionSensitiveCache, function (req, res, next) {
    // Short cache for time-sensitive promotional content
    next();
});
```

### `applyInventorySensitiveCache`
Sets 30-minute cache for inventory-dependent pages.
```javascript
server.get('ProductAvailability', cache.applyInventorySensitiveCache, function (req, res, next) {
    // Short cache for pages that depend on inventory levels
    next();
});
```

## CSRF Protection (`csrf.js`)

Critical security middlewares for preventing Cross-Site Request Forgery attacks.

### `generateToken`
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

### `validateRequest`
Validates CSRF token for standard form submissions. Logs out user and redirects on failure.
```javascript
server.post('SubmitForm', csrfProtection.validateRequest, function (req, res, next) {
    // Process form submission - token has been validated
    next();
});
```

### `validateAjaxRequest`
Validates CSRF token for AJAX requests. Redirects to AJAX-specific error page on failure.
```javascript
server.post('AjaxSubmit', csrfProtection.validateAjaxRequest, function (req, res, next) {
    // Process AJAX form submission
    res.json({ success: true });
    next();
});
```

### CSRF Middleware Automation

**IMPORTANT**: The middleware automatically adds CSRF to pdict. Never manually add CSRF tokens.

```javascript
// ❌ WRONG - Don't do this!
server.get('ShowForm', csrfProtection.generateToken, function(req, res, next) {
    res.render('myForm', {
        csrf: res.getViewData().csrf,    // ❌ Redundant
    });
});

// ✅ CORRECT - Middleware handles it
server.get('ShowForm', csrfProtection.generateToken, function(req, res, next) {
    res.render('myForm', {
        pageTitle: 'My Form'
        // pdict.csrf.tokenName and pdict.csrf.token are automatically available
    });
    next();
});
```

## User Authentication (`userLoggedIn.js`)

Middlewares for protecting routes that require authentication.

### `validateLoggedIn`
Ensures user is logged in, redirects to login page if not. Preserves query parameters.
```javascript
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');

server.get('AccountDashboard', userLoggedIn.validateLoggedIn, function (req, res, next) {
    // User is guaranteed to be logged in here
    next();
});
```

### `validateLoggedInAjax`
AJAX-friendly version that returns JSON response instead of redirecting.
```javascript
server.post('UpdateProfile', userLoggedIn.validateLoggedInAjax, function (req, res, next) {
    var viewData = res.getViewData();
    if (viewData.loggedin) {
        res.json({ success: true });
    } else {
        res.json({ 
            success: false, 
            redirectUrl: viewData.redirectUrl 
        });
    }
    next();
});
```

## Consent Tracking (`consentTracking.js`)

Handles privacy consent management and tracking permissions.

### `consent`
Manages tracking consent state and generates CSRF tokens when needed.
```javascript
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.get('Home', consentTracking.consent, function (req, res, next) {
    // Consent status available in pdict.tracking_consent
    // Can be: true (consented), false (declined), null (not set)
    next();
});
```

## Page Metadata (`pageMetaData.js`)

Processes and computes page metadata for SEO.

### `computedPageMetaData`
Consolidates page metadata from various sources into a single object.
```javascript
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.get('ProductDetail', pageMetaData.computedPageMetaData, function (req, res, next) {
    // Computed metadata available in pdict.CurrentPageMetaData
    next();
});
```

## Middleware Chaining Examples

### Complete Product Detail Page
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
        var pid = req.querystring.pid;
        // Product logic here...
        next();
    }
);
```

### Secure Form Submission
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
        next();
    }
);
```

## Custom Middleware Best Practices

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

## Common Middleware Table

| Middleware | Purpose |
|------------|---------|
| `server.middleware.https` | Require HTTPS connection |
| `server.middleware.include` | Mark route as remote include only |
| `cache.applyDefaultCache` | Apply default page caching (24h) |
| `cache.applyPromotionSensitiveCache` | Promotion-aware caching (24h) |
| `cache.applyShortPromotionSensitiveCache` | Short promotion cache (1h) |
| `cache.applyInventorySensitiveCache` | Inventory-aware caching (30m) |
| `csrfProtection.generateToken` | Generate CSRF token for forms |
| `csrfProtection.validateRequest` | Validate CSRF for POST |
| `csrfProtection.validateAjaxRequest` | Validate CSRF for AJAX |
| `consentTracking.consent` | Check tracking consent |
| `userLoggedIn.validateLoggedIn` | Require authenticated user |
| `userLoggedIn.validateLoggedInAjax` | Require auth (AJAX response) |
| `pageMetaData.computedPageMetaData` | Compute SEO metadata |
