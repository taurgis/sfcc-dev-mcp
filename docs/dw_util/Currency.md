## Package: dw.util

# Class Currency

## Inheritance Hierarchy

- Object
  - dw.util.Currency

## Description

Represents a currency supported by the system.

## Properties

### currencyCode

**Type:** String (Read Only)

Gets the ISO 4217 mnemonic currency code of this currency.

### defaultFractionDigits

**Type:** Number (Read Only)

Gets the default number of fraction digits used with this currency.
 For example, the default number of fraction digits for the Euro is 2,
 while for the Japanese Yen it's 0.

### name

**Type:** String (Read Only)

Gets a long name for this currency. e.g. "United States Dollar".
 The returned name is the one stored in the system for this currency.
 Currently only English names are available, but in the future
 this method may return a locale-specific name.

### symbol

**Type:** String (Read Only)

Gets the symbol of this currency. e.g. "$" for the US Dollar.

## Constructor Summary

## Method Summary

### getCurrency

**Signature:** `static getCurrency(currencyCode : String) : Currency`

Returns a Currency instance for the given currency code, or null if there is no such currency.

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

Gets the ISO 4217 mnemonic currency code of this currency.

### getDefaultFractionDigits

**Signature:** `getDefaultFractionDigits() : Number`

Gets the default number of fraction digits used with this currency.

### getName

**Signature:** `getName() : String`

Gets a long name for this currency.

### getSymbol

**Signature:** `getSymbol() : String`

Gets the symbol of this currency.

### toString

**Signature:** `toString() : String`

Returns the ISO 4217 mnemonic currency code of this currency.

## Method Detail

## Method Details

### getCurrency

**Signature:** `static getCurrency(currencyCode : String) : Currency`

**Description:** Returns a Currency instance for the given currency code, or null if there is no such currency.

**Parameters:**

- `currencyCode`: the ISO 4217 mnemonic code of the currency.

**Returns:**

the Currency instance for the given currency code.

---

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

**Description:** Gets the ISO 4217 mnemonic currency code of this currency.

**Returns:**

the ISO 4217 mnemonic currency code of this currency.

---

### getDefaultFractionDigits

**Signature:** `getDefaultFractionDigits() : Number`

**Description:** Gets the default number of fraction digits used with this currency. For example, the default number of fraction digits for the Euro is 2, while for the Japanese Yen it's 0.

**Returns:**

the default number of fraction digits used with this currency.

---

### getName

**Signature:** `getName() : String`

**Description:** Gets a long name for this currency. e.g. "United States Dollar". The returned name is the one stored in the system for this currency. Currently only English names are available, but in the future this method may return a locale-specific name.

**Returns:**

a long name for this currency. e.g. "United States Dollar".

---

### getSymbol

**Signature:** `getSymbol() : String`

**Description:** Gets the symbol of this currency. e.g. "$" for the US Dollar.

**Returns:**

the symbol of this currency.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns the ISO 4217 mnemonic currency code of this currency.

**Returns:**

the ISO 4217 mnemonic currency code of this currency.

---