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

## SFRA Base Templates Architecture

Understanding SFRA's base template structure is crucial for effective storefront development. SFRA provides a well-organized hierarchy of layout templates, page-specific templates, and reusable components that work together to create consistent user experiences.

**IMPORTANT**: SFRA uses **Bootstrap 4** as its foundational CSS framework, providing responsive grid systems, utility classes, and component styling throughout all templates. Understanding Bootstrap classes and responsive breakpoints is essential for effective SFRA development.

### Core Layout Templates

SFRA uses a **three-tier layout system** with base layouts that define the overall page structure:

#### 1. Main Page Layout (`common/layout/page.isml`)

The primary layout for most storefront pages including homepage, product details, search results, and category pages:

```html
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<isinclude template="/components/modules" sf-toolkit="off" />

<!DOCTYPE html>
<html lang="${require('dw/util/Locale').getLocale(request.getLocale()).getLanguage()}">
    <head>
        <!--[if gt IE 9]><!-->
            <isinclude sf-toolkit="off" template="/common/scripts" />
        <!--<![endif]-->
        <isinclude template="/common/htmlHead" />
        <isif condition="${pdict.canonicalUrl}" >
            <link rel="canonical" href="${pdict.canonicalUrl}"/>
        </isif>
        <isactivedatahead/>
        <isinclude template="/components/schema" />
    </head>
    <body>
        ${dw.system.HookMgr.callHook('app.template.beforeHeader', 'beforeHeader', pdict) || ''}

        <div class="page" data-action="${pdict.action}" data-querystring="${pdict.queryString}" >
            <isinclude template="/components/header/pageHeader" />
            <div role="main" id="maincontent">
                <isreplace/>
            </div>
            <isinclude template="/components/footer/pageFooter" />
        </div>
        <div class="error-messaging"></div>
        <div class="modal-background"></div>
        <iscontentasset aid="cookie_hint" />
         <!--[if lt IE 10]>
            <isinclude sf-toolkit="off" template="/common/scripts" />
        <![endif]-->
        <iscomment>
            hook for Marketing Cloud connector & other integration which need to inject
            logic at the page end
            IMPORTANT: Note that this hook will be called to cached as well as uncached pages
                        which means you need to put privacy information into another remote include
        </iscomment>
        ${dw.system.HookMgr.callHook('app.template.afterFooter', 'afterFooter', pdict) || ''}
        <isinclude url="${URLUtils.url('ConsentTracking-Check')}"/>
    </body>
</html>
```

**Key Features:**
- **Full navigation header**: Includes main menu, search, and account links via `pageHeader`
- **Hook integration**: `beforeHeader` and `afterFooter` hooks for customization
- **SEO elements**: Canonical URLs, structured data, meta tags
- **Accessibility**: Proper ARIA roles and semantic HTML
- **Analytics support**: ActiveData integration
- **Error handling**: Error messaging and modal background containers

#### 2. Checkout Layout (`common/layout/checkout.isml`)

Complete layout for checkout process with minimal navigation header:

```html
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<isinclude template="/components/modules" sf-toolkit="off" />

<!DOCTYPE html>
<html lang="${require('dw/util/Locale').getLocale(request.getLocale()).getLanguage()}">
    <head>
        <!--[if gt IE 9]><!-->
            <isinclude sf-toolkit="off" template="/common/scripts" />
        <!--<![endif]-->
        <isinclude template="/common/htmlHead" />
        <isactivedatahead/>
    </head>
    <body>
        ${dw.system.HookMgr.callHook('app.template.beforeHeader', 'beforeHeader', pdict) || ''}

        <div class="page">
            <isinclude template="/components/header/pageHeaderNomenu" />
            <div role="main" id="maincontent">
                <isreplace/>
            </div>
            <isinclude template="/components/footer/pageFooter" />
        </div>
        <!--[if lt IE 10]>
            <isinclude sf-toolkit="off" template="/common/scripts" />
        <![endif]-->

        <iscomment>
            hook for Marketing Cloud connector & other integration which need to inject
            logic at the page end
            IMPORTANT: Note that this hook will be called to cached as well as uncached pages
                        which means you need to put privacy information into another remote include
        </iscomment>
        ${dw.system.HookMgr.callHook('app.template.afterFooter', 'afterFooter', pdict) || ''}

        <isinclude url="${URLUtils.url('ConsentTracking-Check')}"/>
    </body>
</html>
```

**Key Features:**
- **Simplified header**: `pageHeaderNomenu` without main navigation menu
- **Secure context**: HTTPS enforcement and minimal external dependencies
- **Same structure as main layout**: Maintains consistency while removing distractions
- **Hook support**: Full hook integration for customization
- **Accessibility**: Maintains ARIA roles and semantic structure

#### 3. Page Designer Store Layout (`common/layout/pdStorePage.isml`)

Specialized layout for Page Designer store pages with campaign banner support:

```html
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<isinclude template="/components/modules" sf-toolkit="off" />

<!-- Include Page Designer Campaign Banner JavaScript and Styles only once here rather than at component level. -->
<!-- There should only be one Campagin Banner added on a PD page. Multiple Banners is unsupported at the moment. -->

<isif condition="${pdict.resetEditPDMode}">
    <script> var resetCampaignBannerSessionToken = true; </script>
</isif>

<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/experience/components/commerceAssets/campaignBanner.css');
    assets.addJs('/js/campaignBanner.js');
</isscript>

<!DOCTYPE html>
<html lang="${require('dw/util/Locale').getLocale(request.getLocale()).getLanguage()}">
    <head>
        <!--[if gt IE 9]><!-->
            <isinclude sf-toolkit="off" template="/common/scripts" />
        <!--<![endif]-->
        <isinclude template="/common/htmlHead" />
        <isif condition="${pdict.canonicalUrl}" >
            <link rel="canonical" href="${pdict.canonicalUrl}"/>
        </isif>
        <isactivedatahead/>
        <isinclude template="/components/schema" />
    </head>
    <body>
        ${dw.system.HookMgr.callHook('app.template.beforeHeader', 'beforeHeader', pdict) || ''}

        <div class="page" data-action="${pdict.action}" data-querystring="${pdict.queryString}" >
            <isinclude template="/components/header/pdStorePageHeader" />
            <div role="main" id="maincontent">
                <isreplace/>
            </div>
            <isinclude template="/components/footer/pageFooter" />
        </div>
        <div class="error-messaging"></div>
        <div class="modal-background"></div>
        <iscontentasset aid="cookie_hint" />
         <!--[if lt IE 10]>
            <isinclude sf-toolkit="off" template="/common/scripts" />
        <![endif]-->
        <iscomment>
            hook for Marketing Cloud connector & other integration which need to inject
            logic at the page end
            IMPORTANT: Note that this hook will be called to cached as well as uncached pages
                        which means you need to put privacy information into another remote include
        </iscomment>
        ${dw.system.HookMgr.callHook('app.template.afterFooter', 'afterFooter', pdict) || ''}
        <isinclude url="${URLUtils.url('ConsentTracking-Check')}"/>
    </body>
</html>
```

**Key Features:**
- **Page Designer header**: Uses `pdStorePageHeader` for Page Designer-specific navigation
- **Campaign banner support**: Includes campaign banner CSS and JavaScript assets
- **Edit mode support**: Handles Page Designer edit mode with session token reset
- **Same core structure**: Maintains consistency with main layout
- **SEO and analytics**: Full SEO and analytics support

### SFRA Page Template Patterns

#### Homepage Template Structure

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets.js');
        assets.addJs('/js/productTile.js');
        assets.addCss('/css/homePage.css');
    </isscript>

    <div class="home-main homepage">
        <isslot id="home-main-m" description="Main home page slot." context="global" />
    </div>

    <div class="container home-categories homepage">
        <div class="row home-main-categories no-gutters">
            <isslot id="home-categories-m" description="Categories slots on the home page." context="global" />
        </div>
    </div>

    <div class="container home-product-tiles homepage">
        <div class="hp-product-grid" itemtype="http://schema.org/SomeProducts" itemid="#product">
            <isslot id="home-products-m" description="Product tiles on the home page." context="global" />
        </div>
    </div>
</isdecorate>
```

**Pattern Highlights:**
- **Content slots**: Uses Business Manager-configurable content slots
- **Asset management**: Page-specific CSS and JavaScript loading
- **SEO structure**: Schema.org markup for products
- **Responsive design**: Bootstrap grid system integration

#### Product Detail Page Structure

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets');
        assets.addJs('/js/productDetail.js');
        assets.addCss('/css/product/detail.css');
    </isscript>

    <isset name="product" value="${pdict.product}" scope="page" />
    <isset name="isQuickView" value="${false}" scope="page" />
    <isset name="isProductSet" value="${pdict.product.productType === 'set'}" scope="page" />
    
    <isobject object="${product.raw}" view="detail">
        <div class="container product-detail product-wrapper" data-pid="${product.id}">
            <div class="row">
                <div class="col-12">
                    <div class="product-breadcrumb d-md-none">
                        <isinclude template="components/breadcrumbs/pageBreadcrumbs"/>
                    </div>

                    <div class="row">
                        <div class="d-md-none col-sm-12">
                            <h1 class="product-name">${product.productName}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Product images, details, add to cart, etc. -->
        </div>
    </isobject>
</isdecorate>
```

**Pattern Highlights:**
- **Product context**: `<isobject>` tag for product data binding
- **Variable scoping**: Page-scoped variables for template logic
- **Mobile-first design**: Responsive breakpoint handling
- **SEO optimization**: Structured product data and breadcrumbs

#### Cart Page Structure

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets.js');
        assets.addCss('/css/cart.css');
    </isscript>

    <isif condition="${pdict.reportingURLs && pdict.reportingURLs.length}">
        <isinclude template="reporting/reportingUrls" />
    </isif>

    <div class="cart-error-messaging cart-error">
        <isif condition="${pdict.valid.error && pdict.items.length !== 0}">
            <div class="alert alert-danger alert-dismissible valid-cart-error fade show" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                ${pdict.valid.message}
            </div>
        </isif>
    </div>

    <div class="container">
        <h1 class="page-title">${Resource.msg('title.cart','cart',null)}</h1>
        <div class="row cart-header">
            <div class="col-sm-4 hidden-xs-down">
                <a class="continue-shopping-link" href="${URLUtils.url('Home-Show')}" title="${Resource.msg('link.continue.shopping','cart',null)}">
                    ${Resource.msg('link.continue.shopping','cart',null)}
                </a>
            </div>
            <div class="col-sm-3 text-center">
                <h2 class="number-of-items">${Resource.msgf('label.number.items.in.cart','cart', null, pdict.numItems)}</h2>
            </div>
            <div class="col-sm-5 text-right hidden-xs-down">
                <div>
                    <span>${Resource.msg('info.need.help','cart',null)}</span>
                    <span><a class="help-phone-number" href="tel:${Resource.msg('info.phone.number','common',null)}">${Resource.msg('info.phone.number','common',null)}</a></span>
                </div>
            </div>
        </div>
        <hr class="no-margin-top">
    </div>

    <isif condition="${pdict.items.length === 0}">
        <div class="container cart-empty">
            <div class="row">
                <div class="col-12 text-center">
                    <h1>${Resource.msg('info.cart.empty.msg','cart',null)}</h1>
                </div>
            </div>
        </div>
    <iselse/>
        <div class="container cart cart-page">
            <div class="row">
                <!---product cards--->
                <div class="col-sm-7 col-md-8">
                    <isloop items="${pdict.items}" var="lineItem">
                        <isif condition="${lineItem.productType === 'bundle'}">
                            <isinclude template="cart/productCard/cartBundleCard" />
                        <iselse/>
                            <isif condition="${lineItem.noProduct === true}">
                                <isinclude template="cart/productCard/uncategorizedCartProductCard" />
                            <iselse/>
                                <isinclude template="cart/productCard/cartProductCard" />
                            </isif>
                        </isif>
                    </isloop>
                    <isinclude template="cart/cartApproachingDiscount" />
                </div>
                <!---totals, and checkout actions--->
                <div class="col-sm-5 col-md-4 totals">
                    <isinclude template="cart/cartPromoCode" />
                    <div class="coupons-and-promos">
                        <isinclude template="cart/cartCouponDisplay" />
                    </div>
                    <div class="row">
                        <isinclude template="cart/cartShippingMethodSelection" />
                    </div>
                    <isinclude template="cart/cartTotals" />
                    <div class="row">
                        <div class="col-12 checkout-continue">
                            <isinclude template="cart/checkoutButtons" />
                        </div>
                    </div>
                </div>
            </div>
            <isinclude template="cart/cartRemoveProductModal"/>
        </div>

        <isinclude template="cart/cartRemoveCouponModal"/>
    </isif>
    <div class="container">
        <isslot id="cart-recommendations-m" description="Recommended products" context="global" />
    </div>
</isdecorate>
```

**Pattern Highlights:**
- **Error handling**: Comprehensive validation error display with dismissible alerts
- **Analytics integration**: Reporting URL includes for tracking
- **User feedback**: Alert system for cart validation messages
- **Empty cart state**: Dedicated empty cart display with clear messaging
- **Product cards**: Dynamic product card rendering based on product type (bundle, regular, uncategorized)
- **Responsive layout**: Bootstrap grid system for desktop and mobile layouts
- **Promotional features**: Coupon display, promo codes, and approaching discount messaging
- **Checkout integration**: Seamless transition to checkout with proper button placement
- **Recommendations**: Content slot for product recommendations
- **Modal support**: Product removal and coupon removal modals

#### Account Page Structure

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets.js');
        assets.addJs('/js/account.js');
        assets.addCss('/css/account.css');
    </isscript>

    <div class="hero slant-down account-hero">
        <div class="container">
            <h1 class="page-title">${Resource.msg('page.heading.myaccount','account',null)}</h1>
        </div>
    </div>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col">
                <div class="myaccount-row">
                    <!-- Account Navigation -->
                    <div class="col-sm-3">
                        <div class="account-nav">
                            <isinclude template="account/accountNav" />
                        </div>
                    </div>
                    
                    <!-- Account Content -->
                    <div class="col-sm-9">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="pull-left">${pdict.pageTitle}</h2>
                            </div>
                            <div class="card-body card-body-positioning">
                                <!-- Page-specific content will be inserted here -->
                                <isif condition="${pdict.addressBook}">
                                    <isinclude template="account/addressBook" />
                                <iselseif condition="${pdict.orderHistory}">
                                    <isinclude template="account/orderHistory" />
                                <iselseif condition="${pdict.profile}">
                                    <isinclude template="account/profile" />
                                <iselseif condition="${pdict.paymentInstruments}">
                                    <isinclude template="account/payment/paymentMethods" />
                                <iselse>
                                    <isinclude template="account/dashboard" />
                                </isif>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</isdecorate>
```

**Pattern Highlights:**
- **Account navigation**: Consistent sidebar navigation across all account pages
- **Card-based layout**: Professional UI with card components
- **Conditional content**: Dynamic content loading based on page type
- **Responsive design**: Mobile-friendly account management interface

#### Search Results Page Structure

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets.js');
        assets.addJs('/js/search.js');
        assets.addCss('/css/search.css');
    </isscript>

    <div class="search-results-header">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="header page-title">
                        <isif condition="${pdict.productSearch.isCategorySearch}">
                            ${pdict.productSearch.category.name}
                        <iselse>
                            ${Resource.msgf('heading.search.results', 'search', null, pdict.productSearch.searchKeywords)}
                        </isif>
                    </h1>
                    
                    <!-- Search Result Count -->
                    <div class="result-count pull-left">
                        <isinclude template="search/searchResultsCount"/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container search-results">
        <div class="row search-nav">
            <div class="tab-content col-12">
                <div class="tab-pane container active" id="product-search-results">
                    <div class="row grid-header">
                        <div class="result-count col-6 col-md-9 order-2 order-md-1">
                            <isinclude template="search/searchResultsCount"/>
                        </div>
                        <div class="col-6 col-md-3 order-1 order-md-2">
                            <isinclude template="search/sortOrderMenu"/>
                        </div>
                    </div>
                    
                    <!-- Refinements and Product Grid -->
                    <div class="row">
                        <!-- Refinements Sidebar -->
                        <div class="refinement-bar col-md-3">
                            <isinclude template="search/refinements"/>
                        </div>
                        
                        <!-- Product Grid -->
                        <div class="col-sm-12 col-md-9">
                            <div class="container">
                                <isif condition="${pdict.productSearch.productHits.length > 0}">
                                    <!-- Product Grid -->
                                    <div class="row product-grid" itemtype="http://schema.org/SomeProducts" itemid="#product">
                                        <isloop items="${pdict.productSearch.productHits}" var="productHit">
                                            <div class="col-6 col-sm-4 product-tile-wrapper">
                                                <isset name="product" value="${productHit.product}" scope="page" />
                                                <div class="product-tile" data-pid="${product.id}" data-gtm-product='${JSON.stringify(product.gtm)}'>
                                                    <isinclude template="product/productTile"/>
                                                </div>
                                            </div>
                                        </isloop>
                                    </div>
                                    
                                    <!-- Pagination -->
                                    <div class="row">
                                        <isinclude template="search/searchResultsPagination"/>
                                    </div>
                                    
                                    <!-- Show More Products -->
                                    <div class="row">
                                        <div class="col-12 text-center">
                                            <div class="show-more btn btn-outline-primary" data-url="${pdict.productSearch.showMoreUrl}">
                                                ${Resource.msg('button.search.showmore', 'search', null)}
                                            </div>
                                        </div>
                                    </div>
                                <iselse>
                                    <!-- No Results -->
                                    <div class="row justify-content-center">
                                        <div class="col">
                                            <div class="no-results-message">
                                                <h3>${Resource.msg('heading.no.results', 'search', null)}</h3>
                                                <p>${Resource.msg('msg.no.results', 'search', null)}</p>
                                                
                                                <!-- Search Suggestions -->
                                                <isif condition="${pdict.productSearch.searchSuggestions && pdict.productSearch.searchSuggestions.length > 0}">
                                                    <div class="search-suggestions">
                                                        <p>${Resource.msg('label.search.suggestions', 'search', null)}</p>
                                                        <ul class="suggestions-list">
                                                            <isloop items="${pdict.productSearch.searchSuggestions}" var="suggestion">
                                                                <li><a href="${suggestion.url}">${suggestion.value}</a></li>
                                                            </isloop>
                                                        </ul>
                                                    </div>
                                                </isif>
                                            </div>
                                        </div>
                                    </div>
                                </isif>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recently Viewed -->
    <div class="container">
        <isinclude template="search/components/recentlyViewed"/>
    </div>
</isdecorate>
```

**Pattern Highlights:**
- **Dual search support**: Category browsing and keyword search functionality
- **Advanced filtering**: Refinement sidebar with faceted search
- **Responsive grid**: Product tiles with mobile-optimized layout
- **Pagination system**: Multiple pagination patterns including "show more"
- **No results handling**: Graceful degradation with search suggestions

#### Category Landing Page Structure

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets.js');
        assets.addJs('/js/categoryLanding.js');
        assets.addCss('/css/categoryLanding.css');
    </isscript>

    <!-- Category Hero Section -->
    <div class="hero category-hero" 
         <isif condition="${pdict.category.image}">style="background-image: url('${pdict.category.image}')"</isif>>
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1 class="category-title">${pdict.category.displayName}</h1>
                    <isif condition="${pdict.category.description}">
                        <p class="category-description">${pdict.category.description}</p>
                    </isif>
                </div>
            </div>
        </div>
    </div>

    <!-- Breadcrumbs -->
    <div class="container">
        <div class="row">
            <div class="col-12">
                <isinclude template="components/breadcrumbs/pageBreadcrumbs"/>
            </div>
        </div>
    </div>

    <!-- Category Content Slots -->
    <isif condition="${pdict.category.template && pdict.category.template !== ''}">
        <!-- Custom Category Template -->
        <isinclude template="${pdict.category.template}"/>
    <iselse>
        <!-- Default Category Content -->
        <div class="container category-content">
            <!-- Category Slots -->
            <div class="category-slots">
                <isslot id="category-banner" description="Category banner content" context="category" context-object="${pdict.category.raw}" />
            </div>
            
            <!-- Sub-categories -->
            <isif condition="${pdict.category.subCategories && pdict.category.subCategories.length > 0}">
                <div class="sub-categories">
                    <div class="row">
                        <div class="col-12">
                            <h2 class="sub-categories-title">${Resource.msg('heading.browse.categories', 'search', null)}</h2>
                        </div>
                    </div>
                    <div class="row">
                        <isloop items="${pdict.category.subCategories}" var="subCategory">
                            <div class="col-6 col-md-4 col-lg-3">
                                <div class="category-tile">
                                    <a href="${subCategory.url}" class="category-link">
                                        <isif condition="${subCategory.image}">
                                            <div class="category-image">
                                                <img src="${subCategory.image}" 
                                                     alt="${subCategory.displayName}" 
                                                     class="img-fluid">
                                            </div>
                                        </isif>
                                        <div class="category-info">
                                            <h3 class="category-name">${subCategory.displayName}</h3>
                                            <isif condition="${subCategory.productCount}">
                                                <span class="product-count">
                                                    ${Resource.msgf('label.category.product.count', 'search', null, subCategory.productCount)}
                                                </span>
                                            </isif>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </isloop>
                    </div>
                </div>
            </isif>
            
            <!-- Featured Products -->
            <isif condition="${pdict.productSearch && pdict.productSearch.productHits.length > 0}">
                <div class="featured-products">
                    <div class="row">
                        <div class="col-12">
                            <h2 class="featured-title">${Resource.msg('heading.featured.products', 'search', null)}</h2>
                        </div>
                    </div>
                    <div class="row product-grid">
                        <isloop items="${pdict.productSearch.productHits}" var="productHit" begin="0" end="7">
                            <div class="col-6 col-md-4 col-lg-3">
                                <isset name="product" value="${productHit.product}" scope="page" />
                                <isinclude template="product/productTile"/>
                            </div>
                        </isloop>
                    </div>
                    <div class="row">
                        <div class="col-12 text-center">
                            <a href="${pdict.category.url}?showAll=true" class="btn btn-primary">
                                ${Resource.msg('button.view.all.products', 'search', null)}
                            </a>
                        </div>
                    </div>
                </div>
            </isif>
            
            <!-- Category Content Slots -->
            <div class="category-content-slots">
                <isslot id="category-content" description="Category content area" context="category" context-object="${pdict.category.raw}" />
            </div>
        </div>
    </isif>
</isdecorate>
```

**Pattern Highlights:**
- **Hero section**: Visual category introduction with background imagery
- **Content slots**: Business Manager-configurable category content
- **Sub-category navigation**: Hierarchical category browsing
- **Featured products**: Limited product showcase with view-all option
- **Flexible templating**: Support for custom category templates

#### Login/Registration Page Structure

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets.js');
        assets.addJs('/js/login.js');
        assets.addCss('/css/login.css');
    </isscript>

    <div class="hero slant-down login-banner">
        <h1 class="page-title">${Resource.msg('title.login.page', 'login', null)}</h1>
    </div>

    <div class="container login-page">
        <div class="row justify-content-center">
            <!-- Login Form -->
            <div class="col-md-6">
                <div class="card login-form-nav">
                    <div class="card-header">
                        <h2>${Resource.msg('heading.returning.customers', 'login', null)}</h2>
                    </div>
                    
                    <div class="card-body">
                        <form action="${URLUtils.url('Account-Login')}" class="login" method="post" name="login-form">
                            <input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>
                            
                            <!-- Email Field -->
                            <div class="form-group 
                                <isif condition="${pdict.loginForm.username.invalid}">is-invalid</isif>">
                                <label class="form-control-label" for="login-form-email">
                                    <isprint value="${pdict.loginForm.username.label}" encoding="htmlcontent" />
                                </label>
                                <input type="email" 
                                       required 
                                       class="form-control" 
                                       id="login-form-email"
                                       name="${pdict.loginForm.username.htmlName}" 
                                       value="${pdict.loginForm.username.value}"
                                       autocomplete="email">
                                <isif condition="${pdict.loginForm.username.invalid}">
                                    <div class="invalid-feedback">
                                        <isprint value="${pdict.loginForm.username.error}" />
                                    </div>
                                </isif>
                            </div>
                            
                            <!-- Password Field -->
                            <div class="form-group 
                                <isif condition="${pdict.loginForm.password.invalid}">is-invalid</isif>">
                                <label class="form-control-label" for="login-form-password">
                                    <isprint value="${pdict.loginForm.password.label}" encoding="htmlcontent" />
                                </label>
                                <input type="password" 
                                       required 
                                       class="form-control" 
                                       id="login-form-password"
                                       name="${pdict.loginForm.password.htmlName}" 
                                       autocomplete="current-password">
                                <isif condition="${pdict.loginForm.password.invalid}">
                                    <div class="invalid-feedback">
                                        <isprint value="${pdict.loginForm.password.error}" />
                                    </div>
                                </isif>
                            </div>
                            
                            <!-- Remember Me -->
                            <div class="form-group custom-control custom-checkbox">
                                <input type="checkbox" 
                                       class="custom-control-input" 
                                       id="rememberMe" 
                                       name="${pdict.loginForm.rememberMe.htmlName}"
                                       value="true"
                                       <isif condition="${pdict.loginForm.rememberMe.checked}">checked</isif>>
                                <label class="custom-control-label" for="rememberMe">
                                    ${Resource.msg('field.login.remember.me', 'login', null)}
                                </label>
                            </div>
                            
                            <!-- Login Button -->
                            <button type="submit" class="btn btn-primary btn-block login-btn">
                                ${Resource.msg('button.text.loginform', 'login', null)}
                            </button>
                            
                            <!-- Forgot Password -->
                            <div class="forgot-password text-center">
                                <a href="${URLUtils.url('Account-PasswordReset')}" title="${Resource.msg('link.login.forgotpassword', 'login', null)}">
                                    ${Resource.msg('link.login.forgotpassword', 'login', null)}
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <!-- Registration Form -->
            <div class="col-md-6">
                <div class="card registration-form-nav">
                    <div class="card-header">
                        <h2>${Resource.msg('heading.new.customers', 'login', null)}</h2>
                    </div>
                    
                    <div class="card-body">
                        <p>${Resource.msg('msg.create.account', 'login', null)}</p>
                        
                        <form action="${URLUtils.url('Account-SubmitRegistration')}" 
                              class="registration" 
                              method="post" 
                              name="registration-form">
                            <input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>
                            
                            <!-- First Name -->
                            <div class="form-group 
                                <isif condition="${pdict.registrationForm.customer.firstname.invalid}">is-invalid</isif>">
                                <label class="form-control-label" for="registration-form-fname">
                                    <isprint value="${pdict.registrationForm.customer.firstname.label}" encoding="htmlcontent" />
                                </label>
                                <input type="text" 
                                       required 
                                       class="form-control" 
                                       id="registration-form-fname"
                                       name="${pdict.registrationForm.customer.firstname.htmlName}"
                                       value="${pdict.registrationForm.customer.firstname.value}"
                                       autocomplete="given-name">
                                <isif condition="${pdict.registrationForm.customer.firstname.invalid}">
                                    <div class="invalid-feedback">
                                        <isprint value="${pdict.registrationForm.customer.firstname.error}" />
                                    </div>
                                </isif>
                            </div>

                            <!-- Last Name -->
                            <div class="form-group
                                <isif condition="${pdict.registrationForm.customer.lastname.invalid}">is-invalid</isif>">
                                <label class="form-control-label" for="registration-form-lname">
                                    <isprint value="${pdict.registrationForm.customer.lastname.label}" encoding="htmlcontent" />
                                </label>
                                <input type="text"
                                       required
                                       class="form-control"
                                       id="registration-form-lname"
                                       name="${pdict.registrationForm.customer.lastname.htmlName}"
                                       value="${pdict.registrationForm.customer.lastname.value}"
                                       autocomplete="family-name">
                                <isif condition="${pdict.registrationForm.customer.lastname.invalid}">
                                    <div class="invalid-feedback">
                                        <isprint value="${pdict.registrationForm.customer.lastname.error}" />
                                    </div>
                                </isif>
                            </div>

                            <!-- Email -->
                            <div class="form-group
                                <isif condition="${pdict.registrationForm.customer.email.invalid}">is-invalid</isif>">
                                <label class="form-control-label" for="registration-form-email">
                                    <isprint value="${pdict.registrationForm.customer.email.label}" encoding="htmlcontent" />
                                </label>
                                <input type="email"
                                       required
                                       class="form-control"
                                       id="registration-form-email"
                                       name="${pdict.registrationForm.customer.email.htmlName}"
                                       value="${pdict.registrationForm.customer.email.value}"
                                       autocomplete="email">
                                <isif condition="${pdict.registrationForm.customer.email.invalid}">
                                    <div class="invalid-feedback">
                                        <isprint value="${pdict.registrationForm.customer.email.error}" />
                                    </div>
                                </isif>
                            </div>

                            <!-- Password -->
                            <div class="form-group
                                <isif condition="${pdict.registrationForm.newPasswords.newpassword.invalid}">is-invalid</isif>">
                                <label class="form-control-label" for="registration-form-password">
                                    <isprint value="${pdict.registrationForm.newPasswords.newpassword.label}" encoding="htmlcontent" />
                                </label>
                                <input type="password"
                                       required
                                       class="form-control"
                                       id="registration-form-password"
                                       name="${pdict.registrationForm.newPasswords.newpassword.htmlName}"
                                       autocomplete="new-password">
                                <isif condition="${pdict.registrationForm.newPasswords.newpassword.invalid}">
                                    <div class="invalid-feedback">
                                        <isprint value="${pdict.registrationForm.newPasswords.newpassword.error}" />
                                    </div>
                                </isif>
                            </div>

                            <!-- Confirm Password -->
                            <div class="form-group
                                <isif condition="${pdict.registrationForm.newPasswords.newpasswordconfirm.invalid}">is-invalid</isif>">
                                <label class="form-control-label" for="registration-form-password-confirm">
                                    <isprint value="${pdict.registrationForm.newPasswords.newpasswordconfirm.label}" encoding="htmlcontent" />
                                </label>
                                <input type="password"
                                       required
                                       class="form-control"
                                       id="registration-form-password-confirm"
                                       name="${pdict.registrationForm.newPasswords.newpasswordconfirm.htmlName}"
                                       autocomplete="new-password">
                                <isif condition="${pdict.registrationForm.newPasswords.newpasswordconfirm.invalid}">
                                    <div class="invalid-feedback">
                                        <isprint value="${pdict.registrationForm.newPasswords.newpasswordconfirm.error}" />
                                    </div>
                                </isif>
                            </div>

                            <!-- Privacy Policy -->
                            <div class="form-group custom-control custom-checkbox">
                                <input type="checkbox"
                                       required
                                       class="custom-control-input"
                                       id="add-to-email-list"
                                       name="${pdict.registrationForm.customer.addtoemaillist.htmlName}"
                                       value="true">
                                <label class="custom-control-label" for="add-to-email-list">
                                    ${Resource.msg('label.registration.email.subscribe', 'login', null)}
                                </label>
                            </div>

                            <!-- Create Account Button -->
                            <button type="submit" class="btn btn-primary btn-block create-account-btn">
                                ${Resource.msg('button.createaccount.registration', 'login', null)}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</isdecorate>
```

**Pattern Highlights:**
- **Dual-form layout**: Login and registration side-by-side
- **Form validation**: Client and server-side validation with error display
- **Accessibility features**: Proper form labels, autocomplete attributes
- **Security elements**: CSRF protection and password requirements
- **Mobile responsiveness**: Stacked layout on smaller screens

## Common Components Architecture

SFRA organizes reusable components in the `/components/` directory:

#### HTML Head Component (`common/htmlHead.isml`)

```html
<meta charset=UTF-8>
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<isif condition="${dw.system.System.getInstanceType() != dw.system.System.PRODUCTION_SYSTEM}">
    <title>${pdict.CurrentPageMetaData.title} | ${Resource.msg('global.site.name', 'version', null)} | ${Resource.msg('global.version.number', 'version', null)}</title>
<iselse/>
    <title><isprint value="${pdict.CurrentPageMetaData.title}" encoding="htmlcontent" /></title>
</isif>

<meta name="description" content="${pdict.CurrentPageMetaData.description ? pdict.CurrentPageMetaData.description : Resource.msg('global.storename','common',null)}"/>
<meta name="keywords" content="${pdict.CurrentPageMetaData.keywords ? pdict.CurrentPageMetaData.keywords : Resource.msg('global.storename','common',null)}"/>

<!-- Rule-based page meta tags -->
<isloop items="${pdict.CurrentPageMetaData.pageMetaTags}" var="pageMetaTag">
    <isif condition="${pageMetaTag.name}">
        <meta name="<isprint value="${pageMetaTag.ID}">" content="<isprint value="${pageMetaTag.content}">">
    <iselseif condition="${pageMetaTag.property}">
        <meta property="<isprint value="${pageMetaTag.ID}">" content="<isprint value="${pageMetaTag.content}">">
    </isif>
</isloop>

<!-- Favicons -->
<link rel="icon" type="image/png" href="${URLUtils.staticURL('/images/favicons/favicon-196x196.png')}" sizes="196x196" />
<!-- Additional favicon sizes... -->
```

**Component Features:**
- **Environment awareness**: Different titles for non-production environments
- **SEO management**: Dynamic meta tags from Page Designer or manual configuration
- **Multi-device support**: Comprehensive favicon set
- **Content security**: Proper encoding for meta content

### SFRA Template Directory Structure

```
templates/default/
├── common/                    # Shared layout and utility templates
│   ├── layout/
│   │   ├── page.isml         # Main page layout
│   │   ├── checkout.isml     # Checkout layout
│   │   └── pdStorePage.isml  # Page Designer layout
│   ├── htmlHead.isml         # HTML head component
│   ├── scripts.isml          # JavaScript includes
│   └── consent.isml          # Cookie consent
├── components/               # Reusable UI components
│   ├── header/              # Header variations
│   ├── footer/              # Footer components
│   ├── breadcrumbs/         # Navigation breadcrumbs
│   ├── modules.isml         # Module registration
│   └── schema.isml          # Structured data
├── home/                    # Homepage templates
│   └── homePage.isml        # Main homepage
├── product/                 # Product-related templates
│   ├── productDetails.isml  # PDP template
│   ├── productTile.isml     # Product tile component
│   └── quickView.isml       # Quick view modal
├── cart/                    # Shopping cart templates
│   └── cart.isml           # Cart page
├── checkout/               # Checkout process templates
│   └── checkout.isml       # Main checkout
├── account/                # Customer account templates
│   ├── login.isml          # Login page
│   ├── profile.isml        # Account profile
│   └── orderHistory.isml   # Order history
├── search/                 # Search and category templates
│   └── searchResults.isml  # Search results page
└── error/                  # Error page templates
    ├── error.isml          # Generic error page
    └── notFound.isml       # 404 page
```

### Best Practices for SFRA Template Development

#### 1. Follow the Layout Hierarchy

```html
<!-- ✅ Use appropriate base layout -->
<isdecorate template="common/layout/page">
    <!-- Standard page content -->
</isdecorate>

<!-- ✅ Use checkout layout for secure pages -->
<isdecorate template="common/layout/checkout">
    <!-- Checkout/payment content -->
</isdecorate>
```

#### 2. Leverage Component Reusability

```html
<!-- ✅ Include reusable components -->
<isinclude template="components/breadcrumbs/pageBreadcrumbs" />
<isinclude template="components/product/productTile" />
```

#### 3. Implement Proper Asset Management

```html
<!-- ✅ Page-specific assets -->
<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/product/detail.css');
    assets.addJs('/js/productDetail.js');
</isscript>
```

#### 4. Use Semantic HTML Structure

```html
<!-- ✅ Semantic and accessible markup -->
<main id="maincontent" role="main">
    <article class="product-detail">
        <header class="product-header">
            <h1 class="product-name">${product.productName}</h1>
        </header>
        <section class="product-images">
            <!-- Product imagery -->
        </section>
    </article>
</main>
```

#### 5. Implement Responsive Design Patterns

```html
<!-- ✅ Mobile-first responsive structure -->
<div class="row">
    <div class="col-12 col-md-6 col-lg-4">
        <!-- Mobile: full width, tablet: half, desktop: one-third -->
    </div>
</div>

<!-- ✅ Progressive disclosure -->
<div class="product-breadcrumb d-md-none">
    <!-- Only show on mobile -->
</div>
<div class="d-none d-md-block">
    <!-- Only show on tablet and up -->
</div>
```

This SFRA base template architecture provides a solid foundation for building consistent, maintainable, and scalable storefronts while following Commerce Cloud best practices for performance, security, and user experience


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
