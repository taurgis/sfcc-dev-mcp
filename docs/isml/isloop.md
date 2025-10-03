# ISML isloop Element

## Overview

The `<isloop>` element creates loops for flow control in ISML templates. It enables iteration over collections such as products, categories, search results, and any iterable objects. The element provides powerful loop control with support for begin/end indices, step increments, and loop status tracking.

## Syntax

```isml
<isloop
  (items = item_object) | (iterator = iter_object)  // required - one or the other
  (alias = alias_name) | (var = var_name)          // required - one or the other
  status = status_name                              // optional
  begin  = start_index                              // optional
  end    = stop_index                               // optional
  step   = increment_index                          // optional
>
  ... loop content ...
</isloop>
```

## Required Attributes

### items / iterator

**Type:** Expression  
**Required:** Yes (one or the other, not both)

Specifies the iterable collection to loop over.

- `items = item_object` - Expression that returns an object to iterate over (preferred)
- `iterator = iter_object` - Expression that returns an object to iterate over (legacy)

**Recommendation:** Use `items` for consistency with modern ISML standards.

**Examples:**
```isml
<isloop items="${pdict.products}" var="product">
<isloop items="${category.onlineSubCategories}" var="subCategory">
<isloop items="${pdict.Order.shipments}" var="shipment">
```

### var / alias

**Type:** String  
**Required:** Yes (one or the other, not both)

Specifies the variable name that references the current item in the loop iteration.

- `var = var_name` - Name of the variable for the current item (preferred)
- `alias = alias_name` - Name of the variable for the current item (legacy)

**Recommendation:** Use `var` for consistency with modern ISML standards.

**Examples:**
```isml
<isloop items="${products}" var="product">
  ${product.name}
</isloop>
```

## Optional Attributes

### status

**Type:** String  
**Optional:** Yes

Specifies the variable name for the loop status object, which provides information about the current iteration state.

**Loop Status Properties:**

| Property | Type    | Description |
|----------|---------|-------------|
| `count`  | Integer | The number of iterations, starting with 1 |
| `index`  | Integer | The current index into the set of items (0-based) |
| `first`  | Boolean | True if this is the first item (count == 1) |
| `last`   | Boolean | True if this is the last item |
| `odd`    | Boolean | True if count is an odd value |
| `even`   | Boolean | True if count is an even value |

**Examples:**
```isml
<isloop items="${products}" var="product" status="loopStatus">
  <div class="${loopStatus.first ? 'first' : ''} ${loopStatus.last ? 'last' : ''}">
    ${loopStatus.count}. ${product.name}
  </div>
</isloop>
```

### begin

**Type:** Expression (Integer)  
**Optional:** Yes

Specifies the starting index for the loop. The loop will skip the first `begin` items and start iteration at the specified index.

- If `begin` is greater than 0, the first `begin` items are skipped
- If `begin` is less than 0, 0 is used as the begin value
- Default: 0 (start from the first item)

**Examples:**
```isml
<!-- Start from the 3rd item (skip first 2) -->
<isloop items="${products}" var="product" begin="2">
  ${product.name}
</isloop>
```

### end

**Type:** Expression (Integer)  
**Optional:** Yes

Specifies the ending index (inclusive) for the loop.

- If `end` is less than `begin`, the loop is skipped
- The item at the `end` index is included in the iteration
- Default: Length of the collection - 1

**Examples:**
```isml
<!-- Loop through items 0 to 4 (first 5 items) -->
<isloop items="${products}" var="product" end="4">
  ${product.name}
</isloop>
```

### step

**Type:** Expression (Integer)  
**Optional:** Yes

Specifies the increment value for the loop index.

- If `step` is less than 1, 1 is used as the step value
- Allows you to skip items during iteration
- Default: 1 (iterate through every item)

**Examples:**
```isml
<!-- Loop through every other item -->
<isloop items="${products}" var="product" step="2">
  ${product.name}
</isloop>
```

## Supporting Elements

### isbreak

Use `<isbreak>` to unconditionally terminate a loop early.

```isml
<isloop items="${products}" var="product" status="loopStatus">
  <isif condition="${loopStatus.count > 10}">
    <isbreak>
  </isif>
  ${product.name}
</isloop>
```

### isnext

Use `<isnext>` to skip to the next iteration of the loop.

```isml
<isloop items="${products}" var="product">
  <isif condition="${!product.available}">
    <isnext>
  </isif>
  ${product.name}
</isloop>
```

## Common Use Cases

### Iterating Over Products

```isml
<isloop items="${pdict.products}" var="product" status="productLoop">
  <div class="product ${productLoop.first ? 'first' : ''} ${productLoop.last ? 'last' : ''}">
    <h3>${product.name}</h3>
    <p>${product.shortDescription}</p>
    <span class="price">${product.price}</span>
  </div>
</isloop>
```

### Iterating Over Categories

```isml
<ul class="category-navigation">
  <isloop items="${category.onlineSubCategories}" var="subCategory">
    <li>
      <a href="${URLUtils.url('Search-Show', 'cgid', subCategory.ID)}">
        ${subCategory.displayName}
      </a>
    </li>
  </isloop>
</ul>
```

### Limited Range with Begin/End

```isml
<!-- Show only the first 4 products -->
<isloop items="${pdict.products}" var="product" begin="0" end="3">
  <div class="featured-product">
    ${product.name}
  </div>
</isloop>
```

### Every Other Item

```isml
<!-- Display products in alternating columns -->
<div class="column-left">
  <isloop items="${products}" var="product" begin="0" step="2">
    <div>${product.name}</div>
  </isloop>
</div>
<div class="column-right">
  <isloop items="${products}" var="product" begin="1" step="2">
    <div>${product.name}</div>
  </isloop>
</div>
```

### Nested Loops

```isml
<isloop items="${pdict.Order.shipments}" var="shipment" status="shipmentLoop">
  <h3>Shipment ${shipmentLoop.count}</h3>
  <isloop items="${shipment.productLineItems}" var="lineItem" status="itemLoop">
    <div class="line-item">
      <span>${itemLoop.count}.</span>
      <span>${lineItem.productName}</span>
      <span>Qty: ${lineItem.quantity}</span>
    </div>
  </isloop>
</isloop>
```

### Using Loop Status for Styling

```isml
<isloop items="${products}" var="product" status="loop">
  <div class="product-tile
    ${loop.first ? 'first-product' : ''}
    ${loop.last ? 'last-product' : ''}
    ${loop.odd ? 'odd-row' : 'even-row'}">
    ${product.name}
  </div>
</isloop>
```

### Conditional Loop with Break

```isml
<isloop items="${searchResults.hits}" var="product" status="loop">
  <isif condition="${loop.count > 20}">
    <isbreak>
  </isif>
  <div class="search-result">
    ${product.name}
  </div>
</isloop>
```

### Skipping Unavailable Items

```isml
<isloop items="${products}" var="product">
  <isif condition="${!product.available || product.price == null}">
    <isnext>
  </isif>
  <div class="available-product">
    <h4>${product.name}</h4>
    <span>${product.price}</span>
  </div>
</isloop>
```

## Best Practices

1. **Use Modern Attributes:** Prefer `items` over `iterator` and `var` over `alias` for better consistency with current ISML standards.

2. **Use Status for Styling:** Leverage the `status` object's `first`, `last`, `odd`, and `even` properties to apply conditional CSS classes instead of complex logic.

3. **Avoid Deep Nesting:** While nested loops are supported, deeply nested loops can impact performance and readability. Consider preprocessing data in controllers when possible.

4. **Use Begin/End for Pagination:** The `begin` and `end` attributes are useful for displaying subsets of data or implementing simple pagination.

5. **Performance Considerations:** 
   - Limit the number of iterations when possible using `begin`, `end`, or `<isbreak>`
   - Move complex logic outside of loops when feasible
   - Consider caching frequently accessed properties

6. **Null Safety:** Always check if the collection exists before looping:
   ```isml
   <isif condition="${pdict.products && pdict.products.length > 0}">
     <isloop items="${pdict.products}" var="product">
       ${product.name}
     </isloop>
   <iselse>
     <p>No products found.</p>
   </isif>
   ```

7. **Use Descriptive Variable Names:** Choose meaningful names for the `var` and `status` attributes to improve code readability.

## Performance Tips

- **Minimize DOM Operations:** Batch similar operations together within the loop
- **Cache Property Access:** If you access the same property multiple times, consider storing it in a variable
- **Use Step Wisely:** The `step` attribute can reduce iterations for specific use cases
- **Limit Iterations:** Use `begin` and `end` to process only necessary items
- **Avoid Heavy Computations:** Move expensive calculations to the controller or use `<isset>` before the loop

## Common Patterns

### Grid Layout with Row Tracking

```isml
<isloop items="${products}" var="product" status="loop">
  <isif condition="${loop.first || loop.count % 4 == 1}">
    <div class="row">
  </isif>
  
  <div class="col-3">
    ${product.name}
  </div>
  
  <isif condition="${loop.last || loop.count % 4 == 0}">
    </div>
  </isif>
</isloop>
```

### Comma-Separated List

```isml
<isloop items="${categories}" var="category" status="loop">
  ${category.displayName}<isif condition="${!loop.last}">, </isif>
</isloop>
```

### Table Rows with Alternating Colors

```isml
<table>
  <isloop items="${orders}" var="order" status="loop">
    <tr class="${loop.even ? 'even-row' : 'odd-row'}">
      <td>${order.orderNo}</td>
      <td>${order.creationDate}</td>
      <td>${order.total}</td>
    </tr>
  </isloop>
</table>
```

## Notes

- The loop variable (`var`/`alias`) is only available within the scope of the `<isloop>` element
- Loop status properties are read-only and updated automatically on each iteration
- Empty collections or null values will result in the loop body not executing
- The `index` property is 0-based, while `count` starts at 1
- When using `begin` and `end`, the `index` reflects the actual collection index, not the loop iteration count

## Related Elements

- `<isbreak>` - Terminate a loop unconditionally
- `<isnext>` - Skip to the next iteration
- `<isif>` - Conditional logic within loops
- `<isset>` - Set variables for use in loop iterations