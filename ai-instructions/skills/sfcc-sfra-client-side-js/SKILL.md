---
name: sfcc-sfra-client-side-js
description: Comprehensive guide for extending, structuring, validating, and optimizing client-side JavaScript in SFRA storefronts. Use when asked to build AJAX flows, form validation, DOM interactions, or client-side customizations.
---

# Mastering Client-Side JavaScript in Salesforce B2C Commerce (SFRA)

This guide distills architectural fundamentals and production-grade patterns for building, extending, and optimizing client-side functionality in SFRA storefronts. It complements base documentation by focusing on how things *really* work in practice: build-time aliasing, asset injection, extension patterns, AJAX + CSRF flows, robust validation, DOM efficiency, accessibility, and maintainable modular code.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Cartridges & Directory Structure](#cartridges--directory-structure)
3. [Build Process & Cross-Cartridge Inheritance](#build-process--cross-cartridge-inheritance)
4. [Asset Loading via `assets.js`](#asset-loading-via-assetsjs)
5. [Client-Side Extension Pattern](#client-side-extension-pattern)
     - [Misconception: `module.superModule`](#misconception-modulesupermodule)
     - [Extension Steps](#extension-steps)
     - [Full PDP Example](#full-pdp-extension-example)
6. [`require()` Path Syntax Reference](#require-path-syntax-reference)
7. [AJAX Architecture & CSRF](#ajax-architecture--csrf)
8. [Newsletter End-to-End Example](#newsletter-end-to-end-example)
9. [Form Framework & Validation Flow](#form-framework--validation-flow)
10. [jQuery / DOM Best Practices](#jquery--dom-best-practices)
11. [Performance Optimization](#performance-optimization)
12. [Accessibility (A11y)](#accessibility-a11y)
13. [Code Quality & Maintainability](#code-quality--maintainability)
14. [Quick Checklist](#quick-checklist)
15. [Event & Module Design Patterns](#event--module-design-patterns)
16. [Security & Data Protection](#security--data-protection)
17. [Advanced AJAX & Error Handling](#advanced-ajax--error-handling)
18. [Testing Strategy for Client Modules](#testing-strategy-for-client-modules)
19. [Instrumentation & Telemetry](#instrumentation--telemetry)
20. [Internationalization (i18n)](#internationalization-i18n)

---

## Architecture Overview
SFRA separates:
- **Server runtime resolution** (cartridge path in Business Manager) – affects controllers, scripts, ISML.
- **Client build resolution** (compile-time `paths` aliases) – affects only assets under `cartridge/client/default/`.

Client-side behavior is determined **at build time**, not by the live cartridge path. This decoupling is powerful and a frequent source of confusion.

## Cartridges & Directory Structure
Structure your custom cartridge like:
```
app_custom_mybrand/
    cartridge/
        client/
            default/
                js/           # Feature modules (product, account, checkout, etc.)
                scss/         # Sass source
                images/       # Static imagery (if needed)
```
Guidelines:
- Never modify `app_storefront_base` directly.
- Mirror base file locations when extending (`js/product/detail.js`).
- Group by domain (`product/`, `checkout/`, `account/`) not by technical layer.
- Keep each module focused (cohesive public API via `module.exports`).

## Build Process & Cross-Cartridge Inheritance
Run build scripts (commonly via `sgmf-scripts`):
- `npm run compile:js`
- `npm run compile:scss`

Features:
- Transpiles, bundles, minifies.
- Resolves aliased `require('base/...')` imports through `paths` mapping.
- Produces deployable assets uploaded via UX Studio / CI pipeline.

Key distinction: **Changing the Business Manager cartridge path does not retroactively affect already compiled client bundles.** Recompile after structural changes.

## Asset Loading via `assets.js`
Asset registration flow:
1. In an ISML template: `assets.addJs('/js/product/detail.js')` or `assets.addCss('/css/product.css')`.
2. The singleton (`*/cartridge/scripts/assets.js`) accumulates assets **per request**.
3. Decorator templates (`common/layout/page.isml`) render loops in `htmlHead.isml` (CSS) and `scripts.isml` (JS).

Remote include caveat:
> Assets added inside a *remote include* live only in that secondary request and will **not** appear in the parent page. Register required assets in the main controller/template context.

## Client-Side Extension Pattern
Client-side extension is **composition via build-time aliases**, not runtime inheritance.

### Misconception: `module.superModule`
`module.superModule` exists only on the **server** (Rhino engine) for controllers / scripts. It does **not** exist in browser bundles. Using it client-side will throw (undefined reference).

### Extension Steps
#### 1. Configure `paths` alias in custom cartridge `package.json`
```jsonc
// my_custom_cartridge/package.json
{
    "name": "app_custom_mybrand",
    "scripts": {
        "compile:js": "sgmf-scripts --compile js",
        "compile:scss": "sgmf-scripts --compile css"
    },
    "paths": {
        "base": "../storefront-reference-architecture/cartridges/app_storefront_base/"
    }
}
```
#### 2. Require base module
```javascript
'use strict';
var base = require('base/product/detail');
```
#### 3. Decorate / override
Modify `base` object (add or replace functions). If you need original logic, copy/refactor it—there is no automatic super call.
#### 4. Re-export
```javascript
module.exports = base;
```

### Full PDP Extension Example
**Base (`app_storefront_base/.../product/detail.js`)**
```javascript
'use strict';
function updateAddToCartButton(update) {
    $('button.add-to-cart').attr('disabled', !update.readyToOrder || !update.available);
}
module.exports = { updateAddToCartButton: updateAddToCartButton };
```
**Custom (`app_custom_mybrand/.../product/detail.js`)**
```javascript
'use strict';
var base = require('base/product/detail');

function handleNotifyMe() {
    console.log('Notify Me button clicked!');
}

function updateNotifyMeButton(update) {
    if (!update.available && update.readyToOrder) {
        $('.notify-me').show();
    } else {
        $('.notify-me').hide();
    }
}

base.updateAddToCartButton = function (update) {
    $('button.add-to-cart').attr('disabled', !update.readyToOrder || !update.available);
    updateNotifyMeButton(update);
};

base.initializeNotifyMeEvent = function () {
    $('body').on('click', '.notify-me', handleNotifyMe);
};

module.exports = base;
```

## `require()` Path Syntax Reference
| Syntax       | Context                       | Purpose / Behavior                                                                 | Example |
|--------------|-------------------------------|--------------------------------------------------------------------------------------|---------|
| `./` / `../` | Client & Server               | Relative to current file.                                                          | `require('./utils')` |
| `~/`         | Server only (runtime)         | Current cartridge root in runtime path. Not for client build.                      | `require('~/cartridge/scripts/assets.js')` |
| `*/`         | Server only (runtime)         | Searches entire cartridge path (left→right).                                       | `require('*/cartridge/scripts/middleware/consentTracking')` |
| `[alias]/`   | Client only (build-time)      | Resolves via `package.json` `paths` mapping across cartridges.                     | `require('base/product/detail')` |

## AJAX Architecture & CSRF
Core components:
1. **Controller route** (`server.post('Route', ...)`) returns JSON via `res.json()`.
2. **Client module** uses `$.ajax()` (or `fetch`) with serialized form data.
3. **URL generation** via `URLUtils.url('Controller-Route')` passed through `data-*` attributes (avoid hardcoding).
4. **CSRF token** injected as hidden inputs; included automatically when using `form.serialize()`.
5. **Error handling**: differentiate transport errors vs. business validation (`success: false`).

Concurrency & Abort:
- Maintain reference to last in-flight xhr for a feature (e.g. typeahead) and abort before issuing a new one to avoid race conditions that render stale results.
- Use increasing request tokens (simple incrementing counter) to ignore late arrivals when abort is not possible (some libraries swallow abort errors).

Idempotency & Double-Click Safety:
- Disable triggering buttons until response or use a short-lived in-memory lock keyed by action (`add-to-wishlist:PID`).
- For destructive operations (remove, update) prefer server idempotent endpoints; client can re-send safely after timeout.

### Controller Example (`Newsletter.js`)
```javascript
'use strict';
var server = require('server');
var Resource = require('dw/web/Resource');

server.post('Subscribe', function (req, res, next) {
    var email = req.form.email;
    var success = !!email;
    var message = success
        ? Resource.msg('subscribe.success.message', 'newsletter', null)
        : Resource.msg('subscribe.error.invalidemail', 'newsletter', null);

    res.json({ success: success, message: message, submittedEmail: email });
    return next();
});

module.exports = server.exports();
```

## Newsletter End-to-End Example
### ISML (`newsletter.isml`)
```isml
<div class="newsletter-signup">
    <h2>${Resource.msg('heading.newsletter', 'newsletter', null)}</h2>
    <form id="newsletter-form"
                action="${URLUtils.url('Newsletter-Subscribe')}"
                method="POST"
                data-action-url="${URLUtils.url('Newsletter-Subscribe')}">
        <div class="form-group">
            <label for="newsletter-email">${Resource.msg('label.input.email', 'forms', null)}</label>
            <input type="email" id="newsletter-email" name="email" required>
            <div class="invalid-feedback"></div>
        </div>
        <input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.tokenValue}" />
        <button type="submit" class="btn btn-primary">${Resource.msg('button.subscribe', 'newsletter', null)}</button>
    </form>
    <div class="newsletter-message" role="alert"></div>
    <button type="button" class="notify-me" style="display:none">Notify Me</button>
</div>
```
### Client Module (`newsletter.js`)
```javascript
'use strict';
module.exports = function () {
    $('#newsletter-form').on('submit', function (e) {
        e.preventDefault();
        var $form = $(this);
        var url = $form.data('action-url');
        var $msg = $('.newsletter-message');
        var $email = $('#newsletter-email');
        $form.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: $form.serialize(),
            success: function (data) {
                $form.spinner().stop();
                $msg.removeClass('alert-danger').addClass('alert-success').text(data.message).show();
                $email.val('');
            },
            error: function (err) {
                $form.spinner().stop();
                var text = (err.responseJSON && err.responseJSON.message) || 'An unexpected error occurred.';
                $msg.removeClass('alert-success').addClass('alert-danger').text(text).show();
            }
        });
    });
};
```

## Form Framework & Validation Flow
**Server XML definitions** (under `forms/default/`) are the *single source of truth* for field rules.

Example snippet:
```xml
<form formid="newsletter">
    <field formid="email" type="string" mandatory="true" max-length="120" regexp="^[^@]+@[^@]+\.[^@]+$"
                 parse-error="error.parse.email" missing-error="error.missing.email" />
</form>
```
Client & server synergy:
1. Controller: `server.forms.getForm('newsletter')` loads + binds definition.
2. Template: injects metadata (often via `data-*`).
3. Browser: native HTML5 validation (type / required / maxlength).
4. `clientSideValidation.js`: intercepts invalid events, adds `is-invalid` styling.
5. `form-validation.js`: enforces XML-derived rules client-side.
6. AJAX submit → server re-validates.
7. Failure: JSON payload enumerates field errors; client maps & displays.

### Validation Flow Summary
```text
Load → User Input → HTML5 check → (If fail) prevent submit + style
→ If pass: AJAX submit → Server re-validate → Success OR Error JSON
→ On error: map messages → show per-field + global feedback
```

## jQuery / DOM Best Practices
### 1. Selector Caching
```javascript
// Inefficient
$('.product-price').text('$99.99');
$('.product-price').addClass('price-updated');

// Optimized
var $price = $('.product-price');
$price.text('$99.99');
$price.addClass('price-updated');
```
### 2. Event Delegation
```javascript
// Fragile (lost after DOM replacement)
$('.add-to-cart').on('click', handler);

// Robust
$('.product-grid-container').on('click', '.add-to-cart', handler);
```
### 3. Batch DOM Writes
```javascript
function renderProductList(products) {
    var html = products.map(p => `<li>${p.name}</li>`).join('');
    $('#product-list').html(html);
}
```
### 4. Avoid Layout Thrashing
Minimize interleaving reads (`.width()`) and writes (`.addClass()`). Group writes together.

## Performance Optimization
| Technique | Benefit | Notes |
|-----------|---------|-------|
| Debounce typing | Reduces AJAX bursts | Use 250–400ms window for search suggest |
| Single bundle (`main.js`) | Fewer requests | Let build handle splitting if needed |
| Late script injection | Faster first render | Scripts at end of `<body>` via decorator |
| Cache selectors | Lower DOM traversal cost | Prefix jQuery vars with `$` |
| Build HTML in memory | Min fewer reflows | Use string or detached fragment |

Example debounce (vanilla):
```javascript
function debounce(fn, wait) {
    var t; return function () {
        clearTimeout(t);
        var args = arguments, ctx = this;
        t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
}
$('#search-input').on('input', debounce(fetchSuggestions, 300));
```

## Accessibility (A11y)
Core practices:
- Use semantic elements (`<button>`, `<nav>`, headings hierarchy).
- Add `aria-live="polite"` to regions updated via AJAX.
- Manage focus on modal open/close.
- Maintain keyboard operability (Tab order, Enter/Escape, Arrow keys for composites).
- Reflect state with ARIA (`aria-expanded`, `aria-hidden`).

Example toggle pattern:
```javascript
$('.filter-toggle').on('click', function () {
    var $panel = $('#filter-panel');
    var expanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', !expanded);
    $panel.toggleClass('is-open', !expanded);
    if (!expanded) { $panel.find('input,button,a').first().focus(); }
});
```

## Code Quality & Maintainability
| Principle | Why It Matters | Practice |
|-----------|----------------|----------|
| Modularity | Easier testing & reuse | Split large PDP logic into domain modules |
| No inline JS | Separation of concerns | Use external modules + `assets.js` registration |
| Scoped exports | Avoid globals | Rely on CommonJS closure & `module.exports` |
| Consistent naming | Predictability | Domain-first folders (`product/`, `checkout/`) |
| Progressive enhancement | Resilience | Base HTML works w/out JS; JS augments |

## Quick Checklist
✅ Use `paths` alias for base extension, never edit `app_storefront_base` directly.
✅ Register assets in main request context, not remote includes.
✅ Compose client overrides—no `module.superModule`.
✅ Generate controller URLs server-side; pass via `data-*`.
✅ Always include CSRF token on POST (form or manual payload).
✅ Cache selectors & delegate events for dynamic regions.
✅ Batch DOM updates; avoid per-iteration `.append()` in loops.
✅ Debounce high-frequency input handlers.
✅ Enforce validation both client (UX) & server (authority).
✅ Provide keyboard & screen reader accessible interactions.
✅ Keep modules small, explicit exports, no inline script blocks.
✅ Namespace events (e.g. `.on('click.wishlistRemove', ...)`) & provide destroy() hooks.
✅ Escape dynamic data inserted into DOM; never trust server echo or user input.
✅ Centralize toast / modal / spinner helpers; avoid duplicate markup strings.
✅ Abort or ignore stale AJAX responses to prevent UI rewind.
✅ Include accessibility states (`aria-pressed`, `aria-live`, focus management) for dynamic UI.
✅ Provide test seams (export pure helpers separately from DOM glue).
✅ Use resource bundles for user-visible text; avoid hard-coded English in logic modules.
✅ Measure: instrument key actions (add/remove, search) with custom events.

## Plugin Cartridge Audit & Advanced Patterns (Wishlist Example)

This section analyzes real patterns from a widely used wishlist plugin cartridge (client-side layer) and extracts **concrete do / don't guidance** for AI agents generating new plugin cartridges. Treat this as a diagnostic checklist when reviewing or creating feature code.

### Observed Anti‑Patterns & Risks
| Category | Issue (Excerpt / Pattern) | Why It Matters | Recommended Fix |
|----------|---------------------------|----------------|-----------------|
| Message UI | Repeated ad‑hoc containers: `$('body').append('<div class="add-to-wishlist-messages"></div>')` then string concatenated alerts | Duplicated logic, memory churn, inconsistent roles, XSS risk via unescaped vars | Centralize via `toastService.show(type, message, {live:true})` injecting into a single managed region with ARIA attributes & auto‑dismiss |
| String HTML Construction | Concatenating user/content data into HTML (e.g. building search results list with `hit.firstName + ' ' + hit.lastName`) | Potential HTML injection if data not sanitized; readability suffers | Use small template helper that **escapes** (`escapeHtml`) and builds DOM with jQuery or template literals + encode |
| Oversized Module | `wishlist/wishlist.js` ~600 lines exporting a giant object | Hard to test, cognitive overload, hidden coupling | Split by concern: `modal.js`, `publicStatus.js`, `pagination.js`, `searchResults.js`, `toast.js`, `itemsCrud.js` then compose in page orchestrator |
| Global Delegation Scope | Universal `$('body').on('click', '.selector', ...)` for almost everything | Higher event dispatch cost; collision risk; harder to constrain removal | Delegate from closest stable container (`.wishlist-container`) unless events truly cross page |
| Lack of Namespaced Events | Triggers like `'afterRemoveFromCart'`, `'product:afterAddToCart'` used but custom bindings lack namespaces | Difficult selective unbinding, risk of collisions across cartridges | Use `$('...').on('click.wishlistRemove', ...)` and trigger namespaced custom events (`wishlist:remove:after`) |
| Spinners | Frequent `$.spinner().start()` without scoping to local container / ensuring stop in all branches | Flicker, race conditions if multiple concurrent requests | Use scoped spinner: `$container.spinner().start()`; wrap in `try/finally` or `always` callback |
| Modal Assembly | Manual string concatenation for full modal markup each time | Risk of drift vs. base styles, missing a11y attributes (`aria-modal`, labelledby) | Provide reusable `createModalShell(id, options)` helper; ensure focus trap, labelled elements |
| Clipboard | Direct `navigator.clipboard.writeText` without fallback | Fails silently on insecure origins / permissions | Add feature detect & fallback to temporary input select/copy |
| DOM Queries | Repeated uncached selectors inside loops (`$('.wishlistItemCards')`) | Performance waste for large lists | Cache at module scope or inside handler before loops |
| Icon Toggle | Direct class swap `.removeClass('fa-heart-o').addClass('fa-heart')` without state semantics | No accessibility state conveyed | Add `aria-pressed` or `aria-label` update; use utility `toggleWishlistState($el, isActive)` |
| Error Handling | Some AJAX error branches pass entire `err` object to display function expecting `{success,msg}` | Leads to `undefined` outputs; user confusion | Normalize responses: common `extractMessage(xhr)` utility |
| CSRF Token | POST requests rely on cookie; no explicit token injection | Fragile if custom middleware expects token param | Retrieve token from hidden input or `/CSRF-Generate` endpoint and include in payload (unless endpoint exempt) |
| Re-fetch Full Page | Pagination replaces entire list container then resets scroll manually | Jank, focus not managed | Use incremental append w/ sentinel or intersection observer; restore focus to consistent element |

### Improved Architectural Slice
Break the monolith – each concern returns an initializer consumed by the page entry script:
```
// wishlist/index.js (page orchestrator)
'use strict';
var initModal = require('./modal');
var initPublicStatus = require('./publicStatus');
var initItems = require('./items');
var initSearch = require('./search');
var toast = require('./toast');

module.exports = function () {
    toast.init();
    initModal();
    initPublicStatus();
    initItems();
    initSearch();
};
```

### Central Toast / Message Service Example
```
// wishlist/toast.js
'use strict';
var REGION_SELECTOR = '#global-toast-region';

function ensureRegion() {
    if (!$(REGION_SELECTOR).length) {
        $('body').append('<div id="global-toast-region" class="toast-region" aria-live="polite" aria-atomic="true"></div>');
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function show(type, message, opts) {
    ensureRegion();
    var safe = escapeHtml(message);
    var $r = $(REGION_SELECTOR);
    var $toast = $('<div class="alert alert-' + (type || 'info') + '" role="alert"></div>').html(safe);
    $r.append($toast);
    setTimeout(function () { $toast.fadeOut(150, function () { $(this).remove(); }); }, (opts && opts.duration) || 3000);
}

module.exports = { init: ensureRegion, show: show };
```

Usage replacing multiple scattered blocks:
```
var toast = require('./toast');
toast.show(data.success ? 'success' : 'danger', data.msg);
```

### Namespaced Event & Scoped Delegation
```
// Instead of $('body').on('click', '.remove-from-wishlist', handler)
$('.wishlist-container').on('click.wishlistRemove', '.remove-from-wishlist', handler);
```
Add cleanup when unloading dynamic section:
```
function destroy() { $('.wishlist-container').off('.wishlistRemove'); }
```

### AJAX Utility Wrapper
```
// utils/ajax.js
module.exports = function request(opts) {
    var d = $.Deferred();
    $.ajax(opts).done(d.resolve).fail(function (xhr) {
        var msg = (xhr.responseJSON && (xhr.responseJSON.msg || xhr.responseJSON.message)) || 'Unexpected error';
        d.reject({ success: false, msg: msg });
    });
    return d.promise();
};
```

### Safer Dynamic List Rendering
```
function renderHits(hits) {
    var html = hits.map(function (h) {
        var name = escapeHtml(h.firstName + ' ' + h.lastName);
        var urlText = escapeHtml(h.urlText);
        return '<div class="row wl-hit">' +
            '<div class="text-left col-6">' + name + '</div>' +
            '<div class="text-right col-6">' +
            '<a href="' + h.url + '" title="' + escapeHtml(h.urlTitle) + '" data-id="' + h.id + '">' + urlText + '</a>' +
            '</div></div>';
    }).join('');
    $('.wl-hits').html(html);
}
```

### Accessibility Enhancements
| Pattern | Upgrade |
|---------|---------|
| Heart toggle icon changes class only | Add `aria-pressed` state + label update |
| Toasts missing live region | Use single `aria-live="polite"` container | 
| Modal close sets focus implicitly | Explicitly return focus to invoking control (store a reference before open) |
| Copy link success only visual | Also append visually-hidden status text for screen readers |

### Performance & Maintainability Payoffs
| Refactor | Benefit |
|----------|---------|
| Split mega file into 6 modules | Lower merge conflict risk; targeted test surfaces |
| Central toast service | One place to adjust styling, timing, a11y |
| Namespaced events | Predictable teardown preventing memory leaks |
| Escaping utility | Mitigates XSS across all dynamic insertions |
| AJAX wrapper | Consistent error contract for UI handlers |

### Rapid Review Heuristics for Generated Code
Before finalizing a new client feature, ask:
1. Does any module exceed ~200 LOC? If yes, split.
2. Are all dynamic string insertions encoded? (Search for `+` around user data.)
3. Do events have namespaces for teardown? (Regex search: `\.on\('[^']+\.`)
4. Are repeated UX patterns (toast, modal, spinner) abstracted?
5. Are POSTs including CSRF token (if required) & handling both transport + business errors distinctly?
6. Is there at least one accessibility enhancement beyond defaults (live region, focus management, ARIA state)?

Integrate these improvements when generating or refactoring plugin cartridges to keep the ecosystem consistent, secure, and maintainable.

## Event & Module Design Patterns
Design modules with a predictable lifecycle so AI-generated code composes cleanly.

Pattern:
```
// product/favorites.js
'use strict';
var selectors = { container: '.favorites-container' };
function bindEvents($root) {
        $root.on('click.favoritesAdd', '.favorite-add', onAdd);
}
function unbindEvents($root) { $root.off('.favoritesAdd'); }
function onAdd(e) { /* feature logic */ }
module.exports = {
        init: function () { bindEvents($(selectors.container)); },
        destroy: function () { unbindEvents($(selectors.container)); }
};
```

Guidelines:
- Namespace every delegated event (`.featureNameAction`).
- Export `init()` + optional `destroy()`; page orchestrator calls these.
- Keep pure logic (parsing, transforms) in separate files for unit tests.
- Avoid circular requires: one orchestrator imports leaf modules; leaves only export functions.

## Security & Data Protection
Client code must not introduce XSS or data leakage.

Threat Vectors & Mitigations:
| Vector | Example | Mitigation |
|--------|---------|-----------|
| DOM XSS via concatenation | `'<div>'+ userName +'</div>'` | `escapeHtml(userName)` or build text nodes (`$('<div>').text(userName)`) |
| Injection via attributes | `'<a title="'+ title +'">'` | Escape quotes + `<` or use jQuery attr: `$('<a>').attr('title', title)` |
| Untrusted server message | Displaying raw `data.msg` | Whitelist keys or sanitize before insertion |
| Sensitive data in HTML | Embedding tokens in `data-*` | Store CSRF only in hidden input / meta; keep access tokens server-side |
| Over-broad event listeners | Listening on `body` for key events | Scope selectors to limit accidental data capture |

Escaping Utility:
```
function escapeHtml(str) {
    return String(str).replace(/[&<>"]g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}
```

Never trust: query params, form input values, server-returned text fields that originated from users (wish list names, product reviews). Always escape at insertion.

## Advanced AJAX & Error Handling
Standardize request lifecycle.
```
function requestJSON(opts) {
    var d = $.Deferred();
    var xhr = $.ajax(opts);
    xhr.done(function (data) { d.resolve(normalize(data)); })
         .fail(function (xhr) { d.reject(normalizeError(xhr)); });
    d.abort = function(){ if (xhr && xhr.readyState !== 4) { xhr.abort(); } };
    return d;
}
```
`normalize()` ensures a consistent shape: `{success:Boolean, payload:Object, msg:String}`.

Retry Decision Matrix:
| Failure | Retry? | Strategy |
|---------|--------|----------|
| Network timeout | Yes (1-2x) | Exponential backoff (300ms, 900ms) |
| 5xx server error | Optional | Single retry; log event for monitoring |
| 4xx validation | No | Surface messages; focus first invalid field |
| 403 CSRF | Yes (once) | Refresh token then replay |

User Feedback Levels:
- Inline field error
- Toast / alert region
- Silent (background prefetch) – only log to telemetry

## Testing Strategy for Client Modules
Testing ensures generated code stays reliable during SFRA upgrades.

Layers:
1. Pure utilities: Jest unit tests (no DOM) – e.g. escaping, debounce.
2. DOM behavior: jsdom + jQuery – simulate click, assert ARIA changes.
3. Contract tests for overrides: ensure extended module still exports required API surface (e.g. base + new functions).
4. Accessibility smoke: simple test that dynamically added toast region has `role="alert"` and is keyboard reachable.

Fixture Strategy:
- Keep minimal HTML snippets under `tests/fixtures/client/` loaded per suite.
- Avoid depending on full SFRA markup to reduce brittleness.

## Instrumentation & Telemetry
Emit analytics-friendly custom events; helps correlate client actions with server logs:
```
function emit(name, detail) {
    window.dispatchEvent(new CustomEvent('sfra:' + name, { detail: detail }));
}
emit('wishlist:add', { pid: pid, ts: Date.now() });
```
Collect events via a small listener pushing into `dataLayer` if present.

Key Metrics:
- Time to first interactive action (menu open, first search request).
- AJAX error rate per endpoint.
- Average debounce delay real vs configured (for tuning).

## Internationalization (i18n)
Rules:
- Never concatenate partial Resource strings (avoid building sentences piecewise).
- Pass dynamic values through `Resource.msgf` server-side where possible; if client must construct, keep placeholders (`{name}`) and a simple replace.
- Avoid embedding language-dependent punctuation in code (e.g. `':'` after labels); include it in localized string.
- For aria labels, re-use same bundle keys or provide parallel ones (e.g. `wishlist.add.success.aria`).

Example Placeholder Replacement:
```
var template = $('#welcome-banner').data('welcome-template'); // "Welcome back, {firstName}!"
$('#welcome-banner .text').text(template.replace('{firstName}', firstName));
```

Lint Heuristic: flag hard-coded English by searching for regex `"[A-Za-z]{3,}\s` outside tests.

## Appendix A: Base Cartridge Client-Side Modules Index

The following index was generated from the SFRA base cartridge (`app_storefront_base/cartridge/client/default/js`). It lists **override / extension candidates** you can decorate in custom cartridges using the `paths` alias (e.g. `require('base/product/detail')`). Total discovered JavaScript modules: **56**.

### Full File Listing (Relative Paths)
```
addressBook.js
addressBook/addressBook.js
campaignBanner.js
carousel.js
cart.js
cart/cart.js
checkout.js
checkout/address.js
checkout/billing.js
checkout/checkout.js
checkout/customer.js
checkout/formErrors.js
checkout/shipping.js
checkout/summary.js
checkoutRegistration.js
components/cleave.js
components/clientSideValidation.js
components/collapsibleItem.js
components/consentTracking.js
components/cookie.js
components/countrySelector.js
components/errorNotification.js
components/focus.js
components/footer.js
components/formValidation.js
components/keyboardAccessibility.js
components/menu.js
components/miniCart.js
components/scrollAnimate.js
components/search.js
components/spinner.js
components/toolTip.js
contactUs.js
contactUs/contactUs.js
einsteinCarousel.js
login.js
login/login.js
main.js
mobileGridLookBook.js
orderHistory.js
orderHistory/orderHistory.js
paymentInstruments.js
paymentInstruments/paymentInstruments.js
product/base.js
product/detail.js
product/quickView.js
productDetail.js
productTile.js
profile.js
profile/profile.js
search.js
search/search.js
storeLocator.js
storeLocator/storeLocator.js
thirdParty/bootstrap.js
util.js
```

### Extension Guidance
| Type | Recommended Strategy | Example |
|------|----------------------|---------|
| UI component (`components/*`) | Add feature then re-export base object | `var base = require('base/components/menu'); base.open = customOpen; module.exports = base;` |
| Page orchestrator (e.g. `product/detail.js`) | Override specific functions; add init hooks | Override `updateAddToCartButton` & append new DOM behaviors |
| Form logic (`checkout/*.js`) | Split complex logic into helper modules first (in base or custom) | Extract validation helper to call from override |
| Accessibility (`components/keyboardAccessibility.js`) | Patch by progressive enhancement; keep semantics intact | Add new key handlers before export |
| Bootstrap / vendor (`thirdParty/bootstrap.js`) | Avoid direct override; extend via event hooks | Wrap after requiring for plugin init |

### When NOT to Override
- If a base module only needs minor event binding, prefer **decorating after require** instead of rewriting the file path.
- Avoid duplicating large functions just to change a selector—refactor into a helper inside custom cartridge and call original logic you copied responsibly.
- Do not modify vendored third-party code directly—wrap or extend.

### Quick Start Template for an Override
```javascript
'use strict';
var base = require('base/components/menu');

// Preserve reference if you need original
var originalToggle = base.toggle;

base.toggle = function () {
    originalToggle.apply(this, arguments);
    // Custom enhancement
    window.dispatchEvent(new CustomEvent('menu:toggled'));
};

module.exports = base;
```

---
Need deeper server-side extension patterns? See the **sfcc-sfra-controllers** and **sfcc-sfra-models** skills for parallel server strategies.
