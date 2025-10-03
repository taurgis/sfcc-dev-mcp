# ISML isactivedatacontext Element

## Overview

The `<isactivedatacontext>` element collects category context from a page for active data tracking and analytics. It specifies the deepest (most specific) category being browsed on the current page, enabling accurate category attribution for customer behavior tracking, personalization, and Einstein recommendations.

## Syntax

```isml
<isactivedatacontext
  category = current_category  // required
/>
```

## Required Attributes

### category

**Type:** Expression  
**Required:** Yes

Specifies the current category of the page being viewed by the customer. This should be an expression that retrieves the current category from the pipeline dictionary or a category object.

**Examples:**
```isml
<isactivedatacontext category="${pdict.ProductSearchResult.category}" />
<isactivedatacontext category="${pdict.Product.primaryCategory}" />
<isactivedatacontext category="${pdict.CurrentCategory}" />
```

## Purpose

The `<isactivedatacontext>` element serves several critical functions:

1. **Category Attribution:** Associates the page view with a specific category for analytics and tracking
2. **Einstein AI Context:** Provides category context for Einstein recommendations and personalization
3. **Active Data Collection:** Enables proper data collection for Commerce Cloud analytics
4. **Navigation Tracking:** Records the customer's browsing path through the category hierarchy

### Precedence Rules

If the tag appears multiple times on the same page (due to includes or other reasons), the **latest tag** in the HTML output takes precedence. This means:

- The last `<isactivedatacontext>` tag rendered determines the final category context
- If one tag indicates "electronics" and a later tag indicates "video", "video" takes precedence
- Multiple tags with the same category value are redundant but cause no negative effect
- If no tag appears on a page, no category context is associated with that page

## Placement Guidelines

### Valid Placement

The `<isactivedatacontext>` tag **must** be placed where `<script>` tags are valid:

- Within the `<head>` section
- Within the `<body>` section
- Anywhere between the opening `<html>` and closing `</html>` tags where scripts are allowed

### Best Practices for Placement

1. **Single Template Usage:** Include this tag in exactly one template per HTML page
2. **Strategic Positioning:** Place it in the main category or product template
3. **Early Placement:** Position it early in the page to ensure context is set before other analytics code runs
4. **Avoid Redundancy:** Don't include the same tag in multiple templates unless necessary

**Recommended Template Locations:**
```isml
<!-- In category landing pages -->
<isactivedatacontext category="${pdict.ProductSearchResult.category}" />

<!-- In product detail pages -->
<isactivedatacontext category="${pdict.Product.primaryCategory}" />

<!-- In search results pages -->
<isactivedatacontext category="${pdict.ProductSearchResult.category}" />
```

## Common Use Cases

### Product Search Results Page

```isml
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<!DOCTYPE html>
<html>
<head>
    <title>${pdict.ProductSearchResult.category.displayName}</title>
    <isactivedatacontext category="${pdict.ProductSearchResult.category}" />
</head>
<body>
    <!-- Page content -->
</body>
</html>
```

### Product Detail Page

```isml
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<!DOCTYPE html>
<html>
<head>
    <title>${pdict.Product.name}</title>
    <isactivedatacontext category="${pdict.Product.primaryCategory}" />
</head>
<body>
    <!-- Product details -->
</body>
</html>
```

### Category Landing Page

```isml
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<isinclude template="util/modules" />

<isset name="DecoratorTemplate" value="common/layout/page" scope="page" />

<isactivedatacontext category="${pdict.CurrentCategory}" />

<div class="category-landing">
    <h1>${pdict.CurrentCategory.displayName}</h1>
    <!-- Category content -->
</div>
```

### Conditional Category Context

```isml
<!-- Only set category context if a category exists -->
<isif condition="${pdict.ProductSearchResult && pdict.ProductSearchResult.category}">
    <isactivedatacontext category="${pdict.ProductSearchResult.category}" />
</isif>
```

### Search Results with Refinement Category

```isml
<!-- Use the refined category if available, otherwise use the search category -->
<isset name="activeCategory" value="${pdict.ProductSearchResult.categoryID ? pdict.ProductSearchResult.category : pdict.CurrentCategory}" scope="page" />

<isif condition="${activeCategory}">
    <isactivedatacontext category="${activeCategory}" />
</isif>
```

## Best Practices

1. **Use the Most Specific Category:** Always provide the deepest category in the hierarchy, not a parent category:
   ```isml
   <!-- Good: Specific category -->
   <isactivedatacontext category="${product.primaryCategory}" />
   
   <!-- Avoid: Parent category when a more specific one is available -->
   <isactivedatacontext category="${product.primaryCategory.parent}" />
   ```

2. **One Tag Per Page:** Include the tag in exactly one template to avoid conflicts and redundancy:
   ```isml
   <!-- Include in main template only -->
   <!-- decorator/page.isml -->
   <isif condition="${pdict.category}">
       <isactivedatacontext category="${pdict.category}" />
   </isif>
   ```

3. **Validate Category Existence:** Always check if the category exists before using it:
   ```isml
   <isif condition="${pdict.Product && pdict.Product.primaryCategory}">
       <isactivedatacontext category="${pdict.Product.primaryCategory}" />
   </isif>
   ```

4. **Place in Head Section:** For optimal tracking, place the tag in the `<head>` section:
   ```isml
   <head>
       <title>${pdict.pageTitle}</title>
       <isactivedatacontext category="${pdict.category}" />
       <!-- Other head elements -->
   </head>
   ```

5. **Use Primary Category for Products:** For product pages, use the primary category, not all assigned categories:
   ```isml
   <!-- Correct: Primary category -->
   <isactivedatacontext category="${pdict.Product.primaryCategory}" />
   
   <!-- Incorrect: Don't loop through all categories -->
   <isloop items="${pdict.Product.categories}" var="category">
       <isactivedatacontext category="${category}" />
   </isloop>
   ```

6. **Document Template Ownership:** Clearly document which template owns the category context:
   ```isml
   <!-- searchresults.isml - Owns category context for search pages -->
   <isactivedatacontext category="${pdict.ProductSearchResult.category}" />
   ```

7. **Consistent Usage Across Page Types:** Ensure all page types that should have category context include the tag:
   - Category landing pages
   - Product detail pages
   - Search results pages
   - Product listing pages

## Integration Patterns

### SFRA Controller Pattern

```javascript
// Controller: Product-Show
server.get('Show', function (req, res, next) {
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var product = ProductFactory.get(req.querystring.pid);
    
    res.render('product/productDetails', {
        product: product,
        category: product.primaryCategory // Pass category to template
    });
    
    next();
});
```

```isml
<!-- Template: product/productDetails.isml -->
<isactivedatacontext category="${pdict.category}" />
```

### Template Decorator Pattern

```isml
<!-- common/layout/page.isml - Main decorator -->
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<!DOCTYPE html>
<html>
<head>
    <isif condition="${pdict.category}">
        <isactivedatacontext category="${pdict.category}" />
    </isif>
    
    <!-- Other head elements -->
</head>
<body>
    <isreplace/>
</body>
</html>
```

### Multi-Template Precedence Example

```isml
<!-- Template 1: category/header.isml (included first) -->
<isactivedatacontext category="${pdict.ParentCategory}" />

<!-- Template 2: category/main.isml (included second) -->
<isactivedatacontext category="${pdict.CurrentCategory}" />

<!-- Result: pdict.CurrentCategory takes precedence (it's later in HTML) -->
```

## Common Pitfalls

1. **Missing Null Checks:**
   ```isml
   <!-- Bad: No null check -->
   <isactivedatacontext category="${pdict.category}" />
   
   <!-- Good: Null check included -->
   <isif condition="${pdict.category}">
       <isactivedatacontext category="${pdict.category}" />
   </isif>
   ```

2. **Multiple Tags with Different Categories:**
   ```isml
   <!-- Bad: Conflicting categories in same page -->
   <isactivedatacontext category="${pdict.ParentCategory}" />
   <!-- ... later in includes ... -->
   <isactivedatacontext category="${pdict.ChildCategory}" />
   
   <!-- Good: Single, most specific category -->
   <isactivedatacontext category="${pdict.ChildCategory}" />
   ```

3. **Placing Outside Valid Scope:**
   ```isml
   <!-- Bad: Outside head/body -->
   <isactivedatacontext category="${pdict.category}" />
   <!DOCTYPE html>
   <html>
   
   <!-- Good: Inside head or body -->
   <!DOCTYPE html>
   <html>
   <head>
       <isactivedatacontext category="${pdict.category}" />
   </head>
   ```

4. **Using Wrong Category Object:**
   ```isml
   <!-- Bad: Using category ID instead of category object -->
   <isactivedatacontext category="${pdict.cgid}" />
   
   <!-- Good: Using actual category object -->
   <isactivedatacontext category="${pdict.ProductSearchResult.category}" />
   ```

## Analytics and Tracking Impact

The `<isactivedatacontext>` element impacts several Commerce Cloud features:

1. **Einstein Recommendations:** Provides category context for product recommendations
2. **Category Affinity:** Tracks customer interest in specific categories
3. **Active Data:** Feeds the active data system for real-time personalization
4. **Analytics Reports:** Enables category-level reporting in analytics dashboards
5. **A/B Testing:** Supports category-based test segmentation

## Performance Considerations

- **Minimal Overhead:** The tag has negligible performance impact
- **Client-Side Processing:** Category context is processed client-side for analytics
- **No Server Calls:** Does not trigger additional server requests
- **Caching Safe:** Safe to include in cached pages

## Debugging

### Verify Category Context

To verify the category context is being set correctly:

1. **View Page Source:** Check the HTML source for the tag
2. **Browser Console:** Look for active data initialization messages
3. **Network Tab:** Monitor analytics beacons for category data
4. **Einstein Activity:** Verify recommendations reflect the correct category

### Common Debugging Scenarios

```isml
<!-- Add debug output during development -->
<isif condition="${pdict.category}">
    <isactivedatacontext category="${pdict.category}" />
    <!-- Debug: Category set to ${pdict.category.ID} - ${pdict.category.displayName} -->
<iselse>
    <!-- Debug: No category context available -->
</isif>
```

## Related Elements

- `<isactivedatahead>` - Includes active data tracking scripts in the page head
- `<isslot>` - Content slots that may use category context for targeting
- `<isanalytics>` - General analytics tracking elements

## Notes

- The category object must be a valid SFCC Category object, not just a category ID
- Only one category context is active per page (the last one wins)
- The tag is required for proper Einstein AI functionality on category and product pages
- Missing category context on applicable pages may result in less accurate recommendations
- This tag does not display any visible content; it's purely for data collection

## Migration Notes

### SiteGenesis to SFRA

When migrating from SiteGenesis to SFRA, ensure:

1. The tag is moved to appropriate SFRA templates
2. Pipeline dictionary references are updated to SFRA model structures
3. The tag is placed in decorator templates for consistent coverage
4. All product and category pages include the context

```isml
<!-- SiteGenesis -->
<isactivedatacontext category="${pdict.ProductSearchResult.category}" />

<!-- SFRA (same syntax, different template location) -->
<isactivedatacontext category="${pdict.category}" />
```