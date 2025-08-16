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
Adds fundamental product information including ID, name, type, and basic properties.

### price
Adds comprehensive pricing information including promotional prices, with option model integration.

### images
Adds product images with full configuration:
- **Types:** ['large', 'small'] - Multiple image sizes for different display contexts
- **Quantity:** 'all' - All available images

### quantity
Adds quantity information and constraints for the product.

### variationAttributes
Adds variation attribute information with full configuration:
- **Attributes:** '*' - All variation attributes
- **EndPoint:** 'Variation' - Endpoint for variation handling

### description
Adds product description and detailed information.

### ratings
Adds product rating and review information.

### promotions
Adds active promotion information for the product.

### attributes
Adds product attributes from the attribute model.

### availability
Adds availability information based on quantity, minimum order quantity, and availability model.

### options
Adds product option information including option model, variables, and quantity.

### quantitySelector
Adds quantity selector information with step quantity and variables.

### sizeChart (conditional)
Adds size chart information if the product's category has a custom sizeChartID attribute.

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

- **id** - Product ID
- **name** - Product name and display information
- **type** - Product type
- **price** - Comprehensive pricing with promotions
- **images** - Large and small product images
- **quantity** - Quantity information and constraints
- **variationAttributes** - Complete variation attribute data
- **description** - Product descriptions
- **ratings** - Rating and review data
- **promotions** - Active promotion information
- **attributes** - Product attribute model data
- **availability** - Availability status and messages
- **options** - Product option configurations
- **quantitySelector** - Quantity selection parameters
- **sizeChart** - Size chart information (if applicable)

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
