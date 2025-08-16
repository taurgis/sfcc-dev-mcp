# SFRA Order Model

## Overview

The Order model represents an order or basket in SFRA applications, providing comprehensive order information including line items, totals, billing, shipping, and checkout step status. It's used for order confirmation pages, order history, and checkout processes.

## Constructor

```javascript
function OrderModel(lineItemContainer, options)
```

Creates an Order model instance from a line item container (order or basket).

### Parameters

- `lineItemContainer` (dw.order.LineItemCtnr) - Order or basket object
- `options` (Object) - Configuration options including:
  - `numberOfLineItems` (string|number) - Number of line items to include (default: '*' for all)

## Properties

### orderNumber
**Type:** string

The order number for completed orders.

### items
**Type:** ProductLineItemsModel

Product line items model containing all order items with detailed product information.

### totals
**Type:** TotalsModel

Order totals including subtotals, taxes, shipping costs, and grand total.

### billing
**Type:** BillingModel

Billing information including billing address and payment methods.

### shipping
**Type:** Array<Object>

Array of shipping models containing shipping address and method information for each shipment.

### orderEmail
**Type:** string

Customer email address associated with the order.

### phone
**Type:** string

Customer phone number from the order.

### creationDate
**Type:** Date

Date when the order was created.

### orderStatus
**Type:** Object

Order status information including current status and display values.

### shippable
**Type:** boolean

Indicates whether the order contains shippable items.

### taxTotal
**Type:** string

Formatted tax total amount.

### merchandizeTotalExclOrderDiscounts
**Type:** string

Formatted merchandise total excluding order-level discounts.

### orderDiscountTotal
**Type:** string

Formatted total of order-level discounts.

### shippingTotalCost
**Type:** string

Formatted shipping cost total.

### orderPromoTotal
**Type:** string

Formatted total of order-level promotions.

### resources
**Type:** Object

Localized resource strings for UI display including labels and messages.

### firstLineItem
**Type:** Object

First product line item image information for order thumbnails:
- `imageURL` - URL of the product image
- `alt` - Alt text for the image
- `title` - Title for the image

### checkoutStep
**Type:** Object

Checkout step completion status:
- `shipping` - Object with `iscompleted` boolean
- `billing` - Object with `iscompleted` boolean

## Helper Functions

### getCheckoutStepInformation(lineItemContainer)
Creates checkout step completion information.

**Parameters:**
- `lineItemContainer` (dw.order.LineItemCtnr) - Order or basket container

**Returns:** Object - Checkout step status information

### getFirstProductLineItem(productLineItemsModel)
Returns image information for the first product line item.

**Parameters:**
- `productLineItemsModel` (Object) - Product line items model

**Returns:** Object | null - First item image information or null

### getAssociatedAddress(basket, customer)
Returns the matching address ID for a billing address.

**Parameters:**
- `basket` (dw.order.Basket) - Customer's basket
- `customer` (Object) - Customer model

**Returns:** string | boolean - Matching address ID or false

## Usage Example

```javascript
var OrderModel = require('*/cartridge/models/order');
var OrderMgr = require('dw/order/OrderMgr');

// For completed order
var order = OrderMgr.getOrder('order-number');
var orderModel = new OrderModel(order, { numberOfLineItems: '*' });

// Access order properties
console.log(orderModel.orderNumber);
console.log(orderModel.totals.grandTotal);
console.log(orderModel.billing.billingAddress);
console.log(orderModel.items.length);

// For checkout basket
var currentBasket = BasketMgr.getCurrentBasket();
var checkoutModel = new OrderModel(currentBasket);
console.log(checkoutModel.checkoutStep.shipping.iscompleted);
```

## Configuration Options

The model supports configuration through the options parameter:
- **numberOfLineItems**: Controls how many line items to include
  - `'*'` - Include all line items (default)
  - Number - Include specific number of line items

## Notes

- Works with both orders and baskets (line item containers)
- Automatically determines checkout step completion status
- Includes comprehensive totals with all discount calculations
- Provides first line item image for order thumbnails
- Handles multiple shipments with individual shipping information
- All monetary values are properly formatted for display
- Includes extensive localized resources for UI display

## Related Models

- **TotalsModel** - Used for order total calculations
- **ProductLineItemsModel** - Used for line item information
- **BillingModel** - Used for billing information
- **AddressModel** - Used for address formatting
- **PaymentModel** - Used for payment information
