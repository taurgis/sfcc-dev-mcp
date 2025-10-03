# ISML isslot Element

## Overview

The `<isslot>` element creates placeholders in ISML templates where dynamic content should appear. It enables business users to configure content through Business Manager without requiring code changes. Slots support content assets, products, categories, and custom content, making them essential for merchandising, promotions, and dynamic page composition.

**Key Features:** Business Manager content configuration; multiple context scopes (global, category, folder); Einstein Product Recommendations support; dynamic content rendering; merchandising flexibility.

## Syntax

```isml
<isslot
  id             = id                                   // required
  context        = "global" | "category" | "folder"     // required
  context-object = context-object                       // required for category or folder context
  description    = description                          // required
  preview-url    = url                                  // optional for category or folder context
/>
```

## Required Attributes

### id

**Type:** String (NOT Expression)  
**Required:** Yes  
**Allowed Data Type:** String literals only. Expressions are not allowed.

Identifies the slot in a slot configuration. This ID is used by Business Manager to match slot definitions with slot configurations.

**Naming Best Practices:**
- Use descriptive, meaningful names
- Follow consistent naming conventions
- Include context or location indicators
- Use underscores or hyphens for readability

**Examples:**
```isml
<!-- Homepage banner slot -->
<isslot id="homepage_banner" description="Home banner 705px x 356px." context="global"/>

<!-- Category page featured products -->
<isslot id="category_top_featured" description="Category page top slot." context="category" context-object="${pdict.ProductSearchResult.category}"/>

<!-- Content folder landing banner -->
<isslot id="fldr-landing-slotbanner" description="Large Folder Landing Banner" context="folder" context-object="${pdict.ContentSearchResult.folder}"/>

<!-- Product detail recommendations -->
<isslot id="product_recommendations" description="Recommended products" context="global" context-object="${pdict.Product}"/>
```

### context

**Type:** String  
**Required:** Yes  
**Allowed Values:** `"global"`, `"category"`, `"folder"`

Specifies the scope of the slot, determining where and how the slot can be configured.

**Values:**

#### "global"

Sets the scope to every page on the site. Global slots are available site-wide and are grouped together in Business Manager.

**Use Cases:**
- Homepage banners and hero images
- Site-wide promotional banners
- Global navigation enhancements
- Footer content slots
- Site-wide product recommendations

**Business Manager Display:**
- Slot ID
- Description
- Number of slot configurations created

**Characteristics:**
- Available on any page
- Can accept product, basket, or product collection for Einstein recommendations
- Most flexible scope option

```isml
<!-- Global homepage banner -->
<isslot id="homepage_banner" description="Home banner 705px x 356px." context="global"/>

<!-- Global promotional banner -->
<isslot id="site_promo_banner" description="Site-wide promotional banner" context="global"/>
```

#### "category"

Corresponds to a specific category landing page. Category slots are tied to specific product categories.

**Use Cases:**
- Category-specific featured products
- Category landing page banners
- Category promotional content
- Category-specific merchandising

**Business Manager Display:**
- Category ID (if category's configuration specifies template with `<isslot>` tag)
- Category name
- Rendering template name
- Slot ID
- Description
- Number of slot configurations created

**Characteristics:**
- Requires `context-object` attribute with category object
- Configuration tied to specific categories
- Enables category-specific merchandising

```isml
<!-- Category top featured products -->
<isslot id="category_top_featured" 
        description="Category page top slot." 
        context="category" 
        context-object="${pdict.ProductSearchResult.category}"/>

<!-- Category banner -->
<isslot id="category_banner" 
        description="Category landing banner" 
        context="category" 
        context-object="${pdict.ProductSearchResult.category}"/>
```

#### "folder"

Corresponds to a specific content folder. Folder slots are tied to content folder structures.

**Use Cases:**
- Content folder landing pages
- Folder-specific banners
- Content library organization
- Editorial content sections

**Business Manager Display:**
- Folder ID (if folder's configuration specifies template with `<isslot>` tag)
- Folder name
- Rendering template name
- Slot ID
- Description
- Number of slot configurations created

**Characteristics:**
- Requires `context-object` attribute with folder object
- Configuration tied to specific content folders
- Enables folder-based content organization

```isml
<!-- Folder landing banner -->
<isslot id="fldr-landing-slotbanner" 
        description="Large Folder Landing Banner" 
        context="folder" 
        context-object="${pdict.ContentSearchResult.folder}"/>

<!-- Content folder featured content -->
<isslot id="folder_featured_content" 
        description="Featured content for folder" 
        context="folder" 
        context-object="${pdict.ContentSearchResult.folder}"/>
```

### context-object

**Type:** Expression  
**Required:** Yes (for `category` or `folder` context)  
**Optional:** For `global` context (but required for Einstein recommendations)  
**Allowed Data Type:** Expressions only

An expression that evaluates to the context object for the slot. The required object type depends on the context.

**Supported Object Types by Context:**

| Context | Required Object Type | Description |
|---------|---------------------|-------------|
| `global` | Product, Basket, or Product Collection (up to 5) | For Einstein Product Recommendations |
| `category` | Category object | Single category object |
| `folder` | Folder object | Single content folder object |

**Examples:**

#### Global Context with Product (Einstein Recommendations)

```isml
<!-- Single product for recommendations -->
<isslot id="product_recommendations" 
        description="Recommended products" 
        context="global" 
        context-object="${pdict.Product}"/>

<!-- Product collection (up to 5 products) -->
<isslot id="bundle_recommendations" 
        description="Bundle recommendations" 
        context="global" 
        context-object="${pdict.RecommendedProducts}"/>

<!-- Basket for cart-based recommendations -->
<isslot id="cart_recommendations" 
        description="Cart-based recommendations" 
        context="global" 
        context-object="${pdict.CurrentBasket}"/>
```

#### Category Context

```isml
<!-- Category from search results -->
<isslot id="category_top_featured" 
        description="Category page top slot." 
        context="category" 
        context-object="${pdict.ProductSearchResult.category}"/>

<!-- Category from product -->
<isslot id="category_banner" 
        description="Category banner" 
        context="category" 
        context-object="${pdict.Product.primaryCategory}"/>
```

#### Folder Context

```isml
<!-- Folder from content search -->
<isslot id="fldr-landing-slotbanner" 
        description="Large Folder Landing Banner" 
        context="folder" 
        context-object="${pdict.ContentSearchResult.folder}"/>

<!-- Specific content folder -->
<isslot id="folder_featured" 
        description="Featured folder content" 
        context="folder" 
        context-object="${pdict.CurrentFolder}"/>
```

### description

**Type:** String (NOT Expression)  
**Required:** Yes  
**Allowed Data Type:** String literals only. Expressions are not allowed.

Describes the slot for business users who configure it in Business Manager. This description helps merchandisers understand the slot's purpose and content requirements.

**Best Practices:**
- Be clear and descriptive
- Include content type expectations
- Specify dimensions for image slots
- Indicate placement on page
- Mention any special requirements

**Examples:**
```isml
<!-- Clear description with dimensions -->
<isslot id="homepage_banner" 
        description="Home banner 705px x 356px." 
        context="global"/>

<!-- Description indicating content type -->
<isslot id="category_featured_products" 
        description="Featured products for category page (3-5 products)" 
        context="category" 
        context-object="${pdict.ProductSearchResult.category}"/>

<!-- Description with placement info -->
<isslot id="footer_promo" 
        description="Footer promotional content - appears above footer navigation" 
        context="global"/>

<!-- Description with special requirements -->
<isslot id="mobile_banner" 
        description="Mobile-optimized banner 320px x 180px - mobile devices only" 
        context="global"/>
```

## Optional Attributes

### preview-url

**Type:** String (URL)  
**Optional:** Yes (for `category` or `folder` context)

Identifies the URL used within Business Manager to preview the content slot. If not specified, a default URL is used.

**Use Cases:**
- Custom preview pages
- Specific category or folder pages
- Specialized preview contexts
- Alternative rendering views

**Examples:**
```isml
<!-- Category slot with preview URL -->
<isslot id="category_banner" 
        description="Category landing banner" 
        context="category" 
        context-object="${pdict.ProductSearchResult.category}"
        preview-url="${URLUtils.url('Search-Show', 'cgid', pdict.ProductSearchResult.category.ID)}"/>

<!-- Folder slot with preview URL -->
<isslot id="folder_banner" 
        description="Folder landing banner" 
        context="folder" 
        context-object="${pdict.ContentSearchResult.folder}"
        preview-url="${URLUtils.url('Page-Show', 'cid', pdict.ContentSearchResult.folder.ID)}"/>
```

## Purpose

The `<isslot>` element serves several critical purposes:

1. **Business Manager Integration:** The `id` attribute is used by Business Manager to identify the slot in one or more slot configurations.

2. **Scope Definition:** The `context` attribute specifies the scope of the slot (global, category, or folder).

3. **Context Binding:** The `context-object` attribute is required when the scope is `category` or `folder`, used to look up the slot configuration for the given slot.

4. **Einstein Product Recommendations:** Enables product recommendations based on:
   - A single product
   - A single category
   - A single folder
   - A single basket
   - A collection of up to five products

5. **Business User Guidance:** The `description` attribute helps business users understand the slot's purpose and configuration requirements.

## Business Manager Organization

Slots are grouped in Business Manager by context scope:

### Global Slots

**Displayed Information:**
- Slot ID
- Description
- Number of slot configurations created

### Category Slots

**Displayed Information:**
- Category ID (if category's configuration specifies a template that includes the `<isslot>` tag)
- Category name
- Rendering template name
- Slot ID
- Description
- Number of slot configurations created

### Folder Slots

**Displayed Information:**
- Folder ID (if folder's configuration specifies a template that includes the `<isslot>` tag)
- Folder name
- Rendering template name
- Slot ID
- Description
- Number of slot configurations created

## Behavior When No Configuration Exists

When no slot is defined in the database for a given slot ID:
- The `<isslot>` tag does not render any content
- An entry is written to the log file to identify this occurrence
- The page continues to render without errors

## Common Use Cases

### Global Homepage Banner

```isml
<!-- Simple global banner slot -->
<isslot id="homepage_banner" 
        description="Home banner 705px x 356px." 
        context="global"/>
```

### Category Featured Products

```isml
<!-- Category-specific featured products -->
<isslot id="category_top_featured" 
        context="category" 
        description="Category page top slot."
        context-object="${pdict.ProductSearchResult.category}"/>
```

### Content Folder Landing Banner

```isml
<!-- Folder-specific landing banner -->
<isslot id="fldr-landing-slotbanner" 
        context="folder" 
        description="Large Folder Landing Banner"
        context-object="${pdict.ContentSearchResult.folder}"/>
```

### Product Detail Recommendations

```isml
<!-- Einstein recommendations based on current product -->
<isslot id="product_recommendations" 
        description="Recommended products based on current product" 
        context="global" 
        context-object="${pdict.Product}"/>
```

### Shopping Cart Recommendations

```isml
<!-- Recommendations based on basket contents -->
<isslot id="cart_recommendations" 
        description="Recommended products based on cart contents" 
        context="global" 
        context-object="${pdict.CurrentBasket}"/>
```

### Multiple Product Recommendations

```isml
<!-- Recommendations based on collection of products (max 5) -->
<isslot id="bundle_recommendations" 
        description="Bundle recommendations based on selected products" 
        context="global" 
        context-object="${pdict.RecommendationProducts}"/>
```

## Using the slotcontent Variable

The `slotcontent` variable is a TopLevel class system variable that provides access to the public class `dw.campaign.SlotContent`. This class provides access to slotting information and is available only in ISML templates that are defined as a slot's rendering template.

### SlotContent Class Mapping

| dw.campaign.SlotContent Method | Template Variable |
|-------------------------------|-------------------|
| `getContent() : Collection` | `slotcontent.content` |
| `getSlotID() : String` | `slotcontent.slotID` |
| `getCallout() : MarkupText` | `slotcontent.callout` |
| `getCustom() : Map` | `slotcontent.custom` |

### SlotContent Properties

**slotcontent.content**
- Collection of content items (products or content assets)
- Can be iterated with `<isloop>`

**slotcontent.slotID**
- The ID of the slot being rendered

**slotcontent.callout**
- Optional callout markup text for the slot

**slotcontent.custom**
- Map of custom attributes for the slot

## Rendering Templates

### Rendering Template for Products

When a slot configuration returns products, the rendering template can access them through `slotcontent.content`:

```isml
<!-- Check if slotcontent exists -->
<isif condition="${!empty(slotcontent)}">
    <div class="product">
        <!-- Loop through products -->
        <isloop iterator="${slotcontent.content}" alias="product">
            <isprint value="${product.SKU}"/><br/>
            <isprint value="${product.Name}"/><br/>
        </isloop>
    </div>
</isif>
```

### Rendering Template for Content Assets

When a slot configuration returns content assets:

```isml
<isif condition="${!empty(slotcontent)}">
    <div class="assetlisting">
        <isloop iterator="${slotcontent.content}" alias="asset">
            <isif condition="${asset != null}">
                <div class="asset">
                    <div class="name">
                        <a href="${URLUtils.url('Page-Show', 'cid', asset.ID)}">
                            <isprint value="${asset.name}"/>
                        </a>
                    </div>
                </div>
            </isif>
        </isloop>
    </div>
</isif>
```

### Checking for SlotContent Existence

Always verify slotcontent exists before accessing it:

```isml
<!-- Check if slotcontent has any content -->
<isif condition="${slotcontent != null}">
    <isloop items="${slotcontent.content}" var="contentAsset">
        <!-- Render content asset -->
    </isloop>
</isif>
```

### Product Slot Rendering with Detailed Layout

```isml
<div class="product_1x2">
    <isloop iterator="${slotcontent.content}" alias="product" begin="0" end="1">
        <isset name="Product" value="${product}" scope="request"/>
        <div class="product_1x2_slot">
            <div class="image">
                <a title="${Resource.msg('components.common-details.001', 'components', null)}" 
                   href="${URLUtils.http('Product-Show', 'pid', product.ID)}">
                    <img src="${product.image.url}"
                         alt="${Resource.msg('components.image-thumbnail.001', 'components', null)}${product.name}"/>
                </a>
            </div>
            <div class="productdetails">
                <h3>
                    <a title="${Resource.msg('components.common-details.001', 'components', null)}" 
                       href="${URLUtils.http('Product-Show', 'pid', product.ID)}">
                        <isprint value="${product.name}"/>
                    </a>
                </h3>
                <isinclude template="product/components/pricing"/>
            </div>
            <div class="clear"><!-- FLOAT CLEAR --></div>
        </div>
    </isloop>
    <div class="clear"><!-- FLOAT CLEAR --></div>
</div>
```

### Content Asset Slot with Custom Body

```isml
<iscontent type="text/html" charset="UTF-8" compact="true"/>

<!-- Make sure we have an asset at all -->
<isif condition="${slotcontent != null}">
    <isloop iterator="${slotcontent.content}" alias="contentAsset">
        <!-- Render custom body without encoding (HTML content) -->
        <isprint value="${contentAsset.custom.body}" encoding="off"/>
    </isloop>
</isif>
```

## Advanced Rendering Patterns

### Conditional Rendering by Content Type

```isml
<isif condition="${!empty(slotcontent)}">
    <!-- Check content type and render accordingly -->
    <isloop items="${slotcontent.content}" var="item">
        <isif condition="${item instanceof dw.catalog.Product}">
            <!-- Render as product -->
            <div class="product-slot">
                <isinclude template="product/productTile" product="${item}"/>
            </div>
        <iselse/>
            <!-- Render as content asset -->
            <div class="content-slot">
                <isprint value="${item.custom.body}" encoding="off"/>
            </div>
        </isif>
    </isloop>
</isif>
```

### Limited Item Display with Counter

```isml
<isif condition="${!empty(slotcontent)}">
    <isset name="itemCount" value="${0}" scope="page"/>
    <div class="slot-container">
        <isloop items="${slotcontent.content}" var="product">
            <isif condition="${itemCount < 4}">
                <div class="slot-item">
                    <isinclude template="product/productCard" product="${product}"/>
                </div>
                <isset name="itemCount" value="${itemCount + 1}" scope="page"/>
            </isif>
        </isloop>
    </div>
</isif>
```

### Responsive Grid Layout

```isml
<isif condition="${!empty(slotcontent)}">
    <div class="slot-grid">
        <isloop items="${slotcontent.content}" var="item" status="loopStatus">
            <div class="slot-grid-item ${loopStatus.first ? 'first' : ''} ${loopStatus.last ? 'last' : ''}">
                <isinclude template="components/slotItem" item="${item}"/>
            </div>
        </isloop>
    </div>
</isif>
```

### Using Callout and Custom Attributes

```isml
<isif condition="${!empty(slotcontent)}">
    <!-- Display callout if available -->
    <isif condition="${!empty(slotcontent.callout)}">
        <div class="slot-callout">
            <isprint value="${slotcontent.callout}" encoding="off"/>
        </div>
    </isif>
    
    <!-- Access custom attributes -->
    <isif condition="${!empty(slotcontent.custom.customHeading)}">
        <h2>${slotcontent.custom.customHeading}</h2>
    </isif>
    
    <!-- Render content -->
    <isloop items="${slotcontent.content}" var="item">
        <isinclude template="components/slotItem" item="${item}"/>
    </isloop>
</isif>
```

## Best Practices

### 1. Always Check SlotContent Existence

```isml
<!-- ❌ Bad: No null check -->
<isloop items="${slotcontent.content}" var="item">

<!-- ✅ Good: Always check first -->
<isif condition="${!empty(slotcontent)}">
    <isloop items="${slotcontent.content}" var="item">
        <!-- Content rendering -->
    </isloop>
</isif>
```

### 2. Use Descriptive Slot IDs and Descriptions

```isml
<!-- ❌ Bad: Unclear naming -->
<isslot id="slot1" description="Slot" context="global"/>

<!-- ✅ Good: Descriptive naming -->
<isslot id="homepage_hero_banner" 
        description="Homepage hero banner 1920px x 600px - displays main promotional content" 
        context="global"/>
```

### 3. Specify Dimensions in Description

```isml
<!-- ✅ Good: Include dimensions for image slots -->
<isslot id="category_banner" 
        description="Category banner 1200px x 400px" 
        context="category" 
        context-object="${pdict.ProductSearchResult.category}"/>
```

### 4. Use Appropriate Context

```isml
<!-- ✅ Use global for site-wide content -->
<isslot id="site_promo" description="Site-wide promotion" context="global"/>

<!-- ✅ Use category for category-specific content -->
<isslot id="category_featured" 
        description="Category featured products" 
        context="category" 
        context-object="${pdict.ProductSearchResult.category}"/>
```

### 5. Create Reusable Rendering Templates

```isml
<!-- Create modular rendering templates -->
<!-- File: slots/productSlotRenderer.isml -->
<isif condition="${!empty(slotcontent)}">
    <div class="product-slot-${slotcontent.slotID}">
        <isloop items="${slotcontent.content}" var="product">
            <isinclude template="product/productTile" product="${product}"/>
        </isloop>
    </div>
</isif>
```

### 6. Handle Empty Slots Gracefully

```isml
<!-- ✅ Provide fallback for empty slots -->
<isif condition="${!empty(slotcontent) && !empty(slotcontent.content)}">
    <!-- Render slot content -->
    <isloop items="${slotcontent.content}" var="item">
        <isinclude template="components/slotItem" item="${item}"/>
    </isloop>
<iselse/>
    <!-- Optional: Show default content or nothing -->
    <div class="slot-empty">
        <!-- Default content or leave empty -->
    </div>
</isif>
```

## Performance Considerations

### Limit Item Count in Rendering

```isml
<!-- ✅ Use begin/end to limit items rendered -->
<isif condition="${!empty(slotcontent)}">
    <isloop items="${slotcontent.content}" var="product" begin="0" end="3">
        <isinclude template="product/productTile" product="${product}"/>
    </isloop>
</isif>
```

### Cache Slot Rendering Templates

Configure caching in rendering templates for better performance:

```isml
<!-- Use iscache for frequently accessed slots -->
<iscache type="relative" hour="1"/>

<isif condition="${!empty(slotcontent)}">
    <!-- Slot rendering -->
</isif>
```

## Security Considerations

### Encoding Content Output

```isml
<!-- ✅ Encode user-generated content -->
<isif condition="${!empty(slotcontent)}">
    <isloop items="${slotcontent.content}" var="asset">
        <!-- Safe: encoding on by default -->
        <isprint value="${asset.name}"/>
    </isloop>
</isif>

<!-- ⚠️ Only disable encoding for trusted HTML content -->
<isprint value="${contentAsset.custom.body}" encoding="off"/>
```

### Validate Context Objects

```isml
<!-- ✅ Verify context object exists -->
<isif condition="${!empty(pdict.ProductSearchResult.category)}">
    <isslot id="category_featured" 
            context="category" 
            description="Category featured products"
            context-object="${pdict.ProductSearchResult.category}"/>
</isif>
```

## Troubleshooting

### Slot Not Rendering

**Problem:** Slot appears empty even with configuration.

**Solutions:**
- Verify slot ID matches configuration in Business Manager
- Check that slot configuration is active
- Ensure context-object evaluates correctly
- Review log files for slot-related errors
- Verify rendering template path is correct

### SlotContent Variable Undefined

**Problem:** `slotcontent` variable is null or undefined.

**Solutions:**
- Ensure template is configured as slot rendering template
- Verify slot configuration has content assigned
- Check that slot is active and scheduled correctly
- Always use null checks before accessing slotcontent

### Category/Folder Slots Not Appearing in Business Manager

**Problem:** Slots don't appear in category or folder listing.

**Solutions:**
- Verify category/folder configuration specifies template with `<isslot>` tag
- Ensure context-object references correct category/folder
- Check that template is assigned to category/folder in Business Manager

### Einstein Recommendations Not Working

**Problem:** Product recommendations not appearing.

**Solutions:**
- Verify Einstein is enabled for the site
- Ensure context-object references valid product, basket, or product collection
- Check that product collection has 5 or fewer products
- Verify recommendation configuration in Business Manager

## Related Elements

- **`<isinclude>`** - Include rendering templates for slot content
- **`<isloop>`** - Iterate through slot content items
- **`<isif>`** - Conditional rendering of slot content
- **`<isprint>`** - Output slot content attributes
- **`<isset>`** - Store slot items in variables
- **`<iscache>`** - Cache slot rendering templates

## See Also

- [isinclude](./isinclude.md) - Include templates for slot rendering
- [isloop](./isloop.md) - Loop through slot content
- [isif](./isif.md) - Conditional slot rendering
- [isprint](./isprint.md) - Output slot content values
