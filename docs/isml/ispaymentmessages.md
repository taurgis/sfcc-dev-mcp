# ISML ispaymentmessages Element

## Overview

The `<ispaymentmessages>` element injects code to display payment-related messages such as callouts to shoppers about payment methods and available credit options. These messages inform shoppers about flexible payment options like "Pay in 4 interest-free payments of $22.50 with Afterpay" for payment methods including PayPal, Afterpay, and Klarna.

**Important:** This element is only used with **Salesforce Payments** (also known as B2C Commerce Payments). An associated payments account must be successfully enabled and the payment method must be configured for use on the storefront site where this element appears.

## Syntax

```isml
<ispaymentmessages
  payment-request = SalesforcePaymentRequest_expression  // required
></ispaymentmessages>
```

## Required Attributes

### payment-request

**Type:** Expression (SalesforcePaymentRequest)  
**Required:** Yes

Specifies a `dw.extensions.payments.SalesforcePaymentRequest` object as part of an expression. This object configures which payment method messages to display and where they should be rendered on the page.

**Object Type:** `dw.extensions.payments.SalesforcePaymentRequest`

**See Also:** [SalesforcePaymentRequest documentation](../dw_extensions.payments/SalesforcePaymentRequest.md)

**Examples:**
```isml
<!-- Basic usage -->
<ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>

<!-- With variable from pdict -->
<ispaymentmessages payment-request="${pdict.messagesPaymentRequest}"></ispaymentmessages>

<!-- From controller-prepared object -->
<ispaymentmessages payment-request="${pdict.paymentMessages}"></ispaymentmessages>
```

## Purpose

The `<ispaymentmessages>` element serves to:

1. **Payment Method Callouts:** Display promotional messages about available payment options
2. **Credit Information:** Show credit options and financing details (installment plans, BNPL)
3. **Buy Now Pay Later (BNPL):** Highlight Afterpay, Klarna, PayPal Pay Later options
4. **Installment Details:** Communicate payment plan breakdowns (e.g., "4 payments of $22.50")
5. **Marketing Messages:** Promote payment flexibility to increase conversion
6. **Dynamic Messaging:** Show messages only for configured and supported payment methods

## Common Payment Method Messages

### Supported Payment Methods

Payment messages are commonly supported by:

- **Afterpay** - "Pay in 4 interest-free payments"
- **Klarna** - "Pay in 4 interest-free installments"
- **PayPal Pay Later** - Various financing and installment options
- **Other BNPL Providers** - As configured in Salesforce Payments

**Example Messages:**
```
"Pay in 4 interest-free payments of $22.50 with Afterpay"
"4 interest-free payments of $25.00 with Klarna"
"Pay Later or Pay in 4 with PayPal"
"Buy now, pay later with 0% APR"
```

## Rules of Use

### Placement Requirements

1. **Valid Script Location:** Must be placed where `<script>` tags are valid
2. **Flexible Positioning:** Can be placed throughout the page body
3. **Product and Cart Pages:** Commonly used on product detail pages and cart pages

```isml
<!DOCTYPE html>
<html>
<head>
    <title>Product Details</title>
</head>
<body>
    <div class="product-details">
        <div class="product-price">$90.00</div>
        
        <!-- Payment messages below price -->
        <div class="payment-messages">
            <ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>
        </div>
    </div>
</body>
</html>
```

### Multiple Instances

**Allowed:** This tag can appear **multiple times** on the same page with **no limit**.

**Use Cases:**
- Render payment messages for individual products on a product listing page
- Show messages on both cart summary and cart items
- Display messages in multiple locations (above and below fold)

```isml
<!-- Product listing page - multiple messages for different products -->
<isloop items="${pdict.products}" var="product">
    <div class="product-tile">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        
        <!-- Payment message for each product -->
        <div class="payment-message-${product.id}">
            <ispaymentmessages payment-request="${product.paymentRequest}"></ispaymentmessages>
        </div>
    </div>
</isloop>
```

### Caching Restrictions

⚠️ **CRITICAL:** This tag **cannot be used in a cached template** because:

- Messages display credit options specific to the current price and currency
- Payment method availability may change based on:
  - Current product price
  - Basket total
  - Customer location
  - Currency
  - Active promotions
  - Payment method eligibility rules

```isml
<!-- Bad: In cached template -->
<iscache type="relative" hour="24"/>
<ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>  <!-- DON'T DO THIS -->

<!-- Good: In non-cached template -->
<ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>

<!-- Good: In remote include from cached template -->
<iscache type="relative" hour="24"/>
<isinclude url="${URLUtils.url('Product-PaymentMessages', 'pid', product.id)}"/>

<!-- Product-PaymentMessages.isml (not cached) -->
<ispaymentmessages payment-request="${pdict.paymentRequest}"></ispaymentmessages>
```

### Conditional Rendering

Payment messages are **only rendered when applicable**:

- ✅ Site is configured to accept payment methods that support messages
- ✅ Payment method supports messaging (Afterpay, Klarna, PayPal Pay Later, etc.)
- ✅ Product price or basket total meets payment method minimum requirements
- ✅ Payment method is available in customer's region
- ✅ Currency is supported by the payment method
- ❌ If payment method doesn't support messages, **nothing is shown** (silent failure)
- ❌ If price is below minimum threshold, **no message is rendered**

## Common Use Cases

### Product Detail Page - Payment Messages

```isml
<!-- product/productDetails.isml -->
<isscript>
    var UUIDUtils = require('dw/util/UUIDUtils');
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    
    // Generate unique ID for this payment message instance
    var uuid = UUIDUtils.createUUID();
    var messagesPaymentRequestId = 'paymentrequest-' + uuid + '-messages';
    var messagesElementClass = 'salesforce-payment-messages-element-' + uuid;
    
    // Create payment request for messages
    var messagesPaymentRequest = new SalesforcePaymentRequest(
        messagesPaymentRequestId,
        '.' + messagesElementClass
    );
</isscript>

<div class="product-details">
    <h1 class="product-name">${pdict.Product.name}</h1>
    
    <div class="product-pricing">
        <span class="price">${pdict.Product.price.sales.formatted}</span>
        
        <!-- Payment messages displayed below price -->
        <div class="${messagesElementClass}">
            <ispaymentmessages payment-request="${messagesPaymentRequest}"></ispaymentmessages>
        </div>
    </div>
    
    <button class="add-to-cart">Add to Cart</button>
</div>
```

### Cart Page - Payment Messages

```isml
<!-- cart/cart.isml -->
<isscript>
    var UUIDUtils = require('dw/util/UUIDUtils');
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    
    var uuid = UUIDUtils.createUUID();
    var messagesPaymentRequestId = 'paymentrequest-' + uuid + '-messages';
    var messagesElementClass = 'salesforce-payment-messages-element-' + uuid;
    
    var messagesPaymentRequest = new SalesforcePaymentRequest(
        messagesPaymentRequestId,
        '.' + messagesElementClass
    );
</isscript>

<div class="cart-summary">
    <div class="cart-total">
        <span class="label">Order Total:</span>
        <span class="value">${pdict.totals.grandTotal}</span>
    </div>
    
    <!-- Payment messages below cart total -->
    <div class="${messagesElementClass}">
        <ispaymentmessages payment-request="${messagesPaymentRequest}"></ispaymentmessages>
    </div>
    
    <button class="checkout-button">Proceed to Checkout</button>
</div>
```

### Product Tile - Multiple Messages

```isml
<!-- product/productTile.isml -->
<isscript>
    var UUIDUtils = require('dw/util/UUIDUtils');
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
</isscript>

<isloop items="${pdict.products}" var="product">
    <isscript>
        // Generate unique ID for each product's payment message
        var uuid = UUIDUtils.createUUID();
        var messageId = 'paymentrequest-' + uuid + '-messages';
        var messageClass = 'salesforce-payment-messages-element-' + uuid;
        
        var paymentRequest = new SalesforcePaymentRequest(messageId, '.' + messageClass);
    </isscript>
    
    <div class="product-tile" data-pid="${product.id}">
        <img src="${product.images.large[0].url}" alt="${product.name}"/>
        <h3 class="product-name">${product.name}</h3>
        
        <div class="product-pricing">
            <span class="price">${product.price.sales.formatted}</span>
            
            <!-- Unique payment message for each product -->
            <div class="${messageClass}">
                <ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>
            </div>
        </div>
    </div>
</isloop>
```

### Advanced - Controller-Based Configuration

```javascript
// Controller: Product-Show.js
'use strict';

var server = require('server');
var UUIDUtils = require('dw/util/UUIDUtils');
var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');

server.get('Show', function (req, res, next) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var productId = req.querystring.pid;
    var product = ProductMgr.getProduct(productId);
    
    // Create payment messages request in controller
    var uuid = UUIDUtils.createUUID();
    var messagesPaymentRequestId = 'paymentrequest-' + uuid + '-messages';
    var messagesElementClass = 'salesforce-payment-messages-element-' + uuid;
    
    var messagesPaymentRequest = new SalesforcePaymentRequest(
        messagesPaymentRequestId,
        '.' + messagesElementClass
    );
    
    // Configure additional options if needed
    messagesPaymentRequest.setOptions({
        amount: product.getPriceModel().getPrice().getValue(),
        currency: session.getCurrency().getCurrencyCode()
    });
    
    res.render('product/productDetails', {
        product: product,
        messagesPaymentRequest: messagesPaymentRequest,
        messagesElementClass: messagesElementClass
    });
    
    next();
});

module.exports = server.exports();
```

```isml
<!-- Template: product/productDetails.isml -->
<div class="product-pricing">
    <span class="price">${pdict.product.price.sales.formatted}</span>
    
    <div class="${pdict.messagesElementClass}">
        <ispaymentmessages payment-request="${pdict.messagesPaymentRequest}"></ispaymentmessages>
    </div>
</div>
```

## Generated HTML Structure

### Component ID and CSS Class

The `<ispaymentmessages>` element generates:

- **Component ID:** `paymentrequest-<UUID>-messages`
- **CSS Class:** `salesforce-payment-messages-element-<UUID>`

Where `<UUID>` is a randomly generated unique identifier.

**Example Generated Output:**
```html
<div class="salesforce-payment-messages-element-a1b2c3d4-e5f6-7890-abcd-ef1234567890">
    <script>
        // Injected payment messages script
    </script>
    <div class="afterpay-message">
        Pay in 4 interest-free payments of $22.50 with Afterpay
    </div>
</div>
```

## Best Practices

### 1. Always Use UUID for Unique Instances

Generate unique IDs for each `<ispaymentmessages>` instance to avoid conflicts:

```isml
<!-- Good: Unique UUID for each instance -->
<isscript>
    var UUIDUtils = require('dw/util/UUIDUtils');
    var uuid = UUIDUtils.createUUID();
    var messageId = 'paymentrequest-' + uuid + '-messages';
    var messageClass = 'salesforce-payment-messages-element-' + uuid;
</isscript>

<!-- Avoid: Reusing same ID -->
<isscript>
    var messageId = 'payment-messages';  // Don't reuse for multiple instances
    var messageClass = 'payment-messages-element';
</isscript>
```

### 2. Position Near Price Information

Display payment messages close to pricing for maximum impact:

```isml
<div class="product-pricing">
    <!-- Price first -->
    <span class="price">${product.price}</span>
    
    <!-- Payment message immediately after -->
    <div class="payment-messages">
        <ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>
    </div>
</div>
```

### 3. Provide Styling for Payment Messages

Add CSS to ensure payment messages are visually appealing:

```html
<style>
.salesforce-payment-messages-element {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #333;
}

.salesforce-payment-messages-element img {
    max-height: 20px;
    vertical-align: middle;
    margin-right: 0.25rem;
}

/* Specific payment method styling */
.afterpay-message,
.klarna-message,
.paypal-message {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background: #f9f9f9;
    border-radius: 4px;
}
</style>
```

### 4. Controller vs Template Logic

**Recommended:** Create the `SalesforcePaymentRequest` object in your **controller** for complex configurations:

```javascript
// Controller: Product.js
var messagesPaymentRequest = new SalesforcePaymentRequest(messageId, '.' + messageClass);
messagesPaymentRequest.setOptions({
    amount: product.price.value,
    currency: currentCurrency,
    locale: currentLocale
});

res.render('product/details', {
    messagesPaymentRequest: messagesPaymentRequest,
    messagesElementClass: messageClass
});
```

**Alternative:** Use `<isscript>` in templates for simpler cases (as shown in examples above).

### 5. Responsive Design Considerations

Ensure payment messages display well on all devices:

```html
<style>
@media (max-width: 768px) {
    .salesforce-payment-messages-element {
        font-size: 0.75rem;
    }
    
    .payment-message-container {
        max-width: 100%;
        overflow-wrap: break-word;
    }
}
</style>
```

### 6. Accessibility

Provide appropriate ARIA labels for assistive technologies:

```isml
<div class="${messagesElementClass}" 
     role="region" 
     aria-label="Payment financing options">
    <ispaymentmessages payment-request="${messagesPaymentRequest}"></ispaymentmessages>
</div>
```

## Integration with dw.extensions.payments

The `<ispaymentmessages>` element works in conjunction with the `dw.extensions.payments` API to configure and render payment method messages. For complete documentation on:

- Configuring payment method messages
- Understanding how messages are rendered
- Payment request options and customization
- Supported payment methods
- Message customization and localization

See the [dw.extensions.payments documentation](../dw_extensions.payments/).

## Common Errors and Troubleshooting

### Payment Messages Not Rendering

**Symptom:** No payment messages appear on the page.

**Possible Causes:**
1. **Payment Method Not Configured:** Payment methods that support messages aren't configured in Salesforce Payments
2. **Price Below Minimum:** Product price or basket total is below the minimum threshold for the payment method
3. **Invalid CSS Selector:** The CSS class selector doesn't match any element on the page
4. **Currency Not Supported:** Payment method doesn't support the current currency
5. **Template Caching:** Element is being used in a cached template (not allowed)
6. **Missing UUID Import:** `dw/util/UUIDUtils` not imported

**Solutions:**
```isml
<!-- Verify CSS selector matches element -->
<isscript>
    var UUIDUtils = require('dw/util/UUIDUtils');  // Don't forget to import
    var uuid = UUIDUtils.createUUID();
    var messageClass = 'salesforce-payment-messages-element-' + uuid;
    
    var paymentRequest = new SalesforcePaymentRequest(
        'paymentrequest-' + uuid + '-messages',
        '.' + messageClass  // Must match actual class below
    );
</isscript>

<div class="${messageClass}">  <!-- Class must match selector -->
    <ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>
</div>

<!-- Check price threshold -->
<isif condition="${product.price.value >= 30}">  <!-- Example: Afterpay minimum $30 -->
    <ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>
<iselse>
    <p class="payment-info">Additional payment options available at checkout</p>
</isif>
```

### Duplicate IDs or Class Name Conflicts

**Symptom:** Messages appear in wrong location or multiple times.

**Cause:** Reusing the same ID or class name for multiple instances.

**Solution:** Always generate unique UUIDs:

```isml
<!-- Bad: Same ID used in loop -->
<isloop items="${products}" var="product">
    <isscript>
        var messageId = 'payment-messages';  // Same ID every iteration!
        var messageClass = 'payment-element';
    </isscript>
</isloop>

<!-- Good: Unique UUID each iteration -->
<isloop items="${products}" var="product">
    <isscript>
        var UUIDUtils = require('dw/util/UUIDUtils');
        var uuid = UUIDUtils.createUUID();  // Unique each time
        var messageId = 'paymentrequest-' + uuid + '-messages';
        var messageClass = 'salesforce-payment-messages-element-' + uuid;
    </isscript>
</isloop>
```

### Messages Display Incorrect Amount

**Symptom:** Payment message shows wrong installment amount.

**Cause:** Price data not synchronized with payment request.

**Solution:** Ensure payment request has current price information:

```isml
<isscript>
    var UUIDUtils = require('dw/util/UUIDUtils');
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    
    var uuid = UUIDUtils.createUUID();
    var paymentRequest = new SalesforcePaymentRequest(
        'paymentrequest-' + uuid + '-messages',
        '.salesforce-payment-messages-element-' + uuid
    );
    
    // Set current price explicitly
    paymentRequest.setOptions({
        amount: pdict.Product.price.sales.value,
        currency: pdict.currentCurrency.currencyCode
    });
</isscript>
```

## Performance Considerations

### 1. Minimize Script Injection

Only include payment messages where they add value:

```isml
<!-- Good: Only on product pages with eligible prices -->
<isif condition="${pdict.Product && pdict.Product.price.value >= 30}">
    <ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>
</isif>

<!-- Avoid: On every page regardless of context -->
<ispaymentmessages payment-request="${paymentRequest}"></ispaymentmessages>
```

### 2. Lazy Loading for Below-Fold Content

Consider lazy loading payment messages that appear below the fold:

```html
<div class="payment-messages-container" data-lazy-load="true">
    <!-- Load via JavaScript when scrolled into view -->
</div>
```

### 3. Remote Include for Caching Optimization

Use remote includes for partially cached pages:

```isml
<!-- Cached product page -->
<iscache type="relative" hour="24"/>

<div class="product-details">
    <!-- Static content cached -->
    <h1>${pdict.Product.name}</h1>
    
    <!-- Dynamic payment messages via remote include (not cached) -->
    <isinclude url="${URLUtils.url('Product-PaymentMessages', 'pid', pdict.Product.id)}"/>
</div>
```

## Comparison with Related Elements

### ispaymentmessages vs ispayment vs isbuynow

| Element | Purpose | Typical Location | Message Type |
|---------|---------|------------------|--------------|
| `<ispaymentmessages>` | Display payment **messages/callouts** | Product pages, cart pages | Informational (BNPL, installments) |
| `<ispayment>` | Render payment **methods** for basket | Checkout payment step | Interactive (payment forms) |
| `<isbuynow>` | Render express **checkout buttons** | Product pages | Interactive (buy now buttons) |

```isml
<!-- Product Page: Messages -->
<ispaymentmessages payment-request="${messagesRequest}"></ispaymentmessages>
<!-- Output: "Pay in 4 with Afterpay" (informational) -->

<!-- Product Page: Buy Now Buttons -->
<isbuynow payment-request="${buyNowRequest}"></isbuynow>
<!-- Output: Apple Pay button (interactive) -->

<!-- Checkout Page: Payment Methods -->
<ispayment payment-request="${checkoutRequest}"></ispayment>
<!-- Output: Card payment form (interactive) -->
```

## Related Elements

- **`<ispayment>`** - Render payment methods for current basket
- **`<isbuynow>`** - Render express checkout buttons for direct product purchase
- **`<isinclude>`** - Include templates (can be used with remote includes for caching workaround)
- **`<isscript>`** - Execute script code to create SalesforcePaymentRequest objects
- **`<iscache>`** - Control template caching (incompatible with `<ispaymentmessages>`)

## Related APIs

- **`dw.extensions.payments.SalesforcePaymentRequest`** - Payment request object class
- **`dw.util.UUIDUtils`** - UUID generation for unique component IDs
- **`dw.catalog.ProductMgr`** - Product management for pricing information
- **`dw.order.BasketMgr`** - Basket management for cart total messaging

## See Also

- [dw.extensions.payments Package Documentation](../dw_extensions.payments/)
- [SalesforcePaymentRequest Class](../dw_extensions.payments/SalesforcePaymentRequest.md)
- [UUIDUtils Class](../dw_util/UUIDUtils.md)
- [ispayment Element](ispayment.md)
- [isbuynow Element](isbuynow.md)
- [B2C Commerce Payments Configuration Guide](https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/SFCC_Dev_Guide/B2C_Commerce_Payments.html)
