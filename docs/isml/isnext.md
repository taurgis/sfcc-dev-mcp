# ISML isnext Element

## Overview

The `<isnext>` element jumps forward within a loop to the next element of an iterator. Unlike `<iscontinue>`, which breaks out of the current iteration and returns to the top of the loop, `<isnext>` advances the iterator forward one position and continues processing the next line of code.

**Critical Difference:** `<isnext>` moves the iterator forward but continues executing subsequent code, while `<iscontinue>` skips all remaining code in the current iteration.

## Syntax

```isml
<isnext/>
```

## Attributes

This element has no attributes.

## Purpose

The `<isnext>` element enables:

1. **Iterator Advancement:** Move to the next list element within a loop
2. **Multi-Element Processing:** Process multiple elements in a single iteration
3. **Skip and Continue:** Advance iterator and continue with subsequent code
4. **Flexible Iteration:** Create custom iteration patterns beyond standard loop behavior
5. **Paired Output:** Output elements in pairs or groups

## How isnext Works

### Behavior

- **Advances Iterator:** Moves the iterator forward to the next element
- **Continues Processing:** Execution continues with the next line of code (does NOT jump back to loop start)
- **Inner Loop Only:** Only affects the iterator of the innermost loop
- **Termination:** If iterator reaches its last element or is empty, the loop terminates instantly

### Key Difference from iscontinue

| Element | Iterator Movement | Code Execution |
|---------|------------------|----------------|
| `<isnext>` | Moves forward one position | Continues with next line of code |
| `<iscontinue>` | Moves forward one position | Jumps back to top of loop (skips remaining code) |

## Rules of Use

### Loop Requirement

⚠️ **CRITICAL:** `<isnext/>` can **only be used within** an `<isloop>...</isloop>` loop structure.

```isml
<!-- Good: Inside a loop -->
<isloop items="${products}" var="product">
  <isprint value="${product.name}"/>
  <isnext/>
  <isprint value="${product.name}"/>
</isloop>

<!-- Bad: Outside a loop -->
<isif condition="${someCondition}">
  <isnext/>  <!-- ERROR: Not in a loop -->
</isif>
```

### Inner Loop Only

In nested loops, `<isnext/>` only affects the **innermost loop**:

```isml
<isloop items="${categories}" var="category">
  <h2>${category.name}</h2>
  
  <isloop items="${category.products}" var="product">
    <isprint value="${product.name}"/>
    <isnext/>  <!-- Only affects product loop, not category loop -->
    <isprint value="${product.name}"/>
  </isloop>
</isloop>
```

### Automatic Loop Termination

If the iterator has reached its last element or is empty when `<isnext/>` is processed, **the loop terminates instantly**:

```isml
<isloop items="${products}" var="product">
  <isprint value="${product.name}"/>
  <isnext/>  <!-- If product is last item, loop terminates here -->
  <isprint value="${product.name}"/>  <!-- This won't execute for last item -->
</isloop>
```

## Common Use Cases

### Paired Output (Official Example)

Output two products per iteration:

```isml
<isloop items="${pdict.Products}" var="product">
  <isprint value="${product.name}"/>
  <isnext/>
  <isprint value="${product.name}"/> <br/>
</isloop>
```

**How it works:**
1. First iteration: Prints product[0], advances to product[1], prints product[1]
2. Second iteration: Prints product[2], advances to product[3], prints product[3]
3. Continues pairing elements until end of list

**Output example:**
```
Product A Product B
Product C Product D
Product E Product F
```

### Two-Column Layout

Create a two-column product grid:

```isml
<div class="product-grid">
  <isloop items="${pdict.products}" var="product">
    <div class="product-row">
      <div class="product-column">
        <h3>${product.name}</h3>
        <img src="${product.images.small[0].url}" alt="${product.name}"/>
      </div>
      
      <isnext/>
      
      <div class="product-column">
        <h3>${product.name}</h3>
        <img src="${product.images.small[0].url}" alt="${product.name}"/>
      </div>
    </div>
  </isloop>
</div>
```

**Result:** Products displayed in pairs, two per row.

### Comparison Display

Display products side-by-side for comparison:

```isml
<div class="comparison-table">
  <isloop items="${pdict.compareProducts}" var="product">
    <div class="comparison-item">
      <h3>${product.name}</h3>
      <div class="price">${product.price}</div>
      <div class="rating">${product.rating}</div>
    </div>
    
    <isnext/>
    
    <div class="comparison-item">
      <h3>${product.name}</h3>
      <div class="price">${product.price}</div>
      <div class="rating">${product.rating}</div>
    </div>
  </isloop>
</div>
```

### Before/After Pairs

Display before and after images or states:

```isml
<div class="before-after-gallery">
  <isloop items="${pdict.images}" var="image">
    <div class="comparison-set">
      <div class="before">
        <h4>Before</h4>
        <img src="${image.url}" alt="Before"/>
      </div>
      
      <isnext/>
      
      <div class="after">
        <h4>After</h4>
        <img src="${image.url}" alt="After"/>
      </div>
    </div>
  </isloop>
</div>
```

### Skip Specific Elements

Skip certain elements and continue processing:

```isml
<isloop items="${pdict.products}" var="product">
  <isif condition="${product.custom.hideFromList}">
    <isnext/>  <!-- Skip this product and move to next -->
  </isif>
  
  <div class="product-tile">
    ${product.name}
  </div>
</isloop>
```

**Note:** For this use case, `<iscontinue/>` would be more appropriate as it's clearer in intent.

### Grouped Output

Output products in groups of three:

```isml
<isloop items="${pdict.products}" var="product">
  <div class="product-group">
    <div class="product-1">${product.name}</div>
    
    <isnext/>
    <div class="product-2">${product.name}</div>
    
    <isnext/>
    <div class="product-3">${product.name}</div>
  </div>
</isloop>
```

**Output:** Products grouped in sets of three per container.

### Q&A Pairs

Display question and answer pairs:

```isml
<div class="faq-list">
  <isloop items="${pdict.faqItems}" var="item">
    <div class="faq-item">
      <div class="question">
        <strong>Q:</strong> ${item.text}
      </div>
      
      <isnext/>
      
      <div class="answer">
        <strong>A:</strong> ${item.text}
      </div>
    </div>
  </isloop>
</div>
```

### Dual Language Display

Show content in two languages side-by-side:

```isml
<div class="bilingual-content">
  <isloop items="${pdict.contentBlocks}" var="block">
    <div class="content-pair">
      <div class="language-primary">
        <h3>${block.title}</h3>
        <p>${block.body}</p>
      </div>
      
      <isnext/>
      
      <div class="language-secondary">
        <h3>${block.title}</h3>
        <p>${block.body}</p>
      </div>
    </div>
  </isloop>
</div>
```

## Difference from iscontinue

### Visual Comparison

```isml
<!-- Using isnext: Advances and continues processing -->
<isloop items="${products}" var="product">
  <isprint value="${product.name}"/>
  
  <isif condition="${product.price > 100}">
    <isnext/>  <!-- Moves to next product, continues below -->
  </isif>
  
  <!-- This code WILL execute after isnext -->
  <div class="product-footer">Processed</div>
</isloop>

<!-- Using iscontinue: Advances and jumps to loop start -->
<isloop items="${products}" var="product">
  <isprint value="${product.name}"/>
  
  <isif condition="${product.price > 100}">
    <iscontinue/>  <!-- Moves to next product, jumps to loop start -->
  </isif>
  
  <!-- This code WILL NOT execute after iscontinue -->
  <div class="product-footer">Processed</div>
</isloop>
```

### Execution Flow Diagram

**isnext flow:**
```
Loop Start
  ↓
Code before isnext
  ↓
<isnext/> (iterator advances)
  ↓
Code after isnext (EXECUTES)
  ↓
Loop End → Back to Loop Start
```

**iscontinue flow:**
```
Loop Start
  ↓
Code before iscontinue
  ↓
<iscontinue/> (iterator advances)
  ↓
Back to Loop Start (code after iscontinue SKIPPED)
```

### When to Use Which

**Use `<isnext/>`:**
- Process multiple elements in single iteration
- Create paired/grouped outputs
- Advance iterator but continue processing subsequent code
- Build custom iteration patterns

**Use `<iscontinue/>`:**
- Skip current item and jump to next iteration
- Filter items from loop output
- Early exit from current iteration
- Standard skip/filter behavior

```isml
<!-- isnext: Process two products together -->
<isloop items="${products}" var="product">
  <div class="pair">
    <div>${product.name}</div>
    <isnext/>
    <div>${product.name}</div>
  </div>
</isloop>

<!-- iscontinue: Skip unavailable products -->
<isloop items="${products}" var="product">
  <isif condition="${!product.available}">
    <iscontinue/>
  </isif>
  <div>${product.name}</div>
</isloop>
```

## Edge Cases and Gotchas

### Last Element Behavior

When `<isnext/>` is called on the last element, the loop terminates immediately:

```isml
<isloop items="${products}" var="product">
  <div>Product: ${product.name}</div>
  <isnext/>
  <div>Next: ${product.name}</div>  <!-- Not executed if first product was last -->
</isloop>
```

**With 3 products:**
1. Iteration 1: Shows product[0], advances, shows product[1]
2. Iteration 2: Shows product[2], advances → **loop terminates** (no product[3])

**Result:** Product[2] appears only once (not paired).

### Empty Iterator

If the iterator is empty when `<isnext/>` is processed, loop terminates:

```isml
<isloop items="${emptyArray}" var="item">
  <div>This won't display</div>
  <isnext/>  <!-- Loop terminates immediately -->
  <div>Neither will this</div>
</isloop>
```

### Nested Loops

`<isnext/>` only affects the innermost loop:

```isml
<isloop items="${categories}" var="category">
  <h2>${category.name}</h2>
  
  <isloop items="${category.products}" var="product">
    <div>${product.name}</div>
    <isnext/>  <!-- Advances product iterator only -->
    <div>${product.name}</div>
  </isloop>
  
  <!-- category iterator not affected -->
</isloop>
```

### Odd Number of Elements

With paired output, odd-numbered lists will have unpaired last element:

```isml
<!-- 5 products: A, B, C, D, E -->
<isloop items="${products}" var="product">
  <div class="pair">
    <span>${product.name}</span>
    <isnext/>
    <span>${product.name}</span>
  </div>
</isloop>

<!-- Output:
  Pair 1: A B
  Pair 2: C D
  Pair 3: E (alone, loop terminates after isnext)
-->
```

**Solution:** Handle odd case explicitly:

```isml
<isloop items="${products}" var="product" status="loopStatus">
  <div class="pair">
    <span>${product.name}</span>
    
    <isif condition="${!loopStatus.last}">
      <isnext/>
      <span>${product.name}</span>
    </isif>
  </div>
</isloop>
```

## Best Practices

### Document Non-Standard Iteration

```isml
<iscomment>
  This loop processes products in pairs for side-by-side comparison display.
  Uses isnext to advance iterator within iteration.
</iscomment>
<isloop items="${products}" var="product">
  <div class="comparison">
    <div class="left">${product.name}</div>
    <isnext/>
    <div class="right">${product.name}</div>
  </div>
</isloop>
```

### Handle Odd-Numbered Collections

```isml
<isloop items="${products}" var="product" status="status">
  <div class="product-pair">
    <div class="product-left">${product.name}</div>
    
    <!-- Check if not last element before isnext -->
    <isif condition="${!status.last}">
      <isnext/>
      <div class="product-right">${product.name}</div>
    <iselse>
      <div class="product-right empty"><!-- Placeholder --></div>
    </isif>
  </div>
</isloop>
```

### Use Status Object for Safe Iteration

```isml
<isloop items="${products}" var="product" status="loopStatus">
  <div class="item">${product.name}</div>
  
  <!-- Safe: Check if there's a next element -->
  <isif condition="${loopStatus.index + 1 < loopStatus.count}">
    <isnext/>
    <div class="item">${product.name}</div>
  </isif>
</isloop>
```

### Prefer iscontinue for Simple Filtering

```isml
<!-- Less clear: Using isnext to skip -->
<isloop items="${products}" var="product">
  <isif condition="${!product.available}">
    <isnext/>
    <!-- What happens here? -->
  </isif>
  <div>${product.name}</div>
</isloop>

<!-- Better: Using iscontinue for filtering -->
<isloop items="${products}" var="product">
  <isif condition="${!product.available}">
    <iscontinue/>
  </isif>
  <div>${product.name}</div>
</isloop>
```

### Avoid Complex Logic with isnext

```isml
<!-- Avoid: Complex logic makes behavior unclear -->
<isloop items="${items}" var="item">
  <isif condition="${condition1}">
    <div>Thing 1</div>
    <isnext/>
    <isif condition="${condition2}">
      <div>Thing 2</div>
      <isnext/>
      <div>Thing 3</div>
    </isif>
  </isif>
</isloop>

<!-- Better: Simplify or restructure -->
<isloop items="${items}" var="item" begin="0" step="2">
  <div>${item.name}</div>
  <div>${items[loopStatus.index + 1].name}</div>
</isloop>
```

## Performance Considerations

### Iterator Access

`<isnext/>` advances the iterator in-place, which is efficient:

```isml
<!-- Efficient: isnext advances iterator directly -->
<isloop items="${products}" var="product">
  <div>${product.name}</div>
  <isnext/>
  <div>${product.name}</div>
</isloop>

<!-- Less efficient: Manual index tracking -->
<isloop items="${products}" var="product" status="status">
  <div>${product.name}</div>
  <isif condition="${status.index + 1 < products.length}">
    <div>${products[status.index + 1].name}</div>
  </isif>
</isloop>
```

### Loop Step Alternative

For evenly-spaced iteration, consider using `step` attribute:

```isml
<!-- Using isnext for pairs -->
<isloop items="${products}" var="product">
  <div>${product.name}</div>
  <isnext/>
  <div>${product.name}</div>
</isloop>

<!-- Alternative: Using step (if just iterating pairs) -->
<isloop items="${products}" var="product" step="2">
  <div>${product.name}</div>
  <div>${products[loopStatus.index + 1].name}</div>
</isloop>
```

## Troubleshooting

### Unexpected Loop Termination

**Problem:** Loop terminates before processing all items.

**Solution:** Check if `<isnext/>` is advancing beyond the last element:

```isml
<!-- Problem: Last element causes early termination -->
<isloop items="${products}" var="product">
  <div>${product.name}</div>
  <isnext/>  <!-- Terminates on last element -->
  <div>${product.name}</div>
</isloop>

<!-- Solution: Check for last element -->
<isloop items="${products}" var="product" status="status">
  <div>${product.name}</div>
  <isif condition="${!status.last}">
    <isnext/>
    <div>${product.name}</div>
  </isif>
</isloop>
```

### Code Not Executing After isnext

**Problem:** Expected code after `<isnext/>` doesn't execute.

**Solution:** Remember `<isnext/>` terminates loop if at last element:

```isml
<!-- This code won't execute if isnext reaches end -->
<isloop items="${products}" var="product">
  <isnext/>
  <div>${product.name}</div>  <!-- May not execute -->
</isloop>

<!-- Check iterator position first -->
<isloop items="${products}" var="product" status="status">
  <isif condition="${status.index + 1 < status.count}">
    <isnext/>
    <div>${product.name}</div>
  </isif>
</isloop>
```

### Using Outside Loop

**Problem:** Error when using `<isnext/>` outside loop.

**Solution:** Ensure `<isnext/>` is always inside `<isloop>`:

```isml
<!-- Wrong: Outside loop -->
<isnext/>  <!-- ERROR -->

<!-- Correct: Inside loop -->
<isloop items="${items}" var="item">
  <isnext/>  <!-- OK -->
</isloop>
```

## Related Elements

- **`<isloop>`**: Loop structure that contains `<isnext>`
- **`<iscontinue>`**: Skips to next iteration (different behavior than `<isnext>`)
- **`<isbreak>`**: Exits loop entirely
- **`<isif>`**: Conditional statements often used with `<isnext>`

## Summary

The `<isnext>` element is useful for:

- ✅ Processing multiple elements in single iteration
- ✅ Creating paired or grouped output (two-column layouts, comparisons)
- ✅ Advancing iterator while continuing code execution
- ✅ Building custom iteration patterns
- ✅ Side-by-side displays (before/after, Q&A, bilingual content)
- ✅ Efficient iterator advancement without manual index tracking

**Key Distinction:** `<isnext/>` advances the iterator and **continues processing** subsequent code, unlike `<iscontinue/>` which **jumps back** to the loop start.

Use `<isnext>` when you need to process multiple elements together in a single iteration, but be mindful of loop termination when reaching the last element.
