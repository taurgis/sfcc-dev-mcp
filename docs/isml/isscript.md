# ISML isscript Element

## Overview

The `<isscript>` element enables server-side JavaScript execution within ISML templates. It provides a way to perform calculations, manipulate data, call API methods, and set variables using the full power of JavaScript and the Salesforce B2C Commerce Script API (dw.* namespace).

**Key Features:** Server-side JavaScript execution, access to B2C Commerce APIs, variable manipulation, shared execution context across multiple script blocks, integration with inline expressions using `${}` syntax.

**Important:** Scripts execute on the server during template rendering, not in the browser.

## Syntax

```isml
<isscript>
  // JavaScript code here
</isscript>
```

## Attributes

**None** - This tag has no attributes. JavaScript code is placed between the opening and closing tags.

## Purpose

The `<isscript>` element serves to:

1. **Server-Side Logic:** Execute JavaScript business logic during template rendering
2. **Data Manipulation:** Transform, calculate, or process data before display
3. **API Access:** Call B2C Commerce Script API methods (dw.* namespace)
4. **Variable Assignment:** Create and set variables for use in templates
5. **Complex Operations:** Perform operations too complex for inline expressions
6. **Code Organization:** Group related logic in dedicated script blocks

## Top-Level Variables

The following variables are automatically available in all `<isscript>` blocks:

| Variable | Type | Description | Scope |
|----------|------|-------------|-------|
| `session` | `dw.system.Session` | Current internal B2C Commerce session | Session-wide |
| `request` | `dw.system.Request` | Current internal B2C Commerce request | Request-wide |
| `pdict` | `dw.system.PipelineDictionary` | Pipeline Dictionary (request parameters and data) | Request-wide |
| `out` | `dw.io.PrintWriter` | PrintWriter for direct HTML output | Page-wide |

**Example:**
```isml
<isscript>
    // Access session
    var customerId = session.customer.ID;
    
    // Access request
    var httpMethod = request.httpMethod;
    
    // Access pipeline dictionary
    var product = pdict.Product;
    
    // Write directly to output (uncommon)
    out.print("<p>Hello World</p>");
</isscript>
```

## Variable Scopes

Variables created in `<isscript>` blocks have different scopes based on how they're declared:

### Page Scope Variables

**Definition:** Variables set using `var`, `let`, or `const` in scriptlets, or well-known variables set by the template at runtime.

**Availability:** Available throughout template execution context and can be referenced from multiple scriptlets or expressions in the template or its local includes.

**Persistence:** Lasts for the duration of the current page/template execution.

```isml
<isscript>
    var userName = pdict.customer.firstName;  // Page scope
    var orderTotal = pdict.basket.totalGrossPrice.value;  // Page scope
</isscript>

<!-- Variables available in expressions -->
<h1>Welcome, ${userName}</h1>
<p>Total: ${orderTotal}</p>

<!-- Variables available in other script blocks -->
<isscript>
    var greeting = "Hello, " + userName;  // userName from previous block
</isscript>
```

### Tag Scope Variables

**Definition:** Variables defined within certain ISML tags (e.g., loop status variables).

**Availability:** Only available within the context of that specific tag.

**Example:**
```isml
<isloop items="${pdict.products}" var="product" status="loopStatus">
    <!-- loopStatus is tag-scoped, only available inside this loop -->
    <isif condition="${loopStatus.first}">
        <p>First product!</p>
    </isif>
</isloop>
<!-- loopStatus NOT available here -->
```

## Shared Execution Context

**Important:** Multiple `<isscript>` blocks in the same template share the same execution context. Variables declared in one block are available in subsequent blocks.

```isml
<!-- First script block -->
<isscript>
    var user = pdict.User;
    var firstName = user.firstName;
</isscript>

<!-- Some HTML content -->
<div class="header">
    <h1>Welcome</h1>
</div>

<!-- Second script block - can access variables from first block -->
<isscript>
    var fullName = firstName + " " + user.lastName;  // firstName and user available
    var welcomeMessage = "Hello, " + fullName;
</isscript>

<!-- Use variables in expressions -->
<p><isprint value="${welcomeMessage}"/></p>
```

## Common Use Cases

### Data Transformation and Calculation

```isml
<isscript>
    var product = pdict.Product;
    
    // Calculate discount percentage
    var listPrice = product.price.list.value;
    var salesPrice = product.price.sales.value;
    var discount = listPrice - salesPrice;
    var discountPercent = (discount / listPrice) * 100;
    
    // Format for display
    var discountDisplay = Math.round(discountPercent) + "% OFF";
</isscript>

<div class="product-price">
    <span class="original">${listPrice}</span>
    <span class="sale">${salesPrice}</span>
    <span class="discount">${discountDisplay}</span>
</div>
```

### API Method Calls

```isml
<isscript>
    var ProductMgr = require('dw/catalog/ProductMgr');
    var URLUtils = require('dw/web/URLUtils');
    var StringUtils = require('dw/util/StringUtils');
    
    // Get product by ID
    var productID = request.httpParameterMap.pid.stringValue;
    var product = ProductMgr.getProduct(productID);
    
    // Generate URLs
    var productURL = URLUtils.url('Product-Show', 'pid', productID);
    
    // String manipulation
    var productName = StringUtils.trim(product.name);
</isscript>
```

### Complex Conditional Logic

```isml
<isscript>
    var customer = session.customer;
    var basket = pdict.basket;
    
    // Determine eligibility for free shipping
    var freeShippingThreshold = 50;
    var basketTotal = basket ? basket.totalGrossPrice.value : 0;
    var isFreeShipping = basketTotal >= freeShippingThreshold;
    var amountToFreeShipping = isFreeShipping ? 0 : freeShippingThreshold - basketTotal;
    
    // Determine customer tier
    var customerTier = "bronze";
    if (customer.authenticated) {
        var orderHistory = customer.orderHistory;
        var totalSpent = 0;
        var orders = orderHistory.getOrders();
        while (orders.hasNext()) {
            var order = orders.next();
            totalSpent += order.totalGrossPrice.value;
        }
        
        if (totalSpent > 1000) {
            customerTier = "gold";
        } else if (totalSpent > 500) {
            customerTier = "silver";
        }
    }
</isscript>

<div class="shipping-message">
    <isif condition="${isFreeShipping}">
        <p>You qualify for FREE shipping!</p>
    <iselse>
        <p>Add <isprint value="${amountToFreeShipping}" style="MONEY_LONG"/> for FREE shipping</p>
    </isif>
</div>

<div class="customer-tier ${customerTier}">
    <p>Your tier: ${customerTier.toUpperCase()}</p>
</div>
```

### Array and Collection Processing

```isml
<isscript>
    var products = pdict.products;
    
    // Filter products on sale
    var saleProducts = [];
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        if (product.price.sales.value < product.price.list.value) {
            saleProducts.push(product);
        }
    }
    
    // Sort by price (low to high)
    saleProducts.sort(function(a, b) {
        return a.price.sales.value - b.price.sales.value;
    });
    
    // Get top 5 cheapest sale items
    var topDeals = saleProducts.slice(0, 5);
</isscript>

<div class="top-deals">
    <h2>Top Deals</h2>
    <isloop items="${topDeals}" var="deal">
        <div class="deal-item">
            <h3>${deal.name}</h3>
            <p><isprint value="${deal.price.sales}" style="MONEY_LONG"/></p>
        </div>
    </isloop>
</div>
```

### Date and Time Manipulation

```isml
<isscript>
    var Calendar = require('dw/util/Calendar');
    var StringUtils = require('dw/util/StringUtils');
    
    var now = new Calendar();
    var currentDate = now.time;
    
    // Calculate shipping estimate (3 business days)
    var shippingEstimate = new Calendar(now);
    shippingEstimate.add(Calendar.DAY_OF_MONTH, 3);
    
    // Format dates
    var orderDate = StringUtils.formatCalendar(now, "MMMM d, yyyy");
    var deliveryDate = StringUtils.formatCalendar(shippingEstimate, "MMMM d, yyyy");
</isscript>

<div class="order-info">
    <p>Order Date: ${orderDate}</p>
    <p>Estimated Delivery: ${deliveryDate}</p>
</div>
```

### Session and Cookie Management

```isml
<isscript>
    var Cookie = require('dw/web/Cookie');
    
    // Read cookie
    var cookies = request.httpCookies;
    var viewedProducts = cookies['recentlyViewed'];
    
    // Set session custom property
    if (!session.custom.pageViews) {
        session.custom.pageViews = 0;
    }
    session.custom.pageViews++;
    
    var pageViewCount = session.custom.pageViews;
    var isFirstVisit = pageViewCount === 1;
</isscript>

<isif condition="${isFirstVisit}">
    <div class="welcome-modal">
        <h2>Welcome to our store!</h2>
        <p>First time here? Get 10% off your first order.</p>
    </div>
</isif>
```

### Form Validation and Processing

```isml
<isscript>
    var form = pdict.CurrentForms.registration;
    var errors = [];
    
    // Validate email
    var email = form.email.value;
    if (!email || email.indexOf('@') === -1) {
        errors.push({
            field: 'email',
            message: 'Please enter a valid email address'
        });
    }
    
    // Validate password
    var password = form.password.value;
    var confirmPassword = form.confirmPassword.value;
    if (password !== confirmPassword) {
        errors.push({
            field: 'password',
            message: 'Passwords do not match'
        });
    }
    
    var hasErrors = errors.length > 0;
</isscript>

<isif condition="${hasErrors}">
    <div class="error-messages">
        <isloop items="${errors}" var="error">
            <p class="error">${error.message}</p>
        </isloop>
    </div>
</isif>
```

### Custom Object Access

```isml
<isscript>
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    
    // Retrieve custom object
    var storeConfig = CustomObjectMgr.getCustomObject('StoreConfig', 'main');
    
    if (storeConfig) {
        var storeName = storeConfig.custom.storeName;
        var storeHours = storeConfig.custom.hours;
        var storePhone = storeConfig.custom.phone;
    } else {
        var storeName = "Our Store";
        var storeHours = "9 AM - 5 PM";
        var storePhone = "1-800-555-0123";
    }
</isscript>

<div class="store-info">
    <h3>${storeName}</h3>
    <p>Hours: ${storeHours}</p>
    <p>Phone: ${storePhone}</p>
</div>
```

### SFRA-Style Module Imports

```isml
<isscript>
    // Import modules
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var collections = require('*/cartridge/scripts/util/collections');
    var URLUtils = require('dw/web/URLUtils');
    
    // Use imported modules
    var productDetails = ProductFactory.get(pdict.product);
    
    var productImages = collections.map(productDetails.images.large, function(image) {
        return {
            url: image.url,
            alt: image.alt,
            title: image.title
        };
    });
    
    var addToCartUrl = URLUtils.url('Cart-AddProduct');
</isscript>
```

### JSON Data Preparation

```isml
<isscript>
    var product = pdict.Product;
    
    // Prepare JSON data for client-side JavaScript
    var productData = {
        id: product.ID,
        name: product.name,
        price: product.price.sales.value,
        currency: product.price.sales.currencyCode,
        available: product.available,
        inStock: product.availabilityModel.inStock,
        images: []
    };
    
    // Build images array
    var images = product.getImages('large');
    for (var i = 0; i < images.length; i++) {
        productData.images.push({
            url: images[i].getURL().toString(),
            alt: images[i].getAlt()
        });
    }
    
    var productJSON = JSON.stringify(productData);
</isscript>

<script>
    window.productData = ${productJSON};
</script>
```

## Best Practices

### 1. Keep Scripts Focused and Small

Break large scripts into smaller, focused blocks:

```isml
<!-- Good: Small, focused script blocks -->
<isscript>
    var product = pdict.Product;
    var price = product.price.sales.value;
</isscript>

<!-- Display product info -->
<div class="product">${product.name}</div>

<isscript>
    var discount = calculateDiscount(price);
</isscript>

<!-- Avoid: One large script block with everything -->
<isscript>
    // 100 lines of mixed logic
</isscript>
```

### 2. Use require() for API Access

Always use `require()` to import B2C Commerce API classes:

```isml
<!-- Good: Explicit require statements -->
<isscript>
    var ProductMgr = require('dw/catalog/ProductMgr');
    var URLUtils = require('dw/web/URLUtils');
    
    var product = ProductMgr.getProduct(productID);
</isscript>

<!-- Avoid: Assuming classes are globally available -->
<isscript>
    var product = ProductMgr.getProduct(productID);  // May not work
</isscript>
```

### 3. Minimize Business Logic in Templates

Move complex business logic to controllers or scripts:

```isml
<!-- Good: Simple data access in template -->
<isscript>
    var productHelper = require('*/cartridge/scripts/helpers/productHelper');
    var productData = productHelper.getProductData(pdict.Product);
</isscript>

<!-- Avoid: Complex business logic in template -->
<isscript>
    // 50 lines of complex pricing calculations
    // Discount rules
    // Inventory checks
    // etc.
</isscript>
```

### 4. Use Descriptive Variable Names

Choose clear, meaningful variable names:

```isml
<!-- Good: Descriptive names -->
<isscript>
    var currentProduct = pdict.Product;
    var discountPercentage = calculateDiscount(currentProduct);
    var formattedPrice = formatCurrency(currentProduct.price);
</isscript>

<!-- Avoid: Unclear names -->
<isscript>
    var p = pdict.Product;
    var d = calc(p);
    var f = fmt(p.price);
</isscript>
```

### 5. Handle Null and Undefined Safely

Always check for null/undefined before accessing properties:

```isml
<isscript>
    var product = pdict.Product;
    var productName = product ? product.name : "Product Unavailable";
    
    var basket = pdict.basket;
    var itemCount = basket && basket.productLineItems ? basket.productLineItems.size() : 0;
    
    // Or use optional chaining if available
    var manufacturer = product?.manufacturer?.name || "Unknown";
</isscript>
```

### 6. Avoid Direct HTML Output with out.print()

Use ISML elements instead of `out.print()`:

```isml
<!-- Good: Use ISML elements -->
<isscript>
    var message = "Welcome, " + customer.firstName;
</isscript>
<p>${message}</p>

<!-- Avoid: Direct HTML output -->
<isscript>
    out.print("<p>Welcome, " + customer.firstName + "</p>");
</isscript>
```

### 7. Comment Complex Logic

Add comments to explain non-obvious logic:

```isml
<isscript>
    // Calculate loyalty discount based on customer tier and purchase history
    var loyaltyDiscount = 0;
    if (customer.authenticated) {
        var tier = customer.custom.loyaltyTier;
        var purchaseCount = customer.orderHistory.orderCount;
        
        // Gold tier: 15% discount, Silver: 10%, Bronze: 5%
        if (tier === 'gold' && purchaseCount > 10) {
            loyaltyDiscount = 0.15;
        } else if (tier === 'silver' && purchaseCount > 5) {
            loyaltyDiscount = 0.10;
        } else {
            loyaltyDiscount = 0.05;
        }
    }
</isscript>
```

### 8. Use Modern JavaScript Features

Leverage ES6+ features when appropriate:

```isml
<isscript>
    // Use const/let instead of var when appropriate
    const TAX_RATE = 0.08;
    let totalWithTax = subtotal * (1 + TAX_RATE);
    
    // Use arrow functions
    const activeProducts = products.filter(p => p.online && p.available);
    
    // Use template literals
    const greeting = `Welcome, ${customer.firstName} ${customer.lastName}!`;
    
    // Use destructuring
    const { firstName, lastName, email } = customer.profile;
</isscript>
```

## Integration with Inline Expressions

Variables created in `<isscript>` blocks are available in inline expressions `${}`:

```isml
<isscript>
    var userName = pdict.customer.firstName + " " + pdict.customer.lastName;
    var currentYear = new Date().getFullYear();
    var copyrightText = "© " + currentYear + " Our Company";
</isscript>

<!-- Use variables in inline expressions -->
<h1>Welcome, ${userName}</h1>
<footer>
    <p>${copyrightText}</p>
</footer>

<!-- Use in attributes -->
<div class="user-${userName.toLowerCase().replace(' ', '-')}">
    Content
</div>

<!-- Use in isprint -->
<isprint value="${userName}" encoding="on"/>
```

## Script Expression Support

Script expressions using `${}` syntax are supported in various contexts:

### In HTML Content

```isml
<p>Hello, ${customer.firstName}!</p>
<h2>${product.name}</h2>
```

### In Tag Attributes

```isml
<div class="${pdict.cssClass}">
<img src="${product.imageURL}" alt="${product.name}">
<a href="${URLUtils.url('Product-Show', 'pid', product.ID)}">
```

### In ISML Tag Attributes

```isml
<isif condition="${product.available}">
<isprint value="${product.price}" style="MONEY_LONG"/>
<isloop items="${pdict.products}" var="product">
```

## Performance Considerations

### 1. Minimize Script Execution Time

Keep scripts efficient to avoid slow page rendering:

```isml
<!-- Good: Efficient operations -->
<isscript>
    var productCount = products.length;  // Fast
    var firstProduct = products[0];       // Fast
</isscript>

<!-- Avoid: Expensive operations in templates -->
<isscript>
    // Expensive database queries
    // Complex calculations
    // Large loops processing thousands of items
</isscript>
```

### 2. Cache Expensive Calculations

Store results of expensive calculations:

```isml
<isscript>
    // Cache result in session for reuse
    if (!session.custom.cachedData) {
        session.custom.cachedData = expensiveCalculation();
    }
    var data = session.custom.cachedData;
</isscript>
```

### 3. Avoid Nested Loops

Minimize nested iterations:

```isml
<!-- Less efficient: Nested loops -->
<isscript>
    for (var i = 0; i < products.length; i++) {
        for (var j = 0; j < categories.length; j++) {
            // O(n²) complexity
        }
    }
</isscript>

<!-- Better: Pre-process data -->
<isscript>
    var categoryMap = {};
    categories.forEach(function(cat) {
        categoryMap[cat.ID] = cat;
    });
    
    products.forEach(function(prod) {
        var category = categoryMap[prod.categoryID];  // O(1) lookup
    });
</isscript>
```

## Security Considerations

### 1. Sanitize User Input

Never trust user input in scripts:

```isml
<isscript>
    var searchQuery = request.httpParameterMap.q.stringValue;
    
    // Sanitize before use
    var StringUtils = require('dw/util/StringUtils');
    var safeQuery = StringUtils.trim(searchQuery || '');
    
    // Validate
    if (safeQuery.length > 100) {
        safeQuery = safeQuery.substring(0, 100);
    }
</isscript>
```

### 2. Avoid Exposing Sensitive Data

Don't expose sensitive information to client-side:

```isml
<!-- Bad: Exposing sensitive data -->
<isscript>
    var customerData = {
        email: customer.email,
        password: customer.password,  // NEVER DO THIS
        creditCard: customer.creditCard  // NEVER DO THIS
    };
</isscript>
<script>
    window.customer = ${JSON.stringify(customerData)};
</script>

<!-- Good: Only expose safe data -->
<isscript>
    var customerData = {
        firstName: customer.firstName,
        loyaltyPoints: customer.loyaltyPoints
    };
</isscript>
```

### 3. Use Proper Encoding

Encode output to prevent XSS:

```isml
<isscript>
    var userComment = request.httpParameterMap.comment.stringValue;
</isscript>

<!-- Good: Use encoding -->
<p><isprint value="${userComment}" encoding="on"/></p>

<!-- Bad: Direct output without encoding -->
<p>${userComment}</p>  <!-- Potential XSS -->
```

## Common Errors and Troubleshooting

### Script Syntax Errors

**Symptom:** Template fails to render with JavaScript error.

**Solution:** Check JavaScript syntax carefully:

```isml
<!-- Bad: Syntax error -->
<isscript>
    var product = pdict.Product
    var price = product.price  // Missing semicolon
</isscript>

<!-- Good: Correct syntax -->
<isscript>
    var product = pdict.Product;
    var price = product.price;
</isscript>
```

### Variable Not Defined

**Symptom:** ReferenceError - variable is not defined.

**Solution:** Ensure variable is declared before use:

```isml
<!-- Bad: Using undeclared variable -->
<isscript>
    var fullName = firstName + " " + lastName;  // firstName not defined
</isscript>

<!-- Good: Declare variables -->
<isscript>
    var firstName = pdict.customer.firstName;
    var lastName = pdict.customer.lastName;
    var fullName = firstName + " " + lastName;
</isscript>
```

### Null Pointer Errors

**Symptom:** TypeError - cannot read property of null/undefined.

**Solution:** Check for null/undefined:

```isml
<!-- Bad: No null check -->
<isscript>
    var productName = pdict.Product.name;  // Error if Product is null
</isscript>

<!-- Good: Null check -->
<isscript>
    var product = pdict.Product;
    var productName = product ? product.name : "Unknown Product";
</isscript>
```

## Related Elements

- **`<isset>`** - Set variables (alternative to isscript for simple assignments)
- **`<isprint>`** - Output script variables with formatting
- **`<isif>`** - Use script variables in conditions
- **`<isloop>`** - Iterate over collections created in scripts

## Related APIs

- **`dw.*` packages** - All B2C Commerce Script API classes
- **`require()`** - Module import function
- **`session`** - Session object
- **`request`** - Request object  
- **`pdict`** - Pipeline Dictionary

## See Also

- [B2C Commerce Script API Documentation](../dw_system/)
- [ISML Expressions](./expressions.md)
- [isset Element](./isset.md)
- [SFRA Client-side JS Skill](../../ai-instructions/skills/sfcc-sfra-client-side-js/SKILL.md)
- [Security Skill](../../ai-instructions/skills/sfcc-security/SKILL.md)
- [Performance Skill](../../ai-instructions/skills/sfcc-performance/SKILL.md)
