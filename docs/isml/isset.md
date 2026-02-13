# ISML isset Element

## Overview

The `<isset>` element defines and sets user-defined variables in ISML templates. It provides flexible variable management across different scopes (session, request, and page), allowing you to store and manipulate data throughout your template logic. This element is fundamental for managing state, temporary calculations, and data flow in ISML templates.

**Key Features:** Variable declaration and initialization; scope management (session, request, page); variable reassignment; expression evaluation and storage.

## Syntax

```isml
<isset
  name  = var_name                           // required
  value = var_value                          // required
  scope = "session" | "request" | "page"     // required
/>
```

## Required Attributes

### name

**Type:** Expression or String  
**Required:** Yes

Specifies the name of the user-defined variable to create or update.

**Variable Naming Rules:**
- The identifier must start with a letter (a-z, A-Z)
- Following characters can be letters, numbers, or underscores
- Variable names are case-sensitive
- Cannot use reserved ISML keywords

**Examples:**
```isml
<!-- Simple variable name -->
<isset name="color" value="${'#A0CC99'}" scope="page"/>

<!-- Variable with underscores -->
<isset name="total_count" value="${10}" scope="request"/>

<!-- CamelCase variable -->
<isset name="productList" value="${products}" scope="session"/>
```

### value

**Type:** Any value (expression or literal)  
**Required:** Yes

Specifies the value to be stored in the variable. Can be any data type including strings, numbers, booleans, objects, or expressions.

**Examples:**
```isml
<!-- String value -->
<isset name="color" value="${'#A0CC99'}" scope="page"/>

<!-- Numeric value -->
<isset name="counter" value="${0}" scope="page"/>

<!-- Object value -->
<isset name="Product" value="${LoopProduct}" scope="request"/>

<!-- Expression with calculation -->
<isset name="brandsPerCol" value="${Math.floor(numOfBrands/4) + 1}" scope="page"/>

<!-- Boolean value -->
<isset name="isActive" value="${true}" scope="request"/>

<!-- Complex expression -->
<isset name="totalPrice" value="${product.price.multiply(quantity)}" scope="page"/>
```

### scope

**Type:** String  
**Allowed Values:** `"session"`, `"request"`, `"page"`  
**Required:** Yes  
**Default:** `"session"` (if not specified)

Specifies the scope in which the variable will be available, defining its visibility and lifetime.

**Values:**

#### "session"

Variables are available across multiple requests within a user's session. The variable persists until the session ends or is explicitly removed.

**Use Cases:**
- User preferences or settings
- Multi-step workflow state
- Shopping cart data
- User authentication state
- Cross-request data sharing

**Characteristics:**
- Lifetime: Entire session duration
- Visibility: All templates in the session
- Can be used in expressions
- Persists across page redirects

```isml
<isset name="userPreference" value="${'darkMode'}" scope="session"/>
<isset name="checkoutStep" value="${2}" scope="session"/>
```

**Note:** If no scope is specified when setting the variable, the scope defaults to `"session"`.

#### "request"

Variables are available for the current internal Salesforce B2C Commerce request. The variable is not available for multiple requests and does not persist after an interaction continue node.

**Use Cases:**
- Request-specific processing flags
- Temporary data transformation
- Single-request calculations
- Pipeline Dictionary replacements (pdict is deprecated)

**Characteristics:**
- Lifetime: Current request only
- Visibility: All templates in the current request
- Does not persist across redirects
- Recommended replacement for deprecated `pdict` scope

```isml
<isset name="Product" value="${LoopProduct}" scope="request"/>
<isset name="processingFlag" value="${true}" scope="request"/>
```

**Important:** The `pdict` variable scope is **deprecated**. Use `scope="request"` instead. Request variables are not available after interaction continue nodes.

#### "page"

Variables are available only on the current ISML page. The variable's lifetime ends when the page processing completes.

**Use Cases:**
- Temporary calculations within a template
- Loop iteration variables
- Page-specific formatting variables
- Decorator template selection
- Conditional display logic

**Characteristics:**
- Lifetime: Current page only
- Visibility: Current ISML page
- Ideal for temporary values
- Automatically cleaned up after page processing

```isml
<isset name="brandsPerCol" value="${Math.floor(numOfBrands/4) + 1}" scope="page"/>
<isset name="DecoratorTemplate" value="account/pt_account" scope="page"/>
```

## Purpose

The `<isset>` element serves several critical purposes in ISML templates:

1. **Variable Declaration and Initialization:** The first occurrence of `<isset>` in a template declares and sets the variable. There is no separate declaration tag needed.

2. **Variable Reassignment:** If the variable already exists, `<isset>` resets it to the specified value.

3. **Scope Management:** Explicitly control variable visibility and lifetime across session, request, and page scopes.

4. **Expression Evaluation:** Evaluate complex expressions and store results for reuse.

5. **Data Flow Control:** Manage data between templates and across requests.

## Variable Scope Comparison

| Scope | Lifetime | Visibility | Persistence | Common Use Cases |
|-------|----------|------------|-------------|------------------|
| `page` | Current page only | Current ISML page | No | Temporary calculations, decorator selection |
| `request` | Current request | All templates in request | No | Request flags, pdict replacement |
| `session` | User session | All requests in session | Yes | User preferences, workflow state |

## Declaration and Reassignment Behavior

### Initial Declaration

The first time `<isset>` is used with a variable name, it creates (declares) the variable and assigns the initial value:

```isml
<!-- First occurrence - declares and initializes -->
<isset name="counter" value="${0}" scope="page"/>
```

### Reassignment

Subsequent uses of `<isset>` with the same variable name update (reassign) the variable's value:

```isml
<!-- First occurrence - declares and initializes -->
<isset name="counter" value="${0}" scope="page"/>

<!-- Second occurrence - updates the value -->
<isset name="counter" value="${counter + 1}" scope="page"/>

<!-- Third occurrence - updates again -->
<isset name="counter" value="${counter * 2}" scope="page"/>
<!-- counter is now 2 -->
```

## Common Use Cases

### Creating Custom Variables for Display

```isml
<!-- Define a color variable -->
<isset name="color" value="${'#A0CC99'}" scope="page"/>

<!-- Use in template -->
<div style="background-color: ${color}">
  Content here
</div>
```

### Counter Variables for Loops

```isml
<!-- Initialize counter -->
<isset name="counter" value="${0}" scope="page"/>

<isloop items="${products}" var="product">
  <!-- Increment counter -->
  <isset name="counter" value="${counter + 1}" scope="page"/>
  
  <div class="product-${counter}">
    ${product.name}
  </div>
</isloop>

<!-- Display total count -->
<p>Total products: ${counter}</p>
```

### Storing Loop Variables in Request Scope

```isml
<!-- Loop through products from Pipeline Dictionary -->
<isloop items="${pdict.ProductPagingModel.pageElements}" var="LoopProduct" begin="0" end="2">
  <!-- Store current product in request scope for use in included templates -->
  <isset name="Product" value="${LoopProduct}" scope="request"/>
  
  <!-- Include product detail template that expects Product variable -->
  <isinclude template="product/productDetail"/>
</isloop>
```

### Mathematical Calculations

```isml
<!-- Calculate number of brands per column -->
<isset name="brandsPerCol" value="${Math.floor(numOfBrands/4) + 1}" scope="page"/>

<!-- Use calculated value -->
<div class="brand-grid" data-cols="4" data-per-col="${brandsPerCol}">
  <!-- Grid content -->
</div>
```

### Conditional Decorator Template Selection

```isml
<!-- Set default decorator template -->
<isset name="DecoratorTemplate" value="account/pt_account" scope="page"/>

<!-- Override for AJAX requests -->
<isif condition="${pdict.CurrentHttpParameterMap.format.stringValue == 'ajax' || pdict.CurrentHttpParameterMap.pwr.stringValue == 'true' || pdict.CurrentHttpParameterMap.source.stringValue == 'search' || pdict.CurrentHttpParameterMap.source.stringValue == 'quickview' || pdict.CurrentHttpParameterMap.source.stringValue == 'cart'}">
  <isset name="DecoratorTemplate" value="util/pt_empty" scope="page"/>
</isif>

<!-- Apply the selected decorator -->
<isdecorate template="${DecoratorTemplate}">
  <!-- Page content -->
</isdecorate>
```

### Session State Management

```isml
<!-- Store user preference in session -->
<isset name="preferredView" value="${'grid'}" scope="session"/>

<!-- Store checkout progress -->
<isset name="checkoutStep" value="${1}" scope="session"/>

<!-- Later in another template, update the checkout step -->
<isset name="checkoutStep" value="${checkoutStep + 1}" scope="session"/>
```

### Complex Object Manipulation

```isml
<!-- Store product variant -->
<isset name="selectedVariant" value="${product.variationModel.selectedVariant}" scope="request"/>

<!-- Calculate discounted price -->
<isset name="discountedPrice" value="${selectedVariant.priceModel.price.multiply(0.8)}" scope="page"/>

<!-- Store formatted price for display -->
<isset name="displayPrice" value="${discountedPrice}" scope="page"/>
```

### Request-Level Flags

```isml
<!-- Set processing flag for current request -->
<isset name="isProcessing" value="${true}" scope="request"/>

<!-- Set error flag -->
<isset name="hasError" value="${false}" scope="request"/>

<!-- Later in the template -->
<isif condition="${pdict.someError}">
  <isset name="hasError" value="${true}" scope="request"/>
</isif>

<!-- Display error message if flag is set -->
<isif condition="${hasError}">
  <div class="error-message">An error occurred</div>
</isif>
```

## Accessing Custom Variables

Variables created with `<isset>` are accessed using expression syntax `${variableName}`:

### Page Scope Access

```isml
<!-- Set page-scoped variable -->
<isset name="color" value="${'#A0CC99'}" scope="page"/>

<!-- Access the variable -->
<div style="color: ${color}">
  Text in custom color
</div>
```

### Request Scope Access

```isml
<!-- Set request-scoped variable -->
<isset name="Product" value="${LoopProduct}" scope="request"/>

<!-- Access in same template -->
<isprint value="${Product.name}"/>

<!-- Access in included template -->
<isinclude template="product/components/productTile"/>
<!-- productTile.isml can access ${Product} -->
```

### Session Scope Access

```isml
<!-- Set in one template -->
<isset name="userTheme" value="${'dark'}" scope="session"/>

<!-- Access in another template during same session -->
<div class="theme-${userTheme}">
  <!-- Content adapts to user theme -->
</div>
```

## Integration with Other ISML Elements

### With isprint

```isml
<!-- Create variable -->
<isset name="brandsPerCol" value="${Math.floor(numOfBrands/4) + 1}" scope="page"/>

<!-- Print the value -->
<isprint value="${brandsPerCol}" style="INTEGER"/>
```

### With isif

```isml
<!-- Set conditional flag -->
<isset name="showDiscount" value="${product.price.value > 100}" scope="page"/>

<!-- Use in conditional logic -->
<isif condition="${showDiscount}">
  <div class="discount-badge">Special Offer</div>
</isif>
```

### With isloop

```isml
<!-- Initialize counter before loop -->
<isset name="displayCount" value="${0}" scope="page"/>

<isloop items="${products}" var="product" status="loopStatus">
  <!-- Update counter for visible products -->
  <isif condition="${product.visible}">
    <isset name="displayCount" value="${displayCount + 1}" scope="page"/>
  </isif>
</isloop>

<!-- Use counter after loop -->
<p>Showing ${displayCount} products</p>
```

### With isdecorate

```isml
<!-- Dynamically select decorator template -->
<isset name="DecoratorTemplate" value="account/pt_account" scope="page"/>

<isif condition="${pdict.CurrentHttpParameterMap.format.stringValue == 'ajax'}">
  <isset name="DecoratorTemplate" value="util/pt_empty" scope="page"/>
</isif>

<!-- Apply selected decorator -->
<isdecorate template="${DecoratorTemplate}">
  <!-- Page content -->
</isdecorate>
```

## Best Practices

### 1. Always Specify Scope Explicitly

```isml
<!-- ❌ Bad: Relies on default session scope -->
<isset name="tempValue" value="${calculation}"/>

<!-- ✅ Good: Explicit scope declaration -->
<isset name="tempValue" value="${calculation}" scope="page"/>
```

### 2. Use Appropriate Scope for Data Lifetime

```isml
<!-- ✅ Page scope for temporary calculations -->
<isset name="total" value="${price * quantity}" scope="page"/>

<!-- ✅ Request scope for current request data -->
<isset name="currentProduct" value="${product}" scope="request"/>

<!-- ✅ Session scope for persistent user data -->
<isset name="userPreferences" value="${preferences}" scope="session"/>
```

### 3. Use Meaningful Variable Names

```isml
<!-- ❌ Bad: Unclear purpose -->
<isset name="temp" value="${value}" scope="page"/>
<isset name="x" value="${10}" scope="page"/>

<!-- ✅ Good: Descriptive names -->
<isset name="formattedPrice" value="${value}" scope="page"/>
<isset name="maxItemsPerPage" value="${10}" scope="page"/>
```

### 4. Initialize Counters Before Loops

```isml
<!-- ✅ Good: Initialize counter before use -->
<isset name="visibleCount" value="${0}" scope="page"/>

<isloop items="${products}" var="product">
  <isif condition="${product.visible}">
    <isset name="visibleCount" value="${visibleCount + 1}" scope="page"/>
  </isif>
</isloop>
```

### 5. Clean Up Session Variables When No Longer Needed

```isml
<!-- Set session variable for workflow -->
<isset name="checkoutStep" value="${1}" scope="session"/>

<!-- ... checkout process ... -->

<!-- Remove when workflow complete -->
<isremove name="checkoutStep" scope="session"/>
```

### 6. Use Request Scope Instead of Deprecated pdict

```isml
<!-- ❌ Deprecated: pdict scope -->
<isset name="Product" value="${LoopProduct}" scope="pdict"/>

<!-- ✅ Good: Use request scope -->
<isset name="Product" value="${LoopProduct}" scope="request"/>
```

## Performance Considerations

### Scope Impact on Performance

- **Page scope:** Fastest, no persistence overhead
- **Request scope:** Moderate, cleared after request
- **Session scope:** Slower, requires session serialization

### Memory Management

```isml
<!-- ✅ Use page scope for large temporary objects -->
<isset name="largeDataSet" value="${complexCalculation}" scope="page"/>

<!-- Process data -->
<!-- Data automatically freed after page completes -->

<!-- ✅ Clean up session variables explicitly -->
<isset name="temporarySessionData" value="${data}" scope="session"/>
<!-- ... use data ... -->
<isremove name="temporarySessionData" scope="session"/>
```

## Security Considerations

### Avoid Storing Sensitive Data in Session Scope

```isml
<!-- ❌ Bad: Sensitive data in session -->
<isset name="creditCardNumber" value="${ccNumber}" scope="session"/>

<!-- ✅ Good: Use page scope and clean up -->
<isset name="creditCardNumber" value="${ccNumber}" scope="page"/>
<!-- Process immediately -->
<!-- Automatically cleared after page -->
```

### Sanitize User Input Before Storage

```isml
<!-- ✅ Good: Validate and sanitize -->
<isscript>
  var sanitized = require('*/cartridge/scripts/util/sanitize').sanitizeInput(userInput);
</isscript>
<isset name="userComment" value="${sanitized}" scope="request"/>
```

## Troubleshooting

### Variable Not Accessible

**Problem:** Variable set in one template not available in another.

**Solutions:**
- Verify scope is appropriate (use `request` or `session` for cross-template access)
- Ensure variable is set before being accessed
- Check for typos in variable names (case-sensitive)

### Variable Value Not Updating

**Problem:** Variable shows old value despite reassignment.

**Solutions:**
- Verify scope matches between declaration and reassignment
- Check for multiple `<isset>` declarations with same name but different scopes
- Ensure reassignment occurs after initial declaration in execution flow

### Session Variables Persisting Too Long

**Problem:** Session variables remain after they should be cleared.

**Solutions:**
- Use `<isremove>` to explicitly clean up session variables
- Consider using `request` or `page` scope for temporary data
- Implement proper session cleanup in workflow completion

## Related Elements

- **`<isremove>`** - Removes variables from specified scopes (cleanup counterpart to `<isset>`)
- **`<isprint>`** - Outputs variable values with formatting
- **`<isif>`** - Conditional logic using variables
- **`<isloop>`** - Iteration with variable assignment
- **`<isdecorate>`** - Template decoration using variable-based template selection
- **`<isscript>`** - Complex variable manipulation in script blocks

## See Also

- [isremove](./isremove.md) - Remove variables from scopes
- [isprint](./isprint.md) - Format and output variable values
- [isloop](./isloop.md) - Loop iteration with variable assignment
- [isif](./isif.md) - Conditional logic with variables
