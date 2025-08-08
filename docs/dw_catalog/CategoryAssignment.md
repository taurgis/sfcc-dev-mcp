## Package: dw.catalog

# Class CategoryAssignment

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.CategoryAssignment

## Description

Represents a category assignment in Commerce Cloud Digital.

## Properties

### calloutMsg

**Type:** MarkupText (Read Only)

The category assignment's callout message in the current locale.

### category

**Type:** Category (Read Only)

The category to which this category assignment is bound.

### image

**Type:** MediaFile (Read Only)

The category assignment's image.

### longDescription

**Type:** MarkupText (Read Only)

The category assignment's long description in the current locale.

### name

**Type:** String (Read Only)

The name of the category assignment in the current locale.

### product

**Type:** Product (Read Only)

The product to which this category assignment is bound.

### shortDescription

**Type:** MarkupText (Read Only)

The category assignment's short description in the current locale.

## Constructor Summary

## Method Summary

### getCalloutMsg

**Signature:** `getCalloutMsg() : MarkupText`

Returns the category assignment's callout message in the current locale.

### getCategory

**Signature:** `getCategory() : Category`

Returns the category to which this category assignment is bound.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the category assignment's image.

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

Returns the category assignment's long description in the current locale.

### getName

**Signature:** `getName() : String`

Returns the name of the category assignment in the current locale.

### getProduct

**Signature:** `getProduct() : Product`

Returns the product to which this category assignment is bound.

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

Returns the category assignment's short description in the current locale.

## Method Detail

## Method Details

### getCalloutMsg

**Signature:** `getCalloutMsg() : MarkupText`

**Description:** Returns the category assignment's callout message in the current locale.

**Returns:**

the category assignment's callout message in the current locale, or null if it wasn't found.

---

### getCategory

**Signature:** `getCategory() : Category`

**Description:** Returns the category to which this category assignment is bound.

**Returns:**

The category to which this category assignment is bound.

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the category assignment's image.

**Returns:**

the category assignment's image.

---

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

**Description:** Returns the category assignment's long description in the current locale.

**Returns:**

The category assignment's long description in the current locale, or null if it wasn't found.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the category assignment in the current locale.

**Returns:**

The name of the category assignment for the current locale, or null if it wasn't found.

---

### getProduct

**Signature:** `getProduct() : Product`

**Description:** Returns the product to which this category assignment is bound.

**Returns:**

The product to which this category assignment is bound.

---

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

**Description:** Returns the category assignment's short description in the current locale.

**Returns:**

the category assignment's short description in the current locale, or null if it wasn't found.

---