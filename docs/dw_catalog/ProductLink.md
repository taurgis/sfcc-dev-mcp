## Package: dw.catalog

# Class ProductLink

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductLink

## Description

The class represents a link between two products.

## Constants

### LINKTYPE_ACCESSORY

**Type:** Number = 4

Represents an accessory product link.

### LINKTYPE_ALT_ORDERUNIT

**Type:** Number = 6

Represents an alternative order unit product link.

### LINKTYPE_CROSS_SELL

**Type:** Number = 1

Represents a cross-sell product link.

### LINKTYPE_NEWER_VERSION

**Type:** Number = 5

Represents a newer verion link.

### LINKTYPE_OTHER

**Type:** Number = 8

Represents a miscellaneous product link.

### LINKTYPE_REPLACEMENT

**Type:** Number = 2

Represents a replacement product link.

### LINKTYPE_SPARE_PART

**Type:** Number = 7

Represents a spare part product link.

### LINKTYPE_UP_SELL

**Type:** Number = 3

Represents an up-sell product link.

## Properties

### sourceProduct

**Type:** Product (Read Only)

The source product for this link.

### targetProduct

**Type:** Product (Read Only)

The target product for this link.

### typeCode

**Type:** Number (Read Only)

The type of this link (see constants).

## Constructor Summary

## Method Summary

### getSourceProduct

**Signature:** `getSourceProduct() : Product`

Returns the source product for this link.

### getTargetProduct

**Signature:** `getTargetProduct() : Product`

Returns the target product for this link.

### getTypeCode

**Signature:** `getTypeCode() : Number`

Returns the type of this link (see constants).

## Method Detail

## Method Details

### getSourceProduct

**Signature:** `getSourceProduct() : Product`

**Description:** Returns the source product for this link.

**Returns:**

the source product for this link.

---

### getTargetProduct

**Signature:** `getTargetProduct() : Product`

**Description:** Returns the target product for this link.

**Returns:**

the target product for this link.

---

### getTypeCode

**Signature:** `getTypeCode() : Number`

**Description:** Returns the type of this link (see constants).

**Returns:**

the type of the link.

---