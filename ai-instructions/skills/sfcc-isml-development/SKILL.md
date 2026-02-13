---
name: sfcc-isml-development
description: SFRA-first guide for developing ISML templates in Salesforce B2C Commerce (Bootstrap 4 conventions). Use this when creating, modifying, or troubleshooting SFRA templates, decorators, components, forms, includes, and caching.
---

# ISML Development (SFRA + Bootstrap 4)

This skill is **SFRA-only**. It intentionally avoids SiteGenesis patterns.

SFRA storefront markup is built around **Bootstrap 4** (grid, forms, alerts, utilities). Keep your ISML consistent with existing SFRA markup and CSS conventions.

## When to Use

- You’re editing `templates/default/**` in an SFRA cartridge.
- You need to apply/extend SFRA layout (`common/layout/page` / `common/layout/checkout`).
- You’re building reusable components via `<isinclude>` and Bootstrap 4 markup.
- You’re debugging output encoding, caching, or remote include behaviour.

## When NOT to Use

- For business logic, data fetching, persistence, or complex transformations (belongs in controllers/models/scripts).
- For redesigning UI with a different framework (SFRA baseline expects Bootstrap 4).

## Quick Checklist

```text
[ ] No business logic in ISML (no data fetches, no persistence)
[ ] <isscript> used only for SFRA asset registration (CSS/JS)
[ ] Output encoding is NOT disabled unless justified and safe
[ ] <iscontent>/<isredirect>/<iscache> placement constraints respected
[ ] Remote includes used sparingly with security middleware
[ ] Template receives all data via pdict (controller owns data)
[ ] Markup uses Bootstrap 4 classes (grid, forms, alerts)
```

## Where Templates Live (SFRA)

```
/my-cartridge/cartridge/templates/
    /default                    # Default templates (SFRA)
        /product/detail.isml
        /util/modules.isml      # Optional: <ismodule> tag definitions
    /fr_FR                      # Locale overrides (use sparingly)
```

## SFRA Golden Rule: Templates Are Presentation-Only

**NEVER use `<isscript>` for business logic.** The only exception is asset management:

```html
<!-- ✅ Only acceptable use of isscript -->
<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/product.css');
    assets.addJs('/js/product.js');
</isscript>
```

All data comes from controllers via `pdict`:

```html
<!-- ✅ Correct: Data from controller -->
<div class="price h5 mb-0">${pdict.product.price.sales.formatted}</div>
```

## Bootstrap 4 Conventions (SFRA UI Baseline)

Use these classes/patterns by default:

| Goal | Bootstrap 4 pattern |
|------|----------------------|
| Layout | `container` → `row` → `col-*` |
| Spacing | `mt-*`, `mb-*`, `py-*`, `px-*` |
| Buttons | `btn btn-primary`, `btn btn-outline-primary` |
| Alerts | `alert alert-danger`, `alert alert-success` |
| Forms | `form-group`, `form-control`, `is-invalid`, `invalid-feedback` |
| Responsive show/hide | `d-none d-md-block`, `d-md-none` |

Avoid mixing Bootstrap 5-only classes (e.g. `g-*`, `row-cols-*`, `btn-close`, `badge bg-*`) into SFRA baseline templates.

## Essential Tags

### Conditional Logic

```html
<isif condition="${pdict.product.available}">
    <span class="badge badge-success">${Resource.msg('label.instock','product',null)}</span>
<iselseif condition="${pdict.product.preorderable}">
    <span class="badge badge-info">${Resource.msg('label.preorder','product',null)}</span>
<iselse>
    <span class="badge badge-secondary">${Resource.msg('label.outofstock','product',null)}</span>
</isif>
```

### Loops

```html
<isloop items="${products}" var="product" status="loopstate">
    <div class="col-6 col-sm-4 col-lg-3 mb-3">
        <div class="card h-100">
            <div class="card-body">
                <div class="small text-muted">#${loopstate.count}</div>
                <div class="font-weight-bold">${product.name}</div>
            </div>
        <isif condition="${loopstate.first}">
            <div class="card-footer bg-transparent">
                <span class="badge badge-warning">${Resource.msg('label.featured','common',null)}</span>
            </div>
        </isif>
        </div>
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

Prefer local includes for components. Only use remote includes when you need an **independent cache policy** or **request isolation**; see the remote include reference.

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

SFRA provides two primary decorators:
- `common/layout/page` - Standard storefront pages
- `common/layout/checkout` - Checkout process pages

Use `<isdecorate>` on almost all storefront templates; keep full `<html>/<head>/<body>` only in layout templates.

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

Prefer **controller caching middleware** (SFRA `*/cartridge/scripts/middleware/cache`) for page-level caching decisions; use `<iscache>` selectively for fragments.

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

In SFRA, most reuse is done via `<isinclude template="...">`. Use `<ismodule>` custom tags only when it measurably improves readability/consistency.

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

For HTML attributes, prefer `SecureEncoder.forHTMLAttribute(...)`. Avoid `encoding="off"` unless the value is fully controlled and intentionally contains HTML.

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

1. Use Bootstrap 4 components/utilities for UI consistency
2. Use `<isdecorate>` with SFRA layouts (`common/layout/page`, `common/layout/checkout`)
3. Keep templates “dumb”: controllers/models prepare view models; templates render
4. Use `<isinclude template>` for component composition; keep components small
5. Default encoding prevents XSS; use `SecureEncoder` for JS/attribute contexts
6. Minimize remote includes; when used, require `server.middleware.include` + explicit security + cache policy
7. Prefer controller caching middleware; use `<iscache>` thoughtfully

## Common SFRA Form Pattern (Bootstrap 4)

```html
<form action="${URLUtils.url('Account-Login')}" method="post" class="login">
    <input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>

    <div class="form-group">
        <label class="form-control-label" for="login-email">
            ${Resource.msg('label.login.email','login',null)}
        </label>
        <input
            id="login-email"
            type="email"
            class="form-control <isif condition="${pdict.loginForm.username.invalid}">is-invalid</isif>"
            name="${pdict.loginForm.username.htmlName}"
            value="${pdict.loginForm.username.value}"
            autocomplete="email"
            required>
        <isif condition="${pdict.loginForm.username.invalid}">
            <div class="invalid-feedback">
                <isprint value="${pdict.loginForm.username.error}"/>
            </div>
        </isif>
    </div>

    <button type="submit" class="btn btn-primary btn-block">
        ${Resource.msg('button.login','login',null)}
    </button>
</form>
```

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
- [SFRA Base Templates (Index)](references/sfra-base-templates-architecture.md) - Jumping-off point
- [SFRA Layouts](references/SFRA-LAYOUTS.md) - Decorators, hooks, `<isreplace/>`
- [SFRA Structure & Components](references/SFRA-STRUCTURE-COMPONENTS.md) - Where templates live, composition patterns
- [SFRA Pages: Catalog/Search](references/SFRA-PAGES-CATALOG.md) - Homepage/PDP/search/category patterns
- [SFRA Pages: Cart/Account/Auth](references/SFRA-PAGES-CART-ACCOUNT-AUTH.md) - Cart/account/login patterns

## External Reference

- Legacy long-form doc (for deeper examples): https://raw.githubusercontent.com/taurgis/sfcc-dev-mcp/refs/heads/main/docs/best-practices/isml_templates.md
