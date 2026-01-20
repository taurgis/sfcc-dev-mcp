# SFRA Model Project Structure Reference

Complete reference for the default SFRA model directory structure in `app_storefront_base`.

## Directory Organization

```
cartridge/models/
├── account.js                    # Customer account model
├── address.js                    # Address transformation model
├── billing.js                    # Billing information model
├── cart.js                       # Shopping cart model with totals
├── categories.js                 # Category navigation model
├── content.js                    # Content asset model
├── locale.js                     # Locale and currency model
├── order.js                      # Order model for order history
├── payment.js                    # Payment instrument model
├── productLineItems.js           # Collection of product line items
├── shipping.js                   # Shipping address and methods
├── store.js                      # Individual store model
├── stores.js                     # Store locator collection model
├── totals.js                     # Order/cart totals calculation model
├── price/                        # Price-related models
│   ├── default.js                # Standard price model
│   ├── range.js                  # Price range model (min-max)
│   └── tiered.js                 # Tiered pricing model
├── product/                      # Product-related models
│   ├── bonusProduct.js           # Bonus/promotional product model
│   ├── fullProduct.js            # Complete product details model
│   ├── productAttributes.js      # Product attributes model
│   ├── productBundle.js          # Product bundle model
│   ├── productImages.js          # Product images model
│   ├── productSet.js             # Product set model
│   ├── productTile.js            # Product tile/listing model
│   └── decorators/               # Product decorator functions
│       ├── index.js              # Decorator registry
│       ├── attributes.js         # Product attributes decorator
│       ├── availability.js       # Stock availability decorator
│       ├── base.js               # Core product information
│       ├── bonusUnitPrice.js     # Bonus pricing decorator
│       ├── bundleReadyToOrder.js # Bundle ordering readiness
│       ├── bundledProducts.js    # Bundle component products
│       ├── currentUrl.js         # Product URL decorator
│       ├── description.js        # Product description decorator
│       ├── images.js             # Product images decorator
│       ├── online.js             # Online availability decorator
│       ├── options.js            # Product options decorator
│       ├── pageMetaData.js       # SEO metadata decorator
│       ├── price.js              # Price calculation decorator
│       ├── promotions.js         # Promotional pricing decorator
│       ├── quantity.js           # Quantity handling decorator
│       ├── quantitySelector.js   # Quantity selector decorator
│       ├── ratings.js            # Product ratings decorator
│       ├── raw.js                # Raw API object decorator
│       ├── readyToOrder.js       # Order readiness decorator
│       ├── searchPrice.js        # Search result pricing
│       ├── searchVariationAttributes.js # Search variation handling
│       ├── setIndividualProducts.js # Product set individuals
│       ├── setProductsCollection.js # Product set collection
│       ├── setReadyToOrder.js    # Set ordering readiness
│       ├── sizeChart.js          # Size chart decorator
│       ├── template.js           # Template selection decorator
│       └── variationAttributes.js # Variation attributes decorator
├── productLineItem/              # Product line item models
│   ├── bonusOrderLineItem.js     # Bonus order line item
│   ├── bonusProductLineItem.js   # Bonus product line item
│   ├── bundleLineItem.js         # Bundle line item model
│   ├── bundleOrderLineItem.js    # Bundle order line item
│   ├── orderLineItem.js          # Order line item model
│   ├── productLineItem.js        # Cart line item model
│   └── decorators/               # Line item decorators
│       ├── index.js              # Decorator registry
│       ├── appliedPromotions.js  # Applied promotion decorator
│       ├── bonusProductLineItem.js # Bonus product decorator
│       ├── bonusProductLineItemUUID.js # Bonus UUID decorator
│       ├── bonusUnitPrice.js     # Bonus pricing decorator
│       ├── bundledProductLineItems.js # Bundle items decorator
│       ├── discountBonusLineItems.js # Discount bonus decorator
│       ├── gift.js               # Gift message decorator
│       ├── options.js            # Line item options decorator
│       ├── orderable.js          # Orderability decorator
│       ├── preOrderUUID.js       # Pre-order UUID decorator
│       ├── priceTotal.js         # Price total decorator
│       ├── quantity.js           # Quantity decorator
│       ├── quantityOptions.js    # Quantity options decorator
│       ├── renderedPromotions.js # Rendered promotions decorator
│       ├── shipment.js           # Shipment decorator
│       └── uuid.js               # UUID decorator
├── search/                       # Search-related models
│   ├── contentSearch.js          # Content search results model
│   ├── productSearch.js          # Product search results model
│   ├── productSortOptions.js     # Sort options model
│   ├── attributeRefinementValue/ # Search refinement models
│   └── suggestions/              # Search suggestion models
└── shipping/                     # Shipping-related models
    └── shippingMethod.js         # Shipping method model
```

## Key Model Categories

### 1. Core Commerce Models

| Model | Purpose |
|-------|---------|
| `cart.js` | Central shopping cart with totals, line items, promotions |
| `order.js` | Order model for history and confirmation pages |
| `account.js` | Customer account information and preferences |
| `payment.js` | Payment instruments and billing information |
| `totals.js` | Cart/order total calculations |

### 2. Product Models

| Model | Purpose |
|-------|---------|
| `product/fullProduct.js` | Complete product details for PDP |
| `product/productTile.js` | Lightweight product info for listings |
| `product/productBundle.js` | Bundle product handling |
| `product/productSet.js` | Product set handling |
| `product/decorators/` | Modular product enhancement functions |

### 3. Line Item Models

| Model | Purpose |
|-------|---------|
| `productLineItem/productLineItem.js` | Cart line items |
| `productLineItem/orderLineItem.js` | Order line items |
| `productLineItem/bundleLineItem.js` | Bundle line items |
| `productLineItem/decorators/` | Line item enhancement functions |

### 4. Pricing Models

| Model | Purpose |
|-------|---------|
| `price/default.js` | Standard pricing model |
| `price/range.js` | Price range for variable pricing |
| `price/tiered.js` | Volume-based pricing tiers |

### 5. Location & Shipping Models

| Model | Purpose |
|-------|---------|
| `store.js` & `stores.js` | Store locator functionality |
| `shipping.js` | Shipping address and method selection |
| `shipping/shippingMethod.js` | Individual shipping method |
| `address.js` | Address transformation and validation |

### 6. Search Models

| Model | Purpose |
|-------|---------|
| `search/productSearch.js` | Search results and refinements |
| `search/contentSearch.js` | Content search functionality |
| `search/productSortOptions.js` | Sorting options for search |

## Model Inheritance Patterns

### Decorator Pattern (Product Models)

```javascript
// product/decorators/index.js - Central decorator registry
module.exports = {
    base: require('*/cartridge/models/product/decorators/base'),
    price: require('*/cartridge/models/product/decorators/price'),
    images: require('*/cartridge/models/product/decorators/images'),
    availability: require('*/cartridge/models/product/decorators/availability'),
    // ... other decorators
};

// Usage in fullProduct.js
var decorators = require('*/cartridge/models/product/decorators/index');

function fullProduct(product, apiProduct, options) {
    decorators.base(product, apiProduct, options.productType);
    decorators.price(product, apiProduct, options.promotions);
    decorators.images(product, apiProduct, options);
    return product;
}
```

### Composition Pattern (Complex Models)

```javascript
// cart.js - Composes multiple sub-models
var TotalsModel = require('*/cartridge/models/totals');
var ProductLineItemsModel = require('*/cartridge/models/productLineItems');

function Cart(basket) {
    this.totals = new TotalsModel(basket);
    this.items = new ProductLineItemsModel(basket.productLineItems);
    this.shipments = createShipmentModels(basket.shipments);
}
```

### Factory Pattern (Conditional Models)

```javascript
// Different models based on product type
function createProductModel(apiProduct, type) {
    switch (type) {
        case 'full': 
            return require('*/cartridge/models/product/fullProduct');
        case 'tile': 
            return require('*/cartridge/models/product/productTile');
        case 'bundle': 
            return require('*/cartridge/models/product/productBundle');
        default:
            return require('*/cartridge/models/product/fullProduct');
    }
}
```

## Best Practices for Structure

1. **Follow the Directory Convention** - Maintain the same directory structure in custom cartridges
2. **Use Decorator Registries** - Create `index.js` files to register and export decorators
3. **Separate Concerns** - Keep pricing, images, and availability in separate decorators
4. **Maintain Model Hierarchy** - Extend base models rather than replacing entirely
5. **Consistent Naming** - Follow SFRA naming conventions for predictable imports

## Custom Cartridge Model Structure

When creating custom models, mirror the base structure:

```
app_custom/cartridge/models/
├── account.js              # Extends base account model
├── product/
│   ├── fullProduct.js      # Extends base full product
│   └── decorators/
│       ├── index.js        # Re-exports base + custom decorators
│       └── customAttr.js   # New custom decorator
└── custom/
    └── myCustomModel.js    # Brand new model
```
