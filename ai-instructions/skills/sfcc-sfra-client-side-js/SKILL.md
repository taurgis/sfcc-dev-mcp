---
name: sfcc-sfra-client-side-js
description: Guide for extending, structuring, validating, and optimizing client-side JavaScript in SFRA storefronts. Use when asked to build AJAX flows, form validation, DOM interactions, or client-side customizations.
---

# SFRA Client-Side JavaScript

Guide for building and extending client-side functionality in SFRA storefronts.

## Quick Checklist

```text
[ ] Use `paths` alias for base extension, never edit app_storefront_base
[ ] Register assets in main request context, not remote includes
[ ] Compose client overrides—no `module.superModule` (server-only)
[ ] Generate controller URLs server-side; pass via `data-*`
[ ] Always include CSRF token on POST (form.serialize() or manual)
[ ] Cache selectors & delegate events for dynamic regions
[ ] Batch DOM updates; debounce high-frequency handlers
[ ] Escape dynamic data inserted into DOM (XSS prevention)
[ ] Provide keyboard & screen reader accessible interactions
[ ] Namespace events for clean teardown
```

## Architecture Overview

SFRA separates:
- **Server runtime resolution** (cartridge path in BM) – affects controllers, scripts, ISML
- **Client build resolution** (compile-time `paths` aliases) – affects `client/default/`

Client behavior is determined **at build time**, not by the live cartridge path.

## Directory Structure

```
app_custom_mybrand/
    cartridge/
        client/
            default/
                js/           # Feature modules
                scss/         # Sass source
```

Guidelines:
- Never modify `app_storefront_base` directly
- Mirror base file locations when extending
- Group by domain (`product/`, `checkout/`)

## Build Process

```bash
npm run compile:js
npm run compile:scss
```

**Key distinction:** Changing the BM cartridge path does not affect already compiled bundles. Recompile after structural changes.

## Asset Loading

Register assets in ISML:
```javascript
assets.addJs('/js/product/detail.js');
assets.addCss('/css/product.css');
```

**Caveat:** Assets added inside remote includes live only in that request and won't appear in the parent page.

## Client-Side Extension

Extension uses **build-time composition**, not runtime inheritance.

### 1. Configure `paths` in `package.json`

```json
{
    "paths": {
        "base": "../storefront-reference-architecture/cartridges/app_storefront_base/"
    }
}
```

### 2. Require, Decorate, Export

```javascript
'use strict';
var base = require('base/product/detail');

// Override existing
base.updateAddToCartButton = function (update) {
    $('button.add-to-cart').attr('disabled', !update.readyToOrder);
    // Custom enhancement
};

// Add new
base.initNotifyMe = function () {
    $('body').on('click', '.notify-me', handleNotifyMe);
};

module.exports = base;
```

**Note:** `module.superModule` does NOT exist client-side.

## jQuery Best Practices

### Selector Caching
```javascript
var $price = $('.product-price');
$price.text('$99.99');
$price.addClass('updated');
```

### Event Delegation
```javascript
// Robust (survives DOM replacement)
$('.product-grid').on('click', '.add-to-cart', handler);
```

### Batch DOM Writes
```javascript
var html = products.map(p => `<li>${escapeHtml(p.name)}</li>`).join('');
$('#product-list').html(html);
```

## AJAX Pattern

```javascript
$('#newsletter-form').on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);
    
    $form.spinner().start();
    
    $.ajax({
        url: $form.data('action-url'),
        type: 'post',
        data: $form.serialize(),  // Includes CSRF
        success: function (data) {
            $form.spinner().stop();
            showMessage(data.success ? 'success' : 'danger', data.message);
        },
        error: function (err) {
            $form.spinner().stop();
            var msg = (err.responseJSON && err.responseJSON.message) || 'Error occurred';
            showMessage('danger', msg);
        }
    });
});
```

## Performance

| Technique | Benefit |
|-----------|---------|
| Debounce typing | Reduces AJAX bursts (250-400ms) |
| Cache selectors | Lower DOM traversal cost |
| Build HTML in memory | Fewer reflows |
| Event delegation | Handles dynamic content |

```javascript
function debounce(fn, wait) {
    var t;
    return function () {
        clearTimeout(t);
        var args = arguments, ctx = this;
        t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
}

$('#search').on('input', debounce(fetchSuggestions, 300));
```

## Accessibility

- Use semantic elements (`<button>`, `<nav>`)
- Add `aria-live="polite"` to AJAX-updated regions
- Manage focus on modal open/close
- Maintain keyboard operability
- Reflect state with ARIA (`aria-expanded`, `aria-pressed`)

```javascript
$('.filter-toggle').on('click', function () {
    var $panel = $('#filter-panel');
    var expanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', !expanded);
    $panel.toggleClass('is-open', !expanded);
    if (!expanded) { 
        $panel.find('input,button,a').first().focus(); 
    }
});
```

## Security: XSS Prevention

Always escape dynamic data:

```javascript
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Or use jQuery
$('<div>').text(userInput);  // Auto-escapes
```

Never trust: query params, form inputs, server-returned user data.

## Module Design Pattern

```javascript
'use strict';
var selectors = { container: '.favorites-container' };

function bindEvents($root) {
    $root.on('click.favoritesAdd', '.favorite-add', onAdd);
}

function unbindEvents($root) { 
    $root.off('.favoritesAdd'); 
}

module.exports = {
    init: function () { bindEvents($(selectors.container)); },
    destroy: function () { unbindEvents($(selectors.container)); }
};
```

Guidelines:
- Namespace every delegated event (`.featureAction`)
- Export `init()` + optional `destroy()`
- Keep pure logic in separate files for testing

## Form Validation Flow

```text
User Input → HTML5 check → (fail) prevent + style
→ (pass) AJAX submit → Server re-validate → Success OR Error JSON
→ Error: map messages → show per-field + global feedback
```

Always validate both client (UX) and server (authority).

## Internationalization

- Never concatenate partial Resource strings
- Use `Resource.msgf` with placeholders
- Avoid hard-coded punctuation in code

```javascript
var template = $('#banner').data('welcome-template'); // "Welcome, {name}!"
$('#banner .text').text(template.replace('{name}', firstName));
```

## Testing Strategy

1. **Pure utilities**: Jest unit tests (no DOM)
2. **DOM behavior**: jsdom + jQuery
3. **Contract tests**: Ensure extended module exports required API
4. **A11y smoke**: Test live regions, keyboard access

## Detailed References

- [Extension Patterns](references/EXTENSION-PATTERNS.md) - Build-time composition, require syntax, module lifecycle
- [AJAX, CSRF & Validation](references/AJAX-CSRF-VALIDATION.md) - Full AJAX patterns, form framework, error handling
- [Plugin Patterns](references/PLUGIN-PATTERNS.md) - Anti-patterns, toast service, code review checklist
- [Base Module Index](references/BASE-MODULE-INDEX.md) - All 56 base modules available for extension
