## Package: dw.io

# Class OutputStream

## Inheritance Hierarchy

- Object
  - dw.io.OutputStream

## Description

The class represent a stream of bytes that can be written from the application. The OutputStream itself doesn't provide any methods to write the data. Instead the OutputStream can be chained with other classes like a XMLStreamWriter to write data. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Constructor Summary

## Method Summary

### close

**Signature:** `close() : void`

Closes the output stream.

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Closes the output stream.

---