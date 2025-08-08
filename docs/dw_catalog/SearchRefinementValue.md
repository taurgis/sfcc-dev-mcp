## Package: dw.catalog

# Class SearchRefinementValue

## Inheritance Hierarchy

- Object
  - dw.catalog.SearchRefinementValue

## Description

Represents the value of a product or content search refinement.

## Properties

### description

**Type:** String (Read Only)

The optional refinement value description in the current locale.

### displayValue

**Type:** String (Read Only)

The refinement display value. For attribute refinements, this is
 the appropriate display value based on optional value display names
 within the object attribute definition. If no display name is defined,
 the value itself is returned. For category refinements, this is the
 display name of the category in the current locale. For price
 refinements, this is a string representation of the range appropriate for
 display.

### hitCount

**Type:** Number (Read Only)

The hit count value.

### ID

**Type:** String (Read Only)

The refinement value's ID. For attribute refinements, this will
 be the ID of the corresponding
 ObjectAttributeDefinition. This ID is included in the
 querystring parameter names returned by the URL-generating methods of
 SearchModel. For price and category refinements, this
 value will be empty.

### presentationID

**Type:** String (Read Only)

The optional presentation ID associated with this refinement
 value. The presentation ID can be used, for example, to associate an ID
 with an HTML widget.

### value

**Type:** String (Read Only)

The refinement value. For attribute refinements, this is the
 attribute value if the refinement values are unbucketed, or the bucket
 display name if the values are bucketed. This value is included in the
 querystring parameter values returned by the URL-generating methods of
 SearchModel. For price refinements, the value will be
 a string representation of the price range lower bound. For category
 refinements, the value will be a category ID.

## Constructor Summary

## Method Summary

### getDescription

**Signature:** `getDescription() : String`

Returns the optional refinement value description in the current locale.

### getDisplayValue

**Signature:** `getDisplayValue() : String`

Returns the refinement display value.

### getHitCount

**Signature:** `getHitCount() : Number`

Returns the hit count value.

### getID

**Signature:** `getID() : String`

Returns the refinement value's ID.

### getPresentationID

**Signature:** `getPresentationID() : String`

Returns the optional presentation ID associated with this refinement value.

### getValue

**Signature:** `getValue() : String`

Returns the refinement value.

## Method Detail

## Method Details

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the optional refinement value description in the current locale.

**Returns:**

the optional refinement value description in the current locale, or null if none is defined.

---

### getDisplayValue

**Signature:** `getDisplayValue() : String`

**Description:** Returns the refinement display value. For attribute refinements, this is the appropriate display value based on optional value display names within the object attribute definition. If no display name is defined, the value itself is returned. For category refinements, this is the display name of the category in the current locale. For price refinements, this is a string representation of the range appropriate for display.

**Returns:**

the refinement display value in the current locale.

---

### getHitCount

**Signature:** `getHitCount() : Number`

**Description:** Returns the hit count value.

**Returns:**

the hit count value.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the refinement value's ID. For attribute refinements, this will be the ID of the corresponding ObjectAttributeDefinition. This ID is included in the querystring parameter names returned by the URL-generating methods of SearchModel. For price and category refinements, this value will be empty.

**Returns:**

the refinement value's ID.

---

### getPresentationID

**Signature:** `getPresentationID() : String`

**Description:** Returns the optional presentation ID associated with this refinement value. The presentation ID can be used, for example, to associate an ID with an HTML widget.

**Returns:**

the presentation ID, or null if none is defined.

---

### getValue

**Signature:** `getValue() : String`

**Description:** Returns the refinement value. For attribute refinements, this is the attribute value if the refinement values are unbucketed, or the bucket display name if the values are bucketed. This value is included in the querystring parameter values returned by the URL-generating methods of SearchModel. For price refinements, the value will be a string representation of the price range lower bound. For category refinements, the value will be a category ID.

**Returns:**

the refinement value.

---