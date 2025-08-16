# SFRA Default Price Model

## Overview

The Default Price model represents standard product pricing in SFRA applications. It provides formatted price information including sales prices, list prices, and currency details for product display and calculations.

## Constructor

```javascript
function DefaultPrice(salesPrice, listPrice)
```

Creates a Default Price model instance with sales and list pricing information.

### Parameters

- `salesPrice` (dw.value.Money) - Sales price from the API
- `listPrice` (dw.value.Money) - List price from the API (optional)

## Properties

### sales
**Type:** Object

Sales price information containing:
- `value` (number | null) - Decimal price value
- `currency` (string | null) - Currency code
- `formatted` (string | null) - Formatted price string for display
- `decimalPrice` (string | null) - Decimal price as string

### list
**Type:** Object | null

List price information (same structure as sales) or null if no list price provided.

## Helper Functions

### toPriceModel(price)
Converts an API Money object to a structured price model.

**Parameters:**
- `price` (dw.value.Money) - Price object from the API

**Returns:** Object - Formatted price object with value, currency, formatted string, and decimal price

## Price Object Structure

Each price object (sales/list) contains:

### value
Raw numeric price value for calculations and comparisons.

### currency
Three-letter currency code (e.g., "USD", "EUR").

### formatted
User-friendly formatted price string with currency symbol (e.g., "$29.99").

### decimalPrice
String representation of the decimal price for precise display.

## Usage Example

```javascript
var DefaultPrice = require('*/cartridge/models/price/default');

// Get prices from product
var product = ProductMgr.getProduct('product-id');
var salesPrice = product.getPriceModel().getPrice();
var listPrice = product.getPriceModel().getPriceBookPrice('list-price-book');

var price = new DefaultPrice(salesPrice, listPrice);

// Access sales price
console.log(price.sales.formatted);    // "$29.99"
console.log(price.sales.value);        // 29.99
console.log(price.sales.currency);     // "USD"

// Check for list price (original/MSRP)
if (price.list) {
    console.log('Was: ' + price.list.formatted);
    console.log('Now: ' + price.sales.formatted);
    
    // Calculate discount percentage
    var discount = ((price.list.value - price.sales.value) / price.list.value) * 100;
    console.log('Save ' + discount.toFixed(0) + '%');
}
```

## Price Availability

The model handles unavailable prices gracefully:
- When price is not available, all properties return null
- Prevents errors when price calculation fails
- Provides consistent structure regardless of price availability

## Currency Support

The model supports international pricing:
- Currency codes from the Money object
- Formatted strings respect locale settings
- Decimal representation for precise calculations

## Notes

- Handles both sales and list prices
- Gracefully manages unavailable prices with null values
- Provides multiple price formats for different use cases
- Supports international currencies and formatting
- List price is optional (may be null)
- Decimal price provides precise string representation

## Related Models

- **Tiered Price Model** - For quantity-based pricing
- **Range Price Model** - For price range displays
- **Product Models** - Use price models for product pricing
- **Cart Models** - Use price models for line item pricing
