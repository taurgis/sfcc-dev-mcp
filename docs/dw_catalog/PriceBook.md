## Package: dw.catalog

# Class PriceBook

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.PriceBook

## Description

Represents a price book.

## Properties

### currencyCode

**Type:** String (Read Only)

The currency code of the price book.

### description

**Type:** String (Read Only)

The description of the price book.

### displayName

**Type:** String (Read Only)

The display name of the price book.

### ID

**Type:** String (Read Only)

The ID of the price book.

### online

**Type:** boolean (Read Only)

The online status of the price book. The online status
 is calculated from the online status flag and the onlineFrom
 onlineTo dates defined for the price book.

### onlineFlag

**Type:** boolean (Read Only)

The online status flag of the price book.

### onlineFrom

**Type:** Date (Read Only)

The date from which the price book is online or valid.

### onlineTo

**Type:** Date (Read Only)

The date until which the price book is online or valid.

### parentPriceBook

**Type:** PriceBook (Read Only)

The parent price book.

## Constructor Summary

## Method Summary

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

Returns the currency code of the price book.

### getDescription

**Signature:** `getDescription() : String`

Returns the description of the price book.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name of the price book.

### getID

**Signature:** `getID() : String`

Returns the ID of the price book.

### getOnlineFlag

**Signature:** `getOnlineFlag() : boolean`

Returns the online status flag of the price book.

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

Returns the date from which the price book is online or valid.

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

Returns the date until which the price book is online or valid.

### getParentPriceBook

**Signature:** `getParentPriceBook() : PriceBook`

Returns the parent price book.

### isOnline

**Signature:** `isOnline() : boolean`

Returns the online status of the price book.

## Method Detail

## Method Details

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

**Description:** Returns the currency code of the price book.

**Returns:**

Currency code of the price book

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description of the price book.

**Returns:**

Currency code of the price book

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name of the price book.

**Returns:**

Display name of the price book

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the price book.

**Returns:**

ID of the price book

---

### getOnlineFlag

**Signature:** `getOnlineFlag() : boolean`

**Description:** Returns the online status flag of the price book.

**Returns:**

the online status flag of the price book.

---

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

**Description:** Returns the date from which the price book is online or valid.

**Returns:**

the date from which the price book is online or valid.

---

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

**Description:** Returns the date until which the price book is online or valid.

**Returns:**

the date until which the price book is online or valid.

---

### getParentPriceBook

**Signature:** `getParentPriceBook() : PriceBook`

**Description:** Returns the parent price book.

**Returns:**

Parent price book

---

### isOnline

**Signature:** `isOnline() : boolean`

**Description:** Returns the online status of the price book. The online status is calculated from the online status flag and the onlineFrom onlineTo dates defined for the price book.

**Returns:**

The online status of the price book.

---