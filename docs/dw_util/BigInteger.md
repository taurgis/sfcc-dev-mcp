## Package: dw.util

# Class BigInteger

## Inheritance Hierarchy

- Object
  - dw.util.BigInteger

## Description

The BigInteger class is a helper class to represent an arbitrary long integer number. The Demandware framework doesn't use this class, but in some special cases web services that declare an XML element with "xsd:integer", which is by definition an arbitrary long integer number, require the use of this class. The class is designed in a way that it can be used very similar to a desktop calculator. For example: var i = new BigInteger( 10 ); var result = d.add( 2 ).sub( 3 ).get(); The above code will return 9 as result.

## Constructor Summary

BigInteger() Constructs a new BigInteger with the value 0.

BigInteger(value : Number) Constructs a new BigInteger using the specified Number value.

BigInteger(value : String) Constructs a new BigInteger using the specified string representation of a number.

## Method Summary

### abs

**Signature:** `abs() : BigInteger`

Returns a new BigInteger with the absolute value of this BigInteger.

### add

**Signature:** `add(value : Number) : BigInteger`

Adds a Number value to this BigInteger and returns the new BigInteger.

### add

**Signature:** `add(value : BigInteger) : BigInteger`

Adds an BigInteger value to this BigInteger and returns the new BigInteger.

### divide

**Signature:** `divide(value : Number) : BigInteger`

Divides this BigInteger by the specified BigInteger and returns the new BigInteger.

### divide

**Signature:** `divide(value : BigInteger) : BigInteger`

Divides this BigInteger by the specified BigInteger and returns the new BigInteger.

### equals

**Signature:** `equals(other : Object) : boolean`

Compares two BigInteger values whether they are equivalent.

### get

**Signature:** `get() : Number`

Returns the value of the BigInteger as a Number.

### hashCode

**Signature:** `hashCode() : Number`

Calculates the hash code for this BigInteger;

### multiply

**Signature:** `multiply(value : Number) : BigInteger`

Multiples the specified Number value with this BigInteger and returns the new BigInteger.

### multiply

**Signature:** `multiply(value : BigInteger) : BigInteger`

Multiples the specified BigInteger value with this BigInteger and returns the new BigInteger.

### negate

**Signature:** `negate() : BigInteger`

Returns a new BigInteger with the negated value of this BigInteger.

### subtract

**Signature:** `subtract(value : Number) : BigInteger`

Subtracts the specified Number value from this BigInteger and returns the new BigInteger.

### subtract

**Signature:** `subtract(value : BigInteger) : BigInteger`

Subtracts the specified BigInteger value from this BigInteger and returns the new BigInteger.

### toString

**Signature:** `toString() : String`

Returns a string representation of this object.

### valueOf

**Signature:** `valueOf() : Object`

The valueOf() method is called by the ECMAScript interpret to return the "natural" value of an object.

## Constructor Detail

## Method Detail

## Method Details

### abs

**Signature:** `abs() : BigInteger`

**Description:** Returns a new BigInteger with the absolute value of this BigInteger.

**Returns:**

the new BigInteger

---

### add

**Signature:** `add(value : Number) : BigInteger`

**Description:** Adds a Number value to this BigInteger and returns the new BigInteger.

**Parameters:**

- `value`: the value to add to this BigInteger.

**Returns:**

the new BigInteger with the value added.

---

### add

**Signature:** `add(value : BigInteger) : BigInteger`

**Description:** Adds an BigInteger value to this BigInteger and returns the new BigInteger.

**Parameters:**

- `value`: the value to add to this BigInteger.

**Returns:**

the new BigInteger with the value added.

---

### divide

**Signature:** `divide(value : Number) : BigInteger`

**Description:** Divides this BigInteger by the specified BigInteger and returns the new BigInteger.

**Parameters:**

- `value`: the value to use to divide this BigInteger.

**Returns:**

the new BigInteger.

---

### divide

**Signature:** `divide(value : BigInteger) : BigInteger`

**Description:** Divides this BigInteger by the specified BigInteger and returns the new BigInteger.

**Parameters:**

- `value`: the value to use to divide this BigInteger.

**Returns:**

the new BigInteger.

---

### equals

**Signature:** `equals(other : Object) : boolean`

**Description:** Compares two BigInteger values whether they are equivalent.

**Parameters:**

- `other`: the object to compare against this BigInteger.

---

### get

**Signature:** `get() : Number`

**Description:** Returns the value of the BigInteger as a Number.

**Returns:**

the value of the BigInteger.

---

### hashCode

**Signature:** `hashCode() : Number`

**Description:** Calculates the hash code for this BigInteger;

---

### multiply

**Signature:** `multiply(value : Number) : BigInteger`

**Description:** Multiples the specified Number value with this BigInteger and returns the new BigInteger.

**Parameters:**

- `value`: the value to multiply with this BigInteger.

**Returns:**

the new BigInteger.

---

### multiply

**Signature:** `multiply(value : BigInteger) : BigInteger`

**Description:** Multiples the specified BigInteger value with this BigInteger and returns the new BigInteger.

**Parameters:**

- `value`: the value to multiply with this BigInteger.

**Returns:**

the new BigInteger.

---

### negate

**Signature:** `negate() : BigInteger`

**Description:** Returns a new BigInteger with the negated value of this BigInteger.

**Returns:**

the new BigInteger

---

### subtract

**Signature:** `subtract(value : Number) : BigInteger`

**Description:** Subtracts the specified Number value from this BigInteger and returns the new BigInteger.

**Parameters:**

- `value`: the value to add to this BigInteger.

**Returns:**

the new BigInteger with the value subtracted.

---

### subtract

**Signature:** `subtract(value : BigInteger) : BigInteger`

**Description:** Subtracts the specified BigInteger value from this BigInteger and returns the new BigInteger.

**Parameters:**

- `value`: the value to add to this BigInteger.

**Returns:**

the new BigInteger with the value subtracted.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a string representation of this object.

**Returns:**

a string representation of this object.

---

### valueOf

**Signature:** `valueOf() : Object`

**Description:** The valueOf() method is called by the ECMAScript interpret to return the "natural" value of an object. The BigInteger object returns its current value as number. With this behavior script snippets can be written like: var i = new BigInteger( 10 ); var x = 1 + d.add( 2 ); where x will be at the end 13.

**Returns:**

the value of this object.

---