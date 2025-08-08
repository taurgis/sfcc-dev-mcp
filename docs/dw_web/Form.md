## Package: dw.web

# Class Form

## Inheritance Hierarchy

- Object
  - dw.web.FormElement
  - dw.web.FormGroup
    - dw.web.Form

## Description

The class is the top level element in the form instance hierachy.

## Properties

### secureKeyHtmlName

**Type:** String (Read Only)

The secure key html name to be used for the hidden input field
 that will contain the secure key value.

### secureKeyValue

**Type:** String (Read Only)

The secure key value that is generated for the form to use
 in a hidden input field for authentication.

## Constructor Summary

## Method Summary

### getSecureKeyHtmlName

**Signature:** `getSecureKeyHtmlName() : String`

Returns the secure key html name to be used for the hidden input field that will contain the secure key value.

### getSecureKeyValue

**Signature:** `getSecureKeyValue() : String`

Returns the secure key value that is generated for the form to use in a hidden input field for authentication.

## Method Detail

## Method Details

### getSecureKeyHtmlName

**Signature:** `getSecureKeyHtmlName() : String`

**Description:** Returns the secure key html name to be used for the hidden input field that will contain the secure key value.

**Returns:**

the secure key html name

---

### getSecureKeyValue

**Signature:** `getSecureKeyValue() : String`

**Description:** Returns the secure key value that is generated for the form to use in a hidden input field for authentication.

**Returns:**

the secure key value

---