# Class QueryString

## Inheritance Hierarchy

- Object
  - sfra.models.QueryString

## Description

The SFRA QueryString class is a specialized utility for parsing and managing URL query string parameters in SFCC applications. This class provides enhanced functionality beyond basic query string parsing by handling SFCC-specific parameter formats including product variants (`dwvar_`), product options (`dwopt_`), and search preferences (`pref`). The QueryString class automatically organizes these parameters into structured objects, handles URL encoding/decoding, manages duplicate parameters as arrays, and provides serialization back to query string format. It serves as the primary interface for working with URL parameters in SFRA controllers and templates.

## Properties

### variables

**Type:** Object

Object containing product variant information parsed from `dwvar_` parameters.

### options

**Type:** Array

Array of product option objects parsed from `dwopt_` parameters.

### preferences

**Type:** Object

Object containing search preference filters parsed from `pref` parameters.

### [parameterName]

**Type:** String | Array

Dynamic properties containing standard query parameters. Duplicate parameters are automatically converted to arrays.

## Constructor Summary

### QueryString

**Signature:** `QueryString(raw)`

Creates a new QueryString object by parsing the provided raw query string.

**Parameters:**
- `raw` (String) - Raw query string to parse

## Method Summary

### toString

**Signature:** `toString() : String`

Serializes the QueryString object back to a URL-encoded query string format.

## Constructor Detail

### QueryString

**Signature:** `QueryString(raw)`

**Description:** Parses a raw query string and organizes parameters into structured objects. Handles SFCC-specific parameter formats and automatically processes URL encoding.

**Parameters:**
- `raw` (String) - The raw query string to parse, may include the leading `?`

**Processing Logic:**
- Extracts and parses `dwvar_` parameters into the `variables` object
- Extracts and parses `dwopt_` parameters into the `options` array
- Extracts and parses `pref` parameters into the `preferences` object
- Handles duplicate parameters by converting them to arrays
- Performs URL decoding on all parameter values

## Method Detail

### toString

**Signature:** `toString() : String`

**Description:** Converts the QueryString object back to a properly formatted and URL-encoded query string. Maintains the original SFCC parameter format conventions.

**Returns:**
String containing the URL-encoded query string without the leading `?`.

**Output Format:**
- `dwvar_` parameters for product variants
- `dwopt_` parameters for product options
- `prefn`/`prefv`/`prefmin`/`prefmax` parameters for search preferences
- Standard parameters for all other values
- Results are sorted alphabetically

## Property Details

### variables

**Type:** Object

**Description:** Contains product variant information parsed from `dwvar_` prefixed parameters. Each variant is represented as:

```javascript
{
  "variantAttributeName": {
    id: "productId",
    value: "selectedVariantValue"
  }
}
```

**Example:**
```javascript
// From: dwvar_123456_color=Red&dwvar_123456_size=Large
variables: {
  "color": { id: "123456", value: "Red" },
  "size": { id: "123456", value: "Large" }
}
```

### options

**Type:** Array

**Description:** Contains product option selections parsed from `dwopt_` prefixed parameters. Each option is represented as:

```javascript
{
  optionId: "optionIdentifier",
  selectedValueId: "selectedOptionValue", 
  productId: "associatedProductId"
}
```

**Example:**
```javascript
// From: dwopt_123456_warranty=extended&dwopt_123456_installation=yes
options: [
  { optionId: "warranty", selectedValueId: "extended", productId: "123456" },
  { optionId: "installation", selectedValueId: "yes", productId: "123456" }
]
```

### preferences

**Type:** Object

**Description:** Contains search refinement preferences parsed from `pref` prefixed parameters. Supports both single values and min/max ranges:

**Single Value Format:**
```javascript
{
  "attributeName": "value"
}
```

**Range Value Format:**
```javascript
{
  "attributeName": {
    min: "minimumValue",
    max: "maximumValue"
  }
}
```

**Example:**
```javascript
// From: prefn1=color&prefv1=Blue&prefn2=price&prefmin2=10&prefmax2=50
preferences: {
  "color": "Blue",
  "price": { min: "10", max: "50" }
}
```

## Parameter Handling Details

### SFCC-Specific Parameters

**Product Variants (`dwvar_`):**
- Format: `dwvar_{productId}_{variantAttribute}={value}`
- Underscores in product IDs are encoded as double underscores (`__`)
- Parsed into the `variables` object with product ID and attribute mappings

**Product Options (`dwopt_`):**
- Format: `dwopt_{productId}_{optionId}={selectedValueId}`
- Underscores in product IDs are encoded as double underscores (`__`)
- Parsed into the `options` array with structured option data

**Search Preferences (`pref`):**
- Single values: `prefn{index}={name}&prefv{index}={value}`
- Range values: `prefn{index}={name}&prefmin{index}={min}&prefmax{index}={max}`
- Parsed into the `preferences` object with appropriate structure

### Standard Parameters

**Regular Query Parameters:**
- Standard URL parameters are stored as properties on the QueryString object
- Duplicate parameters are automatically converted to arrays
- All values are URL decoded

### URL Encoding Handling

**Automatic Processing:**
- Input parameters are automatically URL decoded during parsing
- Output via `toString()` is automatically URL encoded
- Spaces are handled correctly (+ symbols converted to %20)
- Special characters are properly encoded/decoded

## Usage Examples

### Basic Parsing
```javascript
var qs = new QueryString('?color=red&size=large&category=shoes');
// qs.color === 'red'
// qs.size === 'large' 
// qs.category === 'shoes'
```

### Product Variants
```javascript
var qs = new QueryString('?dwvar_123456_color=Blue&dwvar_123456_size=Medium');
// qs.variables.color.id === '123456'
// qs.variables.color.value === 'Blue'
```

### Search Preferences
```javascript
var qs = new QueryString('?prefn1=color&prefv1=Red&prefn2=price&prefmin2=10&prefmax2=100');
// qs.preferences.color === 'Red'
// qs.preferences.price.min === '10'
// qs.preferences.price.max === '100'
```

### Serialization
```javascript
var qs = new QueryString('?color=red&size=large');
qs.brand = 'nike';
var newQuery = qs.toString(); // 'brand=nike&color=red&size=large'
```

---
