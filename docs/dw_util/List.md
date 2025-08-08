## Package: dw.util

# Class List

## Inheritance Hierarchy

- Object
  - dw.util.Collection
  - dw.util.List

## Description

An ordered collection of objects. The user of a List has precise control over where in the list each element is inserted. The user can access elements by their integer index (position in the list), and search for elements in the list. Lists are zero based similar to arrays. Unlike sets, lists allow duplicate elements.

## Properties

## Constructor Summary

## Method Summary

### addAt

**Signature:** `addAt(index : Number, value : Object) : void`

Adds the specified object into the list at the specified index.

### concat

**Signature:** `concat(values : Object...) : List`

Creates and returns a new List that is the result of concatenating this list with each of the specified values.

### fill

**Signature:** `fill(obj : Object) : void`

Replaces all of the elements in the list with the given object.

### get

**Signature:** `get(index : Number) : Object`

Returns the object at the specified index.

### indexOf

**Signature:** `indexOf(value : Object) : Number`

Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.

### join

**Signature:** `join() : String`

Converts all elements of the list to a string by calling the toString() method and then concatenates them together, with a comma between elements.

### join

**Signature:** `join(separator : String) : String`

Converts all elements of the list to a string by calling the toString() method and then concatenates them together, with the separator string between elements.

### lastIndexOf

**Signature:** `lastIndexOf(value : Object) : Number`

Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.

### pop

**Signature:** `pop() : Object`

Removes and returns the last element from the list.

### push

**Signature:** `push(values : Object...) : Number`

Appends the specified values to the end of the list in order.

### removeAt

**Signature:** `removeAt(index : Number) : Object`

Removes the object at the specified index.

### replaceAll

**Signature:** `replaceAll(oldValue : Object, newValue : Object) : boolean`

Replaces all occurrences of oldValue with newValue.

### reverse

**Signature:** `reverse() : void`

Reverses the order of the elements in the list.

### rotate

**Signature:** `rotate(distance : Number) : void`

Rotates the elements in the list by the specified distance.

### set

**Signature:** `set(index : Number, value : Object) : Object`

Replaces the object at the specified index in this list with the specified object.

### shift

**Signature:** `shift() : Object`

Removes and returns the first element of the list.

### shuffle

**Signature:** `shuffle() : void`

Randomly permutes the elements in the list.

### size

**Signature:** `size() : Number`

Returns the size of this list.

### slice

**Signature:** `slice(from : Number) : List`

Returns a slice, or sublist, of this list.

### slice

**Signature:** `slice(from : Number, to : Number) : List`

Returns a slice, or sublist, of this list.

### sort

**Signature:** `sort() : void`

Sorts the elements of the list based on their natural order.

### sort

**Signature:** `sort(comparator : Object) : void`

Sorts the elements of a list.

### subList

**Signature:** `subList(from : Number, to : Number) : List`

Returns a list containing the elements in this list identified by the specified arguments.

### swap

**Signature:** `swap(i : Number, j : Number) : void`

Swaps the elements at the specified positions in the list.

### unshift

**Signature:** `unshift(values : Object...) : Number`

Inserts values at the beginning of the list.

## Method Detail

## Method Details

### addAt

**Signature:** `addAt(index : Number, value : Object) : void`

**Description:** Adds the specified object into the list at the specified index.

**Parameters:**

- `index`: the index to use.
- `value`: the object to insert.

---

### concat

**Signature:** `concat(values : Object...) : List`

**Description:** Creates and returns a new List that is the result of concatenating this list with each of the specified values. This list itself is unmodified. If any of the specified values is itself an array or a Collection, then the elements of that Collection or array are appended to the new list rather than the object itself.

**Parameters:**

- `values`: one or more objects to concatenate.

**Returns:**

a new List that is the result of concatenating this list with each of the specified values.

---

### fill

**Signature:** `fill(obj : Object) : void`

**Description:** Replaces all of the elements in the list with the given object.

**Parameters:**

- `obj`: the object to use during replacement.

---

### get

**Signature:** `get(index : Number) : Object`

**Description:** Returns the object at the specified index.

**Parameters:**

- `index`: the index to use.

**Returns:**

the object at the specified index.

---

### indexOf

**Signature:** `indexOf(value : Object) : Number`

**Description:** Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.

**Parameters:**

- `value`: the element to use.

**Returns:**

the index of the specified object or -1 if the passed object is not found in the list.

---

### join

**Signature:** `join() : String`

**Description:** Converts all elements of the list to a string by calling the toString() method and then concatenates them together, with a comma between elements.

**Returns:**

The string that results from converting each element of the list to a string and then concatenating them together, with a comma between elements.

---

### join

**Signature:** `join(separator : String) : String`

**Description:** Converts all elements of the list to a string by calling the toString() method and then concatenates them together, with the separator string between elements. If null is passed, then the comma character is used as a separator.

**Parameters:**

- `separator`: The separator string. May be null in which case the comma character is used.

**Returns:**

The string that results from converting each element of the list to a string and then concatenating them together, with the separator string between elements.

---

### lastIndexOf

**Signature:** `lastIndexOf(value : Object) : Number`

**Description:** Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.

**Parameters:**

- `value`: the element to use.

**Returns:**

the last index of the specified object or -1 if the passed object is not found in the list.

---

### pop

**Signature:** `pop() : Object`

**Description:** Removes and returns the last element from the list.

**Returns:**

The last element of the list or null if the list is already empty.

---

### push

**Signature:** `push(values : Object...) : Number`

**Description:** Appends the specified values to the end of the list in order.

**Parameters:**

- `values`: One or more values to be appended to the end of the list.

**Returns:**

The new length of the list, after the specified values are appended to it.

---

### removeAt

**Signature:** `removeAt(index : Number) : Object`

**Description:** Removes the object at the specified index.

**Parameters:**

- `index`: the index to use.

**Returns:**

the object that was removed.

---

### replaceAll

**Signature:** `replaceAll(oldValue : Object, newValue : Object) : boolean`

**Description:** Replaces all occurrences of oldValue with newValue.

**Parameters:**

- `oldValue`: the old object.
- `newValue`: the new object.

**Returns:**

true if one or more elements were replaced, false otherwise.

---

### reverse

**Signature:** `reverse() : void`

**Description:** Reverses the order of the elements in the list.

---

### rotate

**Signature:** `rotate(distance : Number) : void`

**Description:** Rotates the elements in the list by the specified distance.

**Parameters:**

- `distance`: the distance to use.

---

### set

**Signature:** `set(index : Number, value : Object) : Object`

**Description:** Replaces the object at the specified index in this list with the specified object.

**Parameters:**

- `index`: the index to use.
- `value`: the object to use when replacing the existing object.

**Returns:**

the replaced object.

---

### shift

**Signature:** `shift() : Object`

**Description:** Removes and returns the first element of the list. If the list is already empty, this method simply returns null.

**Returns:**

The former first element of the list, or null is list is already empty.

---

### shuffle

**Signature:** `shuffle() : void`

**Description:** Randomly permutes the elements in the list.

---

### size

**Signature:** `size() : Number`

**Description:** Returns the size of this list.

**Returns:**

the size of this list.

---

### slice

**Signature:** `slice(from : Number) : List`

**Description:** Returns a slice, or sublist, of this list. The returned list contains the element specified by from and all subsequent elements up to the end of this list.

**Parameters:**

- `from`: The index at which the slice is to begin. If negative, this argument specifies a position measured from the end of this list. That, -1 indicates the last element, -2 indicates the next from the last element, and so on.

**Returns:**

A new List that contains the elements of this list from the element specified by from up to the end of this list.

---

### slice

**Signature:** `slice(from : Number, to : Number) : List`

**Description:** Returns a slice, or sublist, of this list. The returned list contains the element specified by from and all subsequent elements up to, but not including, the element specified by to.

**Parameters:**

- `from`: The index at which the slice is to begin. If negative, this argument specifies a position measured from the end of this list. That, -1 indicates the last element, -2 indicates the next from the last element, and so on.
- `to`: The index immediately after the end of the slice. If this argument is negative, it specifies an element measured from the end of this list.

**Returns:**

A new List that contains the elements of this list from the element specified by from up to, but not including, the element specified by to.

---

### sort

**Signature:** `sort() : void`

**Description:** Sorts the elements of the list based on their natural order. This sort is guaranteed to be stable: equal elements will not be reordered as a result of the sort.

---

### sort

**Signature:** `sort(comparator : Object) : void`

**Description:** Sorts the elements of a list. The order of the elements is determined with a comparator (see PropertyComparator) or with the help of the given function. The function must take two parameters and return a value <0 if the first parameter is smaller than the second, a value of 0 if both are equal and a value if >0 if the first one is greater than the second parameter. This sort is guaranteed to be stable: equal elements will not be reordered as a result of the sort.

**Parameters:**

- `comparator`: an instance of a PropertyComparator or a comparison function

---

### subList

**Signature:** `subList(from : Number, to : Number) : List`

**Description:** Returns a list containing the elements in this list identified by the specified arguments.

**Parameters:**

- `from`: the beginning index of the elements to move to the new list.
- `to`: the ending index of the elements to move to the new list.

**Returns:**

the new list containing the elements.

---

### swap

**Signature:** `swap(i : Number, j : Number) : void`

**Description:** Swaps the elements at the specified positions in the list.

**Parameters:**

- `i`: the first element to swap.
- `j`: the second element to swap.

---

### unshift

**Signature:** `unshift(values : Object...) : Number`

**Description:** Inserts values at the beginning of the list. The first argument becomes the new element 0; the second argument becomes element 1; and so on.

**Parameters:**

- `values`: The values to insert into the list.

**Returns:**

The new length of the lest.

---