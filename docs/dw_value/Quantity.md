## Package: dw.value

# Class Quantity

## Inheritance Hierarchy

- Object
  - dw.value.Quantity

## Description

Represents the quantity of an item.

## Properties

### available

**Type:** boolean (Read Only)

Identifies if the instance contains settings for value and unit.

### decimalValue

**Type:** Decimal (Read Only)

The quantity as Decimal, null is returned when the quantity is not available.

### unit

**Type:** String (Read Only)

The value for unit which identifies the
 unit of measure for the quantity. Examples of unit
 are 'inches' or 'pounds'.

### value

**Type:** Number (Read Only)

The quantity value.

## Constructor Summary

Quantity(value : Number, unit : String) Creates a new quantity instance with the specified value and unit.

## Method Summary

### add

**Signature:** `add(value : Quantity) : Quantity`

Add Quantity object to the current object.

### compareTo

**Signature:** `compareTo(other : Quantity) : Number`

Compares two Quantity values.

### divide

**Signature:** `divide(divisor : Number) : Quantity`

Divide Quantity object by specified divisor.

### equals

**Signature:** `equals(other : Object) : boolean`

Compares two decimal values whether they are equivalent.

### getDecimalValue

**Signature:** `getDecimalValue() : Decimal`

Returns the quantity as Decimal, null is returned when the quantity is not available.

### getUnit

**Signature:** `getUnit() : String`

Returns the value for unit which identifies the unit of measure for the quantity.

### getValue

**Signature:** `getValue() : Number`

Returns the quantity value.

### hashCode

**Signature:** `hashCode() : Number`

Calculates the hash code for a decimal.

### isAvailable

**Signature:** `isAvailable() : boolean`

Identifies if the instance contains settings for value and unit.

### isOfSameUnit

**Signature:** `isOfSameUnit(value : Quantity) : boolean`

Identifies if two Quantities have the same unit.

### multiply

**Signature:** `multiply(factor : Number) : Quantity`

Multiply Quantity object by specified factor.

### newQuantity

**Signature:** `newQuantity(value : Decimal) : Quantity`

Method returns a new instance of Quantity with the same unit but different value.

### round

**Signature:** `round(precision : Number) : Quantity`

Rounds the Quantity value to the number of specified decimal digits.

### subtract

**Signature:** `subtract(value : Quantity) : Quantity`

Subtract Quantity object from the current object.

### toString

**Signature:** `toString() : String`

Returns a string representation of this quantity object.

### valueOf

**Signature:** `valueOf() : Object`

According to the ECMA spec returns the "natural" primitive value.

## Constructor Detail

## Method Detail

## Method Details

### add

**Signature:** `add(value : Quantity) : Quantity`

**Description:** Add Quantity object to the current object. Only objects representing the same unit can be added.

**Parameters:**

- `value`: Quantity object

**Returns:**

Quantity object representing the sum of the operands

---

### compareTo

**Signature:** `compareTo(other : Quantity) : Number`

**Description:** Compares two Quantity values. An exception is thrown if the two Quantities values are of different unit. If one of the Quantity values represents the N/A value it is treated as 0.0.

**Parameters:**

- `other`: the other quantity to compare.

**Returns:**

the comparison.

---

### divide

**Signature:** `divide(divisor : Number) : Quantity`

**Description:** Divide Quantity object by specified divisor.

**Parameters:**

- `divisor`: divisor

**Returns:**

Quantity object representing division result

---

### equals

**Signature:** `equals(other : Object) : boolean`

**Description:** Compares two decimal values whether they are equivalent.

**Parameters:**

- `other`: the object to compare against this quantity instance.

**Returns:**

true if equal, false otherwise.

---

### getDecimalValue

**Signature:** `getDecimalValue() : Decimal`

**Description:** Returns the quantity as Decimal, null is returned when the quantity is not available.

**Returns:**

the quantity as Decimal

---

### getUnit

**Signature:** `getUnit() : String`

**Description:** Returns the value for unit which identifies the unit of measure for the quantity. Examples of unit are 'inches' or 'pounds'.

**Returns:**

the unit value.

---

### getValue

**Signature:** `getValue() : Number`

**Description:** Returns the quantity value.

**Returns:**

the quantity value.

**See Also:**

getDecimalValue()

---

### hashCode

**Signature:** `hashCode() : Number`

**Description:** Calculates the hash code for a decimal.

**Returns:**

the hash code.

---

### isAvailable

**Signature:** `isAvailable() : boolean`

**Description:** Identifies if the instance contains settings for value and unit.

**Returns:**

true if the instance is initialized with value and unit, false if the state is 'not available'.

---

### isOfSameUnit

**Signature:** `isOfSameUnit(value : Quantity) : boolean`

**Description:** Identifies if two Quantities have the same unit.

**Parameters:**

- `value`: the second quantity for the comparison.

**Returns:**

true if both quantities have the same unit, false otherwise.

---

### multiply

**Signature:** `multiply(factor : Number) : Quantity`

**Description:** Multiply Quantity object by specified factor.

**Parameters:**

- `factor`: multiplication factor

**Returns:**

Quantity object representing multiplication result

---

### newQuantity

**Signature:** `newQuantity(value : Decimal) : Quantity`

**Description:** Method returns a new instance of Quantity with the same unit but different value. An N/A instance is returned if value is null.

**Parameters:**

- `value`: as a decimal

**Returns:**

new Quantity instance with same unit

---

### round

**Signature:** `round(precision : Number) : Quantity`

**Description:** Rounds the Quantity value to the number of specified decimal digits.

**Parameters:**

- `precision`: number of decimal digits after the decimal point

**Returns:**

the new rounded Quantity value

---

### subtract

**Signature:** `subtract(value : Quantity) : Quantity`

**Description:** Subtract Quantity object from the current object. Only objects representing the same unit can be subtracted.

**Parameters:**

- `value`: Quantity object to subtract

**Returns:**

Quantity object representing the result of subtraction

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a string representation of this quantity object.

**Returns:**

a string representation of this quantity object.

---

### valueOf

**Signature:** `valueOf() : Object`

**Description:** According to the ECMA spec returns the "natural" primitive value. Here the value portion of the Quantity is returned.

---