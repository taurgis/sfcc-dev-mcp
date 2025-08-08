## Package: TopLevel

# Class WeakMap

## Inheritance Hierarchy

- Object
  - WeakMap

## Description

The WeakMap is map whose entries are subject to garbage collection if there are no more references to the keys. Keys must be objects (no primitives). Elements can't be iterated.

## Properties

### size

**Type:** Number

Number of key/value pairs stored in this map.

## Constructor Summary

WeakMap() Creates an empty map.

WeakMap(values : Iterable) If the passed value is null or undefined then an empty map is constructed.

## Method Summary

### clear

**Signature:** `clear() : void`

Removes all key/value pairs from this map.

### delete

**Signature:** `delete(key : Object) : boolean`

Removes the entry for the given key.

### get

**Signature:** `get(key : Object) : Object`

Returns the value associated with the given key.

### has

**Signature:** `has(key : Object) : boolean`

Returns if this map has value associated with the given key.

### set

**Signature:** `set(key : Object, value : Object) : WeakMap`

Adds or updates a key/value pair to the map.

## Constructor Detail

## Method Detail

## Method Details

### clear

**Signature:** `clear() : void`

**Description:** Removes all key/value pairs from this map.

---

### delete

**Signature:** `delete(key : Object) : boolean`

**Description:** Removes the entry for the given key.

**Parameters:**

- `key`: The key of the key/value pair to be removed from the map.

**Returns:**

true if the map contained an entry for the passed key that was removed. Else false is returned.

---

### get

**Signature:** `get(key : Object) : Object`

**Description:** Returns the value associated with the given key.

**Parameters:**

- `key`: The key to look for.

**Returns:**

The value associated with the given key if an entry with the key exists else undefined is returned.

---

### has

**Signature:** `has(key : Object) : boolean`

**Description:** Returns if this map has value associated with the given key.

**Parameters:**

- `key`: The key to look for.

**Returns:**

true if an entry with the key exists else false is returned.

---

### set

**Signature:** `set(key : Object, value : Object) : WeakMap`

**Description:** Adds or updates a key/value pair to the map.

**Parameters:**

- `key`: The key object.
- `value`: The value to be associate with the key.

**Returns:**

This map object.

---