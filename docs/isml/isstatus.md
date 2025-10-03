# ISML isstatus Element

## Overview

The `<isstatus>` element sets the HTTP response status code for the current page response. It provides control over HTTP status codes, enabling proper handling of redirects, errors, and special response conditions. This element is essential for SEO, proper HTTP semantics, and client-side behavior control.

**Key Features:** HTTP status code control; redirect support (301, 302, 307); error handling (404, 410, 500); caching behavior control; RESTful API responses.

## Syntax

```isml
<isstatus
  value = http_code     // required
/>
```

## Required Attributes

### value

**Type:** String or Expression  
**Required:** Yes  
**Allowed Data Type:** String or expression that evaluates to an integer

Specifies the HTTP response status code. Must evaluate to a valid integer HTTP status code.

**Common HTTP Status Codes:**

| Code | Name | Description | Use Case |
|------|------|-------------|----------|
| 200 | OK | Standard successful response | Default, rarely needs explicit setting |
| 301 | Moved Permanently | Resource permanently moved | Permanent URL changes, cached by WebAdapter |
| 302 | Found (Temporary Redirect) | Resource temporarily moved | Temporary redirects, cached by WebAdapter |
| 304 | Not Modified | Resource not modified | Cache validation |
| 307 | Temporary Redirect | Temporary redirect (preserves method) | Temporary redirects preserving HTTP method |
| 400 | Bad Request | Invalid client request | Form validation errors |
| 401 | Unauthorized | Authentication required | Login required |
| 403 | Forbidden | Access denied | Insufficient permissions |
| 404 | Not Found | Resource not found | Missing pages/products |
| 410 | Gone | Resource permanently removed | Deleted content, cached by WebAdapter |
| 500 | Internal Server Error | Server error | Unexpected errors |
| 503 | Service Unavailable | Service temporarily unavailable | Maintenance mode |

**Examples:**
```isml
<!-- Temporary redirect -->
<isstatus value="307"/>

<!-- Gone - resource permanently removed -->
<isstatus value="410"/>

<!-- Not Found -->
<isstatus value="404"/>

<!-- Permanent redirect -->
<isstatus value="301"/>

<!-- Using expression -->
<isstatus value="${pdict.statusCode}"/>

<!-- Conditional status code -->
<isstatus value="${pdict.found ? 200 : 404}"/>
```

## Purpose

The `<isstatus>` element serves several critical purposes:

1. **HTTP Semantics:** Provide correct HTTP status codes for proper client/server communication
2. **SEO Optimization:** Ensure search engines understand page status (redirects, errors, gone)
3. **Cache Control:** Influence caching behavior for specific status codes (301, 302, 410)
4. **Error Handling:** Signal error conditions to clients and browsers
5. **Redirect Management:** Control redirect behavior and method preservation
6. **API Responses:** Set appropriate status codes for RESTful API endpoints

## WebAdapter Caching Behavior

The Salesforce B2C Commerce WebAdapter caches responses with specific status codes:

### Cached Status Codes

| Status Code | Status Name | Cache Behavior |
|-------------|-------------|----------------|
| 301 | Moved Permanently | Cached - permanent redirects |
| 302 | Found (Temporary Redirect) | Cached - temporary redirects |
| 410 | Gone | Cached - permanently removed resources |

**Important Notes:**
- These status codes are explicitly cached by the WebAdapter
- Caching improves performance for frequently accessed redirects and gone resources
- Cache invalidation may be needed when redirect targets change
- 410 is one of the few error codes cached in the B2C Commerce Web Server

### Non-Cached Status Codes

Most other status codes (200, 404, 500, etc.) follow standard caching rules based on cache headers and configuration.

## Common Use Cases

### Temporary Redirect (307)

```isml
<!-- Redirect preserving HTTP method -->
<isstatus value="307"/>
```

**Use Cases:**
- Temporary URL changes
- A/B testing redirects
- Seasonal redirects
- Maintenance redirects

**Characteristics:**
- Preserves HTTP method (POST remains POST)
- Indicates temporary nature to search engines
- Client should continue using original URL

### Gone - Resource Permanently Removed (410)

```isml
<!-- Indicate resource is permanently gone -->
<isstatus value="410"/>
```

**Use Cases:**
- Discontinued products with no replacement
- Permanently removed content
- Deleted pages that shouldn't show 404
- SEO signal that page won't return

**Characteristics:**
- Cached by WebAdapter for performance
- Signals to search engines to remove from index
- More specific than 404 for SEO purposes
- No forwarding address available

### Permanent Redirect (301)

```isml
<!-- Permanent redirect to new location -->
<isstatus value="301"/>
<isredirect location="${newURL}"/>
```

**Use Cases:**
- Permanent URL structure changes
- Product URL updates
- Site reorganization
- Domain changes

**Characteristics:**
- Cached by WebAdapter
- Search engines transfer ranking to new URL
- Browsers may cache redirect permanently
- Indicates resource has moved forever

### Temporary Redirect (302)

```isml
<!-- Temporary redirect -->
<isstatus value="302"/>
<isredirect location="${tempURL}"/>
```

**Use Cases:**
- Temporary promotions
- Seasonal content
- Short-term redirects
- A/B testing

**Characteristics:**
- Cached by WebAdapter
- Search engines don't transfer ranking
- Original URL remains canonical

### Not Found (404)

```isml
<!-- Product not found -->
<isif condition="${empty(pdict.Product)}">
    <isstatus value="404"/>
    <h1>Product Not Found</h1>
    <p>The requested product could not be found.</p>
</isif>
```

**Use Cases:**
- Missing products
- Invalid URLs
- Deleted pages (when not using 410)
- Resources that may return later

**Characteristics:**
- Standard error for missing resources
- Search engines may temporarily keep in index
- May retry later
- Less specific than 410

### Bad Request (400)

```isml
<!-- Invalid form data -->
<isif condition="${pdict.invalidRequest}">
    <isstatus value="400"/>
    <div class="error">Invalid request parameters</div>
</isif>
```

**Use Cases:**
- Invalid form submissions
- Malformed request parameters
- Validation errors
- API request errors

### Unauthorized (401)

```isml
<!-- Authentication required -->
<isif condition="${!customer.authenticated}">
    <isstatus value="401"/>
    <h1>Authentication Required</h1>
    <p>Please log in to access this resource.</p>
</isif>
```

**Use Cases:**
- Protected pages requiring login
- API authentication failures
- Session expiration
- Account pages without authentication

### Forbidden (403)

```isml
<!-- Access denied -->
<isif condition="${!hasPermission}">
    <isstatus value="403"/>
    <h1>Access Denied</h1>
    <p>You do not have permission to access this resource.</p>
</isif>
```

**Use Cases:**
- Insufficient permissions
- Restricted content
- Role-based access denial
- Blocked users

### Internal Server Error (500)

```isml
<!-- Server error -->
<isif condition="${pdict.error}">
    <isstatus value="500"/>
    <h1>Server Error</h1>
    <p>An unexpected error occurred. Please try again later.</p>
</isif>
```

**Use Cases:**
- Unexpected errors
- Exception handling
- System failures
- Database errors

## Advanced Use Cases

### Conditional Status Based on Product Availability

```isml
<isif condition="${!empty(pdict.Product)}">
    <!-- Product exists - default 200 OK -->
    <div class="product-detail">
        <!-- Product content -->
    </div>
<iselseif condition="${pdict.productDiscontinued}">
    <!-- Product permanently discontinued -->
    <isstatus value="410"/>
    <div class="product-gone">
        <h1>Product No Longer Available</h1>
        <p>This product has been discontinued and is no longer available.</p>
    </div>
<iselse/>
    <!-- Product not found -->
    <isstatus value="404"/>
    <div class="product-not-found">
        <h1>Product Not Found</h1>
        <p>The requested product could not be found.</p>
    </div>
</isif>
```

### Dynamic Status Code from Pipeline

```isml
<!-- Status code determined by controller logic -->
<isif condition="${!empty(pdict.statusCode)}">
    <isstatus value="${pdict.statusCode}"/>
</isif>

<!-- Render appropriate content -->
<isif condition="${pdict.statusCode == 404}">
    <isinclude template="error/notFound"/>
<iselseif condition="${pdict.statusCode == 410}">
    <isinclude template="error/gone"/>
<iselseif condition="${pdict.statusCode == 500}">
    <isinclude template="error/serverError"/>
</isif>
```

### Category Page with Status Handling

```isml
<isif condition="${!empty(pdict.ProductSearchResult.category)}">
    <!-- Category exists -->
    <div class="category-page">
        <!-- Category content -->
    </div>
<iselseif condition="${pdict.categoryDeleted}">
    <!-- Category permanently removed -->
    <isstatus value="410"/>
    <h1>Category No Longer Available</h1>
    <p>This category has been removed from our catalog.</p>
<iselse/>
    <!-- Category not found -->
    <isstatus value="404"/>
    <h1>Category Not Found</h1>
    <p>The requested category could not be found.</p>
</isif>
```

### API Response Status Handling

```isml
<iscontent type="application/json" charset="UTF-8"/>

<isif condition="${pdict.apiError}">
    <!-- Set appropriate error status -->
    <isif condition="${pdict.apiError.type == 'validation'}">
        <isstatus value="400"/>
    <iselseif condition="${pdict.apiError.type == 'authentication'}">
        <isstatus value="401"/>
    <iselseif condition="${pdict.apiError.type == 'permission'}">
        <isstatus value="403"/>
    <iselseif condition="${pdict.apiError.type == 'notfound'}">
        <isstatus value="404"/>
    <iselse/>
        <isstatus value="500"/>
    </isif>
    
    <!-- Return error JSON -->
    {
        "error": {
            "code": "${pdict.apiError.code}",
            "message": "${pdict.apiError.message}"
        }
    }
<iselse/>
    <!-- Success response -->
    {
        "success": true,
        "data": ${pdict.apiResponse}
    }
</isif>
```

### Search Results Status Handling

```isml
<isif condition="${!empty(pdict.ProductSearchResult.products)}">
    <!-- Products found - default 200 -->
    <div class="search-results">
        <isloop items="${pdict.ProductSearchResult.products}" var="product">
            <!-- Product rendering -->
        </isloop>
    </div>
<iselseif condition="${!empty(pdict.searchTerm) && pdict.ProductSearchResult.count == 0}">
    <!-- Search performed but no results - still 200 OK -->
    <div class="no-results">
        <h2>No results found for "${pdict.searchTerm}"</h2>
        <p>Please try a different search term.</p>
    </div>
<iselse/>
    <!-- Invalid search - bad request -->
    <isstatus value="400"/>
    <div class="invalid-search">
        <h2>Invalid Search</h2>
        <p>Please provide a search term.</p>
    </div>
</isif>
```

### Maintenance Mode

```isml
<isif condition="${dw.system.Site.current.getCustomPreferenceValue('maintenanceMode')}">
    <!-- Site in maintenance mode -->
    <isstatus value="503"/>
    <iscontent type="text/html" charset="UTF-8"/>
    <!DOCTYPE html>
    <html>
        <head>
            <title>Maintenance Mode</title>
        </head>
        <body>
            <h1>Site Maintenance</h1>
            <p>Our site is currently undergoing scheduled maintenance.</p>
            <p>Please check back soon.</p>
        </body>
    </html>
<iselse/>
    <!-- Normal site operation -->
    <!-- Regular content -->
</isif>
```

## Integration with Other ISML Elements

### With isredirect

```isml
<!-- Permanent redirect with status code -->
<isstatus value="301"/>
<isredirect location="${URLUtils.url('Product-Show', 'pid', pdict.newProductID)}"/>

<!-- Temporary redirect -->
<isstatus value="307"/>
<isredirect location="${URLUtils.url('Page-Show', 'cid', 'temporary-page')}"/>
```

### With iscontent

```isml
<!-- JSON API error response -->
<iscontent type="application/json" charset="UTF-8"/>
<isstatus value="404"/>
{
    "error": "Resource not found"
}

<!-- XML error response -->
<iscontent type="application/xml" charset="UTF-8"/>
<isstatus value="500"/>
<error>
    <message>Internal server error</message>
</error>
```

### With isif for Conditional Status

```isml
<isif condition="${empty(pdict.Product)}">
    <isstatus value="404"/>
    <isinclude template="error/productNotFound"/>
<iselseif condition="${!pdict.Product.online}">
    <isstatus value="410"/>
    <isinclude template="error/productDiscontinued"/>
<iselse/>
    <!-- Default 200 status -->
    <isinclude template="product/productDetail"/>
</isif>
```

## Best Practices

### 1. Set Status Before Content Output

```isml
<!-- ✅ Good: Set status before content -->
<isstatus value="404"/>
<h1>Not Found</h1>

<!-- ❌ Bad: Setting status after content may not work -->
<h1>Not Found</h1>
<isstatus value="404"/>
```

### 2. Use Appropriate Status Codes for SEO

```isml
<!-- ✅ Good: 410 for permanently removed products -->
<isif condition="${pdict.productDiscontinued}">
    <isstatus value="410"/>
</isif>

<!-- ❌ Less optimal: 404 for permanently removed -->
<isif condition="${pdict.productDiscontinued}">
    <isstatus value="404"/>
</isif>
```

### 3. Combine with isredirect for Redirects

```isml
<!-- ✅ Good: Explicit status with redirect -->
<isstatus value="301"/>
<isredirect location="${newURL}"/>

<!-- ⚠️ Works but less explicit -->
<isredirect location="${newURL}" permanent="true"/>
```

### 4. Use 410 Instead of 404 for Permanently Removed Content

```isml
<!-- ✅ Good: Clear signal to search engines -->
<isif condition="${pdict.pageDeleted}">
    <isstatus value="410"/>
    <h1>Page Permanently Removed</h1>
</isif>

<!-- ❌ Less optimal: 404 suggests page might return -->
<isif condition="${pdict.pageDeleted}">
    <isstatus value="404"/>
    <h1>Page Not Found</h1>
</isif>
```

### 5. Provide Meaningful Error Content

```isml
<!-- ✅ Good: Status code with helpful content -->
<isstatus value="404"/>
<div class="error-page">
    <h1>Product Not Found</h1>
    <p>The product you're looking for could not be found.</p>
    <a href="${URLUtils.url('Search-Show')}">Browse our catalog</a>
</div>
```

### 6. Use Correct Status for API Responses

```isml
<!-- ✅ Good: RESTful API status codes -->
<iscontent type="application/json"/>
<isif condition="${pdict.validationError}">
    <isstatus value="400"/>
<iselseif condition="${!pdict.authenticated}">
    <isstatus value="401"/>
<iselseif condition="${!pdict.authorized}">
    <isstatus value="403"/>
<iselseif condition="${!pdict.found}">
    <isstatus value="404"/>
<iselseif condition="${pdict.serverError}">
    <isstatus value="500"/>
</isif>
```

## SEO Considerations

### 301 vs 302 vs 307 Redirects

```isml
<!-- 301: Permanent redirect - transfers SEO value -->
<isstatus value="301"/>
<isredirect location="${newPermanentURL}"/>

<!-- 302: Temporary redirect - doesn't transfer SEO value -->
<isstatus value="302"/>
<isredirect location="${temporaryURL}"/>

<!-- 307: Temporary redirect - preserves HTTP method -->
<isstatus value="307"/>
<isredirect location="${temporaryURL}"/>
```

### 404 vs 410 for Missing Content

```isml
<!-- 410: Permanently gone - search engines remove from index -->
<isif condition="${pdict.permanentlyRemoved}">
    <isstatus value="410"/>
</isif>

<!-- 404: Not found - search engines may retry later -->
<isif condition="${pdict.temporarilyUnavailable}">
    <isstatus value="404"/>
</isif>
```

## Performance Considerations

### Cached Status Codes

Status codes 301, 302, and 410 are cached by the WebAdapter:

```isml
<!-- These responses are cached for better performance -->
<isstatus value="301"/>  <!-- Cached -->
<isstatus value="302"/>  <!-- Cached -->
<isstatus value="410"/>  <!-- Cached -->

<!-- These follow standard caching rules -->
<isstatus value="404"/>  <!-- Not specially cached -->
<isstatus value="500"/>  <!-- Not specially cached -->
```

**Cache Implications:**
- Faster response times for frequently accessed redirects
- Reduced server load for gone resources
- May require cache invalidation when changing redirects
- Consider cache TTL when planning redirect changes

## Security Considerations

### Don't Expose System Information in Error Responses

```isml
<!-- ❌ Bad: Exposes system details -->
<isstatus value="500"/>
<div>Database error: ${pdict.exception.message}</div>

<!-- ✅ Good: Generic error message -->
<isstatus value="500"/>
<div>An error occurred. Please try again later.</div>
<!-- Log detailed error server-side -->
```

### Use 401 for Authentication, 403 for Authorization

```isml
<!-- ✅ Good: Clear distinction -->
<isif condition="${!customer.authenticated}">
    <isstatus value="401"/>  <!-- Not logged in -->
<iselseif condition="${!hasPermission}">
    <isstatus value="403"/>  <!-- Logged in but no permission -->
</isif>
```

## Troubleshooting

### Status Code Not Being Set

**Problem:** HTTP status code remains 200 despite `<isstatus>` tag.

**Solutions:**
- Ensure `<isstatus>` is called before any content output
- Check that status value is valid integer
- Verify no subsequent code overrides status
- Check for exceptions/errors preventing execution

### Redirect Not Working

**Problem:** Redirect status set but browser doesn't redirect.

**Solutions:**
- Combine with `<isredirect>` element
- Ensure no content is output before redirect
- Verify redirect location is valid
- Check browser cache if testing

### Cache Issues with Redirects

**Problem:** Redirect changes not taking effect.

**Solutions:**
- Remember 301, 302, 410 are cached by WebAdapter
- Clear WebAdapter cache after redirect changes
- Consider TTL implications for redirect changes
- Test in incognito/private mode

### Wrong Status Code for Use Case

**Problem:** Using incorrect status code for scenario.

**Solutions:**
- Use 410 (not 404) for permanently removed content
- Use 307 (not 302) when HTTP method must be preserved
- Use 401 for authentication, 403 for authorization
- Consult HTTP status code specifications

## HTTP Status Code Reference

### Success Codes (2xx)

- **200 OK** - Standard success (default, rarely needs explicit setting)
- **201 Created** - Resource created successfully
- **204 No Content** - Success with no response body

### Redirect Codes (3xx)

- **301 Moved Permanently** - Permanent redirect (cached)
- **302 Found** - Temporary redirect (cached)
- **304 Not Modified** - Cache validation
- **307 Temporary Redirect** - Temporary redirect preserving method

### Client Error Codes (4xx)

- **400 Bad Request** - Invalid request
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Access denied
- **404 Not Found** - Resource not found
- **410 Gone** - Resource permanently removed (cached)

### Server Error Codes (5xx)

- **500 Internal Server Error** - Server error
- **503 Service Unavailable** - Service temporarily unavailable

## Related Elements

- **`<isredirect>`** - Redirect to another URL (often used with 301, 302, 307)
- **`<iscontent>`** - Set content type (often used with status codes for API responses)
- **`<isif>`** - Conditional status code logic
- **`<isinclude>`** - Include error page templates based on status

## See Also

- [isredirect](./isredirect.md) - Redirect responses
- [iscontent](./iscontent.md) - Set content type for responses
- [isif](./isif.md) - Conditional logic for status codes
