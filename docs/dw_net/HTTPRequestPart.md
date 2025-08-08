## Package: dw.net

# Class HTTPRequestPart

## Inheritance Hierarchy

- Object
  - dw.net.HTTPRequestPart

## Description

This represents a part in a multi-part HTTP POST request. A part always has a name and value. The value may be a String, Bytes, or the contents of a File. A character encoding may be specified for any of these, and the content type and a file name may additionally be specified for the Bytes and File types. Note: when this class is used with sensitive data, be careful in persisting sensitive information.

## Properties

### bytesValue

**Type:** Bytes (Read Only)

Get the Bytes value of the part.

### contentType

**Type:** String (Read Only)

The content type of this part.

### encoding

**Type:** String (Read Only)

Get the charset to be used to encode the string.

### fileName

**Type:** String (Read Only)

Get the file name to use when sending a file part.

### fileValue

**Type:** File (Read Only)

Get the file value of the part.

### name

**Type:** String (Read Only)

Get the name of the part.

### stringValue

**Type:** String (Read Only)

Get the string value of the part.

## Constructor Summary

HTTPRequestPart(name : String, value : String) Construct a part representing a simple string name/value pair.

HTTPRequestPart(name : String, value : String, encoding : String) Construct a part representing a simple string name/value pair.

HTTPRequestPart(name : String, file : File) Construct a part representing a name/File pair.

HTTPRequestPart(name : String, data : Bytes) Construct a part representing a name/bytes pair.

HTTPRequestPart(name : String, data : Bytes, contentType : String, encoding : String, fileName : String) Construct a part representing a name/File pair.

HTTPRequestPart(name : String, file : File, contentType : String, encoding : String) Construct a part representing a name/File pair.

HTTPRequestPart(name : String, file : File, contentType : String, encoding : String, fileName : String) Construct a part representing a name/File pair.

## Method Summary

### getBytesValue

**Signature:** `getBytesValue() : Bytes`

Get the Bytes value of the part.

### getContentType

**Signature:** `getContentType() : String`

Returns the content type of this part.

### getEncoding

**Signature:** `getEncoding() : String`

Get the charset to be used to encode the string.

### getFileName

**Signature:** `getFileName() : String`

Get the file name to use when sending a file part.

### getFileValue

**Signature:** `getFileValue() : File`

Get the file value of the part.

### getName

**Signature:** `getName() : String`

Get the name of the part.

### getStringValue

**Signature:** `getStringValue() : String`

Get the string value of the part.

## Constructor Detail

## Method Detail

## Method Details

### getBytesValue

**Signature:** `getBytesValue() : Bytes`

**Description:** Get the Bytes value of the part.

**Returns:**

The Bytes value, or null if this part is not a Bytes part.

---

### getContentType

**Signature:** `getContentType() : String`

**Description:** Returns the content type of this part.

**Returns:**

The content type, or null if content type was not specified.

---

### getEncoding

**Signature:** `getEncoding() : String`

**Description:** Get the charset to be used to encode the string.

**Returns:**

The charset, or null if charset was not specified.

---

### getFileName

**Signature:** `getFileName() : String`

**Description:** Get the file name to use when sending a file part.

**Returns:**

File name to use in the Mime header, or null for default behavior.

---

### getFileValue

**Signature:** `getFileValue() : File`

**Description:** Get the file value of the part.

**Returns:**

The file value, or null if this part is not a file part.

---

### getName

**Signature:** `getName() : String`

**Description:** Get the name of the part.

**Returns:**

The part name, never null.

---

### getStringValue

**Signature:** `getStringValue() : String`

**Description:** Get the string value of the part.

**Returns:**

The string value, or null if this part is not a string part.

---