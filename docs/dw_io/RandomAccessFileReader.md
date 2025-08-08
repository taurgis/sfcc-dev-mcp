## Package: dw.io

# Class RandomAccessFileReader

## Inheritance Hierarchy

- Object
  - dw.io.RandomAccessFileReader

## Description

Instances of this class support reading from a random access file. A random access file behaves like a large array of bytes stored in the file system. There is a kind of cursor, or index into the implied array, called the file pointer. Read operations read bytes starting at the file pointer and advance the file pointer past the bytes read. The file pointer can be read by the getPosition method and set by the setPosition method.

## Constants

## Properties

### position

**Type:** Number

The current offset in this file.

## Constructor Summary

RandomAccessFileReader(file : File) Construct a reader for random read access to the provided file.

## Method Summary

### close

**Signature:** `close() : void`

Closes this random access file reader and releases any system resources associated with the stream.

### getPosition

**Signature:** `getPosition() : Number`

Returns the current offset in this file.

### length

**Signature:** `length() : Number`

Returns the length of this file.

### readByte

**Signature:** `readByte() : Number`

Reads a signed eight-bit value from the file starting from the current file pointer.

### readBytes

**Signature:** `readBytes(numBytes : Number) : Bytes`

Reads up to n bytes from the file starting at the current file pointer.

### setPosition

**Signature:** `setPosition(position : Number) : void`

Sets the file-pointer offset, measured from the beginning of this file, at which the next read occurs.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Closes this random access file reader and releases any system resources associated with the stream.

**Throws:**

IOException - if an I/O error occurs.

---

### getPosition

**Signature:** `getPosition() : Number`

**Description:** Returns the current offset in this file.

**Returns:**

the offset from the beginning of the file, in bytes, at which the next read occurs.

**Throws:**

IOException - if an I/O error occurs.

---

### length

**Signature:** `length() : Number`

**Description:** Returns the length of this file.

**Returns:**

the length of this file, measured in bytes.

**Throws:**

IOException - if an I/O error occurs.

---

### readByte

**Signature:** `readByte() : Number`

**Description:** Reads a signed eight-bit value from the file starting from the current file pointer. Since the byte is interpreted as signed, the value returned will always be between -128 and +127.

**Returns:**

the next byte of this file as a signed eight-bit byte.

**Throws:**

IOException - if an I/O error occurs or if this file has reached the end.

---

### readBytes

**Signature:** `readBytes(numBytes : Number) : Bytes`

**Description:** Reads up to n bytes from the file starting at the current file pointer. If there are fewer than n bytes remaining in the file, then as many bytes as possible are read. If no bytes remain in the file, then null is returned.

**Parameters:**

- `numBytes`: The number of bytes to read. Must be non-negative and smaller than MAX_READ_BYTES or an exception will be thrown.

**Returns:**

A Bytes object representing the read bytes or null if no bytes were read.

**Throws:**

IOException - if an I/O error occurs.
IllegalArgumentException - if numBytes< 0 or numBytes > MAX_READ_BYTES.

---

### setPosition

**Signature:** `setPosition(position : Number) : void`

**Description:** Sets the file-pointer offset, measured from the beginning of this file, at which the next read occurs. The offset may be set beyond the end of the file.

**Parameters:**

- `position`: the offset position, measured in bytes from the beginning of the file, at which to set the file pointer

**Throws:**

IOException - if position is less than 0 or if an I/O error occurs.

---