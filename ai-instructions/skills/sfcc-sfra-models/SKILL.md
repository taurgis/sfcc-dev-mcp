---
name: sfcc-sfra-models
description: Comprehensive guide for creating, extending, and customizing models within SFRA. Use this when asked to develop product models, cart models, customer models, or any JSON transformation layer in SFCC.
---

# Salesforce B2C Commerce SFRA Models: Best Practices & Implementation Guide

This guide provides comprehensive best practices for creating, extending, and customizing models within the Salesforce B2C Commerce Storefront Reference Architecture (SFRA). Models are the JSON object layer that converts B2C Commerce Script API objects into pure JSON designed for storefront rendering.

**IMPORTANT**: Before developing SFRA models, consult the **sfcc-performance** skill. Review database optimization guidelines and index-friendly API usage to ensure your models follow SFCC performance standards.

## 🚀 Enhanced SFRA Model Documentation Access

This MCP server provides comprehensive access to SFRA model documentation through enhanced tools that can help you understand existing models and develop better custom ones:

### **Essential SFRA Model Documentation Tools**

1. **`list_sfra_documents`** - Discover all available SFRA documentation including models
2. **`get_sfra_documents_by_category`** - Explore model documents by functional area:
   - `product` - Product models including product-full, product-tile, product-bundle
   - `order` - Cart, billing, shipping, payment, totals models
   - `customer` - Account, address models
   - `pricing` - Price models for different pricing scenarios
   - `store` - Store and location models

3. **`get_sfra_document`** - Get detailed information about specific SFRA models
4. **`search_sfra_documentation`** - Find specific model functionality across all documentation

### **Recommended Model Documentation Workflow**

Before creating or extending models, use these tools to understand existing model patterns:

```javascript
// 1. Explore all available model categories
list_sfra_documents()

// 2. Examine product models for complex data structures
get_sfra_documents_by_category("product")
get_sfra_document("product-full") // Comprehensive product model

// 3. Study cart and order models for business logic patterns  
get_sfra_documents_by_category("order")
get_sfra_document("cart") // Complex cart model with totals and line items

// 4. Review customer models for profile management
get_sfra_documents_by_category("customer") 
get_sfra_document("account") // Customer account model

// 5. Search for specific model functionality
search_sfra_documentation("decorator")
search_sfra_documentation("model")
```

## Core Model Concepts

### What Are SFRA Models?

SFRA models serve as a JSON transformation layer that:

- **Convert** SFCC Script API objects into pure JSON objects
- **Apply** business logic specific to the storefront
- **Structure** data for optimal template rendering
- **Provide** a consistent interface between controllers and views

Models are passed to templates via the `viewData` variable (accessible as `pdict` in templates).

### Model Design Principles

1. **Pure JSON Output**: Models should return only JSON-serializable data
2. **Single Responsibility**: Each model should handle one specific domain
3. **Composability**: Models should be easily combinable and extensible
4. **Performance**: Minimize API calls and database queries within models
5. **Testability**: Models should be unit-testable with mock data

## Default SFRA Model Project Structure

Understanding the default SFRA model structure is essential for building consistent and maintainable e-commerce applications. The base SFRA cartridge (`app_storefront_base`) provides a comprehensive model library that follows established patterns and conventions.

### Directory Organization

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
│   ├── productAttributes.js     # Product attributes model
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

### Key Model Categories

#### **1. Core Commerce Models**
- **`cart.js`** - Central shopping cart model with totals, line items, and promotions
- **`order.js`** - Order model for order history and confirmation pages
- **`account.js`** - Customer account information and preferences
- **`payment.js`** - Payment instruments and billing information

#### **2. Product Models**
- **`product/fullProduct.js`** - Complete product details for PDP
- **`product/productTile.js`** - Lightweight product info for listings
- **`product/productBundle.js`** - Bundle product handling
- **`product/decorators/`** - Modular product enhancement functions

#### **3. Line Item Models**
- **`productLineItem/productLineItem.js`** - Cart line items
- **`productLineItem/orderLineItem.js`** - Order line items
- **`productLineItem/decorators/`** - Line item enhancement functions

#### **4. Pricing Models**
- **`price/default.js`** - Standard pricing model
- **`price/range.js`** - Price range for variable pricing
- **`price/tiered.js`** - Volume-based pricing tiers
- **`totals.js`** - Cart/order total calculations

#### **5. Location & Shipping Models**
- **`store.js`** & **`stores.js`** - Store locator functionality
- **`shipping.js`** - Shipping address and method selection
- **`address.js`** - Address transformation and validation

#### **6. Search Models**
- **`search/productSearch.js`** - Search results and refinements
- **`search/contentSearch.js`** - Content search functionality
- **`search/productSortOptions.js`** - Sorting options for search

### Model Inheritance Patterns

The SFRA model structure follows several key patterns:

#### **Decorator Pattern** (Product Models)
```javascript
// product/decorators/index.js - Central decorator registry
module.exports = {
    base: require('*/cartridge/models/product/decorators/base'),
    price: require('*/cartridge/models/product/decorators/price'),
    images: require('*/cartridge/models/product/decorators/images'),
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

#### **Composition Pattern** (Complex Models)
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

#### **Factory Pattern** (Conditional Models)
```javascript
// Different models based on product type
function createProductModel(apiProduct, type) {
    switch (type) {
        case 'full': return require('*/cartridge/models/product/fullProduct');
        case 'tile': return require('*/cartridge/models/product/productTile');
        case 'bundle': return require('*/cartridge/models/product/productBundle');
    }
}
```

### Best Practices for Structure

1. **Follow the Directory Convention**: Maintain the same directory structure in custom cartridges
2. **Use Decorator Registries**: Create `index.js` files to register and export decorators
3. **Separate Concerns**: Keep pricing, images, and availability in separate decorators
4. **Maintain Model Hierarchy**: Extend base models rather than replacing entirely
5. **Consistent Naming**: Follow SFRA naming conventions for predictable imports

This structure provides a solid foundation for building scalable, maintainable e-commerce models that integrate seamlessly with the SFRA framework.

## Model Architecture Patterns

### 1. Simple Data Models

Basic models that transform API objects into JSON structures:

```javascript
'use strict';

/**
 * Address Model - Transforms dw.customer.OrderAddress into JSON
 * @param {dw.customer.OrderAddress} addressObject - Address from SFCC API
 * @constructor
 */
function Address(addressObject) {
    if (addressObject) {
        this.address = {
            firstName: addressObject.firstName,
            lastName: addressObject.lastName,
            address1: addressObject.address1,
            address2: addressObject.address2,
            city: addressObject.city,
            postalCode: addressObject.postalCode,
            stateCode: addressObject.stateCode,
            countryCode: addressObject.countryCode.value,
            phone: addressObject.phone
        };
    }
}

module.exports = Address;
```

### 2. Decorator Pattern Models

Complex models using the decorator pattern for modular composition:

```javascript
'use strict';

var decorators = require('*/cartridge/models/product/decorators/index');

/**
 * Full Product Model using Decorator Pattern
 * @param {dw.catalog.Product} apiProduct - Product from SFCC API
 * @param {Object} options - Configuration options
 * @returns {Object} - Decorated product model
 */
function fullProduct(product, apiProduct, options) {
    // Base product information
    decorators.base(product, apiProduct, options.productType);
    
    // Price information with promotions
    decorators.price(product, apiProduct, options.promotions, false, options.optionModel);
    
    // Images with different sizes
    if (options.variationModel) {
        decorators.images(product, options.variationModel, { 
            types: ['large', 'small'], 
            quantity: 'all' 
        });
    } else {
        decorators.images(product, apiProduct, { 
            types: ['large', 'small'], 
            quantity: 'all' 
        });
    }
    
    // Additional decorators for complete product information
    decorators.quantity(product, apiProduct, options.quantity);
    decorators.variationAttributes(product, options.variationModel, {
        attributes: '*',
        endPoint: 'Variation'
    });
    decorators.description(product, apiProduct);
    decorators.ratings(product);
    decorators.promotions(product, options.promotions);
    decorators.attributes(product, apiProduct.attributeModel);
    decorators.availability(product, options.quantity, apiProduct.minOrderQuantity.value, apiProduct.availabilityModel);
    decorators.options(product, options.optionModel, options.variables, options.quantity);
    
    return product;
}

module.exports = fullProduct;
```

**⚠️ CRITICAL DECORATOR WARNING**

**NEVER** create decorators that return a new object or use `Object.assign()` to clone the product. This breaks the SFRA model pattern and causes unpredictable behavior:

```javascript
// ❌ WRONG: Never do this in a decorator
module.exports = function randomString(product) {
    var decoratedProduct = Object.assign({}, product);
    decoratedProduct.randomString = Math.random().toString(36).substring(2, 15);
    return decoratedProduct;  // This breaks the model!
};
```

**Why this breaks models:**
- Decorators should **mutate** the original product object, not create copies
- Returning a new object breaks the reference chain between decorators
- Subsequent decorators will operate on the wrong object
- The final model will be incomplete or corrupted

```javascript
// ✅ CORRECT: Mutate the original object
module.exports = function randomString(product) {
    product.randomString = Math.random().toString(36).substring(2, 15);
    // No return statement - decorators modify in place
};
```

**Decorator Best Practices:**
1. **Mutate, don't clone** - Always modify the passed product object directly
2. **No return values** - Decorators should not return anything
3. **Side effects only** - Decorators should only add/modify properties
4. **Reference preservation** - Keep the original object reference intact

### 3. Factory Pattern Models

Models that create different types based on input:

```javascript
'use strict';

var ProductFactory = require('*/cartridge/scripts/factories/product');
var fullProduct = require('*/cartridge/models/product/fullProduct');
var productTile = require('*/cartridge/models/product/productTile');

/**
 * Product Model Factory
 * @param {dw.catalog.Product} apiProduct - Product from API
 * @param {Object} options - Configuration options
 * @param {string} type - Model type ('full', 'tile', 'bundle')
 * @returns {Object} - Appropriate product model
 */
function create(apiProduct, options, type) {
    var product = {};
    
    switch (type) {
        case 'full':
            return fullProduct(product, apiProduct, options);
        case 'tile':
            return productTile(product, apiProduct, options);
        case 'bundle':
            return bundleProduct(product, apiProduct, options);
        default:
            return fullProduct(product, apiProduct, options);
    }
}

module.exports = {
    get: create
};
```

## Model Customization Strategies

### 1. Extending Base Models

Override base models by creating a model with the same name in your custom cartridge:

```javascript
'use strict';

// Import the base model
var base = module.superModule;

/**
 * Extended Account Model with additional customer data
 * @param {dw.customer.Customer} currentCustomer - Current customer
 * @param {Object} addressBook - Customer's address book
 * @param {Object} orderHistory - Customer's order history
 * @constructor
 */
function Account(currentCustomer, addressBook, orderHistory) {
    // Call base constructor
    base.call(this, currentCustomer, addressBook, orderHistory);
    
    // Add custom properties
    this.loyaltyProgram = getLoyaltyProgram(currentCustomer);
    this.preferences = getCustomerPreferences(currentCustomer);
    this.communicationPreferences = getCommunicationPreferences(currentCustomer);
}

/**
 * Get customer loyalty program information
 * @param {dw.customer.Customer} customer - Customer object
 * @returns {Object} Loyalty program data
 */
function getLoyaltyProgram(customer) {
    if (customer && customer.profile && customer.profile.custom.loyaltyNumber) {
        return {
            number: customer.profile.custom.loyaltyNumber,
            tier: customer.profile.custom.loyaltyTier || 'Bronze',
            points: customer.profile.custom.loyaltyPoints || 0
        };
    }
    return null;
}

/**
 * Get customer preferences
 * @param {dw.customer.Customer} customer - Customer object  
 * @returns {Object} Customer preferences
 */
function getCustomerPreferences(customer) {
    if (customer && customer.profile) {
        return {
            language: customer.profile.custom.preferredLanguage || 'en',
            currency: customer.profile.custom.preferredCurrency || 'USD',
            newsletter: customer.profile.custom.newsletterSubscription || false
        };
    }
    return {};
}

module.exports = Account;
```

### 2. Creating New Decorators

Add new functionality through custom decorators:

```javascript
'use strict';

/**
 * Social Media Decorator - Adds social sharing data to product
 * @param {Object} product - Product model to decorate
 * @param {dw.catalog.Product} apiProduct - Product from API
 */
module.exports = function socialMedia(product, apiProduct) {
    var URLUtils = require('dw/web/URLUtils');
    var Site = require('dw/system/Site');
    
    var socialData = {};
    
    // Facebook sharing
    socialData.facebook = {
        url: URLUtils.https('Product-Show', 'pid', apiProduct.ID).toString(),
        title: apiProduct.name,
        description: apiProduct.shortDescription ? apiProduct.shortDescription.markup : '',
        image: getProductImage(apiProduct, 'large')
    };
    
    // Twitter sharing
    socialData.twitter = {
        url: URLUtils.https('Product-Show', 'pid', apiProduct.ID).toString(),
        text: apiProduct.name + ' - ' + Site.getCurrent().getName(),
        hashtags: getProductHashtags(apiProduct)
    };
    
    // Pinterest sharing
    socialData.pinterest = {
        url: URLUtils.https('Product-Show', 'pid', apiProduct.ID).toString(),
        description: apiProduct.name,
        media: getProductImage(apiProduct, 'large')
    };
    
    Object.defineProperty(product, 'social', {
        enumerable: true,
        value: socialData
    });
};

/**
 * Get product image for social sharing
 * @param {dw.catalog.Product} apiProduct - Product from API
 * @param {string} size - Image size
 * @returns {string} Image URL
 */
function getProductImage(apiProduct, size) {
    var images = apiProduct.getImages(size);
    return images.length > 0 ? images[0].getURL().toString() : '';
}

/**
 * Generate hashtags from product attributes
 * @param {dw.catalog.Product} apiProduct - Product from API
 * @returns {string} Comma-separated hashtags
 */
function getProductHashtags(apiProduct) {
    var hashtags = [];
    
    if (apiProduct.brand) {
        hashtags.push(apiProduct.brand.replace(/\s+/g, ''));
    }
    
    if (apiProduct.primaryCategory) {
        hashtags.push(apiProduct.primaryCategory.displayName.replace(/\s+/g, ''));
    }
    
    return hashtags.join(',');
}
```

### 3. Adding Custom Properties to Existing Models

Use controller logic to extend models without modifying base files:

```javascript
'use strict';

var server = require('server');
var ProductMgr = require('dw/catalog/ProductMgr');
var ProductFactory = require('*/cartridge/scripts/factories/product');

server.get('Show', function (req, res, next) {
    var productId = req.querystring.pid;
    var product = ProductMgr.getProduct(productId);
    
    if (!product) {
        res.setStatusCode(404);
        res.render('error/notFound');
        return next();
    }
    
    // Create base product model
    var productModel = ProductFactory.get({
        product: product,
        variationModel: product.variationModel,
        options: req.querystring,
        promotions: null,
        quantity: parseInt(req.querystring.quantity, 10) || 1,
        variables: null,
        apiProduct: product,
        productType: product.productType
    });
    
    // Add custom properties
    productModel.customAttributes = getCustomAttributes(product);
    productModel.relatedProducts = getRelatedProducts(product);
    productModel.reviews = getProductReviews(product);
    productModel.availability = getStoreAvailability(product);
    
    res.render('product/productDetails', {
        product: productModel
    });
    
    next();
});

/**
 * Get custom attributes for product
 * @param {dw.catalog.Product} product - Product object
 * @returns {Object} Custom attributes
 */
function getCustomAttributes(product) {
    var customAttributes = {};
    
    if (product.custom) {
        customAttributes.sustainabilityRating = product.custom.sustainabilityRating;
        customAttributes.madeIn = product.custom.madeIn;
        customAttributes.careInstructions = product.custom.careInstructions;
    }
    
    return customAttributes;
}

module.exports = server.exports();
```

## Advanced Model Patterns

### 1. Composite Models

Combine multiple models into complex structures:

```javascript
'use strict';

var CartModel = require('*/cartridge/models/cart');
var AccountModel = require('*/cartridge/models/account');
var AddressModel = require('*/cartridge/models/address');

/**
 * Checkout Model - Composite model for checkout page
 * @param {dw.order.Basket} basket - Current basket
 * @param {dw.customer.Customer} customer - Current customer
 * @param {Object} options - Additional options
 * @constructor
 */
function Checkout(basket, customer, options) {
    // Cart information
    this.cart = new CartModel(basket);
    
    // Customer information
    if (customer && customer.authenticated) {
        this.customer = new AccountModel(customer);
        this.addresses = getCustomerAddresses(customer);
        this.paymentInstruments = getCustomerPaymentInstruments(customer);
    } else {
        this.customer = null;
        this.addresses = [];
        this.paymentInstruments = [];
    }
    
    // Checkout-specific data
    this.forms = getCheckoutForms();
    this.shipping = getShippingOptions(basket);
    this.payment = getPaymentOptions();
    this.order = getOrderSummary(basket);
}

/**
 * Get customer addresses as models
 * @param {dw.customer.Customer} customer - Customer object
 * @returns {Array} Array of address models
 */
function getCustomerAddresses(customer) {
    var addresses = [];
    var addressBook = customer.addressBook;
    
    if (addressBook && addressBook.addresses) {
        for (var i = 0; i < addressBook.addresses.length; i++) {
            addresses.push(new AddressModel(addressBook.addresses[i]));
        }
    }
    
    return addresses;
}

module.exports = Checkout;
```

### 2. Cached Models

Implement caching for expensive model operations:

```javascript
'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger');

var cache = CacheMgr.getCache('ProductRecommendations');
var logger = Logger.getLogger('models', 'ProductRecommendations');

/**
 * Product Recommendations Model with Caching
 * @param {dw.catalog.Product} product - Product for recommendations
 * @param {number} maxRecommendations - Maximum number of recommendations
 * @constructor
 */
function ProductRecommendations(product, maxRecommendations) {
    this.recommendations = getRecommendations(product, maxRecommendations || 4);
}

/**
 * Get product recommendations with caching
 * @param {dw.catalog.Product} product - Product object
 * @param {number} maxRecommendations - Maximum recommendations
 * @returns {Array} Array of recommended products
 */
function getRecommendations(product, maxRecommendations) {
    var cacheKey = 'recommendations_' + product.ID + '_' + maxRecommendations;
    var cachedRecommendations = cache.get(cacheKey);
    
    if (cachedRecommendations) {
        logger.debug('Using cached recommendations for product: {0}', product.ID);
        return cachedRecommendations;
    }
    
    logger.debug('Generating new recommendations for product: {0}', product.ID);
    
    var recommendations = [];
    var recommendedProducts = product.getRecommendations();

    if (recommendedProducts) {
        var ProductFactory = require('*/cartridge/scripts/factories/product');
        var iterator = recommendedProducts.iterator();

        while (iterator.hasNext() && recommendations.length < maxRecommendations) {
            var recommendedProduct = iterator.next();
            if (recommendedProduct.online) {
                var productModel = ProductFactory.get({
                    product: recommendedProduct,
                    variationModel: recommendedProduct.variationModel,
                    options: {},
                    promotions: null,
                    quantity: 1,
                    variables: null,
                    apiProduct: recommendedProduct,
                    productType: recommendedProduct.productType
                });
                
                recommendations.push(productModel);
            }
        }
    }
    
    // Cache for 1 hour
    cache.put(cacheKey, recommendations, 3600);
    
    return recommendations;
}

module.exports = ProductRecommendations;
```

## Model Testing Strategies

### Unit Testing Models

```javascript
'use strict';

var assert = require('chai').assert;
var AccountModel = require('../../../cartridges/app_custom/cartridge/models/account');

describe('Account Model', function() {
    var mockCustomer;
    var mockProfile;
    var mockAddressBook;
    
    beforeEach(function() {
        mockProfile = {
            firstName: 'John',
            lastName: 'Doe', 
            email: 'john.doe@example.com',
            custom: {
                loyaltyNumber: 'LP123456',
                loyaltyTier: 'Gold',
                loyaltyPoints: 1500
            }
        };
        
        mockCustomer = {
            authenticated: true,
            profile: mockProfile
        };
        
        mockAddressBook = {
            addresses: []
        };
    });
    
    describe('Constructor', function() {
        it('should create account with loyalty program data', function() {
            var account = new AccountModel(mockCustomer, mockAddressBook, {});
            
            assert.isNotNull(account.loyaltyProgram);
            assert.equal(account.loyaltyProgram.number, 'LP123456');
            assert.equal(account.loyaltyProgram.tier, 'Gold');
            assert.equal(account.loyaltyProgram.points, 1500);
        });
        
        it('should handle customer without loyalty program', function() {
            delete mockCustomer.profile.custom;
            var account = new AccountModel(mockCustomer, mockAddressBook, {});
            
            assert.isNull(account.loyaltyProgram);
        });
    });
});
```

## Performance Best Practices

### 1. Minimize API Calls

```javascript
// ❌ Bad: Multiple API calls in loop
function getBadProductData(productIds) {
    var products = [];
    for (var i = 0; i < productIds.length; i++) {
        var product = ProductMgr.getProduct(productIds[i]); // API call per product
        products.push(transformProduct(product));
    }
    return products;
}

// ✅ Good: Single API call with batch processing
function getGoodProductData(productIds) {
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var searchModel = new ProductSearchModel();
    searchModel.setProductIDs(productIds);
    searchModel.search();
    
    var products = [];
    var productHits = searchModel.getProductSearchHits();
    
    while (productHits.hasNext()) {
        var productHit = productHits.next();
        products.push(transformProduct(productHit.product));
    }
    
    return products;
}
```

### 2. Lazy Loading Properties

```javascript
'use strict';

/**
 * Product Model with Lazy Loading
 */
function Product(apiProduct) {
    this.id = apiProduct.ID;
    this.name = apiProduct.name;
    
    // Lazy load expensive properties
    Object.defineProperty(this, 'recommendations', {
        get: function() {
            if (!this._recommendations) {
                this._recommendations = getProductRecommendations(apiProduct);
            }
            return this._recommendations;
        },
        enumerable: true
    });
}
```

### 3. Efficient Data Transformation

```javascript
'use strict';

var collections = require('*/cartridge/scripts/util/collections');

/**
 * Transform collection efficiently using collections.map
 */
function transformProductLineItems(lineItems) {
    return collections.map(lineItems, function(lineItem) {
        return {
            productID: lineItem.productID,
            productName: lineItem.productName,
            price: lineItem.price.value,
            quantity: lineItem.quantity.value
        };
    });
}

/**
 * Filter and transform in single pass
 */
function getAvailableProducts(products) {
    return collections.map(
        collections.select(products, function(product) {
            return product.online && product.availabilityModel.available;
        }),
        function(product) {
            return transformProductTile(product);
        }
    );
}
```

## Security Considerations

### 1. Data Sanitization

```javascript
'use strict';

var StringUtils = require('dw/util/StringUtils');

/**
 * Sanitize user-generated content in models
 */
function sanitizeCustomerData(customer) {
    return {
        firstName: StringUtils.encodeString(customer.profile.firstName, StringUtils.ENCODE_TYPE_HTML),
        lastName: StringUtils.encodeString(customer.profile.lastName, StringUtils.ENCODE_TYPE_HTML),
        email: customer.profile.email // Email validation handled elsewhere
    };
}

/**
 * Remove sensitive data from model output
 */
function sanitizePaymentInstrument(paymentInstrument) {
    return {
        UUID: paymentInstrument.UUID,
        maskedCreditCardNumber: paymentInstrument.maskedCreditCardNumber,
        creditCardType: paymentInstrument.creditCardType,
        // Never expose: creditCardNumber, securityCode
        expirationMonth: paymentInstrument.expirationMonth,
        expirationYear: paymentInstrument.expirationYear
    };
}
```

### 2. Access Control in Models

```javascript
'use strict';

/**
 * Customer Model with Privacy Controls
 */
function Customer(apiCustomer, viewingCustomer) {
    // Public information always available
    this.customerNumber = apiCustomer.customerNo;
    
    // Private information only for authenticated customer
    if (viewingCustomer && viewingCustomer.UUID === apiCustomer.UUID) {
        this.profile = getCustomerProfile(apiCustomer);
        this.addresses = getCustomerAddresses(apiCustomer);
        this.orders = getCustomerOrders(apiCustomer);
    }
    
    // Admin-only information
    if (viewingCustomer && hasAdminPermission(viewingCustomer)) {
        this.internalNotes = apiCustomer.custom.internalNotes;
        this.riskScore = apiCustomer.custom.riskScore;
    }
}
```

## Model Documentation Standards

### JSDoc Documentation

```javascript
'use strict';

/**
 * Enhanced Product Model
 * 
 * @namespace ProductModel
 * @description Provides a comprehensive JSON representation of SFCC Product objects
 * with additional business logic for storefront display
 */

/**
 * Create enhanced product model
 * 
 * @memberof ProductModel
 * @param {dw.catalog.Product} apiProduct - SFCC Product API object
 * @param {Object} options - Configuration options for model creation
 * @param {dw.catalog.ProductVariationModel} options.variationModel - Product variation model
 * @param {number} options.quantity - Selected quantity for pricing calculations  
 * @param {dw.util.Collection<dw.campaign.Promotion>} options.promotions - Active promotions
 * @param {Object} options.variables - Additional variables from request
 * 
 * @returns {Object} Enhanced product model with following structure:
 * @returns {string} returns.id - Product ID
 * @returns {string} returns.productName - Localized product name
 * @returns {string} returns.productType - Type: 'master', 'variant', 'simple', 'bundle', 'set'
 * @returns {Object} returns.price - Price information with sales/list prices
 * @returns {Array<Object>} returns.images - Product images in various sizes
 * @returns {Object} returns.availability - Availability and inventory information
 * @returns {Array<Object>} returns.variationAttributes - Available variation attributes
 * @returns {string} returns.longDescription - Full product description
 * @returns {Object} returns.custom - Custom product attributes
 * 
 * @throws {Error} Throws error if apiProduct is null or undefined
 * 
 * @since 1.0.0
 * @version 2.1.0 - Added sustainability attributes
 */
function createEnhancedProduct(apiProduct, options) {
    // Implementation here
}
```

## Common Model Patterns & Anti-Patterns

### ✅ Good Patterns

```javascript
// 1. Consistent constructor pattern
function ModelName(apiObject, options) {
    this.property = transformProperty(apiObject.property);
}

// 2. Use Object.defineProperty for computed properties
Object.defineProperty(this, 'computedProperty', {
    enumerable: true,
    value: calculateValue()
});

// 3. Separate transformation logic into functions
function transformPrice(apiPrice) {
    return {
        value: apiPrice.value,
        currency: apiPrice.currencyCode,
        formatted: StringUtils.formatMoney(apiPrice)
    };
}

// 4. Use factory pattern for complex models
var ProductFactory = {
    get: function(options) {
        return createProductModel(options);
    }
};
```

### ❌ Anti-Patterns to Avoid

```javascript
// 1. Don't put business logic in templates
// ❌ Bad: Logic in ISML template
<isif condition="${pdict.product.price.value > 100 && pdict.customer.tier === 'gold'}">
    <!-- discount logic -->
</isif>

// ✅ Good: Logic in model
function Product(apiProduct, customer) {
    this.showGoldDiscount = apiProduct.price.value > 100 && customer.tier === 'gold';
}

// 2. Don't make API calls in model getters
// ❌ Bad: API call in getter
Object.defineProperty(this, 'recommendations', {
    get: function() {
        return apiProduct.getRecommendations(); // Expensive API call
    }
});

// ✅ Good: Pre-compute in constructor or use caching
function Product(apiProduct) {
    this.recommendations = getRecommendationsWithCache(apiProduct);
}

// 3. Don't expose API objects directly
// ❌ Bad: Exposing API object
this.product = apiProduct; // Exposes entire API object

// ✅ Good: Extract needed properties
this.id = apiProduct.ID;
this.name = apiProduct.name;
```

## Integration with Controllers

### Model Usage in Controllers

```javascript
'use strict';

var server = require('server');
var BasketMgr = require('dw/order/BasketMgr');
var CartModel = require('*/cartridge/models/cart');
var AccountModel = require('*/cartridge/models/account');

server.post('AddToCart', function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var customer = req.currentCustomer;
    
    // Perform cart operations
    var result = addProductToCart(req.form.pid, req.form.quantity);
    
    if (result.success) {
        // Create models for response
        var cartModel = new CartModel(currentBasket);
        
        // Add customer-specific data if authenticated
        if (customer.authenticated) {
            var accountModel = new AccountModel(customer.raw);
            cartModel.customer = accountModel;
        }
        
        // Return JSON response with models
        res.json({
            success: true,
            cart: cartModel,
            message: Resource.msg('cart.add.success', 'cart', null)
        });
    } else {
        res.json({
            success: false,
            error: result.error
        });
    }
    
    next();
});
```

This comprehensive guide covers all aspects of SFRA model development, from basic patterns to advanced techniques. Use this skill alongside the **sfcc-sfra-controllers** skill to understand how models integrate with the controller layer.
