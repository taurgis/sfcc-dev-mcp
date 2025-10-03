# ISML isredirect Element

## Overview

The `<isredirect>` element redirects the browser to a specified URL by generating an HTTP redirect response. This element is used to navigate users to different pages or controllers based on application logic, such as after login, form submission, or access control checks.

**Key Features:** HTTP 301 (permanent) or 302 (temporary) redirects, expression-based dynamic URLs, and integration with URL generation utilities.

**Important:** `<isredirect>` must appear **before** `<iscache>` in templates because it clears the response created up to that point.

## Syntax

```isml
<isredirect
  location  = target_url         // required
  permanent = "true" | "false"   // optional (default: "false")
/>
```

## Required Attributes

### location

**Type:** String or Expression  
**Required:** Yes

Specifies the target URL where the browser should be redirected. The browser will send a new HTTP request to this URL.

**Allowed Data Types:**
- String literal (URL path)
- Expression resolving to a URL string
- URLUtils.url() expression (recommended)

**Examples:**
```isml
<!-- Static URL string -->
<isredirect location="https://www.example.com/homepage"/>

<!-- Expression with URLUtils (recommended) -->
<isredirect location="${URLUtils.url('Account-Show')}"/>

<!-- Dynamic URL with parameters -->
<isredirect location="${URLUtils.url('Product-Show', 'pid', pdict.productID)}"/>

<!-- Conditional URL -->
<isredirect location="${pdict.customer.authenticated ? URLUtils.url('Account-Show') : URLUtils.url('Login-Show')}"/>

<!-- URL from variable -->
<isredirect location="${pdict.redirectURL}"/>
```

## Optional Attributes

### permanent

**Type:** String or Expression  
**Allowed Values:** `"true"`, `"false"`  
**Default:** `"false"`  
**Optional:** Yes

Specifies whether the redirect is permanent or temporary, which determines the HTTP response code sent to the browser.

**Values:**

#### "false" (default)

Generates an **HTTP 302** (Found - Temporary Redirect) response code.

**Use Cases:**
- Temporary redirects (login, checkout steps, form submissions)
- User-specific redirects
- Conditional navigation
- Post-processing redirects

```isml
<isredirect location="${URLUtils.url('Cart-Show')}" permanent="false"/>
<!-- HTTP 302 response -->
```

#### "true"

Generates an **HTTP 301** (Moved Permanently) response code.

**Use Cases:**
- Permanent URL changes
- Old URLs pointing to new locations
- SEO-friendly permanent redirects
- Content migration

```isml
<isredirect location="${URLUtils.url('NewPage-Show')}" permanent="true"/>
<!-- HTTP 301 response -->
```

**Important Notes:**
- If the `permanent` attribute is not provided, `"false"` is the default
- Permanent redirects (301) are cached by browsers and search engines
- Temporary redirects (302) are not cached

## Purpose

The `<isredirect>` element serves to:

1. **Navigation Control:** Direct users to appropriate pages based on logic
2. **Access Control:** Redirect unauthorized users to login or error pages
3. **Form Processing:** Redirect after successful form submission (POST-Redirect-GET pattern)
4. **URL Management:** Handle old URLs by redirecting to new locations
5. **Conditional Routing:** Route users based on session state, authentication, or other conditions
6. **Response Management:** Clear any response content generated before the redirect

## HTTP Response Codes

### HTTP 302 - Temporary Redirect (Default)

**When to Use:**
- User authentication flows
- Shopping cart and checkout redirects
- Form submission responses
- Session-based redirects
- Dynamic content redirects

**Behavior:**
- Browser does not cache the redirect
- Search engines do not update their index
- Users can bookmark the original URL

```isml
<isredirect location="${URLUtils.url('Login-Show')}" permanent="false"/>
```

### HTTP 301 - Permanent Redirect

**When to Use:**
- Site restructuring (URL changes)
- Consolidating duplicate content
- Migrating to new domain or path structure
- SEO optimization

**Behavior:**
- Browser may cache the redirect
- Search engines update their index to the new URL
- Users' bookmarks should be updated

```isml
<isredirect location="${URLUtils.url('NewLocation-Show')}" permanent="true"/>
```

## Important Rules and Considerations

### 1. Placement Before iscache

`<isredirect>` **must appear before** `<iscache>` in templates because it clears the response buffer.

```isml
<!-- Correct: isredirect before iscache -->
<isif condition="${!pdict.customer.authenticated}">
  <isredirect location="${URLUtils.url('Login-Show')}"/>
</isif>
<iscache type="relative" hour="24"/>

<!-- Incorrect: iscache before isredirect -->
<iscache type="relative" hour="24"/>
<isif condition="${!pdict.customer.authenticated}">
  <isredirect location="${URLUtils.url('Login-Show')}"/>  <!-- Won't work properly -->
</isif>
```

### 2. Clears Response Buffer

When `<isredirect>` executes, it clears any response content generated up to that point:

```isml
<h1>Welcome</h1>  <!-- This output is discarded -->
<p>Loading...</p>  <!-- This output is discarded -->

<isredirect location="${URLUtils.url('Home-Show')}"/>
<!-- All previous output is cleared; only redirect is sent -->
```

### 3. Browser Compatibility with HTTPS

Some browsers don't support redirect from HTTP to HTTPS. In such cases, use the HTML `<meta>` tag refresh method:

```isml
<!-- Alternative for HTTP to HTTPS redirects -->
<html>
<head>
  <meta http-equiv="refresh" content="0; URL='${URLUtils.url('SecurePage-Show')}'"/>
</head>
<body>
  <p>Redirecting to secure page...</p>
</body>
</html>
```

### 4. No Code Executes After Redirect

Once `<isredirect>` is executed, template processing stops and the redirect response is sent:

```isml
<isredirect location="${URLUtils.url('Home-Show')}"/>

<!-- This code will NOT execute -->
<isprint value="${pdict.message}"/>
<isset name="myvar" value="test" scope="page"/>
```

## Common Use Cases

### Authentication and Access Control

```isml
<!-- Redirect if not logged in -->
<isif condition="${!pdict.customer.authenticated}">
  <isredirect location="${URLUtils.url('Login-Show')}"/>
</isif>

<!-- Redirect if not authorized -->
<isif condition="${!pdict.customer.authenticated || !pdict.hasAccess}">
  <isredirect location="${URLUtils.url('Account-Login', 'rurl', URLUtils.url('Account-Show'))}"/>
</isif>

<!-- Redirect registered customers from registration page -->
<isif condition="${pdict.customer.registered}">
  <isredirect location="${URLUtils.url('Account-Show')}"/>
</isif>
```

### Cookie Validation

```isml
<!-- Check if cookies are enabled -->
<isif condition="${request.httpCookies['UserID']}">
  <isredirect location="${URLUtils.url('LoginPanel-Start')}" permanent="false"/>
<iselse>
  <!-- Cookies are not enabled - show error message -->
  <div class="error-message">
    <p>Please enable cookies in your browser to continue.</p>
  </div>
</isif>
```

### Post-Login Redirect

```isml
<!-- Login controller redirects to original requested URL -->
<isif condition="${pdict.customer.authenticated}">
  <isset name="redirectURL" value="${session.custom.loginRedirectURL || URLUtils.url('Account-Show')}" scope="page"/>
  <isredirect location="${redirectURL}"/>
</isif>
```

### Form Submission (POST-Redirect-GET Pattern)

```isml
<!-- After successful form submission, redirect to confirmation page -->
<isif condition="${pdict.formSubmitted && pdict.success}">
  <isredirect location="${URLUtils.url('Account-RegistrationConfirm', 'email', pdict.email)}"/>
<iselseif condition="${pdict.formSubmitted && !pdict.success}">
  <!-- Show errors on same page (no redirect) -->
  <div class="error-messages">
    <isloop items="${pdict.errors}" var="error">
      <p class="error">${error.message}</p>
    </isloop>
  </div>
</isif>
```

### Shopping Cart and Checkout

```isml
<!-- Redirect to cart after adding product -->
<isif condition="${pdict.addToCartSuccess}">
  <isredirect location="${URLUtils.url('Cart-Show')}"/>
</isif>

<!-- Redirect to checkout if cart is empty -->
<isif condition="${pdict.basket.productLineItems.empty}">
  <isredirect location="${URLUtils.url('Cart-Show')}"/>
</isif>

<!-- Redirect to login before checkout if not authenticated -->
<isif condition="${!pdict.customer.authenticated}">
  <isset name="continueURL" value="${URLUtils.url('Checkout-Begin')}" scope="page"/>
  <isredirect location="${URLUtils.url('Login-Show', 'rurl', continueURL)}"/>
</isif>
```

### Error Handling

```isml
<!-- Redirect on error -->
<isif condition="${pdict.error}">
  <isredirect location="${URLUtils.url('Error-Start', 'message', pdict.error.message)}"/>
</isif>

<!-- Redirect if product not found -->
<isif condition="${!pdict.product}">
  <isredirect location="${URLUtils.url('Search-Show', 'q', pdict.searchQuery)}"/>
</isif>

<!-- Redirect if page not accessible -->
<isif condition="${!pdict.accessible}">
  <isredirect location="${URLUtils.url('Home-Show')}"/>
</isif>
```

### SEO and URL Management (Permanent Redirects)

```isml
<!-- Permanent redirect for old URL structure -->
<isif condition="${pdict.isOldURL}">
  <isredirect location="${pdict.canonicalURL}" permanent="true"/>
</isif>

<!-- Redirect non-canonical URLs to canonical version -->
<isif condition="${pdict.currentURL != pdict.canonicalURL}">
  <isredirect location="${pdict.canonicalURL}" permanent="true"/>
</isif>

<!-- Redirect old product URL to new URL -->
<isif condition="${pdict.product.oldURL}">
  <isredirect location="${URLUtils.url('Product-Show', 'pid', pdict.product.ID)}" permanent="true"/>
</isif>
```

### Locale and Currency Handling

```isml
<!-- Redirect to locale-specific homepage -->
<isif condition="${pdict.redirectToLocale}">
  <isredirect location="${URLUtils.url('Home-Show', 'locale', pdict.preferredLocale)}"/>
</isif>

<!-- Redirect if currency not supported -->
<isif condition="${!pdict.currencySupported}">
  <isredirect location="${URLUtils.url('Home-Show', 'currency', pdict.defaultCurrency)}"/>
</isif>
```

### Mobile Detection and Device-Specific Redirects

```isml
<!-- Redirect mobile users to mobile site -->
<isif condition="${pdict.isMobile && !pdict.isOnMobileSite}">
  <isredirect location="${pdict.mobileSiteURL}"/>
</isif>

<!-- Redirect to app download page -->
<isif condition="${pdict.showAppPromo && pdict.isMobile}">
  <isredirect location="${URLUtils.url('App-Download')}"/>
</isif>
```

### Conditional Redirects with Multiple Conditions

```isml
<!-- Complex redirect logic -->
<isif condition="${!pdict.customer.authenticated}">
  <isredirect location="${URLUtils.url('Login-Show')}"/>
<iselseif condition="${pdict.basket.productLineItems.empty}">
  <isredirect location="${URLUtils.url('Cart-Show')}"/>
<iselseif condition="${!pdict.shippingAddress}">
  <isredirect location="${URLUtils.url('Checkout-Shipping')}"/>
<iselseif condition="${!pdict.paymentMethod}">
  <isredirect location="${URLUtils.url('Checkout-Billing')}"/>
</isif>

<!-- If none of the conditions match, continue with page rendering -->
```

## Best Practices

### 1. Use URLUtils for URL Generation

Always use `URLUtils.url()` for generating redirect URLs to ensure proper URL construction:

```isml
<!-- Good: URLUtils with controller and action -->
<isredirect location="${URLUtils.url('Account-Show')}"/>

<!-- Good: URLUtils with parameters -->
<isredirect location="${URLUtils.url('Product-Show', 'pid', pdict.productID)}"/>

<!-- Avoid: Hard-coded URLs (brittle, not site-aware) -->
<isredirect location="/account/show"/>
```

### 2. Implement POST-Redirect-GET Pattern

After form submissions, redirect to prevent duplicate submissions on browser refresh:

```isml
<!-- In controller after processing POST -->
<isif condition="${pdict.formSuccess}">
  <isredirect location="${URLUtils.url('Account-Success')}"/>
</isif>
```

### 3. Use Temporary Redirects by Default

Use temporary redirects (302) unless you have a specific reason for permanent (301):

```isml
<!-- Default: Temporary redirect (no permanent attribute needed) -->
<isredirect location="${URLUtils.url('Login-Show')}"/>

<!-- Only use permanent for URL structure changes -->
<isif condition="${pdict.urlChanged}">
  <isredirect location="${pdict.newURL}" permanent="true"/>
</isif>
```

### 4. Preserve Return URLs

When redirecting to login or other intermediary pages, preserve the intended destination:

```isml
<!-- Save return URL before redirecting to login -->
<isset name="returnURL" value="${URLUtils.url('Checkout-Begin')}" scope="page"/>
<isredirect location="${URLUtils.url('Login-Show', 'rurl', returnURL)}"/>

<!-- In login template, redirect back after authentication -->
<isif condition="${pdict.customer.authenticated && pdict.returnURL}">
  <isredirect location="${pdict.returnURL}"/>
</isif>
```

### 5. Place Access Checks Early

Put authentication and authorization redirects at the top of templates:

```isml
<!-- Good: Check access first -->
<isif condition="${!pdict.customer.authenticated}">
  <isredirect location="${URLUtils.url('Login-Show')}"/>
</isif>

<iscache type="relative" hour="1"/>

<!-- Rest of page content -->
<h1>Account Dashboard</h1>
```

### 6. Provide User Feedback for Delayed Redirects

If using meta refresh for compatibility, show a message:

```isml
<html>
<head>
  <meta http-equiv="refresh" content="2; URL='${URLUtils.url('SecurePage-Show')}'"/>
</head>
<body>
  <div class="redirect-message">
    <p>Redirecting to secure checkout...</p>
    <p>If you are not redirected automatically, 
       <a href="${URLUtils.url('SecurePage-Show')}">click here</a>.
    </p>
  </div>
</body>
</html>
```

### 7. Avoid Redirect Loops

Ensure redirect logic doesn't create infinite loops:

```isml
<!-- Bad: Potential redirect loop -->
<isif condition="${!pdict.customer.authenticated}">
  <isredirect location="${URLUtils.url('Account-Show')}"/>  <!-- Same page! -->
</isif>

<!-- Good: Redirect to different page -->
<isif condition="${!pdict.customer.authenticated}">
  <isredirect location="${URLUtils.url('Login-Show')}"/>
</isif>
```

## Alternative Redirect Methods

### HTML Meta Refresh

For browsers that don't support HTTP to HTTPS redirects:

```isml
<html>
<head>
  <meta http-equiv="refresh" content="0; URL='${URLUtils.url('SecurePage-Show')}'"/>
  <title>Redirecting...</title>
</head>
<body>
  <p>If you are not redirected, <a href="${URLUtils.url('SecurePage-Show')}">click here</a>.</p>
</body>
</html>
```

**Attributes:**
- `content="0"` - Redirect after 0 seconds (immediate)
- `content="5"` - Redirect after 5 seconds (delayed)

### JavaScript Redirect

For more control over redirect behavior:

```isml
<script type="text/javascript">
  window.location.href = "${URLUtils.url('Account-Show')}";
</script>
<noscript>
  <p>JavaScript is required. Please <a href="${URLUtils.url('Account-Show')}">click here</a>.</p>
</noscript>
```

### Controller-Based Redirect

Redirect in controller before rendering (preferred for business logic):

```javascript
// Controller: Account.js
server.get('Show', function (req, res, next) {
    if (!req.currentCustomer.authenticated) {
        res.redirect(URLUtils.url('Login-Show'));
        return next();
    }
    
    res.render('account/accountDashboard');
    next();
});
```

## Common Errors and Troubleshooting

### Redirect After Output

**Symptom:** Warning or error about headers already sent.

**Cause:** Attempting to redirect after template output has started.

**Solution:** Place `<isredirect>` before any output:

```isml
<!-- Bad: Output before redirect -->
<h1>Welcome</h1>
<isredirect location="${URLUtils.url('Home-Show')}"/>

<!-- Good: Redirect first -->
<isif condition="${pdict.shouldRedirect}">
  <isredirect location="${URLUtils.url('Home-Show')}"/>
</isif>
<h1>Welcome</h1>
```

### Redirect Loop

**Symptom:** Browser shows "Too many redirects" error.

**Cause:** Redirect logic creates infinite loop.

**Solution:** Ensure redirect target is different from source:

```isml
<!-- Bad: Redirects to itself -->
<isif condition="${!pdict.data}">
  <isredirect location="${URLUtils.url('CurrentPage-Show')}"/>
</isif>

<!-- Good: Redirects to different page -->
<isif condition="${!pdict.data}">
  <isredirect location="${URLUtils.url('Error-Show')}"/>
</isif>
```

### HTTPS Redirect Not Working

**Symptom:** Redirect from HTTP to HTTPS fails in some browsers.

**Solution:** Use meta refresh instead:

```isml
<!-- Use meta refresh for HTTP to HTTPS -->
<html>
<head>
  <meta http-equiv="refresh" content="0; URL='${URLUtils.https('SecurePage-Show')}'"/>
</head>
</html>
```

### Lost Query Parameters

**Symptom:** URL parameters are lost after redirect.

**Solution:** Include parameters in redirect URL:

```isml
<!-- Bad: Loses query parameters -->
<isredirect location="${URLUtils.url('Search-Show')}"/>

<!-- Good: Preserves query parameters -->
<isredirect location="${URLUtils.url('Search-Show', 'q', pdict.searchQuery, 'sort', pdict.sortOrder)}"/>
```

## Performance Considerations

### 1. Minimize Unnecessary Redirects

Each redirect adds an extra HTTP request, increasing page load time:

```isml
<!-- Avoid: Multiple redirect hops -->
<!-- Page A redirects to Page B, which redirects to Page C -->

<!-- Better: Direct redirect -->
<!-- Page A redirects directly to Page C -->
```

### 2. Use Client-Side Redirects Sparingly

Server-side redirects (isredirect) are faster than JavaScript redirects:

```isml
<!-- Preferred: Server-side redirect -->
<isredirect location="${URLUtils.url('Home-Show')}"/>

<!-- Only when necessary: JavaScript redirect -->
<script>window.location.href = "${URLUtils.url('Home-Show')}";</script>
```

### 3. Cache Permanent Redirects

Permanent redirects (301) are cached by browsers, reducing server load for repeated requests.

## SEO Considerations

### 1. Use 301 for Permanent URL Changes

Search engines transfer page authority to the new URL with 301 redirects:

```isml
<isredirect location="${pdict.newURL}" permanent="true"/>
```

### 2. Use 302 for Temporary Changes

Temporary redirects tell search engines to keep the original URL indexed:

```isml
<isredirect location="${pdict.temporaryURL}" permanent="false"/>
```

### 3. Avoid Redirect Chains

Multiple redirects hurt SEO and performance. Redirect directly to final destination.

## Security Considerations

### 1. Validate Redirect URLs

Never redirect to user-provided URLs without validation:

```isml
<!-- Bad: Open redirect vulnerability -->
<isredirect location="${request.httpParameterMap.returnURL.stringValue}"/>

<!-- Good: Validate against allowed URLs -->
<isif condition="${pdict.isValidReturnURL}">
  <isredirect location="${pdict.returnURL}"/>
<iselse>
  <isredirect location="${URLUtils.url('Home-Show')}"/>
</isif>
```

### 2. Use HTTPS for Sensitive Redirects

Always use HTTPS URLs for redirects involving authentication or sensitive data:

```isml
<isredirect location="${URLUtils.https('Account-Show')}"/>
```

### 3. Prevent Open Redirect Attacks

Whitelist allowed redirect domains:

```javascript
// Controller: validate return URL
var allowedDomains = ['example.com', 'checkout.example.com'];
var isValid = validateReturnURL(returnURL, allowedDomains);

res.render('template', {
    returnURL: isValid ? returnURL : URLUtils.url('Home-Show')
});
```

## Related Elements

- **`<isif>`** - Conditional logic for redirect decisions
- **`<iscache>`** - Must appear after `<isredirect>`
- **`<isset>`** - Set redirect URL variables

## Related APIs

- **`dw.web.URLUtils`** - URL generation and construction
- **`dw.web.Response`** - Response manipulation in controllers
- **`dw.customer.Customer`** - Customer authentication checks
- **`dw.order.BasketMgr`** - Basket state checks for redirects

## See Also

- [URLUtils Class](../dw_web/URLUtils.md)
- [Response Class](../dw_web/Response.md)
- [ISML Conditional Statements](./isif.md)
- [ISML Cache Element](./iscache.md)
- [SFRA Controllers](../best-practices/sfra_controllers.md)
- [Security Best Practices](../best-practices/security.md)
