## Package: dw.order

# Class ShippingOrderItem

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItem
    - dw.order.ShippingOrderItem

## Description

One or more ShippingOrderItems are contained in a ShippingOrder, created using ShippingOrder.createShippingOrderItem(OrderItem, Quantity) and can be retrieved by ShippingOrder.getItems(). A ShippingOrderItem references a single OrderItem which in turn references a LineItem associated with an Order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

## Properties

### basePrice

**Type:** Money (Read Only)

Price of a single unit before discount application.

### parentItem

**Type:** ShippingOrderItem

Returns null or the parent item.

### quantity

**Type:** Quantity (Read Only)

The quantity of the shipping order item.
 
 The Quantity is equal to the related line item quantity.

### shippingOrderNumber

**Type:** String (Read Only)

The mandatory shipping order number of the related
 ShippingOrder.

### status

**Type:** EnumValue

Gets the order item status.
 
 The possible values are STATUS_CONFIRMED,
 STATUS_WAREHOUSE, STATUS_SHIPPED,
 STATUS_CANCELLED.

### trackingRefs

**Type:** FilteringCollection (Read Only)

Gets the tracking refs (tracking infos) the shipping order item is
 assigned to.

## Constructor Summary

## Method Summary

### addTrackingRef

**Signature:** `addTrackingRef(trackingInfoID : String, quantity : Quantity) : TrackingRef`

A shipping order item can be assigned to one or many tracking infos with different quantities.

### applyPriceRate

**Signature:** `applyPriceRate(factor : Decimal, divisor : Decimal, roundUp : boolean) : void`

Apply a rate of (factor / divisor) to the prices in this item, with the option to half round up or half round down to the nearest cent if necessary.

### getBasePrice

**Signature:** `getBasePrice() : Money`

Price of a single unit before discount application.

### getParentItem

**Signature:** `getParentItem() : ShippingOrderItem`

Returns null or the parent item.

### getQuantity

**Signature:** `getQuantity() : Quantity`

The quantity of the shipping order item.

### getShippingOrderNumber

**Signature:** `getShippingOrderNumber() : String`

The mandatory shipping order number of the related ShippingOrder.

### getStatus

**Signature:** `getStatus() : EnumValue`

Gets the order item status.

### getTrackingRefs

**Signature:** `getTrackingRefs() : FilteringCollection`

Gets the tracking refs (tracking infos) the shipping order item is assigned to.

### setParentItem

**Signature:** `setParentItem(parentItem : ShippingOrderItem) : void`

Set a parent item.

### setStatus

**Signature:** `setStatus(status : String) : void`

Sets the status.

### split

**Signature:** `split(quantity : Quantity) : ShippingOrderItem`

Split the shipping order item.

### split

**Signature:** `split(quantity : Quantity, splitOrderItem : boolean) : ShippingOrderItem`

Split the shipping order item.

## Method Detail

## Method Details

### addTrackingRef

**Signature:** `addTrackingRef(trackingInfoID : String, quantity : Quantity) : TrackingRef`

**Description:** A shipping order item can be assigned to one or many tracking infos with different quantities. For example an item with quantity 3 may have been shipped in 2 packages, each represented by its own tracking info - 2 TrackingRefs would exist with quantities 1 and 2. This method creates and adds a new tracking reference to this shipping order item for a given tracking info and quantity. The new instance is returned.

**Parameters:**

- `trackingInfoID`: the id of the tracking info
- `quantity`: the quantity the which is assigned to the tracking info for this shipping order item. Optional (null is allowed).

**Returns:**

the new tracking reference

**See Also:**

TrackingRef

---

### applyPriceRate

**Signature:** `applyPriceRate(factor : Decimal, divisor : Decimal, roundUp : boolean) : void`

**Description:** Apply a rate of (factor / divisor) to the prices in this item, with the option to half round up or half round down to the nearest cent if necessary. Examples: TaxBasis beforefactordivisorroundupCalculationTaxBasis after $10.0012true10*1/2=$5.00 $10.00910true10*9/10=$9.00 $10.0013true10*1/3=3.3333=$3.33 $2.4712true2.47*1/2=1.235=$1.24 $2.4712false2.47*1/2=1.235=$1.23 Which prices are updated?: The rate described above is applied to tax-basis and tax then the net-price and gross-price are recalculated by adding / subtracting depending on whether the order is based on net price. Example (order based on net price) New TaxBasis:$10.00, Tax:$1.00, NetPrice=TaxBasis=$10.00, GrossPrice=TaxBasis+Tax=$11.00 Example (order based on gross price) New TaxBasis:$10.00, Tax:$1.00, NetPrice=TaxBasis-tax=$9.00, GrossPrice=TaxBasis=$10.00

**Parameters:**

- `factor`: factor used to calculate rate
- `divisor`: divisor used to calculate rate
- `roundUp`: whether to round up or down on 0.5

**See Also:**

AbstractItem.getTaxBasis()
AbstractItem.getTax()
AbstractItem.getNetPrice()
AbstractItem.getGrossPrice()
TaxMgr.getTaxationPolicy()

---

### getBasePrice

**Signature:** `getBasePrice() : Money`

**Description:** Price of a single unit before discount application.

**Returns:**

Price of a single unit before discount application.

---

### getParentItem

**Signature:** `getParentItem() : ShippingOrderItem`

**Description:** Returns null or the parent item.

**Returns:**

null or the parent item.

---

### getQuantity

**Signature:** `getQuantity() : Quantity`

**Description:** The quantity of the shipping order item. The Quantity is equal to the related line item quantity.

**Returns:**

the quantity

---

### getShippingOrderNumber

**Signature:** `getShippingOrderNumber() : String`

**Description:** The mandatory shipping order number of the related ShippingOrder.

**Returns:**

the shipping order number.

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Gets the order item status. The possible values are STATUS_CONFIRMED, STATUS_WAREHOUSE, STATUS_SHIPPED, STATUS_CANCELLED.

**Returns:**

the status

---

### getTrackingRefs

**Signature:** `getTrackingRefs() : FilteringCollection`

**Description:** Gets the tracking refs (tracking infos) the shipping order item is assigned to.

**Returns:**

the tracking refs ( tracking infos - TrackingRef ) the shipping order item is assigned to.

**See Also:**

TrackingRef

---

### setParentItem

**Signature:** `setParentItem(parentItem : ShippingOrderItem) : void`

**Description:** Set a parent item. The parent item must belong to the same ShippingOrder. An infinite parent-child loop is disallowed as is a parent-child depth greater than 10. Setting a parent item indicates a dependency of the child item on the parent item, and can be used to form a parallel structure to that accessed using ProductLineItem.getParent().

**Parameters:**

- `parentItem`: The parent item, null is allowed

---

### setStatus

**Signature:** `setStatus(status : String) : void`

**Description:** Sets the status. See ShippingOrder for details of shipping order status transitions. Do not use this method to set a shipping order to status WAREHOUSE, instead use ShippingOrder.setStatusWarehouse() This also triggers the setting of the status of the LineItem when appropriate. Setting this status can also have an impact on the order status, accessed using Order.getStatus() and the shipping order status, accessed using ShippingOrder.getStatus().

**Parameters:**

- `status`: the status

**Throws:**

NullPointerException - if status is null
IllegalArgumentException - if the status transition to the status is not allowed

---

### split

**Signature:** `split(quantity : Quantity) : ShippingOrderItem`

**Description:** Split the shipping order item. This will also lead to a split of the related LineItem. Split means that for the passed quantity a new item is created with this quantity as an exact copy of this item. The remaining amount will stay in this item. If quantity is equal to getQuantity() no split is done and this item is returned itself. This method is equivalent to split(Quantity, Boolean) called with splitOrderItem equals to true.

**Parameters:**

- `quantity`: the quantity for the newly created item

**Returns:**

the newly created item or this item

**Throws:**

IllegalArgumentException - if quantity is greater than getQuantity()

---

### split

**Signature:** `split(quantity : Quantity, splitOrderItem : boolean) : ShippingOrderItem`

**Description:** Split the shipping order item. This will also lead to a split of the related LineItem when splitOrderItem is true. Split means that for the passed quantity a new item is created with this quantity as an exact copy of this item. The remaining amount will stay in this item. If quantity is equal to getQuantity() no split is done and this item is returned itself.

**Parameters:**

- `quantity`: the quantity for the newly created item
- `splitOrderItem`: true the related LineItem will be splitted too false the related LineItem will not be splitted

**Returns:**

the newly created item or this item

**Throws:**

IllegalArgumentException - if quantity is greater than getQuantity()

---