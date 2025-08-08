## Package: TopLevel

# Class JSON

## Inheritance Hierarchy

- Object
  - JSON

## Description

The JSON object is a single object that contains two functions, parse and stringify, that are used to parse and construct JSON texts. The JSON Data Interchange Format is described in RFC 4627.

## Constructor Summary

JSON()

## Method Summary

### parse

**Signature:** `static parse(json : String) : Object`

The parse function parses a JSON text (a JSON formatted string) and produces an ECMAScript value.

### parse

**Signature:** `static parse(json : String, reviver : Function) : Object`

The parse function parses a JSON text (a JSON formatted string) and produces an ECMAScript value.

### stringify

**Signature:** `static stringify(value : Object) : String`

The stringify function produces a JSON formatted string that captures information from a JavaScript value.

### stringify

**Signature:** `static stringify(value : Object, replacer : Object) : String`

The stringify function produces a JSON formatted string that captures information from a JavaScript value.

### stringify

**Signature:** `static stringify(value : Object, replacer : Object, space : Number) : String`

The stringify function produces a JSON formatted string that captures information from a JavaScript value.

### stringify

**Signature:** `static stringify(value : Object, replacer : Object, space : String) : String`

The stringify function produces a JSON formatted string that captures information from a JavaScript value.

## Constructor Detail

## Method Detail

## Method Details

### parse

**Signature:** `static parse(json : String) : Object`

**Description:** The parse function parses a JSON text (a JSON formatted string) and produces an ECMAScript value. The JSON format is a restricted form of ECMAScript literal. JSON objects are realized as ECMAScript objects. JSON Arrays are realized as ECMAScript arrays. JSON strings, numbers, booleans, and null are realized as ECMAScript strings, numbers, booleans, and null.

**Parameters:**

- `json`: a JSON formatted string

**Returns:**

the object produced from the JSON string

---

### parse

**Signature:** `static parse(json : String, reviver : Function) : Object`

**Description:** The parse function parses a JSON text (a JSON formatted string) and produces an ECMAScript value. The JSON format is a restricted form of ECMAScript literal. JSON objects are realized as ECMAScript objects. JSON Arrays are realized as ECMAScript arrays. JSON strings, numbers, booleans, and null are realized as ECMAScript strings, numbers, booleans, and null. The optional reviver parameter is a function that takes two parameters, (key, value). It can filter and transform the results. It is called with each of the key/value pairs produced by the parse, and its return value is used instead of the original value. If it returns what it received, the structure is not modified. If it returns undefined then the member is deleted from the result.

**Parameters:**

- `json`: a JSON formatted string
- `reviver`: a function, which is called with each key, value pair during parsing

**Returns:**

the object produced from the JSON string

---

### stringify

**Signature:** `static stringify(value : Object) : String`

**Description:** The stringify function produces a JSON formatted string that captures information from a JavaScript value. The value parameter is a JavaScript value is usually an object or array, although it can also be a string, boolean, number or null. Note: Stringifying API objects is not supported.

**Parameters:**

- `value`: the value which is stringified

**Returns:**

the JSON string

---

### stringify

**Signature:** `static stringify(value : Object, replacer : Object) : String`

**Description:** The stringify function produces a JSON formatted string that captures information from a JavaScript value. The value parameter is a JavaScript value is usually an object or array, although it can also be a string, boolean, number or null. The optional replacer parameter is either a function that alters the way objects and arrays are stringified, or an array of strings that acts as an allowlist for selecting the keys that will be stringified. Note: Stringifying API objects is not supported.

**Parameters:**

- `value`: the value which is stringified
- `replacer`: either a function, which is called with a key and value as parameter, or an array with an allowlist

**Returns:**

the JSON string

---

### stringify

**Signature:** `static stringify(value : Object, replacer : Object, space : Number) : String`

**Description:** The stringify function produces a JSON formatted string that captures information from a JavaScript value. The value parameter is a JavaScript value is usually an object or array, although it can also be a string, boolean, number or null. The optional replacer parameter is either a function that alters the way objects and arrays are stringified, or an array of strings that acts as an allowlist for selecting the keys that will be stringified. The optional space parameter is a string or number that allows the result to have white space injected into it to improve human readability. Note: Stringifying API objects is not supported.

**Parameters:**

- `value`: the value which is stringified
- `replacer`: either a function, which is called with a key and value as parameter, or an array with an allowlist
- `space`: the number of space for indenting

**Returns:**

the JSON string

---

### stringify

**Signature:** `static stringify(value : Object, replacer : Object, space : String) : String`

**Description:** The stringify function produces a JSON formatted string that captures information from a JavaScript value. The value parameter is a JavaScript value is usually an object or array, although it can also be a string, boolean, number or null. The optional replacer parameter is either a function that alters the way objects and arrays are stringified, or an array of strings that acts as an allowlist for selecting the keys that will be stringified. The optional space parameter is a string or number that allows the result to have white space injected into it to improve human readability. Note: Stringifying API objects is not supported.

**Parameters:**

- `value`: the value which is stringified
- `replacer`: either a function, which is called with a key and value as parameter, or an array with an allowlist
- `space`: a string for indentation

**Returns:**

the JSON string

---