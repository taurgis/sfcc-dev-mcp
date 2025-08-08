## Package: dw.crypto

# Class WeakSignature

## Inheritance Hierarchy

- Object
  - dw.crypto.WeakSignature

## Description

This API provides access to Deprecated algorithms. See Signature for full documentation. WeakSignature is simply a drop-in replacement that only supports deprecated algorithms. This is helpful when you need to deal with weak algorithms for backward compatibility purposes, but Signature should always be used for new development and for anything intended to be secure. This class allows access to signature services offered through the Java Cryptography Architecture (JCA). At this time the signature/verification implementation of the methods is based on the default RSA JCE provider of the JDK - sun.security.rsa.SunRsaSign dw.crypto.WeakSignature is an adapter to the security provider implementation and only covers one digest algorithm: SHA1withRSA Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, 12, and other relevant requirements.

## Constructor Summary

WeakSignature()

## Method Summary

### isDigestAlgorithmSupported

**Signature:** `isDigestAlgorithmSupported(digestAlgorithm : String) : boolean`

Checks to see if a digest algorithm is supported

### sign

**Signature:** `sign(contentToSign : String, privateKey : String, digestAlgorithm : String) : String`

Signs a string and returns a string

### sign

**Signature:** `sign(contentToSign : String, privateKey : KeyRef, digestAlgorithm : String) : String`

Signs a string and returns a string

### signBytes

**Signature:** `signBytes(contentToSign : Bytes, privateKey : String, digestAlgorithm : String) : Bytes`

Signs bytes and returns bytes

### signBytes

**Signature:** `signBytes(contentToSign : Bytes, privateKey : KeyRef, digestAlgorithm : String) : Bytes`

Signs bytes and returns bytes

### verifyBytesSignature

**Signature:** `verifyBytesSignature(signature : Bytes, contentToVerify : Bytes, publicKey : String, digestAlgorithm : String) : boolean`

Verifies a signature supplied as bytes

### verifyBytesSignature

**Signature:** `verifyBytesSignature(signature : Bytes, contentToVerify : Bytes, certificate : CertificateRef, digestAlgorithm : String) : boolean`

Verifies a signature supplied as bytes

### verifySignature

**Signature:** `verifySignature(signature : String, contentToVerify : String, publicKey : String, digestAlgorithm : String) : boolean`

Verifies a signature supplied as string

### verifySignature

**Signature:** `verifySignature(signature : String, contentToVerify : String, certificate : CertificateRef, digestAlgorithm : String) : boolean`

Verifies a signature supplied as string

## Constructor Detail

## Method Detail

## Method Details

### isDigestAlgorithmSupported

**Signature:** `isDigestAlgorithmSupported(digestAlgorithm : String) : boolean`

**Description:** Checks to see if a digest algorithm is supported

**Parameters:**

- `digestAlgorithm`: the digest algorithm name

**Returns:**

a boolean indicating success (true) or failure (false)

---

### sign

**Signature:** `sign(contentToSign : String, privateKey : String, digestAlgorithm : String) : String`

**Description:** Signs a string and returns a string

**Parameters:**

- `contentToSign`: base64 encoded content to sign
- `privateKey`: base64 encoded private key
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

the base64 encoded signature

---

### sign

**Signature:** `sign(contentToSign : String, privateKey : KeyRef, digestAlgorithm : String) : String`

**Description:** Signs a string and returns a string

**Parameters:**

- `contentToSign`: base64 encoded content to sign
- `privateKey`: a reference to a private key entry in the keystore
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

the base64 encoded signature

---

### signBytes

**Signature:** `signBytes(contentToSign : Bytes, privateKey : String, digestAlgorithm : String) : Bytes`

**Description:** Signs bytes and returns bytes

**Parameters:**

- `contentToSign`: transformed with UTF-8 encoding into a byte stream
- `privateKey`: base64 encoded private key
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

signature

---

### signBytes

**Signature:** `signBytes(contentToSign : Bytes, privateKey : KeyRef, digestAlgorithm : String) : Bytes`

**Description:** Signs bytes and returns bytes

**Parameters:**

- `contentToSign`: transformed with UTF-8 encoding into a byte stream
- `privateKey`: a reference to a private key entry in the keystore
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

signature

---

### verifyBytesSignature

**Signature:** `verifyBytesSignature(signature : Bytes, contentToVerify : Bytes, publicKey : String, digestAlgorithm : String) : boolean`

**Description:** Verifies a signature supplied as bytes

**Parameters:**

- `signature`: signature to check as bytes
- `contentToVerify`: as bytes
- `publicKey`: base64 encoded public key
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

a boolean indicating success (true) or failure (false)

---

### verifyBytesSignature

**Signature:** `verifyBytesSignature(signature : Bytes, contentToVerify : Bytes, certificate : CertificateRef, digestAlgorithm : String) : boolean`

**Description:** Verifies a signature supplied as bytes

**Parameters:**

- `signature`: signature to check as bytes
- `contentToVerify`: as bytes
- `certificate`: a reference to a trusted certificate entry in the keystore
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

a boolean indicating success (true) or failure (false)

---

### verifySignature

**Signature:** `verifySignature(signature : String, contentToVerify : String, publicKey : String, digestAlgorithm : String) : boolean`

**Description:** Verifies a signature supplied as string

**Parameters:**

- `signature`: base64 encoded signature
- `contentToVerify`: base64 encoded content to verify
- `publicKey`: base64 encoded public key
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

a boolean indicating success (true) or failure (false)

---

### verifySignature

**Signature:** `verifySignature(signature : String, contentToVerify : String, certificate : CertificateRef, digestAlgorithm : String) : boolean`

**Description:** Verifies a signature supplied as string

**Parameters:**

- `signature`: base64 encoded signature
- `contentToVerify`: base64 encoded content to verify
- `certificate`: a reference to a trusted certificate entry in the keystore
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

a boolean indicating success (true) or failure (false)

---