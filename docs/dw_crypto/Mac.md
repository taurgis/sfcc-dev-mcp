## Package: dw.crypto

# Class Mac

## Inheritance Hierarchy

- Object
  - dw.crypto.Mac

## Description

This class provides the functionality of a "Message Authentication Code" (MAC) algorithm. A MAC provides a way to check the integrity of information transmitted over or stored in an unreliable medium, based on a secret key. Typically, message authentication codes are used between two parties that share a secret key in order to validate information transmitted between these parties. A MAC mechanism that is based on cryptographic hash functions is referred to as HMAC. HMAC can be used with any cryptographic hash function, e.g., SHA256, in combination with a secret shared key. HMAC is specified in RFC 2104. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

## Constants

## Properties

## Constructor Summary

Mac(algorithm : String) Construct a Mac encryption instance with the specified algorithm name.

## Method Summary

### digest

**Signature:** `digest(input : String, key : String) : Bytes`

Computes the hash value for the passed string input using the passed secret key.

### digest

**Signature:** `digest(input : String, key : Bytes) : Bytes`

Computes the hash value for the passed string input using the passed secret key.

### digest

**Signature:** `digest(input : Bytes, key : Bytes) : Bytes`

Computes the hash value for the passed bytes input using the passed secret key.

## Constructor Detail

## Method Detail

## Method Details

### digest

**Signature:** `digest(input : String, key : String) : Bytes`

**Description:** Computes the hash value for the passed string input using the passed secret key. Given input and the given key will be first converted with UTF-8 encoding into a byte array. The resulting hash is typically converted with base64 back into a string.

**Parameters:**

- `input`: A string to calculate a RFC 2104 compliant HMAC hash value for.
- `key`: The secret key ready for use with the algorithm. The key's format depends on the chosen algorithm and the keys are assumed to be correctly formulated for the algorithm used, for example that the lengths are correct. Keys are not checked for validity. Only such keys that have no key parameters associated with them.

**Returns:**

The resulting hash value as bytes.

**Throws:**

IllegalArgumentException - if algorithm is not null and the specified algorithm name is not supported.

---

### digest

**Signature:** `digest(input : String, key : Bytes) : Bytes`

**Description:** Computes the hash value for the passed string input using the passed secret key. Given input will be first converted with UTF-8 encoding into a byte array. The resulting hash is typically converted with base64 back into a string.

**Parameters:**

- `input`: A string to calculate a RFC 2104 compliant HMAC hash value for.
- `key`: The secret key as bytes ready for use with the algorithm. The key's format depends on the chosen algorithm and the keys are assumed to be correctly formulated for the algorithm used, for example that the lengths are correct. Keys are not checked for validity. Only such keys that have no key parameters associated with them.

**Returns:**

The resulting hash value as bytes.

**Throws:**

IllegalArgumentException - if algorithm is not null and the specified algorithm name is not supported.

---

### digest

**Signature:** `digest(input : Bytes, key : Bytes) : Bytes`

**Description:** Computes the hash value for the passed bytes input using the passed secret key.

**Parameters:**

- `input`: The bytes to calculate a RFC 2104 compliant HMAC hash value.
- `key`: The secret key as byte array ready for use with the algorithm. The key's format depends on the chosen algorithm and the keys are assumed to be correctly formulated for the algorithm used, for example that the lengths are correct. Keys are not checked for validity. Only such keys that have no key parameters associated with them.

**Returns:**

The resulting hash value as bytes.

**Throws:**

IllegalArgumentException - if algorithm is not null and the specified algorithm name is not supported.

---