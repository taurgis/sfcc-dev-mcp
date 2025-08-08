## Package: dw.extensions.pinterest

# Class PinterestAvailability

## Inheritance Hierarchy

- Object
  - dw.extensions.pinterest.PinterestAvailability

## Description

Represents a row in the Pinterest availability feed export file.

## Properties

### availability

**Type:** String

The availability of the Pinterest product. Possible values are
 PinterestProduct.AVAILABILITY_IN_STOCK or
 PinterestProduct.AVAILABILITY_OUT_OF_STOCK.

### ID

**Type:** String (Read Only)

The ID of the Pinterest product. This is the same as the ID of the Demandware product.

## Constructor Summary

## Method Summary

### getAvailability

**Signature:** `getAvailability() : String`

Returns the availability of the Pinterest product.

### getID

**Signature:** `getID() : String`

Returns the ID of the Pinterest product.

### setAvailability

**Signature:** `setAvailability(availability : String) : void`

Sets the availability of the Pinterest product.

## Method Detail

## Method Details

### getAvailability

**Signature:** `getAvailability() : String`

**Description:** Returns the availability of the Pinterest product. Possible values are PinterestProduct.AVAILABILITY_IN_STOCK or PinterestProduct.AVAILABILITY_OUT_OF_STOCK.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the Pinterest product. This is the same as the ID of the Demandware product.

**Returns:**

product ID

---

### setAvailability

**Signature:** `setAvailability(availability : String) : void`

**Description:** Sets the availability of the Pinterest product. Possible values are PinterestProduct.AVAILABILITY_IN_STOCK or PinterestProduct.AVAILABILITY_OUT_OF_STOCK.

**Parameters:**

- `availability`: the availability status to set for this product

---