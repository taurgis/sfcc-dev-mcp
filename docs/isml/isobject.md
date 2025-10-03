# ISML isobject Element

## Overview

The `<isobject>` element collects active data about product impressions and views for analytics and merchandising purposes. It tracks when products are viewed in search results, product detail pages, recommendations, and other contexts, providing data for both active merchandising and the Storefront Toolkit.

**Key Purpose:** Enable data collection for product analytics, impression tracking, and merchandising optimization.

## Syntax

```isml
<isobject
  object = Product  // required - dw.catalog.Product or ProductSearchModel
  view   = "none" | "searchhit" | "recommendation" | "setproduct" | "detail"  // required
>
  <!-- HTML components representing the product -->
  ...
</isobject>
```

## Required Attributes

### object

**Type:** Expression  
**Required:** Yes  
**Allowed Types:** `dw.catalog.Product`, `dw.catalog.ProductHit`, `dw.catalog.ProductSearchModel`

Specifies the product object to track. The type of object depends on the context and `view` attribute value.

**Important:** When `view="searchhit"`, the object should be of type `ProductHit`.

**Examples:**
```isml
<!-- Product object from pdict -->
<isobject object="${pdict.Product}" view="detail">
  <!-- Product detail content -->
</isobject>

<!-- ProductHit in search results loop -->
<isloop items="${pdict.productSearch.productSearchHits}" var="productHit">
  <isobject object="${productHit}" view="searchhit">
    <!-- Product tile content -->
  </isobject>
</isloop>

<!-- ProductSearchModel for search page without hits -->
<isobject object="${pdict.ProductSearchModel}" view="none">
  <!-- Empty search results page -->
</isobject>

<!-- Recommendation product -->
<isobject object="${recommendedProduct}" view="recommendation">
  <!-- Recommended product display -->
</isobject>
```

### view

**Type:** String  
**Required:** Yes  
**Allowed Values:** `"none"`, `"searchhit"`, `"recommendation"`, `"setproduct"`, `"detail"`

Specifies the type of product view/impression to track and how the data should be collected.

#### "none"

**Purpose:** Collects search information for Storefront Toolkit but **does not count** as a product hit for active merchandising.

**Use Cases:**
- Templates where no search hits are found (empty search results)
- Collecting Storefront Toolkit data without merchandising tracking
- Search pages without product results

**Object Type:** `dw.catalog.ProductSearchModel`

**Data Collection:**
- ✅ Storefront Toolkit Search Information Tool
- ❌ Product impressions (not counted)
- ❌ Active merchandising

```isml
<!-- Empty search results page -->
<isobject object="${pdict.ProductSearchModel}" view="none">
  <div class="no-results">
    <h2>No products found</h2>
    <p>Try adjusting your search or filters.</p>
  </div>
</isobject>
```

#### "searchhit"

**Purpose:** Collects **one product impression** for each page view and search information for Storefront Toolkit.

**Use Cases:**
- Product tiles in search results
- Category page product listings
- Product search results

**Object Type:** `dw.catalog.ProductHit` (preferred)

**Data Collection:**
- ✅ Product impressions (counted)
- ✅ Storefront Toolkit Search Information Tool
- ✅ Active merchandising data

```isml
<!-- Search results loop -->
<isloop items="${pdict.productSearch.productSearchHits}" var="productHit">
  <isobject object="${productHit}" view="searchhit">
    <div class="product-tile">
      <img src="${productHit.product.getImage('medium').URL}" alt="${productHit.product.name}"/>
      <h3>${productHit.product.name}</h3>
      <span class="price">${productHit.product.price}</span>
    </div>
  </isobject>
</isloop>
```

#### "recommendation"

**Purpose:** Collects **one product impression** for each page view.

**Use Cases:**
- Recommended products (Einstein recommendations)
- "You May Also Like" sections
- "Customers Also Bought" displays
- Cross-sell recommendations

**Object Type:** `dw.catalog.Product`

**Data Collection:**
- ✅ Product impressions (counted)
- ❌ Storefront Toolkit Search Information Tool
- ✅ Active merchandising data

```isml
<!-- Recommendation carousel -->
<div class="recommendations">
  <h3>You May Also Like</h3>
  <isloop items="${pdict.recommendations}" var="product">
    <isobject object="${product}" view="recommendation">
      <div class="recommended-product">
        <img src="${product.getImage('small').URL}" alt="${product.name}"/>
        <h4>${product.name}</h4>
      </div>
    </isobject>
  </isloop>
</div>
```

#### "setproduct"

**Purpose:** Collects **one product impression** for each page view.

**Use Cases:**
- Bonus products in promotions
- Product set components
- Bundle product items
- Add-on products

**Object Type:** `dw.catalog.Product`

**Data Collection:**
- ✅ Product impressions (counted)
- ❌ Storefront Toolkit Search Information Tool
- ✅ Active merchandising data

**Important:** If the same product appears as both `searchhit` and `setproduct` on the same page, only **one impression** is counted (they both count as product impressions).

```isml
<!-- Bonus product display -->
<isobject object="${pdict.Product}" view="setproduct">
  <isinclude template="product/components/subproduct"/>
</isobject>

<!-- Product set items -->
<isloop items="${pdict.ProductSet.products}" var="setProduct">
  <isobject object="${setProduct}" view="setproduct">
    <div class="set-product">
      <h4>${setProduct.name}</h4>
      <span>${setProduct.price}</span>
    </div>
  </isobject>
</isloop>
```

#### "detail"

**Purpose:** Collects **one product view** for each page view.

**Use Cases:**
- Product detail pages (PDP)
- Quick view modals
- Product detail overlays

**Object Type:** `dw.catalog.Product`

**Data Collection:**
- ✅ Product views (counted)
- ❌ Storefront Toolkit Search Information Tool
- ✅ Active merchandising data

```isml
<!-- Product detail page -->
<isobject object="${pdict.Product}" view="detail">
  <div class="product-detail">
    <div class="product-images">
      <isloop items="${pdict.Product.images.large}" var="image">
        <img src="${image.url}" alt="${pdict.Product.name}"/>
      </isloop>
    </div>
    
    <div class="product-info">
      <h1>${pdict.Product.name}</h1>
      <p class="description">${pdict.Product.longDescription}</p>
      <div class="price">${pdict.Product.price}</div>
      
      <isinclude template="product/components/addToCart"/>
    </div>
  </div>
</isobject>
```

## View Type Summary Table

| View Type | Product Impressions | Product Views | Storefront Toolkit | Use Case |
|-----------|--------------------|--------------|--------------------|----------|
| `"none"` | ❌ No | ❌ No | ✅ Yes | Empty search results |
| `"searchhit"` | ✅ Yes | ❌ No | ✅ Yes | Search results, category pages |
| `"recommendation"` | ✅ Yes | ❌ No | ❌ No | Recommended products |
| `"setproduct"` | ✅ Yes | ❌ No | ❌ No | Bonus products, product sets |
| `"detail"` | ❌ No | ✅ Yes | ❌ No | Product detail pages |

## Purpose and Data Collection

The `<isobject>` element serves to:

1. **Active Merchandising:** Collect data for merchandising optimization and Einstein features
2. **Analytics Tracking:** Track product impressions and views for reporting
3. **Storefront Toolkit:** Provide search information for debugging and development
4. **Impression Counting:** Count how many times products are displayed to customers
5. **View Tracking:** Track when customers view product detail pages

**For Implementation Details:** See Salesforce B2C Commerce documentation: "Tagging Pages for Data Collection"

## Placement Rules

### Wrapping Product Components

The `<isobject>` tag **must wrap** the ISML/HTML components that represent the product:

**What to Wrap:**
- Product name
- Product image
- Product price
- Product swatches
- Product callouts
- Product ratings
- Other product components

```isml
<!-- Good: Wraps all product components -->
<isobject object="${product}" view="searchhit">
  <div class="product-tile">
    <img src="${product.getImage('medium').URL}"/>
    <h3>${product.name}</h3>
    <span class="price">${product.price}</span>
    <div class="rating">${product.rating}</div>
  </div>
</isobject>

<!-- Bad: Only wraps part of product display -->
<div class="product-tile">
  <img src="${product.getImage('medium').URL}"/>
  <isobject object="${product}" view="searchhit">
    <h3>${product.name}</h3>
  </isobject>
  <span class="price">${product.price}</span>
</div>
```

### Valid Script Location

The tag must be placed where **`<script>` tags are valid** (typically within the `<body>` or valid HTML containers).

```isml
<!-- Good: Inside body -->
<body>
  <isobject object="${product}" view="detail">
    <div class="product-detail">...</div>
  </isobject>
</body>

<!-- Bad: In head (not a valid script location for this purpose) -->
<head>
  <isobject object="${product}" view="detail">  <!-- Avoid -->
    ...
  </isobject>
</head>
```

### Multiple Tags Per Page

**Unlimited:** This tag can appear **any number of times** in the same page.

```isml
<!-- Multiple products on same page (search results) -->
<isloop items="${pdict.productSearchHits}" var="productHit">
  <isobject object="${productHit}" view="searchhit">
    <div class="product-tile">...</div>
  </isobject>
</isloop>

<!-- Recommendations on same page -->
<isloop items="${pdict.recommendations}" var="product">
  <isobject object="${product}" view="recommendation">
    <div class="recommended">...</div>
  </isobject>
</isloop>
```

## Duplicate Product Handling

### Same View Type

If the **same product** appears in **multiple tags** with the **same view attribute value**, only **one is counted**.

```isml
<!-- Product appears twice with view="searchhit" - only counted once -->
<isobject object="${product}" view="searchhit">
  <div class="product-tile-1">...</div>
</isobject>

<isobject object="${product}" view="searchhit">
  <div class="product-tile-2">...</div>
</isobject>

<!-- Result: Only 1 searchhit impression counted -->
```

### Different View Types

The same product **can be counted** for different view types on the same page.

```isml
<!-- Product as searchhit -->
<isobject object="${product}" view="searchhit">
  <div class="search-result">...</div>
</isobject>

<!-- Same product as recommendation -->
<isobject object="${product}" view="recommendation">
  <div class="recommended">...</div>
</isobject>

<!-- Result: Counted as both searchhit AND recommendation -->
```

### Impression Overlap

Both `searchhit` and `setproduct` count as **product impressions**. If the same product appears as both on the same page, only **one impression** is counted.

```isml
<!-- Product as searchhit -->
<isobject object="${product}" view="searchhit">
  <div class="search-tile">...</div>
</isobject>

<!-- Same product as setproduct -->
<isobject object="${product}" view="setproduct">
  <div class="bonus-product">...</div>
</isobject>

<!-- Result: Only 1 product impression counted (not 2) -->
```

## When NOT to Use isobject

### Shopping Cart

**Don't wrap** products in the shopping cart—this is not merchandising:

```isml
<!-- Bad: Don't use in cart -->
<isloop items="${pdict.Basket.productLineItems}" var="lineItem">
  <!-- DO NOT WRAP CART ITEMS -->
  <div class="cart-item">
    ${lineItem.productName}
  </div>
</isloop>

<!-- Good: Cart items without isobject -->
<isloop items="${pdict.Basket.productLineItems}" var="lineItem">
  <div class="cart-item">
    ${lineItem.productName}
  </div>
</isloop>
```

### Order History

**Don't wrap** products in order history or order confirmation:

```isml
<!-- Don't use in order history -->
<isloop items="${order.productLineItems}" var="lineItem">
  <div class="order-item">
    ${lineItem.productName}
  </div>
</isloop>
```

### Wishlist Display

**Don't wrap** products in wishlist views (customer is not being merchandised to):

```isml
<!-- Don't use in wishlist -->
<isloop items="${pdict.wishlistItems}" var="item">
  <div class="wishlist-item">
    ${item.product.name}
  </div>
</isloop>
```

### General Rule

Only use `<isobject>` when the template contains a **representation of a product with the intent to merchandise that product for sale**.

**Ask yourself:** "Is this page trying to sell this product to the customer?"
- **Yes** → Use `<isobject>`
- **No** → Don't use `<isobject>`

## Common Use Cases

### Search Results Page

```isml
<!-- Search results with product tiles -->
<div class="search-results">
  <isloop items="${pdict.productSearch.productSearchHits}" var="productHit">
    <isobject object="${productHit}" view="searchhit">
      <div class="product-tile">
        <a href="${URLUtils.url('Product-Show', 'pid', productHit.product.ID)}">
          <img src="${productHit.product.getImage('medium').URL}" alt="${productHit.product.name}"/>
          <h3 class="product-name">${productHit.product.name}</h3>
          <span class="price">${productHit.product.price}</span>
        </a>
      </div>
    </isobject>
  </isloop>
</div>
```

### Category Landing Page

```isml
<!-- Category page with product grid -->
<div class="category-products">
  <isloop items="${pdict.productSearchHits}" var="productHit">
    <isobject object="${productHit}" view="searchhit">
      <div class="product-grid-item">
        <isinclude template="product/productTile"/>
      </div>
    </isobject>
  </isloop>
</div>
```

### Product Detail Page

```isml
<!-- Product detail page (PDP) -->
<isobject object="${pdict.Product}" view="detail">
  <div class="product-detail-container">
    <div class="product-images">
      <isinclude template="product/components/imageGallery"/>
    </div>
    
    <div class="product-information">
      <h1 class="product-name">${pdict.Product.name}</h1>
      <div class="product-price">${pdict.Product.price}</div>
      <div class="product-description">${pdict.Product.longDescription}</div>
      
      <isinclude template="product/components/addToCart"/>
      <isinclude template="product/components/attributes"/>
    </div>
  </div>
</isobject>
```

### Recommendations Section

```isml
<!-- Einstein recommendations -->
<div class="recommendations-section">
  <h3>Recommended For You</h3>
  <div class="recommendation-carousel">
    <isloop items="${pdict.recommendations}" var="recommendedProduct">
      <isobject object="${recommendedProduct}" view="recommendation">
        <div class="recommendation-tile">
          <img src="${recommendedProduct.getImage('small').URL}" alt="${recommendedProduct.name}"/>
          <h4>${recommendedProduct.name}</h4>
          <span class="price">${recommendedProduct.price}</span>
          <a href="${URLUtils.url('Product-Show', 'pid', recommendedProduct.ID)}">View Details</a>
        </div>
      </isobject>
    </isloop>
  </div>
</div>
```

### Product Set Display

```isml
<!-- Product set with individual set products -->
<div class="product-set">
  <h2>Complete the Set</h2>
  <isloop items="${pdict.ProductSet.products}" var="setProduct">
    <isobject object="${setProduct}" view="setproduct">
      <div class="set-product-item">
        <img src="${setProduct.getImage('small').URL}" alt="${setProduct.name}"/>
        <h4>${setProduct.name}</h4>
        <span class="price">${setProduct.price}</span>
      </div>
    </isobject>
  </isloop>
</div>
```

### Bonus Product Chooser

```isml
<!-- Bonus product selection in promotion -->
<div class="bonus-products">
  <h3>Choose Your Free Gift</h3>
  <isloop items="${pdict.bonusProducts}" var="bonusProduct">
    <isobject object="${bonusProduct}" view="setproduct">
      <div class="bonus-product-tile">
        <input type="radio" name="bonusProductId" value="${bonusProduct.ID}"/>
        <img src="${bonusProduct.getImage('small').URL}" alt="${bonusProduct.name}"/>
        <label>${bonusProduct.name}</label>
      </div>
    </isobject>
  </isloop>
</div>
```

### Empty Search Results

```isml
<!-- No products found page -->
<isif condition="${empty(pdict.productSearchHits)}">
  <isobject object="${pdict.ProductSearchModel}" view="none">
    <div class="no-results">
      <h2>No Results Found</h2>
      <p>We couldn't find any products matching "${pdict.searchQuery}"</p>
      <p>Try adjusting your search or browse our categories.</p>
    </div>
  </isobject>
</isif>
```

### Quick View Modal

```isml
<!-- Quick view modal with product details -->
<div class="quick-view-modal">
  <isobject object="${pdict.Product}" view="detail">
    <div class="quick-view-content">
      <img src="${pdict.Product.getImage('large').URL}" alt="${pdict.Product.name}"/>
      <h2>${pdict.Product.name}</h2>
      <div class="price">${pdict.Product.price}</div>
      <isinclude template="product/components/addToCart"/>
    </div>
  </isobject>
</div>
```

### Cross-Sell Products

```isml
<!-- Cross-sell products on PDP -->
<div class="cross-sell-section">
  <h3>Frequently Bought Together</h3>
  <isloop items="${pdict.crossSellProducts}" var="product">
    <isobject object="${product}" view="recommendation">
      <div class="cross-sell-item">
        <img src="${product.getImage('small').URL}" alt="${product.name}"/>
        <span>${product.name}</span>
        <span class="price">${product.price}</span>
      </div>
    </isobject>
  </isloop>
</div>
```

## Best Practices

### Wrap Complete Product Representation

```isml
<!-- Good: Wraps all product elements -->
<isobject object="${product}" view="searchhit">
  <div class="product-tile">
    <img src="${product.image}"/>
    <h3>${product.name}</h3>
    <span class="price">${product.price}</span>
    <div class="swatches">...</div>
  </div>
</isobject>

<!-- Avoid: Only wraps part of product -->
<div class="product-tile">
  <img src="${product.image}"/>
  <isobject object="${product}" view="searchhit">
    <h3>${product.name}</h3>
  </isobject>
  <span class="price">${product.price}</span>
</div>
```

### Use Correct View Type

```isml
<!-- Correct view types for different contexts -->

<!-- Search results: searchhit -->
<isobject object="${productHit}" view="searchhit">

<!-- PDP: detail -->
<isobject object="${pdict.Product}" view="detail">

<!-- Recommendations: recommendation -->
<isobject object="${recommendedProduct}" view="recommendation">

<!-- Bonus products: setproduct -->
<isobject object="${bonusProduct}" view="setproduct">

<!-- Empty results: none -->
<isobject object="${pdict.ProductSearchModel}" view="none">
```

### Use Correct Object Type

```isml
<!-- SearchHit: Use ProductHit object -->
<isobject object="${productHit}" view="searchhit">

<!-- Detail/Recommendation/SetProduct: Use Product object -->
<isobject object="${pdict.Product}" view="detail">

<!-- None: Use ProductSearchModel -->
<isobject object="${pdict.ProductSearchModel}" view="none">
```

### Don't Use for Non-Merchandising

```isml
<!-- Avoid: Cart items (not merchandising) -->
<!-- Don't wrap cart items -->

<!-- Avoid: Order history (not merchandising) -->
<!-- Don't wrap historical orders -->

<!-- Avoid: Wishlist display (not active merchandising) -->
<!-- Don't wrap wishlist items -->
```

## Performance Considerations

### Minimal Overhead

The `<isobject>` tag has minimal performance impact:
- Lightweight data collection
- No significant template processing overhead
- Essential for analytics and merchandising features

### Strategic Placement

```isml
<!-- Efficient: Wrap once per product -->
<isloop items="${products}" var="product">
  <isobject object="${product}" view="searchhit">
    <div class="product">...</div>
  </isobject>
</isloop>

<!-- Avoid: Multiple wraps for same product (counted once anyway) -->
<isobject object="${product}" view="searchhit">
  <div class="name">${product.name}</div>
</isobject>
<isobject object="${product}" view="searchhit">  <!-- Redundant -->
  <div class="price">${product.price}</div>
</isobject>
```

## Troubleshooting

### Data Not Being Collected

**Problem:** Product impressions/views not appearing in analytics.

**Solution:**
1. Verify `<isobject>` wraps the complete product display
2. Check correct `view` type is used
3. Ensure tag is placed in valid `<script>` location
4. Verify object type matches view type requirements

```isml
<!-- Check object type for view -->
<isobject object="${productHit}" view="searchhit">  <!-- ProductHit for searchhit -->
<isobject object="${pdict.Product}" view="detail">  <!-- Product for detail -->
```

### Wrong Object Type

**Problem:** Error or no data collection.

**Solution:** Use correct object type for view:

```isml
<!-- searchhit requires ProductHit -->
<isobject object="${productHit}" view="searchhit">  <!-- Correct -->
<isobject object="${product}" view="searchhit">     <!-- May not work -->

<!-- detail/recommendation/setproduct require Product -->
<isobject object="${pdict.Product}" view="detail">  <!-- Correct -->
```

### Duplicate Counting Concerns

**Problem:** Worried about same product being counted multiple times.

**Solution:** Remember deduplication rules:
- Same product + same view type = counted once
- Same product + different view types = counted separately
- searchhit + setproduct for same product = one impression total

## Related Elements

- **`<isinclude>`**: Often used inside `<isobject>` to include product templates
- **`<isloop>`**: Commonly wraps multiple `<isobject>` tags for product lists
- **`<isslot>`**: Content slots may contain `<isobject>` tags for products

## Summary

The `<isobject>` element is essential for:

- ✅ Collecting product impression and view data
- ✅ Enabling active merchandising and Einstein features
- ✅ Tracking analytics for product performance
- ✅ Providing data to Storefront Toolkit
- ✅ Supporting merchandising optimization
- ✅ Measuring product visibility and engagement
- ✅ Enabling data-driven merchandising decisions

Use `<isobject>` to wrap product representations in merchandising contexts (search results, PDPs, recommendations) but avoid using it for non-merchandising displays (cart, orders, wishlists).
