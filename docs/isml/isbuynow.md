# ISML isbuynow Element

## Overview

The `<isbuynow>` element injects code to render express checkout buttons (such as Apple Pay, Google Pay, or PayPal) that enable shoppers to purchase a specific product directly without adding it to their cart first. This element is specifically designed for **B2C Commerce Payments** and provides a streamlined "buy now" experience for individual products.

**Important:** This element is only used with B2C Commerce Payments. An associated payments account must be successfully enabled and configured for use on the storefront site where this element appears.

## Syntax

```isml
<isbuynow
  payment-request = SalesforcePaymentRequest_expression  // required
></isbuynow>
```

## Required Attributes

### payment-request

**Type:** Expression (SalesforcePaymentRequest)  
**Required:** Yes

Specifies a `dw.extensions.payments.SalesforcePaymentRequest` object as part of an expression. This object configures which express checkout buttons to render, how they appear, and what product/payment data they should process.

**Object Type:** `dw.extensions.payments.SalesforcePaymentRequest`

**Examples:**
```isml
<!-- Basic usage -->
<isbuynow payment-request="${paymentRequest}"></isbuynow>

<!-- With variable from pdict -->
<isbuynow payment-request="${pdict.buyNowPaymentRequest}"></isbuynow>

<!-- From controller-prepared object -->
<isbuynow payment-request="${pdict.expressCheckout}"></isbuynow>
```

## Purpose

The `<isbuynow>` element serves to:

1. **Express Checkout:** Enable one-click purchase of a specific product
2. **Payment Button Rendering:** Inject `<script>` code to display payment provider buttons (Apple Pay, Google Pay, etc.)
3. **Direct Purchase Flow:** Allow shoppers to buy immediately without traditional cart workflow
4. **Configured Payment Options:** Render only applicable payment methods for the shopper's device and configuration
5. **Product-Specific Checkout:** Process payment for a single product, not the current basket

## Difference from ispayment

| Element | Purpose | Use Case |
|---------|---------|----------|
| `<isbuynow>` | Buy a **specific product** directly | Product detail pages, quick buy buttons |
| `<ispayment>` | Pay for **current basket** | Cart page, checkout page |

```isml
<!-- Buy this specific product now -->
<isbuynow payment-request="${productPaymentRequest}"></isbuynow>

<!-- Pay for current basket -->
<ispayment payment-request="${basketPaymentRequest}></ispayment>
```

## Rules of Use

### Placement Requirements

1. **Valid Script Location:** Must be placed where `<script>` tags are valid
2. **After Closing Head Tag:** Must appear after the `</head>` tag in the HTML page
3. **Body or Valid Container:** Typically placed within the `<body>` tag

```isml
<!DOCTYPE html>
<html>
<head>
    <title>Product Details</title>
</head>
<!-- After closing </head> tag -->
<body>
    <div class="product-actions">
        <!-- Valid: Inside body -->
        <isbuynow payment-request="${paymentRequest}"></isbuynow>
    </div>
</body>
</html>
```

### Multiple Instances

**Allowed:** This tag can appear **multiple times** on the same page with **no limit**.

```isml
<!-- Multiple buy now buttons for different products -->
<isloop items="${pdict.products}" var="product">
    <div class="product-tile">
        <h3>${product.name}</h3>
        <isbuynow payment-request="${product.paymentRequest}"></isbuynow>
    </div>
</isloop>
```

### Caching Restrictions

⚠️ **CRITICAL:** This tag **cannot be used in a cached template** because:

- It processes payment for a specific product with current pricing
- Line items include amounts that depend on dynamic variables:
  - Currency
  - Current prices
  - Active promotions
  - Applicable shipping methods
  - Tax calculations
  - Customer-specific discounts

```isml
<!-- Bad: In cached template -->
<iscache type="relative" hour="24"/>
<isbuynow payment-request="${paymentRequest}"></isbuynow>  <!-- DON'T DO THIS -->

<!-- Good: In non-cached template or controller-rendered content -->
<isbuynow payment-request="${paymentRequest}"></isbuynow>
```

### Conditional Rendering

Express checkout buttons are **only rendered when applicable** for the shopper:

- ✅ Shopper uses a supported device (iPhone, iPad, Mac with Apple Pay)
- ✅ Shopper uses a supported operating system (iOS, macOS, Android)
- ✅ Shopper has configured their device for express checkout (Apple Pay, Google Pay set up)
- ✅ Payment method is available in shopper's region
- ❌ If conditions aren't met, **no button is rendered** (silent failure)

## Common Use Cases

### Product Detail Page - Apple Pay

```isml
<!-- product/productDetails.isml -->
<isscript>
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    
    // Calculate buy now data for the current product
    var buyNowData = COHelpers.calculateBuyNowData(
        pdict.Product, 
        pdict.Quantity, 
        pdict.Product.price
    );
    
    // Create payment request
    var paymentRequest = new SalesforcePaymentRequest(
        'applepay',                          // Component ID
        '.apple-pay-button-container'        // CSS class selector
    );
    
    // Add Apple Pay button
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
    
    // Set basket data and options
    paymentRequest.setBasketData(buyNowData.basketData);
    paymentRequest.setOptions(buyNowData.options);
</isscript>

<div class="product-actions">
    <button type="submit" class="add-to-cart">Add to Cart</button>
    
    <!-- Apple Pay buy now button -->
    <div class="apple-pay-button-container">
        <isbuynow payment-request="${paymentRequest}"></isbuynow>
    </div>
</div>
```

### Product Detail Page - Multiple Payment Methods

```isml
<isscript>
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    
    var buyNowData = COHelpers.calculateBuyNowData(pdict.Product, pdict.Quantity, pdict.Product.price);
    
    var paymentRequest = new SalesforcePaymentRequest(
        'express-checkout',
        '.express-checkout-container'
    );
    
    // Add multiple payment methods
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_GOOGLEPAY);
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_PAYPAL);
    
    paymentRequest.setBasketData(buyNowData.basketData);
    paymentRequest.setOptions(buyNowData.options);
</isscript>

<div class="express-checkout-container">
    <isbuynow payment-request="${paymentRequest}"></isbuynow>
</div>
```

### Product Tile in Search Results

```isml
<!-- search/productTile.isml -->
<div class="product-tile">
    <img src="${product.images.small[0].url}" alt="${product.name}" />
    <h4>${product.name}</h4>
    <span class="price">${product.price}</span>
    
    <isscript>
        var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
        var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
        
        var buyNowData = COHelpers.calculateBuyNowData(product, 1, product.price);
        
        var tilePaymentRequest = new SalesforcePaymentRequest(
            'tile-applepay-' + product.id,
            '.tile-applepay-' + product.id
        );
        
        tilePaymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
        tilePaymentRequest.setBasketData(buyNowData.basketData);
        tilePaymentRequest.setOptions(buyNowData.options);
    </isscript>
    
    <div class="quick-buy">
        <div class="tile-applepay-${product.id}">
            <isbuynow payment-request="${tilePaymentRequest}"></isbuynow>
        </div>
    </div>
</div>
```

### Controller-Based Implementation

```javascript
// Controller: Product-Show.js
'use strict';

var server = require('server');
var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');

server.get('Show', function (req, res, next) {
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var product = ProductFactory.get(req.querystring.pid);
    
    // Create buy now payment request in controller
    var buyNowData = COHelpers.calculateBuyNowData(product, 1, product.price);
    
    var paymentRequest = new SalesforcePaymentRequest(
        'pdp-applepay',
        '.pdp-express-checkout'
    );
    
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
    paymentRequest.setBasketData(buyNowData.basketData);
    paymentRequest.setOptions(buyNowData.options);
    
    res.render('product/productDetails', {
        product: product,
        buyNowPaymentRequest: paymentRequest
    });
    
    next();
});

module.exports = server.exports();
```

```isml
<!-- Template: product/productDetails.isml -->
<div class="pdp-express-checkout">
    <isbuynow payment-request="${pdict.buyNowPaymentRequest}"></isbuynow>
</div>
```

### Quick View Modal

```isml
<!-- product/quickView.isml -->
<div class="quickview-modal">
    <h2>${pdict.Product.name}</h2>
    <p class="price">${pdict.Product.price}</p>
    
    <isscript>
        var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
        var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
        
        var buyNowData = COHelpers.calculateBuyNowData(pdict.Product, 1, pdict.Product.price);
        
        var quickViewPayment = new SalesforcePaymentRequest(
            'quickview-express',
            '.quickview-express-checkout'
        );
        
        quickViewPayment.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
        quickViewPayment.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_GOOGLEPAY);
        quickViewPayment.setBasketData(buyNowData.basketData);
        quickViewPayment.setOptions(buyNowData.options);
    </isscript>
    
    <div class="quickview-actions">
        <button class="add-to-cart">Add to Cart</button>
        <div class="quickview-express-checkout">
            <isbuynow payment-request="${quickViewPayment}"></isbuynow>
        </div>
    </div>
</div>
```

### With Quantity Selection

```isml
<div class="product-purchase">
    <label for="quantity">Quantity:</label>
    <select id="quantity" name="quantity">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
    </select>
    
    <isscript>
        var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
        var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
        
        // Use quantity from pdict (set by controller based on selection)
        var quantity = pdict.selectedQuantity || 1;
        var buyNowData = COHelpers.calculateBuyNowData(pdict.Product, quantity, pdict.Product.price);
        
        var paymentRequest = new SalesforcePaymentRequest(
            'buy-now-qty',
            '.buy-now-container'
        );
        
        paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
        paymentRequest.setBasketData(buyNowData.basketData);
        paymentRequest.setOptions(buyNowData.options);
    </isscript>
    
    <div class="buy-now-container">
        <isbuynow payment-request="${paymentRequest}"></isbuynow>
    </div>
</div>
```

## Best Practices

1. **Create Payment Request in Controller:**
   ```javascript
   // Good: Controller logic
   var paymentRequest = new SalesforcePaymentRequest('applepay', '.container');
   // ... configure payment request ...
   res.render('template', { paymentRequest: paymentRequest });
   ```
   
   ```isml
   <!-- Bad: Complex logic in template -->
   <isscript>
       // Avoid complex business logic in templates
       var paymentRequest = ...
   </isscript>
   ```

2. **Use Unique Component IDs:**
   ```isml
   <!-- Good: Unique ID per instance -->
   <isloop items="${products}" var="product" status="loop">
       <isscript>
           var pr = new SalesforcePaymentRequest(
               'applepay-' + product.id,  // Unique ID
               '.applepay-container-' + product.id
           );
       </isscript>
   </isloop>
   
   <!-- Bad: Same ID for all -->
   <isloop items="${products}" var="product">
       <isscript>
           var pr = new SalesforcePaymentRequest(
               'applepay',  // Duplicate ID - will cause issues
               '.applepay-container'
           );
       </isscript>
   </isloop>
   ```

3. **Never Cache Templates with isbuynow:**
   ```isml
   <!-- Bad: Cached template -->
   <iscache type="relative" hour="1"/>
   <isbuynow payment-request="${paymentRequest}"></isbuynow>
   
   <!-- Good: No cache on payment pages -->
   <isbuynow payment-request="${paymentRequest}"></isbuynow>
   ```

4. **Provide Fallback for Traditional Checkout:**
   ```isml
   <div class="checkout-options">
       <!-- Express checkout -->
       <div class="express-checkout">
           <isbuynow payment-request="${paymentRequest}"></isbuynow>
       </div>
       
       <!-- Traditional fallback -->
       <div class="traditional-checkout">
           <button type="submit" class="add-to-cart">Add to Cart</button>
       </div>
   </div>
   ```

5. **Handle Product Availability:**
   ```isml
   <isif condition="${pdict.Product.available && pdict.Product.inStock}">
       <isscript>
           // Only create payment request if product is available
           var buyNowData = COHelpers.calculateBuyNowData(pdict.Product, 1, pdict.Product.price);
           var paymentRequest = new SalesforcePaymentRequest('applepay', '.container');
           paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
           paymentRequest.setBasketData(buyNowData.basketData);
           paymentRequest.setOptions(buyNowData.options);
       </isscript>
       
       <div class="container">
           <isbuynow payment-request="${paymentRequest}"></isbuynow>
       </div>
   <iselse>
       <p class="out-of-stock">Out of Stock</p>
   </isif>
   ```

6. **Use CSS Classes for Targeting:**
   ```isml
   <isscript>
       // Use descriptive, specific CSS class selectors
       var paymentRequest = new SalesforcePaymentRequest(
           'applepay-pdp',
           '.pdp-apple-pay-button'  // Specific, semantic class name
       );
   </isscript>
   
   <div class="pdp-apple-pay-button">
       <isbuynow payment-request="${paymentRequest}"></isbuynow>
   </div>
   ```

7. **Document Payment Configuration:**
   ```isml
   <isscript>
       /**
        * Buy Now Payment Request Configuration
        * - Component: applepay
        * - Container: .express-checkout-pdp
        * - Methods: Apple Pay only
        * - Product: Single product purchase
        */
       var buyNowData = COHelpers.calculateBuyNowData(pdict.Product, 1, pdict.Product.price);
       var paymentRequest = new SalesforcePaymentRequest('applepay', '.express-checkout-pdp');
       paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
       paymentRequest.setBasketData(buyNowData.basketData);
       paymentRequest.setOptions(buyNowData.options);
   </isscript>
   ```

## SalesforcePaymentRequest Configuration

### Required Methods

```javascript
var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');

// 1. Create request with ID and container selector
var paymentRequest = new SalesforcePaymentRequest('component-id', '.css-selector');

// 2. Add payment method types
paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_GOOGLEPAY);

// 3. Set basket data (product info, amounts)
paymentRequest.setBasketData(basketData);

// 4. Set options (display configuration)
paymentRequest.setOptions(options);
```

### Basket Data Structure

The `basketData` object typically includes:
- Product line items
- Quantities
- Prices
- Currency
- Shipping information
- Tax calculations

### Options Structure

The `options` object configures:
- Display settings
- Allowed payment methods
- Shipping options
- Contact information requirements

**See:** `dw.extensions.payments` API documentation for complete details.

## Prerequisites

Before using `<isbuynow>`:

1. **B2C Commerce Payments Enabled:** Site must have B2C Commerce Payments configured
2. **Payment Account Configured:** Associated payments account (Apple Pay, Google Pay, etc.) must be set up
3. **HTTPS Required:** Page must be served over HTTPS (payment provider requirement)
4. **Helper Functions Available:** `COHelpers.calculateBuyNowData` or equivalent must exist
5. **Non-Cached Template:** Template must not use `<iscache>`

## Browser and Device Support

### Automatic Detection

The element automatically handles:
- Device compatibility detection
- Operating system verification
- Payment method availability
- User configuration status

### Supported Scenarios

- ✅ iOS Safari with Apple Pay configured
- ✅ macOS Safari with Apple Pay configured
- ✅ Chrome on Android with Google Pay configured
- ✅ Supported browsers with PayPal configured

### Unsupported Scenarios

- ❌ Desktop Windows (no Apple Pay)
- ❌ Devices without payment method configured
- ❌ Unsupported browsers
- ❌ Regions where payment methods aren't available

**Result:** No button rendered (silent, no error)

## Security and Compliance

### PCI Compliance

- Payment data handled by payment provider (Apple, Google, PayPal)
- Tokenized payment information only
- No sensitive payment data stored on your servers
- Reduces PCI compliance scope

### HTTPS Requirement

```isml
<!-- Payment buttons only work over HTTPS -->
<isif condition="${request.isHttpsRequest()}">
    <isbuynow payment-request="${paymentRequest}"></isbuynow>
<iselse>
    <!-- Development only - show message -->
    <p>Express checkout requires HTTPS</p>
</isif>
```

## Performance Considerations

- **Asynchronous Loading:** Payment scripts load asynchronously
- **Cached Resources:** Payment provider resources are cached
- **Conditional Rendering:** Buttons only load on supported devices
- **Multiple Instances:** Each instance loads independently

## Troubleshooting

### Button Not Appearing

**Check:**
1. Page served over HTTPS
2. B2C Commerce Payments enabled
3. Payment account configured correctly
4. Viewing on supported device/browser
5. User has payment method set up
6. Template is not cached

### Button Appears But Doesn't Work

**Check:**
1. `SalesforcePaymentRequest` configured correctly
2. `basketData` contains valid product information
3. `options` are properly set
4. Helper function returns valid data
5. No JavaScript errors in console

### Multiple Buttons Not Working

**Check:**
1. Each instance has unique component ID
2. Each instance has unique CSS selector
3. No duplicate IDs on page

### Pricing Issues

**Check:**
1. Template is not cached
2. Current promotions applied correctly
3. Currency conversion is accurate
4. Tax calculation is correct

## Testing

### Test Scenarios

1. **Product Detail Page:** Single product purchase
2. **Product Variations:** Correct variant/size/color selection
3. **Quantity Selection:** Multiple quantity purchase
4. **Promotions:** Discount codes applied correctly
5. **Shipping:** Shipping costs calculated properly
6. **Tax:** Tax calculation accurate for region
7. **Guest Users:** Works for non-logged-in shoppers
8. **Registered Users:** Pre-fills saved addresses

### Device Testing

Test on:
- iPhone with Apple Pay
- iPad with Apple Pay
- Mac with Apple Pay (Touch ID/Apple Watch)
- Android with Google Pay
- Desktop with PayPal

## Related Elements

- `<ispayment>` - Pay for current basket (not specific product)
- `<isapplepay>` - Legacy Apple Pay button (deprecated in favor of Commerce Payments)
- `<isscript>` - Create SalesforcePaymentRequest object

## Notes

- Only works with B2C Commerce Payments
- Cannot be used in cached templates
- Requires HTTPS to function
- Buttons only appear on compatible devices
- Multiple instances allowed on same page
- Must be placed after `</head>` tag
- Must be in valid `<script>` location
- Silent failure if payment method not available
- Processes single product purchase (not cart)
- Different from `<ispayment>` which processes basket

## API References

- `dw.extensions.payments.SalesforcePaymentRequest` - Payment request configuration
- `dw.extensions.payments` - Complete payments API documentation
- Checkout helpers - `calculateBuyNowData` and basket preparation

## Migration Notes

### From Legacy <isapplepay>

```isml
<!-- Legacy: isapplepay element -->
<isapplepay 
  sku="${pdict.Product.ID}" 
  class="dw-apple-pay-logo-black" 
/>

<!-- Modern: isbuynow with Commerce Payments -->
<isscript>
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var buyNowData = COHelpers.calculateBuyNowData(pdict.Product, 1, pdict.Product.price);
    var paymentRequest = new SalesforcePaymentRequest('applepay', '.buy-now-container');
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
    paymentRequest.setBasketData(buyNowData.basketData);
    paymentRequest.setOptions(buyNowData.options);
</isscript>

<div class="buy-now-container">
    <isbuynow payment-request="${paymentRequest}"></isbuynow>
</div>
```