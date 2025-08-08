## Package: dw.value

# Class MimeEncodedText

## Inheritance Hierarchy

- Object
  - dw.value.MimeEncodedText

## Description

Container for an arbitrary text string its mime type, and encoding

## Properties

### encoding

**Type:** String (Read Only)

The encoding of the text. Encoding is set at creation time and
 can't be changed afterwards

### mimeType

**Type:** String (Read Only)

The mime type of the text. Mime type is set at creation time and
 can't be changed afterwards.

### text

**Type:** String (Read Only)

The text. Text is set at creation time and can't be changed
 afterwards.

## Constructor Summary

MimeEncodedText(text : String, mimeType : String, encoding : String) Creates a new MimeEncodedText with explicit values for mime type and encoding.

MimeEncodedText(text : String) Creates a new MimeEncodedText with the given String as text, mime type of "text/plain;charset=UTF-8" and encoding of "UTF-8"

## Method Summary

### getEncoding

**Signature:** `getEncoding() : String`

Returns the encoding of the text.

### getMimeType

**Signature:** `getMimeType() : String`

Returns the mime type of the text.

### getText

**Signature:** `getText() : String`

Returns the text.

## Constructor Detail

## Method Detail

## Method Details

### getEncoding

**Signature:** `getEncoding() : String`

**Description:** Returns the encoding of the text. Encoding is set at creation time and can't be changed afterwards

**Returns:**

encoding of the text

---

### getMimeType

**Signature:** `getMimeType() : String`

**Description:** Returns the mime type of the text. Mime type is set at creation time and can't be changed afterwards.

**Returns:**

the MimeType of the text

---

### getText

**Signature:** `getText() : String`

**Description:** Returns the text. Text is set at creation time and can't be changed afterwards.

**Returns:**

text stored

---