# ISML iscookie Element

## Overview

The `<iscookie>` element sets a cookie in the browser, allowing you to store user-related information on the shopper's system. Cookies enable persistent storage of preferences, session data, and user identifiers that the browser returns with subsequent requests to the same domain.

**Security Note:** Cookie handling includes automatic `SameSite` attribute management based on security settings and the `Secure` flag.

## Syntax

```isml
<iscookie
  name    = cookie_name      // required
  value   = cookie_value     // required
  comment = cookie_use       // optional
  domain  = domain_name      // optional
  path    = pathname         // optional
  maxAge  = cookie_lifetime  // optional
  version = cookie_spec      // optional
  secure  = "on" | "off"     // optional
/>
```

## Required Attributes

### name

**Type:** String or Expression  
**Required:** Yes

Specifies the name for the cookie. This is the identifier used to retrieve the cookie value in subsequent requests.

**Restrictions:** Names starting with `$` are **not allowed**.

**Examples:**
```isml
<!-- String literal -->
<iscookie name="UserID" value="${customer.ID}"/>

<!-- Expression -->
<iscookie name="${pdict.cookieName}" value="${pdict.cookieValue}"/>

<!-- Invalid: starts with $ -->
<iscookie name="$sessionID" value="123"/>  <!-- NOT ALLOWED -->
```

### value

**Type:** String or Expression  
**Required:** Yes

Specifies the value stored by the cookie. This can be any string data such as a user ID, preference setting, or session identifier.

**Examples:**
```isml
<!-- Customer UUID -->
<iscookie name="UserID" value="${pdict.buyer.UUID}"/>

<!-- Preference value -->
<iscookie name="preferredStore" value="${customer.profile.custom.storeLocation}"/>

<!-- String literal -->
<iscookie name="consent" value="accepted"/>

<!-- Expression -->
<iscookie name="sessionData" value="${JSON.stringify(pdict.sessionInfo)}"/>
```

## Optional Attributes

### comment

**Type:** String or Expression  
**Optional:** Yes

Documents the intended use of the cookie. This information can help users decide whether to accept or reject the cookie, especially when cookies contain private information.

**Privacy Best Practice:** Always provide meaningful comments for cookies that store personal or sensitive data to support transparency and user consent.

```isml
<iscookie 
  name="UserID" 
  value="${customer.UUID}"
  comment="Your international customer ID for personalized shopping experience"/>

<iscookie 
  name="preferences" 
  value="${prefs}"
  comment="Stores your site preferences like language and currency"/>
```

### domain

**Type:** String or Expression  
**Optional:** Yes

Specifies the domain for which the cookie is valid. Controls which domains can access the cookie.

**Important Rules:**
- An explicitly specified domain **must always start with a dot** (`.`)
- If not specified, the browser sets the domain to the domain that issued the cookie
- Cookies are sent to the specified domain and all its subdomains

**Examples:**
```isml
<!-- Valid for foo.com and all subdomains (www.foo.com, shop.foo.com) -->
<iscookie name="UserID" value="${customer.ID}" domain=".foo.com"/>

<!-- Valid for example.com and all subdomains -->
<iscookie name="sessionID" value="${session.ID}" domain=".example.com"/>

<!-- Browser sets domain automatically (recommended for most cases) -->
<iscookie name="UserID" value="${customer.ID}"/>
```

### path

**Type:** String or Expression  
**Optional:** Yes

Specifies the URL path subset to which this cookie applies. Pages outside of that path cannot access the cookie.

**Path Matching:**
- Cookie is sent to the specified path and all sub-paths
- More specific paths provide better security and control
- Default is typically `/` (root path)

**Examples:**
```isml
<!-- Cookie available to /checkout and all sub-paths -->
<iscookie name="checkoutData" value="${data}" path="/checkout"/>

<!-- Cookie available site-wide -->
<iscookie name="UserID" value="${customer.ID}" path="/"/>

<!-- Cookie only for specific section -->
<iscookie name="adminSession" value="${sessionID}" path="/admin"/>

<!-- Dynamic path -->
<iscookie name="categoryPref" value="${pref}" path="${'/category/' + categoryID}"/>
```

### maxAge

**Type:** Integer or Expression  
**Optional:** Yes  
**Unit:** Seconds

Defines the lifetime of the cookie in seconds. Controls how long the browser should retain the cookie.

**Value Meanings:**
- **Positive integer:** Cookie persists for the specified number of seconds
- **`0`:** Cookie is deleted immediately
- **Negative integer:** Cookie is not persistent and is deleted when the browser closes (session cookie)

**B2C Commerce Regulations:**
- Maximum cookie lifetime is **6 months** for compliance with international data storage regulations
- Anonymous customer cookies adhere to 6-month maximum
- All B2C Commerce cookies have a lifetime of 6 months or less

**Examples:**
```isml
<!-- Session cookie (deleted when browser closes) -->
<iscookie name="tempData" value="${data}" maxAge="-1"/>

<!-- 1 hour (3600 seconds) -->
<iscookie name="sessionID" value="${session.ID}" maxAge="3600"/>

<!-- 1 day (86400 seconds) -->
<iscookie name="dailyPref" value="${pref}" maxAge="86400"/>

<!-- 30 days (2592000 seconds) -->
<iscookie name="preferences" value="${prefs}" maxAge="2592000"/>

<!-- 6 months maximum (15552000 seconds = 180 days) -->
<iscookie name="UserID" value="${customer.UUID}" maxAge="15552000"/>

<!-- Delete cookie immediately -->
<iscookie name="oldCookie" value="" maxAge="0"/>

<!-- Dynamic lifetime -->
<iscookie name="tempToken" value="${token}" maxAge="${pdict.tokenLifetime}"/>
```

**Lifetime Calculations:**
```isml
<isscript>
  var ONE_HOUR = 60 * 60;                    // 3600
  var ONE_DAY = 24 * 60 * 60;                // 86400
  var ONE_WEEK = 7 * 24 * 60 * 60;           // 604800
  var ONE_MONTH = 30 * 24 * 60 * 60;         // 2592000
  var SIX_MONTHS = 180 * 24 * 60 * 60;       // 15552000 (B2C Commerce max)
</isscript>

<iscookie name="sessionToken" value="${token}" maxAge="${ONE_HOUR}"/>
<iscookie name="userPrefs" value="${prefs}" maxAge="${ONE_MONTH}"/>
```

### version

**Type:** Decimal Integer or Expression  
**Optional:** Yes

Identifies the version of the cookie specification to which the cookie conforms.

**Valid Values:** Any decimal integer (digits 0-9)

**Common Versions:**
- `0` - Original Netscape cookie specification (most common)
- `1` - RFC 2109 cookie specification

```isml
<!-- Version 0 (Netscape specification) -->
<iscookie name="UserID" value="${customer.ID}" version="0"/>

<!-- Version 1 (RFC 2109) -->
<iscookie name="sessionData" value="${data}" version="1"/>

<!-- Dynamic version -->
<iscookie name="data" value="${value}" version="${pdict.cookieVersion}"/>
```

### secure

**Type:** String  
**Allowed Values:** `"on"`, `"off"`  
**Optional:** Yes  
**Default:** `"off"`  
**Expressions:** Not allowed

Indicates whether the cookie must only be transmitted over secure connections (HTTPS/SSL).

**Security Behavior:**
- `"on"` - Cookie only sent over HTTPS connections
- `"off"` - Cookie sent over both HTTP and HTTPS

**Important:** Setting `secure="on"` affects the automatic `SameSite` attribute (see SameSite Attribute section).

```isml
<!-- Secure cookie (HTTPS only) -->
<iscookie name="UserID" value="${customer.UUID}" secure="on"/>

<!-- Non-secure cookie (HTTP and HTTPS) -->
<iscookie name="preferences" value="${prefs}" secure="off"/>

<!-- Best practice: Always use secure for sensitive data -->
<iscookie 
  name="sessionToken" 
  value="${token}" 
  secure="on"
  maxAge="3600"/>
```

## SameSite Attribute Management

The `SameSite` attribute controls whether cookies are sent with cross-site requests, providing CSRF protection.

**Automatic Behavior:** You **cannot** manually set the `SameSite` attribute using the `<iscookie>` tag. The server automatically manages it based on the following rules:

### SameSite=None

The server sets `SameSite=None` when **either** condition is true:
1. Developer sets `secure="on"` on the cookie
2. Global security preference **"Enforce HTTPS"** is enabled

**Note:** When `SameSite=None` is set, the `Secure` flag is also automatically set.

```isml
<!-- Results in SameSite=None; Secure -->
<iscookie name="crossSiteID" value="${id}" secure="on"/>
```

### No SameSite Attribute

If neither condition above is met, the server **doesn't set** the `SameSite` attribute, and the browser uses its own default setting (typically `SameSite=Lax`).

```isml
<!-- Browser uses its default SameSite setting -->
<iscookie name="localPref" value="${pref}" secure="off"/>
```

### Client Compatibility

The `SameSite` attribute is **not sent** with a cookie if the server detects that the client doesn't correctly interpret the attribute (older browsers).

## Purpose

Cookies serve multiple purposes in B2C Commerce storefronts:

1. **User Identification:** Store unique user IDs to identify returning customers
2. **Session Management:** Maintain session state across requests
3. **Personalization:** Store user preferences (language, currency, store location)
4. **Simplified Login:** Enable "Remember Me" functionality without storing passwords
5. **Shopping Cart Persistence:** Maintain cart state for anonymous users
6. **Analytics Tracking:** Track user behavior and shopping patterns
7. **Consent Management:** Store cookie consent preferences

**How Cookies Work:**
1. B2C Commerce sends cookie to browser via `<iscookie>` tag
2. Browser stores the cookie on the shopper's system
3. Browser returns the cookie with every subsequent request to the same domain
4. Server reads cookie value to identify user, preferences, or session

## Supporting Objects

For programmatic cookie operations in scripts, use these classes:

| Class | Purpose |
|-------|---------|
| **`dw.system.Request`** | Read cookies from incoming requests |
| **`dw.web.Cookies`** | Collection of cookies |
| **`dw.web.Cookie`** | Individual cookie object with properties and methods |

**See:** Scripting API documentation for detailed programmatic cookie manipulation.

## Common Use Cases

### Customer Identification Cookie

```isml
<iscookie
  name="UserID"
  value="${pdict.buyer.UUID}"
  comment="Your international customer ID"
  domain=".foo.com"
  path="/acme"
  maxAge="10000"
  version="0"
  secure="on"
/>
```

### Store Preferences

```isml
<isscript>
  var preferences = {
    language: request.locale,
    currency: session.currency.currencyCode,
    storeID: customer.profile.custom.preferredStore
  };
</isscript>

<iscookie
  name="storePreferences"
  value="${JSON.stringify(preferences)}"
  comment="Stores your language, currency, and preferred store location"
  maxAge="${30 * 24 * 60 * 60}"
  secure="on"
/>
```

### Session Cookie

```isml
<!-- Deleted when browser closes (maxAge = -1) -->
<iscookie
  name="tempSessionData"
  value="${session.custom.temporaryData}"
  comment="Temporary session information"
  maxAge="-1"
  path="/"
  secure="on"
/>
```

### Remember Me Functionality

```isml
<isif condition="${pdict.rememberMe}">
  <iscookie
    name="rememberToken"
    value="${customer.profile.custom.rememberMeToken}"
    comment="Remember me authentication token"
    maxAge="${30 * 24 * 60 * 60}"
    path="/"
    secure="on"
  />
</isif>
```

### Cookie Consent Tracking

```isml
<iscookie
  name="cookieConsent"
  value="${pdict.consentLevel}"
  comment="Stores your cookie preferences and consent"
  maxAge="${365 * 24 * 60 * 60}"
  path="/"
  secure="on"
/>
```

### Delete a Cookie

```isml
<!-- Set maxAge to 0 to delete the cookie -->
<iscookie
  name="oldCookie"
  value=""
  maxAge="0"
/>
```

### Shopping Cart Cookie for Anonymous Users

```isml
<iscookie
  name="anonymousBasket"
  value="${session.custom.basketID}"
  comment="Stores your shopping cart for your next visit"
  maxAge="${7 * 24 * 60 * 60}"
  path="/"
  secure="on"
/>
```

### Locale Preference

```isml
<iscookie
  name="locale"
  value="${request.locale}"
  comment="Your preferred language and region settings"
  maxAge="${90 * 24 * 60 * 60}"
  path="/"
  secure="on"
/>
```

## Reading Cookies

### In ISML Templates

Access cookies from the current request using the `request.httpCookies` object:

```isml
<!-- Check if cookie exists -->
<isif condition="${request.httpCookies['UserID'] != null}">
  <isredirect location="${URLUtils.url('LoginPanel')}"/>
</isif>

<!-- Read cookie value -->
<isset name="userID" value="${request.httpCookies['UserID'].value}" scope="page"/>
<div>Welcome back, User ${userID}</div>

<!-- Conditional logic based on cookie -->
<isif condition="${request.httpCookies['cookieConsent'] != null}">
  <!-- Show analytics scripts -->
  <isinclude template="analytics/tracking"/>
</isif>
```

### In Scripts

```javascript
// Check if cookie exists
if (request.httpCookies.UserID != null) {
    var userID = request.httpCookies.UserID.value;
    // Use userID...
}

// Iterate over all cookies
var cookies = request.httpCookies;
for (var cookieName in cookies) {
    var cookie = cookies[cookieName];
    Logger.debug('Cookie: {0} = {1}', cookieName, cookie.value);
}

// Get specific cookie
var Cookie = require('dw/web/Cookie');
var userCookie = request.httpCookies['UserID'];
if (userCookie) {
    var value = userCookie.value;
    var domain = userCookie.domain;
    var path = userCookie.path;
    var maxAge = userCookie.maxAge;
}
```

## Security Best Practices

### Always Use Secure Flag for Sensitive Data

```isml
<!-- Good: Secure flag for authentication tokens -->
<iscookie
  name="authToken"
  value="${token}"
  secure="on"
  maxAge="3600"
/>

<!-- Bad: Sensitive data without secure flag -->
<iscookie
  name="authToken"
  value="${token}"
  secure="off"  <!-- INSECURE -->
/>
```

### Use HTTPS in Production

**Critical:** Always enable **"Enforce HTTPS"** in production environments to ensure:
- `SameSite=None` is set automatically
- `Secure` flag is set automatically
- Protection against man-in-the-middle attacks

### Limit Cookie Lifetime

```isml
<!-- Good: Short lifetime for sensitive data -->
<iscookie
  name="sessionToken"
  value="${token}"
  maxAge="3600"
  secure="on"
/>

<!-- Avoid: Overly long lifetime for sensitive data -->
<iscookie
  name="sessionToken"
  value="${token}"
  maxAge="${365 * 24 * 60 * 60}"  <!-- Too long for session data -->
  secure="on"
/>
```

### Provide Meaningful Comments

```isml
<!-- Good: Clear privacy documentation -->
<iscookie
  name="UserID"
  value="${customer.UUID}"
  comment="Stores your unique customer identifier to personalize your shopping experience and remember your preferences"
  secure="on"
/>

<!-- Less helpful: Vague comment -->
<iscookie
  name="UserID"
  value="${customer.UUID}"
  comment="User data"
/>
```

### Use Specific Paths When Possible

```isml
<!-- Good: Restrict cookie to specific path -->
<iscookie
  name="checkoutToken"
  value="${token}"
  path="/checkout"
  maxAge="1800"
  secure="on"
/>

<!-- Less secure: Site-wide access when not needed -->
<iscookie
  name="checkoutToken"
  value="${token}"
  path="/"
  maxAge="1800"
  secure="on"
/>
```

### Never Store Passwords

```isml
<!-- NEVER DO THIS -->
<iscookie
  name="password"
  value="${customer.password}"  <!-- NEVER STORE PASSWORDS -->
  secure="on"
/>

<!-- Instead: Use tokens -->
<iscookie
  name="authToken"
  value="${generateSecureToken(customer)}"
  secure="on"
  maxAge="3600"
/>
```

## Privacy and Compliance

### GDPR and Cookie Consent

For GDPR compliance, implement cookie consent management:

```isml
<!-- Only set non-essential cookies after consent -->
<isif condition="${pdict.hasAnalyticsConsent}">
  <iscookie
    name="analyticsID"
    value="${pdict.analyticsIdentifier}"
    comment="Used to analyze site usage and improve your shopping experience"
    maxAge="${90 * 24 * 60 * 60}"
    secure="on"
  />
</isif>

<!-- Essential cookies can be set without consent -->
<iscookie
  name="sessionID"
  value="${session.sessionID}"
  comment="Essential for site functionality and security"
  maxAge="-1"
  secure="on"
/>
```

### Cookie Categories

Implement different cookie types with appropriate consent:

```isml
<!-- Essential Cookies (no consent required) -->
<iscookie name="sessionID" value="${session.ID}" maxAge="-1" secure="on"/>

<!-- Functional Cookies (consent recommended) -->
<isif condition="${pdict.functionalConsent}">
  <iscookie name="preferences" value="${prefs}" maxAge="${90 * 24 * 60 * 60}" secure="on"/>
</isif>

<!-- Analytics Cookies (consent required) -->
<isif condition="${pdict.analyticsConsent}">
  <iscookie name="analytics" value="${id}" maxAge="${90 * 24 * 60 * 60}" secure="on"/>
</isif>

<!-- Marketing Cookies (consent required) -->
<isif condition="${pdict.marketingConsent}">
  <iscookie name="marketing" value="${id}" maxAge="${90 * 24 * 60 * 60}" secure="on"/>
</isif>
```

### Transparency Requirements

```isml
<iscookie
  name="UserTracking"
  value="${trackingID}"
  comment="This cookie tracks your browsing behavior to provide personalized product recommendations. You can opt out in your privacy settings."
  maxAge="${30 * 24 * 60 * 60}"
  secure="on"
/>
```

## Performance Considerations

### Cookie Size Limits

**Browser Limits:**
- Maximum cookie size: ~4KB per cookie
- Maximum cookies per domain: ~50-180 (varies by browser)
- Maximum total size: ~4KB * number of cookies

**Best Practices:**
- Keep cookie values small
- Don't store large objects in cookies
- Use server-side session storage for large data

```isml
<!-- Bad: Storing large data in cookie -->
<iscookie
  name="cartData"
  value="${JSON.stringify(basket)}"  <!-- Could exceed 4KB -->
/>

<!-- Good: Store reference, keep data server-side -->
<iscookie
  name="cartID"
  value="${basket.UUID}"  <!-- Small reference -->
  secure="on"
/>
```

### Minimize Cookie Count

```isml
<!-- Less efficient: Multiple cookies -->
<iscookie name="language" value="${locale.language}"/>
<iscookie name="country" value="${locale.country}"/>
<iscookie name="currency" value="${currency}"/>

<!-- More efficient: Single cookie with JSON -->
<isscript>
  var prefs = {
    language: locale.language,
    country: locale.country,
    currency: currency
  };
</isscript>
<iscookie name="preferences" value="${JSON.stringify(prefs)}"/>
```

## Troubleshooting

### Cookie Not Being Set

**Problem:** Cookie doesn't appear in browser.

**Solution:**
1. Check that both `name` and `value` are provided
2. Verify cookie name doesn't start with `$`
3. Ensure `<iscookie>` is executed (not inside false conditional)
4. Check browser cookie settings aren't blocking cookies

```isml
<!-- Verify execution -->
<iscomment>Cookie should be set here</iscomment>
<iscookie name="testCookie" value="testValue" maxAge="3600"/>
```

### Cookie Not Being Sent

**Problem:** Cookie exists but isn't sent with requests.

**Solution:**
1. Check `domain` attribute matches request domain
2. Verify `path` attribute includes request path
3. Ensure cookie hasn't expired (`maxAge`)
4. Check `secure` flag if using HTTP

```isml
<!-- Check domain matches -->
<iscookie 
  name="UserID" 
  value="${id}"
  domain=".yoursite.com"  <!-- Must match request domain -->
  path="/"                <!-- Must include request path -->
/>
```

### Secure Cookie on HTTP

**Problem:** Cookie with `secure="on"` not working on HTTP.

**Solution:** Secure cookies only work on HTTPS. Either:
- Use HTTPS
- Remove `secure="on"` for development (not recommended for production)

```isml
<!-- Development: conditional secure flag -->
<isscript>
  var isProduction = System.getInstanceType() === System.PRODUCTION_SYSTEM;
</isscript>

<iscookie
  name="devCookie"
  value="${value}"
  secure="${isProduction ? 'on' : 'off'}"
/>
```

### Cookie Deleted Unexpectedly

**Problem:** Cookie disappears before expected.

**Solution:**
1. Check `maxAge` value is correct (remember it's in seconds)
2. Verify another part of code isn't deleting it (`maxAge="0"`)
3. Check browser settings for cookie retention

```isml
<!-- Verify maxAge calculation -->
<isscript>
  var thirtyDays = 30 * 24 * 60 * 60;  // 2,592,000 seconds
</isscript>
<iscookie name="longLived" value="${value}" maxAge="${thirtyDays}"/>
```

## Related Elements and APIs

- **`request.httpCookies`**: Read cookies in ISML templates
- **`dw.web.Cookie`**: Programmatic cookie class
- **`dw.web.Cookies`**: Cookie collection class
- **`dw.system.Request`**: Request object with cookie access

## Summary

The `<iscookie>` element is essential for:

- ✅ Storing user preferences and personalization data
- ✅ Managing session state for anonymous users
- ✅ Enabling "Remember Me" functionality
- ✅ Tracking consent and privacy preferences
- ✅ Supporting shopping cart persistence
- ✅ Automatic `SameSite` attribute management
- ✅ Security with `Secure` flag for HTTPS-only transmission
- ✅ Compliance with 6-month maximum lifetime regulation

Always prioritize security, privacy, and transparency when implementing cookies in your B2C Commerce storefront.
