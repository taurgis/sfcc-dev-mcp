# SFRA Model Testing & Security Reference

Complete reference for testing, performance optimization, and security considerations for SFRA models.

## Unit Testing Models

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

## Testing Decorators

```javascript
'use strict';

var assert = require('chai').assert;
var socialMedia = require('../../../cartridge/models/product/decorators/socialMedia');

describe('Social Media Decorator', function() {
    var mockProduct;
    var mockApiProduct;
    
    beforeEach(function() {
        mockProduct = {};
        mockApiProduct = {
            ID: 'test-product',
            name: 'Test Product',
            shortDescription: { markup: 'Test description' },
            brand: 'TestBrand',
            primaryCategory: { displayName: 'Test Category' },
            getImages: function() {
                return [{ getURL: function() { return 'http://example.com/image.jpg'; }}];
            }
        };
    });
    
    it('should add social sharing data to product', function() {
        socialMedia(mockProduct, mockApiProduct);
        
        assert.isDefined(mockProduct.social);
        assert.isDefined(mockProduct.social.facebook);
        assert.isDefined(mockProduct.social.twitter);
        assert.isDefined(mockProduct.social.pinterest);
    });
    
    it('should not return a new object', function() {
        var result = socialMedia(mockProduct, mockApiProduct);
        
        assert.isUndefined(result); // Decorators should not return
        assert.isDefined(mockProduct.social); // Should mutate original
    });
});
```

## Performance Best Practices

### Minimize API Calls

```javascript
// ❌ Bad: Multiple API calls in loop
function getBadProductData(productIds) {
    var products = [];
    for (var i = 0; i < productIds.length; i++) {
        var product = ProductMgr.getProduct(productIds[i]); // API call per product!
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

### Efficient Data Transformation

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

### Caching Strategies

```javascript
'use strict';

var CacheMgr = require('dw/system/CacheMgr');

// Use appropriate cache for the data type
var shortTermCache = CacheMgr.getCache('ShortTerm');     // Minutes
var mediumTermCache = CacheMgr.getCache('MediumTerm');   // Hours
var longTermCache = CacheMgr.getCache('LongTerm');       // Days

// Cache expensive computations
function getCachedRecommendations(productId, maxItems) {
    var cacheKey = 'recs_' + productId + '_' + maxItems;
    var cached = mediumTermCache.get(cacheKey);
    
    if (cached) {
        return cached;
    }
    
    var recommendations = computeRecommendations(productId, maxItems);
    mediumTermCache.put(cacheKey, recommendations, 3600); // 1 hour
    
    return recommendations;
}
```

## Security Considerations

### Data Sanitization

```javascript
'use strict';

var StringUtils = require('dw/util/StringUtils');

/**
 * Sanitize user-generated content in models
 */
function sanitizeCustomerData(customer) {
    return {
        firstName: StringUtils.encodeString(
            customer.profile.firstName, 
            StringUtils.ENCODE_TYPE_HTML
        ),
        lastName: StringUtils.encodeString(
            customer.profile.lastName, 
            StringUtils.ENCODE_TYPE_HTML
        ),
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
        // NEVER expose: creditCardNumber, securityCode
        expirationMonth: paymentInstrument.expirationMonth,
        expirationYear: paymentInstrument.expirationYear
    };
}
```

### Access Control in Models

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

function hasAdminPermission(customer) {
    // Check customer group membership
    return customer.customerGroups.some(function(group) {
        return group.ID === 'Administrators';
    });
}
```

### Preventing Data Leaks

```javascript
// ❌ Bad: Returning entire API object
function getProductData(product) {
    return {
        product: product // Exposes all API methods and properties!
    };
}

// ✅ Good: Whitelist specific properties
function getProductData(product) {
    return {
        id: product.ID,
        name: product.name,
        price: product.priceModel.price.value,
        available: product.availabilityModel.available
        // Only expose what's needed
    };
}
```

## JSDoc Documentation Standards

```javascript
'use strict';

/**
 * Enhanced Product Model
 * 
 * @namespace ProductModel
 * @description Provides a comprehensive JSON representation of SFCC Product objects
 */

/**
 * Create enhanced product model
 * 
 * @memberof ProductModel
 * @param {dw.catalog.Product} apiProduct - SFCC Product API object
 * @param {Object} options - Configuration options
 * @param {dw.catalog.ProductVariationModel} options.variationModel - Variation model
 * @param {number} options.quantity - Selected quantity  
 * @param {dw.util.Collection<dw.campaign.Promotion>} options.promotions - Active promotions
 * 
 * @returns {Object} Enhanced product model with following structure:
 * @returns {string} returns.id - Product ID
 * @returns {string} returns.productName - Localized product name
 * @returns {string} returns.productType - Type: 'master', 'variant', 'simple', 'bundle', 'set'
 * @returns {Object} returns.price - Price information
 * @returns {Array<Object>} returns.images - Product images
 * @returns {Object} returns.availability - Availability information
 * 
 * @throws {Error} Throws error if apiProduct is null or undefined
 * 
 * @since 1.0.0
 * @version 2.1.0 - Added sustainability attributes
 */
function createEnhancedProduct(apiProduct, options) {
    if (!apiProduct) {
        throw new Error('apiProduct is required');
    }
    // Implementation
}

module.exports = createEnhancedProduct;
```

## Controller Integration Pattern

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

module.exports = server.exports();
```

## Test Coverage Guidelines

| Model Type | Required Tests |
|------------|----------------|
| Simple Data Models | Constructor, null handling, property mapping |
| Decorator Models | Mutation (not cloning), property addition, edge cases |
| Factory Models | Each variant, default case, invalid type handling |
| Composite Models | Sub-model creation, null components, integration |
| Cached Models | Cache hit, cache miss, expiration, key generation |

## Performance Testing

```javascript
describe('Model Performance', function() {
    it('should create product model in under 50ms', function() {
        var start = Date.now();
        
        for (var i = 0; i < 100; i++) {
            new ProductModel(mockApiProduct, mockOptions);
        }
        
        var elapsed = Date.now() - start;
        var avgTime = elapsed / 100;
        
        assert.isBelow(avgTime, 50, 'Average model creation should be under 50ms');
    });
});
```
