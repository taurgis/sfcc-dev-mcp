# SFRA Cart Model

## Overview

The Cart model represents the current customer's shopping basket in SFRA applications. It provides comprehensive cart functionality including product line items, shipping methods, totals, discounts, and cart actions.

## Constructor

```javascript
function CartModel(basket)
```

Creates a Cart model instance from a basket object.

### Parameters

- `basket` (dw.order.Basket) - Current user's basket

## Properties

### items
**Type:** Array<Object>

Array of product line items in the cart. Each item contains product information, quantity, pricing, and other details.

### numItems
**Type:** number

Total number of items (quantity) in the cart.

### totals
**Type:** TotalsModel

Totals model containing cart pricing information including subtotals, taxes, shipping costs, and grand total.

### shipments
**Type:** Array<Object>

Array of shipment objects, each containing:
- `shippingMethods` - Available shipping methods for the shipment
- `selectedShippingMethod` - ID of the currently selected shipping method

### numOfShipments
**Type:** number

Number of shipments in the cart.

### hasBonusProduct
**Type:** boolean

Indicates whether the cart contains any bonus products from promotions.

### actionUrls
**Type:** Object

Object containing URLs for cart actions:
- `removeProductLineItemUrl` - URL to remove product line items
- `updateQuantityUrl` - URL to update item quantities
- `selectShippingUrl` - URL to select shipping methods
- `submitCouponCodeUrl` - URL to add coupon codes
- `removeCouponLineItem` - URL to remove coupon line items

### approachingDiscounts
**Type:** Array<Object>

Array of approaching discount objects, each containing:
- `discountMsg` - Message describing the approaching discount

### valid
**Type:** boolean

Indicates whether the basket is valid based on validation hooks.

### resources
**Type:** Object

Object containing localized resource strings:
- `numberOfItems` - Formatted message showing number of items in cart
- `minicartCountOfItems` - Formatted message for minicart count
- `emptyCartMsg` - Message displayed when cart is empty

## Helper Functions

### getApproachingDiscounts(basket, discountPlan)
Generates an object of approaching discounts based on current basket and discount plan.

**Parameters:**
- `basket` (dw.order.Basket) - Current user's basket
- `discountPlan` (dw.campaign.DiscountPlan) - Set of applicable discounts

**Returns:** Object - Object containing approaching discount information

### getCartActionUrls()
Generates an object of URLs used for cart actions.

**Returns:** Object - Object containing cart action URLs in string format

## Usage Example

```javascript
var CartModel = require('*/cartridge/models/cart');
var BasketMgr = require('dw/order/BasketMgr');

var currentBasket = BasketMgr.getCurrentBasket();
var cart = new CartModel(currentBasket);

// Access cart properties
console.log(cart.numItems);
console.log(cart.totals.grandTotal);
console.log(cart.actionUrls.updateQuantityUrl);

// Check if cart has items
if (cart.items && cart.items.length > 0) {
    // Process cart items
    cart.items.forEach(function(item) {
        console.log(item.productName);
    });
}
```

## Notes

- If basket is null, the cart will have empty items array and numItems of 0
- The model automatically calculates shipping methods for each shipment
- Bonus products from promotions are tracked separately
- Cart validation is performed using hooks
- All action URLs are generated dynamically using URLUtils

## Related Models

- **TotalsModel** - Used for cart pricing calculations
- **ProductLineItemsModel** - Used for product line item formatting
- **Shipping Models** - Used for shipping method information
- **Address Model** - Used for shipping addresses
