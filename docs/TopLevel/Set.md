## Package: TopLevel

# Class Set

## Inheritance Hierarchy

- Object
  - Set

## Description

A Set can store any kind of element and ensures that no duplicates exist. Objects are stored and iterated in insertion order.

## Properties

### size

**Type:** Number

Number of elements stored in this set.

## Constructor Summary

Set() Creates an empty Set.

Set(values : Iterable) If the passed value is null or undefined then an empty set is constructed.

## Method Summary

### add

**Signature:** `add(object : Object) : Set`

Adds an element to the set.

### clear

**Signature:** `clear() : void`

Removes all elements from this set.

### delete

**Signature:** `delete(object : Object) : boolean`

Removes the element from the set.

### entries

**Signature:** `entries() : ES6Iterator`

Returns an iterator containing all elements of this set.

### forEach

**Signature:** `forEach(callback : Function) : void`

Runs the provided callback function once for each element present in this set.

### forEach

**Signature:** `forEach(callback : Function, thisObject : Object) : void`

Runs the provided callback function once for each element present in this set.

### has

**Signature:** `has(object : Object) : boolean`

Returns if this set contains the given object.

## Constructor Detail

## Method Detail

## Method Details

### add

**Signature:** `add(object : Object) : Set`

**Description:** Adds an element to the set. Does nothing if the set already contains the element.

**Parameters:**

- `object`: The object to add.

**Returns:**

This set object.

---

### clear

**Signature:** `clear() : void`

**Description:** Removes all elements from this set.

---

### delete

**Signature:** `delete(object : Object) : boolean`

**Description:** Removes the element from the set.

**Parameters:**

- `object`: The object to be removed.

**Returns:**

true if the set contained the object that was removed. Else false is returned.

---

### entries

**Signature:** `entries() : ES6Iterator`

**Description:** Returns an iterator containing all elements of this set.

---

### forEach

**Signature:** `forEach(callback : Function) : void`

**Description:** Runs the provided callback function once for each element present in this set.

**Parameters:**

- `callback`: The function to call, which is invoked with three arguments: the element (as value), the element (as index), and the Set object being iterated.

---

### forEach

**Signature:** `forEach(callback : Function, thisObject : Object) : void`

**Description:** Runs the provided callback function once for each element present in this set.

**Parameters:**

- `callback`: The function to call, which is invoked with three arguments: the element (as value), the element (as index), and the Set object being iterated.
- `thisObject`: The Object to use as 'this' when executing callback.

---

### has

**Signature:** `has(object : Object) : boolean`

**Description:** Returns if this set contains the given object.

**Parameters:**

- `object`: The object to look for.

**Returns:**

true if the set contains the object else false is returned.

---