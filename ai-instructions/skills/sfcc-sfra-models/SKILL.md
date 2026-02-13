---
name: sfcc-sfra-models
description: Guide for creating, extending, and customizing models within SFRA. Use this when asked to develop product models, cart models, customer models, or any JSON transformation layer in SFCC.
---

# SFRA Models Development Skill

This skill guides you through creating and extending models in Salesforce B2C Commerce SFRA.

**IMPORTANT**: Before developing SFRA models, consult the **sfcc-performance** skill for database optimization and index-friendly API usage.

## Quick Checklist

```text
[ ] Model returns pure JSON (no API objects)
[ ] Decorators mutate objects, never clone/return
[ ] Expensive properties use lazy loading or caching
[ ] Sensitive data is sanitized or excluded
[ ] Custom cartridge mirrors base structure
[ ] Unit tests cover constructor and edge cases
```

## What Are SFRA Models?

SFRA models are a JSON transformation layer that:
- **Convert** SFCC Script API objects into pure JSON
- **Apply** business logic specific to the storefront
- **Structure** data for optimal template rendering
- **Provide** a consistent interface between controllers and views

Models are passed to templates via `viewData` (accessible as `pdict` in templates).

## Model Design Principles

1. **Pure JSON Output** - Return only JSON-serializable data
2. **Single Responsibility** - Each model handles one domain
3. **Composability** - Models should be easily combinable
4. **Performance** - Minimize API calls and database queries
5. **Testability** - Models should be unit-testable with mock data

## Basic Model Pattern

```javascript
'use strict';

/**
 * Address Model
 * @param {dw.customer.OrderAddress} addressObject - Address from API
 * @constructor
 */
function Address(addressObject) {
    if (addressObject) {
        this.address = {
            firstName: addressObject.firstName,
            lastName: addressObject.lastName,
            address1: addressObject.address1,
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

## Decorator Pattern

SFRA uses decorators for modular product composition:

```javascript
'use strict';

var decorators = require('*/cartridge/models/product/decorators/index');

function fullProduct(product, apiProduct, options) {
    decorators.base(product, apiProduct, options.productType);
    decorators.price(product, apiProduct, options.promotions);
    decorators.images(product, apiProduct, { types: ['large', 'small'] });
    decorators.availability(product, options.quantity, 
        apiProduct.minOrderQuantity.value, apiProduct.availabilityModel);
    return product;
}

module.exports = fullProduct;
```

### Critical Decorator Rule

**NEVER** create decorators that return a new object:

```javascript
// ❌ WRONG - Breaks the model chain
module.exports = function myDecorator(product) {
    var decorated = Object.assign({}, product);
    decorated.myProp = 'value';
    return decorated;  // DON'T DO THIS
};

// ✅ CORRECT - Mutate in place
module.exports = function myDecorator(product) {
    product.myProp = 'value';
    // No return - decorators modify in place
};
```

**Why:** Returning a new object breaks the reference chain. Subsequent decorators operate on the wrong object.

## Creating Custom Decorators

```javascript
'use strict';

/**
 * Sustainability Decorator
 */
module.exports = function sustainability(product, apiProduct) {
    Object.defineProperty(product, 'sustainability', {
        enumerable: true,
        value: {
            rating: apiProduct.custom.sustainabilityRating || 'N/A',
            materials: apiProduct.custom.sustainableMaterials || [],
            certifications: apiProduct.custom.ecoCertifications || []
        }
    });
};
```

Register in decorator index:

```javascript
// product/decorators/index.js
module.exports = {
    base: require('*/cartridge/models/product/decorators/base'),
    price: require('*/cartridge/models/product/decorators/price'),
    sustainability: require('*/cartridge/models/product/decorators/sustainability')
};
```

## Extending Base Models

Use `module.superModule` to extend base SFRA models:

```javascript
'use strict';

var base = module.superModule;

function Account(currentCustomer, addressBook, orderHistory) {
    // Call base constructor
    base.call(this, currentCustomer, addressBook, orderHistory);
    
    // Add custom properties
    this.loyaltyProgram = getLoyaltyProgram(currentCustomer);
}

function getLoyaltyProgram(customer) {
    if (customer?.profile?.custom?.loyaltyNumber) {
        return {
            number: customer.profile.custom.loyaltyNumber,
            tier: customer.profile.custom.loyaltyTier || 'Bronze',
            points: customer.profile.custom.loyaltyPoints || 0
        };
    }
    return null;
}

module.exports = Account;
```

## Factory Pattern

Create different model types based on input:

```javascript
'use strict';

function create(apiProduct, options, type) {
    var product = {};
    
    switch (type) {
        case 'full':
            return require('*/cartridge/models/product/fullProduct')(product, apiProduct, options);
        case 'tile':
            return require('*/cartridge/models/product/productTile')(product, apiProduct, options);
        case 'bundle':
            return require('*/cartridge/models/product/productBundle')(product, apiProduct, options);
        default:
            return require('*/cartridge/models/product/fullProduct')(product, apiProduct, options);
    }
}

module.exports = { get: create };
```

## Performance Tips

### Minimize API Calls

```javascript
// ❌ Bad: API call per product
for (var i = 0; i < productIds.length; i++) {
    var product = ProductMgr.getProduct(productIds[i]);
}

// ✅ Good: Batch query
var searchModel = new ProductSearchModel();
searchModel.setProductIDs(productIds);
searchModel.search();
```

### Lazy Loading

```javascript
function Product(apiProduct) {
    this.id = apiProduct.ID;
    this.name = apiProduct.name;
    
    var _recommendations;
    Object.defineProperty(this, 'recommendations', {
        get: function() {
            if (!_recommendations) {
                _recommendations = getRecommendations(apiProduct);
            }
            return _recommendations;
        },
        enumerable: true
    });
}
```

### Caching

```javascript
var CacheMgr = require('dw/system/CacheMgr');
var cache = CacheMgr.getCache('ProductRecommendations');

function getCachedRecommendations(productId) {
    var cached = cache.get('recs_' + productId);
    if (cached) return cached;
    
    var recs = computeRecommendations(productId);
    cache.put('recs_' + productId, recs, 3600);
    return recs;
}
```

## Security Essentials

### Sanitize User Data

```javascript
var StringUtils = require('dw/util/StringUtils');

function sanitizeCustomerData(customer) {
    return {
        firstName: StringUtils.encodeString(
            customer.profile.firstName, 
            StringUtils.ENCODE_TYPE_HTML
        ),
        lastName: StringUtils.encodeString(
            customer.profile.lastName, 
            StringUtils.ENCODE_TYPE_HTML
        )
    };
}
```

### Never Expose Sensitive Data

```javascript
// ✅ Safe payment model
function sanitizePaymentInstrument(pi) {
    return {
        UUID: pi.UUID,
        maskedCreditCardNumber: pi.maskedCreditCardNumber,
        creditCardType: pi.creditCardType,
        // NEVER: creditCardNumber, securityCode
    };
}
```

## MCP Documentation Tools

Use these tools to explore existing SFRA models:

```javascript
// Discover all model documentation
list_sfra_documents()

// Explore by category
get_sfra_documents_by_category("product")
get_sfra_documents_by_category("order")

// Get specific model details
get_sfra_document("cart")
get_sfra_document("product-full")

// Search for patterns
search_sfra_documentation("decorator")
```

## Common Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Logic in templates | Hard to test, maintain | Move to model |
| API calls in getters | Performance hit each access | Pre-compute or cache |
| Exposing API objects | Non-JSON, security risk | Extract specific properties |
| Cloning in decorators | Breaks reference chain | Mutate in place |

## Related Skills

- **[sfcc-logging](../sfcc-logging/SKILL.md)** - Logging patterns for debugging models. Use log level checks before expensive debug logging.

## Detailed References

- [Model Structure](references/MODEL-STRUCTURE.md) - Complete directory structure and categories
- [Model Patterns](references/MODEL-PATTERNS.md) - Decorators, factories, composite models
- [Testing & Security](references/TESTING-SECURITY.md) - Unit testing, performance, security
