## Package: dw.util

# Class SortedMap

## Inheritance Hierarchy

- Object
  - dw.util.Map
  - dw.util.SortedMap

## Description

A map that further guarantees that it will be in ascending key order, sorted according to the natural ordering of its keys, or by a comparator provided at sorted map creation time. This order is reflected when iterating over the sorted map's collection views (returned by the entrySet, keySet and values methods). Note that sorting by natural order is only supported for Number, String, Date, Money and Quantity as key.

## Constructor Summary

SortedMap() Constructor to create a new SortedMap.

SortedMap(comparator : Object) Constructor to create a new SortedMap.

## Method Summary

### clone

**Signature:** `clone() : SortedMap`

Returns a shallow copy of this map.

### firstKey

**Signature:** `firstKey() : Object`

Returns the first (lowest) key currently in this sorted map.

### headMap

**Signature:** `headMap(key : Object) : SortedMap`

Returns a view of the portion of this map whose keys are strictly less than toKey.

### lastKey

**Signature:** `lastKey() : Object`

Returns the last (highest) key currently in this sorted map.

### subMap

**Signature:** `subMap(from : Object, to : Object) : SortedMap`

Returns a view of the portion of this map whose keys range from fromKey, inclusive, to toKey, exclusive.

### tailMap

**Signature:** `tailMap(key : Object) : SortedMap`

Returns a view of the portion of this map whose keys are greater than or equal to fromKey.

## Constructor Detail

## Method Detail

## Method Details

### clone

**Signature:** `clone() : SortedMap`

**Description:** Returns a shallow copy of this map.

**Returns:**

a shallow copy of this map.

---

### firstKey

**Signature:** `firstKey() : Object`

**Description:** Returns the first (lowest) key currently in this sorted map.

**Returns:**

the first (lowest) key currently in this sorted map.

---

### headMap

**Signature:** `headMap(key : Object) : SortedMap`

**Description:** Returns a view of the portion of this map whose keys are strictly less than toKey.

**Parameters:**

- `key`: high endpoint (exclusive) of the headMap.

**Returns:**

a view of the portion of this map whose keys are strictly less than toKey.

---

### lastKey

**Signature:** `lastKey() : Object`

**Description:** Returns the last (highest) key currently in this sorted map.

**Returns:**

the last (highest) key currently in this sorted map.

---

### subMap

**Signature:** `subMap(from : Object, to : Object) : SortedMap`

**Description:** Returns a view of the portion of this map whose keys range from fromKey, inclusive, to toKey, exclusive. (If fromKey and toKey are equal, the returned sorted map is empty.)

**Parameters:**

- `from`: low endpoint (inclusive) of the subMap.
- `to`: high endpoint (exclusive) of the subMap.

**Returns:**

a view of the portion of this map whose keys range from fromKey, inclusive, to toKey, exclusive.

---

### tailMap

**Signature:** `tailMap(key : Object) : SortedMap`

**Description:** Returns a view of the portion of this map whose keys are greater than or equal to fromKey. The returned sorted map is backed by this map, so changes in the returned sorted map are reflected in this map, and vice-versa. The returned sorted map supports all optional map operations.

**Parameters:**

- `key`: low endpoint (inclusive) of the tailMap.

**Returns:**

a view of the portion of this map whose keys are greater than or equal to fromKey.

---