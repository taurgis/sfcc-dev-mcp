# ISML isapplepay Element

## Overview

The `<isapplepay>` element injects an Apple Pay button into HTML pages, enabling customers to purchase products using Apple Pay. This element automatically handles the button rendering with Apple's official branding and styling, providing a seamless payment experience for customers using Apple devices.

## Syntax

```isml
<isapplepay
  sku = sku_value              // required
  class = css_class_names      // required
  id = element_id              // optional
/>
```

## Required Attributes

### sku

**Type:** Literal or Expression  
**Required:** Yes

Specifies the product SKU (Stock Keeping Unit) that will be added to the basket when the customer clicks the Apple Pay button.

**Important:** The merchant must ensure the product is of a type that can be added to the basket (e.g., not a master product without selected variants).

**Examples:**
```isml
<!-- Literal SKU -->
<isapplepay sku="12345" class="dw-apple-pay-logo-black" />

<!-- Expression from product object -->
<isapplepay sku="${pdict.Product.ID}" class="dw-apple-pay-logo-black" />

<!-- Expression from search result -->
<isapplepay sku="${product.id}" class="dw-apple-pay-logo-black" />
```

### class

**Type:** Literal  
**Required:** Yes

Specifies the CSS class names for the button's appearance. The root DOM element for the button will have at least the given CSS classes applied.

**Supported CSS Classes:**

| Class Name | Description |
|------------|-------------|
| `dw-apple-pay-button` | Automatically added to each Apple Pay button. Default black button with Apple Pay logo and branding |
| `dw-apple-pay-logo-black` | Black button with Apple Pay logo (default look) |
| `dw-apple-pay-logo-white` | White button with Apple Pay logo (alternate look) |
| `dw-apple-pay-border` | Adds black border around white button (use with `dw-apple-pay-logo-white`) |
| `dw-apple-pay-mini-cart` | Styling for Apple Pay button in mini cart |
| `dw-apple-pay-cart` | Styling for Apple Pay button in cart page |

**Examples:**
```isml
<!-- Black button (default) -->
<isapplepay sku="${pdict.Product.ID}" class="dw-apple-pay-logo-black" />

<!-- White button with border -->
<isapplepay sku="${pdict.Product.ID}" class="dw-apple-pay-logo-white dw-apple-pay-border" />

<!-- Cart page button -->
<isapplepay sku="${pdict.Product.ID}" class="dw-apple-pay-cart" />
```

## Optional Attributes

### id

**Type:** Literal or Expression  
**Optional:** Yes

Specifies the ID attribute for the root DOM element of the button. Useful for targeting the button with JavaScript or CSS.

**Examples:**
```isml
<!-- Simple literal ID -->
<isapplepay 
  sku="12345" 
  class="dw-apple-pay-logo-black" 
  id="apple-pay-button" 
/>

<!-- Dynamic ID based on product -->
<isapplepay 
  sku="${pdict.Product.ID}" 
  class="dw-apple-pay-logo-black" 
  id="apple-pay-${pdict.Product.ID}" 
/>

<!-- Expression-based ID -->
<isapplepay 
  sku="${product.id}" 
  class="dw-apple-pay-logo-black" 
  id="${'add-' + product.id + '-to-cart'}" 
/>
```

## Prerequisites

Before using the `<isapplepay>` element, ensure:

1. **Apple Pay is Enabled:** Apple Pay feature must be enabled for your site in Business Manager
2. **SSL/HTTPS:** Page must be served over HTTPS (Apple Pay requirement)
3. **Apple Device:** Button only appears on supported Apple devices and browsers
4. **Merchant Configuration:** Apple Pay merchant account is configured
5. **Product Availability:** Product specified by SKU can be added to basket

## Common Use Cases

### Product Detail Page

```isml
<!-- product/productDetails.isml -->
<div class="product-actions">
    <!-- Traditional add to cart button -->
    <button type="submit" class="add-to-cart">Add to Cart</button>
    
    <!-- Apple Pay button -->
    <isapplepay 
      sku="${pdict.Product.ID}" 
      class="dw-apple-pay-logo-black" 
      id="pdp-apple-pay" 
    />
</div>
```

### Product Tile in Search Results

```isml
<!-- product/productTile.isml -->
<div class="product-tile">
    <h3>${product.name}</h3>
    <span class="price">${product.price}</span>
    
    <div class="quick-buy">
        <isapplepay 
          sku="${product.id}" 
          class="dw-apple-pay-logo-black" 
          id="apple-pay-${product.id}" 
        />
    </div>
</div>
```

### Shopping Cart

```isml
<!-- cart/cart.isml -->
<div class="cart-actions">
    <a href="${URLUtils.url('Checkout-Begin')}" class="checkout-button">
        Proceed to Checkout
    </a>
    
    <!-- Apple Pay quick checkout -->
    <isapplepay 
      sku="${pdict.Basket.defaultShipment.firstProductLineItem.productID}" 
      class="dw-apple-pay-cart" 
      id="cart-apple-pay" 
    />
</div>
```

### Mini Cart

```isml
<!-- components/miniCart.isml -->
<div class="mini-cart">
    <div class="mini-cart-totals">
        <span>Total: ${pdict.Basket.totalGrossPrice}</span>
    </div>
    
    <div class="mini-cart-actions">
        <a href="${URLUtils.url('Cart-Show')}">View Cart</a>
        
        <isapplepay 
          sku="${pdict.Basket.defaultShipment.firstProductLineItem.productID}" 
          class="dw-apple-pay-mini-cart" 
          id="minicart-apple-pay" 
        />
    </div>
</div>
```

### Quick View Modal

```isml
<!-- product/quickView.isml -->
<div class="quickview-content">
    <h2>${pdict.Product.name}</h2>
    <p class="price">${pdict.Product.price}</p>
    
    <div class="quickview-actions">
        <button class="add-to-cart-quickview">Add to Cart</button>
        
        <isapplepay 
          sku="${pdict.Product.ID}" 
          class="dw-apple-pay-logo-white dw-apple-pay-border" 
          id="quickview-apple-pay-${pdict.Product.ID}" 
        />
    </div>
</div>
```

### Product List with Multiple Products

```isml
<!-- search/productGrid.isml -->
<div class="product-grid">
    <isloop items="${pdict.products}" var="product" status="loopStatus">
        <div class="grid-tile">
            <h4>${product.name}</h4>
            <span>${product.price}</span>
            
            <!-- Unique ID for each product -->
            <isapplepay 
              sku="${product.id}" 
              class="dw-apple-pay-logo-black" 
              id="apple-pay-product-${loopStatus.count}" 
            />
        </div>
    </isloop>
</div>
```

### Conditional Display

```isml
<!-- Only show Apple Pay if enabled and product is available -->
<isif condition="${pdict.applePayEnabled && pdict.Product.available}">
    <div class="apple-pay-container">
        <isapplepay 
          sku="${pdict.Product.ID}" 
          class="dw-apple-pay-logo-black" 
          id="apple-pay-button" 
        />
    </div>
</isif>
```

## Styling Options

### Black Button (Default)

```isml
<isapplepay 
  sku="${pdict.Product.ID}" 
  class="dw-apple-pay-logo-black" 
  id="apple-pay-black" 
/>
```

**Appearance:** Black background with white Apple Pay logo and text.  
**Best for:** Light backgrounds, general use.

### White Button with Border

```isml
<isapplepay 
  sku="${pdict.Product.ID}" 
  class="dw-apple-pay-logo-white dw-apple-pay-border" 
  id="apple-pay-white" 
/>
```

**Appearance:** White background with black Apple Pay logo and text, black border.  
**Best for:** Dark backgrounds, high contrast needed.

### White Button without Border

```isml
<isapplepay 
  sku="${pdict.Product.ID}" 
  class="dw-apple-pay-logo-white" 
  id="apple-pay-white-no-border" 
/>
```

**Appearance:** White background with black Apple Pay logo and text, no border.  
**Best for:** Subtle integration on light backgrounds.

### Custom Styling with Additional Classes

```isml
<isapplepay 
  sku="${pdict.Product.ID}" 
  class="dw-apple-pay-logo-black custom-margin custom-size" 
  id="apple-pay-custom" 
/>
```

```css
/* Custom CSS */
.custom-margin {
    margin: 15px 0;
}

.custom-size {
    min-width: 200px;
    height: 50px;
}
```

## Best Practices

1. **Ensure Product Can Be Added to Basket:**
   ```isml
   <!-- Good: Simple product or variant -->
   <isapplepay sku="${pdict.Product.ID}" class="dw-apple-pay-logo-black" />
   
   <!-- Bad: Master product without variant selection -->
   <!-- This will fail if product requires variant selection -->
   ```

2. **Use Appropriate Styling for Context:**
   ```isml
   <!-- Product detail page: Black button -->
   <isapplepay sku="${pdict.Product.ID}" class="dw-apple-pay-logo-black" />
   
   <!-- Mini cart: Specific mini cart styling -->
   <isapplepay sku="${product.id}" class="dw-apple-pay-mini-cart" />
   
   <!-- Cart page: Cart-specific styling -->
   <isapplepay sku="${product.id}" class="dw-apple-pay-cart" />
   ```

3. **Provide Unique IDs in Loops:**
   ```isml
   <isloop items="${products}" var="product" status="loop">
       <isapplepay 
         sku="${product.id}" 
         class="dw-apple-pay-logo-black" 
         id="apple-pay-${loop.count}" 
       />
   </isloop>
   ```

4. **Check Availability Before Display:**
   ```isml
   <isif condition="${pdict.Product.available && pdict.Product.ID}">
       <isapplepay 
         sku="${pdict.Product.ID}" 
         class="dw-apple-pay-logo-black" 
       />
   </isif>
   ```

5. **Follow Apple Pay Branding Guidelines:**
   - Don't modify Apple Pay logo or branding
   - Use approved button styles only
   - Maintain minimum button size (Apple's requirements)
   - Don't combine with confusing messaging

6. **Provide Fallback for Non-Apple Devices:**
   ```isml
   <!-- Apple Pay button (only shows on Apple devices) -->
   <isapplepay 
     sku="${pdict.Product.ID}" 
     class="dw-apple-pay-logo-black" 
     id="apple-pay-btn" 
   />
   
   <!-- Traditional checkout always visible -->
   <button type="submit" class="add-to-cart">Add to Cart</button>
   ```

7. **Use Descriptive IDs for Analytics:**
   ```isml
   <!-- Track which button was used -->
   <isapplepay 
     sku="${pdict.Product.ID}" 
     class="dw-apple-pay-logo-black" 
     id="apple-pay-pdp-${pdict.Product.ID}" 
   />
   ```

## Browser and Device Support

### Supported Browsers

- Safari on macOS
- Safari on iOS (iPhone, iPad)
- Safari on iPadOS

### Supported Devices

- iPhone (with Apple Pay enabled)
- iPad (with Apple Pay enabled)
- Mac with Touch ID
- Mac with Apple Watch for authentication

### Automatic Handling

The button **automatically**:
- Only displays on supported devices and browsers
- Handles device detection
- Shows/hides based on Apple Pay availability
- Manages user authentication with Touch ID/Face ID

## Variant Products

### Simple Product (Safe)

```isml
<!-- Simple product - OK to use directly -->
<isapplepay 
  sku="${pdict.Product.ID}" 
  class="dw-apple-pay-logo-black" 
/>
```

### Variant Product (Ensure Variant Selected)

```isml
<!-- Only show Apple Pay if variant is selected -->
<isif condition="${pdict.Product.variationModel.selectedVariant}">
    <isapplepay 
      sku="${pdict.Product.variationModel.selectedVariant.ID}" 
      class="dw-apple-pay-logo-black" 
      id="apple-pay-variant" 
    />
<iselse>
    <!-- Prompt user to select variant -->
    <p class="select-variant-message">Please select size and color</p>
</isif>
```

### Product Sets (Multiple SKUs)

```isml
<!-- For product sets, use individual items -->
<isloop items="${pdict.ProductSet.productSetItems}" var="item">
    <div class="set-item">
        <h4>${item.product.name}</h4>
        <isapplepay 
          sku="${item.product.ID}" 
          class="dw-apple-pay-logo-black" 
          id="apple-pay-set-item-${item.product.ID}" 
        />
    </div>
</isloop>
```

## Integration Patterns

### With Add to Cart Form

```isml
<form action="${URLUtils.url('Cart-AddProduct')}" method="post">
    <input type="hidden" name="pid" value="${pdict.Product.ID}" />
    <input type="number" name="quantity" value="1" />
    
    <button type="submit" class="add-to-cart">Add to Cart</button>
    
    <!-- Apple Pay as alternative -->
    <isapplepay 
      sku="${pdict.Product.ID}" 
      class="dw-apple-pay-logo-black" 
      id="apple-pay-alternative" 
    />
</form>
```

### With JavaScript Event Handling

```isml
<isapplepay 
  sku="${pdict.Product.ID}" 
  class="dw-apple-pay-logo-black" 
  id="apple-pay-tracked" 
/>

<script>
document.addEventListener('DOMContentLoaded', function() {
    var applePayBtn = document.getElementById('apple-pay-tracked');
    if (applePayBtn) {
        applePayBtn.addEventListener('click', function() {
            // Track Apple Pay button click
            analytics.track('Apple Pay Clicked', {
                product: '${pdict.Product.ID}',
                page: 'PDP'
            });
        });
    }
});
</script>
```

### SFRA Controller Pattern

```javascript
// Controller: Product-Show
server.get('Show', function (req, res, next) {
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var product = ProductFactory.get(req.querystring.pid);
    
    res.render('product/productDetails', {
        product: product,
        applePayEnabled: Site.getCurrent().getCustomPreferenceValue('applePayEnabled')
    });
    
    next();
});
```

```isml
<!-- Template: product/productDetails.isml -->
<isif condition="${pdict.applePayEnabled}">
    <isapplepay 
      sku="${pdict.product.id}" 
      class="dw-apple-pay-logo-black" 
    />
</isif>
```

## Accessibility

### ARIA Labels

While the element generates the button automatically, you can enhance accessibility:

```isml
<div role="region" aria-label="Payment options">
    <button class="standard-checkout">Checkout</button>
    
    <isapplepay 
      sku="${pdict.Product.ID}" 
      class="dw-apple-pay-logo-black" 
      id="apple-pay-button" 
    />
</div>
```

### Keyboard Navigation

The Apple Pay button is automatically keyboard accessible:
- Focusable via Tab key
- Activatable via Enter/Space
- Follows standard button behavior

## Performance Considerations

- **Automatic Loading:** Apple Pay scripts load only on supported devices
- **Minimal Overhead:** Button rendering is lightweight
- **No Impact on Non-Apple Devices:** No resources loaded on unsupported devices
- **Cached Resources:** Apple Pay resources are cached by the browser

## Security and Compliance

### HTTPS Requirement

```isml
<!-- Apple Pay ONLY works over HTTPS -->
<isif condition="${request.isHttpsRequest()}">
    <isapplepay 
      sku="${pdict.Product.ID}" 
      class="dw-apple-pay-logo-black" 
    />
<iselse>
    <!-- Fallback for HTTP (development only) -->
    <p>Apple Pay requires HTTPS</p>
</isif>
```

### PCI Compliance

- Apple Pay handles payment data securely
- No sensitive payment data touches your servers
- Tokenized payment information only
- Reduces PCI compliance scope

## Troubleshooting

### Button Not Appearing

**Check:**
1. Page is served over HTTPS
2. Viewing on supported Apple device/browser
3. Apple Pay is enabled in Business Manager
4. User has Apple Pay set up on device

### Button Appears But Doesn't Work

**Check:**
1. Product SKU is valid and in stock
2. Product can be added to basket (not a master product)
3. Apple Pay merchant configuration is complete
4. No JavaScript errors in console

### Styling Issues

**Check:**
1. CSS classes are spelled correctly
2. Custom CSS isn't conflicting with Apple Pay styles
3. Button has adequate space to render
4. No z-index issues hiding the button

### Multiple Products in Cart

**Note:** The `sku` attribute typically specifies a single product. For multiple products or cart scenarios, ensure the implementation aligns with your business logic.

## Testing

### Device Testing

Test on:
- iPhone with iOS Safari
- iPad with Safari
- Mac with Safari (Touch ID)
- Mac with Apple Watch

### Test Scenarios

1. **Product Detail Page:** Single product purchase
2. **Product Variations:** Ensure correct variant is used
3. **Multiple Products:** Different SKUs work correctly
4. **Cart/Mini Cart:** Proper integration with cart
5. **Guest Users:** Apple Pay works for guest checkout
6. **Registered Users:** Saved addresses populate correctly

## Related Elements

- `<iscontentasset>` - May contain Apple Pay promotional content
- Standard HTML `<button>` - Traditional add to cart alternative
- Payment method selection in checkout

## Notes

- Button only renders on Apple devices with Apple Pay capability
- Automatically handles Apple Pay availability detection
- Follows Apple's branding and design guidelines
- Requires HTTPS to function
- Product specified by SKU must be valid and available
- Button appearance controlled by CSS classes
- No custom HTML markup needed - fully automated
- Seamlessly integrates with Commerce Cloud basket and checkout

## Additional Resources

- Apple Pay Merchant Guidelines (Apple Developer)
- Salesforce B2C Commerce Apple Pay Documentation
- Business Manager: Configure Apple Pay settings
- Apple Pay Web Integration Guide

## Migration Notes

### Legacy to Modern Implementation

```isml
<!-- Legacy: Basic implementation -->
<isapplepay sku="12345" class="dw-apple-pay-logo-black" />

<!-- Modern: Enhanced with conditions and tracking -->
<isif condition="${pdict.applePayEnabled && pdict.Product.available}">
    <div class="payment-options">
        <isapplepay 
          sku="${pdict.Product.ID}" 
          class="dw-apple-pay-logo-black" 
          id="apple-pay-pdp-${pdict.Product.ID}" 
        />
    </div>
</isif>
```