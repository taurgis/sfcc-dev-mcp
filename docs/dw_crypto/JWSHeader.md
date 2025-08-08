## Package: dw.crypto

# Class JWSHeader

## Inheritance Hierarchy

- Object
  - dw.crypto.JWSHeader

## Description

This class represents an immutable header of a JWS (JSON Web Signature) object.

## Properties

### algorithm

**Type:** String (Read Only)

Get the value of the algorithm parameter (alg).

## Constructor Summary

## Method Summary

### getAlgorithm

**Signature:** `getAlgorithm() : String`

Get the value of the algorithm parameter (alg).

### parse

**Signature:** `static parse(map : Map) : JWSHeader`

Convert the given map into a JWS header.

### parseEncoded

**Signature:** `static parseEncoded(base64encoded : String) : JWSHeader`

Parse the given string as a Base64URL-encoded JWS header.

### parseJSON

**Signature:** `static parseJSON(json : String) : JWSHeader`

Parse the given string as a JWS header.

### toMap

**Signature:** `toMap() : Map`

Get a copy of these headers as a Map.

### toString

**Signature:** `toString() : String`

Get the content of the headers as a JSON String.

## Method Detail

## Method Details

### getAlgorithm

**Signature:** `getAlgorithm() : String`

**Description:** Get the value of the algorithm parameter (alg).

**Returns:**

Algorithm parameter from this header.

---

### parse

**Signature:** `static parse(map : Map) : JWSHeader`

**Description:** Convert the given map into a JWS header. All keys correspond to JWS parameters. The algorithm parameter (alg) is required. See JWS.verify(CertificateRef) for supported values.

**Parameters:**

- `map`: Map data to convert.

**Returns:**

JWS Header.

---

### parseEncoded

**Signature:** `static parseEncoded(base64encoded : String) : JWSHeader`

**Description:** Parse the given string as a Base64URL-encoded JWS header. The algorithm parameter (alg) is required. See JWS.verify(CertificateRef) for supported values.

**Parameters:**

- `base64encoded`: Base64URL string to parse.

**Returns:**

JWS Header.

---

### parseJSON

**Signature:** `static parseJSON(json : String) : JWSHeader`

**Description:** Parse the given string as a JWS header. The algorithm parameter (alg) is required. See JWS.verify(CertificateRef) for supported values.

**Parameters:**

- `json`: JSON string to parse.

**Returns:**

JWS Header.

---

### toMap

**Signature:** `toMap() : Map`

**Description:** Get a copy of these headers as a Map.

**Returns:**

Copy of the JWS headers.

---

### toString

**Signature:** `toString() : String`

**Description:** Get the content of the headers as a JSON String.

**Returns:**

JSON String.

---