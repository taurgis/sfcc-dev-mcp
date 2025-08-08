## Package: dw.svc

# Class ServiceConfig

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.svc.ServiceConfig

## Description

Configuration object for Services.

## Properties

### credential

**Type:** ServiceCredential (Read Only)

The related service credentials.

### ID

**Type:** String (Read Only)

The unique Service ID.

### profile

**Type:** ServiceProfile (Read Only)

The related service profile.

### serviceType

**Type:** String (Read Only)

The type of the service, such as HTTP or SOAP.

## Constructor Summary

## Method Summary

### getCredential

**Signature:** `getCredential() : ServiceCredential`

Returns the related service credentials.

### getID

**Signature:** `getID() : String`

Returns the unique Service ID.

### getProfile

**Signature:** `getProfile() : ServiceProfile`

Returns the related service profile.

### getServiceType

**Signature:** `getServiceType() : String`

Returns the type of the service, such as HTTP or SOAP.

## Method Detail

## Method Details

### getCredential

**Signature:** `getCredential() : ServiceCredential`

**Description:** Returns the related service credentials.

**Returns:**

Related service credentials.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique Service ID.

**Returns:**

unique Service ID.

---

### getProfile

**Signature:** `getProfile() : ServiceProfile`

**Description:** Returns the related service profile.

**Returns:**

Related service profile.

---

### getServiceType

**Signature:** `getServiceType() : String`

**Description:** Returns the type of the service, such as HTTP or SOAP.

**Returns:**

Type of the service, such as HTTP or SOAP.

---