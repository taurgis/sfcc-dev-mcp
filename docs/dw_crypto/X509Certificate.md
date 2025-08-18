## Package: dw.crypto

# Class X509Certificate

## Inheritance Hierarchy

- Object
  - dw.crypto.CertificateRef
  - dw.crypto.X509Certificate

## Description

Represents an X.509 public key certificate as defined in RFC 5280. It provides access to the standard fields of an X.509 certificate including version, serial number, validity period, distinguished names, and signature algorithm.

## Properties

### issuerDN

**Type:** String (Read Only)

The X.500 distinguished name of the entity that signed this certificate.

### notAfter

**Type:** Date (Read Only)

The end date of the certificate validity period.

### notBefore

**Type:** Date (Read Only)

The start date of the certificate validity period.

### serialNumber

**Type:** String (Read Only)

The certificate serial number in string format. The serial number is a unique positive integer assigned
 by the CA to each certificate.

### sigAlgName

**Type:** String (Read Only)

The algorithm used to sign this certificate. The name follows the format defined in RFC 5280 (e.g.,
 "SHA256withRSA", "SHA384withECDSA").

### subjectDN

**Type:** String (Read Only)

The X.500 distinguished name of the entity this certificate belongs to.

### version

**Type:** Number (Read Only)

The X.509 certificate version number.

## Constructor Summary

## Method Summary

### getIssuerDN

**Signature:** `getIssuerDN() : String`

Returns the X.500 distinguished name of the entity that signed this certificate.

### getNotAfter

**Signature:** `getNotAfter() : Date`

Returns the end date of the certificate validity period.

### getNotBefore

**Signature:** `getNotBefore() : Date`

Returns the start date of the certificate validity period.

### getSerialNumber

**Signature:** `getSerialNumber() : String`

Returns the certificate serial number in string format.

### getSigAlgName

**Signature:** `getSigAlgName() : String`

Returns the algorithm used to sign this certificate.

### getSubjectDN

**Signature:** `getSubjectDN() : String`

Returns the X.500 distinguished name of the entity this certificate belongs to.

### getVersion

**Signature:** `getVersion() : Number`

Returns the X.509 certificate version number.

## Method Detail

## Method Details

### getIssuerDN

**Signature:** `getIssuerDN() : String`

**Description:** Returns the X.500 distinguished name of the entity that signed this certificate.

**Returns:**

the issuer's X.500 distinguished name

---

### getNotAfter

**Signature:** `getNotAfter() : Date`

**Description:** Returns the end date of the certificate validity period.

**Returns:**

the date after which this certificate is not valid

---

### getNotBefore

**Signature:** `getNotBefore() : Date`

**Description:** Returns the start date of the certificate validity period.

**Returns:**

the date before which this certificate is not valid

---

### getSerialNumber

**Signature:** `getSerialNumber() : String`

**Description:** Returns the certificate serial number in string format. The serial number is a unique positive integer assigned by the CA to each certificate.

**Returns:**

the certificate serial number as a string

---

### getSigAlgName

**Signature:** `getSigAlgName() : String`

**Description:** Returns the algorithm used to sign this certificate. The name follows the format defined in RFC 5280 (e.g., "SHA256withRSA", "SHA384withECDSA").

**Returns:**

the signature algorithm name

---

### getSubjectDN

**Signature:** `getSubjectDN() : String`

**Description:** Returns the X.500 distinguished name of the entity this certificate belongs to.

**Returns:**

the subject's X.500 distinguished name

---

### getVersion

**Signature:** `getVersion() : Number`

**Description:** Returns the X.509 certificate version number.

**Returns:**

certificate version (typically 1, 2, or 3)

---