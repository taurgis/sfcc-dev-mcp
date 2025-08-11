# Salesforce B2C Commerce SFRA Controllers: Best Practices & Examples

This guide provides a condensed overview of best practices and code patterns for developing controllers within the Salesforce B2C Commerce Storefront Reference Architecture (SFRA).

**IMPORTANT**: Before developing SFRA controllers, consult the **Performance and Stability Best Practices** guide from this MCP server. Review the storefront development guidelines, index-friendly APIs, and critical page performance requirements to ensure your controllers follow SFCC performance standards and avoid database-intensive operations.

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
        csrf: res.getViewData().csrf // Pass token to template
    });
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
