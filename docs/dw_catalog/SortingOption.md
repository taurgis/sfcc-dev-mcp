## Package: dw.catalog

# Class SortingOption

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.catalog.SortingOption

## Description

Represents an option for how to sort products in storefront search results.

## Properties

### description

**Type:** String (Read Only)

The description of the sorting option for the current locale.

### displayName

**Type:** String (Read Only)

The display name of the of the sorting option for the current locale.

### ID

**Type:** String (Read Only)

The ID of the sorting option.

### sortingRule

**Type:** SortingRule (Read Only)

The sorting rule for this sorting option,
 or null if there is no associated rule.

## Constructor Summary

## Method Summary

### getDescription

**Signature:** `getDescription() : String`

Returns the description of the sorting option for the current locale.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name of the of the sorting option for the current locale.

### getID

**Signature:** `getID() : String`

Returns the ID of the sorting option.

### getSortingRule

**Signature:** `getSortingRule() : SortingRule`

Returns the sorting rule for this sorting option, or null if there is no associated rule.

## Method Detail

## Method Details

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description of the sorting option for the current locale.

**Returns:**

The value of the property for the current locale, or null if it wasn't found.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name of the of the sorting option for the current locale.

**Returns:**

The value of the property for the current locale, or null if it wasn't found.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the sorting option.

**Returns:**

sorting option ID

---

### getSortingRule

**Signature:** `getSortingRule() : SortingRule`

**Description:** Returns the sorting rule for this sorting option, or null if there is no associated rule.

**Returns:**

a ProductSortingRule instance representing the rule for this option or null.

---