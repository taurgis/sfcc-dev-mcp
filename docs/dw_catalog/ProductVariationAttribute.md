## Package: dw.catalog

# Class ProductVariationAttribute

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductVariationAttribute

## Description

Represents a product variation attribute

## Properties

### attributeID

**Type:** String (Read Only)

The ID of the product attribute defintion related to 
 this variation attribute.  This ID matches the
 value returned by ObjectAttributeDefinition.getID()  
 for the appropriate product attribute definition.
 This ID is generally different than the ID returned by 
 getID().

### displayName

**Type:** String (Read Only)

The display name for the product variation attribute, which can be used in the
 user interface.

### ID

**Type:** String (Read Only)

The ID of the product variation attribute.

## Constructor Summary

## Method Summary

### getAttributeID

**Signature:** `getAttributeID() : String`

Returns the ID of the product attribute defintion related to this variation attribute.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name for the product variation attribute, which can be used in the user interface.

### getID

**Signature:** `getID() : String`

Returns the ID of the product variation attribute.

## Method Detail

## Method Details

### getAttributeID

**Signature:** `getAttributeID() : String`

**Description:** Returns the ID of the product attribute defintion related to this variation attribute. This ID matches the value returned by ObjectAttributeDefinition.getID() for the appropriate product attribute definition. This ID is generally different than the ID returned by getID().

**Returns:**

the ID of the product attribute definition of this variation attribute.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name for the product variation attribute, which can be used in the user interface.

**Returns:**

the display name for the product variation attribute, which can be used in the user interface.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the product variation attribute.

**Returns:**

the ID of the product variation attribute.

---