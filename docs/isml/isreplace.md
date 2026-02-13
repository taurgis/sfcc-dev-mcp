# ISML isreplace Element

## Overview

The `<isreplace>` element is used within decorator templates to identify where decorated content should be inserted. It works in conjunction with `<isdecorate>` to implement the decorator pattern, allowing templates to wrap content with common layouts such as headers, footers, and page structure.

**Key Features:** Content injection point for decorator pattern, support for multiple or zero replacement points, flexible template composition.

**Note:** `<isreplace>` is only used **inside decorator templates**, not in the templates being decorated.

## Syntax

```isml
<isreplace/>
```

## Attributes

**None** - This is a self-closing tag with no attributes.

## Purpose

The `<isreplace>` element serves to:

1. **Mark Injection Point:** Identify where decorated content should be inserted into the decorator template
2. **Decorator Pattern:** Enable the decorator pattern for template composition
3. **Layout Templates:** Create reusable page layouts that wrap content
4. **Content Separation:** Separate page structure (decorator) from page content (decorated)
5. **Flexible Composition:** Support single, multiple, or zero content insertion points

## How It Works

### The Decorator Pattern Flow

1. **Content Template** uses `<isdecorate>` to specify a decorator template
2. **Decorator Template** contains `<isreplace>` to mark where content goes
3. **Content Replacement** occurs when content from `<isdecorate>` is injected at `<isreplace>`

```isml
<!-- Content Template (product/productDetails.isml) -->
<isdecorate template="common/layout/page">
    <h1>${pdict.product.name}</h1>
    <p>${pdict.product.description}</p>
</isdecorate>

<!-- Decorator Template (common/layout/page.isml) -->
<html>
<head><title>My Store</title></head>
<body>
    <div id="header">
        <isinclude template="common/header"/>
    </div>
    
    <div id="content">
        <isreplace/>  <!-- Product content inserted here -->
    </div>
    
    <div id="footer">
        <isinclude template="common/footer"/>
    </div>
</body>
</html>
```

### Result

```html
<html>
<head><title>My Store</title></head>
<body>
    <div id="header">
        <!-- Header content -->
    </div>
    
    <div id="content">
        <h1>Product Name</h1>
        <p>Product Description</p>
    </div>
    
    <div id="footer">
        <!-- Footer content -->
    </div>
</body>
</html>
```

## Replacement Scenarios

### Single isreplace (Standard Pattern)

**Most Common:** One `<isreplace>` tag identifies the single content injection point.

```isml
<!-- Decorator Template -->
<div class="page-wrapper">
    <isinclude template="common/header"/>
    
    <main class="content">
        <isreplace/>  <!-- Single content insertion point -->
    </main>
    
    <isinclude template="common/footer"/>
</div>
```

### Multiple isreplace Tags

**Advanced Use:** Multiple `<isreplace>` tags cause the decorated content to be **duplicated** at each location.

```isml
<!-- Decorator Template -->
<div class="page-wrapper">
    <!-- First insertion point -->
    <div class="preview">
        <isreplace/>
    </div>
    
    <!-- Second insertion point (duplicate content) -->
    <div class="main-content">
        <isreplace/>
    </div>
</div>
```

**Result:** Content appears in **both** locations.

**Use Cases:**
- Preview and full content views
- Print and screen versions
- Duplicate content for accessibility or SEO

### Zero isreplace Tags

**Omit Content:** If decorator template has **no** `<isreplace>` tag, the decorated content is **not included** in output.

```isml
<!-- Decorator Template (no isreplace) -->
<div class="page-wrapper">
    <isinclude template="common/header"/>
    <isinclude template="common/footer"/>
    <!-- No <isreplace/> - decorated content is omitted -->
</div>
```

**Use Cases:**
- Error pages that ignore content
- Redirect pages
- Maintenance mode pages

## Common Use Cases

### Basic Page Layout Decorator

```isml
<!-- Content Template: product/productDetails.isml -->
<isdecorate template="common/layout/page">
    <div class="product-details">
        <h1>${pdict.product.name}</h1>
        <div class="product-price">
            <isprint value="${pdict.product.price}" style="MONEY_LONG"/>
        </div>
        <button class="add-to-cart">Add to Cart</button>
    </div>
</isdecorate>

<!-- Decorator Template: common/layout/page.isml -->
<!DOCTYPE html>
<html>
<head>
    <title>${pdict.pageTitle}</title>
    <link rel="stylesheet" href="${URLUtils.staticURL('/css/main.css')}"/>
</head>
<body>
    <header>
        <isinclude template="common/header"/>
    </header>
    
    <nav>
        <isinclude template="common/navigation"/>
    </nav>
    
    <main class="main-content">
        <isreplace/>  <!-- Product content inserted here -->
    </main>
    
    <footer>
        <isinclude template="common/footer"/>
    </footer>
</body>
</html>
```

### Page Type Specific Decorators

```isml
<!-- Product Page Decorator: decorator/product.isml -->
<body class="product-page">
    <div id="pt_product">
        <div id="container">
            <div id="main">
                <div id="content">
                    <isreplace/>  <!-- Product content here -->
                </div>
            </div>
            <div id="sidebar">
                <isinclude template="product/recommendations"/>
            </div>
        </div>
    </div>
</body>

<!-- Cart Page Decorator: decorator/cart.isml -->
<body class="cart-page">
    <div id="pt_cart">
        <div id="container">
            <div id="main">
                <div id="content">
                    <isreplace/>  <!-- Cart content here -->
                </div>
            </div>
            <div id="sidebar">
                <isinclude template="cart/summary"/>
            </div>
        </div>
    </div>
</body>
```

### SFRA Page Designer Decorator

```isml
<!-- Content Template: rendering template -->
<isdecorate template="common/layout/page">
    <isslot id="slot1" context="global" description="Slot 1"/>
    <isslot id="slot2" context="global" description="Slot 2"/>
</isdecorate>

<!-- Decorator Template: common/layout/page.isml -->
<!DOCTYPE html>
<html>
<head>
    <isinclude template="common/htmlHead"/>
</head>
<body>
    <div class="page ${pdict.pageType}">
        <header>
            <isinclude template="common/header"/>
        </header>
        
        <main>
            <isreplace/>  <!-- Page Designer slots inserted here -->
        </main>
        
        <footer>
            <isinclude template="common/footer"/>
        </footer>
    </div>
    
    <isinclude template="common/scripts"/>
</body>
</html>
```

### Responsive Layout with Multiple Sections

```isml
<!-- Decorator Template with structured content area -->
<div class="page-wrapper">
    <isinclude template="common/header"/>
    
    <div class="breadcrumbs">
        <isinclude template="common/breadcrumbs"/>
    </div>
    
    <div class="main-container">
        <aside class="sidebar">
            <isinclude template="common/sidebar"/>
        </aside>
        
        <main class="content">
            <isreplace/>  <!-- Main content here -->
        </main>
    </div>
    
    <isinclude template="common/footer"/>
</div>
```

### Checkout Flow Decorator

```isml
<!-- Checkout Decorator: decorator/checkout.isml -->
<body class="checkout">
    <div class="checkout-wrapper">
        <div class="checkout-header">
            <isinclude template="checkout/header"/>
        </div>
        
        <div class="checkout-progress">
            <isinclude template="checkout/progressIndicator"/>
        </div>
        
        <div class="checkout-content">
            <isreplace/>  <!-- Checkout step content -->
        </div>
        
        <div class="checkout-sidebar">
            <isinclude template="checkout/orderSummary"/>
        </div>
    </div>
</body>
```

### Dynamic Decorator Selection

```isml
<!-- Content Template with dynamic decorator -->
<isset name="decoratorTemplate" value="${pdict.isMobile ? 'decorator/mobile' : 'decorator/desktop'}" scope="page"/>

<isdecorate template="${decoratorTemplate}">
    <h1>${pdict.content.title}</h1>
    <p>${pdict.content.body}</p>
</isdecorate>

<!-- Desktop Decorator: decorator/desktop.isml -->
<div class="desktop-layout">
    <div class="three-column">
        <div class="col-left"><isinclude template="common/sidebar"/></div>
        <div class="col-center"><isreplace/></div>
        <div class="col-right"><isinclude template="common/ads"/></div>
    </div>
</div>

<!-- Mobile Decorator: decorator/mobile.isml -->
<div class="mobile-layout">
    <div class="single-column">
        <isreplace/>  <!-- Full width on mobile -->
    </div>
</div>
```

### Multiple isreplace Example (Duplicate Content)

```isml
<!-- Content Template -->
<isdecorate template="decorator/duplicate">
    <div class="product-info">
        <h2>${pdict.product.name}</h2>
        <p>${pdict.product.shortDescription}</p>
    </div>
</isdecorate>

<!-- Decorator Template: decorator/duplicate.isml -->
<div class="page">
    <!-- Preview area (collapsed by default) -->
    <div class="preview" aria-hidden="true">
        <h3>Preview</h3>
        <isreplace/>  <!-- First insertion -->
    </div>
    
    <!-- Main content area -->
    <div class="main-content">
        <isreplace/>  <!-- Second insertion (duplicate) -->
    </div>
</div>

<!-- Result: Product info appears in BOTH preview and main-content divs -->
```

### Zero isreplace Example (Content Omitted)

```isml
<!-- Content Template -->
<isdecorate template="decorator/maintenance">
    <h1>Original Page Content</h1>
    <p>This content will not be displayed.</p>
</isdecorate>

<!-- Decorator Template: decorator/maintenance.isml -->
<div class="maintenance-mode">
    <h1>Site Under Maintenance</h1>
    <p>We'll be back soon!</p>
    <!-- No <isreplace/> tag - decorated content is omitted -->
</div>

<!-- Result: Only maintenance message is shown, original content is discarded -->
```

## Best Practices

### 1. Use Meaningful Decorator Names

Name decorator templates to reflect their purpose:

```isml
<!-- Good: Descriptive names -->
<isdecorate template="decorator/product">
<isdecorate template="decorator/checkout">
<isdecorate template="decorator/account">

<!-- Less clear: Generic names -->
<isdecorate template="decorator/template1">
<isdecorate template="decorator/page">
```

### 2. Keep Decorators Simple and Focused

Decorators should provide structure, not business logic:

```isml
<!-- Good: Structure only -->
<div class="page-wrapper">
    <isinclude template="common/header"/>
    <main><isreplace/></main>
    <isinclude template="common/footer"/>
</div>

<!-- Avoid: Business logic in decorator -->
<div class="page-wrapper">
    <isif condition="${pdict.showPromo}">
        <!-- Complex promo logic -->
    </isif>
    <isreplace/>
</div>
```

### 3. Use Single isreplace Unless You Need Duplication

Stick with one `<isreplace>` tag for clarity:

```isml
<!-- Standard: Single replacement point -->
<main class="content">
    <isreplace/>
</main>

<!-- Only use multiple if truly needed -->
<div class="print-version">
    <isreplace/>  <!-- For print -->
</div>
<div class="screen-version">
    <isreplace/>  <!-- For screen -->
</div>
```

### 4. Document When Using Multiple or Zero isreplace

Add comments to explain non-standard usage:

```isml
<!-- Multiple isreplace: Content appears in both locations for accessibility -->
<div class="visual-content"><isreplace/></div>
<div class="screen-reader-content" aria-live="polite"><isreplace/></div>

<!-- Zero isreplace: Maintenance mode - content intentionally omitted -->
<div class="maintenance-message">
    <h1>Under Maintenance</h1>
    <!-- No <isreplace/> - decorated content not displayed -->
</div>
```

### 5. Organize Decorators by Page Type

Create dedicated decorator directories:

```
templates/
  decorator/
    product.isml
    category.isml
    checkout.isml
    account.isml
    search.isml
    error.isml
```

### 6. Include Common Elements in Decorators

Decorators are ideal for shared page elements:

```isml
<!-- Decorator includes common elements -->
<!DOCTYPE html>
<html>
<head>
    <isinclude template="common/htmlHead"/>
</head>
<body>
    <isinclude template="common/header"/>
    <isinclude template="common/navigation"/>
    
    <main>
        <isreplace/>  <!-- Page-specific content -->
    </main>
    
    <isinclude template="common/footer"/>
    <isinclude template="common/scripts"/>
</body>
</html>
```

### 7. Use Decorators for Consistent Page Structure

Ensure all pages follow the same structural pattern:

```isml
<!-- All product pages use the same decorator -->
<isdecorate template="decorator/product">
    <!-- Product-specific content -->
</isdecorate>

<!-- All category pages use the same decorator -->
<isdecorate template="decorator/category">
    <!-- Category-specific content -->
</isdecorate>
```

## SFRA Pattern

In Storefront Reference Architecture (SFRA), decorators are commonly used with page templates:

```isml
<!-- SFRA Content Template: product/productDetails.isml -->
<iscontent type="text/html" charset="UTF-8" compact="true"/>

<isset name="decoratorTemplate" value="common/layout/page" scope="page"/>

<isdecorate template="${decoratorTemplate}">
    <isscript>
        var assets = require('*/cartridge/scripts/assets');
        assets.addCss('/css/product.css');
        assets.addJs('/js/product.js');
    </isscript>
    
    <div class="product-detail">
        <!-- Product content -->
    </div>
</isdecorate>

<!-- SFRA Decorator: common/layout/page.isml -->
<!DOCTYPE html>
<html lang="${require('dw/util/Locale').getLocale(request.locale).language}">
<head>
    <isinclude template="common/htmlHead"/>
</head>
<body>
    ${require('*/cartridge/scripts/assets.js').styles()}
    
    <div class="page" data-action="${pdict.action}" data-querystring="${pdict.queryString}">
        <isinclude template="common/header"/>
        
        <main id="maincontent">
            <isreplace/>
        </main>
        
        <isinclude template="common/footer"/>
    </div>
    
    ${require('*/cartridge/scripts/assets.js').scripts()}
</body>
</html>
```

## Relationship with isdecorate

`<isreplace>` is always used **inside decorator templates** referenced by `<isdecorate>`:

| Element | Location | Purpose |
|---------|----------|---------|
| `<isdecorate>` | Content template (outer) | Specifies which decorator to use |
| `<isreplace>` | Decorator template (inner) | Marks where content goes |

```isml
<!-- Content Template uses isdecorate -->
<isdecorate template="decorator/page">
    <h1>My Content</h1>
</isdecorate>

<!-- Decorator Template uses isreplace -->
<div class="wrapper">
    <isreplace/>  <!-- Content inserted here -->
</div>
```

## Common Patterns

### Pattern 1: Standard Page Layout

```isml
<!-- Decorator -->
<html>
<head><title>${pdict.title}</title></head>
<body>
    <header><isinclude template="common/header"/></header>
    <main><isreplace/></main>
    <footer><isinclude template="common/footer"/></footer>
</body>
</html>
```

### Pattern 2: Two-Column Layout

```isml
<!-- Decorator -->
<div class="two-column">
    <aside class="sidebar">
        <isinclude template="common/sidebar"/>
    </aside>
    <main class="content">
        <isreplace/>
    </main>
</div>
```

### Pattern 3: Conditional Layout

```isml
<!-- Decorator -->
<div class="page">
    <isif condition="${pdict.showSidebar}">
        <aside><isinclude template="common/sidebar"/></aside>
        <main class="with-sidebar"><isreplace/></main>
    <iselse>
        <main class="full-width"><isreplace/></main>
    </isif>
</div>
```

### Pattern 4: Nested Decorators

```isml
<!-- Outer Content Template -->
<isdecorate template="decorator/page">
    <!-- Inner Content uses another decorator -->
    <isdecorate template="decorator/section">
        <h2>Section Content</h2>
    </isdecorate>
</isdecorate>

<!-- Outer Decorator: decorator/page.isml -->
<html>
<body>
    <main><isreplace/></main>  <!-- Inner decorator inserted here -->
</body>
</html>

<!-- Inner Decorator: decorator/section.isml -->
<div class="section">
    <isreplace/>  <!-- Section content inserted here -->
</div>
```

## Common Errors and Troubleshooting

### Content Not Appearing

**Symptom:** Decorated content doesn't appear in output.

**Causes:**
1. Missing `<isreplace/>` in decorator template
2. Typo in decorator template path
3. Decorator template not found

**Solution:**
```isml
<!-- Check decorator template has <isreplace/> -->
<div class="wrapper">
    <isreplace/>  <!-- Make sure this exists -->
</div>

<!-- Verify decorator path is correct -->
<isdecorate template="common/layout/page">  <!-- Correct path? -->
```

### Content Appearing Multiple Times

**Symptom:** Content is duplicated in output.

**Cause:** Multiple `<isreplace/>` tags in decorator.

**Solution:**
```isml
<!-- Check for multiple isreplace tags -->
<div class="preview"><isreplace/></div>  <!-- First -->
<div class="main"><isreplace/></div>     <!-- Second - causes duplicate -->

<!-- Remove one if duplication not intended -->
<div class="main"><isreplace/></div>
```

### Decorator Not Applied

**Symptom:** Only content appears, no decorator structure.

**Cause:** `<isdecorate>` not properly wrapping content.

**Solution:**
```isml
<!-- Bad: isdecorate not wrapping content -->
<isdecorate template="decorator/page"/>
<h1>Content</h1>

<!-- Good: isdecorate wraps content -->
<isdecorate template="decorator/page">
    <h1>Content</h1>
</isdecorate>
```

## Performance Considerations

### 1. Keep Decorators Lightweight

Decorators are processed for every decorated page:

```isml
<!-- Good: Simple structure -->
<div class="wrapper">
    <isinclude template="common/header"/>
    <main><isreplace/></main>
    <isinclude template="common/footer"/>
</div>

<!-- Avoid: Heavy processing in decorator -->
<div class="wrapper">
    <isloop items="${getAllProducts()}" var="product">  <!-- Expensive! -->
        <!-- Process all products -->
    </isloop>
    <isreplace/>
</div>
```

### 2. Cache Decorator Includes When Possible

Use caching for static decorator sections:

```isml
<!-- Cache static header/footer includes -->
<isinclude template="common/header"/>  <!-- Can be cached -->
<main><isreplace/></main>              <!-- Dynamic content -->
<isinclude template="common/footer"/>  <!-- Can be cached -->
```

## Security Considerations

### 1. Validate Decorator Template Paths

Never use user input directly for decorator template selection:

```isml
<!-- Bad: User input for decorator -->
<isset name="decorator" value="${request.httpParameterMap.template}" scope="page"/>
<isdecorate template="${decorator}">  <!-- SECURITY RISK -->

<!-- Good: Controlled decorator selection -->
<isset name="decorator" value="${pdict.isCheckout ? 'decorator/checkout' : 'decorator/page'}" scope="page"/>
<isdecorate template="${decorator}">
```

### 2. Sanitize Content in Decorators

Ensure proper encoding in decorator templates:

```isml
<!-- Decorator with safe output -->
<div class="page">
    <h1><isprint value="${pdict.pageTitle}" encoding="on"/></h1>
    <main><isreplace/></main>
</div>
```

## Related Elements

- **`<isdecorate>`** - Specifies decorator template to use (wraps content)
- **`<isinclude>`** - Include common sections in decorator templates
- **`<isset>`** - Set decorator template path dynamically

## See Also

- [isdecorate Element](./isdecorate.md)
- [isinclude Element](./isinclude.md)
- [SFRA Controllers Skill](../../ai-instructions/skills/sfcc-sfra-controllers/SKILL.md)
- [Template Composition Patterns](./template-patterns.md)
- [ISML Development Skill](../../ai-instructions/skills/sfcc-isml-development/SKILL.md)
