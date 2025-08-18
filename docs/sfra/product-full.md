# SFRA Full Product Model

## Overview

The Full Product model represents a complete product with all detailed information, typically used on product detail pages (PDP). It provides comprehensive product data including pricing, images, variations, descriptions, ratings, promotions, and availability.

## Module Function

```javascript
module.exports = function fullProduct(product, apiProduct, options)
```

Decorates a product object with comprehensive product information using multiple decorators.

### Parameters

- `product` (Object) - Product Model to be decorated
- `apiProduct` (dw.catalog.Product) - Product information returned by the script API
- `options` (Object) - Options object containing:
  - `variationModel` (dw.catalog.ProductVariationModel) - Variation model returned by the API
  - `options` (Object) - Options provided on the query string
  - `optionModel` (dw.catalog.ProductOptionModel) - Options model returned by the API
  - `promotions` (dw.util.Collection) - Active promotions for the product
  - `quantity` (number) - Current selected quantity
  - `variables` (Object) - Variables passed in on the query string

### Returns

Object - Decorated product model with comprehensive product information

## Applied Decorators

The full product model applies the following decorators:

### base
Adds fundamental product information including uuid, id, productName, productType, and brand.

### price
Adds comprehensive pricing information including promotional prices, with option model integration. Sets `price` and `renderedPrice` properties.

### images
Adds product images with full configuration:
- **Types:** ['large', 'small'] - Multiple image sizes for different display contexts
- **Quantity:** 'all' - All available images

### quantity
Adds quantity information and constraints: `selectedQuantity`, `minOrderQuantity`, and `maxOrderQuantity`.

### variationAttributes
Adds variation attribute information with full configuration:
- **Attributes:** '*' - All variation attributes
- **EndPoint:** 'Variation' - Endpoint for variation handling

### description
Adds product description: `longDescription` and `shortDescription` markup properties.

### ratings
Adds product rating information: `rating` value calculated from product ID.

### promotions
Adds active promotion information: `promotions` array with promotion details.

### attributes
Adds product attributes from the attribute model: `attributes` array with grouped attribute data.

### availability
Adds availability information: `availability` object with messages and stock status based on quantity and availability model.

### options
Adds product option information: `options` array including option model, variables, and quantity.

### quantitySelector
Adds quantity selector information: `quantities` array with step quantity and URL options.

### sizeChart (conditional)
Adds size chart information: `sizeChartId` property if the product's category has a custom sizeChartID attribute.

### currentUrl
Adds current product URL: `selectedProductUrl` property with variation and option parameters.

### readyToOrder
Adds order readiness status: `readyToOrder` boolean indicating if product can be ordered.

### online
Adds online status: `online` boolean indicating if product is available online.

### raw
Adds raw API product: `raw` property (non-enumerable) containing the original dw.catalog.Product object.

### pageMetaData
Adds SEO metadata: `pageTitle`, `pageDescription`, `pageKeywords`, and `pageMetaTags` properties.

### template
Adds template information: `template` property for rendering purposes.

## Usage Example

```javascript
var fullProductDecorator = require('*/cartridge/models/product/fullProduct');
var productFactory = require('*/cartridge/scripts/factories/product');

// Prepare options
var options = {
    variationModel: variationModel,
    optionModel: optionModel,
    promotions: activePromotions,
    quantity: 1,
    variables: req.querystring,
    options: req.httpParameterMap
};

// Create and decorate product
var product = {};
var fullProduct = fullProductDecorator(product, apiProduct, options);

// Access comprehensive product information
console.log(fullProduct.price.sales);
console.log(fullProduct.images.large);
console.log(fullProduct.availability.messages);
console.log(fullProduct.variationAttributes);
```

## Typical Properties After Decoration

After applying all decorators, the full product object contains:

- **uuid** - Product UUID  
- **id** - Product ID
- **productName** - Product name and display information
- **productType** - Product type
- **brand** - Product brand
- **price** - Comprehensive pricing with promotions
- **renderedPrice** - HTML-rendered price for display
- **images** - Large and small product images
- **selectedQuantity** - Currently selected quantity
- **minOrderQuantity** - Minimum order quantity
- **maxOrderQuantity** - Maximum order quantity
- **variationAttributes** - Complete variation attribute data
- **longDescription** - Product long description markup
- **shortDescription** - Product short description markup
- **rating** - Product rating value
- **promotions** - Active promotion information
- **attributes** - Product attribute groups and values
- **availability** - Availability status and messages
- **options** - Product option configurations
- **quantities** - Available quantity selection options
- **sizeChartId** - Size chart identifier (if applicable)
- **selectedProductUrl** - Current product URL with selected variations and options
- **readyToOrder** - Boolean indicating if product can be ordered
- **online** - Boolean indicating if product is available online
- **pageTitle** - SEO page title
- **pageDescription** - SEO page description
- **pageKeywords** - SEO page keywords
- **pageMetaTags** - SEO meta tags array
- **template** - Template identifier for rendering

## Size Chart Handling

The model automatically checks for size chart information:
1. Gets the product's primary category
2. For variants/variation groups, uses the master product's primary category
3. If the category has a custom `sizeChartID` attribute, applies the sizeChart decorator

## Notes

- Provides the most comprehensive product information available
- Optimized for product detail pages with full functionality
- Handles all product types including variants, masters, and sets
- Includes promotional pricing and availability calculations
- Supports product options and variations
- Automatically handles size chart integration
- Performance-optimized for single product display

## Related Models

- **Product Tile Model** - Simplified version for listings
- **Product Bundle Model** - For bundled products
- **Product Set Model** - For product sets
- **Product Decorators** - Individual decoration functions
