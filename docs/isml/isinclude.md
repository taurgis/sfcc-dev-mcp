# ISML isinclude Element

## Overview

The `<isinclude>` element includes the contents of one template inside another (local include) or the contents of a URL (remote include). This enables template composition, code reuse, and dynamic content assembly without client-side frames.

**Key Use Cases:** Reusable components (headers, footers, navigation), dynamic content insertion, server-side template composition, and avoiding client-side frame limitations.

## Syntax

```isml
<isinclude
  (template="template_name") | (url="url_path")  // required - one or the other, not both
  sf-toolkit="on" | "off"                         // optional (default: "on")
/>
```

## Required Attributes

### template OR url (Mutually Exclusive)

**You must specify either `template` OR `url`, but not both.**

#### template

**Type:** String or Expression  
**Required:** Yes (if `url` is not specified)

Specifies the name and location of the template to include. This is a **local include** where the ISML code is processed by the application server.

**Path Specification:**
- Relative to cartridge's `templates/default` directory
- Can use forward slashes (`/`) only (no backslashes)
- File extension `.isml` is optional (automatically appended if missing)
- Can be a fixed string or dynamic expression
- Maximum include depth: **20 levels**

**Examples:**
```isml
<!-- Fixed template name -->
<isinclude template="inc/blueBar"/>

<!-- With .isml extension (optional) -->
<isinclude template="reporting/ReportABTesting.isml"/>

<!-- Expression-based (dynamic template selection) -->
<isinclude template="${pdict.Content.template}"/>

<!-- Dynamic template selection -->
<isinclude template="${'ProductTemplates/Template' + pdict.product.templateNumber}"/>

<!-- Common components -->
<isinclude template="common/header"/>
<isinclude template="common/footer"/>
<isinclude template="components/breadcrumbs"/>
```

#### url

**Type:** String or Expression  
**Required:** Yes (if `template` is not specified)

Specifies a URL to include via HTTP(S) connection. This is a **remote include** where content is fetched from a URL (typically on the same server) and the ISML code is **not processed**.

**Important Restrictions:**
- Includes from another server are **not supported**
- SEO URLs **cannot** be included remotely
- Maximum include depth: **16 levels**

**Use Cases:**
- Embed dynamic content with different caching policies
- Trigger another pipeline for content generation
- Combine data from multiple sources into one template

**Examples:**
```isml
<!-- Using URLUtils to construct URL -->
<isinclude url="${URLUtils.url('Page-Include', 'cid', 'COOKIE_TEST')}"/>

<!-- Pipeline trigger for hot deals -->
<isinclude url="${URLUtils.url('BrowseCatalog-Hotdeals', 'catalogCategoryID', 'Storefront')}"/>

<!-- Content asset include -->
<isinclude url="${URLUtils.url('Page-Show', 'cid', pdict.contentAssetID)}"/>

<!-- Dynamic URL -->
<isinclude url="${pdict.remoteContentURL}"/>
```

## Optional Attributes

### sf-toolkit

**Type:** String  
**Allowed Values:** `"on"`, `"off"`  
**Default:** `"on"`  
**Optional:** Yes

Controls whether the `dwMarker` tag is rendered around included content when the Storefront Toolkit is enabled.

**Purpose:** Suppress `dwMarker` tags that can cause Internet Explorer to enter Quirks mode.

**dwMarker Tag Example:**
```html
<!-- dwMarker="linclude" dwTemplateTitle="/default/test/customassets.isml (SiteGenesis Storefront cartridge)" dwTemplateURL="http://localhost:60606/target=/c/sitegenesis_storefront_richUI/t/default/test/customassets.isml" -->
<!DOCTYPE html>
```

**Values:**
- `"on"` (default): Renders `dwMarker` tags when Storefront Toolkit is enabled
- `"off"`: Suppresses `dwMarker` tags to prevent IE Quirks mode

**Important Limitations:**
- Only supported for **local includes** (not remote URL includes)
- **Not applied recursively** - only suppresses marker for the specific include tag, not for child includes within that template

**Examples:**
```isml
<!-- Default: dwMarker rendered (if toolkit enabled) -->
<isinclude template="test/customassets"/>

<!-- Suppress dwMarker to prevent IE Quirks mode -->
<isinclude template="test/customassets" sf-toolkit="off"/>

<!-- Remote includes don't support sf-toolkit attribute -->
<isinclude url="${URLUtils.url('Page-Include')}"/>  <!-- sf-toolkit not applicable -->
```

## Purpose

The `<isinclude>` element enables:

1. **Code Reuse:** Share common components across multiple templates
2. **Template Composition:** Build complex pages from smaller, manageable pieces
3. **Server-Side Frames:** Implement frame-like functionality without client-side frame issues
4. **Dynamic Content:** Include content based on runtime conditions
5. **Caching Flexibility:** Embed content with different caching policies
6. **Pipeline Triggering:** Execute other pipelines to generate included content
7. **Modular Design:** Separate concerns and improve maintainability

## Local Includes (template attribute)

### How It Works

When using the `template` attribute:
1. Template path is resolved relative to `cartridge/templates/default`
2. ISML code in the included template **is processed**
3. Included template has access to:
   - Pipeline Dictionary (`pdict`)
   - Variables from including template
   - Iterators from including template loops
4. Maximum depth: 20 levels (protection against infinite recursion)
5. Processed by application server

### Template Path Resolution

```isml
<!-- Template structure -->
cartridges/
  app_storefront_base/
    templates/
      default/
        inc/
          blueBar.isml
        reporting/
          ReportABTesting.isml
        common/
          header.isml
          footer.isml

<!-- Include paths (relative to templates/default) -->
<isinclude template="inc/blueBar"/>
<isinclude template="reporting/ReportABTesting.isml"/>
<isinclude template="common/header"/>
```

### Path Rules

```isml
<!-- Good: Forward slashes only -->
<isinclude template="components/product/tile"/>

<!-- Bad: Backslashes not supported -->
<isinclude template="components\product\tile"/>  <!-- ERROR -->

<!-- Extension optional -->
<isinclude template="common/header"/>       <!-- OK -->
<isinclude template="common/header.isml"/>  <!-- Also OK -->

<!-- Expression-based paths -->
<isinclude template="${'components/' + pdict.componentType}"/>
```

### Variable and Iterator Access

Included templates can access variables and iterators from the including template:

```isml
<!-- Including template -->
<isset name="pageTitle" value="Product Details" scope="page"/>

<isloop items="${pdict.Basket.productLineItems}" var="lineItem">
  <isinclude template="inc/cartRow"/>
</isloop>

<!-- inc/cartRow.isml (included template) -->
<!-- Can access pageTitle and lineItem from parent template -->
<tr>
  <td>${pageTitle}</td>  <!-- From parent -->
  <td>${lineItem.productName}</td>  <!-- From parent loop -->
  <td>${lineItem.price}</td>
</tr>
```

### Recursion Protection

Maximum include depth prevents infinite loops:

```isml
<!-- Template A includes B -->
<isinclude template="templateB"/>

<!-- Template B includes C -->
<isinclude template="templateC"/>

<!-- ... continues up to 20 levels deep -->

<!-- Level 21: Error logged, include omitted -->
```

## Remote Includes (url attribute)

### How It Works

When using the `url` attribute:
1. Opens HTTP(S) connection to specified URL during runtime
2. Fetches content from URL
3. ISML code in fetched content **is not processed**
4. Result added to template as-is
5. Maximum depth: 16 levels (Web Server configuration)
6. Processed by Web Adapter with calls to application server

### Important Restrictions

```isml
<!-- Supported: URLs on same server -->
<isinclude url="${URLUtils.url('Page-Include', 'cid', 'header')}"/>

<!-- Not Supported: External servers -->
<isinclude url="https://external-site.com/content"/>  <!-- NOT SUPPORTED -->

<!-- Not Supported: SEO URLs -->
<isinclude url="${URLUtils.url('Product-Show', 'pid', productID)}"/>  <!-- SEO URLs not supported -->
```

### Pipeline Dictionary Access

**Important:** Remote includes trigger a new request, so the original Pipeline Dictionary is **not available**.

```isml
<!-- Original request has pdict.Product -->

<!-- Remote include: pdict.Product is NOT available -->
<isinclude url="${URLUtils.url('BrowseCatalog-Hotdeals')}"/>

<!-- Pass data via URL parameters instead -->
<isinclude url="${URLUtils.url('Product-Include', 'pid', pdict.Product.ID)}"/>
```

### Caching Flexibility

Remote includes can have different caching policies than the surrounding page:

```isml
<!-- Cached page template -->
<iscache type="relative" hour="1"/>
<!DOCTYPE html>
<html>
<body>
  <!-- Cached content -->
  
  <!-- Uncached dynamic snippet -->
  <isinclude url="${URLUtils.url('Page-DynamicContent')}"/>
  
  <!-- More cached content -->
</body>
</html>
```

**Opposite scenario:**
```isml
<!-- Uncached page template -->
<!DOCTYPE html>
<html>
<body>
  <!-- Dynamic content -->
  
  <!-- Cached snippet embedded in dynamic page -->
  <isinclude url="${URLUtils.url('Page-CachedFooter')}"/>
</body>
</html>
```

## Common Use Cases

### Header and Footer

```isml
<!-- Standard page structure -->
<!DOCTYPE html>
<html>
<head>
  <isinclude template="common/htmlHead"/>
</head>
<body>
  <!-- Header -->
  <isinclude template="common/header"/>
  
  <!-- Main content -->
  <main>
    <h1>Page Content</h1>
  </main>
  
  <!-- Footer -->
  <isinclude template="common/footer"/>
</body>
</html>
```

### Navigation Menu

```isml
<!-- Menu bar component -->
<isinclude template="inc/blueBar"/>

<!-- The blueBar.isml template provides navigation to:
     - Shopping basket
     - Search functionality
     - Account management
     - etc.
-->
```

### Product Tile in Loop

```isml
<!-- Product grid -->
<div class="product-grid">
  <isloop items="${pdict.products}" var="product">
    <!-- Include reusable product tile -->
    <isinclude template="product/productTile"/>
    <!-- productTile.isml has access to 'product' variable from loop -->
  </isloop>
</div>

<!-- product/productTile.isml -->
<div class="product-tile">
  <img src="${product.images.small[0].url}" alt="${product.name}"/>
  <h3>${product.name}</h3>
  <span class="price">${product.price}</span>
</div>
```

### Cart Line Item

```isml
<!-- Shopping cart -->
<table class="cart-items">
  <isloop items="${pdict.Basket.productLineItems}" var="lineItem">
    <isinclude template="inc/cartRow"/>
  </isloop>
</table>

<!-- inc/cartRow.isml -->
<tr class="cart-row">
  <td>${lineItem.productName}</td>
  <td>${lineItem.quantity}</td>
  <td>${lineItem.price}</td>
  <td>${lineItem.quantity * lineItem.price.value}</td>
</tr>
```

### Dynamic Template Selection

```isml
<!-- Select template based on product type -->
<isscript>
  var templatePath = 'product/components/';
  if (pdict.Product.isBundle()) {
    templatePath += 'bundleDetails';
  } else if (pdict.Product.isVariationGroup()) {
    templatePath += 'variationGroup';
  } else {
    templatePath += 'standardProduct';
  }
</isscript>

<isinclude template="${templatePath}"/>
```

### Template Selection by Number

```isml
<!-- Dynamic template selection based on template number -->
<isinclude template="${'ProductTemplates/Template' + pdict.product.templateNumber}"/>

<!-- If templateNumber = 5, includes: ProductTemplates/Template5.isml -->
```

### Content Asset Include

```isml
<!-- Include content asset via pipeline -->
<isinclude url="${URLUtils.url('Page-Include', 'cid', 'COOKIE_TEST')}"/>

<!-- Include dynamic content asset -->
<isinclude url="${URLUtils.url('Page-Show', 'cid', pdict.contentAssetID)}"/>
```

### Hot Deals Section

```isml
<!-- Trigger BrowseCatalog-Hotdeals pipeline for content -->
<isinclude url="${URLUtils.url('BrowseCatalog-Hotdeals', 'catalogCategoryID', 'Storefront')}"/>
```

### Breadcrumbs

```isml
<!-- Reusable breadcrumb navigation -->
<isif condition="${pdict.showBreadcrumbs}">
  <isinclude template="components/breadcrumbs"/>
</isif>
```

### Error Messages

```isml
<!-- Include form validation errors -->
<isif condition="${pdict.CurrentForms.profile.valid === false}">
  <isinclude template="components/errorMessages"/>
</isif>
```

### Modal Dialog Content

```isml
<!-- Main page -->
<div class="quick-view-modal">
  <isinclude template="product/quickView"/>
</div>
```

### Email Template Components

```isml
<!-- Email template -->
<isinclude template="email/header"/>

<div class="email-content">
  <h1>Order Confirmation</h1>
  <p>Thank you for your order!</p>
</div>

<isinclude template="email/footer"/>
```

### Conditional Component Loading

```isml
<!-- Include different components based on customer type -->
<isif condition="${customer.authenticated}">
  <isinclude template="account/loggedInMenu"/>
<iselse>
  <isinclude template="account/guestMenu"/>
</isif>
```

### Responsive Templates

```isml
<!-- Include mobile or desktop template -->
<isscript>
  var isMobile = request.httpUserAgent.indexOf('Mobile') > -1;
  var templatePath = isMobile ? 'mobile/productDetails' : 'desktop/productDetails';
</isscript>

<isinclude template="${templatePath}"/>
```

### A/B Testing

```isml
<!-- Include different templates for A/B test variants -->
<isscript>
  var variant = session.custom.experimentVariant || 'A';
  var templatePath = 'experiments/checkout' + variant;
</isscript>

<isinclude template="${templatePath}"/>
```

## Internet Explorer Quirks Mode Prevention

### The Problem

When Storefront Toolkit is enabled, `dwMarker` tags are inserted around includes:

```html
<!-- dwMarker causes IE to switch to Quirks mode -->
<!-- dwMarker="linclude" dwTemplateTitle="..." dwTemplateURL="..." -->
<!DOCTYPE html>
<html>
```

**Issue:** The `dwMarker` comment before `<!DOCTYPE html>` causes Internet Explorer to enter Quirks mode, breaking CSS layouts.

### The Solution

Use `sf-toolkit="off"` to suppress the `dwMarker` tag:

```isml
<!-- Without suppression (IE Quirks mode risk) -->
<isinclude template="test/customassets"/>

<!-- With suppression (prevents IE Quirks mode) -->
<isinclude template="test/customassets" sf-toolkit="off"/>
```

### Important Limitations

**Not Recursive:** The `sf-toolkit="off"` attribute only suppresses the marker for that specific include, not for child includes:

```isml
<!-- Parent template -->
<isinclude template="parent" sf-toolkit="off"/>
<!-- dwMarker suppressed for parent -->

<!-- parent.isml -->
<isinclude template="child"/>
<!-- dwMarker NOT suppressed for child (not recursive) -->
```

**Local Includes Only:** Remote URL includes do not support the `sf-toolkit` attribute:

```isml
<!-- Not applicable to remote includes -->
<isinclude url="${URLUtils.url('Page-Include')}" sf-toolkit="off"/>
<!-- sf-toolkit ignored for URL includes -->
```

## Best Practices

### Organize Templates by Purpose

```
templates/
  default/
    common/           - Shared components (header, footer)
      header.isml
      footer.isml
      navigation.isml
    components/       - Reusable UI components
      breadcrumbs.isml
      productTile.isml
      errorMessages.isml
    inc/              - Include fragments
      blueBar.isml
      cartRow.isml
    email/            - Email template components
      header.isml
      footer.isml
```

### Keep Included Templates Focused

```isml
<!-- Good: Single responsibility -->
<!-- components/productPrice.isml -->
<div class="price-container">
  <span class="price">${product.price}</span>
</div>

<!-- Avoid: Too many responsibilities in one include -->
<!-- components/productEverything.isml -->
<!-- (Contains price, availability, ratings, reviews, etc.) -->
```

### Use Descriptive Names

```isml
<!-- Good: Clear purpose -->
<isinclude template="checkout/shippingMethodSelector"/>
<isinclude template="product/availabilityMessage"/>

<!-- Less clear -->
<isinclude template="inc/component1"/>
<isinclude template="misc/helper"/>
```

### Document Include Dependencies

```isml
<iscomment>
  This template requires the following pdict properties:
    - Product: dw.catalog.Product object
    - Quantity: Number (default: 1)
</iscomment>
<isinclude template="product/addToCart"/>
```

### Prefer Local Includes for Template Code

```isml
<!-- Good: Local include for ISML templates -->
<isinclude template="components/productTile"/>

<!-- Avoid: Remote include for simple templates -->
<isinclude url="${URLUtils.url('Page-ProductTile')}"/>
<!-- Unnecessary overhead for simple template inclusion -->
```

### Use Remote Includes for Pipeline Triggers

```isml
<!-- Good: Remote include when triggering another pipeline -->
<isinclude url="${URLUtils.url('Content-GetAsset', 'cid', 'homepage-banner')}"/>

<!-- Good: Remote include for different caching policy -->
<isinclude url="${URLUtils.url('Page-DynamicPromo')}"/>
```

### Pass Context Through pdict

For local includes, use pdict to pass context:

```isml
<!-- Controller prepares data -->
res.render('product/details', {
  Product: product,
  Quantity: 1,
  showReviews: true
});

<!-- Template uses prepared data -->
<isinclude template="product/reviewSection"/>
<!-- reviewSection.isml accesses pdict.Product and pdict.showReviews -->
```

### Avoid Deep Include Nesting

```isml
<!-- Acceptable: 2-3 levels -->
page.isml
  └─ includes header.isml
      └─ includes navigation.isml

<!-- Avoid: Excessive nesting (harder to maintain) -->
page.isml
  └─ includes layout.isml
      └─ includes section.isml
          └─ includes component.isml
              └─ includes subcomponent.isml
                  └─ includes detail.isml  <!-- Too deep! -->
```

## Performance Considerations

### Local Include Performance

- Fast: Processed by application server without network overhead
- Efficient caching: Entire template tree cached together
- No HTTP request overhead

```isml
<!-- Efficient: Local includes -->
<isinclude template="common/header"/>
<isinclude template="common/footer"/>
```

### Remote Include Performance

- Slower: Requires HTTP request to Web Adapter
- Separate caching: Can have independent cache policy
- Network overhead: Extra request processing

```isml
<!-- Less efficient due to HTTP overhead -->
<isinclude url="${URLUtils.url('Page-Include')}"/>

<!-- Use only when necessary (different caching, pipeline trigger) -->
```

### Caching Strategies

```isml
<!-- Cached page with dynamic snippet -->
<iscache type="relative" hour="1"/>
<!DOCTYPE html>
<html>
<body>
  <!-- Static cached content -->
  <div class="static-header">...</div>
  
  <!-- Dynamic uncached snippet via remote include -->
  <isinclude url="${URLUtils.url('Page-PersonalizedContent')}"/>
  
  <!-- More static cached content -->
  <div class="static-footer">...</div>
</body>
</html>
```

## Troubleshooting

### Template Not Found

**Problem:** Error message about template not found.

**Solution:** Verify template path is correct and relative to `templates/default`:

```isml
<!-- Check path -->
templates/
  default/
    components/
      productTile.isml

<!-- Correct include path -->
<isinclude template="components/productTile"/>

<!-- Wrong: Includes "templates/default" in path -->
<isinclude template="templates/default/components/productTile"/>  <!-- ERROR -->
```

### Infinite Include Loop

**Problem:** Template includes itself directly or indirectly.

**Solution:** Review include chain to find circular reference:

```isml
<!-- Template A -->
<isinclude template="templateB"/>

<!-- Template B -->
<isinclude template="templateA"/>  <!-- Circular! -->

<!-- Error logged at depth 20, further includes omitted -->
```

### Variable Not Available in Included Template

**Problem:** Variable from including template not accessible.

**Solution:** Ensure variable is defined before include:

```isml
<!-- Set variable before include -->
<isset name="pageTitle" value="Products" scope="page"/>
<isinclude template="components/header"/>

<!-- components/header.isml can access pageTitle -->
<h1>${pageTitle}</h1>
```

### Remote Include Not Working

**Problem:** Remote include fails or returns empty.

**Solution:** Check URL is valid and points to same server:

```isml
<!-- Verify URLUtils generates correct URL -->
<isscript>
  var includeURL = URLUtils.url('Page-Include', 'cid', 'test');
  // Log or debug to verify URL
</isscript>
<isinclude url="${includeURL}"/>
```

### IE Quirks Mode Issue

**Problem:** Internet Explorer renders in Quirks mode.

**Solution:** Use `sf-toolkit="off"` to suppress dwMarker:

```isml
<!-- Prevents IE Quirks mode -->
<isinclude template="common/htmlHead" sf-toolkit="off"/>
```

## Include Depth Limits

### Local Includes (template)

**Maximum Depth:** 20 levels

**When Reached:**
- Error logged to application server logs
- Templates beyond depth 20 are omitted
- Prevents infinite recursion

```isml
<!-- Level 1 -->
<isinclude template="level2"/>
  <!-- Level 2 -->
  <isinclude template="level3"/>
    <!-- ... continues ... -->
      <!-- Level 20 -->
      <isinclude template="level21"/>  <!-- Error: Omitted -->
```

### Remote Includes (url)

**Maximum Depth:** 16 levels

**When Reached:**
- Error logged to B2C Commerce Web Server logs
- Request processing cancelled
- Part of Web Server configuration

```isml
<!-- Level 1 -->
<isinclude url="${URLUtils.url('Page-Level2')}"/>
  <!-- Level 2 -->
  <isinclude url="${URLUtils.url('Page-Level3')}"/>
    <!-- ... continues ... -->
      <!-- Level 16 -->
      <isinclude url="${URLUtils.url('Page-Level17')}"/>  <!-- Error: Cancelled -->
```

## Comparison: isinclude vs isdecorate

| Feature | `<isinclude>` | `<isdecorate>` |
|---------|---------------|----------------|
| **Purpose** | Insert template content | Wrap content with layout |
| **Content flow** | Included template renders in place | Content goes into decorator's `<isreplace/>` |
| **Use case** | Reusable components, partials | Page layouts, wrappers |
| **Variable access** | Shares variables with parent | Shares variables with decorated content |

```isml
<!-- isinclude: Inserts content at location -->
<div class="header">
  <isinclude template="components/logo"/>
</div>

<!-- isdecorate: Wraps content with layout -->
<isdecorate template="layouts/page">
  <h1>Page content wrapped by layout</h1>
</isdecorate>
```

## Related Elements

- **`<isdecorate>`**: Wrap content with decorator templates
- **`<isreplace/>`**: Used in decorator templates (not with `<isinclude>`)
- **`<ismodule>`**: Include templates with custom attributes
- **`<isslot>`**: Include content slots

## Summary

The `<isinclude>` element is essential for:

- ✅ Building modular, reusable templates
- ✅ Sharing common components (headers, footers, navigation)
- ✅ Creating server-side composition without client frames
- ✅ Dynamic template selection based on runtime conditions
- ✅ Flexible caching with different policies per component
- ✅ Triggering pipelines for content generation
- ✅ Maintaining DRY principle in templates
- ✅ Preventing IE Quirks mode with `sf-toolkit` control

Use `<isinclude>` to create maintainable, modular SFCC templates that promote code reuse and separation of concerns.
