# SFRA Product Tile Model

## Overview

The Product Tile model represents a product in tile/grid view format, typically used in product listing pages, search results, and category pages. It provides essential product information optimized for display in compact tile formats.

## Module Function

```javascript
module.exports = function productTile(product, apiProduct, productType)
```

Decorates a product object with product tile information using various decorators.

### Parameters

- `product` (Object) - Product Model to be decorated
- `apiProduct` (dw.catalog.Product) - Product information returned by the script API
- `productType` (string) - Product type information ('product', 'variant', 'master', 'set', etc.)

### Returns

Object - Decorated product model with tile-specific information

## Applied Decorators

The product tile model applies the following decorators:

### base
Adds fundamental product information including uuid, id, productName, productType, and brand.

### searchPrice
Adds pricing information optimized for search results and product tiles: `price` property with promotional pricing.

### images
Adds product images with the following configuration:
- **Types:** ['medium'] - Medium-sized images suitable for tiles
- **Quantity:** 'single' - Single image per type

### ratings
Adds product rating information: `rating` value calculated from product ID.

### setProductsCollection (conditional)
Applied only when `productType === 'set'`. Adds `numberOfProductsInSet` property with count of products in the set.

### searchVariationAttributes
Adds variation attribute information: `variationAttributes` array optimized for search results and product listings (specifically color swatches).

## Usage Example

```javascript
var productTileDecorator = require('*/cartridge/models/product/productTile');
var productFactory = require('*/cartridge/scripts/factories/product');

// Create base product model
var product = productFactory.get({ pid: 'product-id' });

// Apply product tile decorations
var tileProduct = productTileDecorator(product, apiProduct, 'product');

// Access tile-specific properties
console.log(tileProduct.images.medium);
console.log(tileProduct.price);
console.log(tileProduct.ratings);
```

## Typical Properties After Decoration

After applying the product tile decorators, the product object typically contains:

- **uuid** - Product UUID
- **id** - Product ID
- **productName** - Product name  
- **productType** - Product type
- **brand** - Product brand
- **price** - Pricing information with promotions (DefaultPrice or RangePrice)
- **images** - Medium-sized product images
- **rating** - Product rating value
- **variationAttributes** - Color variation swatches and options
- **numberOfProductsInSet** - Number of products in set (for product sets only)

## Notes

- Optimized for performance in product listing scenarios
- Uses medium-sized images to balance quality and load time
- Includes promotional pricing for accurate display
- Handles different product types (simple, master, variant, set)
- Variation attributes are optimized for search/listing context

## Related Models

- **Full Product Model** - More detailed product information
- **Product Bundle Model** - For bundled products
- **Product Set Model** - For product sets
- **Product Decorators** - Individual decoration functions
