## Package: dw.util

# Class Map

## Inheritance Hierarchy

- Object
  - dw.util.Map

## Description

Represents a Map of objects.

## Properties

### empty

**Type:** boolean (Read Only)

Identifies if this map is empty.

### length

**Type:** Number (Read Only)

The size of the map. This is a bean attribute method and
 supports the access to the collections
 length similar to a ECMA array, such as 'products.length'.

## Constructor Summary

## Method Summary

### clear

**Signature:** `clear() : void`

Clears the map of all objects.

### containsKey

**Signature:** `containsKey(key : Object) : boolean`

Identifies if this map contains an element identfied by the specified key.

### containsValue

**Signature:** `containsValue(value : Object) : boolean`

Identifies if this map contains an element identfied by the specified value.

### entrySet

**Signature:** `entrySet() : Set`

Returns a set of the map's entries.

### get

**Signature:** `get(key : Object) : Object`

Returns the object associated with the key or null.

### getLength

**Signature:** `getLength() : Number`

REturns the size of the map.

### isEmpty

**Signature:** `isEmpty() : boolean`

Identifies if this map is empty.

### keySet

**Signature:** `keySet() : Set`

Returns a set of the map's keys.

### put

**Signature:** `put(key : Object, value : Object) : Object`

Puts the specified value into the map using the specified key to identify it.

### putAll

**Signature:** `putAll(other : Map) : void`

Copies all of the objects inside the specified map into this map.

### remove

**Signature:** `remove(key : Object) : Object`

Removes the object from the map that is identified by the key.

### size

**Signature:** `size() : Number`

Returns the size of the map.

### values

**Signature:** `values() : Collection`

Returns a collection of the values contained in this map.

### values

**Signature:** `values() : Collection`

Returns a collection of the values contained in this map.

## Method Detail

## Method Details

### clear

**Signature:** `clear() : void`

**Description:** Clears the map of all objects.

---

### containsKey

**Signature:** `containsKey(key : Object) : boolean`

**Description:** Identifies if this map contains an element identfied by the specified key.

**Parameters:**

- `key`: the key to use.

**Returns:**

true if this map contains an element whose key is equal to the specified key.

---

### containsValue

**Signature:** `containsValue(value : Object) : boolean`

**Description:** Identifies if this map contains an element identfied by the specified value.

**Parameters:**

- `value`: the value to use.

**Returns:**

true if this map contains an element whose value is equal to the specified value.

---

### entrySet

**Signature:** `entrySet() : Set`

**Description:** Returns a set of the map's entries. The returned set is actually a view to the entries of this map.

**Returns:**

a set of the map's entries.

---

### get

**Signature:** `get(key : Object) : Object`

**Description:** Returns the object associated with the key or null.

**Parameters:**

- `key`: the key to use.

**Returns:**

the object associated with the key or null.

---

### getLength

**Signature:** `getLength() : Number`

**Description:** REturns the size of the map. This is a bean attribute method and supports the access to the collections length similar to a ECMA array, such as 'products.length'.

**Returns:**

the number of objects in the map.

---

### isEmpty

**Signature:** `isEmpty() : boolean`

**Description:** Identifies if this map is empty.

**Returns:**

true if the map is empty, false otherwise.

---

### keySet

**Signature:** `keySet() : Set`

**Description:** Returns a set of the map's keys. The returned set is actually a view to the keys of this map.

**Returns:**

a set of the map's keys.

---

### put

**Signature:** `put(key : Object, value : Object) : Object`

**Description:** Puts the specified value into the map using the specified key to identify it.

**Parameters:**

- `key`: the key to use to identify the value.
- `value`: the object to put into the map.

**Returns:**

previous value associated with specified key, or null if there was no mapping for key.

---

### putAll

**Signature:** `putAll(other : Map) : void`

**Description:** Copies all of the objects inside the specified map into this map.

**Parameters:**

- `other`: the map whose contents are copied into this map.

---

### remove

**Signature:** `remove(key : Object) : Object`

**Description:** Removes the object from the map that is identified by the key.

**Parameters:**

- `key`: the key that identifies the object to remove.

**Returns:**

the removed object or null.

---

### size

**Signature:** `size() : Number`

**Description:** Returns the size of the map.

**Returns:**

the number of objects in the map.

---

### values

**Signature:** `values() : Collection`

**Description:** Returns a collection of the values contained in this map.

**API Versioned:**

No longer available as of version 16.1. Returns an independent modifiable collection holding all values.

**Returns:**

a collection of the values contained in this map

---

### values

**Signature:** `values() : Collection`

**Description:** Returns a collection of the values contained in this map.

**API Versioned:**

From version 16.1. Returns a view on the values of this map like keySet() and entrySet() do. Former version returned a shallow copy of this.

**Returns:**

a collection of the values contained in this map

---