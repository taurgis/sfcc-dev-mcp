## Package: dw.crypto

# Class CertificateUtils

## Inheritance Hierarchy

- Object
  - dw.crypto.CertificateUtils

## Description

Utilities for managing certificates and keys.

## Constructor Summary

CertificateUtils()

## Method Summary

### getCertificate

**Signature:** `static getCertificate(certificateRef : CertificateRef) : X509Certificate`

Gets the certificate from the given certificate reference.

### getCertificate

**Signature:** `static getCertificate(keyRef : KeyRef) : X509Certificate`

Gets the public certificate from the given private key reference.

### getEncodedCertificate

**Signature:** `static getEncodedCertificate(certificateRef : CertificateRef) : String`

Encode the certificate to the base64-encoded DER format.

### getEncodedPublicKey

**Signature:** `static getEncodedPublicKey(certificateRef : CertificateRef) : String`

Gets the public key from the given certificate reference.

### parseEncodedCertificate

**Signature:** `static parseEncodedCertificate(certificate : String) : CertificateRef`

Parse the certificate from the base64-encoded DER format.

### parseEncodedPublicKey

**Signature:** `static parseEncodedPublicKey(algorithm : String, encodedKey : String) : CertificateRef`

Parse the public key from the given key in X.509 SubjectPublicKeyInfo format.

### parsePublicKeyFromJWK

**Signature:** `static parsePublicKeyFromJWK(jwk : String) : CertificateRef`

Parse the public key from the given base64-encoded JWK string.

## Constructor Detail

## Method Detail

## Method Details

### getCertificate

**Signature:** `static getCertificate(certificateRef : CertificateRef) : X509Certificate`

**Description:** Gets the certificate from the given certificate reference.

**Parameters:**

- `certificateRef`: the certificate reference

**Returns:**

The X509Certificate

**Throws:**

Exception - if the reference is invalid or does not refer to an X.509 certificate

---

### getCertificate

**Signature:** `static getCertificate(keyRef : KeyRef) : X509Certificate`

**Description:** Gets the public certificate from the given private key reference.

**Parameters:**

- `keyRef`: the key reference

**Returns:**

The X509Certificate

**Throws:**

Exception - if the reference is invalid or there is no X.509 certificate

---

### getEncodedCertificate

**Signature:** `static getEncodedCertificate(certificateRef : CertificateRef) : String`

**Description:** Encode the certificate to the base64-encoded DER format.

**Parameters:**

- `certificateRef`: the certificate to encode

**Returns:**

base64-encoded DER certificate

---

### getEncodedPublicKey

**Signature:** `static getEncodedPublicKey(certificateRef : CertificateRef) : String`

**Description:** Gets the public key from the given certificate reference. It is exported in the standard X.509 SubjectPublicKeyInfo format and base64-encoded.

**Parameters:**

- `certificateRef`: the certificate reference with the public key to encode

**Returns:**

The encoded public key

---

### parseEncodedCertificate

**Signature:** `static parseEncodedCertificate(certificate : String) : CertificateRef`

**Description:** Parse the certificate from the base64-encoded DER format.

**Parameters:**

- `certificate`: The encoded certificate

**Returns:**

Reference to the parsed certificate

---

### parseEncodedPublicKey

**Signature:** `static parseEncodedPublicKey(algorithm : String, encodedKey : String) : CertificateRef`

**Description:** Parse the public key from the given key in X.509 SubjectPublicKeyInfo format. The resulting reference contains only the public key. It can be used for cryptographic operations, but not anything that requires the full certificate.

**Parameters:**

- `algorithm`: The public key algorithm, either EC or RSA
- `encodedKey`: The encoded key

**Returns:**

Reference to the public key

---

### parsePublicKeyFromJWK

**Signature:** `static parsePublicKeyFromJWK(jwk : String) : CertificateRef`

**Description:** Parse the public key from the given base64-encoded JWK string. This returns the public key portion of the JWK, not the x5c certificate chain. Only RSA and EC keys are supported. The resulting reference contains only the public key. It can be used for cryptographic operations, but not anything that requires the full certificate.

**Parameters:**

- `jwk`: Encoded JWK

**Returns:**

Reference to the public key

---