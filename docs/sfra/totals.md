# SFRA Totals Model

## Overview

The Totals model represents comprehensive pricing and discount information for a basket or order in SFRA applications. It provides formatted monetary values, discount calculations, and tax information for checkout and order display.

## Constructor

```javascript
function totals(lineItemContainer)
```

Creates a Totals model instance with comprehensive pricing information from a line item container.

### Parameters

- `lineItemContainer` (dw.order.LineItemCtnr) - Current user's basket or order

## Properties

### subTotal
**Type:** string

Formatted subtotal of merchandise before taxes and shipping.

### totalShippingCost
**Type:** string

Formatted total shipping cost.

### grandTotal
**Type:** string

Formatted grand total including all items, taxes, shipping, and discounts.

### totalTax
**Type:** string

Formatted total tax amount.

### discounts
**Type:** Array<Object>

Array of discount objects including promotions and coupons. Each discount contains:

**For Promotions:**
- `UUID` (string) - Unique identifier
- `lineItemText` (string) - Display text for the discount
- `price` (string) - Formatted discount amount
- `type` (string) - Always 'promotion'
- `callOutMsg` (string) - Promotion callout message

**For Coupons:**
- `UUID` (string) - Unique identifier  
- `type` (string) - Always 'coupon'
- `couponCode` (string) - The coupon code
- `applied` (boolean) - Whether the coupon is applied
- `valid` (boolean) - Whether the coupon is valid
- `relationship` (Array) - Array of related price adjustments with callout messages

### discountsHtml
**Type:** string

HTML-formatted string of all discounts for display purposes.

### orderLevelDiscountTotal
**Type:** Object

Order-level discount information containing:
- `value` (number) - Raw discount value
- `formatted` (string) - Formatted discount amount

### shippingLevelDiscountTotal
**Type:** Object

Shipping-level discount information containing:
- `value` (number) - Raw discount value
- `formatted` (string) - Formatted discount amount

## Helper Functions

### getTotals(total)
Formats a money total for display, handling unavailable totals.

**Parameters:**
- `total` (dw.value.Money) - Total price value

**Returns:** string - Formatted money value or '-' if unavailable

### getOrderLevelDiscountTotal(lineItemContainer)
Calculates order-level discount by comparing totals with and without order discounts.

**Parameters:**
- `lineItemContainer` (dw.order.LineItemCtnr) - Basket or order container

**Returns:** Object - Order discount value and formatted amount

### getShippingLevelDiscountTotal(lineItemContainer)
Calculates shipping-level discount by comparing shipping totals.

**Parameters:**
- `lineItemContainer` (dw.order.LineItemCtnr) - Basket or order container

**Returns:** Object - Shipping discount value and formatted amount

### createDiscountObject(collection, discounts)
Adds promotion discounts to a discounts object.

**Parameters:**
- `collection` (dw.util.Collection) - Collection of price adjustments
- `discounts` (Object) - Existing discounts object

**Returns:** Object - Updated discounts object

### getDiscounts(lineItemContainer)
Creates a comprehensive array of all discounts including promotions and coupons.

**Parameters:**
- `lineItemContainer` (dw.order.LineItemCtnr) - Basket or order container

**Returns:** Array<Object> - Array of discount objects

## Usage Example

```javascript
var totals = require('*/cartridge/models/totals');
var BasketMgr = require('dw/order/BasketMgr');

var currentBasket = BasketMgr.getCurrentBasket();
var totalsModel = new totals(currentBasket);

// Access formatted totals
console.log(totalsModel.subTotal);        // "$149.99"
console.log(totalsModel.totalShippingCost); // "$9.95"
console.log(totalsModel.grandTotal);      // "$159.94"
console.log(totalsModel.totalTax);        // "$12.00"

// Access discount information
totalsModel.discounts.forEach(function(discount) {
    if (discount.type === 'promotion') {
        console.log('Promotion: ' + discount.lineItemText + ' - ' + discount.price);
    } else if (discount.type === 'coupon') {
        console.log('Coupon: ' + discount.couponCode + ' (applied: ' + discount.applied + ')');
    }
});

// Check for order-level discounts
if (totalsModel.orderLevelDiscountTotal.value > 0) {
    console.log('Order discount: ' + totalsModel.orderLevelDiscountTotal.formatted);
}
```

## Discount Types

The model handles different types of discounts:

### Promotions
- Automatic promotional discounts
- Include callout messages for display
- Based on business rules and conditions

### Coupons
- Customer-entered coupon codes
- Include the coupon code for reference
- May have usage restrictions

## HTML Formatting

The `discountsHtml` property provides ready-to-use HTML formatting for discount display, using templates to ensure consistent presentation across the application.

## Notes

- All monetary values are properly formatted for display
- Handles unavailable totals gracefully with fallback formatting
- Separates order-level and shipping-level discounts
- Provides both individual discount details and aggregate totals
- Compatible with both baskets and completed orders
- Includes comprehensive tax calculation information

## Related Models

- **Cart Model** - Uses totals for cart display
- **Order Model** - Uses totals for order information
- **Checkout Models** - Use totals throughout checkout process
