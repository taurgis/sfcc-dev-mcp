# ISML isdecorate Element

## Overview

The `<isdecorate>` element wraps content with a decorator template, allowing you to reuse common layout structures like headers, footers, and page wrappers. The decorator template specifies where the wrapped content should be inserted using the `<isreplace/>` tag.

**Common Use Case:** Apply consistent page layouts (header/footer) to multiple templates without duplicating markup.

## Syntax

```isml
<isdecorate template="template_name">  <!-- required -->
  <!-- Content to be decorated -->
  ...
</isdecorate>
```

## Required Attributes

### template

**Type:** String or Expression  
**Required:** Yes

Specifies the name of the decorator template that wraps the enclosed content.

**Examples:**
```isml
<!-- String literal -->
<isdecorate template="common/layout/page">
  <h1>Page Content</h1>
</isdecorate>

<!-- Expression -->
<isdecorate template="${pdict.layoutTemplate}">
  <div class="content">${pdict.body}</div>
</isdecorate>

<!-- Relative path -->
<isdecorate template="decorators/standardPage">
  <div class="main-content">...</div>
</isdecorate>
```

## Purpose

The `<isdecorate>` element enables:

1. **Layout Reuse:** Apply common page structures (header/footer/navigation) across multiple templates
2. **Separation of Concerns:** Keep content templates focused on content, layout templates focused on structure
3. **Consistent Design:** Ensure uniform page structure throughout the site
4. **Maintenance Efficiency:** Update layout in one place, affecting all decorated pages
5. **Flexible Composition:** Nest decorators for complex layout hierarchies

## How Decoration Works

### The Decorator Template

The decorator template contains the layout structure and uses `<isreplace/>` tag(s) to specify where the decorated content should be inserted.

**Key Points:**
- Typically uses **one** `<isreplace/>` tag
- Can use **multiple** `<isreplace/>` tags (content repeated at each location)
- Can use **zero** `<isreplace/>` tags (decorated content is omitted)

### isreplace Tag Behavior

| Number of `<isreplace/>` Tags | Result |
|-------------------------------|--------|
| **1** (typical) | Decorated content inserted at that location |
| **Multiple** | Decorated content inserted at each `<isreplace/>` location |
| **Zero** | Decorated content is omitted from output |

## Basic Example

### Content Template (product.isml)

```isml
<isdecorate template="common/layout/page">
  <div class="product-details">
    <h1>${pdict.Product.name}</h1>
    <p>${pdict.Product.shortDescription}</p>
    <span class="price">${pdict.Product.price}</span>
  </div>
</isdecorate>
```

### Decorator Template (common/layout/page.isml)

```isml
<!DOCTYPE html>
<html>
<head>
  <title>${pdict.pageTitle}</title>
  <link rel="stylesheet" href="${URLUtils.staticURL('/css/main.css')}">
</head>
<body>
  <!-- Header -->
  <isinclude template="common/header"/>
  
  <!-- Main content area - decorated content inserted here -->
  <main class="main-content">
    <isreplace/>
  </main>
  
  <!-- Footer -->
  <isinclude template="common/footer"/>
</body>
</html>
```

### Resulting Output

```html
<!DOCTYPE html>
<html>
<head>
  <title>Product Details</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <!-- Header content -->
  
  <main class="main-content">
    <!-- Decorated content inserted here -->
    <div class="product-details">
      <h1>Awesome Product</h1>
      <p>This is a great product.</p>
      <span class="price">$99.99</span>
    </div>
  </main>
  
  <!-- Footer content -->
</body>
</html>
```

## Common Use Cases

### Standard Page Layout

Apply consistent header, navigation, and footer to all pages:

```isml
<!-- templates/default/product/productDetails.isml -->
<isdecorate template="common/layout/page">
  <div class="product-container">
    <h1>${pdict.Product.name}</h1>
    <div class="product-info">
      <!-- Product details -->
    </div>
  </div>
</isdecorate>
```

**Decorator template:**
```isml
<!-- templates/default/common/layout/page.isml -->
<!DOCTYPE html>
<html lang="${request.locale}">
<head>
  <isinclude template="common/htmlhead"/>
</head>
<body>
  <div class="page-wrapper">
    <isinclude template="common/header"/>
    <nav><isinclude template="common/navigation"/></nav>
    
    <main role="main">
      <isreplace/>
    </main>
    
    <isinclude template="common/footer"/>
  </div>
  <isinclude template="common/scripts"/>
</body>
</html>
```

### Two-Column Layout

Create a sidebar layout with decorator:

```isml
<!-- Content template -->
<isdecorate template="layouts/twoColumn">
  <div class="category-products">
    <isloop items="${pdict.products}" var="product">
      <div class="product-tile">${product.name}</div>
    </isloop>
  </div>
</isdecorate>
```

**Decorator template:**
```isml
<!-- layouts/twoColumn.isml -->
<isdecorate template="common/layout/page">
  <div class="two-column-layout">
    <aside class="sidebar">
      <isinclude template="search/refinements"/>
    </aside>
    
    <div class="main-column">
      <isreplace/>
    </div>
  </div>
</isdecorate>
```

### Checkout Layout

Special layout for checkout pages:

```isml
<!-- checkout/shipping.isml -->
<isdecorate template="checkout/checkoutLayout">
  <div class="shipping-form">
    <h2>Shipping Information</h2>
    <form action="${URLUtils.url('CheckoutShippingServices-SubmitShipping')}" method="post">
      <!-- Shipping form fields -->
    </form>
  </div>
</isdecorate>
```

**Checkout decorator:**
```isml
<!-- checkout/checkoutLayout.isml -->
<!DOCTYPE html>
<html>
<head>
  <title>Checkout - ${pdict.CurrentStep.displayName}</title>
</head>
<body class="checkout-page">
  <isinclude template="checkout/checkoutHeader"/>
  
  <div class="checkout-container">
    <isinclude template="checkout/progressIndicator"/>
    
    <main class="checkout-content">
      <isreplace/>
    </main>
  </div>
  
  <isinclude template="checkout/checkoutFooter"/>
</body>
</html>
```

### Email Template Layout

Decorate email content with email-specific layout:

```isml
<!-- email/orderConfirmation.isml -->
<isdecorate template="email/emailLayout">
  <h1>Order Confirmation</h1>
  <p>Thank you for your order ${pdict.Order.orderNo}!</p>
  
  <h2>Order Details</h2>
  <table>
    <isloop items="${pdict.Order.productLineItems}" var="lineItem">
      <tr>
        <td>${lineItem.productName}</td>
        <td>${lineItem.price}</td>
      </tr>
    </isloop>
  </table>
</isdecorate>
```

**Email decorator:**
```isml
<!-- email/emailLayout.isml -->
<iscontent type="text/html" charset="UTF-8"/>
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Email-safe inline styles */
    body { font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <table width="600" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <!-- Email header -->
        <isinclude template="email/header"/>
      </td>
    </tr>
    <tr>
      <td>
        <!-- Email content -->
        <isreplace/>
      </td>
    </tr>
    <tr>
      <td>
        <!-- Email footer -->
        <isinclude template="email/footer"/>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Modal/Dialog Layout

Decorate modal content with modal wrapper:

```isml
<!-- account/quickView.isml -->
<isdecorate template="components/modalLayout">
  <div class="quick-view-content">
    <h2>${pdict.Product.name}</h2>
    <img src="${pdict.Product.images.large[0].url}" alt="${pdict.Product.name}"/>
    <div class="product-price">${pdict.Product.price}</div>
  </div>
</isdecorate>
```

**Modal decorator:**
```isml
<!-- components/modalLayout.isml -->
<div class="modal-dialog">
  <div class="modal-header">
    <button class="close-button" aria-label="Close">×</button>
  </div>
  <div class="modal-body">
    <isreplace/>
  </div>
  <div class="modal-footer">
    <button class="btn-primary">Close</button>
  </div>
</div>
```

## Nested Decorators

Decorators can be nested to arbitrary depth, allowing complex layout compositions:

```isml
<isdecorate template="layouts/basePage">
  <isdecorate template="layouts/twoColumn">
    <isdecorate template="components/panel">
      <h1>Nested Content</h1>
      <p>This content is wrapped by three decorator layers.</p>
    </isdecorate>
  </isdecorate>
</isdecorate>
```

### Nested Example: Category Page

```isml
<!-- search/categoryLanding.isml -->
<!-- Outer: Page layout with header/footer -->
<isdecorate template="common/layout/page">
  
  <!-- Middle: Two-column layout with sidebar -->
  <isdecorate template="layouts/twoColumn">
    
    <!-- Inner: Content panel with border/padding -->
    <isdecorate template="components/contentPanel">
      
      <!-- Actual content -->
      <h1>${pdict.Category.displayName}</h1>
      <div class="category-description">
        ${pdict.Category.description}
      </div>
      
      <div class="product-grid">
        <isloop items="${pdict.products}" var="product">
          <div class="product-tile">
            ${product.name}
          </div>
        </isloop>
      </div>
      
    </isdecorate>
  </isdecorate>
  
</isdecorate>
```

**Output structure:**
```
basePage (html/head/body/header/footer)
  └─ twoColumn (sidebar + main column)
      └─ contentPanel (border/padding/shadow)
          └─ Actual category content
```

### Different Decorators in Nested Scenario

```isml
<isdecorate template="layouts/mainLayout">
  <div class="left-section">
    <isdecorate template="layouts/cardLayout">
      <h2>Card Content 1</h2>
    </isdecorate>
  </div>
  
  <div class="right-section">
    <isdecorate template="layouts/panelLayout">
      <h2>Panel Content 2</h2>
    </isdecorate>
  </div>
</isdecorate>
```

## Multiple isreplace Tags

A decorator can have multiple `<isreplace/>` tags, causing the decorated content to be inserted at each location:

### Decorator with Multiple Replacements

```isml
<!-- decorators/mirrorLayout.isml -->
<div class="mirror-layout">
  <div class="top-section">
    <h3>Top Section</h3>
    <isreplace/>
  </div>
  
  <div class="middle-section">
    <h3>Middle Section</h3>
    <isreplace/>
  </div>
  
  <div class="bottom-section">
    <h3>Bottom Section</h3>
    <isreplace/>
  </div>
</div>
```

### Using the Multi-Replace Decorator

```isml
<isdecorate template="decorators/mirrorLayout">
  <p>This content appears three times!</p>
</isdecorate>
```

### Result

```html
<div class="mirror-layout">
  <div class="top-section">
    <h3>Top Section</h3>
    <p>This content appears three times!</p>
  </div>
  
  <div class="middle-section">
    <h3>Middle Section</h3>
    <p>This content appears three times!</p>
  </div>
  
  <div class="bottom-section">
    <h3>Bottom Section</h3>
    <p>This content appears three times!</p>
  </div>
</div>
```

## Zero isreplace Tags

If the decorator template has **no** `<isreplace/>` tags, the decorated content is **omitted** from the output:

### Decorator Without isreplace

```isml
<!-- decorators/noContentLayout.isml -->
<div class="wrapper">
  <h1>Static Header</h1>
  <p>This decorator ignores the decorated content.</p>
  <!-- No <isreplace/> tag -->
  <footer>Static Footer</footer>
</div>
```

### Using the No-Replace Decorator

```isml
<isdecorate template="decorators/noContentLayout">
  <p>This content will NOT appear in the output!</p>
</isdecorate>
```

### Result

```html
<div class="wrapper">
  <h1>Static Header</h1>
  <p>This decorator ignores the decorated content.</p>
  <footer>Static Footer</footer>
</div>
<!-- The decorated content is omitted -->
```

## Dynamic Decorator Selection

Use expressions to dynamically select decorators based on conditions:

```isml
<!-- Select layout based on page type -->
<isscript>
  var layoutTemplate;
  if (pdict.isCheckout) {
    layoutTemplate = 'checkout/checkoutLayout';
  } else if (pdict.isAccount) {
    layoutTemplate = 'account/accountLayout';
  } else {
    layoutTemplate = 'common/layout/page';
  }
</isscript>

<isdecorate template="${layoutTemplate}">
  <div class="page-content">
    ${pdict.content}
  </div>
</isdecorate>
```

### Responsive Layout Selection

```isml
<isscript>
  var isMobile = request.httpUserAgent.indexOf('Mobile') > -1;
  var layout = isMobile ? 'layouts/mobile' : 'layouts/desktop';
</isscript>

<isdecorate template="${layout}">
  <div class="content">
    <!-- Content here -->
  </div>
</isdecorate>
```

### A/B Test Layout

```isml
<isscript>
  var experimentGroup = session.custom.experimentGroup;
  var layout = (experimentGroup === 'A') ? 'layouts/variantA' : 'layouts/variantB';
</isscript>

<isdecorate template="${layout}">
  <div class="experiment-content">
    <!-- A/B tested content -->
  </div>
</isdecorate>
```

## Best Practices

### Keep Decorators Simple

```isml
<!-- Good: Simple, focused decorator -->
<!DOCTYPE html>
<html>
<head><isinclude template="common/head"/></head>
<body>
  <isinclude template="common/header"/>
  <main><isreplace/></main>
  <isinclude template="common/footer"/>
</body>
</html>

<!-- Avoid: Complex logic in decorators -->
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <isif condition="${complex.logic}">
    <!-- Lots of conditional rendering -->
  </isif>
  <isreplace/>
  <!-- More complex logic -->
</body>
</html>
```

### Use Consistent Decorator Naming

```
templates/
  decorators/
    page.isml           - Base page decorator
    twoColumn.isml      - Two-column layout
    threeColumn.isml    - Three-column layout
  checkout/
    checkoutLayout.isml - Checkout-specific decorator
  email/
    emailLayout.isml    - Email template decorator
```

### Provide Context via pdict

Pass necessary data to decorators through `pdict`:

```isml
<!-- Controller -->
res.render('product/details', {
  Product: product,
  pageTitle: product.name,
  showBreadcrumbs: true,
  layoutClass: 'product-page'
});

<!-- Decorator uses pdict -->
<!DOCTYPE html>
<html>
<head>
  <title>${pdict.pageTitle}</title>
</head>
<body class="${pdict.layoutClass}">
  <isif condition="${pdict.showBreadcrumbs}">
    <isinclude template="components/breadcrumbs"/>
  </isif>
  <main><isreplace/></main>
</body>
</html>
```

### Document Decorator Requirements

Add comments documenting what pdict properties the decorator expects:

```isml
<!-- layouts/standardPage.isml -->
<iscomment>
  Required pdict properties:
    - pageTitle: String - Page title for <title> tag
    - metaDescription: String - Meta description
    - layoutClass: String - CSS class for <body>
  
  Optional pdict properties:
    - breadcrumbs: Array - Breadcrumb data
    - showSidebar: Boolean - Whether to show sidebar
</iscomment>

<!DOCTYPE html>
<html>
<!-- Decorator implementation -->
</html>
```

### Avoid Deep Nesting

```isml
<!-- Acceptable: 2-3 levels of nesting -->
<isdecorate template="common/page">
  <isdecorate template="layouts/twoColumn">
    <div>Content</div>
  </isdecorate>
</isdecorate>

<!-- Avoid: Excessive nesting (harder to debug) -->
<isdecorate template="level1">
  <isdecorate template="level2">
    <isdecorate template="level3">
      <isdecorate template="level4">
        <isdecorate template="level5">
          <div>Too deeply nested!</div>
        </isdecorate>
      </isdecorate>
    </isdecorate>
  </isdecorate>
</isdecorate>
```

### Single Responsibility

Each decorator should have a single, clear purpose:

```isml
<!-- Good: Focused decorators -->
page.isml           - Overall page structure
twoColumn.isml      - Column layout
card.isml           - Card styling

<!-- Avoid: Decorator trying to do too much -->
pageWithColumnsAndCardsAndModals.isml  - Too many responsibilities
```

## Performance Considerations

### Cache Compatibility

Decorators work with cached templates—the entire decorated output is cached:

```isml
<!-- Both decorator and content are cached together -->
<iscache type="relative" hour="1"/>
<isdecorate template="common/layout/page">
  <div class="cached-content">
    ${pdict.Product.name}
  </div>
</isdecorate>
```

### Template Organization

Organize decorators for efficient loading:

```
cartridges/
  app_storefront_base/
    templates/
      default/
        decorators/       - Reusable decorators
          page.isml
          twoColumn.isml
        common/
          layout/
            page.isml     - Main page decorator
        product/
          productDetails.isml  - Uses decorator
```

## Troubleshooting

### Content Not Appearing

**Problem:** Decorated content doesn't appear in output.

**Solution:** Ensure the decorator template has at least one `<isreplace/>` tag:

```isml
<!-- Decorator must include <isreplace/> -->
<div class="wrapper">
  <isreplace/>  <!-- Content inserted here -->
</div>
```

### Content Duplicated

**Problem:** Content appears multiple times.

**Solution:** Check if decorator has multiple `<isreplace/>` tags (intentional or unintentional):

```isml
<!-- This decorator will duplicate content -->
<div class="top"><isreplace/></div>
<div class="bottom"><isreplace/></div>  <!-- Remove if duplication is unintended -->
```

### Decorator Not Found

**Problem:** Template not found error.

**Solution:** Verify decorator template path is correct:

```isml
<!-- Check template path -->
<isdecorate template="common/layout/page">  <!-- Correct path -->
<isdecorate template="layout/page">         <!-- May be wrong path -->
```

### Nested Decorator Issues

**Problem:** Nested decorators not rendering correctly.

**Solution:** Ensure each decorator has proper `<isreplace/>` tags and closing `</isdecorate>` tags:

```isml
<!-- Verify proper nesting -->
<isdecorate template="outer">
  <isdecorate template="inner">
    Content
  </isdecorate>  <!-- Don't forget closing tags -->
</isdecorate>
```

## Related Elements

- **`<isreplace/>`**: Marks where decorated content is inserted in decorator template
- **`<isinclude>`**: Includes templates without decoration (different use case)
- **`<ismodule>`**: Includes reusable components with parameters

## Comparison: isdecorate vs isinclude

| Feature | `<isdecorate>` | `<isinclude>` |
|---------|----------------|---------------|
| **Purpose** | Wrap content with layout | Insert template content |
| **Content flow** | Content goes into decorator | Included template renders in place |
| **Use case** | Page layouts, wrappers | Reusable components, partials |
| **Requires** | `<isreplace/>` in decorator | Nothing special |

```isml
<!-- isdecorate: Wraps content -->
<isdecorate template="layouts/page">
  <h1>This is wrapped by the layout</h1>
</isdecorate>

<!-- isinclude: Inserts content -->
<isinclude template="components/header"/>
```

## Summary

The `<isdecorate>` element is powerful for:

- ✅ Creating reusable page layouts
- ✅ Applying consistent structure (header/footer/navigation)
- ✅ Separating content from presentation
- ✅ Supporting nested layout hierarchies
- ✅ Enabling dynamic layout selection
- ✅ Maintaining DRY (Don't Repeat Yourself) principle
- ✅ Simplifying template maintenance

Use `<isdecorate>` to build maintainable, consistent page structures throughout your B2C Commerce storefront.
