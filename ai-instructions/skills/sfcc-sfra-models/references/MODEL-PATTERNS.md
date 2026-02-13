# SFRA Model Patterns Reference

Complete reference for model architecture patterns, decorators, and advanced techniques.

## Simple Data Models

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

## Decorator Pattern Models

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
    
    // Additional decorators
    decorators.quantity(product, apiProduct, options.quantity);
    decorators.variationAttributes(product, options.variationModel, {
        attributes: '*',
        endPoint: 'Variation'
    });
    decorators.description(product, apiProduct);
    decorators.ratings(product);
    decorators.promotions(product, options.promotions);
    decorators.attributes(product, apiProduct.attributeModel);
    decorators.availability(product, options.quantity, 
        apiProduct.minOrderQuantity.value, apiProduct.availabilityModel);
    decorators.options(product, options.optionModel, options.variables, options.quantity);
    
    return product;
}

module.exports = fullProduct;
```

## Critical Decorator Rules

**NEVER** create decorators that return a new object or use `Object.assign()`:

```javascript
// ❌ WRONG: Never do this in a decorator
module.exports = function randomString(product) {
    var decoratedProduct = Object.assign({}, product);
    decoratedProduct.randomString = Math.random().toString(36).substring(2, 15);
    return decoratedProduct;  // This breaks the model!
};
```

**Why this breaks models:**
- Decorators must **mutate** the original product object, not create copies
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

## Creating Custom Decorators

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

function getProductImage(apiProduct, size) {
    var images = apiProduct.getImages(size);
    return images.length > 0 ? images[0].getURL().toString() : '';
}

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

## Factory Pattern Models

```javascript
'use strict';

var fullProduct = require('*/cartridge/models/product/fullProduct');
var productTile = require('*/cartridge/models/product/productTile');
var bundleProduct = require('*/cartridge/models/product/productBundle');

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

## Composite Models

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

## Cached Models

Implement caching for expensive model operations:

```javascript
'use strict';

var CacheMgr = require('dw/system/CacheMgr');
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

## Lazy Loading Properties

```javascript
'use strict';

/**
 * Product Model with Lazy Loading
 */
function Product(apiProduct) {
    this.id = apiProduct.ID;
    this.name = apiProduct.name;
    
    var _recommendations;
    
    // Lazy load expensive properties
    Object.defineProperty(this, 'recommendations', {
        get: function() {
            if (!_recommendations) {
                _recommendations = getProductRecommendations(apiProduct);
            }
            return _recommendations;
        },
        enumerable: true
    });
}

module.exports = Product;
```

## Extending Base Models

Override base models using `module.superModule`:

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

## Adding Custom Properties in Controllers

Extend models without modifying base files:

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

## Common Anti-Patterns to Avoid

### ❌ Business Logic in Templates

```javascript
// ❌ Bad: Logic in ISML template
// <isif condition="${pdict.product.price.value > 100 && pdict.customer.tier === 'gold'}">
//     <!-- discount logic -->
// </isif>

// ✅ Good: Logic in model
function Product(apiProduct, customer) {
    this.showGoldDiscount = apiProduct.price.value > 100 && customer.tier === 'gold';
}
```

### ❌ API Calls in Getters

```javascript
// ❌ Bad: API call in getter
Object.defineProperty(this, 'recommendations', {
    get: function() {
        return apiProduct.getRecommendations(); // Expensive API call every access!
    }
});

// ✅ Good: Pre-compute or cache
function Product(apiProduct) {
    this.recommendations = getRecommendationsWithCache(apiProduct);
}
```

### ❌ Exposing API Objects

```javascript
// ❌ Bad: Exposing entire API object
this.product = apiProduct; // Exposes non-JSON, may leak methods

// ✅ Good: Extract needed properties
this.id = apiProduct.ID;
this.name = apiProduct.name;
this.brand = apiProduct.brand;
```
