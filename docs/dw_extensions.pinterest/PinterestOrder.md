## Package: dw.extensions.pinterest

# Class PinterestOrder

## Inheritance Hierarchy

- Object
  - dw.extensions.pinterest.PinterestOrder

## Description

An order that was placed through Pinterest.

## Constants

### PAYMENT_STATUS_NOT_PAID

**Type:** String = "NOT_PAID"

Indicates that payment has not been made.

### PAYMENT_STATUS_PAID

**Type:** String = "PAID"

Indicates that payment is complete.

### PAYMENT_STATUS_PART_PAID

**Type:** String = "PART_PAID"

Indicates that payment is incomplete.

### STATUS_BACKORDER

**Type:** String = "BACKORDER"

Indicates an order on backorder.

### STATUS_CANCELLED

**Type:** String = "CANCELLED"

Indicates an order that has been canceled.

### STATUS_DELIVERED

**Type:** String = "DELIVERED"

Indicates an order that has been delivered.

### STATUS_IN_PROGRESS

**Type:** String = "IN_PROGRESS"

Indicates an order in progress.

### STATUS_NEW

**Type:** String = "NEW"

Indicates a new order.

### STATUS_RETURNED

**Type:** String = "RETURNED"

Indicates an order that has been returned.

### STATUS_SHIPPED

**Type:** String = "SHIPPED"

Indicates an order that has shipped.

## Properties

### itemId

**Type:** String

The item ID for this Pinterest order.

### orderNo

**Type:** String (Read Only)

The order number for this Pinterest order. This is the same as the order number of the Demandware order.

### paymentStatus

**Type:** String

The status of this Pinterest order. Possible values are
 PAYMENT_STATUS_PAID,
 PAYMENT_STATUS_NOT_PAID,
 or PAYMENT_STATUS_PART_PAID.

### status

**Type:** String

The status of this Pinterest order. Possible values are
 STATUS_NEW,
 STATUS_IN_PROGRESS,
 STATUS_SHIPPED,
 STATUS_BACKORDER,
 STATUS_CANCELLED,
 STATUS_DELIVERED,
 or STATUS_RETURNED.

## Constructor Summary

## Method Summary

### getItemId

**Signature:** `getItemId() : String`

Returns the item ID for this Pinterest order.

### getOrderNo

**Signature:** `getOrderNo() : String`

Returns the order number for this Pinterest order.

### getPaymentStatus

**Signature:** `getPaymentStatus() : String`

Returns the status of this Pinterest order.

### getStatus

**Signature:** `getStatus() : String`

Returns the status of this Pinterest order.

### setItemId

**Signature:** `setItemId(itemId : String) : void`

Sets the item ID for this Pinterest order.

### setPaymentStatus

**Signature:** `setPaymentStatus(status : String) : void`

Sets the status of this Pinterest order.

### setStatus

**Signature:** `setStatus(status : String) : void`

Sets the status of this Pinterest order.

## Method Detail

## Method Details

### getItemId

**Signature:** `getItemId() : String`

**Description:** Returns the item ID for this Pinterest order.

---

### getOrderNo

**Signature:** `getOrderNo() : String`

**Description:** Returns the order number for this Pinterest order. This is the same as the order number of the Demandware order.

**Returns:**

order number

---

### getPaymentStatus

**Signature:** `getPaymentStatus() : String`

**Description:** Returns the status of this Pinterest order. Possible values are PAYMENT_STATUS_PAID, PAYMENT_STATUS_NOT_PAID, or PAYMENT_STATUS_PART_PAID.

---

### getStatus

**Signature:** `getStatus() : String`

**Description:** Returns the status of this Pinterest order. Possible values are STATUS_NEW, STATUS_IN_PROGRESS, STATUS_SHIPPED, STATUS_BACKORDER, STATUS_CANCELLED, STATUS_DELIVERED, or STATUS_RETURNED.

---

### setItemId

**Signature:** `setItemId(itemId : String) : void`

**Description:** Sets the item ID for this Pinterest order.

**Parameters:**

- `itemId`: item ID

---

### setPaymentStatus

**Signature:** `setPaymentStatus(status : String) : void`

**Description:** Sets the status of this Pinterest order. Possible values are PAYMENT_STATUS_PAID, PAYMENT_STATUS_NOT_PAID, or PAYMENT_STATUS_PART_PAID.

**Parameters:**

- `status`: the status to set for this order

---

### setStatus

**Signature:** `setStatus(status : String) : void`

**Description:** Sets the status of this Pinterest order. Possible values are STATUS_NEW, STATUS_IN_PROGRESS, STATUS_SHIPPED, STATUS_BACKORDER, STATUS_CANCELLED, STATUS_DELIVERED, or STATUS_RETURNED.

**Parameters:**

- `status`: the status to set for this order

---