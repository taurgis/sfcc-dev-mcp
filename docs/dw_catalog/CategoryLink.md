## Package: dw.catalog

# Class CategoryLink

## Inheritance Hierarchy

- Object
  - dw.catalog.CategoryLink

## Description

A CategoryLink represents a directed relationship between two catalog categories. Merchants create category links in order to market similar or related groups of products.

## Constants

### LINKTYPE_ACCESSORY

**Type:** Number = 2

Represents an accessory category link.

### LINKTYPE_CROSS_SELL

**Type:** Number = 4

Represents a cross-sell category link.

### LINKTYPE_OTHER

**Type:** Number = 1

Represents a miscellaneous category link.

### LINKTYPE_SPARE_PART

**Type:** Number = 6

Represents a spare part category link.

### LINKTYPE_UP_SELL

**Type:** Number = 5

Represents an up-sell category link.

## Properties

### sourceCategory

**Type:** Category (Read Only)

The object for the relation 'sourceCategory'.

### targetCategory

**Type:** Category (Read Only)

The object for the relation 'targetCategory'.

### typeCode

**Type:** Number (Read Only)

The type of this category link (see constants).

## Constructor Summary

## Method Summary

### getSourceCategory

**Signature:** `getSourceCategory() : Category`

Returns the object for the relation 'sourceCategory'.

### getTargetCategory

**Signature:** `getTargetCategory() : Category`

Returns the object for the relation 'targetCategory'.

### getTypeCode

**Signature:** `getTypeCode() : Number`

Returns the type of this category link (see constants).

## Method Detail

## Method Details

### getSourceCategory

**Signature:** `getSourceCategory() : Category`

**Description:** Returns the object for the relation 'sourceCategory'.

**Returns:**

the object for the relation 'sourceCategory'

---

### getTargetCategory

**Signature:** `getTargetCategory() : Category`

**Description:** Returns the object for the relation 'targetCategory'.

**Returns:**

the object for the relation 'targetCategory'

---

### getTypeCode

**Signature:** `getTypeCode() : Number`

**Description:** Returns the type of this category link (see constants).

**Returns:**

the type of the link.

---