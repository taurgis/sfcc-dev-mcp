---
name: sfcc-script-evaluation
description: Guide for using the evaluate_script tool to execute JavaScript on SFCC instances via the script debugger
---

# SFCC Script Evaluation Skill

This skill documents how to use the `evaluate_script` tool effectively for executing JavaScript code on an SFCC instance via the script debugger.

## Overview

The `evaluate_script` tool allows you to execute arbitrary JavaScript code on an SFCC sandbox instance. It works by:

1. Creating a debugger session
2. Setting a breakpoint on a controller
3. Triggering the controller via HTTP
4. Evaluating your expression in the halted context
5. Returning the result and cleaning up

## Required Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `script` | Yes | - | The JavaScript code to execute |
| `siteId` | No | `RefArch` | The site ID (accepts either `RefArch` or `Sites-RefArch-Site`) |
| `locale` | No | `default` | Storefront locale segment used when triggering the controller (tries without locale first, then retries with `/{locale}` if needed) |
| `timeout` | No | `30000` | Maximum execution time in milliseconds |
| `breakpointFile` | No | Auto-detected | Custom controller path for breakpoint |
| `breakpointLine` | No | `1,10,20,30,40,50` | Specific line for a single breakpoint; if omitted, strategic lines (1,10,20,30,40,50) are used |

## Script Syntax Rules

### ✅ DO: Use expressions that return a value

The last expression in your script is returned as the result.

```javascript
// Simple expressions
1 + 1
// Result: 2

dw.system.Site.current.ID
// Result: "RefArchGlobal"
```

### ❌ DON'T: Use `return` at the top level

```javascript
// WRONG - causes compilation error
return 1 + 1

// Error: "invalid return"
```

### ❌ DON'T: Use `var` assignments expecting the variable

```javascript
// WRONG - var declarations return null in debugger context
var result = {}; result.foo = 'bar';

// Error: Cannot set property "foo" of null
```

### ✅ DO: Use inline object literals with JSON.stringify

```javascript
// CORRECT - inline object literal wrapped in JSON.stringify
JSON.stringify({siteId: dw.system.Site.current.ID, locale: request.locale})
// Result: {"siteId":"RefArchGlobal","locale":"en_GB"}
```

### ✅ DO: Use IIFEs (Immediately Invoked Function Expressions) for complex logic

```javascript
// CORRECT - IIFE pattern for multi-step logic
(function() {
  var p = dw.catalog.ProductMgr.getProduct('25518704M');
  return JSON.stringify({id: p.ID, name: p.name, online: p.online});
})()
// Result: {"id":"25518704M","name":"Pull On Pant","online":true}
```

### ❌ DON'T: Use `require()` statements

```javascript
// WRONG - require() returns null in debugger context
var CustomerMgr = require('dw/customer/CustomerMgr');
CustomerMgr.getSiteCustomerList()

// Error: Cannot call method "getSiteCustomerList" of null
```

### ✅ DO: Use global `dw.*` namespace directly

```javascript
// CORRECT - access SFCC APIs via global dw namespace
dw.customer.CustomerMgr.getSiteCustomerList().ID
// Result: "RefArch"
```

## Accessing SFCC Objects

### Site Information

```javascript
// Current site ID
dw.system.Site.current.ID

// All sites
(function() {
  var sites = dw.system.Site.getAllSites();
  var result = [];
  for (var i = 0; i < sites.size(); i++) {
    result.push(sites[i].ID);
  }
  return JSON.stringify(result);
})()

// Site preferences (list all custom preference keys)
JSON.stringify(Object.keys(dw.system.Site.current.preferences.custom))

// Get specific site preference value
dw.system.Site.current.preferences.custom.myPreferenceName
```

### Products

```javascript
// Get product by ID
dw.catalog.ProductMgr.getProduct('productId')

// Get product details
(function() {
  var p = dw.catalog.ProductMgr.getProduct('25518704M');
  if (!p) return 'Product not found';
  return JSON.stringify({
    id: p.ID,
    name: p.name,
    online: p.online,
    brand: p.brand
  });
})()

// Product custom attributes
(function() {
  var p = dw.catalog.ProductMgr.getProduct('25518704M');
  return JSON.stringify(Object.keys(p.custom));
})()
```

### Customers

```javascript
// Site customer list
dw.customer.CustomerMgr.getSiteCustomerList().ID

// Get customer by ID (requires customer number)
dw.customer.CustomerMgr.getCustomerByCustomerNumber('00001234')
```

### Orders

```javascript
// Search orders (always close the iterator!)
(function() {
  var orders = dw.order.OrderMgr.searchOrders(
    'orderNo != {0}',
    'creationDate desc',
    ''
  );
  var result = [];
  var i = 0;
  while (orders.hasNext() && i < 5) {
    var o = orders.next();
    result.push({
      orderNo: o.orderNo,
      status: o.status.value,
      total: o.totalGrossPrice.value
    });
    i++;
  }
  orders.close(); // IMPORTANT: Always close iterators
  return JSON.stringify(result);
})()
```

### Request/Session Context

```javascript
// Current request locale
request.locale
// Result: "en_GB"

// Session ID
session.sessionID

// Current customer (if logged in)
session.customer
```

## Working with Collections

SFCC collections need special handling - they're not JavaScript arrays.

### Iterating Collections

```javascript
// Using size() and index access
(function() {
  var sites = dw.system.Site.getAllSites();
  var result = [];
  for (var i = 0; i < sites.size(); i++) {
    result.push(sites[i].ID);
  }
  return JSON.stringify(result);
})()

// Using Iterator pattern
(function() {
  var iter = dw.catalog.CatalogMgr.getSiteCatalog().getRoot().getSubCategories();
  var result = [];
  while (iter.hasNext()) {
    var cat = iter.next();
    result.push({id: cat.ID, name: cat.displayName});
  }
  return JSON.stringify(result);
})()
```

### Array Operations

```javascript
// Arrays work normally, use JSON.stringify for readable output
JSON.stringify([1, 2, 3].map(function(x) { return x * 2; }))
// Result: [2,4,6]

// Arrow functions are supported
JSON.stringify([1, 2, 3].map(x => x * 2))
// Result: [2,4,6]
```

## Return Value Formatting

### Primitives

```javascript
// Strings, numbers, booleans return directly
'hello'
// Result: "hello"

42
// Result: 42

true
// Result: true
```

### Objects

```javascript
// Raw objects return [object Object]
({foo: 'bar'})
// Result: [object Object]

// Use JSON.stringify for readable output
JSON.stringify({foo: 'bar'})
// Result: {"foo":"bar"}
```

### SFCC Objects

```javascript
// SFCC objects return their string representation
dw.catalog.ProductMgr.getProduct('25518704M')
// Result: [Product sku=25518704M]

// Access properties directly or use JSON.stringify
dw.catalog.ProductMgr.getProduct('25518704M').name
// Result: "Pull On Pant"
```

## Error Handling

### Check for null values

```javascript
// WRONG - throws error if product doesn't exist
dw.catalog.ProductMgr.getProduct('invalid').name
// Error: Cannot read property "name" from null

// CORRECT - check for null
(function() {
  var p = dw.catalog.ProductMgr.getProduct('invalid');
  return p ? p.name : 'Product not found';
})()
// Result: "Product not found"
```

### Wrap complex logic in try-catch

```javascript
(function() {
  try {
    var p = dw.catalog.ProductMgr.getProduct('25518704M');
    return JSON.stringify({id: p.ID, name: p.name});
  } catch (e) {
    return 'Error: ' + e.message;
  }
})()
```

## Best Practices Summary

1. **Never use `return` at top level** - use expression evaluation instead
2. **Never use `require()`** - use global `dw.*` namespace
3. **Wrap complex logic in IIFEs** for variable declarations
4. **Use `JSON.stringify()`** for object/array output
5. **Close iterators** after use (OrderMgr.searchOrders, etc.)
6. **Check for null** before accessing properties
7. **Verify API usage** with `get_sfcc_class_info` tool before calling unknown methods

## Common Patterns

### Quick Value Check

```javascript
dw.system.Site.current.ID
```

### Multi-Value Query

```javascript
JSON.stringify({
  siteId: dw.system.Site.current.ID,
  locale: request.locale,
  customerList: dw.customer.CustomerMgr.getSiteCustomerList().ID
})
```

### Complex Data Retrieval

```javascript
(function() {
  // Your multi-step logic here
  var result = [];
  // ... build result ...
  return JSON.stringify(result);
})()
```

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `invalid return` | Using `return` at top level | Remove `return`, use expression or IIFE |
| `Cannot call method of null` | Using `require()` | Use `dw.*` global namespace |
| `Cannot set property of null` | `var x = {}` returns null | Use IIFE or inline object literal |
| `Timeout waiting for breakpoint` | Wrong siteId or instance unreachable | Verify siteId, check instance connectivity |
| `Unexpected token '<'` | Auth/connectivity issue | Check dw.json credentials, verify instance is accessible |
| `Unauthorized` / `401` | Username case mismatch | **Username is case-sensitive** - match exactly from BM user |
| `No compatible storefront cartridge` | Missing SFRA or SiteGenesis | Deploy app_storefront_base or specify custom breakpoint |

## Pre-Flight Checklist

Before using `evaluate_script`:

1. ✅ Valid credentials in dw.json configuration
2. ✅ **Username matches BM user exactly (case-sensitive!)**
3. ✅ Sandbox instance is accessible
4. ✅ Storefront cartridge deployed (app_storefront_base or app_storefront_controllers)
5. ✅ Script uses `dw.*` namespace, not `require()`
6. ✅ Complex logic wrapped in IIFE
7. ✅ Objects/arrays wrapped in `JSON.stringify()`

## Requirements

- SFCC sandbox instance
- Either `app_storefront_base` (SFRA) or `app_storefront_controllers` (SiteGenesis) deployed
- Valid credentials in dw.json configuration
- **Important:** Username in dw.json must match BM user exactly (case-sensitive)
