# SFRA Range Price Model

## Overview

The Range Price model represents price ranges in SFRA applications, typically used for product sets, bundles, or variable products where prices can vary between a minimum and maximum value.

## Constructor

```javascript
function RangePrice(min, max)
```

Creates a Range Price model instance with minimum and maximum pricing.

### Parameters

- `min` (dw.value.Money) - Range minimum price
- `max` (dw.value.Money) - Range maximum price

## Properties

### type
**Type:** string

Always set to 'range' to identify this as a range price model.

### min
**Type:** DefaultPrice

Minimum price in the range, formatted as a DefaultPrice model with value, currency, and formatted properties. Created as `new DefaultPrice(min)` where only the sales price is provided.

### max
**Type:** DefaultPrice

Maximum price in the range, formatted as a DefaultPrice model with value, currency, and formatted properties. Created as `new DefaultPrice(max)` where only the sales price is provided.

## Usage Example

```javascript
var RangePrice = require('*/cartridge/models/price/range');

// For a product bundle with varying prices
var minPrice = new Money(19.99, 'USD');
var maxPrice = new Money(49.99, 'USD');

var rangePrice = new RangePrice(minPrice, maxPrice);

console.log(rangePrice.type);              // "range"
console.log(rangePrice.min.sales.formatted);     // "$19.99"
console.log(rangePrice.max.sales.formatted);     // "$49.99"

// Display price range
console.log(rangePrice.min.sales.formatted + ' - ' + rangePrice.max.sales.formatted);
// Output: "$19.99 - $49.99"
```

## Use Cases

Range prices are commonly used for:
- **Product Bundles** - When bundle contents affect total price
- **Product Sets** - Collections with varying individual prices
- **Variable Products** - Products with options that affect pricing
- **Category Displays** - Showing price ranges for product collections

## Notes

- Both min and max are DefaultPrice models created with only the sales price (no list price)
- Min and max prices are accessed via `.sales` property (e.g., `rangePrice.min.sales.formatted`)
- Type property helps identify this as a range price in templates
- Useful for displaying "from X to Y" pricing
- Maintains currency and formatting consistency through DefaultPrice

## Related Models

- **DefaultPrice Model** - Used for min and max price formatting
- **TieredPrice Model** - Alternative pricing model for quantity discounts
- **Product Models** - May use range prices for variable products
