## Package: dw.crypto

# Class Encoding

## Inheritance Hierarchy

- Object
  - dw.crypto.Encoding

## Description

Utility class which handles several common character encodings.

## Constructor Summary

## Method Summary

### fromBase64

**Signature:** `static fromBase64(string : String) : Bytes`

Decode the given string which represents a sequence of characters encoded in base-64 to a byte array.

### fromHex

**Signature:** `static fromHex(string : String) : Bytes`

Converts a String representing hexadecimal values into an array of bytes of those same values.

### fromURI

**Signature:** `static fromURI(string : String) : String`

Decodes a URL safe string into its original form.

### fromURI

**Signature:** `static fromURI(string : String, encoding : String) : String`

Decodes a URL safe string into its original form using the specified encoding.

### toBase64

**Signature:** `static toBase64(bytes : Bytes) : String`

Convert the given byte array to a string encoded in base-64.

### toBase64URL

**Signature:** `static toBase64URL(bytes : Bytes) : String`

Convert the given byte array to a string encoded in base-64 for URLs.

### toHex

**Signature:** `static toHex(bytes : Bytes) : String`

Converts an array of bytes into a string representing the hexadecimal values of each byte in order.

### toURI

**Signature:** `static toURI(string : String) : String`

Encodes a string into its URL safe form according to the "application/x-www-form-urlencoded" encoding scheme using the default encoding.

### toURI

**Signature:** `static toURI(string : String, encoding : String) : String`

Encodes a string into its URL safe form according to the "application/x-www-form-urlencoded" encoding scheme using the specified encoding.

## Method Detail

## Method Details

### fromBase64

**Signature:** `static fromBase64(string : String) : Bytes`

**Description:** Decode the given string which represents a sequence of characters encoded in base-64 to a byte array. This operation supports both the base-64 and base-64 for URL formats. Characters not in the base-64 alphabet are ignored. An exception is thrown if a null value is passed. Note: This decoding operation is limited to the maximum number of bytes that a Bytes object can hold. See Bytes.

**Parameters:**

- `string`: A string consisting of characters in base-64 alphabet to decode.

**Returns:**

The decoded array of bytes.

---

### fromHex

**Signature:** `static fromHex(string : String) : Bytes`

**Description:** Converts a String representing hexadecimal values into an array of bytes of those same values. The returned byte array will be half the length of the passed, as it takes two characters to represent any given byte. An exception is thrown if the passed string has an odd number of character or if any characters in the string are not valid hexadecimal characters. An exception is thrown if a null value is passed. Note: This decoding operation is limited to the maximum number of bytes that a Bytes object can hold. See Bytes.

**Parameters:**

- `string`: A string containing only hex characters to decode.

**Returns:**

The decoded array of bytes.

---

### fromURI

**Signature:** `static fromURI(string : String) : String`

**Description:** Decodes a URL safe string into its original form. Escaped characters are converted back to their original representation. An exception is thrown if URL decoding is unsuccessful or if null is passed.

**Parameters:**

- `string`: The string to decode.

**Returns:**

The decoded string.

---

### fromURI

**Signature:** `static fromURI(string : String, encoding : String) : String`

**Description:** Decodes a URL safe string into its original form using the specified encoding. Escaped characters are converted back to their original representation. An exception is thrown if URL decoding is unsuccessful or if the specified encoding is unsupported or if null is passed for either argument.

**Parameters:**

- `string`: The string to decode.
- `encoding`: The name of a supported encoding.

**Returns:**

The decoded string.

---

### toBase64

**Signature:** `static toBase64(bytes : Bytes) : String`

**Description:** Convert the given byte array to a string encoded in base-64. This method does not chunk the data by adding line breaks. An exception is thrown if a null value is passed.

**Parameters:**

- `bytes`: The array of bytes to encode.

**Returns:**

The encoded string containing only Base64 characters.

---

### toBase64URL

**Signature:** `static toBase64URL(bytes : Bytes) : String`

**Description:** Convert the given byte array to a string encoded in base-64 for URLs. This method does not chunk the data by adding line breaks and it does not add any padding. An exception is thrown if a null value is passed.

**Parameters:**

- `bytes`: The array of bytes to encode.

**Returns:**

The encoded string containing only Base64URL characters.

---

### toHex

**Signature:** `static toHex(bytes : Bytes) : String`

**Description:** Converts an array of bytes into a string representing the hexadecimal values of each byte in order. The returned string will be double the length of the passed array, as it takes two characters to represent any given byte. An exception is thrown if a null value is passed.

**Parameters:**

- `bytes`: The array of bytes to encode.

**Returns:**

The encoded string containing only hex characters.

---

### toURI

**Signature:** `static toURI(string : String) : String`

**Description:** Encodes a string into its URL safe form according to the "application/x-www-form-urlencoded" encoding scheme using the default encoding. Unsafe characters are escaped. An exception is thrown if a null value is passed.

**Parameters:**

- `string`: The string to encode.

**Returns:**

The encoded string.

---

### toURI

**Signature:** `static toURI(string : String, encoding : String) : String`

**Description:** Encodes a string into its URL safe form according to the "application/x-www-form-urlencoded" encoding scheme using the specified encoding. Unsafe characters are escaped. An exception is thrown if the specified encoding is unsupported. An exception is thrown if either argument is null.

**Parameters:**

- `string`: The string to encode.
- `encoding`: The name of a supported encoding.

**Returns:**

The encoded string.

---