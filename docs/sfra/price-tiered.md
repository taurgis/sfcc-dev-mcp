# SFRA Tiered Price Model

## Overview

The Tiered Price model represents quantity-based pricing in SFRA applications, where products have different prices based on the quantity purchased. This enables bulk discounts and volume pricing strategies.

## Constructor

```javascript
function TieredPrice(priceTable, useSimplePrice)
```

Creates a Tiered Price model instance with quantity-based pricing tiers.

### Parameters

- `priceTable` (dw.catalog.ProductPriceTable) - Product price table from the API
- `useSimplePrice` (boolean) - Flag indicating if this is for a product tile (optional)

## Properties

### type
**Type:** string

Always set to 'tiered' to identify this as a tiered price model.

### useSimplePrice
**Type:** boolean

Flag indicating whether this price is intended for simplified display (e.g., product tiles). Defaults to false.

### tiers
**Type:** Array<Object>

Array of pricing tier objects, each containing:
- `quantity` (number) - Minimum quantity for this price tier
- `price` (DefaultPrice) - Price object for this quantity tier

### startingFromPrice
**Type:** DefaultPrice

The lowest price available across all tiers, representing the "starting from" price for marketing display.

## Tier Structure

Each tier object in the tiers array contains:

### quantity
Minimum quantity required to qualify for this price tier.

### price
Complete DefaultPrice object with formatted pricing information for this tier.

## Usage Example

```javascript
var TieredPrice = require('*/cartridge/models/price/tiered');

// Get tiered pricing from product
var product = ProductMgr.getProduct('bulk-product-id');
var priceTable = product.getPriceModel().getPriceTable();

var tieredPrice = new TieredPrice(priceTable, false);

console.log(tieredPrice.type);                    // "tiered"
console.log('Starting from: ' + tieredPrice.startingFromPrice.formatted);

// Display all price tiers
tieredPrice.tiers.forEach(function(tier) {
    console.log('Buy ' + tier.quantity + '+ for ' + tier.price.formatted + ' each');
});

// Example output:
// Buy 1+ for $10.00 each
// Buy 5+ for $9.00 each  
// Buy 10+ for $8.00 each
```

## Price Calculation Logic

The model automatically:
1. **Processes all quantity breaks** from the price table
2. **Identifies the lowest price** across all tiers
3. **Sets startingFromPrice** to the best available price
4. **Maintains tier order** based on quantity requirements

## Display Modes

### Full Pricing (useSimplePrice = false)
- Shows all pricing tiers
- Includes complete quantity break information
- Used on product detail pages

### Simple Pricing (useSimplePrice = true)
- Optimized for product tiles and listings
- Focuses on starting price and key tiers
- Simplified display for grid views

## Notes

- Automatically calculates the best "starting from" price
- Supports unlimited number of quantity tiers
- Each tier uses DefaultPrice for consistent formatting
- Useful for B2B and bulk purchasing scenarios
- Type property enables template conditional logic

## Related Models

- **DefaultPrice Model** - Used for individual tier pricing
- **RangePrice Model** - Alternative pricing model for price ranges
- **Product Models** - Use tiered prices for bulk products
