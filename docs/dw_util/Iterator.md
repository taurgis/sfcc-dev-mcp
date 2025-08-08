## Package: dw.util

# Class Iterator

## Inheritance Hierarchy

- Object
  - dw.util.Iterator

## Description

The Iterator class allows you to access items in a collection.

## Constructor Summary

## Method Summary

### asList

**Signature:** `asList() : List`

Convert the iterator into a list.

### asList

**Signature:** `asList(start : Number, size : Number) : List`

Converts a sub-sequence within the iterator into a list.

### hasNext

**Signature:** `hasNext() : boolean`

Indicates if there are more elements.

### next

**Signature:** `next() : Object`

Returns the next element from the Iterator.

## Method Detail

## Method Details

### asList

**Signature:** `asList() : List`

**Description:** Convert the iterator into a list. After this conversion the iterator is empty and hasNext() will always return false. Note: This method should be used with care. For example a large database result is pulled into memory completely with this method and can cause an OutOfMemory situation.

**Returns:**

the iterator as a list.

---

### asList

**Signature:** `asList(start : Number, size : Number) : List`

**Description:** Converts a sub-sequence within the iterator into a list. Note: This method should be used with care. For example a large database result is pulled into memory completely with this method and can cause an OutOfMemory situation.

**Parameters:**

- `start`: the number of elements to iterate before adding elements to the sublist. Negative values are treated as 0.
- `size`: the maximum number of elements to add to the sublist. Nonpositive values always result in empty list.

**Returns:**

a sub-sequence within the iterator into a list.

---

### hasNext

**Signature:** `hasNext() : boolean`

**Description:** Indicates if there are more elements.

**Returns:**

true if there are more elements, false otherwise.

---

### next

**Signature:** `next() : Object`

**Description:** Returns the next element from the Iterator.

**Returns:**

the next element from the Iterator.

---