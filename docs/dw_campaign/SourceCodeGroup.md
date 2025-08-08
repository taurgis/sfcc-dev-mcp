## Package: dw.campaign

# Class SourceCodeGroup

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.campaign.SourceCodeGroup

## Description

A source code group defines a collection of source codes. Source code groups are generally pattern based and any source code satisfying the pattern belongs to the group. In this way, merchants may define a large set of source codes which qualify a customer for site experiences (different prices, for example), which customers without that source code do not receive. The class SourceCodeInfo represents an individual source code.

## Properties

### ID

**Type:** String (Read Only)

The ID of the SourceCodeGroup.

### priceBooks

**Type:** Collection (Read Only)

A Collection of PriceBooks the SourceCodeGroup is assigned to.

## Constructor Summary

## Method Summary

### getID

**Signature:** `getID() : String`

The ID of the SourceCodeGroup.

### getPriceBooks

**Signature:** `getPriceBooks() : Collection`

Returns a Collection of PriceBooks the SourceCodeGroup is assigned to.

## Method Detail

## Method Details

### getID

**Signature:** `getID() : String`

**Description:** The ID of the SourceCodeGroup.

**Returns:**

the ID.

---

### getPriceBooks

**Signature:** `getPriceBooks() : Collection`

**Description:** Returns a Collection of PriceBooks the SourceCodeGroup is assigned to.

**Returns:**

Collection of PriceBooks the SourceCodeGroup is assigned to.

---