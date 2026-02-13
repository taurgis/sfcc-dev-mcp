# ISML Utility Objects & Expressions Reference

Reference for built-in template utilities and expression syntax.

## Top-Level Variables

The template scope automatically exposes:

- `pdict` - Pipeline Dictionary (controller data)
- `out` - Output stream
- `request` - Current request object
- `session` - Current session object

## dw.system.Request Methods

| Method | Description |
|--------|-------------|
| `getHttpCookies()` → `Cookies` | Returns cookies object |
| `getHttpHeaders()` → `Map` | Returns HTTP header values |
| `isHttpSecure()` → `Boolean` | Whether request is HTTPS |
| `isSCAPI()` → `Boolean` | Distinguishes OCAPI vs SCAPI |

**Example:**
```html
<isprint value="${request.custom.Container.adjustedMerchandiseTotalNetPrice}" />
```

## dw.system.Session Methods

| Method | Description |
|--------|-------------|
| `getCustomer()` → `Customer` | Current customer (null in BM) |
| `isCustomerAuthenticated()` → `Boolean` | Whether customer is authenticated |

**Example:**
```html
<isprint value="${session.getCustomer().firstname}" />
```

## dw.util.StringUtils

Pre-imported, call by simple name:

| Method | Description |
|--------|-------------|
| `formatDate(date)` | Format with site's default date format |
| `formatInteger(number)` | Format with site's integer format |
| `formatNumber(number)` | Format with site's number format |
| `garble(str, replaceChar, suffixLength)` | Mask string leaving suffix |
| `pad(str, width)` | Pad string to target width |
| `stringToHtml(str)` | Convert to HTML-safe |
| `stringToXml(str)` | Convert to XML-safe |
| `trim(str)` | Remove leading/trailing whitespace |
| `truncate(str, maxLength, mode, suffix)` | Truncate text with suffix |

**Example:**
```html
<isprint value="${StringUtils.pad('abc', 5)}" />
${StringUtils.truncate(description, 100, '...')}
```

## dw.web.URLUtils

Pre-imported for URL generation:

| Method | Description |
|--------|-------------|
| `abs(action, ...params)` | Absolute URL from calling request |
| `http(action, ...params)` | Absolute HTTP URL |
| `https(action, ...params)` | Absolute HTTPS URL |
| `httpsWebRoot()` | HTTPS web root for static assets |
| `httpWebRoot()` | HTTP web root for static assets |
| `url(action, ...params)` | Relative URL |
| `webRoot()` | Relative web root |
| `staticURL(path)` | Static resource URL |
| `continueURL()` | Continue URL for form action |

**Examples:**
```html
<a href="${URLUtils.url('Product-Show', 'pid', product.ID)}">View</a>
<a href="${URLUtils.https('Account-Show')}">My Account</a>
<img src="${URLUtils.staticURL('/images/logo.png')}" alt="Logo"/>

<form action="${URLUtils.continueURL()}" method="post">
```

## Resource (Localization)

```html
<!-- Simple message -->
${Resource.msg('button.addtocart', 'product', null)}

<!-- With parameters -->
${Resource.msgf('cart.items', 'cart', null, cartCount)}
```

## Expression Syntax

### Basics

- **Syntax**: `${ ... }`
- **Scope**: Evaluates in template context (`pdict`, `request`, `session`)

### Common Patterns

```html
<!-- Property access -->
${pdict.product.name}
${pdict.product.price.sales.value}

<!-- Method calls -->
${product.getAvailabilityModel().isInStock()}

<!-- Session data -->
${session.customer.firstName}

<!-- Request params -->
${request.httpParameterMap.pid.stringValue}

<!-- Operators -->
${price > 100 ? 'expensive' : 'affordable'}
${firstName + ' ' + lastName}
${quantity * unitPrice}
```

### Quick Reference

| Expression | Description |
|------------|-------------|
| `${pdict.Product}` | Current product object |
| `${pdict.Content.template}` | Content asset template |
| `${pdict.ProductPrices}` | Product prices structure |
| `${pdict.Order.orderNo}` | Order number |

## Protected Strings

The literal string `</body>` is reserved by ISML parser. Obfuscate if needed:

```javascript
var endBodyIndex = markup.indexOf('</bo' + 'dy>');
```

## dw.util.SecureEncoder

For context-specific encoding:

```html
<isscript>
    var SecureEncoder = require('dw/util/SecureEncoder');
</isscript>

<!-- JavaScript context -->
<script>
    var searchTerm = "${SecureEncoder.forJavaScript(pdict.searchPhrase)}";
</script>

<!-- HTML attribute -->
<input type="hidden" value="${SecureEncoder.forHTMLAttribute(pdict.token)}" />
```
