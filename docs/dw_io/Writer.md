## Package: dw.io

# Class Writer

## Inheritance Hierarchy

- Object
  - dw.io.Writer

## Description

The class supports writing characters to a stream. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Constructor Summary

Writer(stream : OutputStream) Create a writer from a stream using UTF-8 character encoding.

Writer(stream : OutputStream, encoding : String) Create a writer from a stream using the specified character encoding.

## Method Summary

### close

**Signature:** `close() : void`

Closes the writer.

### flush

**Signature:** `flush() : void`

Flushes the buffer.

### write

**Signature:** `write(str : String) : void`

Write the given string to the stream.

### write

**Signature:** `write(str : String, off : Number, len : Number) : void`

Write the given string to the stream.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Closes the writer.

---

### flush

**Signature:** `flush() : void`

**Description:** Flushes the buffer.

---

### write

**Signature:** `write(str : String) : void`

**Description:** Write the given string to the stream.

**Parameters:**

- `str`: the string to write to the stream.

---

### write

**Signature:** `write(str : String, off : Number, len : Number) : void`

**Description:** Write the given string to the stream.

**Parameters:**

- `str`: the string to write to the stream.
- `off`: the offset from which to start writing characters to the stream.
- `len`: the number of characters to write from the stream.

---