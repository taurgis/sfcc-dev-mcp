## Package: TopLevel

# Class WeakSet

## Inheritance Hierarchy

- Object
  - WeakSet

## Description

The WeakSet is set whose elements are subject to garbage collection if there are no more references to the elements. Only objects (no primitives) can be stored. Elements can't be iterated.

## Constructor Summary

WeakSet() Creates an empty Set.

WeakSet(values : Iterable) If the passed value is null or undefined then an empty set is constructed.

## Method Summary

### add

**Signature:** `add(object : Object) : WeakSet`

Adds an element to the set.

### delete

**Signature:** `delete(object : Object) : boolean`

Removes the element from the set.

### has

**Signature:** `has(object : Object) : boolean`

Returns if this set contains the given object.

## Constructor Detail

## Method Detail

## Method Details

### add

**Signature:** `add(object : Object) : WeakSet`

**Description:** Adds an element to the set. Does nothing if the set already contains the element.

**Parameters:**

- `object`: The object to add.

**Returns:**

This set object.

---

### delete

**Signature:** `delete(object : Object) : boolean`

**Description:** Removes the element from the set.

**Parameters:**

- `object`: The object to be removed.

**Returns:**

true if the set contained the object that was removed. Else false is returned.

---

### has

**Signature:** `has(object : Object) : boolean`

**Description:** Returns if this set contains the given object.

**Parameters:**

- `object`: The object to look for.

**Returns:**

true if the set contains the object else false is returned.

---