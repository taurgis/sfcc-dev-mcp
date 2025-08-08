## Package: dw.catalog

# Class ProductVariationAttributeValue

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductVariationAttributeValue

## Description

Represents a product variation attribute

## Properties

### description

**Type:** String (Read Only)

The description of the product variation attribute value in the current locale.

### displayValue

**Type:** String (Read Only)

The display value for the product variation attribute value, which can be used in the
 user interface.

### ID

**Type:** String (Read Only)

The ID of the product variation attribute value.

### value

**Type:** Object (Read Only)

The value for the product variation attribute value.

## Constructor Summary

## Method Summary

### equals

**Signature:** `equals(obj : Object) : boolean`

Returns true if the specified object is equal to this object.

### getDescription

**Signature:** `getDescription() : String`

Returns the description of the product variation attribute value in the current locale.

### getDisplayValue

**Signature:** `getDisplayValue() : String`

Returns the display value for the product variation attribute value, which can be used in the user interface.

### getID

**Signature:** `getID() : String`

Returns the ID of the product variation attribute value.

### getImage

**Signature:** `getImage(viewtype : String, index : Number) : MediaFile`

The method calls getImages(String) and returns the image at the specific index.

### getImage

**Signature:** `getImage(viewtype : String) : MediaFile`

The method calls getImages(String) and returns the first image of the list.

### getImages

**Signature:** `getImages(viewtype : String) : List`

Returns all images that match the given view type and have the variant value of this value, which is typically the 'color' attribute.

### getValue

**Signature:** `getValue() : Object`

Returns the value for the product variation attribute value.

### hashCode

**Signature:** `hashCode() : Number`

Calculates the hash code for a product variation attribute value.

## Method Detail

## Method Details

### equals

**Signature:** `equals(obj : Object) : boolean`

**Description:** Returns true if the specified object is equal to this object.

**Parameters:**

- `obj`: the object to test.

**Returns:**

true if the specified object is equal to this object.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description of the product variation attribute value in the current locale.

**Returns:**

the description of the product variation attribute value in the current locale, or null if it wasn't found.

---

### getDisplayValue

**Signature:** `getDisplayValue() : String`

**Description:** Returns the display value for the product variation attribute value, which can be used in the user interface.

**Returns:**

the display value for the product variation attribute value, which can be used in the user interface.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the product variation attribute value.

**Returns:**

the ID of the product variation attribute value.

---

### getImage

**Signature:** `getImage(viewtype : String, index : Number) : MediaFile`

**Description:** The method calls getImages(String) and returns the image at the specific index. If images are defined for this view type and variant, but not for specified index, the method returns null. If no images are defined for this variant and specified view type, the image at the specified index of the master product images is returned. If no master product image for specified index is defined, the method returns null.

**Parameters:**

- `viewtype`: the view type annotated to image
- `index`: the index number of the image within image list

**Returns:**

the MediaFile or null

**Throws:**

NullArgumentException - if viewtype is null

---

### getImage

**Signature:** `getImage(viewtype : String) : MediaFile`

**Description:** The method calls getImages(String) and returns the first image of the list. The method is specifically built for handling color swatches in an apparel site. If no images are defined for this variant and specified view type, then the first image of the master product images for that view type is returned. If no master product images are defined, the method returns null.

**Parameters:**

- `viewtype`: the view type annotated to image

**Returns:**

the MediaFile or null

**Throws:**

NullArgumentException - if viewtype is null

---

### getImages

**Signature:** `getImages(viewtype : String) : List`

**Description:** Returns all images that match the given view type and have the variant value of this value, which is typically the 'color' attribute. The images are returned in the order of their index number ascending. If no images are defined for this variant, then the images of the master for that view type are returned.

**Parameters:**

- `viewtype`: the view type annotated to images

**Returns:**

a list of MediaFile objects, possibly empty

**Throws:**

NullArgumentException - if viewtype is null

---

### getValue

**Signature:** `getValue() : Object`

**Description:** Returns the value for the product variation attribute value.

**Returns:**

the value for the product variation attribute value.

---

### hashCode

**Signature:** `hashCode() : Number`

**Description:** Calculates the hash code for a product variation attribute value.

**Returns:**

the hash code for a product variation attribute value.

---