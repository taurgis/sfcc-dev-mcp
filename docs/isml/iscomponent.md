# ISML iscomponent Element

## Overview

The `<iscomponent>` element includes the output of a pipeline or controller in the current page, functioning as a remote include with explicit pipeline-based syntax. It enables embedding reusable functionality encapsulated in pipelines/controllers while allowing independent caching policies. This element makes the purpose of remote includes obvious by directly associating them with specific pipelines or controllers.

**Key Difference from `<isinclude>`:** `<iscomponent>` performs a remote server request to execute a pipeline/controller, while `<isinclude>` (without `url` attribute) performs a local template include.

## Syntax

```isml
<iscomponent
  pipeline   = pipeline_name        // required
  locale     = locale_name          // optional
  parameterN = valueN               // zero or more custom parameters
/>
```

## Required Attributes

### pipeline

**Type:** String or Expression  
**Required:** Yes

Specifies the name of the pipeline or controller to execute. Uses the full pipeline syntax: `Pipeline-Node` or `Controller-Endpoint`.

**Important:** SEO URLs cannot be used. You must use the full pipeline/controller syntax.

```isml
<!-- String literal -->
<iscomponent pipeline="Product-Show" />

<!-- Expression -->
<iscomponent pipeline="${pdict.componentPipeline}" />

<!-- SFRA Controller syntax -->
<iscomponent pipeline="Product-ShowQuickView" />

<!-- Legacy pipeline syntax -->
<iscomponent pipeline="Product-Show" />
```

**Examples:**
- `"Product-Show"` - Product controller Show endpoint
- `"Search-Show"` - Search controller Show endpoint
- `"Page-Include"` - Page controller Include endpoint
- `"Account-Header"` - Account controller Header endpoint

## Optional Attributes

### locale

**Type:** String or Expression  
**Optional:** Yes

Specifies an optional locale for the pipeline call. Overrides the current request locale for the component execution.

```isml
<!-- String literal locale -->
<iscomponent pipeline="Product-Show" locale="en_US" productid="123" />

<!-- Expression locale -->
<iscomponent pipeline="Product-Show" locale="${pdict.preferredLocale}" productid="123" />

<!-- Default locale (from request) -->
<iscomponent pipeline="Product-Show" productid="123" />
```

**Use Cases:**
- Multi-language components
- Locale-specific content rendering
- International site components

### Custom Parameters (parameterN = valueN)

**Type:** Any (passed as query parameters)  
**Optional:** Yes (zero or more)

Define any number of additional parameters that are passed to the pipeline/controller. These parameters are accessible in the controller via `request.httpParameterMap` or as query string parameters.

```isml
<!-- Single parameter -->
<iscomponent pipeline="Product-Show" productid="12345" />

<!-- Multiple parameters -->
<iscomponent 
  pipeline="Product-Show" 
  productid="12345" 
  name="Wide-screen television"
  view="quickview"
/>

<!-- Expression parameters -->
<iscomponent 
  pipeline="Product-Show" 
  productid="${product.ID}" 
  source="recommendation"
/>
```

**In the controller, access parameters:**
```javascript
// Controller: Product-Show
server.get('Show', function (req, res, next) {
    var productid = request.httpParameterMap.productid.stringValue;
    var name = request.httpParameterMap.name.stringValue;
    var view = request.httpParameterMap.view.stringValue;
    
    // Use parameters to customize output
    res.render('product/productQuickView', {
        productID: productid,
        productName: name,
        viewType: view
    });
    
    next();
});
```

## Purpose

The `<iscomponent>` element serves several key purposes:

1. **Remote Pipeline Execution:** Execute a pipeline/controller and include its output
2. **Reusable Components:** Embed encapsulated functionality across multiple pages
3. **Independent Caching:** Allow component to have different caching policy than parent page
4. **Clear Intent:** Make the purpose of remote includes obvious through pipeline association
5. **Modular Architecture:** Separate concerns by isolating component logic in dedicated controllers
6. **Dynamic Content:** Include personalized or session-specific content in cached pages

### Technical Behavior

**Remote Include:**
- Performs a **server-side HTTP request** to the specified pipeline/controller
- Executes the pipeline/controller independently
- Returns rendered HTML that is inserted into the parent page
- Component has its own execution context and caching policy

**Caching Independence:**
- Parent page can be cached while component remains dynamic
- Component can be cached while parent page is dynamic
- Each has separate `<iscache>` directives

## Common Use Cases

### Product Quick View Modal

```isml
<!-- search/productGrid.isml (parent page - cached) -->
<iscache type="relative" hour="1"/>

<div class="product-grid">
    <isloop items="${pdict.products}" var="product">
        <div class="product-tile">
            <h3>${product.name}</h3>
            <button class="quick-view" data-pid="${product.id}">Quick View</button>
        </div>
    </isloop>
</div>

<!-- Modal container where quick view is loaded -->
<div id="quickview-modal" class="modal">
    <!-- Component loaded here via AJAX when quick view clicked -->
</div>
```

```isml
<!-- product/quickView.isml (component - not cached) -->
<!-- No iscache - always fresh data -->

<iscomponent 
  pipeline="Product-ShowQuickView" 
  productid="${pdict.pid}" 
  source="quickview"
/>
```

```javascript
// Controller: Product-ShowQuickView
server.get('ShowQuickView', function (req, res, next) {
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var productID = request.httpParameterMap.productid.stringValue;
    var product = ProductFactory.get(productID);
    
    res.render('product/quickViewContent', {
        product: product
    });
    
    next();
});
```

### Mini Cart (Dynamic in Cached Page)

```isml
<!-- homepage.isml (cached) -->
<iscache type="daily"/>

<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
</head>
<body>
    <header>
        <div class="logo">Company Logo</div>
        
        <!-- Mini cart component (dynamic, not cached) -->
        <iscomponent pipeline="Cart-MiniCart" />
    </header>
    
    <!-- Cached homepage content -->
    <div class="homepage-content">
        <!-- Static/cached content -->
    </div>
</body>
</html>
```

```isml
<!-- cart/miniCart.isml (component) -->
<!-- No cache - always shows current basket -->

<div class="mini-cart">
    <span class="item-count">${pdict.Basket.productQuantityTotal}</span>
    <span class="total">${pdict.Basket.totalGrossPrice}</span>
    
    <div class="mini-cart-dropdown">
        <isloop items="${pdict.Basket.productLineItems}" var="item">
            <div class="mini-cart-item">
                <span>${item.productName}</span>
                <span>${item.price}</span>
            </div>
        </isloop>
    </div>
</div>
```

### User Account Greeting

```isml
<!-- Cached page with dynamic greeting -->
<iscache type="relative" hour="2"/>

<div class="page-header">
    <!-- Dynamic user greeting (not cached) -->
    <iscomponent pipeline="Account-Header" />
    
    <!-- Cached page content -->
    <div class="content">
        <!-- Static content -->
    </div>
</div>
```

```isml
<!-- account/header.isml -->
<div class="user-greeting">
    <isif condition="${customer.authenticated}">
        <span>Welcome back, ${customer.profile.firstName}!</span>
        <a href="${URLUtils.url('Account-Show')}">My Account</a>
    <iselse>
        <a href="${URLUtils.url('Login-Show')}">Sign In</a>
    </isif>
</div>
```

### Product Recommendations (Personalized)

```isml
<!-- product/productDetails.isml (cached) -->
<iscache type="relative" hour="1"/>

<div class="product-detail">
    <h1>${pdict.Product.name}</h1>
    <p>${pdict.Product.longDescription}</p>
    
    <!-- Static product details (cached) -->
</div>

<!-- Einstein recommendations (personalized, not cached) -->
<div class="recommendations">
    <h2>Recommended for You</h2>
    <iscomponent 
      pipeline="Einstein-Recommendations" 
      productid="${pdict.Product.ID}"
      type="pdp-recs"
    />
</div>
```

### Locale-Specific Content

```isml
<!-- Multi-language footer component -->
<div class="page-footer">
    <iscomponent 
      pipeline="Page-Footer" 
      locale="en_US"
    />
</div>

<!-- Or dynamic locale -->
<div class="page-footer">
    <iscomponent 
      pipeline="Page-Footer" 
      locale="${pdict.currentLocale}"
    />
</div>
```

### Store Locator Widget

```isml
<!-- Homepage with store locator -->
<iscache type="daily"/>

<div class="homepage">
    <h1>Welcome to Our Store</h1>
    
    <!-- Store locator component (may have different cache) -->
    <iscomponent 
      pipeline="Stores-NearestStores" 
      lat="${pdict.userLat}"
      lng="${pdict.userLng}"
      limit="5"
    />
</div>
```

### Recently Viewed Products

```isml
<!-- Cached product page with dynamic recently viewed -->
<iscache type="relative" hour="1" varyby="price_promotion"/>

<div class="product-page">
    <!-- Product details (cached) -->
    
    <div class="recently-viewed">
        <h3>Recently Viewed</h3>
        <!-- Dynamic, session-specific content -->
        <iscomponent pipeline="Product-RecentlyViewed" />
    </div>
</div>
```

### Promotional Banner (Time-Sensitive)

```isml
<!-- Cached page with dynamic promotional banner -->
<iscache type="relative" hour="4"/>

<div class="homepage">
    <!-- Dynamic promotional banner (updates every 15 minutes) -->
    <iscomponent pipeline="Content-PromotionalBanner" />
    
    <!-- Cached homepage content (updates every 4 hours) -->
    <div class="featured-products">
        <!-- Products -->
    </div>
</div>
```

Component can have shorter cache:
```isml
<!-- content/promotionalBanner.isml -->
<iscache type="relative" minute="15"/>

<div class="promo-banner">
    <img src="${pdict.banner.imageURL}" alt="${pdict.banner.alt}" />
    <h2>${pdict.banner.headline}</h2>
</div>
```

## Best Practices

1. **Use for Dynamic Content in Cached Pages:**
   ```isml
   <!-- Cached page -->
   <iscache type="relative" hour="2"/>
   
   <!-- Dynamic component -->
   <iscomponent pipeline="Cart-MiniCart" />
   ```

2. **Pass All Required Parameters:**
   ```isml
   <!-- Good: All parameters provided -->
   <iscomponent 
     pipeline="Product-Show" 
     productid="${product.ID}"
     view="quickview"
   />
   
   <!-- Bad: Missing required parameter -->
   <iscomponent pipeline="Product-Show" />
   ```

3. **Use Descriptive Parameter Names:**
   ```isml
   <!-- Good: Clear parameter names -->
   <iscomponent 
     pipeline="Search-Show" 
     query="${searchTerm}"
     category="${categoryID}"
     resultsPerPage="12"
   />
   ```

4. **Handle Component Errors Gracefully:**
   ```isml
   <!-- In parent template -->
   <iscomponent pipeline="Recommendations-Show" productid="${pdict.Product.ID}" />
   
   <!-- In component controller -->
   // Handle missing product gracefully
   if (!product) {
       res.render('components/empty');
       return next();
   }
   ```

5. **Consider Performance Impact:**
   ```isml
   <iscomment>
       Each iscomponent is a separate server request
       Use sparingly to avoid performance degradation
   </iscomment>
   
   <!-- Good: One component for related functionality -->
   <iscomponent pipeline="Product-Recommendations" />
   
   <!-- Bad: Multiple separate components for same feature -->
   <iscomponent pipeline="Product-Recommendation1" />
   <iscomponent pipeline="Product-Recommendation2" />
   <iscomponent pipeline="Product-Recommendation3" />
   ```

6. **Use Full Pipeline Syntax:**
   ```isml
   <!-- Good: Full pipeline syntax -->
   <iscomponent pipeline="Product-Show" />
   
   <!-- Bad: SEO URL (not supported) -->
   <iscomponent pipeline="/product/wide-screen-tv-12345.html" />
   ```

7. **Document Component Dependencies:**
   ```isml
   <iscomment>
       User Greeting Component
       Pipeline: Account-Header
       Required Parameters: None
       Caching: Not cached (session-specific)
       Purpose: Display user greeting or login link
   </iscomment>
   
   <iscomponent pipeline="Account-Header" />
   ```

8. **Test Component Independently:**
   ```javascript
   // Component should work standalone
   server.get('MiniCart', function (req, res, next) {
       var BasketMgr = require('dw/order/BasketMgr');
       var basket = BasketMgr.getCurrentBasket();
       
       // Render even if no basket
       res.render('components/miniCart', {
           Basket: basket || null
       });
       
       next();
   });
   ```

## Caching Strategies

### Parent Cached, Component Dynamic

```isml
<!-- Parent: category.isml -->
<iscache type="relative" hour="2"/>

<div class="category-page">
    <!-- Cached category content -->
    
    <!-- Dynamic user-specific content -->
    <iscomponent pipeline="User-Recommendations" />
</div>
```

**Use Case:** Category page content rarely changes, but recommendations are personalized.

### Parent Dynamic, Component Cached

```isml
<!-- Parent: account.isml -->
<!-- No cache (user-specific) -->

<div class="account-page">
    <h1>My Account</h1>
    <p>Welcome, ${customer.profile.firstName}!</p>
    
    <!-- Cached help content (same for all users) -->
    <iscomponent pipeline="Content-HelpSection" />
</div>
```

**Use Case:** Account page is personalized, but help content is static.

### Both Cached (Different Durations)

```isml
<!-- Parent: homepage.isml -->
<iscache type="daily"/>

<div class="homepage">
    <!-- Daily cache -->
    
    <!-- Component with shorter cache -->
    <iscomponent pipeline="Content-DailyDeal" />
</div>
```

Component:
```isml
<!-- content/dailyDeal.isml -->
<iscache type="relative" hour="1"/>

<div class="daily-deal">
    <!-- Updates every hour -->
</div>
```

**Use Case:** Homepage updates daily, but daily deal changes hourly.

### Both Dynamic (Different Logic)

```isml
<!-- Parent: checkout.isml -->
<!-- No cache (order-specific) -->

<div class="checkout-page">
    <!-- Order details -->
    
    <!-- Dynamic shipping options component -->
    <iscomponent 
      pipeline="Checkout-ShippingOptions" 
      addressid="${pdict.shippingAddress.ID}"
    />
</div>
```

**Use Case:** Both need to be dynamic but have separate concerns.

## Comparison with Other Include Methods

| Feature | `<iscomponent>` | `<isinclude template>` | `<isinclude url>` |
|---------|----------------|----------------------|------------------|
| **Type** | Remote (server request) | Local (file include) | Remote (HTTP request) |
| **Execution** | Pipeline/Controller | Template only | Any URL |
| **Caching** | Independent | Inherits parent | Independent |
| **Parameters** | Custom attributes | pdict only | URL parameters |
| **Performance** | Slower (HTTP) | Fast (file) | Slower (HTTP) |
| **Use Case** | Reusable components | Template fragments | External content |
| **Syntax** | Pipeline-based | File path | Full URL |

```isml
<!-- iscomponent: Remote pipeline execution -->
<iscomponent pipeline="Product-Show" productid="123" />

<!-- isinclude template: Local template include -->
<isinclude template="components/productTile" />

<!-- isinclude url: Remote URL include -->
<isinclude url="${URLUtils.url('Product-Show', 'pid', '123')}" />
```

## Parameter Handling

### Accessing Parameters in Controller

```javascript
// SFRA Controller
server.get('ShowQuickView', function (req, res, next) {
    // Method 1: httpParameterMap
    var productID = request.httpParameterMap.productid.stringValue;
    var source = request.httpParameterMap.source.stringValue;
    
    // Method 2: req.querystring (SFRA)
    var productID = req.querystring.productid;
    var source = req.querystring.source;
    
    res.render('template', {
        productID: productID,
        source: source
    });
    
    next();
});
```

### Parameter Types

```isml
<!-- String parameters -->
<iscomponent pipeline="Product-Show" productid="12345" />

<!-- Numeric parameters -->
<iscomponent pipeline="Search-Show" start="0" count="12" />

<!-- Boolean parameters -->
<iscomponent pipeline="Content-Show" showprices="true" />

<!-- Expression parameters -->
<iscomponent 
  pipeline="Product-Show" 
  productid="${product.ID}"
  quantity="${selectedQuantity}"
/>
```

## Error Handling

### Component Controller Error Handling

```javascript
server.get('Recommendations', function (req, res, next) {
    try {
        var productID = request.httpParameterMap.productid.stringValue;
        
        if (!productID) {
            // Render empty component
            res.render('components/empty');
            return next();
        }
        
        var recommendations = getRecommendations(productID);
        
        res.render('components/recommendations', {
            recommendations: recommendations
        });
    } catch (e) {
        // Log error and render fallback
        Logger.error('Recommendations component failed: ' + e.message);
        res.render('components/empty');
    }
    
    next();
});
```

### Parent Template Error Handling

```isml
<!-- Component may fail gracefully -->
<div class="recommendations">
    <iscomponent 
      pipeline="Einstein-Recommendations" 
      productid="${pdict.Product.ID}"
    />
    <!-- If component fails, renders empty or fallback -->
</div>

<!-- Page continues normally -->
<div class="product-details">
    <!-- Product information -->
</div>
```

## Performance Considerations

### Impact

- **Server Request:** Each `<iscomponent>` performs a separate server-side HTTP request
- **Latency:** Adds latency to page rendering (sequential execution)
- **Resource Usage:** Multiple components increase server load

### Optimization Strategies

1. **Minimize Component Count:**
   ```isml
   <!-- Better: One component -->
   <iscomponent pipeline="Product-AllRecommendations" />
   
   <!-- Avoid: Multiple components -->
   <iscomponent pipeline="Product-Recommendation1" />
   <iscomponent pipeline="Product-Recommendation2" />
   <iscomponent pipeline="Product-Recommendation3" />
   ```

2. **Cache Components When Possible:**
   ```isml
   <!-- Component template with caching -->
   <iscache type="relative" minute="30"/>
   
   <div class="component-content">
       <!-- Cached component output -->
   </div>
   ```

3. **Use Async Loading for Non-Critical Components:**
   ```isml
   <!-- Critical content -->
   <div class="main-content">
       ${pdict.Product.name}
   </div>
   
   <!-- Non-critical component (could be AJAX-loaded) -->
   <div id="recommendations-container" data-pid="${pdict.Product.ID}">
       <!-- Load via JavaScript after page load -->
   </div>
   ```

4. **Combine Related Functionality:**
   ```javascript
   // Good: One controller handles related data
   server.get('ProductExtras', function (req, res, next) {
       var recommendations = getRecommendations(productID);
       var reviews = getReviews(productID);
       var relatedProducts = getRelatedProducts(productID);
       
       res.render('components/productExtras', {
           recommendations: recommendations,
           reviews: reviews,
           relatedProducts: relatedProducts
       });
       
       next();
   });
   ```

## SEO and URL Considerations

⚠️ **Important:** SEO URLs cannot be used with `<iscomponent>`.

```isml
<!-- Good: Full pipeline syntax -->
<iscomponent pipeline="Product-Show" productid="12345" />

<!-- Bad: SEO URL (NOT SUPPORTED) -->
<iscomponent pipeline="/product/wide-screen-tv-12345.html" />

<!-- Bad: Pretty URL (NOT SUPPORTED) -->
<iscomponent pipeline="/s/Site/Product-Show?pid=12345" />
```

**Always use:** `Controller-Endpoint` format.

## Related Elements

- `<isinclude template>` - Local template include (faster, shares cache)
- `<isinclude url>` - Remote URL include (similar to iscomponent)
- `<iscache>` - Control caching policy for component
- `<isdecorate>` - Template decoration (use with components)

## Notes

- Performs remote server-side HTTP request to execute pipeline/controller
- Each component has independent caching policy
- Parameters passed as query string parameters
- Full pipeline syntax required (SEO URLs not supported)
- Slower than local includes due to HTTP request overhead
- Ideal for embedding reusable, encapsulated functionality
- Component can be personalized while parent page is cached
- Use sparingly to avoid performance degradation
- Component failures should be handled gracefully
- Makes remote include purpose obvious through pipeline association

## Migration Notes

### Legacy Pipelines to SFRA Controllers

```isml
<!-- Legacy Pipeline Syntax -->
<iscomponent pipeline="Product-Show" productid="12345" />

<!-- SFRA Controller Syntax (same format) -->
<iscomponent pipeline="Product-Show" productid="12345" />
```

The syntax remains the same; only the underlying implementation changes from pipelines to SFRA controllers.

### Converting Remote Includes to iscomponent

```isml
<!-- Before: Remote include with URL -->
<isinclude url="${URLUtils.url('Product-Show', 'pid', '12345')}" />

<!-- After: Component (clearer intent) -->
<iscomponent pipeline="Product-Show" productid="12345" />
```

Benefits: Clearer purpose, easier to understand, more maintainable.