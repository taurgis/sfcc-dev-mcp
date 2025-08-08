## Package: dw.catalog

# Class ProductOptionValue

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.ProductOptionValue

## Description

Represents the value of a product option.

## Properties

### description

**Type:** String (Read Only)

The the product option value's description
 in the current locale.

### displayValue

**Type:** String (Read Only)

The the product option value's display name
 in the current locale.

### ID

**Type:** String (Read Only)

The product option value's ID.

### productIDModifier

**Type:** String (Read Only)

The product option value's product ID modifier which
 can be used to build the SKU for the actual product.

## Constructor Summary

## Method Summary

### getDescription

**Signature:** `getDescription() : String`

Returns the the product option value's description in the current locale.

### getDisplayValue

**Signature:** `getDisplayValue() : String`

Returns the the product option value's display name in the current locale.

### getID

**Signature:** `getID() : String`

Returns the product option value's ID.

### getProductIDModifier

**Signature:** `getProductIDModifier() : String`

Returns the product option value's product ID modifier which can be used to build the SKU for the actual product.

## Method Detail

## Method Details

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the the product option value's description in the current locale.

**Returns:**

The value of the product option value's description in the current locale, or null if it wasn't found.

---

### getDisplayValue

**Signature:** `getDisplayValue() : String`

**Description:** Returns the the product option value's display name in the current locale.

**Returns:**

The value of the product option value's display name in the current locale, or null if it wasn't found.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the product option value's ID.

**Returns:**

the product option value's ID.

---

### getProductIDModifier

**Signature:** `getProductIDModifier() : String`

**Description:** Returns the product option value's product ID modifier which can be used to build the SKU for the actual product.

**Returns:**

the product option value's product ID modifier which can be used to build the SKU for the actual product.

---