## Package: dw.crypto

# Class KeyRef

## Inheritance Hierarchy

- Object
  - dw.crypto.KeyRef

## Description

This class is used as a reference to a private key in the keystore which can be managed in the Business Manager. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

## Constructor Summary

KeyRef(alias : String) Creates a KeyRef from the passed alias.

KeyRef(alias : String, password : String) Creates a KeyRef from the passed alias.

## Method Summary

### toString

**Signature:** `toString() : String`

Returns the string representation of this KeyRef.

## Constructor Detail

## Method Detail

## Method Details

### toString

**Signature:** `toString() : String`

**Description:** Returns the string representation of this KeyRef.

**Returns:**

The string representation of this KeyRef.

---