## Package: dw.svc

# Class SOAPService

## Inheritance Hierarchy

- Object
  - dw.svc.Service
  - dw.svc.SOAPService

## Description

Represents a SOAP WebService.

## Properties

### authentication

**Type:** String

The authentication type.

### serviceClient

**Type:** Object

The serviceClient object.

## Constructor Summary

## Method Summary

### getAuthentication

**Signature:** `getAuthentication() : String`

Returns the authentication type.

### getServiceClient

**Signature:** `getServiceClient() : Object`

Returns the serviceClient object.

### setAuthentication

**Signature:** `setAuthentication(authentication : String) : SOAPService`

Sets the type of authentication.

### setServiceClient

**Signature:** `setServiceClient(o : Object) : SOAPService`

Sets the serviceClient object.

## Method Detail

## Method Details

### getAuthentication

**Signature:** `getAuthentication() : String`

**Description:** Returns the authentication type.

**Returns:**

Authentication type.

---

### getServiceClient

**Signature:** `getServiceClient() : Object`

**Description:** Returns the serviceClient object.

**Returns:**

serviceClient object.

---

### setAuthentication

**Signature:** `setAuthentication(authentication : String) : SOAPService`

**Description:** Sets the type of authentication. Valid values include "BASIC" and "NONE". The default value is BASIC.

**Parameters:**

- `authentication`: Type of authentication.

**Returns:**

this SOAP WebService.

---

### setServiceClient

**Signature:** `setServiceClient(o : Object) : SOAPService`

**Description:** Sets the serviceClient object. This must be set in the prepareCall method, prior to execute being called.

**Parameters:**

- `o`: serviceClient object.

**Returns:**

this SOAP WebService.

---