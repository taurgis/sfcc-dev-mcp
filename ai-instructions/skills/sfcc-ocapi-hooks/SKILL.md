---
name: sfcc-ocapi-hooks
description: Guide for implementing OCAPI hooks in Salesforce B2C Commerce. Use this when asked to create OCAPI hooks, extend API endpoints, validate API requests, or modify API responses.
---

# Quick Guide: Salesforce B2C Commerce OCAPI Hooks

This guide provides best practices and examples for implementing OCAPI hooks in Salesforce B2C Commerce Cloud.

**IMPORTANT**: Before implementing OCAPI hooks, consult the **Performance and Stability Best Practices** guide. Pay special attention to the OCAPI-specific performance requirements and hook development guidelines to ensure optimal performance and avoid database-intensive operations.

## 1. Core Concepts

OCAPI hooks are server-side extension points that allow you to inject custom B2C Commerce Script logic into the lifecycle of an OCAPI request. They are used to augment, validate, or modify the behavior of existing API endpoints.

### Hook Types & Execution Order

There are three main hook types, executed in a specific order for state-changing requests (POST, PATCH, etc.):

#### `before<HTTP_Method>`
Executes before core platform logic.

- **Use Case**: Input validation, data preprocessing, custom authorization checks.
- **Context**: Runs within the database transaction. Can modify the incoming request document.

#### `after<HTTP_Method>`
Executes after core platform logic succeeds but before the response is generated.

- **Use Case**: Business logic side effects, such as calling an external ERP/OMS, triggering basket recalculation, or saving data to custom objects.
- **Context**: Runs within the same database transaction. Operates on persistent Script API objects (e.g., `dw.order.Basket`).

#### `modify<HTTP_Method>Response`
Executes last, after the platform generates the JSON response.

- **Use Case**: Final formatting of the JSON response. Add, remove, or reformat attributes (especially `c_` custom attributes) before sending to the client.
- **Context**: NOT transactional. Attempting to modify persistent data (e.g., `basket.setCustomerEmail()`) will throw an `ORMTransactionException`.

| Hook Type | Transactional? | Can Modify Persistent Data? | Primary Purpose |
|-----------|---------------|----------------------------|-----------------|
| before | Yes | Yes | Validation & Preprocessing |
| after | Yes | Yes | Business Logic & Side Effects |
| modifyResponse | No | No | Formatting the JSON Response |

## 2. Registration

Hooks are registered in a custom cartridge via two files.

### `package.json` (Cartridge Root)

This file points to your hooks configuration file.

```json
{
  "name": "my-hooks-cartridge",
  "hooks": "./cartridge/scripts/hooks.json"
}
```

### `hooks.json` (e.g., `/cartridge/scripts/hooks.json`)

This file maps the official hook extension point name to your script file.

```json
{
  "hooks": [
    {
      "name": "dw.ocapi.shop.customer.address.beforePATCH",
      "script": "./hooks/customer/addressValidation.js"
    },
    {
      "name": "dw.ocapi.shop.customer.modifyGETResponse",
      "script": "./hooks/customer/enrichCustomerResponse.js"
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
      ├── customer/
      │   ├── addressValidation.js
      │   └── enrichCustomerResponse.js
      └── order/
        └── notifyOms.js
```

### Feature Switch (Required)

OCAPI/SCAPI hook execution must be enabled in Business Manager:
`Administration > Global Preferences > Feature Switches > Enable Salesforce Commerce Cloud API hook execution`.

## 3. Core Implementation Patterns

### Script Structure (CommonJS)

Hook scripts are CommonJS modules. The function name must be exported and match the hook's method name (e.g., `afterPOST`).

```javascript
'use strict';
var Status = require('dw/system/Status');

/**
 * @param {dw.customer.Customer} customer - The customer object.
 * @param {Object} customerResponse - The response document to be modified.
 * @returns {dw.system.Status} - A status object.
 */
exports.modifyGETResponse = function (customer, customerResponse) {
    // Your logic here
    return new Status(Status.OK);
};
```

### Signaling Success vs. Failure (`dw.system.Status`)

Use the Status object to control the execution flow.

- **Success**: `return new Status(Status.OK);` or `return void` (for Shop API hooks, void is often preferred to allow other hooks in the cartridge path to run).
- **Controlled Failure**: `return new Status(Status.ERROR, 'ERROR_CODE', 'Descriptive message.');` This halts execution, rolls back the transaction, and returns an HTTP 400 error with a fault document containing your code and message.

### Passing Data Between Hooks

When you need to compute data in an `after*` hook and emit it in `modify*Response`, pass it through `request.custom` for the duration of the request.

```javascript
// afterPOST
exports.afterPOST = function (basket, doc) {
  request.custom.externalResult = { status: 'ok' };
  return new Status(Status.OK);
};

// modifyPOSTResponse
exports.modifyPOSTResponse = function (basket, responseDoc, doc) {
  responseDoc.c_externalStatus = request.custom.externalResult && request.custom.externalResult.status;
  return new Status(Status.OK);
};
```

### Reliability Notes

- Keep hooks fast; slow hooks can cause timeouts and degrade API performance.
- Avoid uncaught exceptions; prefer controlled errors (`Status.ERROR`) with stable error codes.

### Data Integrity (`dw.system.Transaction`)

All modifications to persistent data in `before` or `after` hooks must be wrapped in a transaction.

```javascript
var Transaction = require('dw/system/Transaction');

Transaction.wrap(function () {
    customer.getProfile().custom.lastAddressChange = new Date();
});
```

## 4. Code Examples

### Example 1: Custom Validation (before hook)

Reject an address update if the US postal code format is invalid.

**Hook**: `dw.ocapi.shop.customer.address.beforePATCH`  
**Script**: `cartridge/scripts/hooks/customer/addressValidation.js`

```javascript
'use strict';

var Status = require('dw/system/Status');

exports.beforePATCH = function (customer, addressName, customerAddress) {
    var countryCode = customerAddress.country_code;
    var postalCode = customerAddress.postal_code;

    if (countryCode === 'US' && postalCode) {
        var postalCodeRegex = /^\d{5}(-\d{4})?$/;
        if (!postalCodeRegex.test(postalCode)) {
            // Reject the request with a specific error
            return new Status(Status.ERROR, 'INVALID_POSTAL_CODE', 'The postal code format is invalid for the United States.');
        }
    }
    return new Status(Status.OK);
};
```

### Example 2: Enriching a Response (modifyResponse hook)

Add a custom flag `c_isPreferredCustomer` to the customer GET response.

**Hook**: `dw.ocapi.shop.customer.modifyGETResponse`  
**Script**: `cartridge/scripts/hooks/customer/enrichCustomerResponse.js`

```javascript
'use strict';

var Status = require('dw/system/Status');

exports.modifyGETResponse = function (customer, customerResponse) {
    // Logic to determine if the customer is preferred
    var isPreferred = customer.isMemberOfCustomerGroup('Preferred');

    // Add a custom attribute directly to the response document.
    // This does NOT save anything to the database.
    customerResponse.c_isPreferredCustomer = isPreferred;

    return new Status(Status.OK);
};
```

### Example 3: External Service Integration (after hook)

Notify an external Order Management System (OMS) after an order is created.

**Hook**: `dw.ocapi.shop.order.afterPOST`  
**Script**: `cartridge/scripts/hooks/order/notifyOms.js`

```javascript
'use strict';

var Status = require('dw/system/Status');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Logger = require('dw/system/Logger').getLogger('OmsIntegrationHook');

exports.afterPOST = function (order) {
    try {
        var omsService = LocalServiceRegistry.createService('oms.http.service', { /* service config */ });
        var payload = { orderNo: order.getOrderNo(), total: order.getTotalGrossPrice().getValue() };
        var result = omsService.call({ payload: payload });

        if (!result.isOk()) {
            // Log the error for monitoring, but don't return Status.ERROR.
            // The order is already created; returning an error here would be misleading to the client.
            Logger.error('Failed to notify OMS for order {0}. Error: {1}', order.getOrderNo(), result.getErrorMessage());
        }
    } catch (e) {
        Logger.error('Exception notifying OMS for order {0}. Exception: {1}', order.getOrderNo(), e.toString());
    }

    // Always return OK because the primary operation (order creation) was successful.
    return new Status(Status.OK);
};
```

## 5. Key Best Practices

### Performance

- **DON'T** perform expensive database lookups inside a hook (e.g., `ProductMgr.getProduct()`).
- **DO** be aware of caching. Hooks on cacheable GET endpoints only run on a cache miss.
- **DO** keep hook logic simple and efficient.

### Security

- **DO** treat all client input as untrusted. Sanitize and validate data in before hooks.
- **DO** re-authorize sensitive actions within the hook. For example, use `OrderMgr.getOrder(orderNumber, orderToken)` instead of just `OrderMgr.getOrder(orderNumber)`.

### Error Handling & Resilience

- **DO** wrap all hook logic in `try/catch` blocks.
- **DO** use `dw.system.Logger` with custom categories and include the `request.requestID` for easy tracing. See **[sfcc-logging](../sfcc-logging/SKILL.md)** for complete logging patterns.
- **BE AWARE** of the Hook Circuit Breaker. If a hook fails more than 50% of the time in its last 100 executions, it will be disabled for 60 seconds, returning HTTP 503.

### Testing

- **DO** use the `dw-api-mock` library to unit test hook logic locally in a Node.js environment.
- **DO** use API clients like Postman for integration testing on a sandbox.

## 6. Comprehensive Hook Reference

### Shop API Hooks

| API Endpoint (Method & Path) | Available Hook Extension Points |
|------------------------------|----------------------------------|
| **Authentication** |  |
| `POST /customers/auth` | `dw.ocapi.shop.auth.beforePOST`, `dw.ocapi.shop.auth.afterPOST`, `dw.ocapi.shop.auth.modifyPOSTResponse` |
| **Basket** |  |
| `POST /baskets` | `dw.ocapi.shop.basket.beforePOST_v2`, `dw.ocapi.shop.basket.afterPOST`, `dw.ocapi.shop.basket.modifyPOSTResponse`, `dw.ocapi.shop.basket.validateBasket` |
| `GET /baskets/{basket_id}` | `dw.ocapi.shop.basket.beforeGET`, `dw.ocapi.shop.basket.modifyGETResponse`, `dw.ocapi.shop.basket.validateBasket` |
| `PATCH /baskets/{basket_id}` | `dw.ocapi.shop.basket.beforePATCH`, `dw.ocapi.shop.basket.afterPATCH`, `dw.ocapi.shop.basket.modifyPATCHResponse`, `dw.ocapi.shop.basket.validateBasket` |
| `DELETE /baskets/{basket_id}` | `dw.ocapi.shop.basket.beforeDELETE`, `dw.ocapi.shop.basket.afterDELETE` |
| `PUT /baskets/{basket_id}/billing_address` | `dw.ocapi.shop.basket.billing_address.beforePUT`, `dw.ocapi.shop.basket.billing_address.afterPUT`, `dw.ocapi.shop.basket.billing_address.modifyPUTResponse` |
| `POST /baskets/{basket_id}/coupons` | `dw.ocapi.shop.basket.coupon.beforePOST`, `dw.ocapi.shop.basket.coupon.afterPOST`, `dw.ocapi.shop.basket.coupon.modifyPOSTResponse` |
| `DELETE /baskets/{basket_id}/coupons/{coupon_item_id}` | `dw.ocapi.shop.basket.coupon.beforeDELETE`, `dw.ocapi.shop.basket.coupon.afterDELETE`, `dw.ocapi.shop.basket.coupon.modifyDELETEResponse` |
| `POST /baskets/{basket_id}/items` | `dw.ocapi.shop.basket.items.beforePOST`, `dw.ocapi.shop.basket.items.afterPOST`, `dw.ocapi.shop.basket.items.modifyPOSTResponse` |
| `POST /baskets/{basket_id}/payment_instruments` | `dw.ocapi.shop.basket.payment_instrument.beforePOST`, `dw.ocapi.shop.basket.payment_instrument.afterPOST`, `dw.ocapi.shop.basket.payment_instrument.modifyPOSTResponse` |
| **Customer** |  |
| `POST /customers` | `dw.ocapi.shop.customer.beforePOST`, `dw.ocapi.shop.customer.afterPOST`, `dw.ocapi.shop.customer.modifyPOSTResponse` |
| `GET /customers/{customer_id}` | `dw.ocapi.shop.customer.beforeGET`, `dw.ocapi.shop.customer.modifyGETResponse` |
| `PATCH /customers/{customer_id}` | `dw.ocapi.shop.customer.beforePATCH`, `dw.ocapi.shop.customer.afterPATCH`, `dw.ocapi.shop.customer.modifyPATCHResponse` |
| `POST /customers/{customer_id}/addresses` | `dw.ocapi.shop.customer.addresses.beforePOST`, `dw.ocapi.shop.customer.addresses.afterPOST`, `dw.ocapi.shop.customer.address.modifyPOSTResponse` |
| `PATCH /customers/{customer_id}/addresses/{address_name}` | `dw.ocapi.shop.customer.address.beforePATCH`, `dw.ocapi.shop.customer.address.afterPATCH`, `dw.ocapi.shop.customer.address.modifyPATCHResponse` |
| `DELETE /customers/{customer_id}/addresses/{address_name}` | `dw.ocapi.shop.customer.address.beforeDELETE`, `dw.ocapi.shop.customer.address.afterDELETE` |
| **Order** |  |
| `POST /orders` | `dw.ocapi.shop.order.beforePOST`, `dw.ocapi.shop.order.afterPOST`, `dw.ocapi.shop.order.modifyPOSTResponse` |
| `GET /orders/{order_no}` | `dw.ocapi.shop.order.beforeGET`, `dw.ocapi.shop.order.modifyGETResponse` |
| `PATCH /orders/{order_no}` | `dw.ocapi.shop.order.beforePATCH`, `dw.ocapi.shop.order.afterPATCH`, `dw.ocapi.shop.order.modifyPATCHResponse` |
| `POST /orders/{order_no}/payment_instruments` | `dw.ocapi.shop.order.payment_instrument.beforePOST`, `dw.ocapi.shop.order.payment_instrument.afterPOST`, `dw.ocapi.shop.order.payment_instrument.modifyPOSTResponse` |
| **Product & Catalog** |  |
| `GET /products/{id}` | `dw.ocapi.shop.product.beforeGET`, `dw.ocapi.shop.product.modifyGETResponse` |
| `GET /product_search` | `dw.ocapi.shop.product_search.beforeGET`, `dw.ocapi.shop.product_search.modifyGETResponse` |
| `GET /categories/{id}` | `dw.ocapi.shop.category.beforeGET`, `dw.ocapi.shop.category.modifyGETResponse` |
| `GET /content/{id}` | `dw.ocapi.shop.content.beforeGET`, `dw.ocapi.shop.content.modifyGETResponse` |

### Data API Hooks

| API Endpoint (Method & Path) | Available Hook Extension Points |
|------------------------------|----------------------------------|
| **Custom Object** |  |
| `PUT /custom_objects/{object_type}/{key}` | `dw.ocapi.data.object.beforePut`, `dw.ocapi.data.object.afterPut` |
| `PATCH /custom_objects/{object_type}/{key}` | `dw.ocapi.data.object.beforePatch`, `dw.ocapi.data.object.afterPatch` |
| `DELETE /custom_objects/{object_type}/{key}` | `dw.ocapi.data.object.beforeDelete`, `dw.ocapi.data.object.afterDelete` |
| **Customer** |  |
| `POST /customer_lists/{list_id}/customers` | `dw.ocapi.data.customer_list.customers.beforePOST`, `dw.ocapi.data.customer_list.customers.afterPOST` |
| `PATCH /customer_lists/{list_id}/customers/{customer_no}` | `dw.ocapi.data.customer_list.customer.beforePATCH`, `dw.ocapi.data.customer_list.customer.afterPATCH` |
| `POST /customer_lists/{list_id}/customers/{customer_no}/addresses` | `dw.ocapi.data.customer_list.customer.addresses.beforePOST`, `dw.ocapi.data.customer_list.customer.addresses.afterPOST` |
| **Content** |  |
| `PUT /libraries/{library_id}/content/{content_id}` | `dw.ocapi.data.content.content.beforeCreate`, `dw.ocapi.data.content.content.afterCreate` |
| `PATCH /libraries/{library_id}/content/{content_id}` | `dw.ocapi.data.content.content.beforeUpdate`, `dw.ocapi.data.content.content.afterUpdate` |
| `DELETE /libraries/{library_id}/content/{content_id}` | `dw.ocapi.data.content.content.beforeDelete`, `dw.ocapi.data.content.content.afterDelete` |
| **User** |  |
| `PATCH /users/this/password` | `dw.ocapi.data.users.afterPATCH` |

## Troubleshooting Hook Registration

**If OCAPI hooks are not executing after deployment:**

1. **Check Code Version**: If hooks don't execute after upload:
   - **Check Available Versions**: Use MCP `get_code_versions` tool to see all code versions on the instance
   - **Activate Different Version**: Use MCP `activate_code_version` tool to switch code versions
   - **Alternative Manual Method**: Switch code versions in Business Manager (Administration > Site Development > Code Deployment > Activate)
2. **Verify Hook Registration**: Check logs for hook registration confirmations after version activation
3. **Test Hook Execution**: Make OCAPI calls to endpoints that should trigger your hooks and verify they execute
4. **Verify API Settings**: Ensure OCAPI settings in Business Manager allow your endpoints and include proper hook configurations

**Common Hook Issues:**
- Hooks not triggering → Check code version activation and OCAPI settings
- Hook scripts not found → Verify file paths match registration in hooks.json
- Runtime errors in hooks → Check logs for specific error messages during hook execution
- Data API hooks → Ensure proper authentication and permissions are configured
