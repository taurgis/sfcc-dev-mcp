## Package: dw.catalog

# Class SearchRefinementDefinition

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.SearchRefinementDefinition

## Description

Common search refinement definition base class.

## Properties

### attributeID

**Type:** String (Read Only)

The attribute ID. If the refinement definition is not an
 attribute refinement, the method returns an empty string.

### attributeRefinement

**Type:** boolean (Read Only)

Identifies if this is an attribute refinement.

### cutoffThreshold

**Type:** Number (Read Only)

The cut-off threshold.

### displayName

**Type:** String (Read Only)

The display name.

### valueTypeCode

**Type:** Number (Read Only)

A code for the data type used for this search refinement definition. See constants
 defined in ObjectAttributeDefinition.

## Constructor Summary

## Method Summary

### getAttributeID

**Signature:** `getAttributeID() : String`

Returns the attribute ID.

### getCutoffThreshold

**Signature:** `getCutoffThreshold() : Number`

Returns the cut-off threshold.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name.

### getValueTypeCode

**Signature:** `getValueTypeCode() : Number`

Returns a code for the data type used for this search refinement definition.

### isAttributeRefinement

**Signature:** `isAttributeRefinement() : boolean`

Identifies if this is an attribute refinement.

## Method Detail

## Method Details

### getAttributeID

**Signature:** `getAttributeID() : String`

**Description:** Returns the attribute ID. If the refinement definition is not an attribute refinement, the method returns an empty string.

**Returns:**

the attribute ID.

---

### getCutoffThreshold

**Signature:** `getCutoffThreshold() : Number`

**Description:** Returns the cut-off threshold.

**Returns:**

the cut-off threshold.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name.

**Returns:**

the display name.

---

### getValueTypeCode

**Signature:** `getValueTypeCode() : Number`

**Description:** Returns a code for the data type used for this search refinement definition. See constants defined in ObjectAttributeDefinition.

**Returns:**

a code for the data type used for this search refinement definition. See constants defined in ObjectAttributeDefinition.

---

### isAttributeRefinement

**Signature:** `isAttributeRefinement() : boolean`

**Description:** Identifies if this is an attribute refinement.

**Returns:**

true if this is an attribute refinement, false otherwise.

---