## Package: dw.util

# Class MappingKey

## Inheritance Hierarchy

- Object
  - dw.util.MappingKey

## Description

Encapsulates the key for a mapping read in with the ImportKeyValueMapping job step. Can be either single or compound keys. For example, a single string (e.g. product id) or multiple string components (e.g. product id and site).

## Properties

### keyComponents

**Type:** String (Read Only)

Gets the (possible compound) key. If the key consists of only of a single value, the string array
 will simply contain a single element.

### singleComponentKey

**Type:** String (Read Only)

Gets a key that contains only a single key component (i.e. that is not a compound key). Returns null if this is
 not a single component key.

## Constructor Summary

MappingKey(keyComponents : String...) Instantiates a new key using compound key components.

## Method Summary

### getKeyComponents

**Signature:** `getKeyComponents() : String[]`

Gets the (possible compound) key.

### getSingleComponentKey

**Signature:** `getSingleComponentKey() : String`

Gets a key that contains only a single key component (i.e.

## Constructor Detail

## Method Detail

## Method Details

### getKeyComponents

**Signature:** `getKeyComponents() : String[]`

**Description:** Gets the (possible compound) key. If the key consists of only of a single value, the string array will simply contain a single element.

**Returns:**

the key

---

### getSingleComponentKey

**Signature:** `getSingleComponentKey() : String`

**Description:** Gets a key that contains only a single key component (i.e. that is not a compound key). Returns null if this is not a single component key.

**Returns:**

the single key

---