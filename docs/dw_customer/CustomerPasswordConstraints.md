## Package: dw.customer

# Class CustomerPasswordConstraints

## Inheritance Hierarchy

- Object
  - dw.customer.CustomerPasswordConstraints

## Description

Provides access to the constraints of customer passwords. An instance of this class can be obtained via CustomerMgr.getPasswordConstraints().

## Properties

### forceLetters

**Type:** boolean (Read Only)

Returns true if letters are enforced.

### forceMixedCase

**Type:** boolean (Read Only)

Returns true if mixed case is enforced.

### forceNumbers

**Type:** boolean (Read Only)

Returns true if numbers are enforced.

### minLength

**Type:** Number (Read Only)

The minimum length.

### minSpecialChars

**Type:** Number (Read Only)

The minimum number of special characters.

## Constructor Summary

## Method Summary

### getMinLength

**Signature:** `static getMinLength() : Number`

Returns the minimum length.

### getMinSpecialChars

**Signature:** `static getMinSpecialChars() : Number`

Returns the minimum number of special characters.

### isForceLetters

**Signature:** `static isForceLetters() : boolean`

Returns true if letters are enforced.

### isForceMixedCase

**Signature:** `static isForceMixedCase() : boolean`

Returns true if mixed case is enforced.

### isForceNumbers

**Signature:** `static isForceNumbers() : boolean`

Returns true if numbers are enforced.

## Method Detail

## Method Details

### getMinLength

**Signature:** `static getMinLength() : Number`

**Description:** Returns the minimum length.

**Returns:**

the minimum length

---

### getMinSpecialChars

**Signature:** `static getMinSpecialChars() : Number`

**Description:** Returns the minimum number of special characters.

**Returns:**

the minimum number of special characters

---

### isForceLetters

**Signature:** `static isForceLetters() : boolean`

**Description:** Returns true if letters are enforced.

**Returns:**

if letters are enforced

---

### isForceMixedCase

**Signature:** `static isForceMixedCase() : boolean`

**Description:** Returns true if mixed case is enforced.

**Returns:**

if mixed case is enforced

---

### isForceNumbers

**Signature:** `static isForceNumbers() : boolean`

**Description:** Returns true if numbers are enforced.

**Returns:**

if numbers are enforced

---