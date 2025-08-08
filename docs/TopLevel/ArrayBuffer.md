## Package: TopLevel

# Class ArrayBuffer

## Inheritance Hierarchy

- Object
  - ArrayBuffer

## Description

The ArrayBuffer represents a generic array of bytes with fixed length. To access and manipulate content, use DataView or a typed array.

## Properties

### byteLength

**Type:** Number

The number of bytes in the array buffer.

## Constructor Summary

ArrayBuffer() Creates an empty array buffer.

ArrayBuffer(byteLength : Number) Creates an array buffer with the given number of bytes.

## Method Summary

### isView

**Signature:** `static isView(object : Object) : boolean`

Returns if the given object is one of the views for an ArrayBuffer, such as a typed array or a DataView.

### slice

**Signature:** `slice(begin : Number, end : Number) : ArrayBuffer`

Returns a new array buffer with a copy of the data of this buffer.

## Constructor Detail

## Method Detail

## Method Details

### isView

**Signature:** `static isView(object : Object) : boolean`

**Description:** Returns if the given object is one of the views for an ArrayBuffer, such as a typed array or a DataView.

**Parameters:**

- `object`: The object to check.

**Returns:**

true if the passed object is a view to an array buffer else return false.

---

### slice

**Signature:** `slice(begin : Number, end : Number) : ArrayBuffer`

**Description:** Returns a new array buffer with a copy of the data of this buffer.

**Parameters:**

- `begin`: Optional. The first included element.
- `end`: Optional. The index of the end. This element is not included.

**Returns:**

The new array object.

---