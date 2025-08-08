## Package: TopLevel

# Class BigInt

## Inheritance Hierarchy

- Object
  - BigInt

## Description

A BigInt object is a wrapper for a primitive bigint value. bigint values can be numbers too large to be stored as number values. A bigint literal in code is an integer number with an appended n. Example: var hugeNumber = 1245678901234567890n; var hugeNumberObject = BigInt( hugeNumber );

## Constructor Summary

BigInt() Constructs a BigInt with value 0.

BigInt(value : BigInt) Constructs a new BigInt using the specified BigInt.

BigInt(value : String) Constructs a BigInt using the specified value.

## Method Summary

### asIntN

**Signature:** `static asIntN(bits : Number, value : BigInt) : BigInt`

Clamps the given BigInt value to a signed integer with a given precision.

### asUintN

**Signature:** `static asUintN(bits : Number, value : BigInt) : BigInt`

Clamps the given BigInt value to an unsigned integer with a given precision.

### toLocaleString

**Signature:** `toLocaleString() : String`

Converts this BigInt to a String using local number formatting conventions.

### toString

**Signature:** `toString() : String`

A String representation of this BigInt.

### toString

**Signature:** `toString(radix : Number) : String`

Converts the BigInt into a string using the specified radix (base).

## Constructor Detail

## Method Detail

## Method Details

### asIntN

**Signature:** `static asIntN(bits : Number, value : BigInt) : BigInt`

**Description:** Clamps the given BigInt value to a signed integer with a given precision.

**Parameters:**

- `bits`: Number of bits required for resulting integer.
- `value`: The value to be clamped to the given number of bits.

**Returns:**

The value modulo 2bits, as a signed integer.

---

### asUintN

**Signature:** `static asUintN(bits : Number, value : BigInt) : BigInt`

**Description:** Clamps the given BigInt value to an unsigned integer with a given precision.

**Parameters:**

- `bits`: Number of bits required for resulting integer.
- `value`: The value to be clamped to the given number of bits.

**Returns:**

The value modulo 2bits, as an unsigned integer.

---

### toLocaleString

**Signature:** `toLocaleString() : String`

**Description:** Converts this BigInt to a String using local number formatting conventions. The current implementation actually only returns the same as toString().

**Returns:**

a String using local number formatting conventions.

---

### toString

**Signature:** `toString() : String`

**Description:** A String representation of this BigInt.

**Returns:**

a String representation of this BigInt.

---

### toString

**Signature:** `toString(radix : Number) : String`

**Description:** Converts the BigInt into a string using the specified radix (base).

**Parameters:**

- `radix`: the radix to use.

**Returns:**

a String representation of this BigInt.

---