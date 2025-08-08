## Package: dw.catalog

# Class ProductOption

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.ProductOption

## Description

Represents a product option.

## Properties

### defaultValue

**Type:** ProductOptionValue (Read Only)

The default value for the product option.

### description

**Type:** String (Read Only)

The product option's short description in the current locale.

### displayName

**Type:** String (Read Only)

The product option's display name in the current locale.

### htmlName

**Type:** String (Read Only)

An HTML representation of the option id.

### ID

**Type:** String (Read Only)

The product option ID.

### image

**Type:** MediaFile (Read Only)

The product option's image.

### optionValues

**Type:** Collection (Read Only)

A collection containing the product option values.

## Constructor Summary

## Method Summary

### getDefaultValue

**Signature:** `getDefaultValue() : ProductOptionValue`

Returns the default value for the product option.

### getDescription

**Signature:** `getDescription() : String`

Returns the product option's short description in the current locale.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the product option's display name in the current locale.

### getHtmlName

**Signature:** `getHtmlName() : String`

Returns an HTML representation of the option id.

### getHtmlName

**Signature:** `getHtmlName(prefix : String) : String`

Returns an HTML representation of the option id with the custom prefix.

### getID

**Signature:** `getID() : String`

Returns the product option ID.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the product option's image.

### getOptionValues

**Signature:** `getOptionValues() : Collection`

Returns a collection containing the product option values.

## Method Detail

## Method Details

### getDefaultValue

**Signature:** `getDefaultValue() : ProductOptionValue`

**Description:** Returns the default value for the product option.

**Returns:**

the object for the relation 'defaultValue'

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the product option's short description in the current locale.

**Returns:**

The value of the short description in the current locale, or null if it wasn't found.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the product option's display name in the current locale.

**Returns:**

The value of the display name in the current locale, or null if it wasn't found.

---

### getHtmlName

**Signature:** `getHtmlName() : String`

**Description:** Returns an HTML representation of the option id.

**Returns:**

an HTML representation of the option id.

---

### getHtmlName

**Signature:** `getHtmlName(prefix : String) : String`

**Description:** Returns an HTML representation of the option id with the custom prefix.

**Parameters:**

- `prefix`: a custom prefix for the html name.

**Returns:**

an HTML representation of the option id.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the product option ID.

**Returns:**

the product option identifier.

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the product option's image.

**Returns:**

the product option's image.

---

### getOptionValues

**Signature:** `getOptionValues() : Collection`

**Description:** Returns a collection containing the product option values.

**Returns:**

a collection containing the product option values.

---