# SFRA Product Bundle Model

## Overview

The Product Bundle model represents bundled products in SFRA applications, where multiple products are sold together as a single unit. It provides comprehensive bundle information including individual bundled products, pricing, and bundle-specific functionality.

## Module Function

```javascript
module.exports = function bundleProduct(product, apiProduct, options, factory)
```

Decorates a product object with bundle-specific information using various decorators.

### Parameters

- `product` (Object) - Product Model to be decorated
- `apiProduct` (dw.catalog.Product) - Product information returned by the script API
- `options` (Object) - Options object containing:
  - `productType` (string) - Product type information
  - `variationModel` (dw.catalog.ProductVariationModel) - Variation model returned by the API
  - `options` (Object) - Options provided on the query string
  - `optionModel` (dw.catalog.ProductOptionModel) - Options model returned by the API
  - `promotions` (dw.util.Collection) - Active promotions for the product
  - `quantity` (number) - Current selected quantity
  - `variables` (Object) - Variables passed in on the query string
- `factory` (Object) - Reference to product factory for creating bundled products

### Returns

Object - Decorated product model with bundle-specific information

## Applied Decorators

The product bundle model applies the following decorators in sequence:

### Standard Product Decorators
- **base** - Fundamental product information
- **price** - Bundle pricing with promotions
- **images** - Large and small product images
- **quantity** - Quantity information and constraints
- **description** - Product descriptions
- **ratings** - Product ratings and reviews
- **promotions** - Active promotion information
- **attributes** - Product attributes
- **availability** - Availability status and messages
- **options** - Product option configurations
- **quantitySelector** - Quantity selection parameters

### Bundle-Specific Decorators
- **bundledProducts** - Information about products included in the bundle
- **bundleReadyToOrder** - Bundle-specific readiness validation
- **currentUrl** - URL for the bundle product page
- **sizeChart** - Size chart information (if applicable)
- **raw** - Raw API product data
- **pageMetaData** - SEO and page metadata
- **template** - Template information for rendering

## Bundle-Specific Features

### Bundled Products Information
The `bundledProducts` decorator adds:
- List of individual products in the bundle
- Quantities of each bundled product
- Individual product pricing and availability
- Product configuration options for each item

### Bundle Readiness Validation
The `bundleReadyToOrder` decorator provides:
- Overall bundle availability status
- Validation that all required bundled products are available
- Bundle-specific ordering constraints

### Bundle Pricing
Bundle pricing includes:
- Combined pricing of all bundled products
- Bundle-level discounts and promotions
- Individual product price contributions
- Savings compared to individual purchases

## Usage Example

```javascript
var bundleProductDecorator = require('*/cartridge/models/product/productBundle');
var productFactory = require('*/cartridge/scripts/factories/product');

// Prepare options for bundle
var options = {
    productType: 'bundle',
    variationModel: variationModel,
    optionModel: optionModel,
    promotions: activePromotions,
    quantity: 1,
    variables: req.querystring,
    options: req.httpParameterMap
};

// Create and decorate bundle product
var product = {};
var bundleProduct = bundleProductDecorator(product, apiProduct, options, productFactory);

// Access bundle-specific information
console.log(bundleProduct.bundledProducts.length);
console.log(bundleProduct.price.sales.formatted);
console.log(bundleProduct.readyToOrder);

// Check individual bundled products
bundleProduct.bundledProducts.forEach(function(bundledProduct) {
    console.log(bundledProduct.productName + ' x ' + bundledProduct.quantity);
});
```

## Bundle Structure

After decoration, the bundle product contains:

### Standard Product Properties
- Complete product information (name, ID, type, etc.)
- Comprehensive pricing with bundle discounts
- Product images, descriptions, and attributes
- Availability and ordering information

### Bundle-Specific Properties
- **bundledProducts** - Array of individual products in the bundle
- **readyToOrder** - Boolean indicating if the entire bundle can be ordered
- **bundlePrice** - Combined pricing information for the bundle
- **bundlePromotions** - Bundle-specific promotional offers

## Notes

- Handles complex bundle pricing calculations
- Validates availability for all bundled products
- Supports bundle-specific promotions and discounts
- Maintains individual product information within the bundle
- Provides comprehensive bundle readiness validation
- Includes size chart support if any bundled products have size charts
- Optimized for bundle product detail pages

## Related Models

- **Product Factory** - Creates individual bundled product models
- **Full Product Model** - Similar comprehensive decoration approach
- **Product Set Model** - Alternative product grouping model
- **Product Decorators** - Individual decoration functions
