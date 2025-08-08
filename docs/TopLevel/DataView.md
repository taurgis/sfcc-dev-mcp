## Package: TopLevel

# Class DataView

## Inheritance Hierarchy

- Object
  - DataView

## Description

The DataView provides low level access to ArrayBuffer.

## Properties

### buffer

**Type:** ArrayBuffer

The array buffer referenced by this view.

### byteLength

**Type:** Number

The number of bytes in the array buffer used by this view.

### byteOffset

**Type:** Number

The start offset for this view within the array buffer.

## Constructor Summary

DataView(buffer : ArrayBuffer, byteOffset : Number, byteLength : Number) Creates a data view on the given ArrayBuffer.

## Method Summary

### getFloat32

**Signature:** `getFloat32(byteOffset : Number, littleEndian : boolean) : Number`

Returns the 32-bit floating point number at the given offset.

### getFloat64

**Signature:** `getFloat64(byteOffset : Number, littleEndian : boolean) : Number`

Returns the 64-bit floating point number at the given offset.

### getInt16

**Signature:** `getInt16(byteOffset : Number, littleEndian : boolean) : Number`

Returns the 16-bit signed integer number at the given offset.

### getInt32

**Signature:** `getInt32(byteOffset : Number, littleEndian : boolean) : Number`

Returns the 32-bit signed integer number at the given offset.

### getInt8

**Signature:** `getInt8(byteOffset : Number) : Number`

Returns the 8-bit signed integer number at the given offset.

### getUint16

**Signature:** `getUint16(byteOffset : Number, littleEndian : boolean) : Number`

Returns the 16-bit unsigned integer number at the given offset.

### getUint32

**Signature:** `getUint32(byteOffset : Number, littleEndian : boolean) : Number`

Returns the 32-bit unsigned integer number at the given offset.

### getUint8

**Signature:** `getUint8(byteOffset : Number) : Number`

Returns the 8-bit unsigned integer number at the given offset.

### setFloat32

**Signature:** `setFloat32(byteOffset : Number, value : Number, littleEndian : boolean) : void`

Writes a 32-bit floating point number into the byte array at the given offset.

### setFloat64

**Signature:** `setFloat64(byteOffset : Number, value : Number, littleEndian : boolean) : void`

Writes a 64-bit floating point number into the byte array at the given offset.

### setInt16

**Signature:** `setInt16(byteOffset : Number, value : Number, littleEndian : boolean) : void`

Writes a 16-bit signed integer number into the byte array at the given offset.

### setInt32

**Signature:** `setInt32(byteOffset : Number, value : Number, littleEndian : boolean) : void`

Writes a 32-bit signed integer number into the byte array at the given offset.

### setInt8

**Signature:** `setInt8(byteOffset : Number, value : Number) : void`

Writes an 8-bit signed integer number into the byte array at the given offset.

### setUint16

**Signature:** `setUint16(byteOffset : Number, value : Number, littleEndian : boolean) : void`

Writes a 16-bit unsigned integer number into the byte array at the given offset.

### setUint32

**Signature:** `setUint32(byteOffset : Number, value : Number, littleEndian : boolean) : void`

Writes a 32-bit unsigned integer number into the byte array at the given offset.

### setUint8

**Signature:** `setUint8(byteOffset : Number, value : Number) : void`

Writes an 8-bit unsigned integer number into the byte array at the given offset.

## Constructor Detail

## Method Detail

## Method Details

### getFloat32

**Signature:** `getFloat32(byteOffset : Number, littleEndian : boolean) : Number`

**Description:** Returns the 32-bit floating point number at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `littleEndian`: Optional. Default is false. Use true if the number is stored in little-endian format.

---

### getFloat64

**Signature:** `getFloat64(byteOffset : Number, littleEndian : boolean) : Number`

**Description:** Returns the 64-bit floating point number at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `littleEndian`: Optional. Default is false. Use true if the number is stored in little-endian format.

---

### getInt16

**Signature:** `getInt16(byteOffset : Number, littleEndian : boolean) : Number`

**Description:** Returns the 16-bit signed integer number at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `littleEndian`: Optional. Default is false. Use true if the number is stored in little-endian format.

---

### getInt32

**Signature:** `getInt32(byteOffset : Number, littleEndian : boolean) : Number`

**Description:** Returns the 32-bit signed integer number at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `littleEndian`: Optional. Default is false. Use true if the number is stored in little-endian format.

---

### getInt8

**Signature:** `getInt8(byteOffset : Number) : Number`

**Description:** Returns the 8-bit signed integer number at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.

---

### getUint16

**Signature:** `getUint16(byteOffset : Number, littleEndian : boolean) : Number`

**Description:** Returns the 16-bit unsigned integer number at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `littleEndian`: Optional. Default is false. Use true if the number is stored in little-endian format.

---

### getUint32

**Signature:** `getUint32(byteOffset : Number, littleEndian : boolean) : Number`

**Description:** Returns the 32-bit unsigned integer number at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `littleEndian`: Optional. Default is false. Use true if the number is stored in little-endian format.

---

### getUint8

**Signature:** `getUint8(byteOffset : Number) : Number`

**Description:** Returns the 8-bit unsigned integer number at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.

---

### setFloat32

**Signature:** `setFloat32(byteOffset : Number, value : Number, littleEndian : boolean) : void`

**Description:** Writes a 32-bit floating point number into the byte array at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `value`: The value to be written.
- `littleEndian`: Optional. Default is false. Use true if the little-endian format is to be used.

---

### setFloat64

**Signature:** `setFloat64(byteOffset : Number, value : Number, littleEndian : boolean) : void`

**Description:** Writes a 64-bit floating point number into the byte array at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `value`: The value to be written.
- `littleEndian`: Optional. Default is false. Use true if the little-endian format is to be used.

---

### setInt16

**Signature:** `setInt16(byteOffset : Number, value : Number, littleEndian : boolean) : void`

**Description:** Writes a 16-bit signed integer number into the byte array at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `value`: The value to be written.
- `littleEndian`: Optional. Default is false. Use true if the little-endian format is to be used.

---

### setInt32

**Signature:** `setInt32(byteOffset : Number, value : Number, littleEndian : boolean) : void`

**Description:** Writes a 32-bit signed integer number into the byte array at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `value`: The value to be written.
- `littleEndian`: Optional. Default is false. Use true if the little-endian format is to be used.

---

### setInt8

**Signature:** `setInt8(byteOffset : Number, value : Number) : void`

**Description:** Writes an 8-bit signed integer number into the byte array at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `value`: The value to be written.

---

### setUint16

**Signature:** `setUint16(byteOffset : Number, value : Number, littleEndian : boolean) : void`

**Description:** Writes a 16-bit unsigned integer number into the byte array at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `value`: The value to be written.
- `littleEndian`: Optional. Default is false. Use true if the little-endian format is to be used.

---

### setUint32

**Signature:** `setUint32(byteOffset : Number, value : Number, littleEndian : boolean) : void`

**Description:** Writes a 32-bit unsigned integer number into the byte array at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `value`: The value to be written.
- `littleEndian`: Optional. Default is false. Use true if the little-endian format is to be used.

---

### setUint8

**Signature:** `setUint8(byteOffset : Number, value : Number) : void`

**Description:** Writes an 8-bit unsigned integer number into the byte array at the given offset.

**Parameters:**

- `byteOffset`: The offset within the view.
- `value`: The value to be written.

---