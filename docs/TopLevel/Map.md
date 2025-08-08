## Package: TopLevel

# Class Map

## Inheritance Hierarchy

- Object
  - Map

## Description

Map objects are collections of key/value pairs where both the keys and values may be arbitrary ECMAScript language values. A distinct key value may only occur in one key/value pair within the Map's collection. Key/value pairs are stored and iterated in insertion order.

## Properties

### size

**Type:** Number

Number of key/value pairs stored in this map.

## Constructor Summary

Map() Creates an empty map.

Map(values : Iterable) If the passed value is null or undefined then an empty map is constructed.

## Method Summary

### clear

**Signature:** `clear() : void`

Removes all key/value pairs from this map.

### delete

**Signature:** `delete(key : Object) : boolean`

Removes the entry for the given key.

### entries

**Signature:** `entries() : ES6Iterator`

Returns an iterator containing all key/value pairs of this map.

### forEach

**Signature:** `forEach(callback : Function) : void`

Runs the provided callback function once for each key/value pair present in this map.

### forEach

**Signature:** `forEach(callback : Function, thisObject : Object) : void`

Runs the provided callback function once for each key/value pair present in this map.

### get

**Signature:** `get(key : Object) : Object`

Returns the value associated with the given key.

### has

**Signature:** `has(key : Object) : boolean`

Returns if this map has value associated with the given key.

### keys

**Signature:** `keys() : ES6Iterator`

Returns an iterator containing all keys of this map.

### set

**Signature:** `set(key : Object, value : Object) : Map`

Adds or updates a key/value pair to the map.

### values

**Signature:** `values() : ES6Iterator`

Returns an iterator containing all values of this map.

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

### entries

**Signature:** `entries() : ES6Iterator`

**Description:** Returns an iterator containing all key/value pairs of this map. The iterator produces a series of two-element arrays with the first element as the key and the second element as the value.

---

### forEach

**Signature:** `forEach(callback : Function) : void`

**Description:** Runs the provided callback function once for each key/value pair present in this map.

**Parameters:**

- `callback`: The function to call, which is invoked with three arguments: the value of the element, the key of the element, and the Map object being iterated.

---

### forEach

**Signature:** `forEach(callback : Function, thisObject : Object) : void`

**Description:** Runs the provided callback function once for each key/value pair present in this map.

**Parameters:**

- `callback`: The function to call, which is invoked with three arguments: the value of the element, the key of the element, and the Map object being iterated.
- `thisObject`: The Object to use as 'this' when executing callback.

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

### keys

**Signature:** `keys() : ES6Iterator`

**Description:** Returns an iterator containing all keys of this map.

---

### set

**Signature:** `set(key : Object, value : Object) : Map`

**Description:** Adds or updates a key/value pair to the map. You can't use JavaScript bracket notation to access map entries. JavaScript bracket notation accesses only properties for Map objects, not map entries.

**Parameters:**

- `key`: The key object.
- `value`: The value to be associated with the key.

**Returns:**

This map object.

---

### values

**Signature:** `values() : ES6Iterator`

**Description:** Returns an iterator containing all values of this map.

---