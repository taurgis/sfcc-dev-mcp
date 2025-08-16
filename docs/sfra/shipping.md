# SFRA Shipping Model

## Overview

The Shipping model represents shipping information for a shipment in SFRA applications. It provides comprehensive shipping data including addresses, methods, product line items, and gift options for checkout and order processing.

## Constructor

```javascript
function ShippingModel(shipment, address, customer, containerView)
```

Creates a Shipping model instance with complete shipping information.

### Parameters

- `shipment` (dw.order.Shipment) - The shipment from the current basket
- `address` (Object) - The address to use for filtering shipping methods
- `customer` (Object) - The current customer model
- `containerView` (string) - View context ('order' or 'basket')

## Properties

### UUID
**Type:** string | null

Unique identifier for the shipment.

### productLineItems
**Type:** ProductLineItemsModel | null

Product line items model containing all products in this shipment with detailed information.

### applicableShippingMethods
**Type:** Array<Object>

Array of shipping methods available for this shipment based on the shipping address and products.

### selectedShippingMethod
**Type:** ShippingMethodModel | null

Currently selected shipping method for this shipment, or null if none selected.

### shippingAddress
**Type:** Object

Shipping address for this shipment. Uses either:
- Formatted address from the shipment (if address exists)
- Provided address parameter (if shipment address is empty)

### matchingAddressId
**Type:** string | boolean

ID of matching customer address, or false if no match found in customer's address book.

### isGift
**Type:** boolean | null

Indicates whether this shipment is marked as a gift.

### giftMessage
**Type:** string | null

Gift message for the shipment if it's marked as a gift.

## Helper Functions

### getProductLineItemsModel(shipment, containerView)
Creates a product line items model for the shipment's products.

**Parameters:**
- `shipment` (dw.order.Shipment) - Target shipment
- `containerView` (string) - View context

**Returns:** ProductLineItemsModel | null

### getSelectedShippingMethod(shipment)
Gets the selected shipping method for a shipment.

**Parameters:**
- `shipment` (dw.order.Shipment) - Target shipment

**Returns:** ShippingMethodModel | null

### getShipmentUUID(shipment)
Extracts the UUID from a shipment.

**Parameters:**
- `shipment` (dw.order.Shipment) - Target shipment

**Returns:** string | null

### getAssociatedAddress(shipment, customer)
Finds matching customer address for the shipping address.

**Parameters:**
- `shipment` (dw.order.Shipment) - Target shipment
- `customer` (Object) - Customer model

**Returns:** string | boolean - Matching address ID or false

### emptyAddress(shipment)
Checks if the shipment has any address information.

**Parameters:**
- `shipment` (dw.order.Shipment) - Target shipment

**Returns:** boolean - True if address has any populated fields

## Address Handling

The model provides flexible address handling:
- **Existing Address**: Uses shipment's shipping address if populated
- **Fallback Address**: Uses provided address parameter if shipment address is empty
- **Address Matching**: Finds matching addresses in customer's address book

## Usage Example

```javascript
var ShippingModel = require('*/cartridge/models/shipping');
var BasketMgr = require('dw/order/BasketMgr');

var currentBasket = BasketMgr.getCurrentBasket();
var shipment = currentBasket.defaultShipment;
var shippingAddress = getShippingAddress();
var customer = req.currentCustomer;

var shipping = new ShippingModel(shipment, shippingAddress, customer, 'basket');

// Access shipping information
console.log(shipping.UUID);
console.log(shipping.applicableShippingMethods.length);

if (shipping.selectedShippingMethod) {
    console.log('Selected: ' + shipping.selectedShippingMethod.displayName);
}

// Check for gift options
if (shipping.isGift) {
    console.log('Gift message: ' + shipping.giftMessage);
}

// Access products in shipment
shipping.productLineItems.items.forEach(function(item) {
    console.log(item.productName + ' x ' + item.quantity);
});
```

## Gift Functionality

The model supports gift shipments:
- **isGift** - Boolean flag for gift marking
- **giftMessage** - Custom message for gift recipients
- Integrates with gift wrapping and messaging features

## Notes

- Handles both populated and empty shipping addresses
- Integrates with shipping method calculation helpers
- Provides address matching for saved customer addresses
- Supports gift functionality with messages
- Works with both basket and order contexts
- Includes comprehensive product line item information

## Related Models

- **AddressModel** - Used for shipping address formatting
- **ProductLineItemsModel** - Used for shipment products
- **ShippingMethodModel** - Used for shipping method details
- **Cart Model** - Uses shipping models for checkout
- **Order Model** - Uses shipping models for order information
