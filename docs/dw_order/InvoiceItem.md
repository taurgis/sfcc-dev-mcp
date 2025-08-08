## Package: dw.order

# Class InvoiceItem

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItem
    - dw.order.InvoiceItem

## Description

Represents a specific item in an Invoice. Invoice items are added to the invoice on its creation, each item references exactly one order-item. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Properties

### basePrice

**Type:** Money (Read Only)

Price of a single unit before discount application.

### capturedAmount

**Type:** Money

The captured amount for this item.

### invoiceNumber

**Type:** String (Read Only)

The number of the invoice to which this item belongs.

### parentItem

**Type:** InvoiceItem

Returns null or the parent item.

### quantity

**Type:** Quantity (Read Only)

The quantity of this item.

### refundedAmount

**Type:** Money

The refunded amount for this item.

## Constructor Summary

## Method Summary

### getBasePrice

**Signature:** `getBasePrice() : Money`

Price of a single unit before discount application.

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

Returns the captured amount for this item.

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

Returns the number of the invoice to which this item belongs.

### getParentItem

**Signature:** `getParentItem() : InvoiceItem`

Returns null or the parent item.

### getQuantity

**Signature:** `getQuantity() : Quantity`

Returns the quantity of this item.

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

Returns the refunded amount for this item.

### setCapturedAmount

**Signature:** `setCapturedAmount(capturedAmount : Money) : void`

Updates the captured amount for this item.

### setParentItem

**Signature:** `setParentItem(parentItem : InvoiceItem) : void`

Set a parent item.

### setRefundedAmount

**Signature:** `setRefundedAmount(refundedAmount : Money) : void`

Updates the refunded amount for this item.

## Method Detail

## Method Details

### getBasePrice

**Signature:** `getBasePrice() : Money`

**Description:** Price of a single unit before discount application.

**Returns:**

Price of a single unit before discount application.

---

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

**Description:** Returns the captured amount for this item.

**Returns:**

the captured amount for this item

---

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

**Description:** Returns the number of the invoice to which this item belongs.

**Returns:**

the number of the invoice to which this item belongs

---

### getParentItem

**Signature:** `getParentItem() : InvoiceItem`

**Description:** Returns null or the parent item.

**Returns:**

null or the parent item.

---

### getQuantity

**Signature:** `getQuantity() : Quantity`

**Description:** Returns the quantity of this item.

**Returns:**

quantity of this item

---

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

**Description:** Returns the refunded amount for this item.

**Returns:**

the refunded amount for this item

---

### setCapturedAmount

**Signature:** `setCapturedAmount(capturedAmount : Money) : void`

**Description:** Updates the captured amount for this item.

**Parameters:**

- `capturedAmount`: the captured amount for this item

---

### setParentItem

**Signature:** `setParentItem(parentItem : InvoiceItem) : void`

**Description:** Set a parent item. The parent item must belong to the same Invoice. An infinite parent-child loop is disallowed as is a parent-child depth greater than 10. Setting a parent item indicates a dependency of the child item on the parent item, and can be used to form a parallel structure to that accessed using ProductLineItem.getParent().

**Parameters:**

- `parentItem`: The parent item, null is allowed

---

### setRefundedAmount

**Signature:** `setRefundedAmount(refundedAmount : Money) : void`

**Description:** Updates the refunded amount for this item.

**Parameters:**

- `refundedAmount`: the refunded amount for this item

---