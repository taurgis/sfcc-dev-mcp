## Package: dw.util

# Class SortedSet

## Inheritance Hierarchy

- Object
  - dw.util.Collection
  - dw.util.Set
    - dw.util.SortedSet

## Description

A set that further guarantees that its iterator will traverse the set in ascending element order, sorted according to the natural ordering of its elements (only supported for Number, String, Date, Money and Quantity), or by a comparator provided at sorted set creation time.

## Constructor Summary

SortedSet() Constructor to create a new SortedSet.

SortedSet(comparator : Object) Constructor to create a new SortedSet.

SortedSet(collection : Collection) Constructor for a new SortedSet.

## Method Summary

### clone

**Signature:** `clone() : SortedSet`

Returns a shallow copy of this set.

### first

**Signature:** `first() : Object`

Returns the first (lowest) element currently in this sorted set.

### headSet

**Signature:** `headSet(key : Object) : SortedSet`

Returns a view of the portion of this sorted set whose elements are strictly less than toElement.

### last

**Signature:** `last() : Object`

Returns the last (highest) element currently in this sorted set.

### subSet

**Signature:** `subSet(from : Object, to : Object) : SortedSet`

Returns a view of the portion of this sorted set whose elements range from fromElement, inclusive, to toElement, exclusive.

### tailSet

**Signature:** `tailSet(key : Object) : SortedSet`

Returns a view of the portion of this sorted set whose elements are greater than or equal to fromElement.

## Constructor Detail

## Method Detail

## Method Details

### clone

**Signature:** `clone() : SortedSet`

**Description:** Returns a shallow copy of this set.

**Returns:**

a shallow copy of this set.

---

### first

**Signature:** `first() : Object`

**Description:** Returns the first (lowest) element currently in this sorted set.

**Returns:**

the first (lowest) element currently in this sorted set.

---

### headSet

**Signature:** `headSet(key : Object) : SortedSet`

**Description:** Returns a view of the portion of this sorted set whose elements are strictly less than toElement. The returned sorted set is backed by this sorted set, so changes in the returned sorted set are reflected in this sorted set, and vice-versa. The returned sorted set supports all optional set operations.

**Parameters:**

- `key`: high endpoint (exclusive) of the headSet.

**Returns:**

a view of the specified initial range of this sorted set.

---

### last

**Signature:** `last() : Object`

**Description:** Returns the last (highest) element currently in this sorted set.

**Returns:**

the last (highest) element currently in this sorted set.

---

### subSet

**Signature:** `subSet(from : Object, to : Object) : SortedSet`

**Description:** Returns a view of the portion of this sorted set whose elements range from fromElement, inclusive, to toElement, exclusive. (If fromElement and toElement are equal, the returned sorted set is empty.) The returned sorted set is backed by this sorted set, so changes in the returned sorted set are reflected in this sorted set, and vice-versa. The returned sorted set supports all optional set operations that this sorted set supports.

**Parameters:**

- `from`: low endpoint (inclusive) of the subSet.
- `to`: high endpoint (exclusive) of the subSet.

**Returns:**

a view of the specified range within this sorted set.

---

### tailSet

**Signature:** `tailSet(key : Object) : SortedSet`

**Description:** Returns a view of the portion of this sorted set whose elements are greater than or equal to fromElement. The returned sorted set is backed by this sorted set, so changes in the returned sorted set are reflected in this sorted set, and vice-versa. The returned sorted set supports all optional set operations.

**Parameters:**

- `key`: low endpoint (inclusive) of the tailSet.

**Returns:**

a view of the specified final range of this sorted set.

---