# ISML isprint Element

## Overview

The `<isprint>` element is used to format and encode data for output in ISML templates. It provides comprehensive control over how expression results are displayed, including formatting for money, dates, numbers, and quantities, as well as automatic encoding to prevent cross-site scripting (XSS) attacks.

**Key Features:** Automatic HTML encoding, flexible formatting options, locale-aware output, context-specific encoding for security, and timezone control for date values.

## Syntax

```isml
<isprint
  value     = output                           // required
  (style    = style_ID) | (formatter = format) // one required, but not both
  timezone  = "SITE" | "INSTANCE" | "utc"      // optional
  padding   = padding_constant                 // optional
  encoding  = "on" | "off" | context           // optional (default: "on")
/>
```

## Required Attributes

### value

**Type:** Expression (NOT String literal)  
**Required:** Yes  
**Allowed Data Type:** Expression only. String literals are not allowed.

Specifies an expression that resolves to the text or data you want to output. The expression can evaluate to various data types including Money, Date, Number, Quantity, or String.

**Examples:**
```isml
<!-- Money value -->
<isprint value="${pdict.product.price}" style="MONEY_LONG"/>

<!-- Date value -->
<isprint value="${pdict.order.creationDate}" style="DATE_LONG"/>

<!-- Number value -->
<isprint value="${pdict.productCount}" style="INTEGER"/>

<!-- String value (with automatic encoding) -->
<isprint value="${pdict.product.name}" encoding="on"/>

<!-- Complex expression -->
<isprint value="${pdict.basket.totalGrossPrice.subtract(pdict.basket.totalTax)}" style="MONEY_SHORT"/>
```

**Important Notes:**
- Must be an expression (using `${}` syntax)
- String literals without expression syntax are **not allowed**
- Encoding is always done **after** formatting

### style OR formatter (Mutually Exclusive)

**You must include either `style` OR `formatter`, but not both.**

#### style

**Type:** String  
**Required:** Yes (if `formatter` is not specified)

Specifies a predefined style identifier from standard formatter classes. Styles are locale-aware and automatically adjust formatting based on regional settings.

**Available Styles by Data Type:**

**Money Formatting:**
- `MONEY_SHORT` - Two decimal digits, no currency symbol (e.g., "3,333.00")
- `MONEY_LONG` - Two decimal digits with currency symbol (e.g., "$3,333.00")

**Number Formatting:**
- `INTEGER` - No decimal digits, no decimal separator (e.g., "2,200")
- `DECIMAL` - Exactly two decimal digits (e.g., "2,200.12")

**Quantity Formatting:**
- `QUANTITY_SHORT` - 0-3 decimal digits, no unit symbol (e.g., "3,333.123")
- `QUANTITY_LONG` - 0-3 decimal digits with unit symbol (e.g., "3,333.123 kg")

**Date Formatting:**
- `DATE_SHORT` - Short date format, no time (e.g., "9/25/99")
- `DATE_LONG` - Long date format, no time (e.g., "SEP 25, 1999")
- `DATE_TIME` - Clock time only (e.g., "7:55:55 PM")

**Examples:**
```isml
<!-- Money with currency symbol -->
<isprint value="${pdict.product.price}" style="MONEY_LONG"/>
<!-- Output: "$49.99" -->

<!-- Integer without decimals -->
<isprint value="${pdict.itemCount}" style="INTEGER"/>
<!-- Output: "125" -->

<!-- Short date format -->
<isprint value="${pdict.order.creationDate}" style="DATE_SHORT"/>
<!-- Output: "9/25/99" -->
```

#### formatter

**Type:** String or Expression  
**Required:** Yes (if `style` is not specified)

Defines a custom formatting string to control how expression results are output. This allows you to create specialized formats beyond the predefined styles.

**Formatter Placeholders:**

| Placeholder | Action | Usage |
|-------------|--------|-------|
| `"0"` | Required digit placeholder | Forces digit display |
| `"#"` | Optional digit placeholder | Shows digit only if present |
| `"*"` | Required symbol placeholder | Currency or unit symbol |

**Examples:**
```isml
<!-- Custom money format: "$ 03.00" -->
<isprint value="${pdict.amount}" formatter="* #,#00.0#"/>

<!-- Custom quantity format with unit -->
<isprint value="${pdict.weight}" formatter="#,#00.0# *;(-#,#00.0# *)"/>

<!-- Custom date format: "Wed, July 10, '96" -->
<isprint value="${pdict.date}" formatter="EEE, MMM d, 'yy"/>

<!-- Time format: "12:08 PM" -->
<isprint value="${pdict.date}" formatter="h a"/>

<!-- Page number with optional digit -->
<isprint value="${pdict.pagingmodel.start+1}" formatter="#"/>
```

**Date Formatter Patterns:**

| Pattern | Description | Example |
|---------|-------------|---------|
| `EEE` | Day of week (short) | "Wed" |
| `EEEE` | Day of week (full) | "Wednesday" |
| `MMM` | Month (short) | "Jul" |
| `MMMM` | Month (full) | "July" |
| `d` | Day of month | "10" |
| `yy` | Year (2 digits) | "96" |
| `yyyy` | Year (4 digits) | "1996" |
| `h` | Hour (12-hour) | "12" |
| `H` | Hour (24-hour) | "23" |
| `a` | AM/PM marker | "PM" |
| `z` | Time zone | "PST" |

## Optional Attributes

### timezone

**Type:** String  
**Allowed Values:** `"SITE"`, `"INSTANCE"`, `"utc"`  
**Default:** `"SITE"`  
**Optional:** Yes

Specifies the time zone used for printing date values. This attribute enables you to control whether dates are displayed using the instance time zone, site time zone, or without time zone conversion.

**Important:** Time zone identifiers are case-insensitive.

**Values:**

#### SITE (default)

Prints time zones as specified for your site. Defined through Business Manager via **Site Preferences > Time Zone**.

```isml
<isprint value="${new Date()}" style="DATE_LONG" timezone="SITE"/>
```

#### INSTANCE

Prints time zones as specified for your instance. Defined through Business Manager via **Global Preferences > Instance Time Zone**.

```isml
<isprint value="${new Date()}" style="DATE_LONG" timezone="INSTANCE"/>
```

#### utc

Prints date values without time zone conversion. Particularly important for date-only attributes like `customer.birthday` that have no time component.

**Use Case:** For date attributes that should have no time component (like birthdays), use `"utc"` to ensure no time zone conversion occurs. User input for date attributes is always interpreted as UTC time in Business Manager.

```isml
<!-- Customer birthday (no time component) -->
<isprint value="${pdict.customer.birthday}" style="DATE_SHORT" timezone="utc"/>
```

**Examples:**
```isml
<!-- Site time zone -->
<isprint value="${new Date()}" style="DATE_LONG" timezone="SITE"/>
<!-- Output: "SEP 25, 1999" (site timezone) -->

<!-- Instance time zone -->
<isprint value="${new Date()}" style="DATE_LONG" timezone="INSTANCE"/>
<!-- Output: "SEP 25, 1999" (instance timezone) -->

<!-- UTC (no conversion) -->
<isprint value="${pdict.customer.birthday}" style="DATE_SHORT" timezone="utc"/>
<!-- Output: "9/25/99" (no timezone conversion) -->
```

### padding

**Type:** String or Expression  
**Optional:** Yes  
**Use Case:** Mail templates (plain text, not HTML)

Defines field width and spacing for plain text output, particularly in mail templates. This attribute controls text alignment and truncation.

**Value Rules:**
- Can be any positive or negative number
- **Absolute value** defines the field width
- **Positive value** produces **left-aligned** output
- **Negative value** produces **right-aligned** output
- If output string exceeds field width, it's **truncated at the right end**

**Examples:**
```isml
<!-- Right-aligned in 10-character field -->
<isprint value="${pdict.product.price}" padding="-10"/>
<!-- Output: "   5.00 USD" (padded left with spaces) -->

<!-- Left-aligned in 10-character field -->
<isprint value="${pdict.product.price}" padding="+10"/>
<!-- Output: "5.00 USD   " (padded right with spaces) -->

<!-- Truncation when exceeds field width -->
<isprint value="#'foolish'#" padding="+3"/>
<!-- Output: "foo" (truncated from "foolish") -->
```

**Typical Use Case - Product List in Email:**
```isml
<!-- Mail template (plain text) -->
Product Name                Price      Qty
-----------------------------------------------
<isloop items="${pdict.lineItems}" var="item">
<isprint value="${item.productName}" padding="+25"/> <isprint value="${item.price}" padding="-10"/> <isprint value="${item.quantity}" padding="-5"/>
</isloop>
```

### encoding

**Type:** String  
**Allowed Values:** `"on"`, `"off"`, or context identifier  
**Default:** `"on"`  
**Optional:** Yes

Controls automatic encoding of output to prevent cross-site scripting (XSS) attacks. With this attribute, you can explicitly switch encoding on/off or specify context-specific encoding.

**Important:** Salesforce B2C Commerce supports encoding in HTML, XML, and WML. Even if encoding is turned off, you can use the `StringUtils` API to encode individual strings.

**Values:**

#### "on" (default)

Automatically encodes HTML entities to prevent XSS attacks.

```isml
<isprint value="${pdict.userInput}" encoding="on"/>
<!-- Input: <script>alert('xss')</script> -->
<!-- Output: &lt;script&gt;alert('xss')&lt;/script&gt; -->
```

#### "off"

Disables automatic encoding. **Use with extreme caution** - only when output is already safe or intentionally contains HTML.

```isml
<isprint value="${pdict.richTextContent}" encoding="off"/>
<!-- Output: raw HTML (as-is) -->
```

#### Context-Specific Encoding

Each context value maps to a method in the `SecureEncoder` class and provides specialized encoding for different usage scenarios:

**HTML Contexts:**
- `htmlcontent` - General HTML content context
- `htmlsinglequote` - HTML attribute guarded by single quote
- `htmldoublequote` - HTML attribute guarded by double quote
- `htmlunquote` - Unguarded HTML attribute (no quotes)

**JavaScript Contexts:**
- `jshtml` - JavaScript inside HTML context
- `jsattribute` - JavaScript inside HTML attribute
- `jsblock` - JavaScript inside HTML block
- `jssource` - JavaScript inside JavaScript source file

**JSON Context:**
- `jsonvalue` - JSON object value (prevents escaping into trusted context)

**URI Contexts:**
- `uricomponent` - URI component encoding
- `uristrict` - Strict URI component encoding

**XML Contexts:**
- `xmlcontent` - General XML content
- `xmlsinglequote` - XML attribute with single quote
- `xmldoublequote` - XML attribute with double quote
- `xmlcomment` - XML comment context

**Examples:**
```isml
<!-- HTML attribute with double quotes -->
<div id="<isprint value="${unsafeData}" encoding="htmldoublequote"/>">
</div>

<!-- JavaScript block -->
<script type="text/javascript">
  var data = "<isprint value="${unsafeData}" encoding="jsblock"/>";
</script>

<!-- JSON value -->
<script>
  var json = {"trusted_data": <isprint value="${unsafeData}" encoding="jsonvalue"/>};
  return JSON.stringify(json);
</script>

<!-- URI component -->
<a href="?param=<isprint value="${searchTerm}" encoding="uricomponent"/>">Search</a>

<!-- XML attribute -->
<item name="<isprint value="${productName}" encoding="xmldoublequote"/>"/>
```

## Purpose

The `<isprint>` element serves to:

1. **Output Expression Results:** Display the result of expressions and template variables
2. **Format Data:** Apply locale-aware formatting to Money, Date, Number, and Quantity values
3. **Encode Output:** Automatically encode HTML entities to prevent XSS attacks
4. **Control Display:** Manage timezone, padding, and custom formatting for precise output control
5. **Template Optimization:** Contribute to optimizing template code with explicit output control

**Note:** Even though it's possible to output expression results without `<isprint>` (using `${expression}` directly), you should always use `<isprint>` because it contributes to optimizing your template code and provides explicit control over formatting and encoding.

## Default Formatting Styles

When no style or formatter is explicitly specified, the following default styles are used:

| Data Type | Default Style | Example Output |
|-----------|---------------|----------------|
| Money | `MONEY_LONG` | "$3,333.00" |
| Number | `DECIMAL` | "2,200.12" |
| Quantity | `QUANTITY_SHORT` | "3,333.123" |
| Date | `DATE_SHORT` | "9/25/99" |

## Automatic Encoding Behavior

### When Encoding is Applied

Expression output is **automatically encoded** in the following cases:

1. **Direct Template Embedding:** Expression embedded directly in template
   ```isml
   ${pdict.product.name}  <!-- Automatically encoded -->
   ```

2. **HTML Attributes:** Expression used for HTML attribute values
   ```isml
   <div class="${pdict.className}">  <!-- Automatically encoded -->
   ```

### When Encoding is NOT Applied

Expression output is **not automatically encoded** when:

1. **ISML Tag Attributes:** Expression used in ISML tag attributes
   ```isml
   <isif condition="${expression}">  <!-- No encoding -->
   ```

**Recommendation:** Use `<isprint>` for granular control of expression output, especially when the result contains special characters.

### Encoding Example

```isml
<!-- Template variable with special character -->
<!-- Assume: pdict.product.name = 'Nokia 447X Pro 17" Monitor' -->

<!-- ISML code -->
<isprint value="${pdict.product.name}"/>

<!-- Generated HTML -->
Nokia 447X Pro 17&quot; Monitor

<!-- Displayed in browser -->
Nokia 447X Pro 17" Monitor
```

## Common Use Cases

### Basic Data Output

```isml
<!-- Product price with currency -->
<isprint value="${pdict.product.price}" style="MONEY_LONG"/>
<!-- Output: "$49.99" -->

<!-- Product name (encoded) -->
<isprint value="${pdict.product.name}" encoding="on"/>
<!-- Output: "Nokia 447X Pro 17&quot; Monitor" -->

<!-- Item count as integer -->
<isprint value="${pdict.basket.productLineItems.size()}" style="INTEGER"/>
<!-- Output: "5" -->
```

### Money Formatting

```isml
<!-- Default money formatting (MONEY_LONG) -->
<isprint value="${pdict.basket.totalGrossPrice}"/>
<!-- Output: "$125.50" -->

<!-- Short format (no currency symbol) -->
<isprint value="${pdict.basket.totalGrossPrice}" style="MONEY_SHORT"/>
<!-- Output: "125.50" -->

<!-- Custom money format -->
<isprint value="${pdict.basket.totalGrossPrice}" formatter="* #00.0#"/>
<!-- Output: "$ 125.50" -->

<!-- Price comparison -->
<div class="pricing">
  <span class="original-price">
    <isprint value="${pdict.product.price.list}" style="MONEY_LONG"/>
  </span>
  <span class="sale-price">
    <isprint value="${pdict.product.price.sales}" style="MONEY_LONG"/>
  </span>
</div>
```

### Date and Time Formatting

```isml
<!-- Short date format -->
<isprint value="${pdict.order.creationDate}" style="DATE_SHORT"/>
<!-- Output: "9/25/99" -->

<!-- Long date format -->
<isprint value="${pdict.order.creationDate}" style="DATE_LONG"/>
<!-- Output: "SEP 25, 1999" -->

<!-- Time only -->
<isprint value="${pdict.order.creationDate}" style="DATE_TIME"/>
<!-- Output: "7:55:55 PM" -->

<!-- Custom date format -->
<isprint value="${pdict.order.creationDate}" formatter="EEE, MMM d, 'yy"/>
<!-- Output: "Wed, Sep 25, '99" -->

<!-- Birthday (no timezone conversion) -->
<isprint value="${pdict.customer.birthday}" style="DATE_SHORT" timezone="utc"/>
<!-- Output: "3/15/85" -->

<!-- Instance timezone -->
<isprint value="${new Date()}" style="DATE_LONG" timezone="INSTANCE"/>
<!-- Output: "JAN 15, 2024" (instance timezone) -->
```

### Number and Quantity Formatting

```isml
<!-- Integer (no decimals) -->
<isprint value="${pdict.searchResults.count}" style="INTEGER"/>
<!-- Output: "1,234" -->

<!-- Decimal (two decimal places) -->
<isprint value="${pdict.product.rating}" style="DECIMAL"/>
<!-- Output: "4.75" -->

<!-- Quantity with unit -->
<isprint value="${pdict.product.weight}" style="QUANTITY_LONG"/>
<!-- Output: "3.5 kg" -->

<!-- Custom quantity format -->
<isprint value="${pdict.product.weight}" formatter="#,#00.0# *"/>
<!-- Output: "3.50 kg" -->
```

### Security and Encoding

```isml
<!-- Safe HTML output (encoded) -->
<div class="product-description">
  <isprint value="${pdict.product.description}" encoding="on"/>
</div>

<!-- HTML attribute encoding -->
<div id="<isprint value="${pdict.elementId}" encoding="htmldoublequote"/>"
     class="product-tile">
</div>

<!-- JavaScript context -->
<script>
  var productName = "<isprint value="${pdict.product.name}" encoding="jsblock"/>";
  console.log(productName);
</script>

<!-- JSON context -->
<script>
  var productData = {
    "name": <isprint value="${pdict.product.name}" encoding="jsonvalue"/>,
    "price": ${pdict.product.price.value}
  };
</script>

<!-- URL parameter -->
<a href="?search=<isprint value="${pdict.searchTerm}" encoding="uricomponent"/>">
  Search Results
</a>

<!-- Rich text content (intentionally unencoded) -->
<div class="rich-content">
  <isprint value="${pdict.content.richText}" encoding="off"/>
</div>
```

### Mail Templates with Padding

```isml
<!-- Plain text email receipt -->
PRODUCT                       PRICE      QTY    TOTAL
----------------------------------------------------------
<isloop items="${pdict.lineItems}" var="item">
<isprint value="${item.productName}" padding="+30"/><isprint value="${item.price}" padding="-10" style="MONEY_SHORT"/><isprint value="${item.quantity}" padding="-7" style="INTEGER"/><isprint value="${item.total}" padding="-10" style="MONEY_SHORT"/>
</isloop>
----------------------------------------------------------
TOTAL:<isprint value="${pdict.orderTotal}" padding="-52" style="MONEY_LONG"/>
```

### Pagination

```isml
<!-- Page numbering -->
<div class="pagination">
  Showing 
  <isprint value="${pdict.pagingmodel.start + 1}" formatter="#"/>
  -
  <isprint value="${pdict.pagingmodel.end}" formatter="#"/>
  of
  <isprint value="${pdict.pagingmodel.total}" formatter="#"/>
  results
</div>
<!-- Output: "Showing 1-20 of 145 results" -->
```

### Complex Expressions

```isml
<!-- Calculated discount percentage -->
<isprint value="${((pdict.product.price.list.value - pdict.product.price.sales.value) / pdict.product.price.list.value * 100)}" formatter="#0"/>% OFF

<!-- Net price (excluding tax) -->
<isprint value="${pdict.basket.totalGrossPrice.subtract(pdict.basket.totalTax)}" style="MONEY_LONG"/>

<!-- Average rating -->
<isprint value="${pdict.product.ratingsTotal / pdict.product.ratingsCount}" formatter="#.0"/>
```

## Best Practices

### 1. Always Use isprint for Output

**Recommended:** Use `<isprint>` for all expression output for consistency, control, and optimization.

```isml
<!-- Good: Explicit control -->
<isprint value="${pdict.product.name}" encoding="on"/>

<!-- Acceptable but less control -->
${pdict.product.name}

<!-- Avoid: No encoding control in attributes -->
<div data-product="${pdict.product.id}">  <!-- Better with isprint -->
```

### 2. Choose Appropriate Encoding Context

Match the encoding context to where the output will be used:

```isml
<!-- HTML content -->
<div><isprint value="${content}" encoding="htmlcontent"/></div>

<!-- HTML attribute with double quotes -->
<div id="<isprint value="${id}" encoding="htmldoublequote"/>"></div>

<!-- JavaScript block -->
<script>var data = "<isprint value="${data}" encoding="jsblock"/>";</script>

<!-- JSON value -->
<script>var json = {"value": <isprint value="${data}" encoding="jsonvalue"/>};</script>

<!-- URL component -->
<a href="?q=<isprint value="${query}" encoding="uricomponent"/>">Link</a>
```

### 3. Use Styles for Standard Formatting

Prefer predefined styles over custom formatters when possible:

```isml
<!-- Good: Standard style -->
<isprint value="${pdict.product.price}" style="MONEY_LONG"/>

<!-- Only when needed: Custom formatter -->
<isprint value="${pdict.product.price}" formatter="* #,##0.00"/>
```

### 4. Specify Timezone for Date Values

Be explicit about timezone handling for dates:

```isml
<!-- Date with time component: use SITE or INSTANCE -->
<isprint value="${pdict.order.creationDate}" style="DATE_LONG" timezone="SITE"/>

<!-- Date without time (birthday, anniversary): use utc -->
<isprint value="${pdict.customer.birthday}" style="DATE_SHORT" timezone="utc"/>
```

### 5. Never Disable Encoding for User Input

**CRITICAL:** Never use `encoding="off"` for user-provided content:

```isml
<!-- DANGEROUS: XSS vulnerability -->
<isprint value="${pdict.userComment}" encoding="off"/>  <!-- DON'T DO THIS -->

<!-- SAFE: Encoded output -->
<isprint value="${pdict.userComment}" encoding="on"/>

<!-- SAFE: Context-specific encoding -->
<isprint value="${pdict.userComment}" encoding="htmlcontent"/>
```

### 6. Use Formatters for Consistent Display

Create consistent number displays with custom formatters:

```isml
<!-- Consistent decimal places for ratings -->
<isprint value="${pdict.product.rating}" formatter="#.0"/>
<!-- Always shows one decimal: "4.5", "3.0", "5.0" -->

<!-- Consistent quantity display -->
<isprint value="${pdict.product.quantity}" formatter="#,##0"/>
<!-- Always shows thousands separator: "1,000", "10,000" -->
```

## Formatting Reference Tables

### Money Formatting Styles

| Style | Description | Input | Output |
|-------|-------------|-------|--------|
| `MONEY_SHORT` | Two decimals, no currency | 3333 | "3,333.00" |
| `MONEY_LONG` | Two decimals, with currency | 3333 | "$3,333.00" |

**Note:** Currency symbols are based on the Default Currency set per site in **Administration > Sites > Manage Sites > [Site] > General**.

### Number Formatting Styles

| Style | Description | Input | Output |
|-------|-------------|-------|--------|
| `INTEGER` | No decimals, no separator | 2200.1234 | "2,200" |
| `DECIMAL` | Exactly two decimals | 2200.1234 | "2,200.12" |

### Quantity Formatting Styles

| Style | Description | Examples |
|-------|-------------|----------|
| `QUANTITY_SHORT` | 0-3 decimals, no unit | 3333 kg → "3,333"<br>3333.1 kg → "3,333.1"<br>3333.1234 kg → "3,333.123" |
| `QUANTITY_LONG` | 0-3 decimals, with unit | 3333 kg → "3,333 kg"<br>3333.1 kg → "3,333.1 kg"<br>3333.1234 kg → "3,333.123 kg" |

### Date Formatting Styles

| Style | Description | Example |
|-------|-------------|---------|
| `DATE_SHORT` | Short date, no time | "9/25/99" |
| `DATE_LONG` | Long date, no time | "SEP 25, 1999" |
| `DATE_TIME` | Time only | "7:55:55 PM" |

### Custom Formatter Examples

| Type | Formatter | Input | Output |
|------|-----------|-------|--------|
| Money | `"* #,#00.0#"` | 3 | "$ 03.00" |
| Money | `"* #,#00.0#"` | 3333.123 | "$ 3,333.12" |
| Quantity | `"#,#00.0# *"` | 3 kg | "03.0 kg" |
| Quantity | `"#,#00.0# *"` | 3333.333 kg | "3,333.33 kg" |
| Date | `"EEE, MMM d, 'yy"` | Date | "Wed, July 10, '96" |
| Date | `"h a"` | Date | "12:08 PM" |
| Date | `"K a, z"` | Date | "0:00 PM, PST" |
| Date | `"yyyyy.MMMMM.dd GGG hh aaa"` | Date | "1996.July.10 AD 12:08 PM" |

## Common Errors and Troubleshooting

### Formatting Not Applied

**Symptom:** Output appears without proper formatting.

**Causes:**
1. Missing `style` or `formatter` attribute
2. Wrong data type for the specified style
3. Expression returns null or undefined

**Solutions:**
```isml
<!-- Bad: No formatting specified -->
<isprint value="${pdict.product.price}"/>  <!-- Uses default -->

<!-- Good: Explicit style -->
<isprint value="${pdict.product.price}" style="MONEY_LONG"/>

<!-- Check for null values -->
<isif condition="${pdict.product.price}">
  <isprint value="${pdict.product.price}" style="MONEY_LONG"/>
<iselse>
  <span>Price not available</span>
</isif>
```

### Encoding Issues

**Symptom:** Special characters display as HTML entities or cause XSS vulnerabilities.

**Causes:**
1. Incorrect encoding setting
2. Wrong context for encoding
3. Double encoding

**Solutions:**
```isml
<!-- For user input: always encode -->
<isprint value="${pdict.userInput}" encoding="on"/>

<!-- For trusted HTML content: disable encoding -->
<isprint value="${pdict.richContent}" encoding="off"/>

<!-- Use correct context -->
<div id="<isprint value="${id}" encoding="htmldoublequote"/>">  <!-- Not "on" -->
```

### Timezone Confusion

**Symptom:** Dates display in wrong timezone or dates shift unexpectedly.

**Solutions:**
```isml
<!-- For dates with time component: use SITE or INSTANCE -->
<isprint value="${pdict.order.creationDate}" style="DATE_LONG" timezone="SITE"/>

<!-- For dates without time (birthdays): use utc -->
<isprint value="${pdict.customer.birthday}" style="DATE_SHORT" timezone="utc"/>
```

### String Literals Not Allowed

**Symptom:** Error when using string literals with `value` attribute.

**Cause:** The `value` attribute requires expressions, not string literals.

**Solution:**
```isml
<!-- Bad: String literal -->
<isprint value="Hello World"/>  <!-- ERROR -->

<!-- Good: Expression -->
<isprint value="${'Hello World'}"/>

<!-- Better: Template variable -->
<isprint value="${pdict.greeting}"/>
```

## Performance Considerations

### 1. Use Styles Over Custom Formatters When Possible

Predefined styles are optimized and cached:

```isml
<!-- Faster: Predefined style -->
<isprint value="${price}" style="MONEY_LONG"/>

<!-- Slower: Custom formatter (only when needed) -->
<isprint value="${price}" formatter="* #,##0.00"/>
```

### 2. Avoid Complex Expressions

Pre-calculate complex expressions in controllers:

```isml
<!-- Less efficient: Complex calculation in template -->
<isprint value="${(price.list.value - price.sales.value) / price.list.value * 100}" formatter="#0"/>

<!-- More efficient: Calculate in controller -->
<isprint value="${pdict.discountPercentage}" formatter="#0"/>
```

### 3. Cache Formatted Output When Appropriate

For repeated values, consider caching:

```isml
<isset name="formattedPrice" value="${pdict.product.price}" scope="page"/>
<isloop items="${variants}" var="variant">
  <isprint value="${formattedPrice}" style="MONEY_LONG"/>
</isloop>
```

## Security Considerations

### Cross-Site Scripting (XSS) Prevention

**CRITICAL:** Always use appropriate encoding for user-generated content:

```isml
<!-- User input: ALWAYS encode -->
<isprint value="${pdict.userComment}" encoding="on"/>

<!-- Context-specific encoding -->
<div data-comment="<isprint value="${pdict.userComment}" encoding="htmldoublequote"/>"></div>

<script>
  var comment = "<isprint value="${pdict.userComment}" encoding="jsblock"/>";
</script>
```

### Trusted Content vs User Input

Distinguish between trusted content and user input:

```isml
<!-- Trusted: CMS content (can disable encoding) -->
<isprint value="${pdict.contentAsset.body}" encoding="off"/>

<!-- User input: MUST encode -->
<isprint value="${pdict.searchQuery}" encoding="on"/>

<!-- User input in URL: Use uricomponent -->
<a href="?q=<isprint value="${pdict.searchQuery}" encoding="uricomponent"/>">
```

## Related Elements

- **`<isset>`** - Set variables that can be used with `<isprint>`
- **`<isif>`** - Conditionally print values
- **`<isloop>`** - Print values in loops
- **`<isscript>`** - Calculate expressions to be printed

## Related APIs

- **`dw.util.StringUtils`** - String utility methods including encoding
- **`dw.web.URLUtils`** - URL generation and encoding
- **`dw.util.SecureEncoder`** - Context-specific encoding methods
- **`dw.value.Money`** - Money value type
- **`dw.util.Calendar`** - Date and time handling

## See Also

- [ISML Expression Syntax](./expressions.md)
- [StringUtils Class](../dw_util/StringUtils.md)
- [SecureEncoder Class](../dw_util/SecureEncoder.md)
- [Money Class](../dw_value/Money.md)
- [B2C Commerce Security Best Practices](../best-practices/security.md)
