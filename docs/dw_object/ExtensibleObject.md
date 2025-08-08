## Package: dw.object

# Class ExtensibleObject

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject

## Description

Base class for all persistent business objects in Commerce Cloud Digital that are customizable through the metadata system. All objects in Digital that have custom attributes derive from ExtensibleObject including both system-defined and custom objects. The describe() method provides access to the related object-type metadata. The method getCustom() is the central point to retrieve and store the objects attribute values themselves.

## Properties

### custom

**Type:** CustomAttributes (Read Only)

The custom attributes for this object. The returned object is
 used for retrieving and storing attribute values. See
 CustomAttributes for a detailed example of the syntax for
 working with custom attributes.

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

**Description:** Returns the custom attributes for this object. The returned object is used for retrieving and storing attribute values. See CustomAttributes for a detailed example of the syntax for working with custom attributes.

**Returns:**

the custom attributes for this object.

---