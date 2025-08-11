# Salesforce B2C Commerce Cloud: Secure Coding Best Practices

This document provides a concise guide to security best practices for Salesforce B2C Commerce Cloud development, focusing on SFRA Controllers, OCAPI/SCAPI Hooks, and Custom SCAPI Endpoints.

-----

## Core Security Principles

- **Shared Responsibility**: Salesforce secures the cloud infrastructure. You, the developer, are responsible for securing the custom code you write *in* the cloud.
- **Defense-in-Depth**: Security is layered. Do not rely on a single control (like a WAF). Your code must be independently secure. 
- **OWASP Top 10**: All development should align with OWASP principles to mitigate common web application vulnerabilities.
- **Server-Side Validation**: Always validate and sanitize all user input on the server. Client-side validation is for user experience only and provides no security. Use an allowlist approach.
- **Secrets Management**: Never hardcode secrets (API keys, credentials). Store them in Custom Site Preferences. 
- **Secure Cryptography**: Use the `dw.crypto` package for all cryptographic operations. Avoid deprecated `Weak*` classes like `WeakCipher`.
- **HTTP Security Headers**: Configure security headers like `Content-Security-Policy`, `X-Frame-Options`, and `Strict-Transport-Security` in the `httpHeaders.json` file.

-----

## 1\. Securing SFRA Controllers

Controllers are the entry point for storefront logic. Security here is paramount.

### Authentication & Authorization

Always verify **who** the user is (authentication) and **what** they are allowed to do (authorization). There are
off course anonymous users, but authenticated users must be verified before accessing protected resources such as
the profile, basket, or order history.

- **Authentication**: Use the `userLoggedIn` middleware to ensure a shopper is logged in.
- **Authorization**: After authenticating, verify the user owns the data they are trying to access or modify (e.g., check if `basket.customerNo` matches `req.currentCustomer.profile.customerNo`). 

```javascript
  // File: cartridges/app\_custom\_storefront/cartridge/controllers/Account.js

var server = require('server');
var userLoggedIn = require('\*/cartridge/scripts/middleware/userLoggedIn');
var CustomerMgr = require('dw/customer/CustomerMgr');

// The 'userLoggedIn.validateLoggedIn' middleware handles authentication.
server.post('UpdateProfile', userLoggedIn.validateLoggedIn, function (req, res, next) {
    // Authorization MUST be performed inside the controller logic.
    var profileForm = server.forms.getForm('profile');
    var customer = CustomerMgr.getCustomerByCustomerNumber(
        req.currentCustomer.profile.customerNo
    );

    // Example Authorization Check: Does the logged-in user own this data?
    if (customer.profile.email!== profileForm.email.value) {
        res.setStatusCode(403);
        res.json({ error: 'Forbidden' });
        return next();
    }

    //... proceed with business logic...
    res.json({ success: true });
    next();
});

module.exports = server.exports();

````

### Cross-Site Request Forgery (CSRF) Protection

Use the `csrfProtection` middleware for any state-changing POST request. [12, 13]

1.  **Generate Token**: Use `csrfProtection.generateToken` when rendering the form page.
2.  **Validate Token**: Use `csrfProtection.validateRequest` when processing the form submission.

```isml
<form action="${URLUtils.url('Account-HandleProfileUpdate')}" method="POST">
   ...
    <input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>
    <button type="submit">Save</button>
</form>
````

```javascript
// In your controller
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

// 1. Generate token for the form page
server.get('EditProfile', csrfProtection.generateToken, function(req, res, next) {
    //... render page...
});

// 2. Validate token on form submission
server.post('HandleProfileUpdate', csrfProtection.validateRequest, function(req, res, next) {
    // If execution reaches here, the token was valid.
    //... process form...
});
```

### Server-Side Validation & Output Encoding

- **Validation**: Define validation rules (e.g., `mandatory`, `regexp`, `max-length`) in your form definition XML. SFRA automatically enforces these on the server when the form is processed. [14]
- **Output Encoding**: Always use `encoding="on"` in `<isprint>` tags to prevent XSS. This is the default and should not be turned off without a specific, secure reason. [9]

<!-- end list -->

```xml
<field formid="email"
       type="string"
       mandatory="true"
       max-length="50"
       regexp="^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$"
       parse-error="error.message.parse.email" />
```

```isml
<div>Your email: <isprint value="${pdict.profileForm.email.value}" encoding="on" /></div>
```

-----

## 2\. Securing OCAPI/SCAPI Hooks

Hooks are powerful but dangerous. They run in a privileged context *after* initial gateway authentication but *before* business-level authorization. [15, 16]

**Primary Rule**: Never trust the request. Always re-validate authorization inside the hook script. Check that the authenticated user owns the object being modified. [16]

### Authorization Example (`beforePATCH` hook)

```javascript
// File: cartridge/scripts/basket/productItemHooks.js
'use strict';
var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger');

exports.beforePATCH = function (basket, productItem, productItemDocument) {
    // The gateway authenticated the client, but we MUST authorize the action.
    if (customer.authenticated) {
        // CRITICAL AUTHORIZATION CHECK:
        if (basket.customerNo!== customer.profile.customerNo) {
            Logger.getLogger('Security').warn('Auth failure: Customer {0} tried to modify basket {1}', customer.profile.customerNo, basket.basketNo);
            // Return an error to block the operation.
            return new Status(Status.ERROR, 'AUTH_ERROR', 'Request could not be processed.');
        }
    }
    //... additional validation on productItemDocument...
    return new Status(Status.OK); // Allow operation
};
```

### Hook Best Practices

- **Performance**: Keep hook logic simple and fast. Avoid making new database calls (e.g., `ProductMgr.getProduct()`). [17, 18, 19]
- **Error Handling**: Wrap logic in `try-catch` blocks. Return generic `dw.system.Status` errors to the client. Log detailed, non-sensitive error information for debugging. [16, 20]

-----

## 3\. Securing Custom SCAPI Endpoints

Custom SCAPI Endpoints use a "contract-first" security model. The OpenAPI Specification (OAS) 3.0 YAML file is an active, enforceable security policy. [21, 22]

### Contract-First Security

The platform validates requests against the OAS contract at the edge, *before* your script runs. Any request with undefined parameters, headers, or body structures is automatically rejected. [23, 24]

### Security Schemes & Scopes

Define security in the OAS contract using `securitySchemes` and apply them to endpoints. Each endpoint must have exactly one custom scope (prefixed with `c_`). [21, 25]

- **`ShopperToken`**: For customer-facing APIs. Uses SLAS JWTs. [25]
- **`AmOAuth2`**: For admin/back-office APIs. Uses Account Manager tokens. [25]

<!-- end list -->

```yaml
# File: cartridge/rest-apis/loyalty-api/api.oas.yml
openapi: 3.0.0
info:
  title: Custom Loyalty API
  version: "1.0.0"
servers:
  - url: https://{shortCode}.api.commercecloud.salesforce.com
paths:
  /c_loyalty/v1/organizations/{organizationId}/shoppers/me/points:
    get:
      summary: Get Loyalty Points for the current Shopper
      operationId: getLoyaltyPointsForShopper
      # This endpoint requires a ShopperToken with the 'c_loyalty.read' scope.
      security:
        - ShopperToken: [c_loyalty.read]
      responses:
        '200':
          description: Success.
  /c_loyalty/v1/organizations/{organizationId}/customers/{customerId}/points_adjustment:
    post:
      summary: Adjust Loyalty Points for a specific customer (Admin Only)
      operationId: adjustCustomerLoyaltyPoints
      # This endpoint requires an Admin token with the 'c_loyalty.write' scope.
      security:
        - AmOAuth2: [c_loyalty.write]
      responses:
        '204':
          description: Success.

# Reusable security scheme definitions
components:
  securitySchemes:
    # Definition for Shopper APIs
    ShopperToken:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: "Requires a Shopper Access Token (SLAS) with c_ scopes."

    # Definition for Admin APIs
    AmOAuth2:
      type: oauth2
      description: "Requires an Account Manager token with c_ scopes."
      flows:
        clientCredentials:
          tokenUrl: [https://account.demandware.com/dwsso/oauth2/access_token](https://account.demandware.com/dwsso/oauth2/access_token)
          scopes:
            c_loyalty.read: "Read shopper loyalty data."
            c_loyalty.write: "Modify shopper loyalty data."
```
