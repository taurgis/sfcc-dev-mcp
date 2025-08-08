## Package: TopLevel

# Class Object

## Inheritance Hierarchy

- Object

## Description

The Object object is the foundation of all native JavaScript objects. Also, the Object object can be used to generate items in your scripts with behaviors that are defined by custom properties and/or methods. You generally start by creating a blank object with the constructor function and then assign values to new properties of that object.

## Constructor Summary

Object() Object constructor.

## Method Summary

### assign

**Signature:** `static assign(target : Object, sources : Object...) : Object`

Copies the values of all of the enumerable own properties from one or more source objects to a target object.

### create

**Signature:** `static create(prototype : Object) : Object`

Creates a new object based on a prototype object.

### create

**Signature:** `static create(prototype : Object, properties : Object) : Object`

Creates a new object based on a prototype object and additional property definitions.

### defineProperties

**Signature:** `static defineProperties(object : Object, properties : Object) : Object`

Defines or modifies properties of the passed object.

### defineProperty

**Signature:** `static defineProperty(object : Object, propertyKey : Object, descriptor : Object) : Object`

Defines or modifies a single property of the passed object.

### entries

**Signature:** `static entries(object : Object) : Array`

Returns the enumerable property names and their values of the passed object.

### freeze

**Signature:** `static freeze(object : Object) : Object`

Freezes the passed object.

### fromEntries

**Signature:** `static fromEntries(properties : Iterable) : Object`

Creates a new object with defined properties.

### getOwnPropertyDescriptor

**Signature:** `static getOwnPropertyDescriptor(object : Object, propertyKey : Object) : Object`

Returns the descriptor for a single property of the passed object.

### getOwnPropertyNames

**Signature:** `static getOwnPropertyNames(object : Object) : Array`

Returns an arrays containing the names of all enumerable and non-enumerable properties owned by the passed object.

### getOwnPropertySymbols

**Signature:** `static getOwnPropertySymbols(object : Object) : Array`

Returns an array containing the symbol of all symbol properties owned by the passed object.

### getPrototypeOf

**Signature:** `static getPrototypeOf(object : Object) : Object`

Returns the prototype of the passed object.

### hasOwnProperty

**Signature:** `hasOwnProperty(propName : String) : boolean`

Returns Boolean true if at the time the current object's instance was created its constructor (or literal assignment) contained a property with a name that matches the parameter value.

### is

**Signature:** `static is(value1 : Object, value2 : Object) : boolean`

Checks if the two values are equal in terms of being the same value.

### isExtensible

**Signature:** `static isExtensible(object : Object) : boolean`

Returns if new properties can be added to an object.

### isFrozen

**Signature:** `static isFrozen(object : Object) : boolean`

Returns if the object is frozen.

### isPrototypeOf

**Signature:** `isPrototypeOf(prototype : Object) : boolean`

Returns true if the current object and the object passed as a prameter conincide at some point along each object's prototype inheritance chain.

### isSealed

**Signature:** `static isSealed(object : Object) : boolean`

Returns if the object is sealed.

### keys

**Signature:** `static keys(object : Object) : Array`

Returns the enumerable property names of the passed object.

### preventExtensions

**Signature:** `static preventExtensions(object : Object) : Object`

Makes the passed object non-extensible.

### propertyIsEnumerable

**Signature:** `propertyIsEnumerable(propName : String) : boolean`

Return true if the specified property exposes itself to for/in property inspection through the object.

### seal

**Signature:** `static seal(object : Object) : Object`

Seals the passed object.

### setPrototypeOf

**Signature:** `static setPrototypeOf(object : Object, prototype : Object) : Object`

Changes the prototype of the passed object.

### toLocaleString

**Signature:** `toLocaleString() : String`

Converts the object to a localized String.

### toString

**Signature:** `toString() : String`

Converts the object to a String.

### valueOf

**Signature:** `valueOf() : Object`

Returns the object's value.

### values

**Signature:** `static values(object : Object) : Array`

Returns the enumerable property values of the passed object.

## Constructor Detail

## Method Detail

## Method Details

### assign

**Signature:** `static assign(target : Object, sources : Object...) : Object`

**Description:** Copies the values of all of the enumerable own properties from one or more source objects to a target object.

**API Versioned:**

From version 21.2.

**Parameters:**

- `target`: The target object.
- `sources`: The source objects.

**Returns:**

The target object.

---

### create

**Signature:** `static create(prototype : Object) : Object`

**Description:** Creates a new object based on a prototype object.

**Parameters:**

- `prototype`: The prototype for the new object.

**Returns:**

The newly created object.

---

### create

**Signature:** `static create(prototype : Object, properties : Object) : Object`

**Description:** Creates a new object based on a prototype object and additional property definitions. The properties are given in the same format as described for defineProperties(Object, Object).

**Parameters:**

- `prototype`: The prototype for the new object.
- `properties`: The property definitions.

**Returns:**

The newly created object.

---

### defineProperties

**Signature:** `static defineProperties(object : Object, properties : Object) : Object`

**Description:** Defines or modifies properties of the passed object. A descriptor for a property supports these properties: configurable, enumerable, value, writable, set and get.

**Parameters:**

- `object`: The object to change.
- `properties`: The new property definitions.

**Returns:**

The modified object.

---

### defineProperty

**Signature:** `static defineProperty(object : Object, propertyKey : Object, descriptor : Object) : Object`

**Description:** Defines or modifies a single property of the passed object. A descriptor for a property supports these properties: configurable, enumerable, value, writable, set and get.

**Parameters:**

- `object`: The object to change.
- `propertyKey`: The property name.
- `descriptor`: The property descriptor object.

**Returns:**

The modified object.

---

### entries

**Signature:** `static entries(object : Object) : Array`

**Description:** Returns the enumerable property names and their values of the passed object.

**API Versioned:**

From version 22.7.

**Parameters:**

- `object`: The object to get the enumerable property names from.

**Returns:**

An array of key/value pairs ( as two element arrays ) that holds all the enumerable properties of the given object.

---

### freeze

**Signature:** `static freeze(object : Object) : Object`

**Description:** Freezes the passed object. Properties can't be added or removed from the frozen object. Also, definitions of existing object properties can't be changed. Although property values are immutable, setters and getters can be called.

**Parameters:**

- `object`: The object to be frozen.

**Returns:**

The frozen object.

---

### fromEntries

**Signature:** `static fromEntries(properties : Iterable) : Object`

**Description:** Creates a new object with defined properties. The properties are defined by an iterable that produces two element array like objects, which are the key-value pairs. Iterables are e.g. Array, Map or any other Iterable.

**API Versioned:**

From version 22.7.

**Parameters:**

- `properties`: The properties.

**Returns:**

The newly created object.

---

### getOwnPropertyDescriptor

**Signature:** `static getOwnPropertyDescriptor(object : Object, propertyKey : Object) : Object`

**Description:** Returns the descriptor for a single property of the passed object.

**Parameters:**

- `object`: The property owning object.
- `propertyKey`: The property to look for.

**Returns:**

The descriptor object for the property or undefined if the property does not exist.

---

### getOwnPropertyNames

**Signature:** `static getOwnPropertyNames(object : Object) : Array`

**Description:** Returns an arrays containing the names of all enumerable and non-enumerable properties owned by the passed object.

**Parameters:**

- `object`: The object owning properties.

**Returns:**

An array of strings that are the properties found directly in the passed object.

---

### getOwnPropertySymbols

**Signature:** `static getOwnPropertySymbols(object : Object) : Array`

**Description:** Returns an array containing the symbol of all symbol properties owned by the passed object.

**API Versioned:**

From version 21.2.

**Parameters:**

- `object`: The object owning properties.

**Returns:**

An array of symbol properties found directly in the passed object.

---

### getPrototypeOf

**Signature:** `static getPrototypeOf(object : Object) : Object`

**Description:** Returns the prototype of the passed object.

**Parameters:**

- `object`: The object to get the prototype from.

**Returns:**

The prototype object or null if there is none.

---

### hasOwnProperty

**Signature:** `hasOwnProperty(propName : String) : boolean`

**Description:** Returns Boolean true if at the time the current object's instance was created its constructor (or literal assignment) contained a property with a name that matches the parameter value.

**Parameters:**

- `propName`: the property name of the object's property.

**Returns:**

true if at the object contains a property that matches the parameter, false otherwise.

---

### is

**Signature:** `static is(value1 : Object, value2 : Object) : boolean`

**Description:** Checks if the two values are equal in terms of being the same value. No coercion is performed, thus -0 and +0 is not equal and NaN is equal to NaN.

**API Versioned:**

From version 21.2.

**Parameters:**

- `value1`: The first value.
- `value2`: The second value.

**Returns:**

true if both values are the same value else false.

---

### isExtensible

**Signature:** `static isExtensible(object : Object) : boolean`

**Description:** Returns if new properties can be added to an object. By default new objects are extensible. The methods freeze(Object), seal(Object) and preventExtensions(Object) make objects non-extensible.

**Parameters:**

- `object`: The object to check.

**Returns:**

true if new properties can be added else false.

---

### isFrozen

**Signature:** `static isFrozen(object : Object) : boolean`

**Description:** Returns if the object is frozen.

**Parameters:**

- `object`: The object to check.

**Returns:**

true if the object is frozen else false.

---

### isPrototypeOf

**Signature:** `isPrototypeOf(prototype : Object) : boolean`

**Description:** Returns true if the current object and the object passed as a prameter conincide at some point along each object's prototype inheritance chain.

**Parameters:**

- `prototype`: the object to test.

**Returns:**

true if the current object and the object passed as a prameter conincide at some point, false otherwise.

---

### isSealed

**Signature:** `static isSealed(object : Object) : boolean`

**Description:** Returns if the object is sealed.

**Parameters:**

- `object`: The object to check.

**Returns:**

true if the object is sealed else false.

---

### keys

**Signature:** `static keys(object : Object) : Array`

**Description:** Returns the enumerable property names of the passed object.

**Parameters:**

- `object`: The object to get the enumerable property names from.

**Returns:**

An array of strings that holds all the enumerable properties of the given object.

---

### preventExtensions

**Signature:** `static preventExtensions(object : Object) : Object`

**Description:** Makes the passed object non-extensible. This means that no new properties can be added to this object.

**Parameters:**

- `object`: The object to make non-extensible.

**Returns:**

The passed object.

---

### propertyIsEnumerable

**Signature:** `propertyIsEnumerable(propName : String) : boolean`

**Description:** Return true if the specified property exposes itself to for/in property inspection through the object.

**Parameters:**

- `propName`: the property to test.

**Returns:**

true if the specified property exposes itself to for/in property inspection through the object, false otherwise.

---

### seal

**Signature:** `static seal(object : Object) : Object`

**Description:** Seals the passed object. This means properties can't be added or removed. Also, property definitions of existing properties can't be changed.

**Parameters:**

- `object`: The object to be frozen.

**Returns:**

The sealed object.

---

### setPrototypeOf

**Signature:** `static setPrototypeOf(object : Object, prototype : Object) : Object`

**Description:** Changes the prototype of the passed object.

**API Versioned:**

From version 21.2.

**Parameters:**

- `object`: The object whose prototype should change.
- `prototype`: The object to set as the new prototype.

**Returns:**

The object with the changed prototype.

---

### toLocaleString

**Signature:** `toLocaleString() : String`

**Description:** Converts the object to a localized String.

**Returns:**

a localized version of the object.

---

### toString

**Signature:** `toString() : String`

**Description:** Converts the object to a String.

**Returns:**

the String representation of the object.

---

### valueOf

**Signature:** `valueOf() : Object`

**Description:** Returns the object's value.

**Returns:**

the object's value.

---

### values

**Signature:** `static values(object : Object) : Array`

**Description:** Returns the enumerable property values of the passed object.

**API Versioned:**

From version 22.7.

**Parameters:**

- `object`: The object to get the enumerable property values from.

**Returns:**

An array of values that holds all the enumerable properties of the given object.

---