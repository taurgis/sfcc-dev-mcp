## Package: dw.order

# Class AbstractItemCtnr

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItemCtnr

## Description

Basis for item-based objects stemming from a single Order, with these common properties (Invoice is used as an example): The object has been created from an Order accessible using getOrder() Contains a collection of items, each item related to exactly one OrderItem which in turn represents an extension to one of the order ProductLineItem or one ShippingLineItem. Example: an Invoice has InvoiceItems The items hold various prices which are summed, resulting in a product-subtotal, a service-subtotal and a grand-total, each represented by a SumItem. The object is customizable using custom properties

## Properties

### createdBy

**Type:** String (Read Only)

Created by this user.

### creationDate

**Type:** Date (Read Only)

The time of creation.

### grandTotal

**Type:** SumItem (Read Only)

The sum-item representing the grandtotal for all items.

### items

**Type:** FilteringCollection (Read Only)

The unsorted collection of items

### lastModified

**Type:** Date (Read Only)

The last modification time.

### modifiedBy

**Type:** String (Read Only)

Last modified by this user.

### order

**Type:** Order (Read Only)

The Order this object was created for.

### productSubtotal

**Type:** SumItem (Read Only)

The sum-item representing the subtotal for product items.

### serviceSubtotal

**Type:** SumItem (Read Only)

The sum-item representing the subtotal for service items such as
 shipping.

## Constructor Summary

## Method Summary

### getCreatedBy

**Signature:** `getCreatedBy() : String`

Created by this user.

### getCreationDate

**Signature:** `getCreationDate() : Date`

The time of creation.

### getGrandTotal

**Signature:** `getGrandTotal() : SumItem`

Returns the sum-item representing the grandtotal for all items.

### getItems

**Signature:** `getItems() : FilteringCollection`

Returns the unsorted collection of items

### getLastModified

**Signature:** `getLastModified() : Date`

The last modification time.

### getModifiedBy

**Signature:** `getModifiedBy() : String`

Last modified by this user.

### getOrder

**Signature:** `getOrder() : Order`

Returns the Order this object was created for.

### getProductSubtotal

**Signature:** `getProductSubtotal() : SumItem`

Returns the sum-item representing the subtotal for product items.

### getServiceSubtotal

**Signature:** `getServiceSubtotal() : SumItem`

Returns the sum-item representing the subtotal for service items such as shipping.

## Method Detail

## Method Details

### getCreatedBy

**Signature:** `getCreatedBy() : String`

**Description:** Created by this user.

**Returns:**

Created by this user

---

### getCreationDate

**Signature:** `getCreationDate() : Date`

**Description:** The time of creation.

**Returns:**

time of creation.

---

### getGrandTotal

**Signature:** `getGrandTotal() : SumItem`

**Description:** Returns the sum-item representing the grandtotal for all items.

**Returns:**

sum-item for all items

---

### getItems

**Signature:** `getItems() : FilteringCollection`

**Description:** Returns the unsorted collection of items

**Returns:**

the unsorted collection of items

---

### getLastModified

**Signature:** `getLastModified() : Date`

**Description:** The last modification time.

**Returns:**

last modification time..

---

### getModifiedBy

**Signature:** `getModifiedBy() : String`

**Description:** Last modified by this user.

**Returns:**

Last modified by this user

---

### getOrder

**Signature:** `getOrder() : Order`

**Description:** Returns the Order this object was created for.

**Returns:**

the Order this object was created for.

---

### getProductSubtotal

**Signature:** `getProductSubtotal() : SumItem`

**Description:** Returns the sum-item representing the subtotal for product items.

**Returns:**

sum-item for product items

---

### getServiceSubtotal

**Signature:** `getServiceSubtotal() : SumItem`

**Description:** Returns the sum-item representing the subtotal for service items such as shipping.

**Returns:**

sum-item for service items such as shipping

---