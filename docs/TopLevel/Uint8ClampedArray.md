## Package: TopLevel

# Class Uint8ClampedArray

## Inheritance Hierarchy

- Object
  - Uint8ClampedArray

## Description

An optimized array to store 8-bit unsigned integer numbers. If a value outside of the range 0-255 is attempted to be set, either 0 or 255 is set instead. Elements of this array are stored in an ArrayBuffer object.

## Constants

### BYTES_PER_ELEMENT

**Type:** Number = 1

Number value of the element size.

## Properties

### buffer

**Type:** ArrayBuffer

The array buffer referenced by this typed array.

### byteLength

**Type:** Number

The number of bytes in the array buffer used by this typed array.

### byteOffset

**Type:** Number

The start offset for this typed array within the array buffer.

### length

**Type:** Number

The number of elements.

## Constructor Summary

Uint8ClampedArray() Creates an empty array.

Uint8ClampedArray(length : Number) Creates an array with the given element count.

Uint8ClampedArray(typedArray : Object) Creates an array as a copy of the passed typed array.

Uint8ClampedArray(array : Array) Creates an array as a copy of the passed array.

Uint8ClampedArray(buffer : ArrayBuffer, byteOffset : Number, length : Number) Creates a typed array as a view on the given ArrayBuffer.

## Method Summary

### get

**Signature:** `get(index : Number) : Number`

Returns the value at the specified index.

### set

**Signature:** `set(values : Object, offset : Number) : void`

Copies all values from the source array into this typed array.

### subarray

**Signature:** `subarray(begin : Number, end : Number) : Uint8ClampedArray`

Returns a new array object based on the same ArrayBuffer store.

## Constructor Detail

## Method Detail

## Method Details

### get

**Signature:** `get(index : Number) : Number`

**Description:** Returns the value at the specified index. Note: This is not ECMAScript standard. Use array element access syntax for single value access.

**Parameters:**

- `index`: The index to use.

**Returns:**

The value at the specified index.

---

### set

**Signature:** `set(values : Object, offset : Number) : void`

**Description:** Copies all values from the source array into this typed array.

**Parameters:**

- `values`: The source values. Can be an array or a typed array.
- `offset`: Optional. Target offset.

---

### subarray

**Signature:** `subarray(begin : Number, end : Number) : Uint8ClampedArray`

**Description:** Returns a new array object based on the same ArrayBuffer store.

**Parameters:**

- `begin`: Optional. The first included element.
- `end`: Optional. The index of the end. This element is not included.

**Returns:**

The new array object.

---