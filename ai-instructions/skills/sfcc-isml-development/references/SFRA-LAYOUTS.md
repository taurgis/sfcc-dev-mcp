# SFRA Layout Templates (Decorators)

SFRA storefront pages typically render content via:

```html
<isdecorate template="common/layout/page">
    <!-- page content -->
</isdecorate>
```

Keep full `<html>/<head>/<body>` markup in layout templates only.

## Core Layouts

SFRA commonly uses these base layout templates:

- `common/layout/page.isml` — primary layout for most storefront pages
- `common/layout/checkout.isml` — checkout layout (reduced header/navigation)
- `common/layout/pdStorePage.isml` — Page Designer store pages (campaign banner support)

These layouts typically:

- Include shared head markup via `common/htmlHead`
- Register shared scripts via `common/scripts`
- Include header/footer components
- Provide a single `<isreplace/>` insertion point inside `<main>`
- Call template hooks:
  - `dw.system.HookMgr.callHook('app.template.beforeHeader', 'beforeHeader', pdict)`
  - `dw.system.HookMgr.callHook('app.template.afterFooter', 'afterFooter', pdict)`

## `<isreplace/>` Rules

- Layout templates contain `<isreplace/>`.
- Decorated templates contain markup that will be injected at `<isreplace/>`.
- Prefer **one** `<isreplace/>` per layout.

## Bootstrap 4 Notes

SFRA baseline markup uses **Bootstrap 4**:

- Grid: `container` → `row` → `col-*`
- Forms: `form-group`, `form-control`, `is-invalid`, `invalid-feedback`
- Alerts: `alert alert-*`
- Utilities: `d-none d-md-block`, spacing utilities `mt-*` etc.

Avoid Bootstrap 5-only classes unless your project has explicitly upgraded.

## Caching Reminder

Prefer controller-based caching middleware for page caching; use `<iscache>` selectively for fragments.
