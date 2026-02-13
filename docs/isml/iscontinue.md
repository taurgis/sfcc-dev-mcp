# ISML iscontinue Element

## Overview

The `<iscontinue>` element stops processing the current item in a loop and immediately starts processing the next item. It provides loop flow control by skipping the remaining code in the current iteration and jumping back to the top of the loop to begin the next iteration.

**Loop Control:** This element can only be used within an `<isloop>...</isloop>` loop structure. It's similar to the `continue` statement in Java.

## Syntax

```isml
<iscontinue/>
```

## Attributes

This element has no attributes.

## Purpose

The `<iscontinue>` element serves to:

1. **Skip Current Iteration:** Stop processing the current loop item immediately
2. **Jump to Next Item:** Move to the next iteration of the loop
3. **Filter Loop Items:** Conditionally skip items that don't meet certain criteria
4. **Optimize Processing:** Avoid unnecessary processing for items that should be ignored
5. **Loop Flow Control:** Provide fine-grained control over loop execution

## Difference from isnext

Understanding the difference between `<iscontinue>` and `<isnext>` is crucial:

| Element | Behavior | When to Use |
|---------|----------|-------------|
| `<isnext>` | Moves the iterator forward one position and **continues processing the next line of code** | When you want to skip an item but continue executing code after the `<isnext>` tag |
| `<iscontinue>` | **Breaks out of the current iteration** and jumps back to the top of the loop to start processing the next item | When you want to skip all remaining code in the current iteration |

### Visual Example

```isml
<isloop items="${products}" var="product">
  <isif condition="${!product.available}">
    <iscontinue/>  <!-- Skips to next iteration immediately -->
  </isif>
  <!-- This code is NOT executed for unavailable products -->
  <div>${product.name}</div>
</isloop>

<isloop items="${products}" var="product">
  <isif condition="${!product.available}">
    <isnext/>  <!-- Moves iterator but continues with next line -->
  </isif>
  <!-- This code IS still executed even after isnext -->
  <div>${product.name}</div>
</isloop>
```

**Key Difference:**
- `<iscontinue/>` = Skip everything else in this iteration and go to the next item
- `<isnext/>` = Move to the next item but keep executing code below

## Rules of Use

### Loop Requirement

⚠️ **CRITICAL:** `<iscontinue/>` can **only be used within** an `<isloop>...</isloop>` structure.

```isml
<!-- Good: Inside a loop -->
<isloop items="${products}" var="product">
  <isif condition="${product.price > 1000}">
    <iscontinue/>
  </isif>
  <div>${product.name}</div>
</isloop>

<!-- Bad: Outside a loop -->
<isif condition="${someCondition}">
  <iscontinue/>  <!-- ERROR: Not in a loop -->
</isif>
```

### Conditional Usage

`<iscontinue/>` is typically used within conditional statements to selectively skip items:

```isml
<isloop items="${products}" var="product">
  <!-- Skip out-of-stock products -->
  <isif condition="${!product.available}">
    <iscontinue/>
  </isif>
  
  <!-- This code only executes for available products -->
  <div class="product">${product.name}</div>
</isloop>
```

### Nested Loops

In nested loops, `<iscontinue/>` only affects the **innermost loop** it appears in:

```isml
<isloop items="${categories}" var="category">
  <h2>${category.name}</h2>
  
  <isloop items="${category.products}" var="product">
    <isif condition="${!product.available}">
      <iscontinue/>  <!-- Only skips in the product loop -->
    </isif>
    <div>${product.name}</div>
  </isloop>
  
</isloop>
```

## Common Use Cases

### Filtering Payment Methods

Skip specific payment methods (from the official SFCC documentation example):

```isml
<div class="payment-method-options">
  <isloop items="${pdict.CurrentForms.billing.paymentMethods.selectedPaymentMethodID.options}" var="paymentMethodType">
    
    <iscomment>Ignore GIFT_CERTIFICATE method, GCs are handled separately before other payment methods.</iscomment>
    <isif condition="${paymentMethodType.value.equals(dw.order.PaymentInstrument.METHOD_GIFT_CERTIFICATE)}">
      <iscontinue/>
    </isif>
    
    <div class="form-row">
      <isset name="radioID" value="${paymentMethodType.value}" scope="page"/>
      <label for="is-${radioID}">
        <isprint value="${Resource.msg(paymentMethodType.label,'forms',null)}"/>:
      </label>
      
      <isif condition="${paymentMethodType.checked || (!empty(pdict.selectedPaymentID) && paymentMethodType.htmlValue == pdict.selectedPaymentID)}">
        <input type="radio" checked="checked" class="input-radio" 
               name="${pdict.CurrentForms.billing.paymentMethods.selectedPaymentMethodID.htmlName}" 
               value="${paymentMethodType.htmlValue}" 
               id="is-${radioID}" />
      <iselse/>
        <input type="radio" class="input-radio" 
               name="${pdict.CurrentForms.billing.paymentMethods.selectedPaymentMethodID.htmlName}" 
               value="${paymentMethodType.htmlValue}" 
               id="is-${radioID}" />
      </isif>
    </div>
    
  </isloop>
</div>
```

### Skipping Unavailable Products

```isml
<div class="product-grid">
  <isloop items="${pdict.products}" var="product" status="loopStatus">
    <!-- Skip out-of-stock products -->
    <isif condition="${!product.available}">
      <iscontinue/>
    </isif>
    
    <!-- Only available products reach this code -->
    <div class="product-tile">
      <h3>${product.name}</h3>
      <span class="price">${product.price}</span>
      <button class="add-to-cart">Add to Cart</button>
    </div>
  </isloop>
</div>
```

### Filtering Categories

```isml
<ul class="category-navigation">
  <isloop items="${topCategory.subCategories}" var="category">
    <!-- Skip hidden or offline categories -->
    <isif condition="${!category.online || category.custom.hideFromNav}">
      <iscontinue/>
    </isif>
    
    <li>
      <a href="${URLUtils.url('Search-Show', 'cgid', category.ID)}">
        ${category.displayName}
      </a>
    </li>
  </isloop>
</ul>
```

### Excluding Specific Product Types

```isml
<isloop items="${pdict.searchResults.productHits}" var="productHit">
  <!-- Skip gift cards and virtual products -->
  <isif condition="${productHit.product.isGiftCard() || productHit.product.custom.isVirtual}">
    <iscontinue/>
  </isif>
  
  <!-- Only physical products are displayed -->
  <div class="product-result">
    <img src="${productHit.product.getImage('medium').URL}" alt="${productHit.product.name}"/>
    <h4>${productHit.product.name}</h4>
  </div>
</isloop>
```

### Multiple Conditions for Skipping

```isml
<isloop items="${pdict.products}" var="product">
  <!-- Skip if any exclusion condition is met -->
  <isif condition="${!product.available || product.price.value === 0 || product.custom.isDiscontinued}">
    <iscontinue/>
  </isif>
  
  <!-- Only products that pass all checks are rendered -->
  <div class="product">
    ${product.name} - ${product.price}
  </div>
</isloop>
```

### Filtering with Multiple Criteria

```isml
<div class="product-recommendations">
  <isloop items="${pdict.recommendations}" var="product">
    <!-- Skip if product doesn't meet criteria -->
    <isif condition="${product.price.value > pdict.maxPrice}">
      <iscontinue/>
    </isif>
    
    <isif condition="${product.custom.excludeFromRecommendations}">
      <iscontinue/>
    </isif>
    
    <isif condition="${!product.searchable}">
      <iscontinue/>
    </isif>
    
    <!-- Display qualifying recommendations -->
    <div class="recommendation-tile">
      <h4>${product.name}</h4>
      <span>${product.price}</span>
    </div>
  </isloop>
</div>
```

### Skipping Empty Values

```isml
<ul class="attribute-list">
  <isloop items="${product.custom.specifications}" var="spec">
    <!-- Skip empty specifications -->
    <isif condition="${empty(spec.value)}">
      <iscontinue/>
    </isif>
    
    <li>
      <strong>${spec.name}:</strong> ${spec.value}
    </li>
  </isloop>
</ul>
```

## Performance Considerations

### Efficient Filtering

Using `<iscontinue/>` is more efficient than wrapping large blocks of code in conditional statements:

```isml
<!-- Less efficient: Large conditional block -->
<isloop items="${products}" var="product">
  <isif condition="${product.available}">
    <div class="product">
      <!-- 50 lines of code -->
    </div>
  </isif>
</isloop>

<!-- More efficient: Early exit with iscontinue -->
<isloop items="${products}" var="product">
  <isif condition="${!product.available}">
    <iscontinue/>
  </isif>
  
  <div class="product">
    <!-- 50 lines of code -->
  </div>
</isloop>
```

**Benefits:**
- Cleaner code structure
- Reduced indentation levels
- Faster template processing for skipped items
- Better readability

### Avoiding Unnecessary Processing

```isml
<isloop items="${pdict.orders}" var="order">
  <!-- Skip orders that don't need processing -->
  <isif condition="${order.status.value == dw.order.Order.ORDER_STATUS_CANCELLED}">
    <iscontinue/>
  </isif>
  
  <isif condition="${order.totalGrossPrice.value === 0}">
    <iscontinue/>
  </isif>
  
  <!-- Expensive operations only run for valid orders -->
  <isscript>
    var shipments = order.getShipments();
    var tracking = calculateTrackingInfo(order);
  </isscript>
  
  <div class="order-details">
    <!-- Complex order rendering -->
  </div>
</isloop>
```

## Best Practices

### Early Exit Pattern

Place `<iscontinue/>` checks at the **beginning** of the loop for better readability:

```isml
<!-- Good: Early exit pattern -->
<isloop items="${products}" var="product">
  <!-- Exclusion checks first -->
  <isif condition="${!product.available}">
    <iscontinue/>
  </isif>
  
  <isif condition="${product.custom.hidden}">
    <iscontinue/>
  </isif>
  
  <!-- Main processing logic follows -->
  <div class="product">${product.name}</div>
</isloop>

<!-- Less clear: Exclusions mixed with logic -->
<isloop items="${products}" var="product">
  <div class="product-wrapper">
    <isif condition="${!product.available}">
      <iscontinue/>  <!-- Less obvious -->
    </isif>
    ${product.name}
  </div>
</isloop>
```

### Combine Multiple Conditions

When possible, combine multiple exclusion conditions into a single check:

```isml
<!-- Good: Combined conditions -->
<isloop items="${products}" var="product">
  <isif condition="${!product.available || product.price.value === 0 || product.custom.hidden}">
    <iscontinue/>
  </isif>
  
  <div>${product.name}</div>
</isloop>

<!-- Less efficient: Multiple separate checks -->
<isloop items="${products}" var="product">
  <isif condition="${!product.available}"><iscontinue/></isif>
  <isif condition="${product.price.value === 0}"><iscontinue/></isif>
  <isif condition="${product.custom.hidden}"><iscontinue/></isif>
  
  <div>${product.name}</div>
</isloop>
```

### Use Comments for Clarity

Always comment why you're skipping items:

```isml
<isloop items="${paymentMethods}" var="method">
  <iscomment>
    Gift certificates are handled separately in the checkout flow
    and should not appear in the standard payment method list
  </iscomment>
  <isif condition="${method.value.equals(dw.order.PaymentInstrument.METHOD_GIFT_CERTIFICATE)}">
    <iscontinue/>
  </isif>
  
  <div class="payment-option">${method.label}</div>
</isloop>
```

### Avoid Overuse

Don't use `<iscontinue/>` when a simple conditional would be clearer:

```isml
<!-- Overkill: Simple case doesn't need iscontinue -->
<isloop items="${products}" var="product">
  <isif condition="${!product.available}">
    <iscontinue/>
  </isif>
  
  <div>${product.name}</div>
</isloop>

<!-- Better: Simple conditional -->
<isloop items="${products}" var="product">
  <isif condition="${product.available}">
    <div>${product.name}</div>
  </isif>
</isloop>
```

**Use `<iscontinue/>`** when:
- You have complex logic after the check
- You have multiple exclusion conditions
- You want to avoid deep nesting

**Use simple `<isif>`** when:
- The conditional block is short
- There's only one simple condition
- The wrapped code is minimal

## Related Elements

- **`<isloop>`**: Loop structure that contains `<iscontinue>`
- **`<isnext>`**: Advances iterator but continues processing (different behavior)
- **`<isbreak>`**: Exits the loop entirely (stronger than `<iscontinue>`)
- **`<isif>`**: Conditional statement often used with `<iscontinue>`

## Common Patterns

### Guard Clause Pattern

```isml
<isloop items="${products}" var="product">
  <!-- Guard clauses at the top -->
  <isif condition="${!product.available}"><iscontinue/></isif>
  <isif condition="${product.price.value === 0}"><iscontinue/></isif>
  <isif condition="${empty(product.name)}"><iscontinue/></isif>
  
  <!-- Main logic -->
  <div class="product">
    <h3>${product.name}</h3>
    <span class="price">${product.price}</span>
  </div>
</isloop>
```

### Status-Based Filtering

```isml
<isloop items="${orders}" var="order">
  <!-- Only show completed orders -->
  <isif condition="${order.status.value != dw.order.Order.ORDER_STATUS_COMPLETED}">
    <iscontinue/>
  </isif>
  
  <div class="order">
    Order #${order.orderNo} - ${order.totalGrossPrice}
  </div>
</isloop>
```

### Permission-Based Display

```isml
<isloop items="${menuItems}" var="item">
  <!-- Skip items user doesn't have permission to see -->
  <isif condition="${!item.custom.isPublic && !customer.authenticated}">
    <iscontinue/>
  </isif>
  
  <isif condition="${item.custom.requiresRole && !customer.isMemberOfCustomerGroup(item.custom.requiredRole)}">
    <iscontinue/>
  </isif>
  
  <li class="menu-item">
    <a href="${item.url}">${item.label}</a>
  </li>
</isloop>
```

## Troubleshooting

### Continue Not Working

**Problem:** Items are still being processed after `<iscontinue/>`.

**Solution:** Check that the condition is correct and `<iscontinue/>` is inside the `<isif>` block:

```isml
<!-- Wrong: iscontinue outside if block -->
<isif condition="${!product.available}"></isif>
<iscontinue/>  <!-- This always executes -->

<!-- Correct: iscontinue inside if block -->
<isif condition="${!product.available}">
  <iscontinue/>
</isif>
```

### Using Outside Loop

**Problem:** Error when using `<iscontinue/>` outside a loop.

**Solution:** Ensure `<iscontinue/>` is always inside an `<isloop>` structure:

```isml
<!-- Wrong: Outside loop -->
<isif condition="${someCondition}">
  <iscontinue/>  <!-- ERROR -->
</isif>

<!-- Correct: Inside loop -->
<isloop items="${items}" var="item">
  <isif condition="${someCondition}">
    <iscontinue/>  <!-- OK -->
  </isif>
</isloop>
```

### Nested Loop Issues

**Problem:** `<iscontinue/>` affecting wrong loop level.

**Solution:** Remember that `<iscontinue/>` only affects the innermost loop:

```isml
<isloop items="${categories}" var="category">
  <isloop items="${category.products}" var="product">
    <isif condition="${!product.available}">
      <iscontinue/>  <!-- Only skips in product loop -->
    </isif>
  </isloop>
</isloop>
```

## Summary

The `<iscontinue>` element is a powerful loop control mechanism that:

- ✅ Skips the current loop iteration immediately
- ✅ Jumps back to the top of the loop for the next item
- ✅ Improves code readability with early exit patterns
- ✅ Optimizes performance by avoiding unnecessary processing
- ✅ Works only within `<isloop>` structures
- ✅ Differs from `<isnext>` by breaking out completely rather than just advancing

Use `<iscontinue/>` to write cleaner, more efficient ISML templates by filtering out unwanted items early in loop processing.
