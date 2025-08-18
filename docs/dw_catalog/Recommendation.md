## Package: dw.catalog

# Class Recommendation

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.Recommendation

## Description

Represents a recommendation in Commerce Cloud Digital.

## Constants

### RECOMMENDATION_TYPE_CROSS_SELL

**Type:** Number = 1

Represents a cross-sell recommendation.

### RECOMMENDATION_TYPE_OTHER

**Type:** Number = 3

Represents a recommendation that is neither a cross-sell or an up-sell.

### RECOMMENDATION_TYPE_UP_SELL

**Type:** Number = 2

Represents an up-sell recommendation.

## Properties

### calloutMsg

**Type:** MarkupText (Read Only)

The recommendation's callout message in the current locale.

### catalog

**Type:** Catalog (Read Only)

Return the catalog containing the recommendation.

### image

**Type:** MediaFile (Read Only)

The recommendation's image.

### longDescription

**Type:** MarkupText (Read Only)

The recommendation's long description in the current locale.

### name

**Type:** String (Read Only)

The name of the recommended item in the current locale.

### recommendationType

**Type:** Number (Read Only)

The type of the recommendation.

### recommendedItem

**Type:** Object (Read Only)

Return a reference to the recommended item.  This will always be an
 object of type dw.catalog.Product since this is the only
 currently supported recommendation target type.

### recommendedItemID

**Type:** String (Read Only)

Return the ID of the recommended item.  This will always be a product
 ID since this is the only currently supported recommendation target
 type.

### shortDescription

**Type:** MarkupText (Read Only)

The recommendation's short description in the current locale.

### sourceItem

**Type:** Object (Read Only)

Return a reference to the source item.  This will be an object of type
 dw.catalog.Product or dw.catalog.Category.

### sourceItemID

**Type:** String (Read Only)

Return the ID of the recommendation source item.  This will either be a
 product ID or category name.

## Constructor Summary

## Method Summary

### getCalloutMsg

**Signature:** `getCalloutMsg() : MarkupText`

Returns the recommendation's callout message in the current locale.

### getCatalog

**Signature:** `getCatalog() : Catalog`

Return the catalog containing the recommendation.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the recommendation's image.

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

Returns the recommendation's long description in the current locale.

### getName

**Signature:** `getName() : String`

Returns the name of the recommended item in the current locale.

### getRecommendationType

**Signature:** `getRecommendationType() : Number`

Returns the type of the recommendation.

### getRecommendedItem

**Signature:** `getRecommendedItem() : Object`

Return a reference to the recommended item.

### getRecommendedItemID

**Signature:** `getRecommendedItemID() : String`

Return the ID of the recommended item.

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

Returns the recommendation's short description in the current locale.

### getSourceItem

**Signature:** `getSourceItem() : Object`

Return a reference to the source item.

### getSourceItemID

**Signature:** `getSourceItemID() : String`

Return the ID of the recommendation source item.

## Method Detail

## Method Details

### getCalloutMsg

**Signature:** `getCalloutMsg() : MarkupText`

**Description:** Returns the recommendation's callout message in the current locale.

**Returns:**

the recommendation's callout message in the current locale, or null if it wasn't found.

---

### getCatalog

**Signature:** `getCatalog() : Catalog`

**Description:** Return the catalog containing the recommendation.

**Returns:**

the catalog containing the recommendation.

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the recommendation's image.

**Returns:**

the recommendation's image.

---

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

**Description:** Returns the recommendation's long description in the current locale.

**Returns:**

The recommendation's long description in the current locale, or null if it wasn't found.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the recommended item in the current locale.

**Returns:**

The name of the recommended item for the current locale, or null if it wasn't found.

---

### getRecommendationType

**Signature:** `getRecommendationType() : Number`

**Description:** Returns the type of the recommendation.

**Returns:**

the type of the recommendation expressed as an integer.

---

### getRecommendedItem

**Signature:** `getRecommendedItem() : Object`

**Description:** Return a reference to the recommended item. This will always be an object of type dw.catalog.Product since this is the only currently supported recommendation target type.

**Returns:**

the recommended item, possibly null if the item does not exist.

---

### getRecommendedItemID

**Signature:** `getRecommendedItemID() : String`

**Description:** Return the ID of the recommended item. This will always be a product ID since this is the only currently supported recommendation target type.

**Returns:**

the recommended item ID.

---

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

**Description:** Returns the recommendation's short description in the current locale.

**Returns:**

the recommendations's short description in the current locale, or null if it wasn't found.

---

### getSourceItem

**Signature:** `getSourceItem() : Object`

**Description:** Return a reference to the source item. This will be an object of type dw.catalog.Product or dw.catalog.Category.

**Returns:**

the source item.

---

### getSourceItemID

**Signature:** `getSourceItemID() : String`

**Description:** Return the ID of the recommendation source item. This will either be a product ID or category name.

**Returns:**

the source item ID.

---