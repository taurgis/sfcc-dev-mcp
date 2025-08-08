## Package: dw.object

# Class SimpleExtensible

## Inheritance Hierarchy

- Object
  - dw.object.SimpleExtensible

## Description

Base class alternative to ExtensibleObject for customizable objects which do not rely on the metadata system. Unlike Extensible any custom attributes can be set on the fly and are not checked against an available list. Similar to Extensible method getCustom() is the central point to retrieve and store the objects attribute values.

## Properties

### custom

**Type:** CustomAttributes (Read Only)

The custom attributes for this object.

## Constructor Summary

## Method Summary

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns the custom attributes for this object.

## Method Detail

## Method Details

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns the custom attributes for this object.

**Returns:**

the custom attributes for this object.

---