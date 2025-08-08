## Package: dw.util

# Class Decimal

## Inheritance Hierarchy

- Object
  - dw.util.Decimal

## Description

The Decimal class is a helper class to perform decimal arithmetic in scripts and to represent a decimal number with arbitrary length. The decimal class avoids arithmetic errors, which are typical for calculating with floating numbers, that are based on a binary mantissa. The class is designed in a way that it can be used very similar to a desktop calculator. var d = new Decimal( 10.0 ); var result = d.add( 2.0 ).sub( 3.0 ).get(); The above code will return 9 as result.

## Constructor Summary

Decimal() Constructs a new Decimal with the value 0.

Decimal(value : Number) Constructs a new decimal using the specified Number value.

Decimal(value : BigInt) Constructs a new decimal using the specified BigInt value.

Decimal(value : String) Constructs a new Decimal using the specified string representation of a number.

## Method Summary

### abs

**Signature:** `abs() : Decimal`

Returns a new Decimal with the absolute value of this Decimal.

### add

**Signature:** `add(value : Number) : Decimal`

Adds a Number value to this Decimal and returns the new Decimal.

### add

**Signature:** `add(value : Decimal) : Decimal`

Adds a Decimal value to this Decimal and returns the new Decimal.

### addPercent

**Signature:** `addPercent(value : Number) : Decimal`

Adds a percentage value to the current value of the decimal.

### addPercent

**Signature:** `addPercent(value : Decimal) : Decimal`

Adds a percentage value to the current value of the decimal.

### divide

**Signature:** `divide(value : Number) : Decimal`

Divides the specified Number value with this decimal and returns the new decimal.

### divide

**Signature:** `divide(value : Decimal) : Decimal`

Divides the specified Decimal value with this decimal and returns the new decimal.

### equals

**Signature:** `equals(other : Object) : boolean`

Compares two decimal values whether they are equivalent.

### get

**Signature:** `get() : Number`

Returns the value of the Decimal as a Number.

### hashCode

**Signature:** `hashCode() : Number`

Calculates the hash code for this decimal;

### multiply

**Signature:** `multiply(value : Number) : Decimal`

Multiples the specified Number value with this Decimal and returns the new Decimal.

### multiply

**Signature:** `multiply(value : Decimal) : Decimal`

Multiples the specified Decimal value with this Decimal and returns the new Decimal.

### negate

**Signature:** `negate() : Decimal`

Returns a new Decimal with the negated value of this Decimal.

### round

**Signature:** `round(decimals : Number) : Decimal`

Rounds the current value of the decimal using the specified number of decimals.

### subtract

**Signature:** `subtract(value : Number) : Decimal`

Subtracts the specified Number value from this Decimal and returns the new Decimal.

### subtract

**Signature:** `subtract(value : Decimal) : Decimal`

Subtracts the specified Decimal value from this Decimal and returns the new Decimal.

### subtractPercent

**Signature:** `subtractPercent(value : Number) : Decimal`

Subtracts a percentage value from the current value of the decimal.

### subtractPercent

**Signature:** `subtractPercent(value : Decimal) : Decimal`

Subtracts a percentage value from the current value of the decimal.

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

**Signature:** `abs() : Decimal`

**Description:** Returns a new Decimal with the absolute value of this Decimal.

**Returns:**

the new Decimal

---

### add

**Signature:** `add(value : Number) : Decimal`

**Description:** Adds a Number value to this Decimal and returns the new Decimal.

**Parameters:**

- `value`: the value to add to this decimal.

**Returns:**

the new decimal with the value added.

---

### add

**Signature:** `add(value : Decimal) : Decimal`

**Description:** Adds a Decimal value to this Decimal and returns the new Decimal.

**Parameters:**

- `value`: the value to add to this decimal.

**Returns:**

the new decimal with the value added.

---

### addPercent

**Signature:** `addPercent(value : Number) : Decimal`

**Description:** Adds a percentage value to the current value of the decimal. For example a value of 10 represent 10% or a value of 85 represents 85%.

**Parameters:**

- `value`: the value to add.

**Returns:**

a new decimal with the added percentage value.

---

### addPercent

**Signature:** `addPercent(value : Decimal) : Decimal`

**Description:** Adds a percentage value to the current value of the decimal. For example a value of 10 represent 10% or a value of 85 represents 85%.

**Parameters:**

- `value`: the value to add.

**Returns:**

a new decimal with the added percentage value.

---

### divide

**Signature:** `divide(value : Number) : Decimal`

**Description:** Divides the specified Number value with this decimal and returns the new decimal. When performing the division, 34 digits precision and a rounding mode of HALF_EVEN is used to prevent quotients with nonterminating decimal expansions.

**Parameters:**

- `value`: the value to use to divide this decimal.

**Returns:**

the new decimal.

---

### divide

**Signature:** `divide(value : Decimal) : Decimal`

**Description:** Divides the specified Decimal value with this decimal and returns the new decimal. When performing the division, 34 digits precision and a rounding mode of HALF_EVEN is used to prevent quotients with nonterminating decimal expansions.

**Parameters:**

- `value`: the value to use to divide this decimal.

**Returns:**

the new decimal.

---

### equals

**Signature:** `equals(other : Object) : boolean`

**Description:** Compares two decimal values whether they are equivalent.

**Parameters:**

- `other`: the object to comapre against this decimal.

---

### get

**Signature:** `get() : Number`

**Description:** Returns the value of the Decimal as a Number.

**Returns:**

the value of the Decimal.

---

### hashCode

**Signature:** `hashCode() : Number`

**Description:** Calculates the hash code for this decimal;

---

### multiply

**Signature:** `multiply(value : Number) : Decimal`

**Description:** Multiples the specified Number value with this Decimal and returns the new Decimal.

**Parameters:**

- `value`: the value to multiply with this decimal.

**Returns:**

the new decimal.

---

### multiply

**Signature:** `multiply(value : Decimal) : Decimal`

**Description:** Multiples the specified Decimal value with this Decimal and returns the new Decimal.

**Parameters:**

- `value`: the value to multiply with this decimal.

**Returns:**

the new decimal.

---

### negate

**Signature:** `negate() : Decimal`

**Description:** Returns a new Decimal with the negated value of this Decimal.

**Returns:**

the new Decimal

---

### round

**Signature:** `round(decimals : Number) : Decimal`

**Description:** Rounds the current value of the decimal using the specified number of decimals. The parameter specifies the number of digest after the decimal point.

**Parameters:**

- `decimals`: the number of decimals to use.

**Returns:**

the decimal that has been rounded.

---

### subtract

**Signature:** `subtract(value : Number) : Decimal`

**Description:** Subtracts the specified Number value from this Decimal and returns the new Decimal.

**Parameters:**

- `value`: the value to add to this decimal.

**Returns:**

the new decimal with the value subtraced.

---

### subtract

**Signature:** `subtract(value : Decimal) : Decimal`

**Description:** Subtracts the specified Decimal value from this Decimal and returns the new Decimal.

**Parameters:**

- `value`: the value to add to this decimal.

**Returns:**

the new decimal with the value subtraced.

---

### subtractPercent

**Signature:** `subtractPercent(value : Number) : Decimal`

**Description:** Subtracts a percentage value from the current value of the decimal. For example a value of 10 represent 10% or a value of 85 represents 85%.

**Parameters:**

- `value`: the value to subtract.

**Returns:**

a new decimal with the subtracted percentage value.

---

### subtractPercent

**Signature:** `subtractPercent(value : Decimal) : Decimal`

**Description:** Subtracts a percentage value from the current value of the decimal. For example a value of 10 represent 10% or a value of 85 represents 85%.

**Parameters:**

- `value`: the value to subtract.

**Returns:**

a new decimal with the subtracted percentage value.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a string representation of this object.

**Returns:**

a string representation of this object.

---

### valueOf

**Signature:** `valueOf() : Object`

**Description:** The valueOf() method is called by the ECMAScript interpret to return the "natural" value of an object. The Decimal object returns its current value as number. With this behavior script snippets can be written like: var d = new Decimal( 10.0 ); var x = 1.0 + d.add( 2.0 ); where x will be at the end 13.0.

**Returns:**

the value of this object.

---