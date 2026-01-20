---
name: sfcc-scapi-hooks
description: Guide for implementing SCAPI hooks in Salesforce B2C Commerce. Use this when asked to create SCAPI hooks, extend Shopper API endpoints, validate API requests, or modify API responses for headless commerce.
---

# Quick Guide: Salesforce B2C Commerce SCAPI Hooks

This guide provides essential best practices and code examples for implementing Salesforce Commerce API (SCAPI) hooks. It is designed to be a quick reference for development with AI code assistants.

**IMPORTANT**: Before implementing SCAPI hooks, consult the **Performance and Stability Best Practices** guide. Review the index-friendly APIs section and job development standards to ensure your hooks follow SFCC performance requirements and avoid database-intensive operations.

## 1. Core Concepts

SCAPI hooks are server-side scripts that intercept SCAPI requests to add custom logic. They are used to augment, validate, or modify the behavior of existing API endpoints. For creating entirely new endpoints, use Custom APIs.

### Hook Types & Execution Order

For any state-changing request (POST, PATCH, PUT, DELETE), hooks execute in a specific order:

- **`before<HTTP_Method>`**: Executes before core logic. Ideal for validation, preprocessing, and authorization.
- **`after<HTTP_Method>`**: Executes after core logic succeeds and the database transaction is committed. Use for business logic side effects, like calling an external system or triggering recalculations.
- **`modify<HTTP_Method>Response`**: Executes last, after the default JSON response is generated. Use only to format the final JSON payload sent to the client.

### Transactional Integrity

A hook's ability to modify data depends on its transactional context.

| Hook Type | Transactional? | Can Modify Persistent Data? | Primary Purpose |
|-----------|---------------|----------------------------|-----------------|
| `before<HTTP_Method>` | Yes | Yes | Validation & Preprocessing |
| `after<HTTP_Method>` | Yes | Yes | Business Logic & Side Effects |
| `modifyResponse` | No | No | Formatting the JSON Response |

> **Note**: Attempting to modify persistent data (e.g., `basket.setCustomerEmail()`) in a `modifyResponse` hook will throw an ORM TransactionException.

## 2. Registration

Hooks must be enabled in Business Manager (Administration > Global Preferences > Feature Switches) and registered in a custom cartridge via two files.

### `package.json` (Cartridge Root)

This file points to your hooks configuration.

```json
{
  "name": "int_scapi_hooks_extension",
  "hooks": "./cartridge/scripts/hooks.json"
}
```

### `hooks.json` (e.g., `/cartridge/scripts/hooks.json`)

This file maps the hook extension point name to your script file.

```json
{
  "hooks": [
    {
      "name": "dw.ocapi.shop.basket.items.beforePOST",
      "script": "./hooks/basket/validateItems.js"
    },
    {
      "name": "dw.ocapi.shop.customer.modifyGETResponse",
      "script": "./hooks/customer/enrichResponse.js"
    },
    {
      "name": "dw.ocapi.shop.order.afterPOST",
      "script": "./hooks/order/notifyOms.js"
    }
  ]
}
```
### Recommended Cartridge Structure

Organize hook scripts by the resource they modify for better maintainability.

```
my_cartridge/
├── package.json
└── cartridge/
  └── scripts/
    ├── hooks.json
    └── hooks/
      ├── basket/
      │   └── validateItems.js
      ├── customer/
      │   └── enrichResponse.js
      └── order/
        └── notifyOms.js
```

## 3. Core Implementation Patterns

### Script Structure (CommonJS)

Hook scripts are CommonJS modules. The exported function name must match the hook's method name (e.g., `afterPOST`).

```javascript
'use strict';
var Status = require('dw/system/Status');

/**
 * @param {dw.order.Order} order - The newly created order object.
 * @returns {dw.system.Status | void}
 */
exports.afterPOST = function (order) {
    // Custom logic here
    return; // Return void for success to allow hook chain to continue
};
```

### Signaling Success vs. Failure (`dw.system.Status`)

Use the Status object to control the execution flow.

**Controlled Failure**: Halts execution and rolls back the transaction. Returns an HTTP 400 error with a fault document.

```javascript
return new Status(Status.ERROR, 'YOUR_ERROR_CODE', 'A descriptive error message.');
```

**Success (Allow Chain to Continue)**: For Shopper APIs, returning void is the best practice. It allows other hooks in the cartridge path to run.

```javascript
return;
```

**Success (Terminate Chain)**: Returning `Status.OK` signals success but stops any subsequent hooks for the same extension point from running.

```javascript
return new Status(Status.OK);

### Passing Data Between Hooks

If you need to compute something in `after*` and output it in `modify*Response`, use `request.custom` within the same request.

```javascript
exports.afterPOST = function (basket, doc) {
  request.custom.myComputedValue = 'abc';
  return new Status(Status.OK);
};

exports.modifyPOSTResponse = function (basket, responseDoc, doc) {
  responseDoc.c_myComputedValue = request.custom.myComputedValue;
  return new Status(Status.OK);
};
```

### Detecting SCAPI vs OCAPI

SCAPI and OCAPI share many hook extension points. When behavior must diverge, branch on `request.isSCAPI()`.
```

## 4. Code Examples

### Example 1: Custom Validation (beforePOST)

Reject adding a restricted product to the cart for non-wholesale customers.

**Hook**: `dw.ocapi.shop.basket.items.beforePOST`

```javascript
'use strict';
var Status = require('dw/system/Status');
var ProductMgr = require('dw/catalog/ProductMgr');

exports.beforePOST = function (basket, items) {
    var customer = basket.customer;
    var isWholesaleCustomer = customer ? customer.isMemberOfCustomerGroup('Wholesale') : false;

    for (var i = 0; i < items.length; i++) {
        var product = ProductMgr.getProduct(items[i].product_id);
        if (product && product.custom.isRestricted && !isWholesaleCustomer) {
            var errorMessage = 'Product ' + product.ID + ' is restricted.';
            return new Status(Status.ERROR, 'ITEM_RESTRICTION', errorMessage);
        }
    }
    return; // Success
};
```

### Example 2: Enriching a Response (modifyGETResponse)

Add a calculated `c_loyaltyTier` attribute to the customer GET response.

**Hook**: `dw.ocapi.shop.customer.modifyGETResponse`

```javascript
'use strict';
var Status = require('dw/system/Status');

exports.modifyGETResponse = function (customer, customerResponse) {
    var loyaltyTier = 'Standard';
    if (customer.isMemberOfCustomerGroup('GoldMembers')) {
        loyaltyTier = 'Gold';
    }
    // Add a non-persistent attribute to the JSON response
    customerResponse.c_loyaltyTier = loyaltyTier;
    return new Status(Status.OK);
};
```

### Example 3: External Integration (afterPOST)

Notify an external Order Management System (OMS) after an order is created. The integration is wrapped in a try/catch to prevent an OMS failure from affecting the order creation status.

**Hook**: `dw.ocapi.shop.order.afterPOST`

```javascript
'use strict';
var Status = require('dw/system/Status');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Logger = require('dw/system/Logger').getLogger('OmsIntegration');

exports.afterPOST = function (order) {
    try {
        var omsService = LocalServiceRegistry.createService('oms.http.service', { /*... service config... */ });
        var payload = { orderNo: order.getOrderNo(), total: order.getTotalGrossPrice().getValue() };
        var result = omsService.call({ payload: payload });

        if (!result.isOk()) {
            // Log the error for monitoring, but do NOT return Status.ERROR.
            // The order is already created; returning an error here would be misleading.
            Logger.error('Failed to notify OMS for order {0}. Error: {1}', order.getOrderNo(), result.getErrorMessage());
        }
    } catch (e) {
        Logger.error('Exception notifying OMS for order {0}. Exception: {1}', order.getOrderNo(), e.toString());
    }
    // Always return OK because the primary operation (order creation) was successful.
    return new Status(Status.OK);
};
```

## 5. Key Best Practices Checklist

### Performance

- [ ] **DON'T** perform expensive API lookups inside a hook (e.g., `ProductMgr.getProduct()`).
- [ ] **DO** be aware of caching. Hooks on cacheable GET endpoints only run on a cache miss.
- [ ] **DO** use the Service Framework with aggressive timeouts and circuit breaker settings for all external calls.
- [ ] **DO** use the Code Profiler to measure script performance before deploying to production.

### Security

- [ ] **DO** treat all client input as untrusted. Sanitize and validate data in before hooks.
- [ ] **DO** re-authorize resource ownership. For example, in a basket hook, verify `basket.customer.ID` matches the logged-in shopper's ID.
- [ ] **DON'T** use hooks to bypass the platform's built-in security model or authentication.

### Error Handling & Resilience

- [ ] **DO** wrap all hook logic in `try/catch` blocks to prevent unhandled exceptions.
- [ ] **DO** use `dw.system.Logger` with custom categories and include the `request.requestID` for easy tracing in logs.
- [ ] **BE AWARE** of the Hook Circuit Breaker. If a hook fails more than 50% of the time in its last 100 executions, it will be temporarily disabled (returning HTTP 503) to protect system stability.

## 6. Comprehensive Hook Reference

This section provides a reference list of the available hook extension points for the SCAPI Shopper APIs, organized by resource.

### Shopper Baskets API Hooks

| API Endpoint (Method & Path) | Hook Extension Point | Function Signature |
|------------------------------|---------------------|-------------------|
| `POST /baskets` | `dw.ocapi.shop.basket.beforePOST_v2` | `beforePOST_v2(basketRequest : Basket) : dw.system.Status` |
| `POST /baskets` | `dw.ocapi.shop.basket.afterPOST` | `afterPOST(basket : dw.order.Basket) : dw.system.Status` |
| `POST /baskets` | `dw.ocapi.shop.basket.modifyPOSTResponse` | `modifyPOSTResponse(basket : dw.order.Basket, basketResponse : Basket) : dw.system.Status` |
| `GET /baskets/{basket_id}` | `dw.ocapi.shop.basket.beforeGET` | `beforeGET(basketId : String) : dw.system.Status` |
| `GET /baskets/{basket_id}` | `dw.ocapi.shop.basket.modifyGETResponse` | `modifyGETResponse(basket : dw.order.Basket, basketResponse : Basket) : dw.system.Status` |
| `PATCH /baskets/{basket_id}` | `dw.ocapi.shop.basket.beforePATCH` | `beforePATCH(basket : dw.order.Basket, basketInput : Basket) : dw.system.Status` |
| `PATCH /baskets/{basket_id}` | `dw.ocapi.shop.basket.afterPATCH` | `afterPATCH(basket : dw.order.Basket, basketInput : Basket) : dw.system.Status` |
| `PATCH /baskets/{basket_id}` | `dw.ocapi.shop.basket.modifyPATCHResponse` | `modifyPATCHResponse(basket : dw.order.Basket, basketResponse : Basket) : dw.system.Status` |
| `DELETE /baskets/{basket_id}` | `dw.ocapi.shop.basket.beforeDELETE` | `beforeDELETE(basket : dw.order.Basket) : dw.system.Status` |
| `DELETE /baskets/{basket_id}` | `dw.ocapi.shop.basket.afterDELETE` | `afterDELETE(basketId : String) : dw.system.Status` |
| `POST /baskets/{basket_id}/items` | `dw.ocapi.shop.basket.items.beforePOST` | `beforePOST(basket : dw.order.Basket, items : ProductItem) : dw.system.Status` |
| `POST /baskets/{basket_id}/items` | `dw.ocapi.shop.basket.items.afterPOST` | `afterPOST(basket : dw.order.Basket, items : ProductItem) : dw.system.Status` |
| `POST /baskets/{basket_id}/items` | `dw.ocapi.shop.basket.items.modifyPOSTResponse` | `modifyPOSTResponse(basket : dw.order.Basket, basketResponse : Basket, productItems : ProductItem) : dw.system.Status` |
| `POST /baskets/{basket_id}/coupons` | `dw.ocapi.shop.basket.coupon.beforePOST` | `beforePOST(basket : dw.order.Basket, couponItem : CouponItem) : dw.system.Status` |
| `POST /baskets/{basket_id}/coupons` | `dw.ocapi.shop.basket.coupon.afterPOST` | `afterPOST(basket : dw.order.Basket, couponItem : CouponItem) : dw.system.Status` |
| `POST /baskets/{basket_id}/coupons` | `dw.ocapi.shop.basket.coupon.modifyPOSTResponse` | `modifyPOSTResponse(basket : dw.order.Basket, basketResponse : Basket, couponRequest : CouponItem) : dw.system.Status` |
| `POST /baskets/{basket_id}/payment_instruments` | `dw.ocapi.shop.basket.payment_instrument.beforePOST` | `beforePOST(basket : dw.order.Basket, paymentInstrument : BasketPaymentInstrumentRequest) : dw.system.Status` |
| `POST /baskets/{basket_id}/payment_instruments` | `dw.ocapi.shop.basket.payment_instrument.afterPOST` | `afterPOST(basket : dw.order.Basket, paymentInstrument : BasketPaymentInstrumentRequest) : dw.system.Status` |
| `POST /baskets/{basket_id}/payment_instruments` | `dw.ocapi.shop.basket.payment_instrument.modifyPOSTResponse` | `modifyPOSTResponse(basket : dw.order.Basket, basketResponse : Basket, paymentInstrumentRequest : BasketPaymentInstrumentRequest) : dw.system.Status` |
| Various | `dw.ocapi.shop.basket.validateBasket` | `validateBasket(basketResponse : Basket, duringSubmit : Boolean) : dw.system.Status` |

### Shopper Customers API Hooks

| API Endpoint (Method & Path) | Hook Extension Point | Function Signature |
|------------------------------|---------------------|-------------------|
| `POST /customers` | `dw.ocapi.shop.customer.beforePOST` | `beforePOST(registration : CustomerRegistration) : dw.system.Status` |
| `POST /customers` | `dw.ocapi.shop.customer.afterPOST` | `afterPOST(customer : dw.customer.Customer, registration : CustomerRegistration) : dw.system.Status` |
| `POST /customers` | `dw.ocapi.shop.customer.modifyPOSTResponse` | `modifyPOSTResponse(customer : dw.customer.Customer, customerResponse : Customer) : dw.system.Status` |
| `GET /customers/{customer_id}` | `dw.ocapi.shop.customer.beforeGET` | `beforeGET(customerId : String) : dw.system.Status` |
| `GET /customers/{customer_id}` | `dw.ocapi.shop.customer.modifyGETResponse` | `modifyGETResponse(customer : dw.customer.Customer, customerResponse : Customer) : dw.system.Status` |
| `PATCH /customers/{customer_id}` | `dw.ocapi.shop.customer.beforePATCH` | `beforePATCH(customer : dw.customer.Customer, customerInput : Customer) : dw.system.Status` |
| `PATCH /customers/{customer_id}` | `dw.ocapi.shop.customer.afterPATCH` | `afterPATCH(customer : dw.customer.Customer, customerInput : Customer) : dw.system.Status` |
| `PATCH /customers/{customer_id}` | `dw.ocapi.shop.customer.modifyPATCHResponse` | `modifyPATCHResponse(customer : dw.customer.Customer, customerResponse : Customer) : dw.system.Status` |
| `POST /customers/auth` | `dw.ocapi.shop.auth.beforePOST` | `beforePOST(authorizationHeader : String, authRequestType : dw.value.EnumValue) : dw.system.Status` |
| `POST /customers/auth` | `dw.ocapi.shop.auth.afterPOST` | `afterPOST(customer : dw.customer.Customer, authRequestType : dw.value.EnumValue) : dw.system.Status` |
| `POST /customers/auth` | `dw.ocapi.shop.auth.modifyPOSTResponse` | `modifyPOSTResponse(customer : dw.customer.Customer, customerResponse : Customer, authRequestType : dw.value.EnumValue) : dw.system.Status` |
| `PATCH /customers/{customer_id}/addresses/{address_name}` | `dw.ocapi.shop.customer.address.beforePATCH` | `beforePATCH(customer : dw.customer.Customer, addressName : String, customerAddress : CustomerAddress) : dw.system.Status` |
| `PATCH /customers/{customer_id}/addresses/{address_name}` | `dw.ocapi.shop.customer.address.afterPATCH` | `afterPATCH(customer : dw.customer.Customer, addressName : String, customerAddress : CustomerAddress) : dw.system.Status` |

### Shopper Orders API Hooks

| API Endpoint (Method & Path) | Hook Extension Point | Function Signature |
|------------------------------|---------------------|-------------------|
| `POST /orders` | `dw.ocapi.shop.order.beforePOST` | `beforePOST(basket : dw.order.Basket) : dw.system.Status` |
| `POST /orders` | `dw.ocapi.shop.order.afterPOST` | `afterPOST(order : dw.order.Order) : dw.system.Status` |
| `POST /orders` | `dw.ocapi.shop.order.modifyPOSTResponse` | `modifyPOSTResponse(order : dw.order.Order, orderResponse : Order) : dw.system.Status` |
| `GET /orders/{order_no}` | `dw.ocapi.shop.order.beforeGET` | `beforeGET(orderNo : String) : dw.system.Status` |
| `GET /orders/{order_no}` | `dw.ocapi.shop.order.modifyGETResponse` | `modifyGETResponse(order : dw.order.Order, orderResponse : Order) : dw.system.Status` |
| `PATCH /orders/{order_no}` | `dw.ocapi.shop.order.beforePATCH` | `beforePATCH(order : dw.order.Order, orderInput : Order) : dw.system.Status` |
| `PATCH /orders/{order_no}` | `dw.ocapi.shop.order.afterPATCH` | `afterPATCH(order : dw.order.Order, orderInput : Order) : dw.system.Status` |
| `PATCH /orders/{order_no}` | `dw.ocapi.shop.order.modifyPATCHResponse` | `modifyPATCHResponse(order : dw.order.Order, orderResponse : Order) : dw.system.Status` |

### Other Key Shopper API Hooks

| API Endpoint (Method & Path) | Hook Extension Point | Function Signature |
|------------------------------|---------------------|-------------------|
| `GET /products/{id}` | `dw.ocapi.shop.product.beforeGET` | `beforeGET(productId : String) : dw.system.Status` |
| `GET /products/{id}` | `dw.ocapi.shop.product.modifyGETResponse` | `modifyGETResponse(scriptProduct : dw.catalog.Product, doc : Product) : dw.system.Status` |
| `GET /product_search` | `dw.ocapi.shop.product_search.beforeGET` | `beforeGET() : dw.system.Status` |
| `GET /product_search` | `dw.ocapi.shop.product_search.modifyGETResponse` | `modifyGETResponse(doc : ProductSearchResult) : dw.system.Status` |
| `GET /categories/{id}` | `dw.ocapi.shop.category.beforeGET` | `beforeGET(categoryId : String) : dw.system.Status` |
| `GET /categories/{id}` | `dw.ocapi.shop.category.modifyGETResponse` | `modifyGETResponse(scriptCategory : dw.catalog.Category, doc : Category) : dw.system.Status` |

## Troubleshooting Hook Registration

**If SCAPI hooks are not executing after deployment:**

1. **Verify Feature Switches**: Ensure hooks are enabled in Business Manager (Administration > Global Preferences > Feature Switches)
2. **Check Code Version**: If hooks still don't execute:
   - **Check Available Versions**: Use MCP `get_code_versions` tool to see all code versions on the instance
   - **Activate Different Version**: Use MCP `activate_code_version` tool to switch code versions
   - **Alternative Manual Method**: Switch code versions in Business Manager (Administration > Site Development > Code Deployment > Activate)
3. **Verify Hook Registration**: Check logs for hook registration confirmations after version activation
4. **Test Hook Execution**: Make API calls to endpoints that should trigger your hooks and verify they execute

**Common Hook Issues:**
- Hooks not triggering → Check feature switches and code version activation
- Hook scripts not found → Verify file paths match registration in hooks.json
- Runtime errors in hooks → Check logs for specific error messages during hook execution
