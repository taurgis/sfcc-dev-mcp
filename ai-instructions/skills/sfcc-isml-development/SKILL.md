---
name: sfcc-isml-development
description: Comprehensive guide for developing ISML templates in Salesforce B2C Commerce SFRA. Use this when asked to create, modify, or troubleshoot ISML templates, work with decorators, or implement template patterns.
---

# Salesforce B2C Commerce ISML Templates: Best Practices & Development Guide

This guide provides comprehensive best practices for developing ISML (Internet Store Markup Language) templates within the Salesforce B2C Commerce Storefront Reference Architecture (SFRA). Master these principles to build secure, maintainable, and high-performing storefront experiences.

**IMPORTANT**: Before developing ISML templates, consult the **sfcc-performance** and **sfcc-sfra-controllers** skills. Understanding the MVC separation and controller patterns is essential for proper ISML development.

## Quick Checklist

Use this as a pre-flight check before shipping an ISML change:

```text
[ ] No business logic in ISML (no data fetches, no persistence)
[ ] `<isscript>` used only for asset registration (CSS/JS)
[ ] Output encoding is NOT disabled unless justified and safe
[ ] `<iscontent>` / `<isredirect>` / `<iscache>` placement constraints respected
[ ] Remote includes (`<isinclude url="...">`) used sparingly and secured
[ ] Template receives all data via `pdict` (controller/model owns data shaping)
```

## Core Principles

### The Golden Rule: Logic-Free Templates

**NEVER use `<isscript>` for business logic in ISML templates.** This is the most critical rule in SFRA development.

ISML templates are presentation-only layers that should receive all data from controllers via the `pdict` object. Any business logic, data manipulation, or API calls belong in controllers or models.

#### ❌ Anti-Pattern: Logic in Templates
```html
<isscript>
    var ProductMgr = require('dw/catalog/ProductMgr');
    var product = ProductMgr.getProduct(pdict.pid);
    var price = product.getPriceModel().getPrice();
</isscript>
<div class="price">${price}</div>
```

#### ✅ Correct Pattern: Data from Controller
```javascript
// Controller
server.get('Show', function (req, res, next) {
    var product = ProductFactory.get({ pid: req.querystring.pid });
    res.render('product/productDetails', { product: product });
    next();
});
```

```html
<!-- ISML Template -->
<div class="price">${pdict.product.price.sales.formatted}</div>
```

### Exception: Asset Management Only

The **only** acceptable use of `<isscript>` is for managing static assets:

```html
<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/product.css');
    assets.addJs('/js/product.js');
</isscript>
```

## Tag Location Constraints (Common Gotcha)

Some ISML tags have strict placement rules. When debugging “parser” errors, check these first:

| Tag | Constraint (high level) |
|-----|--------------------------|
| `<iscontent>` | Must appear before the document output (place it at the very top of the template) |
| `<isredirect>` | Must appear before the document output (place it at the very top of the template) |
| `<iscache>` | Place it at the beginning of the template for predictable behavior |
| `<isreplace/>` | Only meaningful inside a decorator template used by `<isdecorate>` |
| `<isbreak>` / `<iscontinue>` / `<isnext>` | Only valid inside `<isloop>` |

When in doubt about a specific element, prefer querying the ISML element docs via this MCP server.

## Using This MCP Server for ISML Reference

When you’re unsure about a tag/attribute or need examples, use these tools instead of guessing:

- `mcp_sfcc-dev-mcp_search_isml_elements` (search by intent, e.g. “loop”, “cache”, “include”)
- `mcp_sfcc-dev-mcp_get_isml_element` (full documentation for one element)

## Security Best Practices

### XSS Prevention with Proper Encoding

**Always rely on default encoding.** The `<isprint>` tag automatically HTML-encodes output to prevent XSS attacks.

#### ✅ Secure (Default Behavior)
```html
<div class="search-term">
    You searched for: <isprint value="${pdict.searchPhrase}" />
</div>
```

#### ❌ Vulnerable
```html
<div class="search-term">
    You searched for: <isprint value="${pdict.searchPhrase}" encoding="off" />
</div>
```

### Context-Specific Encoding

For non-HTML contexts, use `dw.util.SecureEncoder`:

```html
<isscript>
    var SecureEncoder = require('dw/util/SecureEncoder');
</isscript>

<!-- For JavaScript context -->
<script>
    var searchTerm = "${SecureEncoder.forJavaScript(pdict.searchPhrase)}";
</script>

<!-- For HTML attributes -->
<input type="hidden" value="${SecureEncoder.forHTMLAttribute(pdict.token)}" />
```

## Template Architecture Patterns

### 1. Layout Decorators

Use decorators for consistent page structure:

#### SFRA Default Decorator Templates

**IMPORTANT**: SFRA provides only **two default decorator templates** out of the box:

1. **`common/layout/page`** - Standard storefront pages (homepage, PDP, search, account, etc.)
2. **`common/layout/checkout`** - Secure checkout process pages

If you need additional layout patterns (modal dialogs, email templates, mobile-specific layouts, etc.), you must **create custom decorator templates** in your cartridge's `templates/default/common/layout/` directory.

#### Common Custom Decorators You May Need to Create:

```html
<!-- Custom Modal Layout -->
common/layout/modal.isml

<!-- Email Template Layout -->
common/layout/email.isml

<!-- Popup/Lightbox Layout -->
common/layout/popup.isml

<!-- Print-Friendly Layout -->
common/layout/print.isml

<!-- Mobile App Layout -->
common/layout/mobile.isml
```

#### Default Template Usage Examples:

**Using the Standard Page Layout**:
```html
<!-- ✅ Standard storefront pages -->
<isdecorate template="common/layout/page">
    <div class="product-details">
        <h1><isprint value="${pdict.product.productName}" /></h1>
        <!-- Content goes here -->
    </div>
</isdecorate>
```

**Using the Checkout Layout**:
```html
<!-- ✅ Secure checkout pages -->
<isdecorate template="common/layout/checkout">
    <div class="checkout-content">
        <h1>Checkout</h1>
        <!-- Checkout form content -->
    </div>
</isdecorate>
```

#### Creating Custom Decorator Templates:

If you need a custom layout, create it in your cartridge at `templates/default/common/layout/[name].isml`:

**Example Custom Modal Layout** (`common/layout/modal.isml`):
```html
<!doctype html>
<html lang="${require('dw/util/Locale').getLocale(request.locale).getLanguage()}">
<head>
    <isinclude template="common/htmlHead" />
</head>
<body class="modal-body">
    <div class="modal-container">
        <header class="modal-header">
            <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
            </button>
        </header>
        <main class="modal-content">
            <isreplace/>
        </main>
    </div>
</body>
</html>
```

**Using Your Custom Layout**:
```html
<!-- ✅ Using custom decorator template -->
<isdecorate template="common/layout/modal">
    <div class="modal-body-content">
        <h2>Modal Title</h2>
        <p>Modal content goes here</p>
    </div>
</isdecorate>
```

### 2. Component Modularity

Break complex templates into reusable components:

**Product Tile Component** (`product/components/productTile.isml`):
```html
<div class="product-tile" data-pid="${pdict.product.id}">
    <div class="tile-image">
        <isinclude template="product/components/productTileImage" />
    </div>
    
    <div class="tile-body">
        <div class="pdp-link">
            <a class="link" href="${pdict.product.url}">
                <isprint value="${pdict.product.productName}" />
            </a>
        </div>
        
        <isinclude template="product/components/pricing/main" />
        
        <isinclude template="product/components/productTileActions" />
    </div>
</div>
```

**Usage in Grid**:
```html
<div class="row product-grid">
    <isloop items="${pdict.productSearch.productHits}" var="productHit">
        <div class="col-6 col-sm-4">
            <isinclude template="product/components/productTile" />
            <isset name="product" value="${productHit.product}" scope="page" />
        </div>
    </isloop>
</div>
```

### 3. Remote Includes vs Local Includes (Advanced Fragment Architecture)

Remote includes are NOT just an alternative syntax – they change request boundaries, data scoping, caching strategy, security posture, and performance characteristics. Choose them only when a fragment truly needs an independent cache policy or isolation.

| Attribute | Local Include `<isinclude template="...">` | Remote Include `<isinclude url="...">` |
|-----------|---------------------------------------------|-------------------------------------------|
| Processing | Single request on Application Server | Parent request + secondary request orchestrated by Web Adapter |
| Data Scope | Full access to parent `pdict` & variables | Isolated – only URL query params available |
| Cache Policy | Inherits parent (lowest TTL wins) | Independent TTL per fragment |
| Typical Use | Reusable markup, product tile partials | Mini-cart, personalized promo slot, dynamic inventory widget |
| Overhead | Minimal | Extra HTTP round trip per include |
| Security | Inherits parent auth state | New unauthenticated request – must add explicit protection |
| Failure Mode | Template error breaks page render | Fragment timeout can delay full page assembly |

#### 3.1 When to Use Which
Use a local include unless ALL are true:
1. Fragment volatility differs meaningfully from page shell
2. Output can be parameterized via simple query params
3. Performance gain from separate caching outweighs added request
4. Security implications are understood and mitigated

#### 3.2 Implementing a Remote Include
Template example (mini-cart header icon kept uncached while page shell cached hours):
```html
<div class="header-cart" data-component="mini-cart">
    <isinclude url="${URLUtils.url('Cart-MiniCart')}" />
    <!-- Controller route name MUST match exactly -->
</div>
```

Controller (excerpt):
```javascript
var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('MiniCart',
    server.middleware.include, // Gatekeeper: only valid inside remote include flow
    cache.applyShortPromotionSensitiveCache, // Or cache.disableCaching() equivalent for uncached
    function (req, res, next) {
        // Build isolated model – no parent pdict access
        res.render('components/header/miniCart');
        next();
    }
);

module.exports = server.exports();
```

#### 3.3 Passing Data
All context must be URL params:
```html
<isinclude url="${URLUtils.url('Page-Include', 'cid', 'footer-content-asset')}" />
```
Avoid over-parameterization – each unique full URL becomes a distinct cache entry (cache fragmentation risk).

#### 3.4 Caching Strategy Patterns
| Scenario | Page Shell TTL | Remote Include TTL | Rationale |
|----------|----------------|--------------------|-----------|
| Marketing landing + live inventory badge | 12h | 5m | Keep inventory fresh without invalidating hero layout |
| Category grid + personalized banner | 4h | 15m | Personalized offers rotate more often than navigation |
| PDP + mini-cart | 2h | 0 (uncached) | Basket state must reflect current session |

Keep total remote includes per page conservative (<20 recommended) to avoid waterfall latency.

#### 3.5 Performance Anti-Patterns
| Anti-Pattern | Why It's Harmful | Better Alternative |
|--------------|------------------|--------------------|
| One remote include per product tile in a grid | N extra HTTP requests, destroys cache efficiency | Single parent render with local includes |
| Adding position/index params that change per render | Creates unique cache keys, low hit ratio | Omit non-functional varying params |
| Deep nesting (include inside include chain) | Hard to debug, compounding latency | Flatten architecture – coalesce related fragments |

#### 3.6 Security Criticals
Remote include endpoints are effectively public unless you add authentication middleware (e.g., `userLoggedIn.validateLoggedIn`). NEVER expose PII or account state in an unprotected include.

Always start chain with:
```javascript
server.get('SensitiveFragment',
  server.middleware.include,
  userLoggedIn.validateLoggedIn, // if user-specific
  function (req, res, next) { ... }
);
```

#### 3.7 Observability & Debugging
Use extended request IDs in logs: `reqId-depth-index` (e.g., `AbC123-1-02`). Search logs to isolate slow fragment origins.

#### 3.8 Checklist
```text
[ ] Justified different cache TTL
[ ] URL params minimal & non-sensitive
[ ] server.middleware.include first
[ ] Additional auth middleware if user data
[ ] Explicit cache middleware (or disabled)
[ ] Fragment count on page < 20
[ ] No nested chains beyond depth 2
```

If you cannot satisfy most checklist items, prefer a local include.

#### 3.9 When NOT to Use Remote Includes
- Pure presentational partials (icons, button groups)
- Iterative children of a paginated list
- Form bodies that rely on parent controller's validation context
- Anything requiring access to parent `pdict` objects without trivial serialization

---

## Utility Helpers Available in Templates

SFRA templates run inside the B2C Commerce template processor, which autowires a set of utility objects and classes so you can call them without additional imports. Knowing what is available keeps templates lean and avoids unnecessary `<isscript>` blocks.

### Top-Level Variables

The template scope automatically exposes:

- `pdict`
- `out`
- `request`
- `session`

Each object gives you direct access to storefront context data and helper APIs.

### `dw.system.Request`

Because `request` is a top-level variable, you can call methods directly without `require` statements.

| Method | Description |
| --- | --- |
| `getHttpCookies()` → `Cookies` | Returns the `Cookies` object so you can inspect or manipulate client-side cookies. |
| `getHttpHeaders()` → `Map` | Returns a map of HTTP header values on the current request. |
| `isHttpSecure()` → `Boolean` | Indicates whether the request is secure (`HTTPS`). |
| `isSCAPI()` → `Boolean` | Distinguishes between OCAPI and SCAPI requests in extension points (hooks). |

**Example**

```html
<td class="price merchandizetotal">
    <isprint value="${request.custom.Container.adjustedMerchandiseTotalNetPrice}" />
</td>
```

### `dw.system.Session`

The `session` top-level variable exposes the current storefront or Business Manager session (Business Manager sessions return `null` for customer lookups).

| Method | Description |
| --- | --- |
| `getCustomer()` → `Customer` | Returns the current customer associated with the storefront session; `null` in Business Manager. |
| `isCustomerAuthenticated()` → `Boolean` | Indicates whether the customer for this session is authenticated (equivalent to `customer.isAuthenticated()`). |

**Example**

```html
<isprint value="${session.getCustomer().firstname}" />
```

### `dw.util.StringUtils`

`StringUtils` is pre-imported, letting you call static helpers by their simple name to format and sanitize output.

| Method | Description |
| --- | --- |
| `formatDate(date)` → `String` | Formats a `Date` with the current site's default date format. |
| `formatInteger(number)` → `String` | Formats a number using the site's default integer format; floats are coerced to integers. |
| `formatNumber(number)` → `String` | Formats a number using the site's default number format. |
| `garble(str, replaceChar, suffixLength)` → `String` | Masks a string, leaving the last `suffixLength` characters intact. |
| `pad(str, width)` → `String` | Pads a string to a target width (useful for alignment in tables). |
| `stringToHtml(str)` → `String` | Converts a string to an HTML-safe representation. |
| `stringToWml(str)` → `String` | Converts a string to a WML-safe representation. |
| `stringToXml(str)` → `String` | Converts a string to an XML-safe representation. |
| `trim(str)` → `String` | Removes leading and trailing whitespace. |
| `truncate(str, maxLength, mode, suffix)` → `String` | Truncates text using the provided mode and optional suffix. |

**Example**

```html
<isprint value="${StringUtils.pad('abc', 5)}" />
```

### `dw.web.URLUtils`

`URLUtils` is also pre-imported. Use it for URL generation instead of manual string concatenation.

| Method | Description |
| --- | --- |
| `abs(action, ...namesAndParams)` → `URL` | Generates an absolute URL using protocol and host from the calling request. |
| `http(action, ...namesAndParams)` → `URL` | Generates an absolute HTTP URL using site preferences when available. |
| `https(action, ...namesAndParams)` → `URL` | Generates an absolute HTTPS URL; respects secure host preferences. |
| `httpsWebRoot()` → `URL` | Returns an absolute HTTPS web root URL for static asset references. |
| `httpWebRoot()` → `URL` | Returns an absolute HTTP web root URL for static asset references. |
| `url(action, ...namesAndParams)` → `URL` | Generates a relative URL. |
| `webRoot()` → `URL` | Returns a relative web root URL for referencing static media. |

**Example**

```html
<form
    action="${URLUtils.httpsContinue()}"
    method="post"
    id="${pdict.CurrentForms.login.login.htmlName}"
>
</form>
```

---

## ISML Expressions

ISML expressions let templates embed storefront logic and data access inline, using syntax that mirrors JavaScript expressions. They are the primary way to render data from the Pipeline Dictionary (`pdict`) without resorting to `<isscript>` blocks.

### Expression Basics

- **Syntax**: `${ ... }` where `${` begins the expression and `}` ends it.
- **Scope**: Expressions evaluate in the context of template variables (`pdict`, `request`, `session`, etc.).
- **Usage**: Place expressions directly in markup or inside tag attributes. Always ensure the data you reference has been added to `pdict` (by the controller, decorator, or include).

#### Common Pattern

```html
${pdict.<KeyAttributeName>}
```

### Expression Examples

```html
<!-- Attribute value -->
<isprint value="${pdict.Product.name}" />

<!-- Method call on a pdict object -->
"${pdict.Product.getLongDescription() != null}"

<!-- Using URL helper within an attribute -->
<form
    action="${URLUtils.continueURL()}"
    method="post"
    id="${pdict.CurrentForms.cart.htmlName}"
>
</form>
```

### Additional Quick References

| Expression | Description |
| --- | --- |
| `${pdict.Product}` | References the current product object. |
| `${pdict.Content.template}` | Accesses the content asset template attribute. |
| `${pdict.ProductPrices}` | Outputs the product prices data structure placed in `pdict`. |
| `${pdict.Order.orderNo}` | Outputs the current order number. |

### Protected `</body>` Tag

The literal string `</body>` is reserved by the ISML parser. Do **not** include it in comments or inline scripts. If you need to emit the closing body tag from JavaScript, obfuscate it:

```javascript
var endBodyIndex = markup.indexOf('</bo' + 'dy>');
```

---

### 4. Essential ISML Tags & Usage
Renumbered after expanded section.

### Conditional Logic

```html
<isif condition="${pdict.product.available}">
    <span class="in-stock">In Stock</span>
<iselseif condition="${pdict.product.preorderAvailable}">
    <span class="preorder">Available for Pre-order</span>
<iselse>
    <span class="out-of-stock">Out of Stock</span>
</isif>
```

### Loops with Status

```html
<isloop items="${pdict.productSearch.productHits}" var="productHit" status="loopstate">
    <div class="product-item ${loopstate.first ? 'first' : ''} ${loopstate.last ? 'last' : ''}">
        <!-- Product content -->
    </div>
    
    <isif condition="${loopstate.count % 3 === 0 && !loopstate.last}">
        </div><div class="row"> <!-- Start new row every 3 items -->
    </isif>
</isloop>
```

### Variable Setting

Use `<isset>` sparingly and only for simple template variables:

```html
<isset name="showRatings" value="${pdict.product.ratingsEnabled && pdict.product.reviews.count > 0}" scope="page" />

<isif condition="${showRatings}">
    <isinclude template="product/components/reviews/reviewsSection" />
</isif>
```

## Performance Optimization

### Caching Strategy

**Controller-based caching** (preferred):
```javascript
// In controller
server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    // Controller logic
});
```

**Template-based caching** (for personalized content, also preferred in the controller):
```html
<iscache type="relative" hour="1" varyby="price_promotion" />
```

### Efficient Asset Loading

```html
<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/product.css');
    assets.addJs('/js/product.js');
</isscript>
```

## Localization Best Practices

### Simple Text Resources

```html
<!-- Properties file: checkout.properties -->
<!-- label.billing.address=Billing Address -->

<label class="form-control-label">
    ${Resource.msg('label.billing.address', 'checkout', 'Billing Address')}
</label>
```

### Parameterized Messages

```html
<!-- Properties file: cart.properties -->
<!-- items.in.cart=You have {0} items totaling {1} -->

<div class="cart-summary">
    ${Resource.msgf('items.in.cart', 'cart', null, pdict.basket.numItems, pdict.basket.subTotal)}
</div>
```

## Common Patterns & Examples

### 1. Form Rendering with Validation

```html
<form action="${URLUtils.url('Account-SubmitRegistration')}" method="post">
    <input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>
    
    <div class="form-group ${pdict.forms.profile.customer.firstname.invalid ? 'is-invalid' : ''}">
        <label for="registration-form-fname">
            ${Resource.msg('field.customer.firstname', 'registration', null)}
        </label>
        <input type="text" 
               class="form-control" 
               id="registration-form-fname"
               name="${pdict.forms.profile.customer.firstname.htmlName}"
               value="${pdict.forms.profile.customer.firstname.htmlValue}"
               <isprint value="${pdict.forms.profile.customer.firstname.attributes}" encoding="off" />>
        
        <isif condition="${pdict.forms.profile.customer.firstname.invalid}">
            <div class="invalid-feedback">
                <isprint value="${pdict.forms.profile.customer.firstname.error}" />
            </div>
        </isif>
    </div>
</form>
```

### 2. Product Grid with Pagination

```html
<div class="search-results">
    <div class="row product-grid">
        <isloop items="${pdict.productSearch.productHits}" var="productHit">
            <div class="col-6 col-sm-4 col-lg-3">
                <isset name="product" value="${productHit.product}" scope="page" />
                <isinclude template="product/components/productTile" />
            </div>
        </isloop>
    </div>
    
    <isif condition="${pdict.productSearch.count > pdict.productSearch.pageSize}">
        <isinclude template="search/components/pagination" />
    </isif>
</div>
```

### 3. Responsive Image Handling

```html
<picture class="product-image">
    <source media="(max-width: 544px)" 
            srcset="${pdict.product.images.small[0].url}">
    <source media="(max-width: 768px)" 
            srcset="${pdict.product.images.medium[0].url}">
    <img src="${pdict.product.images.large[0].url}" 
         alt="${pdict.product.images.large[0].alt}"
         title="${pdict.product.images.large[0].title}"
         class="img-fluid">
</picture>
```

## Error Handling in Templates

### Defensive Programming

```html
<isif condition="${pdict.product && pdict.product.available}">
    <div class="product-availability">
        <isif condition="${pdict.product.availabilityModel.availability > 0}">
            <span class="in-stock">
                ${Resource.msgf('label.quantity.in.stock', 'product', null, pdict.product.availabilityModel.availability)}
            </span>
        <iselse>
            <span class="limited-stock">
                ${Resource.msg('label.limited.availability', 'product', null)}
            </span>
        </isif>
    </div>
</isif>
```

### Graceful Degradation

```html
<div class="product-reviews">
    <isif condition="${pdict.product.reviews && pdict.product.reviews.count > 0}">
        <div class="reviews-summary">
            <span class="review-count">${pdict.product.reviews.count}</span>
            <isinclude template="product/components/reviewStars" />
        </div>
    <iselse>
        <div class="no-reviews">
            ${Resource.msg('label.no.reviews', 'product', 'No reviews yet')}
        </div>
    </isif>
</div>
```

## Testing & Debugging

### Template Comments for Development

```html
<iscomment>
    TODO: Implement wishlist functionality
    Controller needs to pass wishlist status in product model
</iscomment>

<iscomment>
    Debug: Product ID = ${pdict.product.id}
    Available = ${pdict.product.available}
    Price = ${pdict.product.price.sales.value}
</iscomment>
```

### Conditional Debug Output

```html
<isif condition="${dw.system.System.getInstanceType() === dw.system.System.DEVELOPMENT_SYSTEM}">
    <div class="debug-info" style="background: yellow; padding: 10px;">
        <strong>Debug Info:</strong><br>
        Product ID: ${pdict.product.id}<br>
        Template: product/productDetails.isml<br>
        Timestamp: ${new Date()}
    </div>
</isif>
```

## Template Decoration and Layout

### The `<isreplace>` Element

The `<isreplace>` element is a crucial component of SFCC's template decoration system. It identifies where the decorated content should be included within a decorator template.

#### Syntax
```html
<isreplace/>
```

#### Purpose and Behavior

The decorator template uses `<isreplace/>` to specify the insertion point for decorated content. Understanding its behavior is essential for proper template architecture:

- **Single `<isreplace/>` (typical)**: The decorated content is inserted at the location of the tag
- **Multiple `<isreplace/>` tags**: The decorated content is duplicated at each tag location
- **Zero `<isreplace/>` tags**: The decorated content is effectively omitted from the output

#### Example 1: Basic Template Decoration

**Rendering Template (uses decorator):**
```html
<isset name="DecoratorTemplate" value="common/layout/page" scope="page"/>
<isdecorate template="${DecoratorTemplate}">
    <div class="product-details">
        <h1>${pdict.product.displayName}</h1>
        <div class="price">${pdict.product.price.sales.formatted}</div>
    </div>
</isdecorate>
```

**Decorator Template (`common/layout/page.isml`):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>${pdict.pageTitle}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div id="page-container">
        <isinclude template="components/header" />
        
        <main id="main-content">
            <div class="content-wrapper">
                <isreplace/>
            </div>
        </main>
        
        <isinclude template="components/footer" />
    </div>
</body>
</html>
```

#### Example 2: Multiple `<isreplace/>` Tags

**Decorator Template with Sidebar:**
```html
<div class="layout-two-column">
    <aside class="sidebar">
        <div class="sidebar-content">
            <isreplace/>
        </div>
    </aside>
    
    <main class="main-content">
        <div class="content-area">
            <isreplace/>
        </div>
    </main>
</div>
```

*In this example, the decorated content appears in both the sidebar and main content areas.*

#### Example 3: Conditional Content Placement

**Advanced Decorator Pattern:**
```html
<div class="page-layout">
    <isinclude template="components/breadcrumb" />
    
    <isif condition="${pdict.showInSidebar}">
        <div class="with-sidebar">
            <main class="content">
                <isreplace/>
            </main>
            <aside class="sidebar">
                <isinclude template="components/relatedProducts" />
            </aside>
        </div>
    <iselse>
        <main class="full-width">
            <isreplace/>
        </main>
    </isif>
</div>
```

#### Best Practices for `<isreplace>`

1. **Single Replacement Point**: Use one `<isreplace/>` per decorator for clarity and maintainability
2. **Semantic Placement**: Position `<isreplace/>` within semantic HTML elements (`<main>`, `<section>`, etc.)
3. **CSS Class Structure**: Wrap `<isreplace/>` in containers with appropriate CSS classes for styling
4. **Documentation**: Comment complex decorator patterns to explain the layout structure

#### Common Patterns

**Standard Page Layout:**
```html
<isdecorate template="common/layout/page">
    <!-- Page-specific content goes here -->
</isdecorate>
```

**Modal/Dialog Layout:**
```html
<isdecorate template="common/layout/modal">
    <!-- Modal content goes here -->
</isdecorate>
```

**Email Template Layout:**
```html
<isdecorate template="common/layout/email">
    <!-- Email content goes here -->
</isdecorate>
```

## SFRA Base Templates Architecture (Reference)

The detailed SFRA layout/page-template walkthrough (base layouts, checkout, Page Designer store pages, and page-level patterns) was moved to keep this skill under the size cap.

See: references/sfra-base-templates-architecture.md

