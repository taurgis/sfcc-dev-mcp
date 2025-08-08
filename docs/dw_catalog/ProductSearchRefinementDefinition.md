## Package: dw.catalog

# Class ProductSearchRefinementDefinition

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.SearchRefinementDefinition
      - dw.catalog.ProductSearchRefinementDefinition

## Description

This class provides an interface to refinement options for the product search.

## Properties

### categoryRefinement

**Type:** boolean (Read Only)

Identifies if this is a category refinement.

### priceRefinement

**Type:** boolean (Read Only)

Identifies if this is a price refinement.

### promotionRefinement

**Type:** boolean (Read Only)

Identifies if this is a promotion refinement.

## Constructor Summary

## Method Summary

### isCategoryRefinement

**Signature:** `isCategoryRefinement() : boolean`

Identifies if this is a category refinement.

### isPriceRefinement

**Signature:** `isPriceRefinement() : boolean`

Identifies if this is a price refinement.

### isPromotionRefinement

**Signature:** `isPromotionRefinement() : boolean`

Identifies if this is a promotion refinement.

## Method Detail

## Method Details

### isCategoryRefinement

**Signature:** `isCategoryRefinement() : boolean`

**Description:** Identifies if this is a category refinement.

**Returns:**

true if this is a category refinement, false otherwise.

---

### isPriceRefinement

**Signature:** `isPriceRefinement() : boolean`

**Description:** Identifies if this is a price refinement.

**Returns:**

true if this is a price refinement, false otherwise.

---

### isPromotionRefinement

**Signature:** `isPromotionRefinement() : boolean`

**Description:** Identifies if this is a promotion refinement.

**Returns:**

true if this is a promotion refinement, false otherwise.

---