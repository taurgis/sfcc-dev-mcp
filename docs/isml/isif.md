# ISML Conditional Elements (isif, iselseif, iselse)

## Overview

The conditional elements `<isif>`, `<iselseif>`, and `<iselse>` enable conditional template logic and control flow based on boolean expressions. These tags allow you to render different content based on runtime conditions without embedding business logic in templates.

**Design Principle:** These tags contain no business logic—only conditional visualization of data passed from controllers.

## Syntax

```isml
<isif condition="if_expression">
  <!-- Code executed if if_expression is true -->
  ...
<iselseif condition="elseif_expression">  <!-- 0 or more -->
  <!-- Code executed if elseif_expression is true -->
  ...
</iselseif>
<iselse>
  <!-- Code executed if all conditions are false -->
  ...
</isif>
```

## isif Element

### Overview

The `<isif>` element creates the primary conditional block. It evaluates an expression and executes the enclosed code if the condition is true.

### Required Attributes

#### condition

**Type:** String or Expression  
**Required:** Yes

The `if_expression` evaluates to a boolean value. If true, the code immediately following the `<isif>` tag is executed, and all `<iselseif>` and `<iselse>` tags are ignored.

**Examples:**
```isml
<!-- Simple comparison -->
<isif condition="${pdict.Product.price == 0}">
  <span class="free-gift">FREE GIFT!</span>
</isif>

<!-- Boolean property -->
<isif condition="${customer.authenticated}">
  <div>Welcome back, ${customer.profile.firstName}!</div>
</isif>

<!-- Expression -->
<isif condition="${pdict.Products.length > 0}">
  <div class="products-found">Found ${pdict.Products.length} products</div>
</isif>
```

### Purpose

The `<isif>` element enables:

1. **Conditional Rendering:** Show/hide content based on conditions
2. **Flow Control:** Direct template execution based on data state
3. **Data Validation:** Display content only when data is valid
4. **User Experience:** Adapt UI based on customer state or preferences
5. **Feature Flags:** Enable/disable features conditionally

### Rules of Use

**Required Closing Tag:** Every `<isif>` tag **must** have a matching `</isif>` tag.

```isml
<!-- Good: Proper closing tag -->
<isif condition="${product.available}">
  <span>In Stock</span>
</isif>

<!-- Bad: Missing closing tag -->
<isif condition="${product.available}">
  <span>In Stock</span>
<!-- ERROR: Missing </isif> -->
```

**Script Expressions:** You can use any B2C Commerce script expression as a condition, including:
- Local variables
- Pipeline Dictionary (pdict) variables
- Object properties and methods
- Functions and operators

```isml
<!-- Using pdict variables -->
<isif condition="${pdict.showBanner}">

<!-- Using object properties -->
<isif condition="${customer.profile.email != null}">

<!-- Using methods -->
<isif condition="${product.isAvailable()}">

<!-- Using functions -->
<isif condition="${empty(basket.productLineItems)}">
```

## iselseif Element

### Overview

The `<iselseif>` element specifies alternative conditions to test if the `<isif>` condition is false. Multiple `<iselseif>` tags can be used to create a chain of conditions.

### Required Attributes

#### condition

**Type:** String or Expression  
**Required:** Yes

The `elseif_expression` evaluates to a boolean value. This condition is only tested if the `<isif>` condition and all previous `<iselseif>` conditions are false.

**Examples:**
```isml
<isif condition="${pdict.Product.price == 0}">
  <span>FREE</span>
<iselseif condition="${pdict.Product.price < 100}">
  <span>Budget-Friendly</span>
<iselseif condition="${pdict.Product.price < 500}">
  <span>Mid-Range</span>
</isif>
```

### Purpose

The `<iselseif>` element allows:

1. **Multiple Conditions:** Test several conditions in sequence
2. **Fallback Logic:** Provide alternative rendering paths
3. **Range Checking:** Handle different value ranges
4. **State Management:** Handle multiple states of data

### Rules of Use

**Optional:** `<iselseif>` tags are optional—you can have zero or more.

**Multiple Allowed:** You can use **as many `<iselseif>` tags as needed**.

**Order Matters:** Conditions are tested in order from top to bottom. The first true condition wins.

**Placement:** Must appear **after** `<isif>` and **before** `<iselse>` (if present).

```isml
<!-- Good: Multiple iselseif tags -->
<isif condition="${status == 'new'}">
  <span class="badge-new">New</span>
<iselseif condition="${status == 'sale'}">
  <span class="badge-sale">Sale</span>
<iselseif condition="${status == 'clearance'}">
  <span class="badge-clearance">Clearance</span>
<iselseif condition="${status == 'backorder'}">
  <span class="badge-backorder">Back Order</span>
</isif>
```

## iselse Element

### Overview

The `<iselse>` element specifies what happens if neither the `<isif>` condition nor any `<iselseif>` conditions evaluate to true. It provides a default fallback.

### Attributes

**None:** The `<iselse>` element has no attributes.

### Purpose

The `<iselse>` element provides:

1. **Default Behavior:** Specify fallback when no conditions match
2. **Completeness:** Handle all possible cases
3. **Error Prevention:** Provide safe defaults
4. **User Feedback:** Show meaningful content when conditions fail

### Rules of Use

**Optional:** The `<iselse>` tag is optional.

**Only One:** You can only use **one `<iselse>` tag** per `<isif>` group.

**Last Position:** Must **always be the last tag** within an `<isif>` group (after all `<iselseif>` tags).

```isml
<!-- Good: Single iselse at the end -->
<isif condition="${product.available}">
  <span>In Stock</span>
<iselseif condition="${product.preorderable}">
  <span>Pre-Order</span>
<iselse>
  <span>Out of Stock</span>
</isif>

<!-- Bad: Multiple iselse tags -->
<isif condition="${condition1}">
  Content
<iselse>
  Default 1
</isif>
<iselse>  <!-- ERROR: Can't have second iselse -->
  Default 2
</isif>

<!-- Bad: iselse before iselseif -->
<isif condition="${condition1}">
  Content
<iselse>
  Default
</isif>
<iselseif condition="${condition2}">  <!-- ERROR: Must come before iselse -->
  Alternative
</isif>
```

## Evaluation Flow

The conditional group is evaluated in this order:

1. **`<isif>` condition** is tested first
   - If **true**: Execute code after `<isif>`, ignore all `<iselseif>` and `<iselse>`
   - If **false**: Continue to step 2

2. **Each `<iselseif>` condition** is tested in order
   - When first **true** `<iselseif>` is found: Execute its code, ignore remaining conditions
   - If all **false**: Continue to step 3

3. **`<iselse>` block** (if present)
   - Execute code after `<iselse>`

**Important:** Only **one block** of code executes per conditional group.

```isml
<isif condition="${price == 0}">
  FREE                    <!-- Executes if price is 0, stops here -->
<iselseif condition="${price < 50}">
  CHEAP                   <!-- Executes if price > 0 and < 50, stops here -->
<iselseif condition="${price < 100}">
  MODERATE                <!-- Executes if price >= 50 and < 100, stops here -->
<iselse>
  EXPENSIVE               <!-- Executes if price >= 100 -->
</isif>
```

## Boolean Interpretation

### Standard Boolean Values

```isml
<!-- true values -->
<isif condition="${true}">Executes</isif>
<isif condition="${1 == 1}">Executes</isif>
<isif condition="${!empty(array)}">Executes if array has items</isif>

<!-- false values -->
<isif condition="${false}">Doesn't execute</isif>
<isif condition="${1 == 2}">Doesn't execute</isif>
<isif condition="${empty(array)}">Executes if array is empty</isif>
```

### Non-Boolean Value Interpretation

**Non-null, Non-Boolean:** Interpreted as **true**

```isml
<isif condition="${'hello'}">
  This executes (non-empty string is true)
</isif>

<isif condition="${42}">
  This executes (number is true)
</isif>

<isif condition="${product}">
  This executes if product exists (object is true)
</isif>
```

**Null:** Interpreted as **false**

```isml
<isif condition="${null}">
  This doesn't execute
</isif>

<isif condition="${nonExistentVariable}">
  This doesn't execute (null/undefined is false)
</isif>
```

## Common Use Cases

### Product Availability

```isml
<isif condition="${product.available}">
  <button class="add-to-cart">Add to Cart</button>
<iselseif condition="${product.preorderable}">
  <button class="pre-order">Pre-Order</button>
<iselse>
  <button class="notify-me" disabled>Notify Me</button>
</isif>
```

### Customer Authentication

```isml
<isif condition="${customer.authenticated}">
  <div class="user-menu">
    <span>Welcome, ${customer.profile.firstName}!</span>
    <a href="${URLUtils.url('Account-Show')}">My Account</a>
    <a href="${URLUtils.url('Login-Logout')}">Logout</a>
  </div>
<iselse>
  <div class="guest-menu">
    <a href="${URLUtils.url('Login-Show')}">Login</a>
    <a href="${URLUtils.url('Account-StartRegister')}">Register</a>
  </div>
</isif>
```

### Price Display

```isml
<isif condition="${pdict.Product.price == 0}">
  <span class="price-free">FREE GIFT!</span>
<iselseif condition="${pdict.Product.price < 100}">
  <span class="price-special">Special Deal: ${pdict.Product.price}</span>
<iselse>
  <span class="price-regular">Today's Price: ${pdict.Product.price}</span>
</isif>
```

### Coupon Code Validation

```isml
<input type="text" 
       name="${pdict.CurrentForms.cart.couponCode.htmlName}" 
       size="30"
<isif condition="${pdict.CurrentForms.cart.couponCode.valid}">
       value="${pdict.CurrentForms.cart.couponCode.htmlValue}"
<iselse>
       value=""
</isif>
/>
```

### Shipping Method Display

```isml
<isif condition="${shipment.shippingMethod.ID == 'express'}">
  <div class="shipping-express">
    <strong>Express Shipping</strong>
    <span>Arrives in 1-2 business days</span>
  </div>
<iselseif condition="${shipment.shippingMethod.ID == 'standard'}">
  <div class="shipping-standard">
    <strong>Standard Shipping</strong>
    <span>Arrives in 5-7 business days</span>
  </div>
<iselse>
  <div class="shipping-other">
    <strong>${shipment.shippingMethod.displayName}</strong>
  </div>
</isif>
```

### Product Badge Logic

```isml
<isif condition="${pdict.Product.name == 'case'}">
  <th>Monogram</th>
<iselseif condition="${pdict.Product.name == 'bag'}">
  <th>Monogram</th>
<iselse>
  <th>Unit Price</th>
</isif>
```

### Empty State Handling

```isml
<isif condition="${!empty(pdict.products)}">
  <div class="product-grid">
    <isloop items="${pdict.products}" var="product">
      <div class="product-tile">${product.name}</div>
    </isloop>
  </div>
<iselse>
  <div class="empty-state">
    <h2>No products found</h2>
    <p>Try adjusting your search or filters.</p>
  </div>
</isif>
```

### Promotion Banner

```isml
<isif condition="${pdict.activePromotion.type == 'percentage'}">
  <div class="promo-banner">Save ${pdict.activePromotion.value}%!</div>
<iselseif condition="${pdict.activePromotion.type == 'fixed'}">
  <div class="promo-banner">Save $${pdict.activePromotion.value}!</div>
<iselseif condition="${pdict.activePromotion.type == 'bogo'}">
  <div class="promo-banner">Buy One Get One Free!</div>
</isif>
```

### Order Status Display

```isml
<isif condition="${order.status.value == dw.order.Order.ORDER_STATUS_CREATED}">
  <span class="status-created">Order Placed</span>
<iselseif condition="${order.status.value == dw.order.Order.ORDER_STATUS_OPEN}">
  <span class="status-processing">Processing</span>
<iselseif condition="${order.status.value == dw.order.Order.ORDER_STATUS_COMPLETED}">
  <span class="status-completed">Shipped</span>
<iselseif condition="${order.status.value == dw.order.Order.ORDER_STATUS_CANCELLED}">
  <span class="status-cancelled">Cancelled</span>
</isif>
```

### Responsive Content

```isml
<isif condition="${pdict.isMobile}">
  <isinclude template="mobile/productTile"/>
<iselse>
  <isinclude template="desktop/productTile"/>
</isif>
```

### Alternating Row Colors

```isml
<isset name="color" value="${'#00FFFF'}" scope="page"/>
<table>
  <isloop items="${pdict.Basket.productLineItems}" var="lineItem">
    <tr>
      <td bgcolor="${color}">
        <isprint value="${lineItem.productName}"/>
      </td>
    </tr>
    
    <isif condition="${color == '#00FFFF'}">
      <isset name="color" value="${'#00CCFF'}" scope="page"/>
    <iselseif condition="${color == '#00CCFF'}">
      <isset name="color" value="${'#0099FF'}" scope="page"/>
    <iselse>
      <isset name="color" value="${'#00FFFF'}" scope="page"/>
    </isif>
  </isloop>
</table>
```

## Nested Conditionals

Conditional statements can be nested to create complex logic:

```isml
<isif condition="${customer.authenticated}">
  <isif condition="${customer.profile.custom.vipMember}">
    <div class="vip-badge">VIP Member</div>
  <iselse>
    <div class="member-badge">Member</div>
  </isif>
<iselse>
  <div class="guest-badge">Guest</div>
</isif>
```

### Complex Nested Example

```isml
<isif condition="${product.available}">
  
  <isif condition="${product.onSale}">
    <span class="price sale-price">
      ${product.salePrice}
      <del>${product.regularPrice}</del>
    </span>
  <iselse>
    <span class="price regular-price">
      ${product.price}
    </span>
  </isif>
  
  <button class="add-to-cart">Add to Cart</button>
  
<iselseif condition="${product.preorderable}">
  
  <span class="price pre-order-price">${product.price}</span>
  <button class="pre-order">Pre-Order</button>
  <span class="ship-date">Ships ${product.expectedShipDate}</span>
  
<iselse>
  
  <span class="out-of-stock">Out of Stock</span>
  <button class="notify-me">Notify When Available</button>
  
</isif>
```

## Best Practices

### Keep Conditions Simple

```isml
<!-- Good: Simple, readable condition -->
<isif condition="${product.available}">
  In Stock
</isif>

<!-- Avoid: Complex inline logic -->
<isif condition="${product.available && product.price > 0 && product.inventoryRecord.ATS.value > 5 && !product.custom.discontinued}">
  In Stock
</isif>

<!-- Better: Prepare complex logic in controller -->
<isif condition="${pdict.showAddToCart}">
  In Stock
</isif>
```

### Use Meaningful Variable Names

```isml
<!-- Good: Clear intent -->
<isif condition="${showPromotion}">
  <div class="promo">${promotion.message}</div>
</isif>

<!-- Less clear -->
<isif condition="${flag1}">
  <div class="promo">${data.msg}</div>
</isif>
```

### Avoid Business Logic in Templates

```isml
<!-- Bad: Business logic in template -->
<isif condition="${product.price * 0.8 < customer.profile.custom.maxDiscount}">
  Special discount available!
</isif>

<!-- Good: Logic in controller, condition in template -->
<isif condition="${pdict.eligibleForDiscount}">
  Special discount available!
</isif>
```

### Prefer Early Returns with isif

```isml
<!-- Good: Early exit pattern -->
<isif condition="${empty(products)}">
  <div class="empty-state">No products found</div>
  <!-- Exit early, no need for else -->
<iselse>
  <div class="product-grid">
    <isloop items="${products}" var="product">
      <!-- Product rendering -->
    </isloop>
  </div>
</isif>
```

### Use Comments for Complex Conditionals

```isml
<iscomment>
  Display shipping options based on cart total:
  - Free shipping for orders over $50
  - Flat rate $5 for orders $25-$50
  - Calculated rate for orders under $25
</iscomment>
<isif condition="${basket.totalGrossPrice.value > 50}">
  <span class="shipping-free">FREE SHIPPING</span>
<iselseif condition="${basket.totalGrossPrice.value > 25}">
  <span class="shipping-flat">Flat Rate $5</span>
<iselse>
  <span class="shipping-calculated">Shipping Calculated at Checkout</span>
</isif>
```

### Avoid Deep Nesting

```isml
<!-- Avoid: Deep nesting -->
<isif condition="${a}">
  <isif condition="${b}">
    <isif condition="${c}">
      <isif condition="${d}">
        Deep content
      </isif>
    </isif>
  </isif>
</isif>

<!-- Better: Combined conditions or guard clauses -->
<isif condition="${a && b && c && d}">
  Deep content
</isif>
```

## Performance Considerations

### Condition Evaluation Order

Place most likely conditions first to minimize evaluation:

```isml
<!-- Good: Most common case first -->
<isif condition="${customer.authenticated}">
  <!-- Most users are logged in -->
<iselse>
  <!-- Guest checkout less common -->
</isif>

<!-- Less efficient if most users are logged in -->
<isif condition="${!customer.authenticated}">
  <!-- Guest checkout (rare) -->
<iselse>
  <!-- Authenticated (common) -->
</isif>
```

### Avoid Repeated Expensive Calls

```isml
<!-- Bad: Repeated method calls -->
<isif condition="${product.getInventoryRecord().ATS.value > 0}">
  <span>In Stock: ${product.getInventoryRecord().ATS.value}</span>
</isif>

<!-- Good: Store result once -->
<isset name="inventory" value="${product.getInventoryRecord().ATS.value}" scope="page"/>
<isif condition="${inventory > 0}">
  <span>In Stock: ${inventory}</span>
</isif>
```

## Troubleshooting

### Missing Closing Tag

**Problem:** Template error about unclosed tag.

**Solution:** Ensure every `<isif>` has a matching `</isif>`:

```isml
<!-- Check tag pairs -->
<isif condition="${condition}">
  Content
</isif>  <!-- Don't forget this! -->
```

### Condition Always False

**Problem:** Code in `<isif>` never executes.

**Solution:** Check for null values and boolean interpretation:

```isml
<!-- Check for null -->
<isif condition="${product != null && product.available}">
  In Stock
</isif>

<!-- Verify boolean property -->
<isif condition="${product.available == true}">
  In Stock
</isif>
```

### Multiple iselse Tags

**Problem:** Error about duplicate `<iselse>` tags.

**Solution:** Use only one `<iselse>` per `<isif>` group:

```isml
<!-- Correct: Single iselse -->
<isif condition="${a}">
  A
<iselseif condition="${b}">
  B
<iselse>
  Default
</isif>
```

### Wrong Tag Order

**Problem:** `<iselseif>` after `<iselse>` causes error.

**Solution:** Always put `<iselse>` last:

```isml
<!-- Correct order -->
<isif condition="${a}">
  A
<iselseif condition="${b}">
  B
<iselseif condition="${c}">
  C
<iselse>
  Default
</isif>
```

## Related Elements

- **`<isset>`**: Set variables for use in conditions
- **`<isloop>`**: Often used with conditionals for iteration
- **`<iscomment>`**: Document complex conditional logic
- **`<iscontinue>`**: Skip loop iterations based on conditions
- **`<isbreak>`**: Exit loops based on conditions

## Summary

The conditional elements are fundamental for:

- ✅ Rendering content based on runtime conditions
- ✅ Handling multiple states and scenarios
- ✅ Providing user-specific experiences
- ✅ Managing empty states and fallbacks
- ✅ Adapting UI to data availability
- ✅ Creating dynamic, data-driven templates
- ✅ Separating presentation from business logic

Use `<isif>`, `<iselseif>`, and `<iselse>` to create flexible, maintainable templates that adapt to your data and user context.
