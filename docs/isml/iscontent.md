# ISML iscontent Element

## Overview

The `<iscontent>` element modifies the HTTP header of the generated output stream sent to the browser or email client. It controls the MIME type, character encoding, output encoding behavior, and HTML compacting for the template. This element provides fine-grained control over how content is transmitted and rendered by controlling the Content-Type HTTP header and output processing.

**Performance Impact:** The `compact` attribute removes unnecessary whitespace from output, reducing file size and transmission time to clients.

## Syntax

```isml
<iscontent
  type     = MIME_type                              // optional
  charset  = char_set                               // optional
  encoding = "on" | "off" | "html" | "xml" | "wml"  // optional
  compact  = "true" | "false"                       // optional
/>
```

## Attributes

### type

**Type:** String or Expression  
**Optional:** Yes  
**Default:** `"text/html"`

Specifies the MIME type of the generated output stream, identifying the type of content being sent to the client.

**Common MIME Types:**
- `text/html` - HTML documents (default for storefront pages)
- `text/plain` - Plain text (email output)
- `application/json` - JSON data
- `application/xml` - XML documents
- `text/xml` - XML text

**Dynamic Content Types:** You can use an expression to set the MIME type dynamically based on runtime conditions.

**Important:** The encoding can be set explicitly using the `charset` attribute or determined implicitly from the content type.

```isml
<!-- Default HTML content -->
<iscontent type="text/html"/>

<!-- Plain text for email -->
<iscontent type="text/plain"/>

<!-- JSON response -->
<iscontent type="application/json"/>

<!-- Dynamic content type -->
<isscript>
  pdict.contentType = 'application/xml';
</isscript>
<iscontent type="${pdict.contentType}"/>
```

**Automatic Setting:** In most cases, you don't need to set the type because it's done automatically by the node or pipelet that calls the template:

| Node/Pipelet | Default MIME Type |
|--------------|-------------------|
| Interaction-continue or interaction-end node | `text/html` |
| SendMail pipelet | `text/plain` |
| dw.net.Mail (script in script node) | `text/plain` |

### charset

**Type:** String  
**Optional:** Yes  
**Default:** UTF-8  
**Expressions:** Not allowed

Defines the character set of the output stream, specifying how characters are encoded in the response.

**Important:**
- The default encoding is UTF-8 and **should not be changed** unless absolutely necessary
- UTF-8 supports all languages and special characters
- Changing charset can cause character rendering issues for international content

**Common Character Sets:**
- `UTF-8` - Universal character encoding (default, recommended)
- `ISO-8859-1` - Western European characters
- `US-ASCII` - Basic ASCII characters

```isml
<!-- Use default UTF-8 (recommended) -->
<iscontent type="text/html"/>

<!-- Explicitly set UTF-8 -->
<iscontent type="text/html" charset="UTF-8"/>

<!-- Legacy Western European encoding -->
<iscontent type="text/html" charset="ISO-8859-1"/>
```

### encoding

**Type:** String  
**Allowed Values:** `"on"`, `"off"`, `"html"`, `"xml"`, `"wml"`  
**Optional:** Yes  
**Default:** `"html"`

Controls how special characters in the output stream are encoded to prevent syntax conflicts.

**Encoding converts characters that could cause syntax conflicts:**
- Ampersand (`&`) → `&amp;` in HTML/XML
- Less than (`<`) → `&lt;`
- Greater than (`>`) → `&gt;`
- Quotes (`"`) → `&quot;`

**Values:**

- **`"on"`** - Turns on encoding for the output stream (uses charset to determine encoding)
- **`"off"`** - Turns off encoding for the output stream (use with caution)
- **`"html"`** - Turns on encoding and specifies HTML encoding type (default)
- **`"xml"`** - Turns on encoding and specifies XML encoding type
- **`"wml"`** - Turns on encoding and specifies WML encoding type

**Scope:** All data processed after the first occurrence of the `<iscontent/>` tag is affected by this setting.

```isml
<!-- HTML encoding (default) -->
<iscontent encoding="html"/>

<!-- XML encoding -->
<iscontent type="application/xml" encoding="xml"/>

<!-- Disable encoding (use carefully) -->
<iscontent encoding="off"/>

<!-- Explicitly enable encoding -->
<iscontent encoding="on"/>
```

**See Also:** For encoding individual expressions, see the `encoding` attribute in `<isprint>`.

### compact

**Type:** Boolean  
**Allowed Values:** `"true"`, `"false"`  
**Optional:** Yes  
**Default:** `"true"`  
**Expressions:** Not allowed

Controls whether unnecessary whitespace is removed from the HTML output to reduce file size and transmission time.

**How Compacting Works:**
- Removes extra spaces, tabs, and newlines that don't affect visual appearance
- Reduces file size and page load time
- Preserves whitespace in `<pre>` tags when used with dynamic expressions
- Applied during template conversion process

**Important:**
- Compacting is **ON by default** (you don't need to set it explicitly)
- Cannot be toggled within the template (single setting per template)
- Not applied to templates included via `<isinclude/>`—must be set in each template
- May not work properly with HTML tags that use formatted content (like `<pre>`)

```isml
<!-- Compact enabled (default) -->
<iscontent compact="true"/>

<!-- Same as above (compact is on by default) -->
<iscontent/>

<!-- Disable compacting (rare, hurts performance) -->
<iscontent compact="false"/>
```

## Purpose

The `<iscontent>` element serves multiple purposes:

1. **HTTP Header Control:** Sets the Content-Type header to specify MIME type and character encoding
2. **Character Encoding:** Ensures proper character encoding for internationalization
3. **Output Encoding:** Prevents syntax conflicts by encoding special characters
4. **Performance Optimization:** Reduces file size through whitespace compacting
5. **Email Configuration:** Configures proper content type for email templates

## Compacting Behavior

### Before Compacting

```html
<table>
  <tr>
    <td>Some text here</td>
    <td>More text here</td>
    <td>text</td>
  </tr>
</table>
```

### After Compacting

```html
<table><tr><td>Some text here</td><td>More text here</td><td>text</td></tr></table>
```

**Performance Benefit:** Whitespace compression reduces file size, potentially reducing page transmission time to clients.

### Compacting Limitations

**HTML Tags with Formatted Content:** Tags like `<pre>` might not appear properly in compacted templates.

```isml
<!-- Bad: Formatted content in compacted template -->
<iscontent compact="true"/>
<pre>
  This is formatted text with     extra spaces.
</pre>

<!-- Good: Use dynamic expressions to preserve whitespace -->
<iscontent compact="true"/>
<pre><isprint value="${' This is formatted text with     extra spaces.'}" encoding="off"/></pre>
```

**Preserving Spaces in Attributes:**

```isml
<!-- Bad: Spaces may be removed in compacted template -->
<iscontent compact="true"/>
<input type="submit" name=" Button " />

<!-- Good: Use dynamic expressions to preserve spaces -->
<iscontent compact="true"/>
<input type="submit" name="${' Button '}" />
```

## Content-Type Header Examples

The following table shows the resulting `Content-Type` HTTP header for different attribute combinations:

| `<iscontent>` Usage | Resulting Content-Type | Notes |
|---------------------|------------------------|-------|
| `<iscontent type="text/html" charset="ISO-8859-1"/>` | `text/html;charset=ISO-8859-1` | Explicit type and charset |
| `<iscontent type="text/html"/>` | `text/html;charset=UTF-8` | Default charset is UTF-8 |
| `<iscontent type="plain"/>` | `plain;charset=UTF-8` | Default charset is UTF-8 |
| `<isscript>pdict.ContentType='text/html';</isscript>`<br>`<iscontent type="${pdict.ContentType}" charset="ISO-8859-1"/>` | `text/html;charset=ISO-8859-1` | Dynamic type with explicit charset |
| `<isscript>pdict.ContentType='text/html';</isscript>`<br>`<iscontent type="${pdict.ContentType}"/>` | `text/html;charset=UTF-8` | Dynamic type with default charset |
| `<iscontent charset="UTF-8"/>` | `text/html;charset=UTF-8` | Default type is `text/html` |
| `<iscontent compact="true"/>` | `text/html;charset=UTF-8` | All defaults apply |
| `<iscontent/>` | `text/html;charset=UTF-8` | All defaults apply |

## Common Use Cases

### Standard HTML Page

```isml
<iscontent type="text/html" charset="UTF-8"/>
<!DOCTYPE html>
<html>
<head>
  <title>Product Details</title>
</head>
<body>
  <h1>${pdict.Product.name}</h1>
</body>
</html>
```

### Email Template

```isml
<iscontent type="text/plain" charset="UTF-8"/>
Dear ${pdict.Customer.profile.firstName},

Thank you for your order ${pdict.Order.orderNo}.

Best regards,
Customer Service Team
```

### JSON Response

```isml
<iscontent type="application/json" encoding="off"/>
{
  "success": true,
  "productId": "${pdict.Product.ID}",
  "name": "${pdict.Product.name}"
}
```

### XML Response

```isml
<iscontent type="application/xml" encoding="xml"/>
<?xml version="1.0" encoding="UTF-8"?>
<product>
  <id>${pdict.Product.ID}</id>
  <name>${pdict.Product.name}</name>
</product>
```

### Performance-Optimized HTML

```isml
<!-- Compacting enabled for reduced file size -->
<iscontent type="text/html" compact="true"/>
<!DOCTYPE html>
<html>
<head>
  <title>Fast Loading Page</title>
</head>
<body>
  <div class="content">
    ${pdict.content}
  </div>
</body>
</html>
```

### Dynamic Content Type

```isml
<isscript>
  // Determine content type based on request
  var ContentType = require('dw/system/ContentType');
  var format = request.httpParameterMap.format.stringValue;
  
  var contentType;
  if (format === 'json') {
    contentType = 'application/json';
  } else if (format === 'xml') {
    contentType = 'application/xml';
  } else {
    contentType = 'text/html';
  }
</isscript>
<iscontent type="${contentType}" charset="UTF-8"/>
```

### Plain Text Email with Compacting

```isml
<iscontent type="text/plain" charset="UTF-8" compact="true"/>
Order Confirmation

Order Number: ${pdict.Order.orderNo}
Order Date: ${pdict.Order.creationDate}

Thank you for your purchase!
```

## Rules and Best Practices

### Placement Requirements

⚠️ **CRITICAL:** The `<iscontent/>` tag should **always be first** in an ISML template.

**Why:** If text appears in the template before the `<iscontent/>` tag (either directly or through a script containing `out.print()` statements), the type and charset specified in the tag cannot be guaranteed to take effect.

```isml
<!-- Good: iscontent first -->
<iscontent type="text/html" charset="UTF-8"/>
<!DOCTYPE html>
<html>
...
</html>

<!-- Bad: Content before iscontent -->
Some text here
<iscontent type="text/html"/>  <!-- TOO LATE -->
<!DOCTYPE html>
...

<!-- Bad: Script output before iscontent -->
<isscript>
  var x = "value";
  // out.print() outputs before iscontent
</isscript>
<iscontent type="text/html"/>  <!-- TOO LATE -->
```

### Default Behavior

- **No `<iscontent>` tag:** Default is `text/html` with `UTF-8` charset and HTML encoding
- **Empty tag:** `<iscontent/>` applies all defaults (same as no tag, but makes intent explicit)
- **Compacting:** Enabled by default—you must explicitly disable it with `compact="false"`

### Character Encoding Recommendations

- **Always use UTF-8** unless you have a specific legacy requirement
- UTF-8 supports all languages and special characters
- Changing charset can cause rendering issues for international storefronts
- UTF-8 is the web standard and expected by modern browsers

### Compacting Recommendations

- **Keep compacting enabled** (default) for performance
- Only disable compacting if you have specific formatting requirements
- Use dynamic expressions to preserve whitespace in compacted templates
- Test formatted content (like `<pre>` tags) carefully in compacted templates

### Email Templates

```isml
<!-- Standard email template setup -->
<iscontent type="text/plain" charset="UTF-8"/>
```

For email templates:
- Use `text/plain` for plain text emails
- Use `text/html` for HTML emails
- Always specify charset explicitly
- Keep compacting enabled to reduce email size

### Encoding Best Practices

- Use `encoding="html"` (default) for HTML content
- Use `encoding="xml"` for XML/SOAP responses
- Use `encoding="off"` only when you need raw output (JSON, pre-encoded content)
- Never turn off encoding for user-generated content (security risk)

## Security Considerations

### XSS Prevention

When using `encoding="off"`, ensure that all output is properly sanitized to prevent Cross-Site Scripting (XSS) attacks:

```isml
<!-- Dangerous: encoding off with user input -->
<iscontent encoding="off"/>
${pdict.userInput}  <!-- XSS VULNERABILITY -->

<!-- Safe: Keep encoding on for user content -->
<iscontent encoding="html"/>
${pdict.userInput}  <!-- Automatically escaped -->
```

### Content Type Validation

When using dynamic content types, validate the type to prevent header injection attacks:

```isml
<isscript>
  var ContentType = require('dw/system/ContentType');
  
  // Whitelist allowed content types
  var allowedTypes = {
    'json': 'application/json',
    'xml': 'application/xml',
    'html': 'text/html'
  };
  
  var format = request.httpParameterMap.format.stringValue;
  var contentType = allowedTypes[format] || 'text/html';
</isscript>
<iscontent type="${contentType}"/>
```

## Troubleshooting

### Character Encoding Issues

**Problem:** Special characters appear as question marks or garbled text.

**Solution:**
```isml
<!-- Ensure UTF-8 charset is set -->
<iscontent type="text/html" charset="UTF-8"/>
```

### Whitespace Issues in Formatted Content

**Problem:** `<pre>` tags or formatted content lose whitespace.

**Solution:**
```isml
<!-- Use dynamic expressions to preserve whitespace -->
<iscontent compact="true"/>
<pre><isprint value="${formattedText}" encoding="off"/></pre>
```

### Content Type Not Taking Effect

**Problem:** The specified MIME type or charset doesn't apply.

**Solution:**
```isml
<!-- Move iscontent to the very first line -->
<iscontent type="text/html" charset="UTF-8"/>
<!-- No content or scripts before this line -->
```

### Email Rendering Issues

**Problem:** Email clients don't render content correctly.

**Solution:**
```isml
<!-- Use explicit content type for emails -->
<iscontent type="text/plain" charset="UTF-8"/>
<!-- or -->
<iscontent type="text/html" charset="UTF-8"/>
```

## Performance Optimization

### Maximize Compacting Benefits

```isml
<!-- Enable compacting for all production templates -->
<iscontent compact="true"/>

<!-- Template content with readable formatting -->
<div class="product">
  <h2>${product.name}</h2>
  <p>${product.description}</p>
</div>

<!-- Output is compacted automatically: -->
<!-- <div class="product"><h2>Product Name</h2><p>Description</p></div> -->
```

**Savings:** Compacting can reduce HTML file size by 15-30%, improving page load times.

### Caching Considerations

When using `<iscontent>`, be aware of caching implications:

```isml
<!-- Cached pages should have consistent content types -->
<iscache type="relative" hour="1"/>
<iscontent type="text/html" charset="UTF-8"/>
```

**Best Practice:** Don't use dynamic content types in cached templates—it can cause inconsistent caching behavior.

## Related Elements

- **`<isprint>`**: Controls encoding for individual expressions (see `encoding` attribute)
- **`<iscache>`**: Controls page caching behavior
- **`<isinclude>`**: Note that compacting is NOT applied to included templates

## Common Patterns

### API Endpoint Template

```isml
<iscontent type="application/json" encoding="off"/>
<isscript>
  var response = {
    success: true,
    data: pdict.data,
    timestamp: new Date().toISOString()
  };
</isscript>
${JSON.stringify(response)}
```

### HTML Email Template

```isml
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Confirmation</title>
</head>
<body>
  <h1>Thank you for your order!</h1>
  <p>Order Number: ${pdict.Order.orderNo}</p>
</body>
</html>
```

### XML Sitemap Template

```isml
<iscontent type="application/xml" encoding="xml" compact="true"/>
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <isloop items="${pdict.products}" var="product">
    <url>
      <loc>${URLUtils.https('Product-Show', 'pid', product.ID)}</loc>
      <lastmod>${product.lastModified}</lastmod>
    </url>
  </isloop>
</urlset>
```

### Conditional Content Type

```isml
<isscript>
  var acceptHeader = request.httpHeaders.get('accept');
  var isJson = acceptHeader && acceptHeader.indexOf('application/json') > -1;
  var contentType = isJson ? 'application/json' : 'text/html';
</isscript>
<iscontent type="${contentType}" charset="UTF-8"/>
```
