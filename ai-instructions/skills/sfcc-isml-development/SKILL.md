---
name: sfcc-isml-development
description: Guide for developing ISML templates in Salesforce B2C Commerce SFRA. Use this when asked to create, modify, or troubleshoot ISML templates, work with decorators, or implement template patterns.
---

# ISML Development Skill

This skill guides you through creating and working with ISML templates in Salesforce B2C Commerce.

## Quick Checklist

```text
[ ] No business logic in ISML (no data fetches, no persistence)
[ ] <isscript> used only for asset registration (CSS/JS)
[ ] Output encoding is NOT disabled unless justified and safe
[ ] <iscontent>/<isredirect>/<iscache> placement constraints respected
[ ] Remote includes used sparingly with security middleware
[ ] Template receives all data via pdict (controller owns data)
```

## File Location

```
/my-cartridge/cartridge/templates/
    /default                    # Default locale
        /product/detail.isml
        /util/modules.isml      # Custom tag definitions
    /fr_FR                      # French-specific templates
```

## The Golden Rule: Logic-Free Templates

**NEVER use `<isscript>` for business logic.** The only exception is asset management:

```html
<!-- ✅ Only acceptable use of isscript -->
<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/product.css');
</isscript>
```

All data comes from controllers via `pdict`:

```html
<!-- ✅ Correct: Data from controller -->
<div class="price">${pdict.product.price.sales.formatted}</div>
```

## Essential Tags

### Conditional Logic

```html
<isif condition="${product.available}">
    <span class="in-stock">In Stock</span>
<iselseif condition="${product.preorderable}">
    <span class="preorder">Pre-order</span>
<iselse>
    <span class="out-of-stock">Out of Stock</span>
</isif>
```

### Loops

```html
<isloop items="${products}" var="product" status="loopstate">
    <div class="product ${loopstate.odd ? 'odd' : 'even'}">
        <span>${loopstate.count}. ${product.name}</span>
        <isif condition="${loopstate.first}">
            <span class="badge">Featured</span>
        </isif>
    </div>
</isloop>
```

Loop status: `count` (1-based), `index` (0-based), `first`, `last`, `odd`, `even`

### Variables

```html
<isset name="productName" value="${product.name}" scope="page"/>
<span>${productName}</span>
<isremove name="productName" scope="page"/>
```

Scopes (required): `page`, `request`, `session`, `pdict`

### Output

```html
<!-- HTML encoded (default) -->
<isprint value="${product.name}"/>

<!-- Unencoded (use carefully) -->
<isprint value="${htmlContent}" encoding="off"/>

<!-- Formatted -->
<isprint value="${price}" style="CURRENCY"/>
<isprint value="${order.creationDate}" style="DATE_SHORT"/>
```

### Includes

```html
<!-- Local include (shared pdict) -->
<isinclude template="product/components/price"/>

<!-- Remote include (isolated, own cache) -->
<isinclude url="${URLUtils.url('Product-GetPrice', 'pid', product.ID)}"/>
```

## Decorator Pattern

**Decorator template** (`common/layout/page.isml`):
```html
<!DOCTYPE html>
<html>
<head><title>${pdict.pageTitle}</title></head>
<body>
    <isinclude template="components/header"/>
    <main>
        <isreplace/>  <!-- Content inserted here -->
    </main>
    <isinclude template="components/footer"/>
</body>
</html>
```

**Using decorator:**
```html
<isdecorate template="common/layout/page">
    <div class="content">
        <h1>${pdict.welcomeMessage}</h1>
    </div>
</isdecorate>
```

SFRA provides two default decorators:
- `common/layout/page` - Standard storefront pages
- `common/layout/checkout` - Checkout process pages

## Tag Location Constraints

| Tag | Constraint |
|-----|------------|
| `<iscontent>` | Must be before DOCTYPE |
| `<isredirect>` | Must be before DOCTYPE |
| `<iscache>` | Place at beginning |
| `<isreplace/>` | Only inside decorator templates |
| `<isbreak>/<iscontinue>/<isnext>` | Only inside `<isloop>` |

## Caching

```html
<!-- Cache for 24 hours -->
<iscache type="relative" hour="24"/>

<!-- Daily cache (expires at midnight) -->
<iscache type="daily" hour="0" minute="0"/>

<!-- Vary by price/promotion -->
<iscache type="relative" hour="1" varyby="price_promotion"/>
```

Place `<iscache>` at the beginning of the template.

## Content Type

```html
<!-- Must be first in template -->
<iscontent type="text/html" charset="UTF-8"/>

<!-- For JSON -->
<iscontent type="application/json" charset="UTF-8"/>
```

## Custom Modules

**Define in `util/modules.isml`:**
```html
<ismodule template="components/productcard"
          name="productcard"
          attribute="product"
          attribute="showPrice"/>
```

**Use anywhere:**
```html
<isinclude template="util/modules"/>
<isproductcard product="${product}" showPrice="${true}"/>
```

## Security: XSS Prevention

**Always rely on default encoding.** `<isprint>` automatically HTML-encodes:

```html
<!-- ✅ Secure (default) -->
<isprint value="${pdict.searchPhrase}" />

<!-- ❌ Vulnerable -->
<isprint value="${pdict.searchPhrase}" encoding="off" />
```

For JavaScript context, use `SecureEncoder`:

```html
<script>
    var term = "${require('dw/util/SecureEncoder').forJavaScript(pdict.searchPhrase)}";
</script>
```

## Built-in Utilities

Pre-imported, use directly:

```html
<!-- URLUtils -->
<a href="${URLUtils.url('Product-Show', 'pid', product.ID)}">View</a>
<img src="${URLUtils.staticURL('/images/logo.png')}" alt="Logo"/>

<!-- Resource (localization) -->
${Resource.msg('button.addtocart', 'product', null)}
${Resource.msgf('cart.items', 'cart', null, cartCount)}

<!-- StringUtils -->
${StringUtils.truncate(description, 100, '...')}
```

## Expressions

```html
<!-- Property access -->
${pdict.product.name}
${pdict.product.price.sales.value}

<!-- Method calls -->
${product.getAvailabilityModel().isInStock()}

<!-- Operators -->
${price > 100 ? 'expensive' : 'affordable'}
${firstName + ' ' + lastName}
```

## Comments

```html
<!-- HTML comment (visible in source) -->

<iscomment>
    ISML comment - stripped from output.
    Use for sensitive documentation.
</iscomment>
```

## Best Practices

1. Use `<iscomment>` instead of HTML comments for sensitive info
2. Place `<iscontent>` first in templates that need it
3. Define modules in `util/modules.isml` for consistency
4. Keep templates simple - move logic to controllers/helpers
5. Use decorators for consistent page layouts
6. Enable caching on cacheable pages
7. Default encoding prevents XSS

## MCP ISML Tools

```javascript
search_isml_elements("loop")     // Find by intent
get_isml_element("isprint")      // Full documentation
list_isml_elements()             // All elements by category
```

## Related Skills

- **[sfcc-localization](../sfcc-localization/SKILL.md)** - Essential companion skill for localizing template text. Covers resource bundles, `Resource.msg()`, parameterized messages, locale fallback, and internationalization best practices. **Always use resource bundles instead of hardcoded text in templates.**

## Detailed References

- [Remote Includes](references/REMOTE-INCLUDES.md) - Local vs remote, caching, security
- [Utilities & Expressions](references/UTILITIES-EXPRESSIONS.md) - Built-in objects, expression syntax
- [SFRA Base Templates](references/SFRA-BASE-TEMPLATES-ARCHITECTURE.md) - Layout architecture
