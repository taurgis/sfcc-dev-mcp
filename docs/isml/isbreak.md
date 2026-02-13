# ISML isbreak Element

## Overview

The `<isbreak>` element unconditionally terminates loop execution in ISML templates. It provides flow control to exit loops early when a specific condition is met, similar to the `break` statement in JavaScript, Java, and other programming languages. When used in nested loops, it only terminates the innermost loop in which it appears.

## Syntax

```isml
<isbreak/>
```

## Attributes

**None** - This is a self-closing tag with no attributes.

## Purpose

The `<isbreak>` element serves to:

1. **Early Loop Termination:** Exit a loop before iterating through all items
2. **Performance Optimization:** Stop processing when desired result is found
3. **Conditional Exit:** Combine with `<isif>` to exit based on conditions
4. **Limit Results:** Display only a specific number of items from a collection
5. **Error Prevention:** Exit loop when invalid state is detected

### Scope

- **Works within:** `<isloop>` elements
- **Terminates:** Only the innermost loop containing the `<isbreak>`
- **Does not affect:** Outer loops in nested loop structures

## Common Use Cases

### Limit Number of Items Displayed

```isml
<!-- Display only the first 3 products -->
<isloop items="${pdict.products}" var="product" status="loopStatus">
    <div class="product">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
    </div>
    
    <isif condition="${loopStatus.count >= 3}">
        <isbreak/>
    </isif>
</isloop>
```

### Exit When Condition is Met

```isml
<!-- Find the first available product and stop -->
<isloop items="${pdict.products}" var="product">
    <isif condition="${product.available && product.inStock}">
        <div class="first-available">
            <h3>Featured: ${product.name}</h3>
            <p>In Stock Now!</p>
        </div>
        <isbreak/>
    </isif>
</isloop>
```

### Prevent Excessive Processing

```isml
<!-- Process up to 10 items to prevent performance issues -->
<isloop items="${pdict.searchResults}" var="result" status="status">
    <div class="search-result">
        ${result.name}
    </div>
    
    <isif condition="${status.count >= 10}">
        <div class="more-results">
            <a href="${URLUtils.url('Search-ShowMore')}">View All Results</a>
        </div>
        <isbreak/>
    </isif>
</isloop>
```

### Error Detection and Exit

```isml
<!-- Exit loop if invalid data is encountered -->
<isloop items="${pdict.orderItems}" var="item" status="status">
    <isif condition="${!item.product || !item.quantity}">
        <div class="error">Invalid order item detected</div>
        <isbreak/>
    </isif>
    
    <div class="order-item">
        <span>${item.product.name}</span>
        <span>Qty: ${item.quantity}</span>
    </div>
</isloop>
```

### Display "Top N" Items

```isml
<!-- Show top 5 best sellers -->
<h2>Top 5 Best Sellers</h2>
<ol class="bestsellers">
    <isloop items="${pdict.bestSellers}" var="product" status="loop">
        <li>
            <a href="${URLUtils.url('Product-Show', 'pid', product.ID)}">
                ${product.name}
            </a>
        </li>
        
        <isif condition="${loop.count >= 5}">
            <isbreak/>
        </isif>
    </isloop>
</ol>
```

### Category Navigation Limit

```isml
<!-- Show first 8 categories, then "More" link -->
<ul class="category-nav">
    <isloop items="${pdict.categories}" var="category" status="catStatus">
        <li>
            <a href="${URLUtils.url('Search-Show', 'cgid', category.ID)}">
                ${category.displayName}
            </a>
        </li>
        
        <isif condition="${catStatus.count >= 8}">
            <li class="more-categories">
                <a href="${URLUtils.url('Category-ShowAll')}">More Categories...</a>
            </li>
            <isbreak/>
        </isif>
    </isloop>
</ul>
```

### Search and Stop

```isml
<!-- Find specific item and exit -->
<isset name="targetFound" value="${false}" scope="page" />

<isloop items="${pdict.products}" var="product">
    <isif condition="${product.ID == pdict.searchPID}">
        <div class="found-product">
            <h3>Found: ${product.name}</h3>
            <p>Price: ${product.price}</p>
        </div>
        <isset name="targetFound" value="${true}" scope="page" />
        <isbreak/>
    </isif>
</isloop>

<isif condition="${!targetFound}">
    <p>Product not found in current results</p>
</isif>
```

## Nested Loops

### Inner Loop Break Only

```isml
<!-- isbreak only terminates the inner loop -->
<isloop items="${pdict.categories}" var="category" status="outerLoop">
    <h3>${category.displayName}</h3>
    <ul>
        <isloop items="${category.products}" var="product" status="innerLoop">
            <li>${product.name}</li>
            
            <!-- This breaks only the inner loop (products) -->
            <isif condition="${innerLoop.count >= 5}">
                <isbreak/>
            </isif>
        </isloop>
    </ul>
    <!-- Outer loop continues here -->
</isloop>
```

### Breaking Both Inner and Outer Loops

```isml
<!-- Use a flag to break outer loop -->
<isset name="shouldBreak" value="${false}" scope="page" />

<isloop items="${pdict.categories}" var="category" status="outerLoop">
    <h3>${category.displayName}</h3>
    
    <isloop items="${category.products}" var="product" status="innerLoop">
        <isif condition="${product.specialCondition}">
            <isset name="shouldBreak" value="${true}" scope="page" />
            <isbreak/>
        </isif>
        
        <div>${product.name}</div>
    </isloop>
    
    <!-- Check flag and break outer loop -->
    <isif condition="${shouldBreak}">
        <isbreak/>
    </isif>
</isloop>
```

### Multiple Nested Levels

```isml
<!-- Three levels of nesting -->
<isloop items="${pdict.departments}" var="dept">
    <h2>${dept.name}</h2>
    
    <isloop items="${dept.categories}" var="category" status="catLoop">
        <h3>${category.name}</h3>
        
        <isloop items="${category.products}" var="product" status="prodLoop">
            <p>${product.name}</p>
            
            <!-- Breaks only the product loop -->
            <isif condition="${prodLoop.count >= 3}">
                <isbreak/>
            </isif>
        </isloop>
        
        <!-- Breaks only the category loop -->
        <isif condition="${catLoop.count >= 5}">
            <isbreak/>
        </isif>
    </isloop>
</isloop>
```

## Best Practices

1. **Always Use with Conditions:**
   ```isml
   <!-- Good: Conditional break -->
   <isloop items="${products}" var="product" status="loop">
       <isif condition="${loop.count >= 10}">
           <isbreak/>
       </isif>
       ${product.name}
   </isloop>
   
   <!-- Bad: Unconditional break (pointless) -->
   <isloop items="${products}" var="product">
       ${product.name}
       <isbreak/>  <!-- Will always break after first item -->
   </isloop>
   ```

2. **Use Loop Status for Counting:**
   ```isml
   <!-- Good: Use status.count -->
   <isloop items="${products}" var="product" status="status">
       <isif condition="${status.count >= 5}">
           <isbreak/>
       </isif>
       ${product.name}
   </isloop>
   
   <!-- Avoid: Manual counter (unnecessary) -->
   <isset name="counter" value="${0}" scope="page" />
   <isloop items="${products}" var="product">
       <isset name="counter" value="${counter + 1}" scope="page" />
       <isif condition="${counter >= 5}">
           <isbreak/>
       </isif>
       ${product.name}
   </isloop>
   ```

3. **Consider Using begin/end Instead:**
   ```isml
   <!-- Using isbreak -->
   <isloop items="${products}" var="product" status="loop">
       <div>${product.name}</div>
       <isif condition="${loop.count >= 5}">
           <isbreak/>
       </isif>
   </isloop>
   
   <!-- Better: Use end attribute -->
   <isloop items="${products}" var="product" end="4">
       <div>${product.name}</div>
   </isloop>
   ```

4. **Provide User Feedback:**
   ```isml
   <!-- Good: Show there are more items -->
   <isloop items="${products}" var="product" status="loop">
       <div>${product.name}</div>
       <isif condition="${loop.count >= 10}">
           <div class="more-items-indicator">
               <a href="${URLUtils.url('Product-ShowAll')}">
                   View All ${products.length} Products
               </a>
           </div>
           <isbreak/>
       </isif>
   </isloop>
   ```

5. **Use Meaningful Conditions:**
   ```isml
   <!-- Good: Clear intent -->
   <isloop items="${products}" var="product" status="loop">
       <isif condition="${loop.count >= pdict.maxDisplayItems}">
           <isbreak/>
       </isif>
       ${product.name}
   </isloop>
   
   <!-- Less clear: Magic number -->
   <isloop items="${products}" var="product" status="loop">
       <isif condition="${loop.count >= 7}">
           <isbreak/>
       </isif>
       ${product.name}
   </isloop>
   ```

6. **Document Complex Break Logic:**
   ```isml
   <!-- Break early for performance on large datasets -->
   <isloop items="${pdict.searchResults}" var="result" status="status">
       <div class="result">${result.name}</div>
       
       <!-- Limit to 20 results to maintain page performance -->
       <isif condition="${status.count >= 20}">
           <div class="pagination-link">
               <a href="${URLUtils.url('Search-Show', 'start', 20)}">Next Page</a>
           </div>
           <isbreak/>
       </isif>
   </isloop>
   ```

7. **Handle Edge Cases:**
   ```isml
   <!-- Check if collection exists and has items -->
   <isif condition="${pdict.products && pdict.products.length > 0}">
       <isloop items="${pdict.products}" var="product" status="loop">
           <div>${product.name}</div>
           
           <isif condition="${loop.count >= 5}">
               <isbreak/>
           </isif>
       </isloop>
   <iselse>
       <p>No products available</p>
   </isif>
   ```

## Performance Considerations

### When to Use isbreak for Performance

```isml
<!-- Good: Large collection, need only first few items -->
<isloop items="${pdict.allProducts}" var="product" status="loop">
    <div>${product.name}</div>
    
    <!-- Stop after 10 to avoid processing thousands of items -->
    <isif condition="${loop.count >= 10}">
        <isbreak/>
    </isif>
</isloop>
```

### When begin/end is Better

```isml
<!-- Better: Use begin/end for simple range -->
<isloop items="${pdict.products}" var="product" begin="0" end="9">
    <div>${product.name}</div>
</isloop>

<!-- Instead of: -->
<isloop items="${pdict.products}" var="product" status="loop">
    <div>${product.name}</div>
    <isif condition="${loop.count >= 10}">
        <isbreak/>
    </isif>
</isloop>
```

### Avoid Unnecessary Processing

```isml
<!-- Good: Break immediately when found -->
<isloop items="${products}" var="product">
    <isif condition="${product.ID == targetID}">
        <isset name="foundProduct" value="${product}" scope="page" />
        <isbreak/>
    </isif>
</isloop>

<!-- Bad: Process all items even after finding target -->
<isloop items="${products}" var="product">
    <isif condition="${product.ID == targetID}">
        <isset name="foundProduct" value="${product}" scope="page" />
    </isif>
</isloop>
```

## Common Patterns

### Pagination Preview

```isml
<!-- Show first page of results with "More" link -->
<div class="search-results">
    <isloop items="${pdict.searchResults}" var="result" status="loop">
        <div class="result-item">
            <h4>${result.name}</h4>
            <p>${result.description}</p>
        </div>
        
        <isif condition="${loop.count >= pdict.resultsPerPage}">
            <isif condition="${pdict.searchResults.length > pdict.resultsPerPage}">
                <div class="more-results">
                    <a href="${URLUtils.url('Search-Show', 'showAll', 'true')}">
                        View All ${pdict.searchResults.length} Results
                    </a>
                </div>
            </isif>
            <isbreak/>
        </isif>
    </isloop>
</div>
```

### Featured Items Section

```isml
<!-- Show featured items until section is full -->
<div class="featured-products">
    <h2>Featured Products</h2>
    <div class="product-grid">
        <isloop items="${pdict.products}" var="product" status="loop">
            <isif condition="${product.featured}">
                <div class="featured-product-tile">
                    <img src="${product.imageURL}" alt="${product.name}" />
                    <h3>${product.name}</h3>
                    <span>${product.price}</span>
                </div>
                
                <!-- Stop after 4 featured products -->
                <isif condition="${loop.count >= 4}">
                    <isbreak/>
                </isif>
            </isif>
        </isloop>
    </div>
</div>
```

### Carousel with Limit

```isml
<!-- Carousel showing limited items -->
<div class="product-carousel">
    <isloop items="${pdict.recommendedProducts}" var="product" status="carouselLoop">
        <div class="carousel-item">
            <a href="${URLUtils.url('Product-Show', 'pid', product.ID)}">
                <img src="${product.images.small[0].url}" alt="${product.name}" />
                <p>${product.name}</p>
            </a>
        </div>
        
        <!-- Carousel shows max 6 items -->
        <isif condition="${carouselLoop.count >= 6}">
            <isbreak/>
        </isif>
    </isloop>
</div>
```

### Conditional Data Processing

```isml
<!-- Process until specific condition met -->
<isset name="totalPrice" value="${0}" scope="page" />
<isset name="budgetExceeded" value="${false}" scope="page" />

<isloop items="${pdict.cart.items}" var="item" status="itemLoop">
    <isset name="totalPrice" value="${totalPrice + item.price}" scope="page" />
    
    <div class="cart-item">
        <span>${item.name}</span>
        <span>${item.price}</span>
    </div>
    
    <!-- Stop if budget limit reached -->
    <isif condition="${totalPrice > pdict.budgetLimit}">
        <div class="budget-warning">Budget limit reached</div>
        <isset name="budgetExceeded" value="${true}" scope="page" />
        <isbreak/>
    </isif>
</isloop>
```

## Comparison with Alternatives

### isbreak vs end attribute

```isml
<!-- Using isbreak (dynamic condition) -->
<isloop items="${products}" var="product" status="loop">
    <div>${product.name}</div>
    <isif condition="${product.price > 1000}">
        <isbreak/>  <!-- Stop at first expensive item -->
    </isif>
</isloop>

<!-- Using end attribute (fixed range) -->
<isloop items="${products}" var="product" end="9">
    <div>${product.name}</div>  <!-- Always shows first 10 -->
</isloop>
```

**Use `<isbreak>` when:**
- Breaking condition is dynamic
- Exit depends on item properties
- Condition is complex

**Use `end` attribute when:**
- Fixed number of items needed
- Simpler and more readable
- No conditional logic required

### isbreak vs isnext

```isml
<!-- isbreak: Exit loop completely -->
<isloop items="${products}" var="product" status="loop">
    <div>${product.name}</div>
    <isif condition="${loop.count >= 5}">
        <isbreak/>  <!-- Stop loop entirely -->
    </isif>
</isloop>

<!-- isnext: Skip current iteration, continue loop -->
<isloop items="${products}" var="product">
    <isif condition="${!product.available}">
        <isnext/>  <!-- Skip unavailable, continue with next -->
    </isif>
    <div>${product.name}</div>
</isloop>
```

**Use `<isbreak>` to:**
- Exit loop completely
- Stop all further processing

**Use `<isnext>` to:**
- Skip current item
- Continue with remaining items

## Debugging and Testing

### Add Debug Output

```isml
<!-- Debug: Show when break occurs -->
<isloop items="${products}" var="product" status="loop">
    <div>${product.name}</div>
    
    <isif condition="${loop.count >= 10}">
        <!-- Debug output (remove in production) -->
        <iscomment>
            Breaking loop at count: ${loop.count}
            Total items: ${products.length}
        </iscomment>
        <isbreak/>
    </isif>
</isloop>
```

### Validate Break Conditions

```isml
<!-- Ensure break condition is valid -->
<isif condition="${pdict.maxItems && pdict.maxItems > 0}">
    <isloop items="${products}" var="product" status="loop">
        <div>${product.name}</div>
        
        <isif condition="${loop.count >= pdict.maxItems}">
            <isbreak/>
        </isif>
    </isloop>
<iselse>
    <!-- Fallback: show all items -->
    <isloop items="${products}" var="product">
        <div>${product.name}</div>
    </isloop>
</isif>
```

## Related Elements

- `<isloop>` - Creates the loop that `<isbreak>` terminates
- `<isnext>` - Skips to next iteration instead of breaking
- `<isif>` - Provides conditional logic for break decisions
- `<isset>` - Sets flags for break conditions

## Notes

- `<isbreak>` is a self-closing tag with no attributes
- Must be used within an `<isloop>` element
- In nested loops, only breaks the innermost loop
- Always used with `<isif>` for conditional breaking
- Has no visible output; only affects loop control
- Consider using `end` attribute for simple fixed ranges
- Use `<isnext>` to skip items instead of breaking
- Performance benefit when processing large collections
- Useful for "show first N items" patterns

## Error Prevention

### Check Loop Context

```isml
<!-- Bad: isbreak outside of loop (error) -->
<div>Some content</div>
<isbreak/>  <!-- ERROR: Not in a loop -->

<!-- Good: isbreak inside loop -->
<isloop items="${products}" var="product">
    <div>${product.name}</div>
    <isif condition="${condition}">
        <isbreak/>
    </isif>
</isloop>
```

### Validate Conditions

```isml
<!-- Bad: Condition might be undefined -->
<isloop items="${products}" var="product" status="loop">
    <isif condition="${loop.count >= maxItems}">
        <isbreak/>
    </isif>
    <div>${product.name}</div>
</isloop>

<!-- Good: Validate condition exists -->
<isloop items="${products}" var="product" status="loop">
    <isif condition="${!empty(maxItems) && loop.count >= maxItems}">
        <isbreak/>
    </isif>
    <div>${product.name}</div>
</isloop>
```

## Migration Notes

### SiteGenesis to SFRA

```isml
<!-- SiteGenesis -->
<isloop iterator="${pdict.Basket.products}" alias="product" status="status">
    <isif condition="${status.count >= 3}">
        <isbreak/>
    </isif>
    ${product.name}
</isloop>

<!-- SFRA (same syntax, updated attributes) -->
<isloop items="${pdict.cart.items}" var="item" status="status">
    <isif condition="${status.count >= 3}">
        <isbreak/>
    </isif>
    ${item.productName}
</isloop>
```

The `<isbreak>` syntax remains the same; only loop attributes and data structure change.