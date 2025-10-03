## Package: dw.crypto

# Class Signature

## Inheritance Hierarchy

- Object
  - dw.crypto.Signature

## Description

This class allows access to signature services offered through the Java Cryptography Architecture (JCA). At this time the signature/verification implementation of the methods is based on the default RSA JCE provider of the JDK - sun.security.rsa.SunRsaSign dw.crypto.Signature is an adapter to the security provider implementation and covers several digest algorithms: SHA1withRSA (deprecated) SHA256withRSA SHA384withRSA SHA512withRSA SHA256withRSA/PSS SHA384withRSA/PSS SHA512withRSA/PSS SHA256withECDSA SHA384withECDSA SHA512withECDSA Key size generally ranges between 512 and 65536 bits (the latter of which is unnecessarily large). Default key size for RSA is 1024. SHA384withRSA and SHA512withRSA require a key with length of at least 1024 bits. For ECDSA, the following key sizes are supported: SHA256withECDSA: 256-bit key (NIST P-256) SHA384withECDSA: 384-bit key (NIST P-384) SHA512withECDSA: 521-bit key (NIST P-521) When choosing a key size - beware of the tradeoff between security and processing time: The longer the key, the harder to break it but also it takes more time for the two sides to sign and verify the signature. An exception will be thrown for keys shorter than 2048 bits in this version of the API. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, 12, and other relevant requirements.

## Constants

### SUPPORTED_DIGEST_ALGORITHMS_AS_ARRAY

**Type:** String

Supported digest algorithms exposed as a string array

## Properties

## Constructor Summary

Signature()

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
- `certificate`: a reference to a trusted certificate
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
- `certificate`: a reference to a trusted certificate
- `digestAlgorithm`: must be one of the currently supported ones

**Returns:**

a boolean indicating success (true) or failure (false)

---