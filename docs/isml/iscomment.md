# ISML iscomment Element

## Overview

The `<iscomment>` element allows you to add documentation, reminders, and instructions within ISML templates that are completely removed during template processing. Unlike HTML comments, content within `<iscomment>` tags is never sent to the browser and cannot be viewed in page source, making it ideal for internal documentation, sensitive notes, and developer comments that should remain private.

**Key Difference from HTML Comments:** `<iscomment>` content is stripped during server-side processing; HTML comments (`<!-- -->`) are sent to the browser and visible in page source.

## Syntax

```isml
<iscomment>
  ... your comments here ...
</iscomment>
```

### Deprecated Syntax

⚠️ **DEPRECATED (since March 6, 2009):**
```isml
<!---  your comments here  --->
```

**Note:** While this deprecated syntax doesn't cause failures, the standard `<iscomment>` syntax is strongly recommended.

## Attributes

**None** - This element has no attributes.

## Purpose

The `<iscomment>` element serves several critical purposes:

1. **Internal Documentation:** Document template logic, business rules, and implementation details
2. **Developer Notes:** Leave reminders and instructions for yourself and team members
3. **Confidentiality:** Hide sensitive information that should never reach the browser
4. **Code Organization:** Add section headers and explanatory notes
5. **Debugging Aids:** Temporarily comment out code or add debug notes
6. **Maintenance Instructions:** Document why specific code exists and how to maintain it

### Processing Behavior

**Server-Side Removal:**
- Content is **not parsed** by the template processor
- Content **does not appear** in the generated HTML sent to browser
- Content **cannot be viewed** using "View Source" in browsers
- No performance impact on client-side rendering

**Security Benefit:** Unlike HTML comments, `<iscomment>` prevents information leakage to end users.

## Comparison: iscomment vs HTML Comments

| Feature | `<iscomment>` | `<!-- HTML Comment -->` |
|---------|---------------|-------------------------|
| **Visible in Page Source** | ❌ No | ✅ Yes |
| **Sent to Browser** | ❌ No | ✅ Yes |
| **Server-Side Processing** | Removed | Passed through |
| **Confidentiality** | ✅ High | ❌ None |
| **Use Case** | Internal docs, sensitive notes | Public documentation, SEO |
| **Security** | ✅ Safe for internal notes | ⚠️ Never put sensitive data |

```isml
<!-- HTML comment: visible in page source -->
<div>This is content</div>

<iscomment>
ISML comment: NOT visible in page source
Never sent to browser
</iscomment>
```

## Common Use Cases

### Template Documentation

```isml
<iscomment>
    Template: product/productDetails.isml
    Purpose: Display product detail page with pricing, availability, and add-to-cart
    Author: Development Team
    Last Updated: 2025-10-03
    
    Dependencies:
    - Product model from controller
    - URLUtils helper
    - Product availability service
</iscomment>

<div class="product-detail">
    <h1>${pdict.Product.name}</h1>
    <!-- Product details -->
</div>
```

### Business Logic Explanation

```isml
<iscomment>
    Complex pricing logic:
    1. Start with base price
    2. Apply customer-specific price book
    3. Apply active promotions
    4. Calculate volume discounts
    5. Apply employee discount if applicable
    
    DO NOT change this order - promotions must apply before employee discount
</iscomment>

<div class="pricing">
    <span class="price">${pdict.Product.price}</span>
</div>
```

### Developer Reminders

```isml
<iscomment>
    TODO: Refactor this section to use product factory
    FIXME: This logic duplicates code in productTile.isml - consolidate
    NOTE: Be careful with performance - this loops through all variants
</iscomment>

<isloop items="${pdict.Product.variants}" var="variant">
    <div>${variant.name}</div>
</isloop>
```

### Code Sections and Organization

```isml
<iscomment>
    ========================================
    SECTION: Product Images
    ========================================
</iscomment>

<div class="product-images">
    <!-- Image gallery code -->
</div>

<iscomment>
    ========================================
    SECTION: Product Pricing
    ========================================
</iscomment>

<div class="product-pricing">
    <!-- Pricing code -->
</div>

<iscomment>
    ========================================
    SECTION: Add to Cart
    ========================================
</iscomment>

<div class="add-to-cart">
    <!-- Add to cart code -->
</div>
```

### Sensitive Configuration Notes

```isml
<iscomment>
    Payment Integration Notes:
    - Payment processor: XYZ Payments
    - Merchant ID stored in site preferences
    - Test mode enabled in sandbox environments
    - Production credentials in Business Manager
    
    IMPORTANT: Never hardcode credentials in templates
</iscomment>

<div class="payment-options">
    <!-- Payment integration code -->
</div>
```

### Debugging Information

```isml
<iscomment>
    Debug info:
    - pdict.Product type: ${typeof pdict.Product}
    - Product ID: ${pdict.Product.ID}
    - Available: ${pdict.Product.available}
    - In Stock: ${pdict.Product.availabilityModel.inStock}
    
    This output only visible in ISML file, never in browser
</iscomment>

<div class="product">
    ${pdict.Product.name}
</div>
```

### Commenting Out Code Blocks

```isml
<div class="product-actions">
    <button type="submit" class="add-to-cart">Add to Cart</button>
    
    <iscomment>
        Temporarily disabled for A/B test - re-enable after test completes
        
        <isapplepay 
            sku="${pdict.Product.ID}" 
            class="dw-apple-pay-logo-black" 
        />
    </iscomment>
</div>
```

### Version History and Change Log

```isml
<iscomment>
    Change Log:
    
    2025-10-03 - Added Einstein recommendations section
    2025-09-15 - Refactored pricing logic for promotion stacking
    2025-08-20 - Implemented lazy loading for product images
    2025-07-10 - Initial implementation
</iscomment>

<div class="product-detail-page">
    <!-- Page content -->
</div>
```

### API and Integration Notes

```isml
<iscomment>
    Inventory Service Integration:
    
    Endpoint: /inventory/check
    Method: GET
    Params: productId, storeId
    Response: { available: boolean, quantity: number }
    
    Error Handling:
    - Service timeout: Show "Check in Store" message
    - Service unavailable: Fall back to default availability
    - Invalid product: Show out of stock
</iscomment>

<div class="availability">
    <isif condition="${pdict.Product.available}">
        <span class="in-stock">In Stock</span>
    </isif>
</div>
```

### Data Structure Documentation

```isml
<iscomment>
    Expected pdict structure:
    
    pdict.Product = {
        ID: String,
        name: String,
        price: Money,
        available: Boolean,
        images: {
            large: [{ url: String, alt: String }],
            small: [{ url: String, alt: String }]
        },
        variants: Array<Variant>
    }
</iscomment>

<h1>${pdict.Product.name}</h1>
```

### Maintenance Instructions

```isml
<iscomment>
    IMPORTANT MAINTENANCE NOTE:
    
    This template uses a custom product availability service.
    If availability checks fail:
    1. Check service status in Business Manager
    2. Verify service credentials in site preferences
    3. Review service logs in Operations > Services
    4. Contact Platform team if issues persist
    
    Escalation: platform-team@company.com
</iscomment>

<div class="product-info">
    <!-- Product information -->
</div>
```

## Best Practices

1. **Use for Internal Documentation:**
   ```isml
   <iscomment>
       Internal note: This section implements custom pricing logic
       approved by Business team on 2025-09-01
   </iscomment>
   ```

2. **Never Use for Public Content:**
   ```isml
   <!-- Good: Public documentation using HTML comments -->
   <!-- Product carousel - 4 items per slide -->
   
   <iscomment>
       Good: Internal documentation using iscomment
       Carousel implementation uses Slick library v1.8.1
       Custom configuration in product.js
   </iscomment>
   ```

3. **Document Complex Logic:**
   ```isml
   <iscomment>
       Promotion stacking logic:
       1. Order-level promotions apply first
       2. Product-level promotions apply second
       3. If conflict, best discount wins
       4. Maximum 3 promotions per order
   </iscomment>
   ```

4. **Add TODO/FIXME Notes:**
   ```isml
   <iscomment>
       TODO: Optimize this loop - currently iterates all variants
       FIXME: Race condition when multiple users add last item
       NOTE: This code will be refactored in next sprint
   </iscomment>
   ```

5. **Explain "Why" Not Just "What":**
   ```isml
   <iscomment>
       Bad: Loops through products
       
       Good: Loops through products in reverse order because
       newest products should display first per Marketing requirements
       (Jira ticket: STORE-1234)
   </iscomment>
   ```

6. **Use for Temporary Debugging:**
   ```isml
   <iscomment>
       Debug: Product object structure
       ${JSON.stringify(pdict.Product)}
       
       Remove before deploying to production
   </iscomment>
   ```

7. **Document Template Dependencies:**
   ```isml
   <iscomment>
       This template depends on:
       - Product model from Product-Show controller
       - URLUtils for link generation
       - Resource bundle: product.properties
       - CSS: product.css
       - JS: productDetail.js
   </iscomment>
   ```

8. **Add Section Dividers for Long Templates:**
   ```isml
   <iscomment>
       ================================================
       PRODUCT IMAGES SECTION
       ================================================
   </iscomment>
   
   <!-- Image code -->
   
   <iscomment>
       ================================================
       PRODUCT DETAILS SECTION
       ================================================
   </iscomment>
   
   <!-- Details code -->
   ```

## When to Use iscomment vs HTML Comments

### Use `<iscomment>` for:

- ✅ Internal developer notes
- ✅ Business logic explanations
- ✅ Sensitive information references
- ✅ TODO/FIXME/NOTE annotations
- ✅ Code that's temporarily disabled
- ✅ Debugging information
- ✅ Maintenance instructions
- ✅ API documentation
- ✅ Version history

### Use HTML Comments `<!-- -->` for:

- ✅ Public documentation
- ✅ SEO-related notes
- ✅ Browser compatibility notes
- ✅ Content sectioning visible to frontend developers
- ✅ Conditional IE comments
- ✅ Third-party integration documentation

```isml
<iscomment>
    Internal: This section implements Einstein recommendations
    Service endpoint: /einstein/recommendations
    Fallback: Show best sellers if service unavailable
</iscomment>

<!-- Einstein Product Recommendations Section -->
<div class="recommendations">
    <!-- Public HTML comment for frontend developers -->
    <h2>You May Also Like</h2>
    <!-- Recommendation tiles render here -->
</div>
```

## Multi-Line Comments

```isml
<iscomment>
    Long, detailed explanation spanning multiple lines.
    
    This can include:
    - Bullet points
    - Code examples (in comments)
    - Complex explanations
    - References to documentation
    
    Everything within the iscomment tags is removed
    during template processing and never sent to browser.
</iscomment>
```

## Nested Comments (Not Supported)

⚠️ **Warning:** You cannot nest `<iscomment>` tags:

```isml
<!-- Bad: Nested comments not supported -->
<iscomment>
    Outer comment
    <iscomment>
        Inner comment - THIS WON'T WORK
    </iscomment>
</iscomment>

<!-- Good: Single level comments -->
<iscomment>
    First comment
</iscomment>

<div>Some content</div>

<iscomment>
    Second comment
</iscomment>
```

## Commenting Out Large Blocks

```isml
<iscomment>
    Entire section commented out for testing
    
    <div class="promotional-banner">
        <h2>Special Offer</h2>
        <p>Save 20% on all items</p>
        <isloop items="${pdict.promotions}" var="promo">
            <div class="promo">${promo.name}</div>
        </isloop>
    </div>
</iscomment>
```

**Note:** All ISML tags within `<iscomment>` are ignored and not processed.

## Security Considerations

### Safe in iscomment (Not Sent to Browser)

```isml
<iscomment>
    API Configuration:
    Service name: InventoryService
    Endpoint: https://api.internal.company.com/inventory
    Timeout: 5000ms
    Retry: 3 times
    
    This internal documentation never reaches the browser
</iscomment>
```

### Never in HTML Comments (Visible in Page Source)

```isml
<!-- 
    DANGEROUS: Never put sensitive info in HTML comments
    API Key: abc123xyz (ANYONE CAN SEE THIS IN PAGE SOURCE!)
-->
```

## Performance Impact

- **Server-Side:** Minimal - comments removed during template processing
- **Client-Side:** None - content never sent to browser
- **Network:** None - reduces HTML size slightly (no comment in output)
- **Cache:** No impact - comments removed before caching

```isml
<iscomment>
    This comment adds zero bytes to the HTML sent to browser
    Template processing removes it completely
    No performance impact on page load
</iscomment>
```

## Debugging Use Cases

### Temporary Debug Output

```isml
<iscomment>
    Debug output (remove before production):
    
    Product ID: ${pdict.Product.ID}
    Product Type: ${pdict.Product.type}
    Available: ${pdict.Product.available}
    Price: ${pdict.Product.price}
    
    This debug info is only visible in ISML file
</iscomment>
```

### A/B Test Documentation

```isml
<iscomment>
    A/B Test: Checkout Button Color
    Test ID: AB-2025-Q4-001
    Start: 2025-10-01
    End: 2025-10-31
    
    Variant A: Blue button (control)
    Variant B: Green button (test)
    
    Hypothesis: Green button increases conversion by 5%
</iscomment>

<isif condition="${pdict.abTestVariant == 'B'}">
    <button class="checkout-btn green">Checkout</button>
<iselse>
    <button class="checkout-btn blue">Checkout</button>
</isif>
```

### Feature Flags

```isml
<iscomment>
    Feature Flag: express-checkout-v2
    Status: In development
    Expected Launch: 2025-11-15
    
    When enabled, shows new express checkout flow
    Controlled in Business Manager > Site Preferences > Custom > Features
</iscomment>

<isif condition="${pdict.features.expressCheckoutV2}">
    <isinclude template="checkout/expressV2" />
<iselse>
    <isinclude template="checkout/expressV1" />
</isif>
```

## Common Patterns

### Template Header Documentation

```isml
<iscomment>
    ============================================================
    Template: cart/cart.isml
    Description: Shopping cart page with line items and totals
    ============================================================
    
    Author: Frontend Team
    Created: 2025-01-15
    Last Modified: 2025-10-03
    
    Requirements:
    - Basket must exist in pdict
    - Promotions applied before rendering
    - Shipping estimates calculated
    
    Related Files:
    - Controller: Cart.js
    - Model: CartModel.js
    - Styles: cart.scss
    - Scripts: cart.js
    ============================================================
</iscomment>

<div class="cart-page">
    <!-- Cart content -->
</div>
```

### Code Block Comments

```isml
<iscomment> ===== START: Product Images ===== </iscomment>

<div class="product-images">
    <!-- Image gallery -->
</div>

<iscomment> ===== END: Product Images ===== </iscomment>


<iscomment> ===== START: Product Details ===== </iscomment>

<div class="product-details">
    <!-- Product information -->
</div>

<iscomment> ===== END: Product Details ===== </iscomment>
```

### Conditional Logic Documentation

```isml
<iscomment>
    Display logic:
    1. If product has master, show variant selector
    2. If product is simple, show add-to-cart directly
    3. If product is set, show set items
    4. If product is bundle, show bundle components
</iscomment>

<isif condition="${pdict.Product.master}">
    <isinclude template="product/variantSelector" />
<iselseif condition="${pdict.Product.productSet}">
    <isinclude template="product/productSet" />
<iselseif condition="${pdict.Product.bundle}">
    <isinclude template="product/bundleComponents" />
<iselse>
    <isinclude template="product/simpleProduct" />
</isif>
```

## Related Elements

- HTML comments `<!-- -->` - Visible in page source (use for public documentation)
- `<isscript>` - Server-side code execution (can include JavaScript comments)
- `<isdecorate>` - Template decoration (use `<iscomment>` to document decorators)

## Notes

- Content within `<iscomment>` is completely removed during template processing
- Not sent to browser and not visible in page source
- Provides true confidentiality unlike HTML comments
- No attributes supported
- Cannot be nested
- Deprecated syntax (`<!--- --->`) still works but not recommended
- No performance impact on client-side rendering
- Ideal for internal documentation and sensitive notes
- Can contain any content including ISML tags (all ignored)

## Migration from HTML Comments

### Before (Insecure)

```isml
<!-- 
    Internal note: This uses custom pricing service
    Service URL: https://pricing-api.internal.company.com
    Credentials stored in site preferences
-->
<div class="pricing">
    ${pdict.Product.price}
</div>
```

### After (Secure)

```isml
<iscomment>
    Internal note: This uses custom pricing service
    Service URL: https://pricing-api.internal.company.com
    Credentials stored in site preferences
</iscomment>

<!-- Pricing Section -->
<div class="pricing">
    ${pdict.Product.price}
</div>
```

## Recommended Comment Structure

```isml
<iscomment>
    [COMPONENT NAME]
    
    Purpose: [Brief description]
    
    Dependencies:
    - [Dependency 1]
    - [Dependency 2]
    
    Important Notes:
    - [Note 1]
    - [Note 2]
    
    Last Updated: [Date]
    Author: [Name/Team]
</iscomment>

<!-- Component HTML Code -->
```

## Example: Complete Template Documentation

```isml
<iscomment>
    ============================================================
    PRODUCT DETAIL PAGE TEMPLATE
    ============================================================
    
    File: product/productDetails.isml
    Purpose: Display complete product information including
             images, pricing, variants, and add-to-cart
    
    Controller: Product-Show
    Model: Product (SFRA)
    
    Dependencies:
    - URLUtils helper
    - Resource bundles (product.properties)
    - Product availability service
    - Image transformation service
    
    pdict Structure:
    {
        Product: Object,      // Product model
        category: Object,     // Primary category
        reviews: Array,       // Product reviews
        recommendations: Array // Related products
    }
    
    Features:
    - Image zoom on hover
    - Variant selection (size, color)
    - Quantity selection
    - Add to cart / Add to wishlist
    - Social sharing
    - Product reviews display
    - Einstein recommendations
    
    Performance Notes:
    - Template is cached for 1 hour
    - Images lazy-loaded
    - Reviews loaded via AJAX
    
    A/B Tests Active:
    - Checkout button color (AB-2025-Q4-001)
    - Product image layout (AB-2025-Q4-002)
    
    Last Updated: 2025-10-03
    Author: Frontend Team
    ============================================================
</iscomment>

<iscache type="relative" hour="1"/>

<!DOCTYPE html>
<html>
<!-- Template content -->
</html>
```