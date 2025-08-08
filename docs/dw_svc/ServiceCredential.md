## Package: dw.svc

# Class ServiceCredential

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.EncryptedObject
      - dw.svc.ServiceCredential

## Description

Configuration object for Service Credentials.

## Constants

## Properties

### ID

**Type:** String (Read Only)

The unique Credential ID.

### password

**Type:** String (Read Only)

The Password in plain text.

### URL

**Type:** String (Read Only)

Return the URL.

### user

**Type:** String (Read Only)

The User ID.

## Constructor Summary

## Method Summary

### getEncryptedPassword

**Signature:** `getEncryptedPassword(algorithm : String, publicKey : CertificateRef) : String`

Encrypts the password from this object with the given algorithm and the public key taken from a certificate in the keystore.

### getID

**Signature:** `getID() : String`

Returns the unique Credential ID.

### getPassword

**Signature:** `getPassword() : String`

Returns the Password in plain text.

### getURL

**Signature:** `getURL() : String`

Return the URL.

### getUser

**Signature:** `getUser() : String`

Returns the User ID.

## Method Detail

## Method Details

### getEncryptedPassword

**Signature:** `getEncryptedPassword(algorithm : String, publicKey : CertificateRef) : String`

**Description:** Encrypts the password from this object with the given algorithm and the public key taken from a certificate in the keystore. Returned is the base64-encoded representation of the result. See also Cipher.encrypt(String, CertificateRef, String, String, Number) on how to generate RSA key pairs.

**Deprecated:**

Use Cipher to encrypt data as needed.

**Parameters:**

- `algorithm`: The algorithm to be used for the encryption of this password. Currently only "RSA" is supported.
- `publicKey`: A reference to a trusted certificate entry containing the public key in the keystore.

**Returns:**

the base64-encoded representation of the password.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique Credential ID.

**Returns:**

unique Credential ID.

---

### getPassword

**Signature:** `getPassword() : String`

**Description:** Returns the Password in plain text.

**Returns:**

Password.

---

### getURL

**Signature:** `getURL() : String`

**Description:** Return the URL.

**Returns:**

URL.

---

### getUser

**Signature:** `getUser() : String`

**Description:** Returns the User ID.

**Returns:**

User ID.

---