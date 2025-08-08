## Package: dw.customer

# Class ProductListItemPurchase

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.ProductListItemPurchase

## Description

A record of the purchase of an item contained in a product list.

## Properties

### item

**Type:** ProductListItem (Read Only)

The item that was purchased.

### orderNo

**Type:** String (Read Only)

The number of the order in which the
 product list item was purchased.

### purchaseDate

**Type:** Date (Read Only)

The date on which the product list item was purchased.

### purchaserName

**Type:** String (Read Only)

The name of the purchaser of the product list item.

### quantity

**Type:** Quantity (Read Only)

The quantity of the product list item that was purchased.

## Constructor Summary

## Method Summary

### getItem

**Signature:** `getItem() : ProductListItem`

Returns the item that was purchased.

### getOrderNo

**Signature:** `getOrderNo() : String`

Returns the number of the order in which the product list item was purchased.

### getPurchaseDate

**Signature:** `getPurchaseDate() : Date`

Returns the date on which the product list item was purchased.

### getPurchaserName

**Signature:** `getPurchaserName() : String`

Returns the name of the purchaser of the product list item.

### getQuantity

**Signature:** `getQuantity() : Quantity`

Returns the quantity of the product list item that was purchased.

## Method Detail

## Method Details

### getItem

**Signature:** `getItem() : ProductListItem`

**Description:** Returns the item that was purchased.

**Returns:**

the item that was purchased.

---

### getOrderNo

**Signature:** `getOrderNo() : String`

**Description:** Returns the number of the order in which the product list item was purchased.

**Returns:**

the number of the order in which the product list item was purchased.

---

### getPurchaseDate

**Signature:** `getPurchaseDate() : Date`

**Description:** Returns the date on which the product list item was purchased.

**Returns:**

the date on which the product list item was purchased.

---

### getPurchaserName

**Signature:** `getPurchaserName() : String`

**Description:** Returns the name of the purchaser of the product list item.

**Returns:**

the name of the purchaser of the product list item.

---

### getQuantity

**Signature:** `getQuantity() : Quantity`

**Description:** Returns the quantity of the product list item that was purchased.

**Returns:**

the quantity of the product list item that was purchased.

---