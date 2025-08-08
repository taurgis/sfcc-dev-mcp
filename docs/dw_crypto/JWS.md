## Package: dw.crypto

# Class JWS

## Inheritance Hierarchy

- Object
  - dw.crypto.JWS

## Description

This class represents a JSON Web Signature (JWS) object. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3 requirements 2, 4, and 12.

## Properties

### algorithm

**Type:** String (Read Only)

Get the algorithm (alg) from the header.

### header

**Type:** JWSHeader (Read Only)

Get a copy of the JWS header.

### headerMap

**Type:** Map (Read Only)

Get a copy of the JWS header as a Map.

### payload

**Type:** String (Read Only)

Get the payload from this object.
 
 This is available even if the signature has not been verified.

## Constructor Summary

JWS(header : JWSHeader, payload : String) Construct a new JWS for signing.

JWS(header : JWSHeader, payload : Bytes) Construct a new JWS for signing.

## Method Summary

### getAlgorithm

**Signature:** `getAlgorithm() : String`

Get the algorithm (alg) from the header.

### getHeader

**Signature:** `getHeader() : JWSHeader`

Get a copy of the JWS header.

### getHeaderMap

**Signature:** `getHeaderMap() : Map`

Get a copy of the JWS header as a Map.

### getPayload

**Signature:** `getPayload() : String`

Get the payload from this object.

### parse

**Signature:** `static parse(jws : String) : JWS`

Parse a JSON Web Signature (JWS) object from its compact serialization format.

### parse

**Signature:** `static parse(jws : String, payload : String) : JWS`

Parse a JSON Web Signature (JWS) object from its compact serialization format.

### parse

**Signature:** `static parse(jws : String, payload : Bytes) : JWS`

Parse a JSON Web Signature (JWS) object from its compact serialization format.

### serialize

**Signature:** `serialize(detachPayload : boolean) : String`

Get this JWS in compact serialization form.

### sign

**Signature:** `sign(keyRef : KeyRef) : void`

Sign the payload using the given private key.

### verify

**Signature:** `verify(certificateRef : CertificateRef) : boolean`

Verifies the signature of the payload.

## Constructor Detail

## Method Detail

## Method Details

### getAlgorithm

**Signature:** `getAlgorithm() : String`

**Description:** Get the algorithm (alg) from the header.

**Returns:**

Value of the algorithm or null if missing.

---

### getHeader

**Signature:** `getHeader() : JWSHeader`

**Description:** Get a copy of the JWS header.

**Returns:**

Copy of the JWS header.

---

### getHeaderMap

**Signature:** `getHeaderMap() : Map`

**Description:** Get a copy of the JWS header as a Map.

**Returns:**

Copy of the JWS header.

---

### getPayload

**Signature:** `getPayload() : String`

**Description:** Get the payload from this object. This is available even if the signature has not been verified.

**Returns:**

UTF-8 encoded payload.

---

### parse

**Signature:** `static parse(jws : String) : JWS`

**Description:** Parse a JSON Web Signature (JWS) object from its compact serialization format.

**Parameters:**

- `jws`: JWS in compact serialization format.

**Returns:**

JWS object.

---

### parse

**Signature:** `static parse(jws : String, payload : String) : JWS`

**Description:** Parse a JSON Web Signature (JWS) object from its compact serialization format.

**Parameters:**

- `jws`: JWS without a payload in compact serialization format.
- `payload`: Detached payload

**Returns:**

JWS object.

---

### parse

**Signature:** `static parse(jws : String, payload : Bytes) : JWS`

**Description:** Parse a JSON Web Signature (JWS) object from its compact serialization format.

**Parameters:**

- `jws`: JWS without a payload in compact serialization format.
- `payload`: Detached payload

**Returns:**

JWS object.

---

### serialize

**Signature:** `serialize(detachPayload : boolean) : String`

**Description:** Get this JWS in compact serialization form.

**Parameters:**

- `detachPayload`: true for a detached payload compliant with RFC-7797, or false to serialize the payload too.

**Returns:**

Compact serialized object.

---

### sign

**Signature:** `sign(keyRef : KeyRef) : void`

**Description:** Sign the payload using the given private key. The key type and size must match the algorithm given in the JWS header.

**Parameters:**

- `keyRef`: Reference to the private key.

**Throws:**

Exception - if there is an error while signing the payload.

---

### verify

**Signature:** `verify(certificateRef : CertificateRef) : boolean`

**Description:** Verifies the signature of the payload. If the x5c header parameter is present, then that certificate chain will be used to verify the signature and the given certificateRef must be its root certificate. If this parameter is not present then the given certificateRef will be used to directly verify the signature. The following algorithms are supported: ES256 ES256K ES384 ES512 RS256 RS384 RS512 PS256 PS384 PS512

**Parameters:**

- `certificateRef`: Reference to the certificate to use for verification.

**Returns:**

a boolean indicating success (true) or failure (false).

**Throws:**

Exception - if there is an error while processing the certificate (for example if the x5c is not signed by the given certificate) or the algorithm is unsupported.

---