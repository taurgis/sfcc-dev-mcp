## Package: dw.crypto

# Class WeakCipher

## Inheritance Hierarchy

- Object
  - dw.crypto.WeakCipher

## Description

This API provides access to Deprecated algorithms. See Cipher for full documentation. WeakCipher is simply a drop-in replacement that only supports deprecated algorithms and key lengths. This is helpful when you need to deal with weak algorithms for backward compatibility purposes, but Cipher should always be used for new development and for anything intended to be secure. Note: this class handles sensitive security-related data. Pay special attention to PCI DSS v3 requirements 2, 4, and 12.

## Constants

### CHAR_ENCODING

**Type:** String = "UTF8"

Strings containing keys, plain texts, cipher texts etc. are internally converted into byte arrays using this encoding (currently UTF8).

## Properties

## Constructor Summary

WeakCipher()

## Method Summary

### decrypt

**Signature:** `decrypt(base64Msg : String, key : String, transformation : String, saltOrIV : String, iterations : Number) : String`

Decrypts the message using the given parameters.

### decrypt

**Signature:** `decrypt(base64Msg : String, privateKey : KeyRef, transformation : String, saltOrIV : String, iterations : Number) : String`

Alternative method to decrypt(String, String, String, String, Number), which allows using a key in the keystore for the decryption.

### decrypt

**Signature:** `decrypt(base64Msg : String, key : String, transformation : String, saltOrIV : String, iterations : Number) : String`

Decrypts the message using the given parameters.

### decrypt

**Signature:** `decrypt(base64Msg : String, privateKey : KeyRef, transformation : String, saltOrIV : String, iterations : Number) : String`

Alternative method to decrypt_3(String, String, String, String, Number), which allows using a key in the keystore for the decryption.

### decryptBytes

**Signature:** `decryptBytes(encryptedBytes : Bytes, key : String, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

Lower-level decryption API.

### decryptBytes

**Signature:** `decryptBytes(encryptedBytes : Bytes, privateKey : KeyRef, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

Alternative method to decryptBytes(Bytes, String, String, String, Number), which allows to use a key in the keystore for the decryption.

### decryptBytes

**Signature:** `decryptBytes(encryptedBytes : Bytes, key : String, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

Lower-level decryption API.

### decryptBytes

**Signature:** `decryptBytes(encryptedBytes : Bytes, privateKey : KeyRef, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

Alternative method to decryptBytes_3(Bytes, String, String, String, Number), which allows to use a key in the keystore for the decryption.

### encrypt

**Signature:** `encrypt(message : String, key : String, transformation : String, saltOrIV : String, iterations : Number) : String`

Encrypt the passed message by using the specified key and applying the transformations described by the specified parameters.

### encrypt

**Signature:** `encrypt(message : String, publicKey : CertificateRef, transformation : String, saltOrIV : String, iterations : Number) : String`

Encrypt the passed message by using the specified key and applying the transformations described by the specified parameters.

### encrypt

**Signature:** `encrypt(message : String, key : String, transformation : String, saltOrIV : String, iterations : Number) : String`

Encrypt the passed message by using the specified key and applying the transformations described by the specified parameters.

### encrypt

**Signature:** `encrypt(message : String, publicKey : CertificateRef, transformation : String, saltOrIV : String, iterations : Number) : String`

Encrypt the passed message by using the specified key and applying the transformations described by the specified parameters.

### encryptBytes

**Signature:** `encryptBytes(messageBytes : Bytes, key : String, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

Lower-level encryption API.

### encryptBytes

**Signature:** `encryptBytes(messageBytes : Bytes, publicKey : CertificateRef, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

Alternative method to encryptBytes(Bytes, String, String, String, Number), which allows to use a key in the keystore for the encryption.

### encryptBytes

**Signature:** `encryptBytes(messageBytes : Bytes, key : String, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

Lower-level encryption API.

### encryptBytes

**Signature:** `encryptBytes(messageBytes : Bytes, publicKey : CertificateRef, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

Alternative method to encryptBytes_3(Bytes, String, String, String, Number), which allows to use a key in the keystore for the encryption.

## Constructor Detail

## Method Detail

## Method Details

### decrypt

**Signature:** `decrypt(base64Msg : String, key : String, transformation : String, saltOrIV : String, iterations : Number) : String`

**Description:** Decrypts the message using the given parameters. See Cipher.decrypt(String, String, String, String, Number) for full documentation.

**API Versioned:**

From version 15.5. No longer available as of version 16.2. Requires Base64-encryption for the salt parameter.

**Parameters:**

- `base64Msg`: the base64 encoded data to decrypt
- `key`: The decryption key
- `transformation`: Transformation in "algorithm/mode/padding" format.
- `saltOrIV`: Initialization value appropriate for the algorithm.
- `iterations`: The number of passes to make when turning a passphrase into a key, if applicable

**Returns:**

the original plaintext message.

---

### decrypt

**Signature:** `decrypt(base64Msg : String, privateKey : KeyRef, transformation : String, saltOrIV : String, iterations : Number) : String`

**Description:** Alternative method to decrypt(String, String, String, String, Number), which allows using a key in the keystore for the decryption. See Cipher.decrypt(String, KeyRef, String, String, Number) for full documentation.

**API Versioned:**

From version 15.5. No longer available as of version 16.2. Requires Base64-encryption for the salt parameter.

**Parameters:**

- `base64Msg`: the base64 encoded data to decrypt
- `privateKey`: A reference to a private key in the key store.
- `transformation`: Transformation in "algorithm/mode/padding" format.
- `saltOrIV`: Initialization value appropriate for the algorithm.
- `iterations`: The number of passes to make when turning a passphrase into a key, if applicable

**Returns:**

the original plaintext message.

---

### decrypt

**Signature:** `decrypt(base64Msg : String, key : String, transformation : String, saltOrIV : String, iterations : Number) : String`

**Description:** Decrypts the message using the given parameters. See Cipher.decrypt_3(String, String, String, String, Number) for full documentation.

**API Versioned:**

From version 16.2. Does not use a default initialization vector.

**Parameters:**

- `base64Msg`: the base64 encoded data to decrypt
- `key`: The decryption key
- `transformation`: Transformation in "algorithm/mode/padding" format.
- `saltOrIV`: Initialization value appropriate for the algorithm.
- `iterations`: The number of passes to make when turning a passphrase into a key, if applicable

**Returns:**

the original plaintext message.

---

### decrypt

**Signature:** `decrypt(base64Msg : String, privateKey : KeyRef, transformation : String, saltOrIV : String, iterations : Number) : String`

**Description:** Alternative method to decrypt_3(String, String, String, String, Number), which allows using a key in the keystore for the decryption. See Cipher.decrypt_3(String, KeyRef, String, String, Number) for full documentation.

**API Versioned:**

From version 16.2. Does not use a default initialization vector.

**Parameters:**

- `base64Msg`: the base64 encoded data to decrypt
- `privateKey`: A reference to a private key in the key store.
- `transformation`: Transformation in "algorithm/mode/padding" format.
- `saltOrIV`: Initialization value appropriate for the algorithm.
- `iterations`: The number of passes to make when turning a passphrase into a key, if applicable

**Returns:**

the original plaintext message.

---

### decryptBytes

**Signature:** `decryptBytes(encryptedBytes : Bytes, key : String, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

**Description:** Lower-level decryption API. Decrypts the passed bytes using the specified key and applying the transformations described by the specified parameters. See Cipher.decryptBytes(Bytes, String, String, String, Number) for full documentation.

**API Versioned:**

From version 15.5. No longer available as of version 16.2. Requires Base64-encryption for the salt parameter.

**Parameters:**

- `encryptedBytes`: The bytes to decrypt.
- `key`: The key to use for decryption.
- `transformation`: The transformation used to originally encrypt.
- `saltOrIV`: the salt or IV to use.
- `iterations`: the iterations to use.

**Returns:**

The decrypted bytes.

**See Also:**

decrypt(String, String, String, String, Number)

---

### decryptBytes

**Signature:** `decryptBytes(encryptedBytes : Bytes, privateKey : KeyRef, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

**Description:** Alternative method to decryptBytes(Bytes, String, String, String, Number), which allows to use a key in the keystore for the decryption. See Cipher.decryptBytes(Bytes, KeyRef, String, String, Number) for full documentation.

**API Versioned:**

From version 15.5. No longer available as of version 16.2. Requires Base64-encryption for the salt parameter.

**Parameters:**

- `encryptedBytes`: The bytes to decrypt.
- `privateKey`: A reference to a private key in the key store.
- `transformation`: The transformation used to originally encrypt.
- `saltOrIV`: the salt or IV to use.
- `iterations`: the iterations to use.

**Returns:**

The decrypted bytes.

---

### decryptBytes

**Signature:** `decryptBytes(encryptedBytes : Bytes, key : String, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

**Description:** Lower-level decryption API. Decrypts the passed bytes using the specified key and applying the transformations described by the specified parameters. See Cipher.decryptBytes_3(Bytes, String, String, String, Number) for full documentation.

**API Versioned:**

From version 16.2. Does not use a default initialization vector.

**Parameters:**

- `encryptedBytes`: The bytes to decrypt.
- `key`: The key to use for decryption.
- `transformation`: The transformation used to originally encrypt.
- `saltOrIV`: the salt or IV to use.
- `iterations`: the iterations to use.

**Returns:**

The decrypted bytes.

**See Also:**

decrypt_3(String, String, String, String, Number)

---

### decryptBytes

**Signature:** `decryptBytes(encryptedBytes : Bytes, privateKey : KeyRef, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

**Description:** Alternative method to decryptBytes_3(Bytes, String, String, String, Number), which allows to use a key in the keystore for the decryption. See Cipher.decryptBytes_3(Bytes, KeyRef, String, String, Number) for full documentation.

**API Versioned:**

From version 16.2. Does not use a default initialization vector.

**Parameters:**

- `encryptedBytes`: The bytes to decrypt.
- `privateKey`: A reference to a private key in the key store.
- `transformation`: The transformation used to originally encrypt.
- `saltOrIV`: the salt or IV to use.
- `iterations`: the iterations to use.

**Returns:**

The decrypted bytes.

---

### encrypt

**Signature:** `encrypt(message : String, key : String, transformation : String, saltOrIV : String, iterations : Number) : String`

**Description:** Encrypt the passed message by using the specified key and applying the transformations described by the specified parameters. See Cipher.encrypt(String, String, String, String, Number) for full documentation.

**API Versioned:**

From version 15.5. No longer available as of version 16.2. Requires Base64-encryption for the salt parameter.

**Parameters:**

- `message`: Message to encrypt (this will be converted to UTF-8 first)
- `key`: Key
- `transformation`: Transformation in "algorithm/mode/padding" format
- `saltOrIV`: Initialization value appropriate for the algorithm
- `iterations`: The number of passes to make when turning a passphrase into a key, if applicable

**Returns:**

Base64-encoded encrypted data

---

### encrypt

**Signature:** `encrypt(message : String, publicKey : CertificateRef, transformation : String, saltOrIV : String, iterations : Number) : String`

**Description:** Encrypt the passed message by using the specified key and applying the transformations described by the specified parameters. See Cipher.encrypt(String, CertificateRef, String, String, Number) for full documentation.

**API Versioned:**

From version 15.5. No longer available as of version 16.2. Requires Base64-encryption for the salt parameter.

**Parameters:**

- `message`: Message to encrypt (this will be converted to UTF-8 first)
- `publicKey`: A reference to a public key
- `transformation`: Transformation in "algorithm/mode/padding" format
- `saltOrIV`: Initialization value appropriate for the algorithm
- `iterations`: The number of passes to make when turning a passphrase into a key, if applicable

**Returns:**

Base64-encoded encrypted data

---

### encrypt

**Signature:** `encrypt(message : String, key : String, transformation : String, saltOrIV : String, iterations : Number) : String`

**Description:** Encrypt the passed message by using the specified key and applying the transformations described by the specified parameters. See Cipher.encrypt_3(String, String, String, String, Number) for full documentation.

**API Versioned:**

From version 16.2. Does not use a default initialization vector.

**Parameters:**

- `message`: Message to encrypt (this will be converted to UTF-8 first)
- `key`: Key
- `transformation`: Transformation in "algorithm/mode/padding" format
- `saltOrIV`: Initialization value appropriate for the algorithm
- `iterations`: The number of passes to make when turning a passphrase into a key, if applicable

**Returns:**

Base64-encoded encrypted data

---

### encrypt

**Signature:** `encrypt(message : String, publicKey : CertificateRef, transformation : String, saltOrIV : String, iterations : Number) : String`

**Description:** Encrypt the passed message by using the specified key and applying the transformations described by the specified parameters. See Cipher.encrypt_3(String, CertificateRef, String, String, Number) for full documentation.

**API Versioned:**

From version 16.2. Does not use a default initialization vector.

**Parameters:**

- `message`: Message to encrypt (this will be converted to UTF-8 first)
- `publicKey`: A reference to a public key
- `transformation`: Transformation in "algorithm/mode/padding" format
- `saltOrIV`: Initialization value appropriate for the algorithm
- `iterations`: The number of passes to make when turning a passphrase into a key, if applicable

**Returns:**

Base64-encoded encrypted data

---

### encryptBytes

**Signature:** `encryptBytes(messageBytes : Bytes, key : String, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

**Description:** Lower-level encryption API. Encrypts the passed bytes by using the specified key and applying the transformations described by the specified parameters. See Cipher.encryptBytes(Bytes, String, String, String, Number) for full documentation.

**API Versioned:**

From version 15.5. No longer available as of version 16.2. Requires Base64-encryption for the salt parameter.

**Parameters:**

- `messageBytes`: The bytes to encrypt.
- `key`: The key to use for encryption.
- `transformation`: Transformation in "algorithm/mode/padding" format.
- `saltOrIV`: Initialization value appropriate for the algorithm.
- `iterations`: The number of passes to make when turning a passphrase into a key.

**Returns:**

the encrypted bytes.

**See Also:**

encrypt(String, String, String, String, Number)

---

### encryptBytes

**Signature:** `encryptBytes(messageBytes : Bytes, publicKey : CertificateRef, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

**Description:** Alternative method to encryptBytes(Bytes, String, String, String, Number), which allows to use a key in the keystore for the encryption. See Cipher.encryptBytes(Bytes, CertificateRef, String, String, Number) for full documentation.

**API Versioned:**

From version 15.5. No longer available as of version 16.2. Requires Base64-encryption for the salt parameter.

**Parameters:**

- `messageBytes`: The bytes to encrypt.
- `publicKey`: A reference to a public key.
- `transformation`: Transformation in "algorithm/mode/padding" format.
- `saltOrIV`: Initialization value appropriate for the algorithm.
- `iterations`: The number of passes to make when turning a passphrase into a key.

**Returns:**

the encrypted bytes.

**See Also:**

encrypt(String, CertificateRef, String, String, Number)

---

### encryptBytes

**Signature:** `encryptBytes(messageBytes : Bytes, key : String, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

**Description:** Lower-level encryption API. Encrypts the passed bytes by using the specified key and applying the transformations described by the specified parameters. See Cipher.encryptBytes_3(Bytes, String, String, String, Number) for full documentation.

**API Versioned:**

From version 16.2. Does not use a default initialization vector.

**Parameters:**

- `messageBytes`: The bytes to encrypt.
- `key`: The key to use for encryption.
- `transformation`: Transformation in "algorithm/mode/padding" format.
- `saltOrIV`: Initialization value appropriate for the algorithm.
- `iterations`: The number of passes to make when turning a passphrase into a key.

**Returns:**

the encrypted bytes.

**See Also:**

encrypt_3(String, String, String, String, Number)

---

### encryptBytes

**Signature:** `encryptBytes(messageBytes : Bytes, publicKey : CertificateRef, transformation : String, saltOrIV : String, iterations : Number) : Bytes`

**Description:** Alternative method to encryptBytes_3(Bytes, String, String, String, Number), which allows to use a key in the keystore for the encryption. See Cipher.encryptBytes_3(Bytes, CertificateRef, String, String, Number) for full documentation.

**API Versioned:**

From version 16.2. Does not use a default initialization vector.

**Parameters:**

- `messageBytes`: The bytes to encrypt.
- `publicKey`: A reference to a public key.
- `transformation`: Transformation in "algorithm/mode/padding" format.
- `saltOrIV`: Initialization value appropriate for the algorithm.
- `iterations`: The number of passes to make when turning a passphrase into a key.

**Returns:**

the encrypted bytes.

**See Also:**

encrypt_3(String, CertificateRef, String, String, Number)

---