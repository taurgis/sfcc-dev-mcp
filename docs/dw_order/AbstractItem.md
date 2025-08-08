## Package: dw.order

# Class AbstractItem

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItem

## Description

An item which references, or in other words is based upon, an OrderItem. Provides methods to access the OrderItem, the order LineItem which has been extended, and the Order. In addition it defines methods to access item level prices and the item id. Supports custom-properties.

## Properties

### grossPrice

**Type:** Money (Read Only)

Gross price of item.

### itemID

**Type:** String (Read Only)

The item-id used for referencing between items

### lineItem

**Type:** LineItem (Read Only)

The Order Product- or Shipping- LineItem associated with this item. Should never return null.

### netPrice

**Type:** Money (Read Only)

Net price of item.

### orderItem

**Type:** OrderItem (Read Only)

The order item extensions related to this item. Should never return null.

### orderItemID

**Type:** String (Read Only)

The order-item-id used for referencing the OrderItem

### tax

**Type:** Money (Read Only)

Total tax for item.

### taxBasis

**Type:** Money (Read Only)

Price of entire item on which tax calculation is based. Same as getNetPrice()
 or getGrossPrice() depending on whether the order is based on net or gross prices.

### taxItems

**Type:** Collection (Read Only)

Tax items representing a tax breakdown

## Constructor Summary

## Method Summary

### getGrossPrice

**Signature:** `getGrossPrice() : Money`

Gross price of item.

### getItemID

**Signature:** `getItemID() : String`

The item-id used for referencing between items

### getLineItem

**Signature:** `getLineItem() : LineItem`

Returns the Order Product- or Shipping- LineItem associated with this item.

### getNetPrice

**Signature:** `getNetPrice() : Money`

Net price of item.

### getOrderItem

**Signature:** `getOrderItem() : OrderItem`

Returns the order item extensions related to this item.

### getOrderItemID

**Signature:** `getOrderItemID() : String`

The order-item-id used for referencing the OrderItem

### getTax

**Signature:** `getTax() : Money`

Total tax for item.

### getTaxBasis

**Signature:** `getTaxBasis() : Money`

Price of entire item on which tax calculation is based.

### getTaxItems

**Signature:** `getTaxItems() : Collection`

Tax items representing a tax breakdown

## Method Detail

## Method Details

### getGrossPrice

**Signature:** `getGrossPrice() : Money`

**Description:** Gross price of item.

**Returns:**

Gross price of item.

---

### getItemID

**Signature:** `getItemID() : String`

**Description:** The item-id used for referencing between items

**Returns:**

the item-id used for referencing between items

---

### getLineItem

**Signature:** `getLineItem() : LineItem`

**Description:** Returns the Order Product- or Shipping- LineItem associated with this item. Should never return null.

**Returns:**

the Order Product- or Shipping- LineItem associated with this item

---

### getNetPrice

**Signature:** `getNetPrice() : Money`

**Description:** Net price of item.

**Returns:**

Net price of item.

---

### getOrderItem

**Signature:** `getOrderItem() : OrderItem`

**Description:** Returns the order item extensions related to this item. Should never return null.

**Returns:**

the order item extensions related to this item

---

### getOrderItemID

**Signature:** `getOrderItemID() : String`

**Description:** The order-item-id used for referencing the OrderItem

**Returns:**

the order-item-id used for referencing the OrderItem

---

### getTax

**Signature:** `getTax() : Money`

**Description:** Total tax for item.

**Returns:**

Total tax for item.

---

### getTaxBasis

**Signature:** `getTaxBasis() : Money`

**Description:** Price of entire item on which tax calculation is based. Same as getNetPrice() or getGrossPrice() depending on whether the order is based on net or gross prices.

**Returns:**

Price of entire item on which tax calculation is based

---

### getTaxItems

**Signature:** `getTaxItems() : Collection`

**Description:** Tax items representing a tax breakdown

**Returns:**

tax items representing a tax breakdown

**See Also:**

TaxItem

---