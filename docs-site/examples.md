---
title: Examples & Use Cases
layout: page
nav_order: 6
---

# 💡 Examples & Use Cases

Real-world examples of how to use the SFCC Development MCP Server with AI assistants for common development tasks.

## 🚀 Quick Start Examples

### Create a New SFCC Controller

**User:** "Create a new SFCC controller for product search with proper error handling"

**AI Assistant Response:**
```javascript
// Generated using SFRA best practices
'use strict';

var server = require('server');
var ProductSearchModel = require('*/cartridge/models/search');
var ProductFactory = require('*/cartridge/scripts/factories/product');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    var searchPhrase = req.querystring.q;
    var categoryId = req.querystring.cgid;
    
    try {
        var searchModel = new ProductSearchModel(req.querystring, req.locale.id);
        searchModel.search();
        
        if (!searchModel.count) {
            res.setStatusCode(404);
            res.render('error/notfound');
            return next();
        }
        
        var products = ProductFactory.get({
            products: searchModel.productIds,
            viewType: 'tile',
            variationModel: req.querystring.variationModel
        });
        
        res.render('search/searchresults', {
            searchModel: searchModel,
            products: products,
            searchPhrase: searchPhrase
        });
        
    } catch (e) {
        Logger.error('Product search error: ' + e.message);
        res.setStatusCode(500);
        res.render('error/somethingwentwrong');
    }
    
    next();
});

module.exports = server.exports();
```

*The AI automatically used SFRA patterns, proper error handling, caching middleware, and logging based on the best practices guides.*

---

## 🐛 Debugging Scenarios

### Investigate Checkout Errors

**User:** "My checkout flow is failing. Can you check the logs and help me debug?"

**AI Process:**
1. **Get Recent Errors:** `get_latest_error({ limit: 10 })`
2. **Search for Checkout Issues:** `search_logs({ pattern: "checkout", logLevel: "error" })`  
3. **Analyze Error Patterns:** Identifies common failure points
4. **Provide Solutions:** Based on error analysis and best practices

**Sample AI Response:**
> I found 3 checkout-related errors in the last hour:
> 
> 1. **Payment Authorization Failed** (5 occurrences)
>    - Error: `Credit card validation failed for order 00001234`
>    - **Solution:** Check payment processor configuration and card validation logic
> 
> 2. **Inventory Check Failed** (2 occurrences)  
>    - Error: `Product ABC123 not available in required quantity`
>    - **Solution:** Implement proper inventory validation in basket calculation hooks
>
> Based on SFCC best practices, I recommend adding these validation steps...

---

## 🏗️ Architecture & Planning

### Plan a Custom Integration

**User:** "I need to integrate with a third-party shipping service. What's the best approach?"

**AI Process:**
1. **Get Integration Guide:** `get_best_practice_guide({ guideName: "localserviceregistry" })`
2. **Review Service Patterns:** Provides OAuth and API integration examples
3. **Suggest Architecture:** Based on SFCC service integration patterns

**Sample AI Response:**
> For third-party shipping integration, I recommend this architecture:
> 
> **1. Service Configuration**
> ```javascript
> // Use LocalServiceRegistry for external API calls
> var ServiceRegistry = require('dw/svc/LocalServiceRegistry');
> 
> var shippingService = ServiceRegistry.createService('shipping.api', {
>     createRequest: function(svc, params) {
>         svc.setRequestMethod('POST');
>         svc.addHeader('Authorization', 'Bearer ' + params.token);
>         return JSON.stringify(params.shipment);
>     },
>     parseResponse: function(svc, response) {
>         return JSON.parse(response.text);
>     }
> });
> ```
> 
> **2. Hook Integration Points**
> - Use `dw.order.calculate` hook for rate calculation
> - Use `dw.order.shipmentShipped` for tracking updates
> 
> **3. Error Handling Strategy**
> - Implement circuit breaker pattern
> - Add fallback shipping options
> - Log all API interactions for debugging

---

## 📊 Data Model Exploration

### Discover Custom Attributes

**User:** "What custom attributes are available on the Product object in my instance?"

**AI Process:**
1. **Search Product Attributes:** `search_system_object_attribute_definitions({ objectType: "Product", searchRequest: { query: { match_all_query: {} } } })`
2. **Filter Custom Attributes:** Identifies non-system attributes
3. **Provide Usage Examples:** Shows how to access attributes in code

**Sample AI Response:**
> Found 12 custom attributes on your Product object:
> 
> | Attribute ID | Type | Required | Description |
> |--------------|------|----------|-------------|
> | `brandName` | String | No | Product brand identifier |
> | `sustainabilityRating` | Enum | No | Eco-friendly rating (1-5) |
> | `technicalSpecs` | Text | No | Technical specifications |
> 
> **Usage in Controllers:**
> ```javascript
> var product = ProductMgr.getProduct('product-id');
> var brandName = product.custom.brandName;
> var rating = product.custom.sustainabilityRating;
> ```
> 
> **Usage in Templates:**
> ```html
> <div class="product-brand">${product.custom.brandName}</div>
> <div class="sustainability-rating" data-rating="${product.custom.sustainabilityRating}">
> ```

---

## 🔧 Development Workflow Examples

### Set Up New Cartridge

**User:** "Create a new payment integration cartridge with proper structure"

**AI Process:**
1. **Generate Cartridge:** `generate_cartridge_structure({ cartridgeName: "int_payment_provider" })`
2. **Provide Setup Guide:** Based on cartridge creation best practices
3. **Suggest Next Steps:** Integration patterns and testing approaches

**Generated Structure:**
```
int_payment_provider/
├── cartridge/
│   ├── controllers/
│   │   └── PaymentProvider.js
│   ├── scripts/
│   │   ├── hooks/
│   │   │   └── payment.js
│   │   └── services/
│   │       └── PaymentProviderService.js
│   ├── templates/
│   │   └── default/
│   │       └── checkout/
│   │           └── paymentmethods.isml
│   ├── static/
│   │   └── default/
│   │       ├── js/
│   │       └── css/
│   └── client/
│       └── default/
│           └── js/
│               └── checkout/
├── package.json
├── webpack.config.js
└── .eslintrc.js
```

---

## 🔒 Security Review

### Audit ISML Templates

**User:** "Review my ISML templates for security vulnerabilities"

**AI Process:**
1. **Get Security Guide:** `get_best_practice_guide({ guideName: "security" })`
2. **Review Template Patterns:** Analyzes for XSS and injection risks
3. **Provide Remediation:** Specific fixes based on SFCC security practices

**Sample Security Review:**
> **Security Issues Found:**
> 
> ❌ **XSS Vulnerability** in `product/productdetails.isml`:
> ```html
> <!-- VULNERABLE: Unescaped output -->
> <div>${product.custom.description}</div>
> ```
> 
> ✅ **Fixed Version:**
> ```html
> <!-- SECURE: Properly escaped output -->
> <isprint value="${pdict.product.custom.description}" encoding="htmlcontent" />
> ```
> 
> ❌ **Missing CSRF Protection** in form submission:
> ```html
> <!-- VULNERABLE: No CSRF token -->
> <form action="${URLUtils.url('Cart-AddProduct')}" method="post">
> ```
> 
> ✅ **Fixed Version:**
> ```html
> <!-- SECURE: CSRF token included -->
> <form action="${URLUtils.url('Cart-AddProduct')}" method="post">
>     <input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}"/>
> ```

---

## 📈 Performance Optimization

### Optimize Slow Product Pages

**User:** "My product detail pages are loading slowly. Help me optimize them."

**AI Process:**
1. **Get Performance Guide:** `get_best_practice_guide({ guideName: "performance" })`
2. **Analyze Logs:** `search_logs({ pattern: "performance", logLevel: "warn" })`
3. **Provide Optimization Strategy:** Based on SFCC performance patterns

**Sample Performance Analysis:**
> **Performance Issues Identified:**
> 
> 1. **Database Query Optimization**
>    - 47ms average for product variant lookups
>    - **Solution:** Implement variant caching in product model
> 
> 2. **Image Loading Optimization**
>    - Multiple image service calls per product
>    - **Solution:** Use lazy loading and image optimization
> 
> 3. **Recommendation Engine Delays**
>    - 230ms for recommendation API calls
>    - **Solution:** Implement async loading with fallbacks
> 
> **Optimization Implementation:**
> ```javascript
> // Optimized product model with caching
> var CacheMgr = require('dw/system/CacheMgr');
> var cache = CacheMgr.getCache('ProductVariants');
> 
> function getProductWithVariants(productID) {
>     var cacheKey = 'product_' + productID;
>     var product = cache.get(cacheKey);
>     
>     if (!product) {
>         product = ProductMgr.getProduct(productID);
>         // Cache for 1 hour
>         cache.put(cacheKey, product, 3600);
>     }
>     
>     return product;
> }
> ```

---

## 🧪 Testing Patterns

### Create Unit Tests for Service

**User:** "Help me write unit tests for my payment service integration"

**AI Process:**
1. **Get Security Guide:** `get_best_practice_guide({ guideName: "security" })`
2. **Get Service Guide:** `get_best_practice_guide({ guideName: "localserviceregistry" })`
3. **Provide Test Structure:** Based on SFCC security and service best practices
4. **Generate Test Cases:** Covers success, failure, and edge cases

**Generated Test Suite:**
```javascript
// Test suite for PaymentProviderService
var assert = require('*/cartridge/scripts/util/assert');
var PaymentService = require('*/cartridge/scripts/services/PaymentProviderService');

describe('PaymentProviderService', function() {
    
    beforeEach(function() {
        // Mock service dependencies
        this.mockOrder = {
            totalGrossPrice: { value: 99.99 },
            customerEmail: 'test@example.com'
        };
    });
    
    describe('processPayment', function() {
        
        it('should successfully process valid payment', function() {
            var result = PaymentService.processPayment(this.mockOrder, {
                cardNumber: '4111111111111111',
                expiryDate: '12/25',
                cvv: '123'
            });
            
            assert.isTrue(result.success);
            assert.isNotNull(result.transactionId);
        });
        
        it('should handle invalid card numbers', function() {
            var result = PaymentService.processPayment(this.mockOrder, {
                cardNumber: '1234567890123456',
                expiryDate: '12/25', 
                cvv: '123'
            });
            
            assert.isFalse(result.success);
            assert.equals(result.error, 'INVALID_CARD_NUMBER');
        });
        
        it('should handle service timeouts gracefully', function() {
            // Mock service timeout
            PaymentService.setTimeout(100);
            
            var result = PaymentService.processPayment(this.mockOrder, {
                cardNumber: '4111111111111111',
                expiryDate: '12/25',
                cvv: '123'
            });
            
            assert.isFalse(result.success);
            assert.equals(result.error, 'SERVICE_TIMEOUT');
        });
    });
});
```

---

## 🎯 Common Use Case Patterns

### Typical AI Assistant Conversations

#### 1. **"How do I...?" Questions**
- User asks about SFCC functionality
- AI uses documentation tools to provide accurate answers
- Includes code examples and best practices

#### 2. **"Debug this error" Requests**  
- User shares error messages or symptoms
- AI searches logs and analyzes patterns
- Provides root cause analysis and solutions

#### 3. **"Review my code" Requests**
- User shares code snippets or files
- AI applies security and performance best practices  
- Suggests improvements and optimizations

#### 4. **"Plan this feature" Discussions**
- User describes requirements
- AI provides architecture recommendations
- Suggests implementation approaches and patterns

#### 5. **"Generate boilerplate" Tasks**
- User needs template code or structures
- AI creates proper SFCC-compliant implementations
- Includes proper error handling and documentation

---

## 🔗 Integration with Development Workflow

### VS Code + GitHub Copilot
```javascript
// AI suggests SFCC-aware completions
var ProductMgr = require('dw/catalog/ProductMgr');

// Type "product." and get intelligent suggestions
var product = ProductMgr.getProduct(productId);
product.// ← AI suggests: .name, .ID, .custom, .variant, etc.
```

### Claude Desktop for Architecture
- **Multi-turn conversations** for complex planning
- **Context-aware suggestions** based on project structure  
- **Real-time documentation lookup** during discussions

### Cursor for Code Generation
- **File-aware completions** based on cartridge structure
- **Rule-based suggestions** for security and performance
- **Intelligent refactoring** across related files

---

## Next Steps

- 🐛 **[Troubleshooting](troubleshooting)** - Common issues and solutions
- 🛠️ **[Available Tools](tools)** - Complete tool reference
- ⚙️ **[Configuration](configuration)** - Set up advanced features
