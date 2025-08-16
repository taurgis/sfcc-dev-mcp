# Salesforce B2C Commerce ISML Templates: Best Practices & Development Guide

This guide provides comprehensive best practices for developing ISML (Internet Store Markup Language) templates within the Salesforce B2C Commerce Storefront Reference Architecture (SFRA). Master these principles to build secure, maintainable, and high-performing storefront experiences.

**IMPORTANT**: Before developing ISML templates, consult the **Performance and Stability Best Practices** and **SFRA Controllers** guides from this MCP server. Understanding the MVC separation and controller patterns is essential for proper ISML development.

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

**Main Layout** (`common/layout/page.isml`):
```html
<!doctype html>
<html lang="${require('dw/util/Locale').getLocale(request.locale).getLanguage()}">
<head>
    <isinclude template="common/htmlHead" />
</head>
<body>
    <div class="page">
        <isinclude template="components/header/pageHeader" />
        <main role="main" id="maincontent">
            ${pdict.layout}
        </main>
        <isinclude template="components/footer/pageFooter" />
    </div>
</body>
</html>
```

**Content Page**:
```html
<isdecorate template="common/layout/page">
    <div class="product-details">
        <h1><isprint value="${pdict.product.productName}" /></h1>
        <!-- Content goes here -->
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

### 3. Remote Includes for Dynamic Content

Use remote includes for cacheable dynamic sections:

```html
<!-- Main cached page includes dynamic mini-cart -->
<div class="header-cart">
    <isinclude url="${URLUtils.url('Cart-MiniCartShow')}" />
</div>
```

## Essential ISML Tags & Usage

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

## Quick Reference Tables

### Essential ISML Tags
| Tag | Purpose | Example |
|-----|---------|---------|
| `<isprint>` | Output data safely | `<isprint value="${pdict.product.name}" />` |
| `<isif>` | Conditional logic | `<isif condition="${product.available}">` |
| `<isloop>` | Iterate collections | `<isloop items="${products}" var="product">` |
| `<isinclude>` | Include templates | `<isinclude template="components/header" />` |
| `<isdecorate>` | Apply layout | `<isdecorate template="common/layout/page">` |
| `<isset>` | Set variables | `<isset name="showPrice" value="${true}" scope="page" />` |

### URL Generation Functions
| Function | Purpose | Example |
|----------|---------|---------|
| `URLUtils.url()` | Relative URLs | `URLUtils.url('Product-Show', 'pid', product.id)` |
| `URLUtils.https()` | Secure URLs | `URLUtils.https('Account-Login')` |
| `URLUtils.staticURL()` | Static assets | `URLUtils.staticURL('/images/logo.png')` |

Remember: **Keep business logic in controllers, use ISML only for presentation, and always encode output for security.**
