## Package: dw.util

# Class Collection

## Inheritance Hierarchy

- Object
  - dw.util.Collection

## Description

Represents a collection of objects.

## Properties

### empty

**Type:** boolean (Read Only)

Returns true if the collection is empty.

### length

**Type:** Number (Read Only)

The length of the collection. This is similar to
 to a ECMA array of 'products.length'.

## Constructor Summary

## Method Summary

### add

**Signature:** `add(values : Object...) : boolean`

Adds the specified objects to the collection.

### add1

**Signature:** `add1(object : Object) : boolean`

The method adds a single object to the collection.

### addAll

**Signature:** `addAll(objs : Collection) : boolean`

Adds the collection of objects to the collection.

### clear

**Signature:** `clear() : void`

Clears the collection.

### contains

**Signature:** `contains(obj : Object) : boolean`

Returns true if the collection contains the specified object.

### containsAll

**Signature:** `containsAll(objs : Collection) : boolean`

Returns true if the collection contains all of the objects in the specified collection.

### getLength

**Signature:** `getLength() : Number`

Returns the length of the collection.

### isEmpty

**Signature:** `isEmpty() : boolean`

Returns true if the collection is empty.

### iterator

**Signature:** `iterator() : Iterator`

Returns an iterator that can be used to access the members of the collection.

### remove

**Signature:** `remove(obj : Object) : boolean`

Removes the specified object from the collection.

### removeAll

**Signature:** `removeAll(objs : Collection) : boolean`

Removes all of object in the specified object from the collection.

### retainAll

**Signature:** `retainAll(objs : Collection) : boolean`

Removes all of object in the collection that are not in the specified collection.

### size

**Signature:** `size() : Number`

Returns the size of the collection.

### toArray

**Signature:** `toArray() : Array`

Returns all elements of this collection in a newly created array.

### toArray

**Signature:** `toArray(start : Number, size : Number) : Array`

Returns a subset of the elements of this collection in a newly created array.

## Method Detail

## Method Details

### add

**Signature:** `add(values : Object...) : boolean`

**Description:** Adds the specified objects to the collection. The method can also be called with an ECMA array as argument. If called with a single ECMA array as argument the individual elements of that array are added to the collection. If the array object itself should be added use the method add1().

**Parameters:**

- `values`: the values to add.

**Returns:**

true if the values were added, false otherwise.

---

### add1

**Signature:** `add1(object : Object) : boolean`

**Description:** The method adds a single object to the collection.

**Parameters:**

- `object`: the object to add.

**Returns:**

true if the object was added, false otherwise.

---

### addAll

**Signature:** `addAll(objs : Collection) : boolean`

**Description:** Adds the collection of objects to the collection.

**Parameters:**

- `objs`: the objects to add.

**Returns:**

true if the objects were added, false otherwise.

---

### clear

**Signature:** `clear() : void`

**Description:** Clears the collection.

---

### contains

**Signature:** `contains(obj : Object) : boolean`

**Description:** Returns true if the collection contains the specified object.

**Parameters:**

- `obj`: the object to locate in this collection.

**Returns:**

true if the collection contains the specified object, false otherwise.

---

### containsAll

**Signature:** `containsAll(objs : Collection) : boolean`

**Description:** Returns true if the collection contains all of the objects in the specified collection.

**Parameters:**

- `objs`: the collection of objects to locate in this collection.

**Returns:**

true if the collection contains all of the specified objects, false otherwise.

---

### getLength

**Signature:** `getLength() : Number`

**Description:** Returns the length of the collection. This is similar to to a ECMA array of 'products.length'.

**Returns:**

the length of the collection.

---

### isEmpty

**Signature:** `isEmpty() : boolean`

**Description:** Returns true if the collection is empty.

**Returns:**

true if the collection is empty, false otherwise

---

### iterator

**Signature:** `iterator() : Iterator`

**Description:** Returns an iterator that can be used to access the members of the collection.

**Returns:**

an iterator that can be used to access the members of the collection.

---

### remove

**Signature:** `remove(obj : Object) : boolean`

**Description:** Removes the specified object from the collection.

**Parameters:**

- `obj`: the object to remove.

**Returns:**

true if the specified object was removed, false otherwise.

---

### removeAll

**Signature:** `removeAll(objs : Collection) : boolean`

**Description:** Removes all of object in the specified object from the collection.

**Parameters:**

- `objs`: the collection of objects to remove.

**Returns:**

true if the all of the specified objects were removed, false otherwise.

---

### retainAll

**Signature:** `retainAll(objs : Collection) : boolean`

**Description:** Removes all of object in the collection that are not in the specified collection.

**Parameters:**

- `objs`: the collection of objects to retain in the collection.

**Returns:**

true if the collection retains all of the specified objects, false otherwise.

---

### size

**Signature:** `size() : Number`

**Description:** Returns the size of the collection.

**Returns:**

the size of the collection.

---

### toArray

**Signature:** `toArray() : Array`

**Description:** Returns all elements of this collection in a newly created array. The returned array is independent of this collection and can be modified without changing the collection. The elements in the array are in the same order as they are returned when iterating over this collection.

**Returns:**

a newly created array.

---

### toArray

**Signature:** `toArray(start : Number, size : Number) : Array`

**Description:** Returns a subset of the elements of this collection in a newly created array. The returned array is independent of this collection and can be modified without changing the collection. The elements in the array are in the same order as they are returned when iterating over this collection.

**Parameters:**

- `start`: the number of elements to iterate before adding elements to the array. Negative values are treated as 0.
- `size`: the maximum number of elements to add to the array. Nonpositive values always result in empty array.

**Returns:**

a newly created array.

---