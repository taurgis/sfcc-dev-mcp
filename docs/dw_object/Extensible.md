## Package: dw.object

# Class Extensible

## Inheritance Hierarchy

- Object
  - dw.object.Extensible

## Description

Base class alternative to ExtensibleObject for objects customizable through the metadata system. Similar to ExtensibleObject: the describe() method provides access to the related object-type metadata. The getCustom() method is the central point to retrieve and store the objects attribute values themselves.

## Properties

### custom

**Type:** CustomAttributes (Read Only)

The custom attributes for this object.

## Constructor Summary

## Method Summary

### describe

**Signature:** `describe() : ObjectTypeDefinition`

Returns the meta data of this object.

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns the custom attributes for this object.

## Method Detail

## Method Details

### describe

**Signature:** `describe() : ObjectTypeDefinition`

**Description:** Returns the meta data of this object. If no meta data is available the method returns null. The returned ObjectTypeDefinition can be used to retrieve the metadata for any of the custom attributes.

**Returns:**

the meta data of this object. If no meta data is available the method returns null.

---

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns the custom attributes for this object.

**Returns:**

the custom attributes for this object.

---