# SFRA Order Model

## Overview

The Order model represents an order or basket in SFRA applications, providing comprehensive or## Helper Functions

### getCheckoutStepInformation(lineItemContainer)
Returns checkout step completion status.

**Parameters:**
- `lineItemContainer` (dw.order.LineItemCtnr) - Order or basket

**Returns:** Object - Checkout step status with shipping and billing completion flags

### getFirstProductLineItem(productLineItemsModel)
Returns image information for the first product line item.

**Parameters:**
- `productLineItemsModel` (Object) - Product line items model

**Returns:** Object | null - Object with imageURL, alt, and title properties, or null

### getAssociatedAddress(lineItemContainer, customer)
Returns the matching address ID for a billing address.

**Parameters:**
- `lineItemContainer` (dw.order.LineItemCtnr) - Order or basket
- `customer` (Object) - Customer model

**Returns:** string | boolean - Matching shipment UUID or customer address ID, or false if no matchuding line items, totals, billing, shipping, and checkout step status. It's used for order confirmation pages, order history, and checkout processes.

## Constructor

```javascript
function OrderModel(lineItemContainer, options)
```

Creates an Order model instance from a line item container (order or basket).

### Parameters

- `lineItemContainer` (dw.order.LineItemCtnr) - Order or basket object
- `options` (Object) - Configuration options including:
  - `config` (Object) - Configuration object with `numberOfLineItems` setting
  - `countryCode` (string) - Current request country code
  - `customer` (Object) - Customer object
  - `containerView` (string) - View context ('order' or 'basket')
  - `usingMultiShipping` (boolean) - Whether using multiple shipping addresses
  - `shippable` (boolean) - Whether order contains shippable items

## Properties

### resources
**Type:** Object

Resource strings for order-related messaging and labels.

### orderNumber
**Type:** string | null

The order number for completed orders, or null for baskets.

### creationDate
**Type:** Date | null

Date when the order was created, or null for baskets.

### orderEmail
**Type:** string

Customer email address associated with the order.

### orderStatus
**Type:** Object | null

Order status information, or null for baskets.

### usingMultiShipping
**Type:** boolean

Indicates whether the order uses multiple shipping addresses.

### shippable
**Type:** boolean

Indicates whether the order contains shippable items.

### priceTotal
**Type:** string | null

Formatted grand total amount from the totals model.

### productQuantityTotal
**Type:** number | null

Total quantity of all products in the order.

## Conditional Properties (when numberOfLineItems = '*')

### totals
**Type:** TotalsModel

Order totals including subtotals, taxes, shipping costs, and grand total.

### lineItemTotal
**Type:** number | null

Total number of line items in the order.

### steps
**Type:** Object | null

Checkout step information with completion status.

### items
**Type:** ProductLineItemsModel

Product line items model containing all order items with detailed product information.

### billing
**Type:** BillingModel

Billing information including billing address and payment methods.

### shipping
**Type:** Array<Object>

Array of shipping models containing shipping address and method information for each shipment.

## Conditional Properties (when numberOfLineItems = 'single')

### firstLineItem
**Type:** Object | null

Information about the first product line item including image details.

### shippedToFirstName
**Type:** string

First name from the first shipment's shipping address.

### shippedToLastName
**Type:** string

Last name from the first shipment's shipping address.

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
