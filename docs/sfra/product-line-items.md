# SFRA Product Line Items Model

## Overview

The Product Line Items model represents a collection of product line items in a basket or order. It provides comprehensive information about each product in the cart including quantities, options, bonus products, and pricing details.

## Constructor

```javascript
function ProductLineItems(productLineItems, view)
```

Creates a Product Line Items model with formatted line item information.

### Parameters

- `productLineItems` (dw.util.Collection<dw.order.ProductLineItem>) - Collection of product line items from basket or order
- `view` (string) - View context ('basket' or 'order')

## Properties

### items
**Type:** Array<Object>

Array of formatted product line items. Each item contains:

#### Standard Product Items
- `id` (string) - Product ID
- `productName` (string) - Product display name
- `quantity` (number) - Item quantity
- `UUID` (string) - Line item UUID
- `product` (Object) - Full product model with pricing, images, attributes
- `options` (Array) - Product options if applicable
- `bonusProducts` (Array) - Associated bonus products if applicable

#### Items Without Product (Unassigned Categories)
- `id` (string) - Product ID
- `productName` (string) - Product name
- `quantity` (number) - Item quantity
- `UUID` (string) - Line item UUID
- `noProduct` (boolean) - Flag indicating missing product (true)
- `images` (Object) - Default "no image" placeholder

### totalQuantity
**Type:** number

Total quantity of all items in the collection.

## Helper Functions

### createProductLineItemsObject(allLineItems, view)
Creates an array of formatted product line items with comprehensive product information.

**Parameters:**
- `allLineItems` (dw.util.Collection<dw.order.ProductLineItem>) - All product line items
- `view` (string) - View context ('basket' or 'order')

**Returns:** Array<Object> - Formatted line items array

## Product Line Item Structure

Each product line item in the items array contains:

### Product Information
- Complete product model created via ProductFactory
- Includes pricing, images, availability, and attributes
- Product options mapped with option IDs and selected values

### Bonus Products
- Automatically detected and included for qualifying items
- Each bonus product includes full product information
- Linked via custom attributes (bonusProductLineItemUUID, preOrderUUID)

### Quantity and Identification
- Line item quantity and UUID for cart operations
- Product ID for catalog operations
- Product name for display purposes

## Usage Example

```javascript
var ProductLineItems = require('*/cartridge/models/productLineItems');
var BasketMgr = require('dw/order/BasketMgr');

var currentBasket = BasketMgr.getCurrentBasket();
var lineItemsModel = new ProductLineItems(
    currentBasket.productLineItems, 
    'basket'
);

// Access line items
console.log('Total items: ' + lineItemsModel.totalQuantity);

lineItemsModel.items.forEach(function(item) {
    if (item.noProduct) {
        console.log('Missing product: ' + item.productName);
    } else {
        console.log(item.product.productName + ' x ' + item.quantity);
        
        // Check for options
        if (item.options && item.options.length > 0) {
            console.log('Options: ', item.options);
        }
        
        // Check for bonus products
        if (item.bonusProducts && item.bonusProducts.length > 0) {
            console.log('Bonus products: ' + item.bonusProducts.length);
        }
    }
});
```

## Special Handling

### Missing Products
When a product is no longer available or unassigned:
- `noProduct` flag is set to true
- Limited product information is available
- Default "no image" placeholder is used
- Product name and basic details are preserved

### Bonus Products
- Automatically detected based on custom attributes
- Each bonus product gets full ProductFactory treatment
- Maintains relationship to parent product line item
- Includes all product options and configurations

### Product Options
- Maps option product line items to option configurations
- Includes option ID and selected value ID for each option
- Used for product configuration and pricing

## Notes

- Handles both basket and order contexts
- Gracefully handles missing or invalid products
- Includes comprehensive product information via ProductFactory
- Supports complex product relationships (bundles, sets, bonuses)
- Maintains line item UUIDs for cart operations
- Provides fallback handling for catalog issues

## Related Models

- **Cart Model** - Uses product line items for cart display
- **Order Model** - Uses product line items for order information
- **Product Models** - Created via ProductFactory for each line item
- **Totals Model** - Calculates totals based on line items
