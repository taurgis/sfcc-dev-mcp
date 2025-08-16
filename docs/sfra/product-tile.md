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
Adds fundamental product information including ID, name, type, and basic properties.

### searchPrice
Adds pricing information optimized for search results and product tiles, including promotional pricing.

### images
Adds product images with the following configuration:
- **Types:** ['medium'] - Medium-sized images suitable for tiles
- **Quantity:** 'single' - Single image per type

### ratings
Adds product rating and review information for display in tiles.

### setProductsCollection (conditional)
Applied only when `productType === 'set'`. Adds information about products included in the product set.

### searchVariationAttributes
Adds variation attribute information optimized for search results and product listings.

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

- **id** - Product ID
- **name** - Product name
- **type** - Product type
- **price** - Pricing information with promotions
- **images** - Medium-sized product images
- **ratings** - Rating and review data
- **url** - Product detail page URL
- **variationAttributes** - Available variation options (for variable products)
- **setProducts** - Included products (for product sets only)

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
