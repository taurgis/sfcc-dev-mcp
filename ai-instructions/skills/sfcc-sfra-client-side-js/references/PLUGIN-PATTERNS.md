# Plugin Cartridge Patterns & Anti-Patterns

Analysis of real patterns from plugin cartridges with concrete guidance for creating maintainable, secure, and accessible client-side code.

## Observed Anti-Patterns & Risks

| Category | Issue | Why It Matters | Recommended Fix |
|----------|-------|----------------|-----------------|
| Message UI | Repeated ad-hoc containers: `$('body').append('<div class="messages"></div>')` | Duplicated logic, memory churn, inconsistent roles, XSS risk | Centralize via `toastService.show(type, message)` with single managed region |
| String HTML | Concatenating user data into HTML | XSS vulnerability if data not sanitized | Use `escapeHtml()` or build DOM with jQuery `.text()` |
| Oversized Module | Single file ~600 lines exporting giant object | Hard to test, cognitive overload, hidden coupling | Split by concern into focused modules |
| Global Delegation | Universal `$('body').on('click', '.selector', ...)` | Higher event dispatch cost; collision risk | Delegate from closest stable container |
| No Event Namespaces | Triggers without namespaces | Difficult selective unbinding, collision risk | Use `$('...').on('click.wishlistRemove', ...)` |
| Unscoped Spinners | `$.spinner().start()` without container scoping | Flicker, race conditions | Use `$container.spinner().start()` with `try/finally` |
| Manual Modal Assembly | String concatenation for full modal markup | Drift vs. base styles, missing a11y attributes | Provide reusable `createModalShell()` helper |
| Clipboard | Direct `navigator.clipboard.writeText` | Fails silently on insecure origins | Add feature detect & fallback |
| Uncached Selectors | Repeated `$('.class')` inside loops | Performance waste | Cache at module scope before loops |
| Icon Toggle | Direct class swap without state semantics | No accessibility state conveyed | Add `aria-pressed` or `aria-label` update |
| Error Handling | Passing entire `err` object expecting `{success,msg}` | `undefined` outputs; user confusion | Normalize with `extractMessage(xhr)` utility |

## Improved Architecture

Break monolithic modules by concern:

```javascript
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

## Central Toast Service

```javascript
// utils/toast.js
'use strict';
var REGION_SELECTOR = '#global-toast-region';

function ensureRegion() {
    if (!$(REGION_SELECTOR).length) {
        $('body').append(
            '<div id="global-toast-region" class="toast-region" ' +
            'aria-live="polite" aria-atomic="true"></div>'
        );
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
    var $toast = $('<div class="alert alert-' + (type || 'info') + '" role="alert"></div>')
        .html(safe);
    $r.append($toast);
    
    setTimeout(function () { 
        $toast.fadeOut(150, function () { $(this).remove(); }); 
    }, (opts && opts.duration) || 3000);
}

module.exports = { init: ensureRegion, show: show };
```

Usage:
```javascript
var toast = require('./toast');
toast.show(data.success ? 'success' : 'danger', data.msg);
```

## Namespaced Events & Scoped Delegation

```javascript
// Instead of $('body').on('click', '.remove-item', handler)
$('.wishlist-container').on('click.wishlistRemove', '.remove-item', handler);

// Add cleanup
function destroy() { 
    $('.wishlist-container').off('.wishlistRemove'); 
}
```

## AJAX Utility Wrapper

```javascript
// utils/ajax.js
module.exports = function request(opts) {
    var d = $.Deferred();
    
    $.ajax(opts)
        .done(d.resolve)
        .fail(function (xhr) {
            var msg = (xhr.responseJSON && (xhr.responseJSON.msg || xhr.responseJSON.message)) 
                      || 'Unexpected error';
            d.reject({ success: false, msg: msg });
        });
    
    return d.promise();
};
```

## Safer Dynamic List Rendering

```javascript
function renderHits(hits) {
    var html = hits.map(function (h) {
        var name = escapeHtml(h.firstName + ' ' + h.lastName);
        var urlText = escapeHtml(h.urlText);
        
        return '<div class="row hit">' +
            '<div class="col-6">' + name + '</div>' +
            '<div class="col-6">' +
            '<a href="' + h.url + '" ' +
            'title="' + escapeHtml(h.urlTitle) + '" ' +
            'data-id="' + h.id + '">' + urlText + '</a>' +
            '</div></div>';
    }).join('');
    
    $('.hits-container').html(html);
}
```

## Accessibility Enhancements

| Pattern | Upgrade |
|---------|---------|
| Heart toggle icon changes class only | Add `aria-pressed` state + label update |
| Toasts missing live region | Use single `aria-live="polite"` container |
| Modal close sets focus implicitly | Explicitly return focus to invoking control |
| Copy link success only visual | Append visually-hidden status text for screen readers |

## Performance & Maintainability Payoffs

| Refactor | Benefit |
|----------|---------|
| Split mega file into 6 modules | Lower merge conflict risk; targeted test surfaces |
| Central toast service | One place for styling, timing, a11y |
| Namespaced events | Predictable teardown preventing memory leaks |
| Escaping utility | Mitigates XSS across all dynamic insertions |
| AJAX wrapper | Consistent error contract for UI handlers |

## Code Review Checklist

Before finalizing a new client feature:

1. Does any module exceed ~200 LOC? If yes, split
2. Are all dynamic string insertions encoded? (Search for `+` around user data)
3. Do events have namespaces for teardown? (Search: `.on('[^']+\.`)
4. Are repeated UX patterns (toast, modal, spinner) abstracted?
5. Are POSTs including CSRF token & handling both transport + business errors?
6. Is there at least one accessibility enhancement (live region, focus management, ARIA state)?

## Escaping Utility

```javascript
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
```

Always use when inserting: query params, form input values, server-returned text fields that originated from users.
