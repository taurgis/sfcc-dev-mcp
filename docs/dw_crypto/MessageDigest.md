## Package: dw.crypto

# Class MessageDigest

## Inheritance Hierarchy

- Object
  - dw.crypto.MessageDigest

## Description

This class provides the functionality of a message digest algorithm, such as MD5 or SHA. Message digests are secure one-way hash functions that take arbitrary-sized data and output a fixed-length hash value. This implementation offers only stateless digest() methods. A Bytes object or String is passed to a digest() method and the computed hash is returned. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

## Constants

## Properties

## Constructor Summary

MessageDigest(algorithm : String) Construct a MessageDigest with the specified algorithm name.

## Method Summary

### digest

**Signature:** `digest(input : String) : String`

Digests the passed string and returns a computed hash value as a string.

### digest

**Signature:** `digest(algorithm : String, input : Bytes) : Bytes`

Computes the hash value for the passed array of bytes.

### digest

**Signature:** `digest() : Bytes`

Completes the hash computation by performing final operations such as padding.

### digestBytes

**Signature:** `digestBytes(input : Bytes) : Bytes`

Computes the hash value for the passed Bytes.

### updateBytes

**Signature:** `updateBytes(input : Bytes) : void`

Updates the digest using the passed Bytes.

## Constructor Detail

## Method Detail

## Method Details

### digest

**Signature:** `digest(input : String) : String`

**Description:** Digests the passed string and returns a computed hash value as a string. The passed String is first encoded into a sequence of bytes using the platform's default encoding. The digest then performs any prerequisite padding, before computing the hash value. The hash is then converted into a string by converting all digits to hexadecimal.

**Deprecated:**

Deprecated because the conversion of the input to bytes using the default platform encoding and the hex-encoded return value are not generally appropriate.

**Parameters:**

- `input`: The value to hash as String, must not be null.

**Returns:**

The resulting hash value as hex-encoded string.

---

### digest

**Signature:** `digest(algorithm : String, input : Bytes) : Bytes`

**Description:** Computes the hash value for the passed array of bytes. The algorithm argument is optional. If null, then the algorithm established at construction time is used. The binary representation of the message is typically derived from a string and the resulting hash is typically converted with base64 back into a string. Example: Encoding.toBase64( digest( "MD5", new Bytes( "my password", "UTF-8" ) ) );

**Deprecated:**

Deprecated because the digest algorithm should be the one set in the constructor.

**Parameters:**

- `algorithm`: The standard name of the digest algorithm, or null if the algorithm passed at construction time is to be used. The algorithm must be a supported algorithm.
- `input`: The value to hash, must not be null.

**Returns:**

The resulting hash value.

---

### digest

**Signature:** `digest() : Bytes`

**Description:** Completes the hash computation by performing final operations such as padding. The binary representation of the message is typically derived from a string and the resulting hash is typically converted with base64 back into a string. Example: Encoding.toBase64( digest() );

**Returns:**

The resulting hash value.

---

### digestBytes

**Signature:** `digestBytes(input : Bytes) : Bytes`

**Description:** Computes the hash value for the passed Bytes. The binary representation of the message is typically derived from a string and the resulting hash is typically converted with base64 back into a string. Example: Encoding.toBase64( digest( new Bytes( "my password", "UTF-8" ) ) );

**Parameters:**

- `input`: The value to hash, must not be null.

**Returns:**

The resulting hash value.

---

### updateBytes

**Signature:** `updateBytes(input : Bytes) : void`

**Description:** Updates the digest using the passed Bytes.

**Parameters:**

- `input`: The value to hash, must not be null.

---