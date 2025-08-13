# Class Server

## Inheritance Hierarchy

- Object
  - sfra.models.Server

## Description

The SFRA Server class is the core routing solution for Salesforce Commerce Cloud's Storefront Reference Architecture (SFRA). This class provides a comprehensive middleware-based routing system that handles HTTP requests, manages route registration, and coordinates the request-response lifecycle. The Server class supports route definition with middleware chains, HTTP method shortcuts (GET/POST), route modification capabilities (prepend/append/replace), and integration with SFCC's hook system for extensibility. It serves as the foundation for all SFRA controller functionality, providing a structured approach to handling web requests with support for caching, personalization, redirects, and various rendering strategies.

## Properties

### routes

**Type:** Object

Internal registry of all registered routes, indexed by route name.

## Constructor Summary

### Server

**Signature:** `Server()`

Creates a new Server instance with an empty routes registry.

## Method Summary

### use

**Signature:** `use(name, ...middleware) : Route`

Creates a new route with middleware chain.

### get

**Signature:** `get(name, ...middleware) : Route`

Creates a GET-specific route with automatic HTTP method validation.

### post

**Signature:** `post(name, ...middleware) : Route`

Creates a POST-specific route with automatic HTTP method validation.

### exports

**Signature:** `exports() : Object`

Returns an exportable object containing all registered routes.

### extend

**Signature:** `extend(server) : void`

Extends the current server with routes from another server object.

### prepend

**Signature:** `prepend(name, ...middleware) : void`

Adds middleware to the beginning of an existing route's chain.

### append

**Signature:** `append(name, ...middleware) : void`

Adds middleware to the end of an existing route's chain.

### replace

**Signature:** `replace(name, ...middleware) : void`

Replaces an existing route with a new middleware chain.

### getRoute

**Signature:** `getRoute(name) : Route`

Retrieves a specific route by name.

## Method Detail

### use

**Signature:** `use(name, ...middleware) : Route`

**Description:** Creates a new route with the specified name and middleware chain. Automatically creates Request and Response objects from global SFCC objects and sets up route completion handling including caching, personalization, and rendering.

**Parameters:**
- `name` (String) - Unique name for the route
- `...middleware` (Function[]) - Variable number of middleware functions to execute

**Returns:**
Route object representing the created route.

**Throws:**
- Error if name is not a string
- Error if middleware contains non-function items
- Error if route name already exists

**Route Completion Handling:**
- Sets cache expiration based on `res.cachePeriod` and `res.cachePeriodUnit`
- Applies personalization with `price_promotion` vary-by header when `res.personalized` is true
- Handles redirects with optional status codes
- Applies rendering through the render system

### get

**Signature:** `get(name, ...middleware) : Route`

**Description:** Convenience method for creating GET-only routes. Automatically prepends HTTP GET validation middleware to the chain.

**Parameters:**
- `name` (String) - Unique name for the route
- `...middleware` (Function[]) - Variable number of middleware functions

**Returns:**
Route object with GET method validation.

### post

**Signature:** `post(name, ...middleware) : Route`

**Description:** Convenience method for creating POST-only routes. Automatically prepends HTTP POST validation middleware to the chain.

**Parameters:**
- `name` (String) - Unique name for the route
- `...middleware` (Function[]) - Variable number of middleware functions

**Returns:**
Route object with POST method validation.

### exports

**Signature:** `exports() : Object`

**Description:** Creates an exportable object containing all registered routes with their public interfaces. Includes internal routes registry for extension capabilities.

**Returns:**
Object with route names as keys and route interfaces as values, plus `__routes` property containing internal routes.

**Export Format:**
```javascript
{
  "routeName": { /* route interface */ },
  "__routes": { /* internal routes registry */ }
}
```

### extend

**Signature:** `extend(server) : void`

**Description:** Extends the current server with routes from another server object created by the `exports()` method. Validates the server object structure before extension.

**Parameters:**
- `server` (Object) - Server object created by `exports()` method

**Throws:**
- Error if server object is invalid (missing `__routes`)
- Error if server has no routes to extend

### prepend

**Signature:** `prepend(name, ...middleware) : void`

**Description:** Adds middleware functions to the beginning of an existing route's middleware chain, allowing for route enhancement and modification.

**Parameters:**
- `name` (String) - Name of existing route to modify
- `...middleware` (Function[]) - Middleware functions to prepend

**Throws:**
- Error if name is not a string
- Error if middleware contains non-function items
- Error if route does not exist

### append

**Signature:** `append(name, ...middleware) : void`

**Description:** Adds middleware functions to the end of an existing route's middleware chain, enabling route extension and additional processing.

**Parameters:**
- `name` (String) - Name of existing route to modify
- `...middleware` (Function[]) - Middleware functions to append

**Throws:**
- Error if name is not a string
- Error if middleware contains non-function items
- Error if route does not exist

### replace

**Signature:** `replace(name, ...middleware) : void`

**Description:** Completely replaces an existing route with a new middleware chain, maintaining the same route name but changing implementation.

**Parameters:**
- `name` (String) - Name of existing route to replace
- `...middleware` (Function[]) - New middleware functions for the route

**Throws:**
- Error if name is not a string
- Error if middleware contains non-function items
- Error if route does not exist

### getRoute

**Signature:** `getRoute(name) : Route`

**Description:** Retrieves a specific route object by name for inspection or direct manipulation.

**Parameters:**
- `name` (String) - Name of the route to retrieve

**Returns:**
Route object if found, undefined otherwise.

## Route Lifecycle Management

### Route Creation Process

1. **Parameter Validation**: Validates route name and middleware chain
2. **Request/Response Creation**: Creates SFRA Request and Response objects from globals
3. **Route Object Creation**: Instantiates Route with name, middleware, request, and response
4. **Event Handler Registration**: Sets up `route:Complete` event handler
5. **Route Registration**: Stores route in internal registry
6. **Hook Integration**: Calls `app.server.registerRoute` hook if available

### Route Completion Handling

**Cache Management:**
- Applies cache expiration when `res.cachePeriod` is set
- Supports minutes or hours as cache period units (defaults to hours)
- Sets HTTP expires header on the response

**Personalization:**
- Sets `price_promotion` vary-by header when `res.personalized` is true
- Enables proper caching behavior for personalized content

**Redirect Processing:**
- Handles redirect URLs with optional status codes
- Emits `route:Redirect` event before redirecting
- Supports both default and custom redirect status codes

**Rendering Pipeline:**
- Applies all accumulated renderings through the render system
- Processes ISML templates, JSON responses, XML output, and Page Designer pages

## Integration Points

### Global Object Integration

**Request Object Creation:**
```javascript
var rq = new Request(
    typeof request !== 'undefined' ? request : {},
    typeof customer !== 'undefined' ? customer : {},
    typeof session !== 'undefined' ? session : {}
);
```

**Response Object Creation:**
```javascript
var rs = new Response(typeof response !== 'undefined' ? response : {});
```

### Hook System Integration

The server integrates with SFCC's hook system through the `app.server.registerRoute` hook, allowing:
- Custom route event handlers
- Route-specific processing extensions
- Integration with custom middleware systems

### Middleware Architecture

**Middleware Function Signature:**
```javascript
function middleware(req, res, next) {
    // Middleware logic
    next(); // Continue to next middleware
}
```

**Middleware Chain Execution:**
- Sequential execution of middleware functions
- Support for asynchronous operations through next() callbacks
- Automatic error handling and route completion

## Usage Examples

### Basic Route Creation
```javascript
server.use('HomePage', function(req, res, next) {
    res.render('home/homepage', { title: 'Welcome' });
    next();
});
```

### HTTP Method-Specific Routes
```javascript
server.get('ProductShow', middleware.cache, function(req, res, next) {
    // GET-only route with caching
    next();
});

server.post('CartAdd', middleware.csrf, function(req, res, next) {
    // POST-only route with CSRF protection
    next();
});
```

### Route Modification
```javascript
// Add authentication to existing route
server.prepend('Account-Show', middleware.auth);

// Add logging to existing route
server.append('Checkout-Begin', middleware.logging);

// Replace route implementation
server.replace('Search-Show', newSearchMiddleware);
```

### Server Extension
```javascript
// Export routes from one server
var exportedRoutes = server.exports();

// Extend another server
var newServer = new Server();
newServer.extend(exportedRoutes);
```

## Error Handling

### Parameter Validation Errors

- **Invalid Route Name**: Throws error if first parameter is not a string
- **Invalid Middleware**: Throws error if middleware chain contains non-functions
- **Duplicate Route**: Throws error if route name already exists

### Extension Errors

- **Invalid Server Object**: Throws error for objects missing `__routes` property
- **Empty Server**: Throws error when extending with server that has no routes

### Route Modification Errors

- **Non-Existent Route**: Throws error when trying to modify routes that don't exist
- **Invalid Parameters**: Validates parameters before attempting modifications

## Property Details

### routes

**Type:** Object

**Description:** Internal registry storing all route definitions indexed by route name. Each entry contains a Route object with the complete middleware chain and configuration.

**Structure:**
```javascript
{
  "routeName": Route, // Route object instance
  "anotherRoute": Route
}
```

This registry enables route lookup, modification, and export functionality while maintaining the complete route configuration and state.

---
