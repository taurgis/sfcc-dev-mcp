## Package: dw.catalog

# Class ProductSearchRefinementValue

## Inheritance Hierarchy

- Object
  - dw.catalog.SearchRefinementValue
  - dw.catalog.ProductSearchRefinementValue

## Description

Represents the value of a product search refinement.

## Properties

### valueFrom

**Type:** Number (Read Only)

The lower bound for price refinements.  For example, 50.00
 for a range of $50.00 - $99.99.

### valueTo

**Type:** Number (Read Only)

The upper bound for price refinements.  For example, 99.99
 for a range of $50.00 - $99.99.

## Constructor Summary

## Method Summary

### getValueFrom

**Signature:** `getValueFrom() : Number`

Returns the lower bound for price refinements.

### getValueTo

**Signature:** `getValueTo() : Number`

Returns the upper bound for price refinements.

## Method Detail

## Method Details

### getValueFrom

**Signature:** `getValueFrom() : Number`

**Description:** Returns the lower bound for price refinements. For example, 50.00 for a range of $50.00 - $99.99.

**Returns:**

the lower bound for price refinements.

---

### getValueTo

**Signature:** `getValueTo() : Number`

**Description:** Returns the upper bound for price refinements. For example, 99.99 for a range of $50.00 - $99.99.

**Returns:**

the upper bound for price refinements.

---