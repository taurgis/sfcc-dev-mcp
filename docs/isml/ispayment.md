# ISML ispayment Element

## Overview

The `<ispayment>` element injects code to render payment methods or express checkout buttons that enable shoppers to pay for their current basket. This element is specifically designed for **B2C Commerce Payments** and provides a comprehensive payment experience during the checkout process.

**Important:** This element is only used with B2C Commerce Payments. An associated payments account must be successfully enabled and configured for use on the storefront site where this element appears.

**Note:** To render express checkout buttons that let a shopper buy a specific product directly, see `<isbuynow>`.

## Syntax

```isml
<ispayment
  payment-request = SalesforcePaymentRequest_expression  // required
></ispayment>
```

## Required Attributes

### payment-request

**Type:** Expression (SalesforcePaymentRequest)  
**Required:** Yes

Specifies a `dw.extensions.payments.SalesforcePaymentRequest` object as part of an expression. This object configures which payment methods and express checkout buttons to render, how they appear, and what basket/payment data they should process.

**Object Type:** `dw.extensions.payments.SalesforcePaymentRequest`

**See Also:** [SalesforcePaymentRequest documentation](../dw_extensions.payments/SalesforcePaymentRequest.md)

**Examples:**
```isml
<!-- Basic usage -->
<ispayment payment-request="${paymentRequest}"></ispayment>

<!-- With variable from pdict -->
<ispayment payment-request="${pdict.basketPaymentRequest}"></ispayment>

<!-- From controller-prepared object -->
<ispayment payment-request="${pdict.checkoutPayment}"></ispayment>
```

## Purpose

The `<ispayment>` element serves to:

1. **Payment Method Rendering:** Inject `<script>` code to display available payment methods for the current basket
2. **Express Checkout Buttons:** Display express checkout options (Apple Pay, Google Pay, PayPal, etc.)
3. **Basket Payment Processing:** Enable shoppers to complete payment for their current basket
4. **Configured Payment Options:** Render only applicable payment methods based on basket currency and shopper configuration
5. **Checkout Flow Integration:** Provide payment UI for the payment step of checkout

## Difference from isbuynow

| Element | Purpose | Use Case |
|---------|---------|----------|
| `<ispayment>` | Pay for **current basket** | Cart page, checkout page |
| `<isbuynow>` | Buy a **specific product** directly | Product detail pages, quick buy buttons |

```isml
<!-- Pay for current basket -->
<ispayment payment-request="${basketPaymentRequest}"></ispayment>

<!-- Buy this specific product now -->
<isbuynow payment-request="${productPaymentRequest}"></isbuynow>
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
    <title>Checkout - Payment</title>
</head>
<!-- After closing </head> tag -->
<body>
    <div class="checkout-container">
        <div class="payment-section">
            <!-- Valid: Inside body -->
            <ispayment payment-request="${paymentRequest}"></ispayment>
        </div>
    </div>
</body>
</html>
```

### Multiple Instances

**Allowed:** This tag can appear **multiple times** on the same page with **no limit**.

**Typical Usage:** When used to render payment methods for the payment step of a checkout page, it typically appears **once**. However, it can appear multiple times if you need to render payment options in different sections or with different configurations.

```isml
<!-- Common: Single instance for checkout payment step -->
<div class="payment-methods">
    <ispayment payment-request="${paymentRequest}"></ispayment>
</div>

<!-- Less common: Multiple instances with different configurations -->
<div class="express-checkout">
    <ispayment payment-request="${expressPaymentRequest}"></ispayment>
</div>

<div class="standard-payment">
    <ispayment payment-request="${standardPaymentRequest}"></ispayment>
</div>
```

### Caching Restrictions

⚠️ **CRITICAL:** This tag **cannot be used in a cached template** because:

- It processes payment for the current basket with dynamic pricing
- Basket data includes amounts that depend on runtime variables:
  - Currency
  - Current prices
  - Active promotions
  - Applicable shipping methods
  - Tax calculations
  - Customer-specific discounts
  - Basket totals

**Workaround:** You can use this element in a **remote included template** referenced by a cached template, similar to how a minicart is implemented.

```isml
<!-- Bad: In cached template -->
<iscache type="relative" hour="24"/>
<ispayment payment-request="${paymentRequest}"></ispayment>  <!-- DON'T DO THIS -->

<!-- Good: In non-cached template -->
<ispayment payment-request="${paymentRequest}"></ispayment>

<!-- Good: In remote include from cached template -->
<iscache type="relative" hour="24"/>
<isinclude url="${URLUtils.url('Checkout-PaymentMethods')}"/>

<!-- Checkout-PaymentMethods.isml (not cached) -->
<ispayment payment-request="${pdict.paymentRequest}"></ispayment>
```

### Conditional Rendering

Payment methods and express checkout buttons are **only rendered when applicable**:

#### Payment Methods
- ✅ Payment method supports the basket currency
- ✅ Payment method is configured for the site
- ✅ Payment method is available in shopper's region
- ❌ If basket currency is not supported, payment method is **not presented**

#### Express Checkout Buttons
- ✅ Shopper uses a supported device (iPhone, iPad, Mac, Android)
- ✅ Shopper uses a supported operating system (iOS, macOS, Android)
- ✅ Shopper has configured their device for express checkout (Apple Pay, Google Pay set up)
- ✅ Express checkout method is available in shopper's region
- ❌ If conditions aren't met, **no button is presented** (silent failure)

## Common Use Cases

### Checkout Payment Step - All Payment Methods

```isml
<!-- checkout/billing.isml -->
<isscript>
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    
    // Create payment request with component ID and CSS class selector
    var paymentRequest = new SalesforcePaymentRequest(
        'payment',              // Component ID
        '.payment-element'      // CSS class selector where component renders
    );
</isscript>

<div class="payment-section">
    <h2>Payment Information</h2>
    
    <div class="payment-element">
        <!-- Renders all configured payment methods and express checkout buttons -->
        <ispayment payment-request="${paymentRequest}"></ispayment>
    </div>
</div>
```

### Checkout Payment Step - With Controller Logic

```isml
<!-- checkout/billing.isml -->
<!-- Payment request object created in controller and passed via pdict -->

<div class="checkout-step payment-step">
    <div class="step-header">
        <h2 class="step-title">Payment</h2>
    </div>
    
    <div class="step-content">
        <div id="payment-methods" class="payment-methods-container">
            <ispayment payment-request="${pdict.paymentRequest}"></ispayment>
        </div>
    </div>
</div>
```

### Cart Page - Express Checkout

```isml
<!-- cart/cart.isml -->
<isscript>
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    
    var paymentRequest = new SalesforcePaymentRequest(
        'cart-express-checkout',
        '.cart-express-buttons'
    );
    
    // Configure to show only express checkout buttons (no standard payment methods)
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_GOOGLEPAY);
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_PAYPAL);
</isscript>

<div class="cart-summary">
    <div class="cart-total">
        <span>Total:</span>
        <span class="total-amount">${pdict.totals.grandTotal}</span>
    </div>
    
    <!-- Express checkout buttons -->
    <div class="cart-express-buttons">
        <ispayment payment-request="${paymentRequest}"></ispayment>
    </div>
    
    <button type="submit" class="checkout-button">Proceed to Checkout</button>
</div>
```

### Advanced - Custom Configuration with Options

```isml
<isscript>
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    var BasketMgr = require('dw/order/BasketMgr');
    
    var currentBasket = BasketMgr.getCurrentBasket();
    
    // Create payment request
    var paymentRequest = new SalesforcePaymentRequest(
        'payment-methods',
        '.payment-container'
    );
    
    // Configure specific payment methods
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY);
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_GOOGLEPAY);
    paymentRequest.addInclude(SalesforcePaymentRequest.ELEMENT_TYPE_CARD);
    
    // Set basket data
    var basketData = {
        currencyCode: currentBasket.getCurrencyCode(),
        total: currentBasket.getTotalGrossPrice().getValue(),
        items: currentBasket.getAllProductLineItems().toArray().map(function(item) {
            return {
                label: item.getProductName(),
                amount: item.getAdjustedPrice().getValue()
            };
        })
    };
    paymentRequest.setBasketData(basketData);
    
    // Set additional options
    var options = {
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#0066cc'
            }
        }
    };
    paymentRequest.setOptions(options);
</isscript>

<div class="payment-container">
    <ispayment payment-request="${paymentRequest}"></ispayment>
</div>
```

## Best Practices

### 1. Component ID and CSS Class Naming

Use descriptive, semantic IDs and class names that reflect the purpose and location:

```isml
<!-- Good: Descriptive names -->
<isscript>
    var paymentRequest = new SalesforcePaymentRequest(
        'checkout-payment',           // Clear component ID
        '.checkout-payment-methods'   // Semantic CSS class
    );
</isscript>

<!-- Avoid: Generic names -->
<isscript>
    var paymentRequest = new SalesforcePaymentRequest(
        'payment',      // Too generic
        '.payment'      // Too generic
    );
</isscript>
```

### 2. Controller vs Template Logic

**Recommended:** Create the `SalesforcePaymentRequest` object in your **controller** and pass it via `pdict`:

```javascript
// Controller: Checkout.js
function showBilling() {
    var SalesforcePaymentRequest = require('dw/extensions/payments/SalesforcePaymentRequest');
    var BasketMgr = require('dw/order/BasketMgr');
    
    var currentBasket = BasketMgr.getCurrentBasket();
    var paymentRequest = new SalesforcePaymentRequest('payment', '.payment-element');
    
    // Configure payment request...
    
    res.render('checkout/billing', {
        basket: currentBasket,
        paymentRequest: paymentRequest
    });
}
```

```isml
<!-- Template: checkout/billing.isml -->
<div class="payment-element">
    <ispayment payment-request="${pdict.paymentRequest}"></ispayment>
</div>
```

**Alternative:** Use `<isscript>` in templates for simpler cases (as shown in examples above).

### 3. Error Handling and Fallbacks

Always provide fallback content for cases where payment methods cannot be rendered:

```isml
<div class="payment-section">
    <div class="payment-element">
        <ispayment payment-request="${paymentRequest}"></ispayment>
    </div>
    
    <noscript>
        <p class="error-message">
            JavaScript is required to process payments. 
            Please enable JavaScript to continue.
        </p>
    </noscript>
</div>
```

### 4. CSS Styling Preparation

Ensure the CSS class selector exists and has appropriate styling before the element renders:

```html
<style>
.payment-element {
    min-height: 200px;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 4px;
}

.payment-element:empty::before {
    content: 'Loading payment methods...';
    color: #666;
}
</style>

<div class="payment-element">
    <ispayment payment-request="${paymentRequest}"></ispayment>
</div>
```

### 5. Accessibility Considerations

Provide appropriate ARIA labels and semantic HTML:

```isml
<div class="payment-section" role="region" aria-label="Payment Methods">
    <h2 id="payment-heading">Choose Payment Method</h2>
    
    <div class="payment-element" 
         role="form" 
         aria-labelledby="payment-heading">
        <ispayment payment-request="${paymentRequest}"></ispayment>
    </div>
</div>
```

## Integration with dw.extensions.payments

The `<ispayment>` element works in conjunction with the `dw.extensions.payments` API to configure and render payment methods. For complete documentation on:

- Configuring payment methods
- Understanding how payment methods are rendered
- Payment request options and customization
- Basket data structure
- Payment method types and constants
- Event handling and callbacks

See the [dw.extensions.payments documentation](../dw_extensions.payments/).

## Common Errors and Troubleshooting

### Payment Methods Not Rendering

**Symptom:** No payment methods appear on the page.

**Possible Causes:**
1. **Missing B2C Commerce Payments Configuration:** Ensure payments account is enabled and configured for the site
2. **Currency Not Supported:** Payment method doesn't support the basket currency
3. **Invalid CSS Selector:** The CSS class selector doesn't match any element on the page
4. **JavaScript Errors:** Check browser console for errors preventing script execution
5. **Template Caching:** Element is being used in a cached template (not allowed)

**Solutions:**
```isml
<!-- Verify CSS selector matches element -->
<isscript>
    var paymentRequest = new SalesforcePaymentRequest(
        'payment',
        '.payment-element'  // Must match actual class below
    );
</isscript>

<div class="payment-element">  <!-- Class must match selector -->
    <ispayment payment-request="${paymentRequest}"></ispayment>
</div>

<!-- Check basket currency support -->
<isif condition="${currentBasket && currentBasket.currencyCode}">
    <ispayment payment-request="${paymentRequest}"></ispayment>
<iselse>
    <p class="error">Unable to determine basket currency.</p>
</isif>
```

### Express Checkout Buttons Not Showing

**Symptom:** Express checkout buttons (Apple Pay, Google Pay) don't appear.

**Possible Causes:**
1. **Device Not Supported:** Shopper is not using a supported device or OS
2. **Payment Method Not Configured:** Shopper hasn't set up Apple Pay/Google Pay on their device
3. **Region Restrictions:** Express checkout not available in shopper's region
4. **Browser Compatibility:** Browser doesn't support the payment method

**Expected Behavior:** This is normal. Express checkout buttons are only rendered when applicable for the shopper. No error is shown.

### Template Rendering Before Payment Script

**Symptom:** Payment element container appears before payment methods are injected.

**Solution:** Add loading state styling:

```html
<style>
.payment-element {
    min-height: 150px;
    position: relative;
}

.payment-element:empty {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
```

## Security Considerations

### 1. HTTPS Required

Payment processing **requires HTTPS**. Ensure your site is configured with a valid SSL certificate.

### 2. PCI Compliance

When using `<ispayment>`, payment data is handled by B2C Commerce Payments, which manages PCI compliance. However:

- Never log or store raw payment card data
- Don't modify payment request data in client-side JavaScript
- Follow B2C Commerce security best practices

### 3. Cross-Site Scripting (XSS) Protection

Never inject user-provided data directly into payment request configuration:

```isml
<!-- Bad: Potential XSS -->
<isscript>
    var componentId = request.httpParameterMap.get('componentId').stringValue;
    var paymentRequest = new SalesforcePaymentRequest(componentId, '.payment');
</isscript>

<!-- Good: Use fixed, controlled values -->
<isscript>
    var paymentRequest = new SalesforcePaymentRequest('payment', '.payment-element');
</isscript>
```

## Performance Considerations

### 1. Script Injection Impact

The `<ispayment>` element injects `<script>` tags. To minimize performance impact:

- Place the element where it's needed (don't include on non-payment pages)
- Ensure CSS class selector is efficient and specific
- Load payment methods only when the payment step is active

### 2. Lazy Loading for Multi-Step Checkout

```isml
<isif condition="${pdict.currentStep === 'payment'}">
    <div class="payment-element">
        <ispayment payment-request="${paymentRequest}"></ispayment>
    </div>
</isif>
```

### 3. Remote Include for Caching

For pages with partial caching, use remote includes:

```isml
<!-- Cached page -->
<iscache type="relative" hour="24"/>

<div class="checkout-container">
    <!-- Remote include for dynamic payment section (not cached) -->
    <isinclude url="${URLUtils.url('Checkout-PaymentSection')}"/>
</div>
```

## Related Elements

- **`<isbuynow>`** - Render express checkout buttons for direct product purchase
- **`<isinclude>`** - Include templates (can be used with remote includes for caching workaround)
- **`<isscript>`** - Execute script code to create SalesforcePaymentRequest objects
- **`<iscache>`** - Control template caching (incompatible with `<ispayment>`)

## Related APIs

- **`dw.extensions.payments.SalesforcePaymentRequest`** - Payment request object class
- **`dw.order.BasketMgr`** - Basket management for payment processing
- **`dw.web.URLUtils`** - URL construction for remote includes

## See Also

- [dw.extensions.payments Package Documentation](../dw_extensions.payments/)
- [SalesforcePaymentRequest Class](../dw_extensions.payments/SalesforcePaymentRequest.md)
- [isbuynow Element](isbuynow.md)
- [B2C Commerce Payments Configuration Guide](https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/SFCC_Dev_Guide/B2C_Commerce_Payments.html)
