# SFRA Page Patterns (Catalog/Search)

These are common SFRA patterns for pages that list or describe products/categories.

## Homepage

Typical traits:

- Decorated with `common/layout/page`
- Uses content slots (`<isslot>`) for BM-driven content
- Uses Bootstrap grid containers for layout

Example skeleton:

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets.js');
        assets.addCss('/css/homePage.css');
        assets.addJs('/js/productTile.js');
    </isscript>

    <div class="home-main homepage">
        <isslot id="home-main-m" description="Main home page slot." context="global" />
    </div>
</isdecorate>
```

## Product Detail Page (PDP)

Typical traits:

- Decorated with `common/layout/page`
- Creates a page-scoped `product` convenience variable
- Uses responsive patterns (`d-md-none`, etc.)

Example skeleton:

```html
<isdecorate template="common/layout/page">
    <isscript>
        var assets = require('*/cartridge/scripts/assets.js');
        assets.addCss('/css/product/detail.css');
        assets.addJs('/js/productDetail.js');
    </isscript>

    <isset name="product" value="${pdict.product}" scope="page" />

    <div class="container product-detail" data-pid="${product.id}">
        <div class="row">
            <div class="col-12">
                <h1 class="product-name">${product.productName}</h1>
                <isinclude template="product/components/pricing/main"/>
            </div>
        </div>
    </div>
</isdecorate>
```

## Search Results

Typical traits:

- Decorated with `common/layout/page`
- `refinement-bar` sidebar + grid content area
- Product tiles rendered via local include(s)

Key include components you’ll typically see:

- `search/refinements`
- `search/searchResultsCount`
- `search/sortOrderMenu`
- `search/searchResultsPagination`
- `product/productTile`

## Category Landing

Typical traits:

- Decorated with `common/layout/page`
- Breadcrumbs via `components/breadcrumbs/pageBreadcrumbs`
- Optional custom template selection via `pdict.category.template`
- Content slots for BM-managed category content

If you need a “hero image” style, prefer safe attribute construction and encoded values. Avoid mixing ISML tags into the middle of an HTML tag in a way that produces invalid markup.
