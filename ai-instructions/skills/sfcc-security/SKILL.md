---
name: sfcc-security
description: Secure coding best practices for Salesforce B2C Commerce Cloud including CSRF protection, authentication, authorization, cryptography, and secrets management. Use when asked about SFCC security, input validation, or secure coding patterns.
---

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

```

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
```

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

#### CRITICAL: CSRF Middleware Automation

**❌ COMMON MISTAKE**: Manually adding CSRF tokens to viewData

```javascript
// ❌ WRONG - Don't do this!
server.get('ShowForm', csrfProtection.generateToken, function(req, res, next) {
    res.render('myForm', {
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
});
```

### Remote Include Security (server.middleware.include)

Remote includes (`<isinclude url="...">`) invoke an entirely NEW request created by the Web Adapter – they DO NOT inherit the authentication context of the parent page. Treat every remote include endpoint as PUBLIC unless you explicitly secure it.

| Risk Vector | Description | Mitigation |
|-------------|-------------|------------|
| Authentication Bypass | Endpoint renders user‑specific data but no login check runs on include request | Add `userLoggedIn.validateLoggedIn` AFTER `server.middleware.include` |
| Sensitive Data in URL | All params are query string → logged, bookmarkable, cache key | Pass only minimal identifiers; never PII, secrets, tokens |
| Cache Poisoning | Unique per-user params (e.g., session IDs) fragment cache & may expose personalized fragments | Keep URL stable; use surrogate keys / vary headers where needed |
| Excessive Fragment Count | Many includes amplify attack surface & performance risk | Keep < 20 per page; consolidate where feasible |
| Nested Includes Depth Abuse | Recursive fragment chains complicate security review & tracing | Avoid nesting beyond depth 2 |

#### Mandatory Middleware Order
```javascript
server.get('AccountWidget',
  server.middleware.include,          // 1. Gatekeeper – blocks direct access without include flag
  userLoggedIn.validateLoggedIn,      // 2. Re-establish authenticated context if user data needed
  cache.applyShortPromotionSensitiveCache, // 3. Explicit cache policy (or disable)
  function (req, res, next) {
    // SAFE: now in controlled context
    res.render('components/account/widget');
    next();
  }
);
```

NEVER put `userLoggedIn.validateLoggedIn` before `server.middleware.include` – bots probing the route directly would still trigger authentication logic (unnecessary overhead) and you'd miss the explicit architectural contract.

#### Identifying Remote Include Requests
`req.includeRequest === true` inside the controller. Log defensively:
```javascript
if (!req.includeRequest) {
  // Unexpected direct access attempt
  Logger.warn('Blocked direct access to remote include endpoint: {0}', request.httpPath);
  res.setStatusCode(404);
  return next();
}
```

#### What NOT to Expose via Remote Include
- Full order history snippets
- Payment method lists / masked credit cards
- Personally identifying profile composites
- Any fragment whose output differs materially per authenticated user unless properly protected

#### Logging & Forensics
Use extended request ID format (`baseId-depth-index`) to correlate parent + fragment in logs. Example: `Xa12Bc-0-00` (page), `Xa12Bc-1-02` (third fragment). This enables rapid blast-radius analysis during incident response.

#### Security Review Checklist
```text
[ ] server.middleware.include first in chain
[ ] Auth middleware present if user / sensitive data
[ ] No secrets / PII in query params
[ ] Cache TTL appropriate (0 for volatile personal data)
[ ] Fragment count on target pages audited (<20)
[ ] No deep nesting (depth <= 2)
[ ] Logging on unexpected direct access attempts
```

If any checklist item fails, remediate before deployment.

#### How CSRF Middleware Works

**`csrfProtection.generateToken` automatically:**
- Generates a secure token
- Adds `csrf.tokenName` and `csrf.token` to the response's viewData
- Makes them available in templates as `${pdict.csrf.tokenName}` and `${pdict.csrf.token}`

**Templates access tokens directly:**
```isml
<!-- ✅ Tokens available automatically -->
<input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>
```

**`csrfProtection.validateRequest` automatically:**
- Validates the submitted token
- Handles failures (logout/redirect)
- Allows controller to proceed only if valid

**Key Principle**: Never manually add CSRF data to viewData - the middleware handles this completely. Manually adding CSRF tokens is redundant and can lead to inconsistencies or security issues.

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

## 4\. Advanced Secrets Management

Hardcoding secrets such as API keys, credentials, or encryption keys in source code is a severe vulnerability. The platform provides specific, secure locations for storing different types of secrets:

- **Service Credentials (`dw.svc.ServiceCredential`)**: The most secure and appropriate method for storing secrets used to authenticate to external services (e.g., payment gateways, tax providers, shipping services). Credentials are created and managed in Business Manager (`Administration > Operations > Services`). In code, they are accessed as a read-only `dw.svc.ServiceCredential` object, and their values are never exposed in logs or to the client. This should be the default choice for any third-party integration credential.

- **Encrypted Custom Object Attributes**: For storing other types of sensitive data that are not service credentials, create a custom attribute on a system or custom object and set its type to `PASSWORD`. The platform automatically encrypts the value of this attribute at rest.

- **Custom Site Preferences**: Suitable for storing non-secret configuration values, such as feature toggles, endpoint URLs, or less sensitive identifiers. While a vast improvement over hardcoding, they are not encrypted in the same way as `ServiceCredential` or `PASSWORD` attributes and should not be the first choice for highly sensitive secrets like private keys or primary authentication credentials.

## 5. Modern Cryptography with dw.crypto

All cryptographic operations must be performed using the APIs provided in the dw.crypto package. This package provides access to industry-standard, Salesforce-maintained cryptographic libraries.

A critical security mandate is to avoid all deprecated Weak* classes, such as WeakCipher, WeakMac, and WeakMessageDigest. These classes use outdated and insecure algorithms that are vulnerable to attack. Some older third-party cartridges may still contain references to them; these cartridges must be updated or replaced.

All new development must use the modern classes like dw.crypto.Cipher. The following is a secure example of symmetric encryption using AES with a GCM block mode, which provides both confidentiality and authenticity.

```javascript
var Cipher = require('dw/crypto/Cipher');
var Encoding = require('dw/crypto/Encoding');
var SecureRandom = require('dw/crypto/SecureRandom');

// Key must be a securely generated, Base64-encoded 256-bit (32-byte) key.
// It should be stored securely using Service Credentials or an encrypted attribute.
var base64Key = 'YOUR_SECURE_BASE64_ENCODED_KEY_HERE';

// Plaintext to be encrypted
var plainText = 'This is sensitive data.';

// 1. Generate a cryptographically secure random Initialization Vector (IV).
// For AES/GCM, a 12-byte (96-bit) IV is recommended.
var ivBytes = new SecureRandom().nextBytes(12);
var ivBase64 = Encoding.toBase64(ivBytes);

// 2. Encrypt the data using a strong, authenticated encryption algorithm.
var aesGcmCipher = new Cipher();
var encryptedBase64 = aesGcmCipher.encrypt(plainText, base64Key, 'AES/GCM/NoPadding', ivBase64, 0);

// To decrypt, you need the encrypted data, the key, and the same IV.
// var decryptedText = aesGcmCipher.decrypt(encryptedBase64, base64Key, 'AES/GCM/NoPadding', ivBase64, 0);
```

### Cryptographic Best Practices

- **Use Strong Algorithms**: Always use AES with GCM mode for symmetric encryption, RSA with OAEP padding for asymmetric encryption, and SHA-256 or higher for hashing.

- **Generate Secure Random Values**: Use `dw.crypto.SecureRandom` for generating cryptographically secure random numbers, IVs, and salts.

- **Proper Key Management**: Store encryption keys securely using Service Credentials or encrypted custom object attributes. Never hardcode keys in source code.

- **Use Authenticated Encryption**: Prefer AES/GCM mode which provides both confidentiality and authenticity, preventing tampering with encrypted data.

- **Unique IVs**: Always generate a unique, random IV for each encryption operation. Never reuse IVs with the same key.

- **Avoid Weak Classes**: Never use WeakCipher, WeakMac, WeakMessageDigest, or any other deprecated cryptographic classes.

## Related Skills

- **[sfcc-logging](../sfcc-logging/SKILL.md)** - Logging best practices including avoiding sensitive data in logs. Essential for security auditing and incident forensics.
