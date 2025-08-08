## Package: dw.object

# Class ActiveData

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.object.ActiveData

## Description

Represents the active data for an object in Commerce Cloud Digital.

## Properties

### custom

**Type:** CustomAttributes (Read Only)

The custom attributes for this object. The returned object can
 only be used for retrieving attribute values, not storing them. See
 CustomAttributes for a detailed example of the syntax for
 working with custom attributes.

### empty

**Type:** boolean (Read Only)

Return true if the ActiveData doesn't exist for the object

## Constructor Summary

## Method Summary

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns the custom attributes for this object.

### isEmpty

**Signature:** `isEmpty() : boolean`

Return true if the ActiveData doesn't exist for the object

## Method Detail

## Method Details

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns the custom attributes for this object. The returned object can only be used for retrieving attribute values, not storing them. See CustomAttributes for a detailed example of the syntax for working with custom attributes.

**Returns:**

the custom attributes for this object.

---

### isEmpty

**Signature:** `isEmpty() : boolean`

**Description:** Return true if the ActiveData doesn't exist for the object

**Returns:**

true if ActiveData is empty, false otherwise

---