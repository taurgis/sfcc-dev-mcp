## Package: dw.crypto

# Class JWE

## Inheritance Hierarchy

- Object
  - dw.crypto.JWE

## Description

This class represents a JSON Web Encryption (JWE) object. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3 requirements 2, 4, and 12.

## Properties

### algorithm

**Type:** String (Read Only)

Get the algorithm (alg) from the header.

### encryptionMethod

**Type:** String (Read Only)

Get the encryption method (enc) from the header.

### headerMap

**Type:** Map (Read Only)

Get a copy of the JWE headers as a Map.

### keyID

**Type:** String (Read Only)

Get the key id (kid) from the header.

### payload

**Type:** String (Read Only)

Get the decrypted payload.

## Constructor Summary

## Method Summary

### decrypt

**Signature:** `decrypt(privateKey : KeyRef) : void`

Decrypt the payload of this JWE object.

### getAlgorithm

**Signature:** `getAlgorithm() : String`

Get the algorithm (alg) from the header.

### getEncryptionMethod

**Signature:** `getEncryptionMethod() : String`

Get the encryption method (enc) from the header.

### getHeaderMap

**Signature:** `getHeaderMap() : Map`

Get a copy of the JWE headers as a Map.

### getKeyID

**Signature:** `getKeyID() : String`

Get the key id (kid) from the header.

### getPayload

**Signature:** `getPayload() : String`

Get the decrypted payload.

### parse

**Signature:** `static parse(jwe : String) : JWE`

Parse a JSON Web Encryption (JWE) object from its compact serialization format.

## Method Detail

## Method Details

### decrypt

**Signature:** `decrypt(privateKey : KeyRef) : void`

**Description:** Decrypt the payload of this JWE object. Elliptic Curve (EC) and RSA keys are both supported. Supported EC key management algorithms: ECDH-ES ECDH-ES+A128KW ECDH-ES+A192KW ECDH-ES+A256KW Supported EC curves: P-256 P-384 P-521 Supported RSA key management algorithms: RSA-OAEP-256 RSA-OAEP-384 RSA-OAEP-512 Supported content encryption algorithms: A128CBC-HS256 A128CBC-HS384 A128CBC-HS512 A128GCM A192GCM A256GCM

**Parameters:**

- `privateKey`: Reference to private RSA or EC key to use for decryption.

---

### getAlgorithm

**Signature:** `getAlgorithm() : String`

**Description:** Get the algorithm (alg) from the header.

**Returns:**

Value of the algorithm or null if missing.

---

### getEncryptionMethod

**Signature:** `getEncryptionMethod() : String`

**Description:** Get the encryption method (enc) from the header.

**Returns:**

Value of the encryption method or null if missing.

---

### getHeaderMap

**Signature:** `getHeaderMap() : Map`

**Description:** Get a copy of the JWE headers as a Map.

**Returns:**

Copy of the JWE headers.

---

### getKeyID

**Signature:** `getKeyID() : String`

**Description:** Get the key id (kid) from the header.

**Returns:**

Value of the key id or null if missing.

---

### getPayload

**Signature:** `getPayload() : String`

**Description:** Get the decrypted payload.

**Returns:**

Payload or null if the payload is encrypted.

---

### parse

**Signature:** `static parse(jwe : String) : JWE`

**Description:** Parse a JSON Web Encryption (JWE) object from its compact serialization format.

**Parameters:**

- `jwe`: JWE in compact serialization format.

**Returns:**

JWE object.

---