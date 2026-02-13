# SFRA Template Structure & Shared Components

This reference focuses on where things live and how SFRA composes templates.

## Typical Structure

```text
templates/default/
  common/
    layout/              # page, checkout, pdStorePage layouts
    htmlHead.isml        # shared <head> content
    scripts.isml         # shared script includes
  components/
    header/
    footer/
    breadcrumbs/
    modules.isml         # module registration (if your project uses it)
    schema.isml          # structured data
  home/
  product/
  cart/
  checkout/
  account/
  search/
  error/
```

## Composition Rules (SFRA)

- Prefer small, reusable partials under `components/**`.
- Use local includes for most composition:

```html
<isinclude template="components/breadcrumbs/pageBreadcrumbs"/>
<isinclude template="product/productTile"/>
```

- Use remote includes only when you need an independent cache boundary or isolation (see `REMOTE-INCLUDES.md`).

## `common/htmlHead.isml` (What it typically does)

Common responsibilities:

- `<title>` and environment-aware titles
- meta tags (description/keywords)
- canonical link when provided
- favicon set and shared head assets

Keep meta values encoded and sourced from controller-provided `pdict`.

## Asset Registration (`assets.js`)

Page templates may register page-specific assets:

```html
<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/search.css');
    assets.addJs('/js/search.js');
</isscript>
```

Do not use `<isscript>` for business logic.
