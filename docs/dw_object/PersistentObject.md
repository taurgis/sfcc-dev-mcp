## Package: dw.object

# Class PersistentObject

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject

## Description

Common base class for all objects in Commerce Cloud Digital that have an identity and can be stored and retrieved. Each entity is identified by a unique universal identifier (a UUID).

## Properties

### creationDate

**Type:** Date (Read Only)

The date that this object was created.

### lastModified

**Type:** Date (Read Only)

The date that this object was last modified.

### UUID

**Type:** String (Read Only)

The unique universal identifier for this object.

## Constructor Summary

## Method Summary

### getCreationDate

**Signature:** `getCreationDate() : Date`

Returns the date that this object was created.

### getLastModified

**Signature:** `getLastModified() : Date`

Returns the date that this object was last modified.

### getUUID

**Signature:** `getUUID() : String`

Returns the unique universal identifier for this object.

## Method Detail

## Method Details

### getCreationDate

**Signature:** `getCreationDate() : Date`

**Description:** Returns the date that this object was created.

**Returns:**

the date that this object was created.

---

### getLastModified

**Signature:** `getLastModified() : Date`

**Description:** Returns the date that this object was last modified.

**Returns:**

the date that this object was last modified.

---

### getUUID

**Signature:** `getUUID() : String`

**Description:** Returns the unique universal identifier for this object.

**Returns:**

the unique universal identifier for this object.

---