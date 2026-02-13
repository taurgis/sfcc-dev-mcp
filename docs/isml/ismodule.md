# ISML ismodule Element

## Overview

The `<ismodule>` element declares custom tags in your templates, enabling you to create reusable components with user-defined attributes. Custom tags are essentially parameterized template includes that provide a cleaner syntax for component reuse.

**SFRA Note:** In Storefront Reference Architecture (SFRA) implementations, this tag is primarily used for content assets.

## Syntax

```isml
<ismodule
  template  = template_path  // required
  name      = tag_name       // required
  attribute = attr_name      // 0 or more
/>
```

## Required Attributes

### template

**Type:** String or Expression  
**Required:** Yes

Defines the path and name for the template that implements the custom tag. Relative paths are expanded from the server's template root directory.

**Path Rules:**
- Relative to cartridge's `templates/default` directory
- Template file names and folder names **cannot contain spaces**
- Can use expressions for dynamic template selection

**Examples:**
```isml
<!-- Fixed path -->
<ismodule template="TagExtension/background.isml" name="bgcolor" attribute="color"/>

<!-- Path without .isml extension (automatically added) -->
<ismodule template="components/productTile" name="producttile" attribute="product"/>

<!-- Expression-based path -->
<ismodule template="${'components/' + pdict.componentType}" name="customcomponent"/>
```

### name

**Type:** String  
**Required:** Yes  
**Expressions:** Not allowed

Specifies the name of the custom tag. 

**Naming Rules:**
- Custom tags are declared **without** the `is` prefix
- When **using** the custom tag, you **must include** the `is` prefix
- Can use either case (case-insensitive)

**Examples:**
```isml
<!-- Declaration: name without "is" prefix -->
<ismodule template="components/product" name="producttile"/>

<!-- Usage: Must include "is" prefix -->
<isproducttile product="${product}"/>

<!-- Case insensitive -->
<ismodule name="myTag"/>  <!-- Declared as "myTag" -->
<ismytag/>                <!-- Used as "ismytag" -->
<isMyTag/>                <!-- Also valid -->
<isMYTAG/>                <!-- Also valid -->
```

## Optional Attributes

### attribute

**Type:** String  
**Allowed:** 0 or more  
**Expressions:** Not allowed

Specifies attributes that your custom tag can accept. You can define as many attributes as needed, and all attributes are optional.

**Important Rules:**
- All attribute names are stored in lowercase in the Pipeline Dictionary
- **Always use lowercase names** in attribute definitions
- Attributes are always optional at runtime
- No validation that attributes are provided—check explicitly if needed

**Examples:**
```isml
<!-- Single attribute -->
<ismodule template="components/button" name="button" attribute="label"/>

<!-- Multiple attributes -->
<ismodule 
  template="components/productTile" 
  name="producttile" 
  attribute="product"
  attribute="showprice"
  attribute="showrating"
/>

<!-- No attributes -->
<ismodule template="components/divider" name="divider"/>
```

## Purpose

The `<ismodule>` element enables:

1. **Custom Components:** Create reusable UI components with clean syntax
2. **Parameterized Templates:** Pass data to included templates through named attributes
3. **Abstraction:** Hide implementation details behind simple tag names
4. **Maintainability:** Centralize component logic in dedicated templates
5. **Readability:** Improve template readability with semantic custom tag names
6. **Content Assets:** Primary use in SFRA for content asset rendering

## How Custom Tags Work

### Declaration → Implementation → Usage

**1. Declaration (in parent template):**
```isml
<ismodule 
  template="TagExtension/background.isml"
  name="bgcolor"
  attribute="color"
/>
```

**2. Implementation (in TagExtension/background.isml):**
```isml
<isif condition="${color != null}">
  <img src="${URLUtils.webRoot() + 'images/background_' + color + '.gif'}"/>
<iselse>
  <img src="${URLUtils.webRoot() + 'images/background_default.gif'}"/>
</isif>
```

**3. Usage (in parent template, after declaration):**
```isml
<isbgcolor color="green"/>
```

### Attribute Access

Attributes passed to custom tags are accessed **directly by name** in the implementation template (similar to user-defined variables):

```isml
<!-- Declaration -->
<ismodule 
  template="components/button"
  name="button"
  attribute="label"
  attribute="url"
  attribute="style"
/>

<!-- Implementation (components/button.isml) -->
<a href="${url}" class="btn btn-${style}">
  ${label}
</a>

<!-- Usage -->
<isbutton label="Add to Cart" url="${addToCartUrl}" style="primary"/>
```

## Declaration Rules

### Placement

The `<ismodule>` declaration can be located **anywhere** in the template, but **must appear before** the first usage of the custom tag.

```isml
<!-- Good: Declaration before usage -->
<ismodule template="components/badge" name="badge" attribute="text"/>

<isbadge text="New"/>  <!-- OK -->

<!-- Bad: Usage before declaration -->
<isbadge text="New"/>  <!-- ERROR -->

<ismodule template="components/badge" name="badge" attribute="text"/>
```

### Multiple Declarations

Multiple declarations of the same tag don't interrupt template processing—the **last declaration is used**.

```isml
<!-- First declaration -->
<ismodule template="components/button1" name="button" attribute="label"/>

<!-- Second declaration (overrides first) -->
<ismodule template="components/button2" name="button" attribute="label"/>

<!-- Uses components/button2 implementation -->
<isbutton label="Click Me"/>
```

### Declarations in Included Templates

You can define a custom tag in an **included template** and use it afterward in the **including template**:

```isml
<!-- Including template (main.isml) -->
<isinclude template="tagDefinitions"/>

<!-- Now can use tags declared in tagDefinitions.isml -->
<ismybadge text="Featured"/>

<!-- tagDefinitions.isml -->
<ismodule template="components/badge" name="mybadge" attribute="text"/>
```

## Attribute Behavior

### String or Expression Values

Attribute values can be **strings or expressions** that are converted to strings during runtime:

```isml
<!-- String literal -->
<isbutton label="Add to Cart"/>

<!-- Expression -->
<isbutton label="${Resource.msg('button.addtocart', 'product', null)}"/>

<!-- Variable -->
<isbutton label="${pdict.buttonText}"/>

<!-- Computed value -->
<isbutton label="${'Buy ' + product.name}"/>
```

### Optional Attributes

All attributes are **always optional**. The template processor doesn't check if attributes are missing—you must check explicitly if needed.

```isml
<!-- Implementation template checks if attribute provided -->
<isif condition="${label != null && label != ''}">
  <button>${label}</button>
<iselse>
  <button>Default Label</button>
</isif>
```

### Lowercase Attribute Names

Because all attribute names are stored in **lowercase** in the Pipeline Dictionary, always use lowercase names:

```isml
<!-- Good: Lowercase attribute names -->
<ismodule 
  template="components/product"
  name="producttile"
  attribute="product"
  attribute="showprice"
/>

<!-- Avoid: Mixed case (stored as lowercase anyway) -->
<ismodule 
  template="components/product"
  name="producttile"
  attribute="Product"      <!-- Stored as "product" -->
  attribute="showPrice"    <!-- Stored as "showprice" -->
/>
```

### Accessing Attributes in Implementation

Attributes are accessed by name in the implementation template:

```isml
<!-- Declaration -->
<ismodule 
  template="components/alert"
  name="alert"
  attribute="message"
  attribute="type"
/>

<!-- Implementation (components/alert.isml) -->
<div class="alert alert-${type}">
  <isif condition="${message != null}">
    ${message}
  <iselse>
    No message provided
  </isif>
</div>

<!-- Usage -->
<isalert message="Product added to cart" type="success"/>
```

## Common Use Cases

### Background Color Tag

From the official SFCC documentation example:

**Declaration (sample1.isml):**
```isml
<!-- Tag declaration -->
<ismodule 
  template="TagExtension/background.isml"
  name="bgcolor"
  attribute="color"
/>

<!-- Tag usage -->
<isbgcolor color="green"/>
```

**Implementation (TagExtension/background.isml):**
```isml
<!-- Tag implementation -->
<isif condition="${color != null}">
  <img src="${URLUtils.webRoot() + 'images/background_' + color + '.gif'}"/>
<iselse>
  <img src="${URLUtils.webRoot() + 'images/background_default.gif'}"/>
</isif>
```

### Checkout Progress Indicator

From the Reference Application example:

**Declaration (checkout_address.isml):**
```isml
<ismodule
  template="cart/checkout_progressindicator"
  name="checkoutprogressindicator"
  attribute="step"
/>

<!-- Usage -->
<ischeckoutprogressindicator step="2"/>
```

**Implementation (cart/checkout_progressindicator.isml):**
```isml
<div class="checkoutprogressindicator">
  <isif condition="${pdict.step == '1'}">
    <isset name="step1state" value="active" scope="page"/>
    <isset name="step2state" value="inactive" scope="page"/>
    <isset name="step3state" value="inactive" scope="page"/>
    <isset name="step4state" value="inactive" scope="page"/>
  <iselseif condition="${pdict.step == '2'}">
    <isset name="step1state" value="inactive" scope="page"/>
    <isset name="step2state" value="active" scope="page"/>
    <isset name="step3state" value="inactive" scope="page"/>
    <isset name="step4state" value="inactive" scope="page"/>
  <iselseif condition="${pdict.step == '3'}">
    <isset name="step1state" value="inactive" scope="page"/>
    <isset name="step2state" value="inactive" scope="page"/>
    <isset name="step3state" value="active" scope="page"/>
    <isset name="step4state" value="inactive" scope="page"/>
  <iselseif condition="${pdict.step == '4'}">
    <isset name="step1state" value="inactive" scope="page"/>
    <isset name="step2state" value="inactive" scope="page"/>
    <isset name="step3state" value="inactive" scope="page"/>
    <isset name="step4state" value="active" scope="page"/>
  <iselse>
    <isset name="step1state" value="inactive" scope="page"/>
    <isset name="step2state" value="inactive" scope="page"/>
    <isset name="step3state" value="inactive" scope="page"/>
    <isset name="step4state" value="inactive" scope="page"/>
  </isif>
  
  <!-- Progress indicator UI rendering using step states -->
  <div class="step ${step1state}">1. Shipping</div>
  <div class="step ${step2state}">2. Billing</div>
  <div class="step ${step3state}">3. Review</div>
  <div class="step ${step4state}">4. Confirmation</div>
</div>
```

### Product Tile Component

**Declaration:**
```isml
<ismodule 
  template="components/productTile"
  name="producttile"
  attribute="product"
  attribute="showprice"
  attribute="showrating"
/>
```

**Implementation (components/productTile.isml):**
```isml
<div class="product-tile">
  <img src="${product.images.small[0].url}" alt="${product.name}"/>
  <h3>${product.name}</h3>
  
  <isif condition="${showprice == 'true'}">
    <span class="price">${product.price}</span>
  </isif>
  
  <isif condition="${showrating == 'true'}">
    <div class="rating">${product.rating}</div>
  </isif>
</div>
```

**Usage:**
```isml
<isloop items="${pdict.products}" var="product">
  <isproducttile 
    product="${product}" 
    showprice="true" 
    showrating="true"
  />
</isloop>
```

### Button Component

**Declaration:**
```isml
<ismodule 
  template="components/button"
  name="button"
  attribute="label"
  attribute="url"
  attribute="type"
  attribute="disabled"
/>
```

**Implementation (components/button.isml):**
```isml
<isset name="btnType" value="${type != null ? type : 'primary'}" scope="page"/>
<isset name="isDisabled" value="${disabled == 'true'}" scope="page"/>

<isif condition="${url != null}">
  <a href="${url}" class="btn btn-${btnType} ${isDisabled ? 'disabled' : ''}">
    ${label}
  </a>
<iselse>
  <button class="btn btn-${btnType}" ${isDisabled ? 'disabled' : ''}>
    ${label}
  </button>
</isif>
```

**Usage:**
```isml
<isbutton label="Add to Cart" url="${addToCartUrl}" type="primary"/>
<isbutton label="View Details" url="${productUrl}" type="secondary"/>
<isbutton label="Unavailable" type="primary" disabled="true"/>
```

### Alert/Message Component

**Declaration:**
```isml
<ismodule 
  template="components/alert"
  name="alert"
  attribute="message"
  attribute="type"
  attribute="dismissible"
/>
```

**Implementation (components/alert.isml):**
```isml
<isset name="alertType" value="${type != null ? type : 'info'}" scope="page"/>

<div class="alert alert-${alertType} ${dismissible == 'true' ? 'alert-dismissible' : ''}">
  <isif condition="${dismissible == 'true'}">
    <button type="button" class="close" data-dismiss="alert">×</button>
  </isif>
  ${message}
</div>
```

**Usage:**
```isml
<isalert message="Product added to cart" type="success" dismissible="true"/>
<isalert message="Please fill all required fields" type="error"/>
<isalert message="${pdict.infoMessage}" type="info"/>
```

### Badge Component

**Declaration:**
```isml
<ismodule 
  template="components/badge"
  name="badge"
  attribute="text"
  attribute="style"
/>
```

**Implementation (components/badge.isml):**
```isml
<isset name="badgeStyle" value="${style != null ? style : 'default'}" scope="page"/>

<span class="badge badge-${badgeStyle}">
  ${text}
</span>
```

**Usage:**
```isml
<isbadge text="New" style="success"/>
<isbadge text="Sale" style="danger"/>
<isbadge text="${product.custom.badge}"/>
```

### Icon Component

**Declaration:**
```isml
<ismodule 
  template="components/icon"
  name="icon"
  attribute="name"
  attribute="size"
/>
```

**Implementation (components/icon.isml):**
```isml
<isset name="iconSize" value="${size != null ? size : 'medium'}" scope="page"/>

<i class="icon icon-${name} icon-${iconSize}"></i>
```

**Usage:**
```isml
<isicon name="cart" size="large"/>
<isicon name="search"/>
<isicon name="user" size="small"/>
```

### Content Asset Module (SFRA)

**Declaration:**
```isml
<ismodule 
  template="components/contentAsset"
  name="contentasset"
  attribute="cid"
  attribute="show"
/>
```

**Implementation (components/contentAsset.isml):**
```isml
<isif condition="${show != 'false'}">
  <isset name="contentAsset" value="${dw.content.ContentMgr.getContent(cid)}" scope="page"/>
  
  <isif condition="${contentAsset != null}">
    <div class="content-asset" data-cid="${cid}">
      <isprint value="${contentAsset.custom.body}" encoding="off"/>
    </div>
  </isif>
</isif>
```

**Usage:**
```isml
<iscontentasset cid="homepage-banner"/>
<iscontentasset cid="footer-links" show="${pdict.showFooter}"/>
```

## SFRA Usage Pattern

In SFRA implementations, `<ismodule>` is **primarily used for content assets**:

```isml
<!-- SFRA common pattern -->
<ismodule 
  template="common/contentAsset"
  name="contentasset"
  attribute="cid"
/>

<!-- Usage throughout SFRA templates -->
<iscontentasset cid="homepage-hero"/>
<iscontentasset cid="category-banner"/>
<iscontentasset cid="footer-contact-info"/>
```

## Best Practices

### Use Descriptive Names

```isml
<!-- Good: Clear, descriptive names -->
<ismodule template="components/productTile" name="producttile"/>
<ismodule template="components/priceDisplay" name="pricedisplay"/>

<!-- Avoid: Vague names -->
<ismodule template="components/comp1" name="thing"/>
<ismodule template="components/helper" name="util"/>
```

### Keep Implementation Templates Focused

```isml
<!-- Good: Single responsibility -->
<ismodule template="components/button" name="button"/>

<!-- Avoid: Component doing too much -->
<ismodule template="components/buttonAndFormAndValidation" name="megacomponent"/>
```

### Validate Required Attributes

Always check if required attributes are provided in the implementation:

```isml
<!-- Implementation template -->
<isif condition="${product == null}">
  <div class="error">Product is required</div>
<iselse>
  <div class="product-tile">
    <!-- Render product -->
  </div>
</isif>
```

### Use Lowercase Attribute Names

```isml
<!-- Good: Lowercase attributes -->
<ismodule 
  template="components/product"
  name="producttile"
  attribute="product"
  attribute="showprice"
/>

<!-- Avoid: Mixed case -->
<ismodule 
  attribute="Product"
  attribute="showPrice"
/>
```

### Provide Default Values

```isml
<!-- Implementation with defaults -->
<isset name="buttonType" value="${type != null ? type : 'primary'}" scope="page"/>
<isset name="buttonSize" value="${size != null ? size : 'medium'}" scope="page"/>

<button class="btn btn-${buttonType} btn-${buttonSize}">
  ${label}
</button>
```

### Document Custom Tags

```isml
<iscomment>
  Custom tag: producttile
  
  Attributes:
    - product (required): Product object to display
    - showprice (optional): "true" to show price (default: false)
    - showrating (optional): "true" to show rating (default: false)
  
  Example:
    <isproducttile product="${product}" showprice="true"/>
</iscomment>
<ismodule 
  template="components/productTile"
  name="producttile"
  attribute="product"
  attribute="showprice"
  attribute="showrating"
/>
```

### Organize Component Templates

```
templates/
  default/
    components/          - Reusable components
      productTile.isml
      button.isml
      alert.isml
      badge.isml
      icon.isml
    modules/             - Custom tag implementations
      contentAsset.isml
      progressIndicator.isml
```

## Performance Considerations

### Overhead

Custom tags are essentially template includes with attribute passing:
- Minimal performance overhead compared to `<isinclude>`
- Same template processing rules apply
- Consider caching for frequently used components

### When to Use Custom Tags vs Includes

**Use `<ismodule>`:**
- Component needs multiple parameters
- Cleaner syntax desired for reusable components
- Self-documenting tag names improve readability

**Use `<isinclude>`:**
- Simple inclusion without parameters
- One-time template composition
- Lower overhead for simple cases

```isml
<!-- Custom tag: Better for parameterized components -->
<ismodule template="components/button" name="button" attribute="label" attribute="url"/>
<isbutton label="Click" url="${url}"/>

<!-- Include: Better for simple inclusions -->
<isinclude template="common/header"/>
```

## Troubleshooting

### Custom Tag Not Found

**Problem:** Error about undefined tag.

**Solution:** Ensure `<ismodule>` declaration appears before tag usage:

```isml
<!-- Declare before use -->
<ismodule template="components/badge" name="badge" attribute="text"/>

<!-- Now can use -->
<isbadge text="New"/>
```

### Attribute Not Accessible

**Problem:** Attribute value is null or undefined in implementation template.

**Solution:** 
1. Verify attribute is declared in `<ismodule>`
2. Check attribute name is lowercase
3. Verify attribute is passed when using the tag

```isml
<!-- Declaration must include attribute -->
<ismodule template="components/button" name="button" attribute="label"/>

<!-- Usage must pass attribute -->
<isbutton label="Click Me"/>

<!-- Implementation can access attribute -->
<button>${label}</button>
```

### Template Not Found

**Problem:** Template path cannot be resolved.

**Solution:** Verify template path is correct and relative to `templates/default`:

```isml
<!-- Check template path -->
templates/
  default/
    components/
      button.isml

<!-- Correct path -->
<ismodule template="components/button" name="button"/>

<!-- Wrong: Includes "templates/default" -->
<ismodule template="templates/default/components/button" name="button"/>  <!-- ERROR -->
```

### Case Sensitivity Issues

**Problem:** Custom tag not recognized.

**Solution:** Remember tags are case-insensitive, but must include `is` prefix:

```isml
<!-- Declaration -->
<ismodule template="components/badge" name="badge"/>

<!-- All valid usages -->
<isbadge text="New"/>
<isBadge text="New"/>
<isBADGE text="New"/>

<!-- Invalid: Missing "is" prefix -->
<badge text="New"/>  <!-- ERROR -->
```

## Comparison: ismodule vs isinclude

| Feature | `<ismodule>` | `<isinclude>` |
|---------|--------------|---------------|
| **Purpose** | Declare reusable component with custom tag name | Include template content |
| **Attributes** | User-defined attributes | No custom attributes |
| **Syntax** | Custom tag name (cleaner) | Include template path |
| **Declaration** | Required before use | Not required |
| **Best for** | Parameterized components | Simple template inclusion |

```isml
<!-- ismodule: Cleaner syntax for components with parameters -->
<ismodule template="components/button" name="button" attribute="label" attribute="url"/>
<isbutton label="Click" url="${url}"/>

<!-- isinclude: Simple inclusion -->
<isinclude template="common/header"/>
```

## Related Elements

- **`<isinclude>`**: Simple template inclusion without custom attributes
- **`<isdecorate>`**: Wrap content with decorator templates
- **`<isset>`**: Set variables used by custom tags
- **`<isslot>`**: Content slots (different from custom tags)

## Summary

The `<ismodule>` element enables:

- ✅ Creating custom tags with semantic names
- ✅ Building reusable components with user-defined attributes
- ✅ Improving template readability with self-documenting tags
- ✅ Centralizing component logic in dedicated templates
- ✅ Parameterizing template includes for flexibility
- ✅ Primary pattern for content assets in SFRA
- ✅ Cleaner syntax compared to repeated `<isinclude>` with parameters
- ✅ Maintaining modular, maintainable template architecture

Use `<ismodule>` to create clean, reusable component APIs in your SFCC templates, especially when components require multiple parameters or when you want to improve code readability with semantic tag names.
