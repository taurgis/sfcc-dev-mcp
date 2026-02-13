# ISML isremove Element

## Overview

The `<isremove>` element removes a variable from a specified scope, providing the counterpart functionality to `<isset>` which defines variables. This element is useful for cleaning up variables, freeing memory, or removing sensitive data from scopes after use.

**Key Features:** Variable removal from session, request, and page scopes; memory management; security cleanup for sensitive data.

## Syntax

```isml
<isremove
  name  = var_name                           // required
  scope = "session" | "request" | "page"     // required
/>
```

## Required Attributes

### name

**Type:** String  
**Required:** Yes

Specifies the name of the variable to be removed from the specified scope.

**Examples:**
```isml
<!-- Remove page-scoped variable -->
<isremove name="temporaryData" scope="page"/>

<!-- Remove session variable -->
<isremove name="tempSessionData" scope="session"/>

<!-- Remove request variable -->
<isremove name="processingFlag" scope="request"/>
```

### scope

**Type:** String  
**Allowed Values:** `"session"`, `"request"`, `"page"`  
**Required:** Yes

Specifies the scope from which the variable should be removed.

**Values:**

#### "session"

Removes variables from the session scope. Variables in session scope are available across multiple requests within a user's session.

**Use Cases:**
- Remove temporary session data after processing
- Clear sensitive information from session
- Clean up workflow state variables
- Remove session flags after use

```isml
<isremove name="checkoutStep" scope="session"/>
```

#### "request"

Removes variables from the request scope. Variables in request scope are available for the duration of the current internal Salesforce B2C Commerce request.

**Use Cases:**
- Clean up request-level processing variables
- Remove temporary request flags
- Clear request-specific data after use

```isml
<isremove name="processingComplete" scope="request"/>
```

**Note:** The `pdict` scope value has been **deprecated**. Use `"request"` instead for Pipeline Dictionary variables.

#### "page"

Removes variables from the page scope. Variables in page scope are available only on the current ISML page.

**Use Cases:**
- Remove temporary calculation variables
- Clean up loop iteration variables
- Free memory after complex processing
- Remove sensitive data after display

```isml
<isremove name="tempCalculation" scope="page"/>
```

## Purpose

The `<isremove>` element serves to:

1. **Memory Management:** Free memory by removing variables no longer needed
2. **Security:** Remove sensitive data from scopes after use (passwords, tokens, credit card data)
3. **Scope Cleanup:** Clean up temporary variables and flags
4. **State Management:** Remove workflow state variables after completion
5. **Variable Lifecycle Control:** Explicitly control when variables are removed from scopes

## Variable Scope Comparison

| Scope | Lifetime | Visibility | Common Use Cases |
|-------|----------|------------|------------------|
| `page` | Current ISML page only | Current page | Temporary calculations, loop variables |
| `request` | Current request | All templates in request | Request flags, processing state |
| `session` | User session (multiple requests) | All requests in session | User preferences, workflow state |

## Common Use Cases

### Security: Remove Sensitive Data

```isml
<!-- Process credit card data -->
<isset name="ccNumber" value="${pdict.creditCardNumber}" scope="page"/>

<!-- Use the data for processing -->
<isscript>
    var PaymentProcessor = require('*/cartridge/scripts/payment/processor');
    var result = PaymentProcessor.process(ccNumber);
</isscript>

<!-- Immediately remove sensitive data -->
<isremove name="ccNumber" scope="page"/>

<!-- Rest of template continues without sensitive data in scope -->
```

### Clean Up After Processing

```isml
<!-- Set temporary processing flag -->
<isset name="isProcessing" value="${true}" scope="request"/>

<!-- Perform processing -->
<isscript>
    var OrderMgr = require('dw/order/OrderMgr');
    var order = OrderMgr.processOrder();
</isscript>

<!-- Remove flag after processing complete -->
<isremove name="isProcessing" scope="request"/>
```

### Remove Session Variables After Checkout

```isml
<!-- After successful order placement, clean up session variables -->
<isif condition="${pdict.orderPlaced}">
    <!-- Remove checkout-related session variables -->
    <isremove name="checkoutStep" scope="session"/>
    <isremove name="selectedShippingMethod" scope="session"/>
    <isremove name="selectedPaymentMethod" scope="session"/>
    <isremove name="guestCheckoutEmail" scope="session"/>
    
    <!-- Redirect to confirmation -->
    <isredirect location="${URLUtils.url('Order-Confirm', 'orderNo', pdict.orderNumber)}"/>
</isif>
```

### Clean Up Loop Variables

```isml
<!-- Process products with temporary calculations -->
<isloop items="${pdict.products}" var="product">
    <!-- Calculate discount for each product -->
    <isset name="discount" value="${product.price.list.value - product.price.sales.value}" scope="page"/>
    <isset name="discountPercent" value="${(discount / product.price.list.value) * 100}" scope="page"/>
    
    <div class="product">
        <h3>${product.name}</h3>
        <p>Save <isprint value="${discountPercent}" formatter="#0"/>%</p>
    </div>
    
    <!-- Clean up temporary variables after each iteration -->
    <isremove name="discount" scope="page"/>
    <isremove name="discountPercent" scope="page"/>
</isloop>
```

### Workflow State Management

```isml
<!-- Multi-step form: Remove state variables after completion -->
<isif condition="${pdict.formStep == 'complete'}">
    <!-- Remove all form step variables from session -->
    <isremove name="formStep1Data" scope="session"/>
    <isremove name="formStep2Data" scope="session"/>
    <isremove name="formStep3Data" scope="session"/>
    <isremove name="currentFormStep" scope="session"/>
    
    <h1>Form Submitted Successfully</h1>
</isif>
```

### Remove Temporary Flags

```isml
<!-- Set error flag for display -->
<isset name="hasError" value="${true}" scope="page"/>
<isset name="errorMessage" value="${pdict.error.message}" scope="page"/>

<!-- Display error -->
<div class="error-message">
    <p>${errorMessage}</p>
</div>

<!-- Clean up error variables -->
<isremove name="hasError" scope="page"/>
<isremove name="errorMessage" scope="page"/>

<!-- Continue with rest of page without error variables -->
```

### Clean Up After A/B Testing

```isml
<!-- A/B test variant assignment -->
<isset name="variant" value="${pdict.abTestVariant}" scope="page"/>

<!-- Show variant-specific content -->
<isif condition="${variant == 'A'}">
    <div class="variant-a">Content A</div>
<iselse>
    <div class="variant-b">Content B</div>
</isif>

<!-- Remove variant variable -->
<isremove name="variant" scope="page"/>
```

### Remove Debug Variables

```isml
<!-- Debug mode: Set debug variables -->
<isif condition="${pdict.debugMode}">
    <isset name="debugInfo" value="${pdict.debugData}" scope="page"/>
    <isset name="debugTimestamp" value="${new Date()}" scope="page"/>
    
    <!-- Display debug information -->
    <div class="debug-panel">
        <pre>${debugInfo}</pre>
        <p>Generated: <isprint value="${debugTimestamp}" style="DATE_TIME"/></p>
    </div>
    
    <!-- Remove debug variables -->
    <isremove name="debugInfo" scope="page"/>
    <isremove name="debugTimestamp" scope="page"/>
</isif>
```

### Session Cleanup on Logout

```isml
<!-- User logout: Clean up all session variables -->
<isif condition="${pdict.isLogout}">
    <!-- Remove user-specific session data -->
    <isremove name="selectedStore" scope="session"/>
    <isremove name="wishlistPreferences" scope="session"/>
    <isremove name="recentlyViewedProducts" scope="session"/>
    <isremove name="savedFilters" scope="session"/>
    
    <!-- Redirect to home -->
    <isredirect location="${URLUtils.url('Home-Show')}"/>
</isif>
```

### Complex Calculation Cleanup

```isml
<!-- Complex pricing calculation -->
<isset name="basePrice" value="${pdict.product.price.value}" scope="page"/>
<isset name="taxRate" value="${pdict.taxRate}" scope="page"/>
<isset name="shippingCost" value="${pdict.shippingCost}" scope="page"/>
<isset name="discount" value="${pdict.discount}" scope="page"/>

<isset name="subtotal" value="${basePrice + shippingCost}" scope="page"/>
<isset name="taxAmount" value="${subtotal * taxRate}" scope="page"/>
<isset name="totalBeforeDiscount" value="${subtotal + taxAmount}" scope="page"/>
<isset name="finalTotal" value="${totalBeforeDiscount - discount}" scope="page"/>

<div class="price-breakdown">
    <p>Total: <isprint value="${finalTotal}" style="MONEY_LONG"/></p>
</div>

<!-- Clean up all calculation variables -->
<isremove name="basePrice" scope="page"/>
<isremove name="taxRate" scope="page"/>
<isremove name="shippingCost" scope="page"/>
<isremove name="discount" scope="page"/>
<isremove name="subtotal" scope="page"/>
<isremove name="taxAmount" scope="page"/>
<isremove name="totalBeforeDiscount" scope="page"/>
<isremove name="finalTotal" scope="page"/>
```

## Best Practices

### 1. Remove Sensitive Data Immediately After Use

Always remove sensitive information (passwords, credit cards, tokens) as soon as processing is complete:

```isml
<!-- Good: Immediate removal after use -->
<isset name="authToken" value="${pdict.token}" scope="page"/>
<!-- Use token -->
<isscript>
    var result = APIClient.authenticate(authToken);
</isscript>
<isremove name="authToken" scope="page"/>

<!-- Bad: Leaving sensitive data in scope -->
<isset name="authToken" value="${pdict.token}" scope="page"/>
<!-- Use token -->
<!-- Token remains in scope for rest of page -->
```

### 2. Clean Up Session Variables After Workflow Completion

Remove session variables when workflows complete to prevent stale data:

```isml
<!-- Good: Clean up after checkout -->
<isif condition="${pdict.orderComplete}">
    <isremove name="checkoutStep" scope="session"/>
    <isremove name="guestEmail" scope="session"/>
</isif>

<!-- Bad: Leaving workflow variables in session -->
<!-- Variables persist across sessions and may cause issues -->
```

### 3. Use Page Scope for Temporary Variables

Prefer page scope for temporary variables and clean them up after use:

```isml
<!-- Good: Page scope for temporary calculations -->
<isset name="tempValue" value="${calculation}" scope="page"/>
<!-- Use tempValue -->
<isremove name="tempValue" scope="page"/>

<!-- Avoid: Session scope for temporary data -->
<isset name="tempValue" value="${calculation}" scope="session"/>
<!-- Harder to track and clean up -->
```

### 4. Document Why Variables Are Removed

Add comments explaining the reason for removal, especially for security:

```isml
<!-- Security: Remove credit card data after processing -->
<isremove name="ccNumber" scope="page"/>

<!-- Performance: Clean up large data set after display -->
<isremove name="productCatalog" scope="page"/>

<!-- State management: Clear form step after submission -->
<isremove name="formStep" scope="session"/>
```

### 5. Remove Variables in Same Scope They Were Set

Remove variables from the same scope where they were created:

```isml
<!-- Good: Same scope for set and remove -->
<isset name="myVar" value="${data}" scope="page"/>
<!-- Use variable -->
<isremove name="myVar" scope="page"/>

<!-- Incorrect: Different scopes -->
<isset name="myVar" value="${data}" scope="page"/>
<isremove name="myVar" scope="session"/>  <!-- Won't work -->
```

### 6. Clean Up Before Redirects

Remove unnecessary variables before redirecting:

```isml
<isif condition="${pdict.success}">
    <!-- Clean up processing variables -->
    <isremove name="processingData" scope="session"/>
    <isremove name="tempResults" scope="request"/>
    
    <!-- Then redirect -->
    <isredirect location="${URLUtils.url('Success-Show')}"/>
</isif>
```

### 7. Group Related Variable Removals

Group related variable removals together for clarity:

```isml
<!-- Good: Grouped cleanup -->
<!-- Remove all checkout-related variables -->
<isremove name="checkoutStep" scope="session"/>
<isremove name="selectedShipping" scope="session"/>
<isremove name="selectedPayment" scope="session"/>

<!-- Less clear: Scattered removals -->
<isremove name="checkoutStep" scope="session"/>
<!-- 50 lines of code -->
<isremove name="selectedShipping" scope="session"/>
<!-- 30 lines of code -->
<isremove name="selectedPayment" scope="session"/>
```

## Common Patterns

### Pattern 1: Set-Use-Remove

```isml
<!-- Set variable -->
<isset name="data" value="${pdict.value}" scope="page"/>

<!-- Use variable -->
<div class="content">${data}</div>

<!-- Remove variable -->
<isremove name="data" scope="page"/>
```

### Pattern 2: Conditional Cleanup

```isml
<isif condition="${pdict.cleanup}">
    <isremove name="tempData" scope="session"/>
    <isremove name="processingState" scope="request"/>
</isif>
```

### Pattern 3: Batch Cleanup

```isml
<!-- Remove multiple related variables -->
<isremove name="step1" scope="session"/>
<isremove name="step2" scope="session"/>
<isremove name="step3" scope="session"/>
<isremove name="currentStep" scope="session"/>
```

### Pattern 4: Security Cleanup in Script

```isml
<isscript>
    // Set sensitive variable
    var sensitiveData = pdict.secretKey;
    
    // Use it
    var result = processData(sensitiveData);
    
    // Clean up in JavaScript (delete doesn't remove from ISML scope)
    delete sensitiveData;
</isscript>

<!-- Still need to remove from ISML scope if set there -->
<isremove name="secretKey" scope="page"/>
```

## Differences from isset

| Feature | `<isset>` | `<isremove>` |
|---------|-----------|--------------|
| Purpose | Create/set variable | Remove variable |
| Value Attribute | Required | Not applicable |
| Scope Attribute | Required | Required |
| Effect | Adds variable to scope | Removes variable from scope |
| Use Case | Initialize data | Clean up data |

**Example:**
```isml
<!-- isset: Create variable -->
<isset name="myVar" value="${data}" scope="page"/>

<!-- Variable exists and can be used -->
<div>${myVar}</div>

<!-- isremove: Remove variable -->
<isremove name="myVar" scope="page"/>

<!-- Variable no longer exists in scope -->
```

## Scope-Specific Considerations

### Page Scope

**Lifetime:** Current ISML page only  
**Auto Cleanup:** Variables are automatically removed when page processing completes  
**Manual Removal:** Useful for freeing memory during long page processing

```isml
<!-- Page variables are auto-cleaned, but manual removal can help -->
<isset name="largeDataSet" value="${pdict.catalog}" scope="page"/>
<!-- Process data -->
<isremove name="largeDataSet" scope="page"/>
<!-- Rest of page processing with less memory usage -->
```

### Request Scope

**Lifetime:** Current request (may span multiple templates via includes)  
**Auto Cleanup:** Variables removed when request completes  
**Manual Removal:** Useful for cleaning up between template includes

```isml
<!-- Set in main template -->
<isset name="requestFlag" value="${true}" scope="request"/>

<!-- Include another template that uses the flag -->
<isinclude template="common/header"/>

<!-- Remove flag after include -->
<isremove name="requestFlag" scope="request"/>
```

### Session Scope

**Lifetime:** User session (multiple requests, can persist for hours/days)  
**Auto Cleanup:** Only when session expires or is invalidated  
**Manual Removal:** **Critical** for preventing stale data and memory leaks

```isml
<!-- Session variables persist - MUST be manually removed -->
<isset name="checkoutInProgress" value="${true}" scope="session"/>

<!-- After checkout completes -->
<isif condition="${pdict.orderPlaced}">
    <isremove name="checkoutInProgress" scope="session"/>
</isif>
```

## Memory Management

### Why Remove Variables?

1. **Free Memory:** Large objects consume server memory
2. **Prevent Memory Leaks:** Especially in session scope
3. **Clear Stale Data:** Old data can cause bugs
4. **Security:** Sensitive data should not persist

### Example: Large Data Set Cleanup

```isml
<!-- Load large product catalog -->
<isset name="fullCatalog" value="${pdict.allProducts}" scope="page"/>

<!-- Display first 20 products -->
<isloop items="${fullCatalog}" var="product" begin="0" end="19">
    <div class="product">${product.name}</div>
</isloop>

<!-- Remove large data set to free memory -->
<isremove name="fullCatalog" scope="page"/>

<!-- Rest of page processing with less memory pressure -->
```

## Security Considerations

### 1. Always Remove Sensitive Data

**Critical:** Remove passwords, credit cards, tokens, API keys after use:

```isml
<!-- CRITICAL: Remove after processing -->
<isset name="password" value="${pdict.userPassword}" scope="page"/>
<isscript>
    var authenticated = authenticateUser(username, password);
</isscript>
<isremove name="password" scope="page"/>

<!-- NEVER leave in scope -->
<isset name="ccNumber" value="${pdict.creditCard}" scope="session"/>  <!-- DANGEROUS -->
```

### 2. Remove Session Data on Logout

Clean up all user-specific session data on logout:

```isml
<isif condition="${pdict.logout}">
    <isremove name="userPreferences" scope="session"/>
    <isremove name="savedAddresses" scope="session"/>
    <isremove name="paymentMethods" scope="session"/>
    <isremove name="wishlist" scope="session"/>
</isif>
```

### 3. Clean Up Error Messages with Sensitive Data

Remove error messages that might contain sensitive information:

```isml
<isset name="errorMsg" value="${pdict.error.detailedMessage}" scope="page"/>
<div class="error">${errorMsg}</div>
<isremove name="errorMsg" scope="page"/>
```

## Performance Considerations

### 1. Remove Large Objects Early

Free memory by removing large objects as soon as possible:

```isml
<!-- Process large dataset -->
<isset name="bigData" value="${pdict.largeDataSet}" scope="page"/>
<!-- Use first 10 items -->
<isloop items="${bigData}" var="item" begin="0" end="9">
    <!-- Process item -->
</isloop>
<!-- Immediately remove to free memory -->
<isremove name="bigData" scope="page"/>
```

### 2. Clean Up Session Variables Regularly

Prevent session bloat by removing variables when done:

```isml
<!-- Workflow complete - clean up -->
<isif condition="${pdict.workflowComplete}">
    <isremove name="step1Data" scope="session"/>
    <isremove name="step2Data" scope="session"/>
    <isremove name="step3Data" scope="session"/>
</isif>
```

### 3. Balance Cleanup vs. Readability

Don't over-optimize by removing every variable immediately:

```isml
<!-- Good: Reasonable cleanup -->
<isset name="productCount" value="${products.length}" scope="page"/>
<h2>Showing ${productCount} products</h2>
<!-- Use productCount a few more times -->
<isremove name="productCount" scope="page"/>

<!-- Over-optimized: Removed too early -->
<isset name="productCount" value="${products.length}" scope="page"/>
<isremove name="productCount" scope="page"/>  <!-- Can't use it anymore! -->
```

## Common Errors and Troubleshooting

### Variable Not Removed

**Symptom:** Variable still accessible after `<isremove>`.

**Causes:**
1. Wrong scope specified
2. Variable name typo
3. Variable re-created after removal

**Solution:**
```isml
<!-- Ensure correct scope -->
<isset name="myVar" value="${data}" scope="page"/>
<isremove name="myVar" scope="page"/>  <!-- Same scope -->

<!-- Check for typos -->
<isset name="myVariable" value="${data}" scope="page"/>
<isremove name="myVarible" scope="page"/>  <!-- TYPO! -->

<!-- Ensure not re-created -->
<isremove name="myVar" scope="page"/>
<isset name="myVar" value="${data}" scope="page"/>  <!-- Re-created! -->
```

### Removing Non-Existent Variable

**Symptom:** No error, but variable was never set.

**Solution:** Check variable existence before removal if unsure:

```isml
<!-- Safe: Check before remove -->
<isif condition="${typeof myVar !== 'undefined'}">
    <isremove name="myVar" scope="page"/>
</isif>
```

### Session Variable Not Cleaned Up

**Symptom:** Old session data persists across requests.

**Solution:** Ensure cleanup logic is in correct workflow path:

```isml
<!-- Make sure cleanup happens on all exit paths -->
<isif condition="${pdict.success}">
    <isremove name="workflowData" scope="session"/>
    <isredirect location="${URLUtils.url('Success-Show')}"/>
<iselseif condition="${pdict.cancelled}">
    <isremove name="workflowData" scope="session"/>  <!-- Don't forget! -->
    <isredirect location="${URLUtils.url('Home-Show')}"/>
</isif>
```

## Related Elements

- **`<isset>`** - Create or set variables (counterpart to `<isremove>`)
- **`<isif>`** - Conditional removal of variables
- **`<isscript>`** - Script-based variable manipulation

## Related APIs

- **`dw.system.Session`** - Session object and custom properties
- **`dw.system.Request`** - Request object and custom properties
- **Pipeline Dictionary (pdict)** - Request-scoped variables

## See Also

- [isset Element](./isset.md)
- [ISML Variables and Scope](./variables.md)
- [Session Management](../dw_system/Session.md)
- [Security Skill](../../ai-instructions/skills/sfcc-security/SKILL.md)
- [Performance Skill](../../ai-instructions/skills/sfcc-performance/SKILL.md)
