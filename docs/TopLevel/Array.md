## Package: TopLevel

# Class Array

## Inheritance Hierarchy

- Object
  - Array

## Description

An Array of items.

## Properties

### length

**Type:** Number

The length of the Array.

## Constructor Summary

Array() Constructs an Array.

Array(length : Number) Constructs an Array of the specified length.

Array(values : Object...) Constructs an Array using the specified values.

## Method Summary

### concat

**Signature:** `concat(values : Object...) : Array`

Constructs an Array by concatenating multiple values.

### copyWithin

**Signature:** `copyWithin(target : Number, start : Number, end : Number) : Array`

Copies elements within this array.

### entries

**Signature:** `entries() : ES6Iterator`

Returns an iterator containing all index/value pairs of this array.

### every

**Signature:** `every(callback : Function) : boolean`

Returns true if every element in this array satisfies the test performed in the callback function.

### every

**Signature:** `every(callback : Function, thisObject : Object) : boolean`

Returns true if every element in the thisObject argument satisfies the test performed in the callback function, false otherwise.

### fill

**Signature:** `fill(value : Object, start : Number, end : Number) : Array`

Sets multiple entries of this array to specific value.

### filter

**Signature:** `filter(callback : Function) : Array`

Returns a new Array with all of the elements that pass the test implemented by the callback function.

### filter

**Signature:** `filter(callback : Function, thisObject : Object) : Array`

Returns a new Array with all of the elements that pass the test implemented by the callback function that is run against the specified Array, thisObject.

### find

**Signature:** `find(callback : Function, thisObject : Object) : Object`

Returns the first value within the array that satisfies the test defined in the callback function.

### findIndex

**Signature:** `findIndex(callback : Function, thisObject : Object) : Number`

Returns the index of the first value within the array that satisfies the test defined in the callback function.

### forEach

**Signature:** `forEach(callback : Function) : void`

Runs the provided callback function once for each element present in the Array.

### forEach

**Signature:** `forEach(callback : Function, thisObject : Object) : void`

Runs the provided callback function once for each element present in the specified Array, thisObject.

### from

**Signature:** `static from(arrayLike : Object, mapFn : Function, thisObject : Object) : Array`

Creates a new array from an array-like object or an Iterable.

### includes

**Signature:** `includes(valueToFind : Object, fromIndex : Number) : boolean`

Returns if the array contains a specific value.

### indexOf

**Signature:** `indexOf(elementToLocate : Object) : Number`

Returns the first index at which a given element can be found in the array, or -1 if it is not present.

### indexOf

**Signature:** `indexOf(elementToLocate : Object, fromIndex : Number) : Number`

Returns the first index at which a given element can be found in the array starting at fromIndex, or -1 if it is not present.

### isArray

**Signature:** `static isArray(object : Object) : boolean`

Checks if the passed object is an array.

### join

**Signature:** `join() : String`

Converts all Array elements to Strings and concatenates them.

### join

**Signature:** `join(separator : String) : String`

Converts all array elements to Strings and concatenates them.

### keys

**Signature:** `keys() : ES6Iterator`

Returns an iterator containing all indexes of this array.

### lastIndexOf

**Signature:** `lastIndexOf(elementToLocate : Object) : Number`

Returns the last index at which a given element can be found in the array, or -1 if it is not present.

### lastIndexOf

**Signature:** `lastIndexOf(elementToLocate : Object, fromIndex : Number) : Number`

Returns the last index at which a given element can be found in the array starting at fromIndex, or -1 if it is not present.

### map

**Signature:** `map(callback : Function) : Array`

Creates a new Array with the results of calling the specified function on every element in this Array.

### map

**Signature:** `map(callback : Function, thisObject : Object) : Array`

Creates a new Array with the results of calling the specified function on every element in the specified Array.

### of

**Signature:** `static of(values : Object...) : Array`

Creates a new array from a variable list of elements.

### pop

**Signature:** `pop() : Object`

Removes and returns the last element of the Array.

### push

**Signature:** `push(values : Object...) : Number`

Appends elements to the Array.

### reverse

**Signature:** `reverse() : void`

Reverses the order of the elements in the Array.

### shift

**Signature:** `shift() : Object`

Shifts elements down in the Array and returns the former first element.

### slice

**Signature:** `slice(start : Number, end : Number) : Array`

Returns a new Array containing a portion of the Array using the specified start and end positions.

### some

**Signature:** `some(callback : Function) : boolean`

Returns true if any of the elements in the Array pass the test defined in the callback function, false otherwise.

### some

**Signature:** `some(callback : Function, thisObject : Object) : boolean`

Returns true if any of the elements in the specified Array pass the test defined in the callback function, false otherwise.

### sort

**Signature:** `sort() : Array`

Sorts the elements of the Array in alphabetical order based on character encoding.

### sort

**Signature:** `sort(function : Function) : Array`

Sorts the elements of the Array in alphabetical order based on character encoding.

### splice

**Signature:** `splice(start : Number, deleteCount : Number, values : Object...) : Array`

Deletes the specified number of elements from the Array at the specified position, and then inserts values into the Array at that location.

### toLocaleString

**Signature:** `toLocaleString() : String`

Converts the Array to a localized String.

### toString

**Signature:** `toString() : String`

Converts the Array to a String.

### unshift

**Signature:** `unshift(values : Object...) : Number`

Inserts elements at the beginning of the Array.

### values

**Signature:** `values() : ES6Iterator`

Returns an iterator containing all values of this array.

## Constructor Detail

## Method Detail

## Method Details

### concat

**Signature:** `concat(values : Object...) : Array`

**Description:** Constructs an Array by concatenating multiple values.

**Parameters:**

- `values`: one or more Array values.

**Returns:**

a new Array containing the concatenated values.

---

### copyWithin

**Signature:** `copyWithin(target : Number, start : Number, end : Number) : Array`

**Description:** Copies elements within this array. The array length is not changed.

**API Versioned:**

From version 21.2.

**Parameters:**

- `target`: The target of the first element to copy.
- `start`: Optional. The first index to copy. Default is 0.
- `end`: Optional. The index of the end. This element is not included. Default is copy all to the array end.

**Returns:**

This array.

---

### entries

**Signature:** `entries() : ES6Iterator`

**Description:** Returns an iterator containing all index/value pairs of this array. The iterator produces a series of two-element arrays with the first element as the index and the second element as the value.

**API Versioned:**

From version 21.2.

---

### every

**Signature:** `every(callback : Function) : boolean`

**Description:** Returns true if every element in this array satisfies the test performed in the callback function. The callback function is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

**Parameters:**

- `callback`: the function to call to determine if every element in this array satisfies the test defined by the function. The callback function is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

**Returns:**

true if every element in this array satisfies the test performed in the callback function.

**See Also:**

Function

---

### every

**Signature:** `every(callback : Function, thisObject : Object) : boolean`

**Description:** Returns true if every element in the thisObject argument satisfies the test performed in the callback function, false otherwise. The callback function is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

**Parameters:**

- `callback`: the function to call to determine if every element in this array satisfies the test defined by the function. The callback function is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.
- `thisObject`: the Object to use as 'this' when executing callback.

**Returns:**

true if every element in thisObject satisfies the test performed in the callback function, false otherwise.

**See Also:**

Function

---

### fill

**Signature:** `fill(value : Object, start : Number, end : Number) : Array`

**Description:** Sets multiple entries of this array to specific value.

**API Versioned:**

From version 21.2.

**Parameters:**

- `value`: The value to set.
- `start`: Optional. The first index to copy. Default is 0.
- `end`: Optional. The index of the end. This element is not included. Default is copy all to the array end.

**Returns:**

This array.

---

### filter

**Signature:** `filter(callback : Function) : Array`

**Description:** Returns a new Array with all of the elements that pass the test implemented by the callback function. The callback function is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

**Parameters:**

- `callback`: the function that is called on this Array and which returns a new Array containing the elements that satisfy the function's test. The callback function is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

**Returns:**

a new Array containing the elements that satisfy the function's test.

---

### filter

**Signature:** `filter(callback : Function, thisObject : Object) : Array`

**Description:** Returns a new Array with all of the elements that pass the test implemented by the callback function that is run against the specified Array, thisObject. The callback function is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

**Parameters:**

- `callback`: the function that is called on the thisObject Array and which returns a new Array containing the elements that satisfy the function's test. The callback function is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.
- `thisObject`: the Object to use as 'this' when executing callback.

**Returns:**

a new Array containing the elements that satisfy the function's test.

---

### find

**Signature:** `find(callback : Function, thisObject : Object) : Object`

**Description:** Returns the first value within the array that satisfies the test defined in the callback function.

**API Versioned:**

From version 21.2.

**Parameters:**

- `callback`: The function to call, which is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.
- `thisObject`: The object to use as 'this' when executing callback.

**Returns:**

The first value within the array that satisfies the test defined in the callback function, undefined if no matching value was found.

---

### findIndex

**Signature:** `findIndex(callback : Function, thisObject : Object) : Number`

**Description:** Returns the index of the first value within the array that satisfies the test defined in the callback function.

**API Versioned:**

From version 21.2.

**Parameters:**

- `callback`: The function to call, which is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.
- `thisObject`: The object to use as 'this' when executing callback.

**Returns:**

The index of the first value within the array that satisfies the test defined in the callback function, -1 if no matching value was found.

---

### forEach

**Signature:** `forEach(callback : Function) : void`

**Description:** Runs the provided callback function once for each element present in the Array. The callback function is invoked only for indexes of the Array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned a value.

**Parameters:**

- `callback`: the function to call, which is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

---

### forEach

**Signature:** `forEach(callback : Function, thisObject : Object) : void`

**Description:** Runs the provided callback function once for each element present in the specified Array, thisObject. The callback function is invoked only for indexes of the Array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned a value.

**Parameters:**

- `callback`: the function to call, which is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.
- `thisObject`: the Object to use as 'this' when executing callback.

---

### from

**Signature:** `static from(arrayLike : Object, mapFn : Function, thisObject : Object) : Array`

**Description:** Creates a new array from an array-like object or an Iterable.

**API Versioned:**

From version 21.2.

**Parameters:**

- `arrayLike`: An array-like object or an iterable that provides the elements for the new array.
- `mapFn`: Optional. A function that maps the input elements into the value for the new array.
- `thisObject`: Optional. The Object to use as 'this' when executing mapFn.

**Returns:**

The newly created array.

---

### includes

**Signature:** `includes(valueToFind : Object, fromIndex : Number) : boolean`

**Description:** Returns if the array contains a specific value.

**API Versioned:**

From version 21.2.

**Parameters:**

- `valueToFind`: The value to look for.
- `fromIndex`: Optional. The index to start from.

**Returns:**

true if the value is found in the array else false.

---

### indexOf

**Signature:** `indexOf(elementToLocate : Object) : Number`

**Description:** Returns the first index at which a given element can be found in the array, or -1 if it is not present.

**Parameters:**

- `elementToLocate`: the element to locate in the Array.

**Returns:**

the index of the element or -1 if it is no preset.

---

### indexOf

**Signature:** `indexOf(elementToLocate : Object, fromIndex : Number) : Number`

**Description:** Returns the first index at which a given element can be found in the array starting at fromIndex, or -1 if it is not present.

**Parameters:**

- `elementToLocate`: the element to locate in the Array.
- `fromIndex`: the index from which to start looking for the element.

**Returns:**

the index of the element or -1 if it is no preset.

---

### isArray

**Signature:** `static isArray(object : Object) : boolean`

**Description:** Checks if the passed object is an array.

**Parameters:**

- `object`: The object to ckeck.

**Returns:**

true if the passed object is an array else false.

---

### join

**Signature:** `join() : String`

**Description:** Converts all Array elements to Strings and concatenates them.

**Returns:**

a concatenated list of all Array elements as a String.

---

### join

**Signature:** `join(separator : String) : String`

**Description:** Converts all array elements to Strings and concatenates them.

**Parameters:**

- `separator`: an optional character or string used to separate one element of the Array from the next element in the return String.

**Returns:**

a concatenated list of all Array elements as a String where the specified delimiter is used to separate elements.

---

### keys

**Signature:** `keys() : ES6Iterator`

**Description:** Returns an iterator containing all indexes of this array.

**API Versioned:**

From version 21.2.

---

### lastIndexOf

**Signature:** `lastIndexOf(elementToLocate : Object) : Number`

**Description:** Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards.

**Parameters:**

- `elementToLocate`: the element to locate in the Array.

**Returns:**

the index of the element or -1 if it is no preset.

---

### lastIndexOf

**Signature:** `lastIndexOf(elementToLocate : Object, fromIndex : Number) : Number`

**Description:** Returns the last index at which a given element can be found in the array starting at fromIndex, or -1 if it is not present. The array is searched backwards.

**Parameters:**

- `elementToLocate`: the element to locate in the Array.
- `fromIndex`: the index from which to start looking for the element. The array is searched backwards.

**Returns:**

the index of the element or -1 if it is no present.

---

### map

**Signature:** `map(callback : Function) : Array`

**Description:** Creates a new Array with the results of calling the specified function on every element in this Array. The callback function is invoked only for indexes of the Array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values.

**Parameters:**

- `callback`: the function to call, which is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

**Returns:**

a new Array with the results of calling the specified function on every element in this Array.

---

### map

**Signature:** `map(callback : Function, thisObject : Object) : Array`

**Description:** Creates a new Array with the results of calling the specified function on every element in the specified Array. The callback function is invoked only for indexes of the Array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values.

**Parameters:**

- `callback`: the function to call, which is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.
- `thisObject`: the Object to use as 'this' when executing callback.

**Returns:**

a new Array with the results of calling the specified function on every element in this Array.

---

### of

**Signature:** `static of(values : Object...) : Array`

**Description:** Creates a new array from a variable list of elements.

**API Versioned:**

From version 21.2.

**Parameters:**

- `values`: The array values.

**Returns:**

The newly created array.

---

### pop

**Signature:** `pop() : Object`

**Description:** Removes and returns the last element of the Array.

**Returns:**

the last element of the Array.

---

### push

**Signature:** `push(values : Object...) : Number`

**Description:** Appends elements to the Array.

**Parameters:**

- `values`: one or more values that will be appended to the Array.

**Returns:**

the new length of the Array.

---

### reverse

**Signature:** `reverse() : void`

**Description:** Reverses the order of the elements in the Array.

---

### shift

**Signature:** `shift() : Object`

**Description:** Shifts elements down in the Array and returns the former first element.

**Returns:**

the former first element.

---

### slice

**Signature:** `slice(start : Number, end : Number) : Array`

**Description:** Returns a new Array containing a portion of the Array using the specified start and end positions.

**Parameters:**

- `start`: the location in the Array to start the slice operation.
- `end`: the location in the Array to stop the slice operation.

**Returns:**

a new Array containing the members bound by start and end.

---

### some

**Signature:** `some(callback : Function) : boolean`

**Description:** Returns true if any of the elements in the Array pass the test defined in the callback function, false otherwise.

**Parameters:**

- `callback`: the function to call, which is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.

**Returns:**

true if any of the elements in the Array pass the test defined in the callback function, false otherwise.

---

### some

**Signature:** `some(callback : Function, thisObject : Object) : boolean`

**Description:** Returns true if any of the elements in the specified Array pass the test defined in the callback function, false otherwise.

**Parameters:**

- `callback`: the function to call, which is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.
- `thisObject`: the Object to use as 'this' when executing callback.

**Returns:**

true if any of the elements in the Array pass the test defined in the callback function, false otherwise.

---

### sort

**Signature:** `sort() : Array`

**Description:** Sorts the elements of the Array in alphabetical order based on character encoding. This sort is guaranteed to be stable: equal elements will not be reordered as a result of the sort.

**Returns:**

a reference to the Array.

---

### sort

**Signature:** `sort(function : Function) : Array`

**Description:** Sorts the elements of the Array in alphabetical order based on character encoding. This sort is guaranteed to be stable: equal elements will not be reordered as a result of the sort.

**Parameters:**

- `function`: a Function used to specify the sorting order.

**Returns:**

a reference to the Array.

**See Also:**

Function

---

### splice

**Signature:** `splice(start : Number, deleteCount : Number, values : Object...) : Array`

**Description:** Deletes the specified number of elements from the Array at the specified position, and then inserts values into the Array at that location.

**Parameters:**

- `start`: the start location.
- `deleteCount`: the number of items to delete.
- `values`: zero or more values to be inserted into the Array.

---

### toLocaleString

**Signature:** `toLocaleString() : String`

**Description:** Converts the Array to a localized String.

**Returns:**

a localized String representing the Array.

---

### toString

**Signature:** `toString() : String`

**Description:** Converts the Array to a String.

**Returns:**

a String representation of the Array.

---

### unshift

**Signature:** `unshift(values : Object...) : Number`

**Description:** Inserts elements at the beginning of the Array.

**Parameters:**

- `values`: one or more vales that will be inserted into the beginning of the Array.

**Returns:**

the new length of the Array.

---

### values

**Signature:** `values() : ES6Iterator`

**Description:** Returns an iterator containing all values of this array.

**API Versioned:**

From version 21.2.

---