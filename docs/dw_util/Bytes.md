## Package: dw.util

# Class Bytes

## Inheritance Hierarchy

- Object
  - dw.util.Bytes

## Description

A simple immutable class representing an array of bytes, used for working with binary data in a scripting context. It acts as a view to ArrayBuffer. The buffer can be accessed through asUint8Array(). Limitation: The size of the resulting byte representation is limited by the quota api.jsArrayBufferSize that is defining the max size for a ArrayBuffer.

## Constants

## Properties

### length

**Type:** Number (Read Only)

The number of bytes represented by this object.

## Constructor Summary

Bytes(arrayBufferOrView : Object) Construct a Bytes object from the given ArrayBuffer or view.

Bytes(string : String) Construct a Bytes object from the given string using the default encoding.

Bytes(string : String, encoding : String) Construct a Bytes object from the given string using the given encoding.

## Method Summary

### asUint8Array

**Signature:** `asUint8Array() : Object`

Returns a Uint8Array based on the ArrayBuffer used for this Bytes object.

### byteAt

**Signature:** `byteAt(index : Number) : Number`

Returns the value of the byte at position index as an integer.

### bytesAt

**Signature:** `bytesAt(index : Number, length : Number) : Bytes`

Return a new Bytes object containing the subsequence of this object's bytes specified by the index and length parameters.

### getLength

**Signature:** `getLength() : Number`

Returns the number of bytes represented by this object.

### intAt

**Signature:** `intAt(index : Number) : Number`

Absolute get method for reading a signed integer value (32 bit) in network byte order(= big endian).

### reverse

**Signature:** `reverse() : Bytes`

Return a new Bytes object which has the same bytes as this one in reverse order.

### shortAt

**Signature:** `shortAt(index : Number) : Number`

Absolute get method for reading a signed short value (16 bit) in network byte order(= big endian).

### toString

**Signature:** `toString() : String`

Constructs a new String by decoding this array of bytes using the default encoding.

### toString

**Signature:** `toString(encoding : String) : String`

Constructs a new String by decoding this array of bytes using the specified encoding.

## Constructor Detail

## Method Detail

## Method Details

### asUint8Array

**Signature:** `asUint8Array() : Object`

**Description:** Returns a Uint8Array based on the ArrayBuffer used for this Bytes object. Changes to the returned ArrayBuffer will be visible in the Bytes object.

**API Versioned:**

From version 21.2.

**Returns:**

A newly created Uint8Array based on the existing ArrayBuffer.

---

### byteAt

**Signature:** `byteAt(index : Number) : Number`

**Description:** Returns the value of the byte at position index as an integer. If index is out of range an exception is thrown. The byte is interpreted as signed and so the value returned will always be between -128 and +127.

**Parameters:**

- `index`: The index of the byte.

**Returns:**

The byte value at the specified index.

**Throws:**

IndexOutOfBoundsException - If the index argument is negative or not less than the length of this byte array.

---

### bytesAt

**Signature:** `bytesAt(index : Number, length : Number) : Bytes`

**Description:** Return a new Bytes object containing the subsequence of this object's bytes specified by the index and length parameters. The returned object is a new view onto the same data, no data is copied.

**Parameters:**

- `index`: The initial index for the new view, inclusive.
- `length`: The number of bytes visible in the new view.

**Returns:**

a new Bytes object representing a subsequence of this Bytes object.

**Throws:**

ArrayIndexOutOfBoundsException - If index < 0 or index > getLength() or index + length > getLength()
IllegalArgumentException - If length < 0

---

### getLength

**Signature:** `getLength() : Number`

**Description:** Returns the number of bytes represented by this object.

**Returns:**

The number of bytes.

---

### intAt

**Signature:** `intAt(index : Number) : Number`

**Description:** Absolute get method for reading a signed integer value (32 bit) in network byte order(= big endian).

**Parameters:**

- `index`: The byte index at which to read the number.

**Returns:**

The read number.

**Throws:**

IndexOutOfBoundsException - If index is negative or not smaller than the number of bytes minus three.

---

### reverse

**Signature:** `reverse() : Bytes`

**Description:** Return a new Bytes object which has the same bytes as this one in reverse order.

**Returns:**

a new Bytes object representing the reverse of this Bytes object.

---

### shortAt

**Signature:** `shortAt(index : Number) : Number`

**Description:** Absolute get method for reading a signed short value (16 bit) in network byte order(= big endian).

**Parameters:**

- `index`: The byte index at which to read the number.

**Returns:**

The read number.

**Throws:**

IndexOutOfBoundsException - If index is negative or not smaller than the number of bytes minus one.

---

### toString

**Signature:** `toString() : String`

**Description:** Constructs a new String by decoding this array of bytes using the default encoding. Convenience for toString( "UTF-8" ). Limitation: The method is protected by the quota api.jsStringLength that prevents creation of too long strings.

**Returns:**

A String representing the decoded array of bytes.

---

### toString

**Signature:** `toString(encoding : String) : String`

**Description:** Constructs a new String by decoding this array of bytes using the specified encoding. Limitation: The method is protected by the quota api.jsStringLength that prevents creation of too long strings.

**Parameters:**

- `encoding`: The name of a supported encoding.

**Returns:**

A String representing the decoded array of bytes.

**Throws:**

IllegalArgumentException - If the named encoding is not supported.

---