## Package: TopLevel

# Class RegExp

## Inheritance Hierarchy

- Object
  - RegExp

## Description

The RegExp object is a static object that generates instances of a regular expression for pattern matching and monitors all regular expressions in the current window or frame. Consult ECMA standards for the format of the pattern strings supported by these regular expressions.

## Properties

### global

**Type:** boolean

If the regular expression instance has the g modifier, then
 this property is set to true.

### ignoreCase

**Type:** boolean

If the regular expression instance has the i modifier, then
 this property is set to true.

### lastIndex

**Type:** Number

This is the zero-based index value of the character within the
 String where the next search for the pattern begins. In a new
 search, the value is zero.

### multiline

**Type:** boolean

If a search extends across multiple lines of test, the multiline
 property is set to true.

### source

**Type:** String

A String version of the characters used to create the regular
 expression. The value does not include the forward slash delimiters that
 surround the expression.

## Constructor Summary

RegExp(pattern : String) Constructs the regular expression using the specified pattern.

RegExp(pattern : String, attributes : String) Constructs the regular expression using the specified pattern and attributes.

## Method Summary

### exec

**Signature:** `exec(string : String) : Array`

Performs a search through the specified parameter for the current regular expression and returns an array of match information if successful.

### test

**Signature:** `test(string : String) : boolean`

Returns true if there is a match of the regular expression anywhere in the specified parameter.

## Constructor Detail

## Method Detail

## Method Details

### exec

**Signature:** `exec(string : String) : Array`

**Description:** Performs a search through the specified parameter for the current regular expression and returns an array of match information if successful. Returns null if the search produces no results.

**Parameters:**

- `string`: the String to apply the regular expression.

**Returns:**

an array of match information if successful, null otherwise.

---

### test

**Signature:** `test(string : String) : boolean`

**Description:** Returns true if there is a match of the regular expression anywhere in the specified parameter. No additional information is available about the results of the search.

**Parameters:**

- `string`: the String to apply the regular expression.

**Returns:**

true if there is a match of the regular expression anywhere in the specified parameter, false otherwise.

---