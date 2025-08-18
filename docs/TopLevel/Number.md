## Package: TopLevel

# Class Number

## Inheritance Hierarchy

- Object
  - Number

## Description

A Number object represents any numerical value, whether it is an integer or floating-point number. Generally, you do not need to worry about a Number object because a numerical value automatically becomes a Number object instance when you use a numerical value or assign it to a variable.

## Constants

### EPSILON

**Type:** Number

EPSILON is the Number value for the magnitude of the difference between 1 and the smallest value greater than 1 that is representable as a Number value, which is approximately 2.2204460492503130808472633361816 × 10-16.

### MAX_SAFE_INTEGER

**Type:** Number

The maximum safe integer in JavaScript.

### MAX_VALUE

**Type:** Number

The largest representable Number.

### MIN_SAFE_INTEGER

**Type:** Number

The minimum safe integer in JavaScript.

### MIN_VALUE

**Type:** Number

The smallest representable Number.

### NEGATIVE_INFINITY

**Type:** Number

Negative infinite value; returned on overflow;

### POSITIVE_INFINITY

**Type:** Number

Negative infinite value; returned on overflow;

## Properties

## Constructor Summary

Number() Constructs a Number with value 0

Number(num : Number) Constructs a new Number using the specified Number.

Number(value : String) Constructs a Number using the specified value.

## Method Summary

### isFinite

**Signature:** `static isFinite(value : Object) : boolean`

Determines whether the passed value is a finite number.

### isInteger

**Signature:** `static isInteger(value : Object) : boolean`

Determines whether the passed value is an integer number.

### isNaN

**Signature:** `static isNaN(value : Object) : boolean`

Determines whether the passed value is NaN.

### isSafeInteger

**Signature:** `static isSafeInteger(value : Object) : boolean`

Determines whether the passed value is a safe integer number.

### parseFloat

**Signature:** `static parseFloat(s : String) : Number`

Parses a String into an float Number.

### parseInt

**Signature:** `static parseInt(s : String) : Number`

Parses a String into an integer Number.

### parseInt

**Signature:** `static parseInt(s : String, radix : Number) : Number`

Parses a String into an integer Number using the specified radix.

### toExponential

**Signature:** `toExponential() : String`

Converts this Number to a String using exponential notation.

### toExponential

**Signature:** `toExponential(digits : Number) : String`

Converts this Number to a String using exponential notation with the specified number of digits after the decimal place.

### toFixed

**Signature:** `toFixed() : String`

Converts a Number to a String that contains a no fractional part.

### toFixed

**Signature:** `toFixed(digits : Number) : String`

Converts a Number to a String that contains a specified number of digits after the decimal place.

### toLocaleString

**Signature:** `toLocaleString() : String`

Converts this Number to a String using local number formatting conventions.

### toPrecision

**Signature:** `toPrecision(precision : Number) : String`

Converts a Number to a String using the specified number of significant digits.

### toString

**Signature:** `toString() : String`

A String representation of this Number.

### toString

**Signature:** `toString(radix : Number) : String`

Converts the number into a string using the specified radix (base).

## Constructor Detail

## Method Detail

## Method Details

### isFinite

**Signature:** `static isFinite(value : Object) : boolean`

**Description:** Determines whether the passed value is a finite number.

**API Versioned:**

From version 21.2.

**Parameters:**

- `value`: The value to check.

**Returns:**

true if the passed value is a finite number, else false.

---

### isInteger

**Signature:** `static isInteger(value : Object) : boolean`

**Description:** Determines whether the passed value is an integer number.

**API Versioned:**

From version 21.2.

**Parameters:**

- `value`: The value to check.

**Returns:**

true if the passed value is a finite integer number, else false.

---

### isNaN

**Signature:** `static isNaN(value : Object) : boolean`

**Description:** Determines whether the passed value is NaN. Unlike the global function, the passed parameter is not converted to number before doing the check.

**API Versioned:**

From version 21.2.

**Parameters:**

- `value`: The value to check.

**Returns:**

true if the passed value is the NaN number value, else false.

---

### isSafeInteger

**Signature:** `static isSafeInteger(value : Object) : boolean`

**Description:** Determines whether the passed value is a safe integer number.

**API Versioned:**

From version 21.2.

**Parameters:**

- `value`: The value to check.

**Returns:**

true if the passed value is a safe integer number, else false.

---

### parseFloat

**Signature:** `static parseFloat(s : String) : Number`

**Description:** Parses a String into an float Number.

**API Versioned:**

From version 21.2.

**Parameters:**

- `s`: the String to parse.

**Returns:**

Returns the float as a Number.

---

### parseInt

**Signature:** `static parseInt(s : String) : Number`

**Description:** Parses a String into an integer Number. This function is a short form for the call to parseInt(String, Number) with automatic determination of the radix. If the string starts with "0x" or "0X" then the radix is 16. In all other cases the radix is 10.

**API Versioned:**

From version 21.2.

**Parameters:**

- `s`: the String to parse.

**Returns:**

Returns the integer as a Number.

---

### parseInt

**Signature:** `static parseInt(s : String, radix : Number) : Number`

**Description:** Parses a String into an integer Number using the specified radix.

**API Versioned:**

From version 21.2.

**Parameters:**

- `s`: the String to parse.
- `radix`: the radix to use.

**Returns:**

Returns the integer as a Number.

---

### toExponential

**Signature:** `toExponential() : String`

**Description:** Converts this Number to a String using exponential notation.

**Returns:**

a String using exponential notation.

---

### toExponential

**Signature:** `toExponential(digits : Number) : String`

**Description:** Converts this Number to a String using exponential notation with the specified number of digits after the decimal place.

**Parameters:**

- `digits`: the number of digits after the decimal place.

**Returns:**

a String using exponential notation with the specified number of digits after the decimal place.

---

### toFixed

**Signature:** `toFixed() : String`

**Description:** Converts a Number to a String that contains a no fractional part.

**Returns:**

a String representation of the number

---

### toFixed

**Signature:** `toFixed(digits : Number) : String`

**Description:** Converts a Number to a String that contains a specified number of digits after the decimal place.

**Parameters:**

- `digits`: the number of digits after the decimal place.

**Returns:**

a String that contains a specified number of digits after the decimal place.

---

### toLocaleString

**Signature:** `toLocaleString() : String`

**Description:** Converts this Number to a String using local number formatting conventions. The current implementation actually only returns the same as toString().

**Returns:**

a String using local number formatting conventions.

---

### toPrecision

**Signature:** `toPrecision(precision : Number) : String`

**Description:** Converts a Number to a String using the specified number of significant digits. Uses exponential or fixed point notation depending on the size of the number and the number of significant digits specified.

**Parameters:**

- `precision`: the precision to use when converting the Number to a String.

**Returns:**

a String using the specified number of significant digits.

---

### toString

**Signature:** `toString() : String`

**Description:** A String representation of this Number.

**Returns:**

a String representation of this Number.

---

### toString

**Signature:** `toString(radix : Number) : String`

**Description:** Converts the number into a string using the specified radix (base).

**Parameters:**

- `radix`: the radix to use.

**Returns:**

a String representation of this Number.

---