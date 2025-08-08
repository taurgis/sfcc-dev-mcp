## Package: dw.order

# Class OrderItem

## Inheritance Hierarchy

- Object
  - dw.order.OrderItem

## Description

Defines extensions to ProductLineItems and ShippingLineItems belonging to an order. The order-item can be accessed using ProductLineItem.getOrderItem() or ShippingLineItem.getOrderItem() - these methods return null if the item is associated with a basket rather than an order. Alternative access is available using Order.getOrderItem(String) by passing the itemID used to identify the order-item in for example export files. The associated order-item can also be accessed from invoice-items, shipping-order-items, return-items and return-case-items using AbstractItem.getOrderItem(). The order-item provides an item-level status and type, methods for accessing and creating associated items, and methods used to allocate inventory for shipping-order creation. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

## Properties

### appeasedAmount

**Type:** Money (Read Only)

Sum of amounts appeased for this item, calculated by iterating over
 invoice items associated with the item.

### capturedAmount

**Type:** Money (Read Only)

Sum of amounts captured for this item, calculated by iterating over
 invoice items associated with the item.

### invoiceItems

**Type:** Collection (Read Only)

All invoice items associated with this item, each
 InvoiceItem will belong to a different
 Invoice, which can also be accessed using
 Order.getInvoices() or Order.getInvoice(String).

### itemID

**Type:** String (Read Only)

The itemID used to identify the OrderItem. Note this is
 not a UUID, it is created internally when the OrderItem
 instance is created, and is typically used within export files to
 identify the item.

### lineItem

**Type:** LineItem (Read Only)

The line item which is being extended by this instance.

### refundedAmount

**Type:** Money (Read Only)

Sum of amounts refunded for this item, calculated by iterating over
 invoice items associated with the item.

### returnCaseItems

**Type:** Collection (Read Only)

All return case items associated with this item,
 each ReturnCaseItem will belong to a different
 ReturnCase, which can also be accessed using
 Order.getReturnCases() or Order.getReturnCase(String).

### returnedQuantity

**Type:** Quantity (Read Only)

The quantity returned, dynamically sum of quantities held by associated
 ReturnItems.

### shippingOrderItem

**Type:** ShippingOrderItem (Read Only)

The last added non-cancelled shipping order item if one exists, otherwise null.
 
 Multiple shipping order items that are not in status ShippingOrderItem.STATUS_CANCELLED
 can exist for one OrderItem, for example if the OrderItem has been split for shipping purposes.
 The method returns null if no non-cancelled shipping order item exists.

### shippingOrderItems

**Type:** Collection (Read Only)

A collection of the ShippingOrderItems created for this item.
 ShippingOrder items represents the whole or part of this item which could
 be delivered, and belong to a shipping order.
 Note that the cancelled shipping order items are returned too.
 This method is equivalent to getShippingOrderItems(Boolean)
 called with parameter true.

### splitItems

**Type:** Collection (Read Only)

A collection of all split OrderItems associated with this item. Inverse relation to getSplitSourceItem().
 
 Split order items are created when
 
 creating a ShippingOrderItem for a ShippingOrder, see ShippingOrder.createShippingOrderItem(OrderItem, Quantity)
 splitting an existing ShippingOrderItem, see ShippingOrderItem.split(Quantity)
 
 with a specified quantity less than the existing quantity of the associated ProductLineItem. In this case the associated ProductLineItem
 is split by creating a new ProductLineItem and associating a new ShippingOrderItem with this item. The new ShippingOrderItem
 receives the specified quantity and the quantity of the item is set to the remaining quantity. All split items are associated to their originating item via
 the "split source item" association.

### splitSourceItem

**Type:** OrderItem (Read Only)

The split source item associated with this item, if existing. Inverse relation to getSplitItems().
 
 A split source item is associated after the successful creation of a split item with a quantity less than the existing quantity of the item to split.
 For details see getSplitItems().

### status

**Type:** EnumValue

Gets the order item status.
 The possible values are:
 
 STATUS_NEW
 STATUS_OPEN
 STATUS_BACKORDER
 STATUS_CONFIRMED
 STATUS_WAREHOUSE
 STATUS_SHIPPED
 STATUS_CANCELLED

### type

**Type:** EnumValue (Read Only)

The type of line item with which this instance is associated, one
 of
 
 SERVICE (method getLineItem() returns a
 ShippingLineItem
 PRODUCT (method getLineItem() returns a
 ProductLineItem

## Constructor Summary

## Method Summary

### allocateInventory

**Signature:** `allocateInventory(partialAllocation : boolean) : Quantity`

Please note that this method is disabled by default.

### getAppeasedAmount

**Signature:** `getAppeasedAmount() : Money`

Sum of amounts appeased for this item, calculated by iterating over invoice items associated with the item.

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

Sum of amounts captured for this item, calculated by iterating over invoice items associated with the item.

### getInvoiceItems

**Signature:** `getInvoiceItems() : Collection`

Returns all invoice items associated with this item, each InvoiceItem will belong to a different Invoice, which can also be accessed using Order.getInvoices() or Order.getInvoice(String).

### getItemID

**Signature:** `getItemID() : String`

The itemID used to identify the OrderItem.

### getLineItem

**Signature:** `getLineItem() : LineItem`

Returns the line item which is being extended by this instance.

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

Sum of amounts refunded for this item, calculated by iterating over invoice items associated with the item.

### getReturnCaseItems

**Signature:** `getReturnCaseItems() : Collection`

Returns all return case items associated with this item, each ReturnCaseItem will belong to a different ReturnCase, which can also be accessed using Order.getReturnCases() or Order.getReturnCase(String).

### getReturnedQuantity

**Signature:** `getReturnedQuantity() : Quantity`

The quantity returned, dynamically sum of quantities held by associated ReturnItems.

### getShippingOrderItem

**Signature:** `getShippingOrderItem() : ShippingOrderItem`

The last added non-cancelled shipping order item if one exists, otherwise null.

### getShippingOrderItems

**Signature:** `getShippingOrderItems() : Collection`

Returns a collection of the ShippingOrderItems created for this item.

### getShippingOrderItems

**Signature:** `getShippingOrderItems(includeCancelled : boolean) : Collection`

Returns a collection of the ShippingOrderItems created for this item.

### getSplitItems

**Signature:** `getSplitItems() : Collection`

Returns a collection of all split OrderItems associated with this item.

### getSplitSourceItem

**Signature:** `getSplitSourceItem() : OrderItem`

Returns the split source item associated with this item, if existing.

### getStatus

**Signature:** `getStatus() : EnumValue`

Gets the order item status. The possible values are: STATUS_NEW STATUS_OPEN STATUS_BACKORDER STATUS_CONFIRMED STATUS_WAREHOUSE STATUS_SHIPPED STATUS_CANCELLED

### getType

**Signature:** `getType() : EnumValue`

Returns the type of line item with which this instance is associated, one of SERVICE (method getLineItem() returns a ShippingLineItem PRODUCT (method getLineItem() returns a ProductLineItem

### setStatus

**Signature:** `setStatus(status : String) : void`

Set the status of the order item, use one of the values documented in getStatus().

## Method Detail

## Method Details

### allocateInventory

**Signature:** `allocateInventory(partialAllocation : boolean) : Quantity`

**Description:** Please note that this method is disabled by default. Please contact support for enabling it. Attempts to allocate inventory for the item and returns the quantity that could be allocated or null if no allocation was possible. All option product line items are allocated with their parent. Note that for items with option product line items no partial allocation is possible. That means the partialAllocation parameter will in this case always be considered as false

**Parameters:**

- `partialAllocation`: true accept a partial allocation as a result. Partial allocation is only possible when no option product line items are included, false only full allocation will be used, partial allocation will be released automatically

**Returns:**

successful: the newly allocated quantity failed: null

---

### getAppeasedAmount

**Signature:** `getAppeasedAmount() : Money`

**Description:** Sum of amounts appeased for this item, calculated by iterating over invoice items associated with the item.

**Returns:**

Sum of amounts refunded for this item

---

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

**Description:** Sum of amounts captured for this item, calculated by iterating over invoice items associated with the item.

**Returns:**

Sum of amounts captured for this item

---

### getInvoiceItems

**Signature:** `getInvoiceItems() : Collection`

**Description:** Returns all invoice items associated with this item, each InvoiceItem will belong to a different Invoice, which can also be accessed using Order.getInvoices() or Order.getInvoice(String).

**Returns:**

invoice items associated with this item

---

### getItemID

**Signature:** `getItemID() : String`

**Description:** The itemID used to identify the OrderItem. Note this is not a UUID, it is created internally when the OrderItem instance is created, and is typically used within export files to identify the item.

**Returns:**

the itemID of the OrderItem

---

### getLineItem

**Signature:** `getLineItem() : LineItem`

**Description:** Returns the line item which is being extended by this instance.

**Returns:**

the line item associated with this instance

---

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

**Description:** Sum of amounts refunded for this item, calculated by iterating over invoice items associated with the item.

**Returns:**

Sum of amounts refunded for this item

---

### getReturnCaseItems

**Signature:** `getReturnCaseItems() : Collection`

**Description:** Returns all return case items associated with this item, each ReturnCaseItem will belong to a different ReturnCase, which can also be accessed using Order.getReturnCases() or Order.getReturnCase(String).

**Returns:**

return case items associated with this item

---

### getReturnedQuantity

**Signature:** `getReturnedQuantity() : Quantity`

**Description:** The quantity returned, dynamically sum of quantities held by associated ReturnItems.

**Returns:**

quantity returned, the sum of quantities held by associated ReturnItems

---

### getShippingOrderItem

**Signature:** `getShippingOrderItem() : ShippingOrderItem`

**Description:** The last added non-cancelled shipping order item if one exists, otherwise null. Multiple shipping order items that are not in status ShippingOrderItem.STATUS_CANCELLED can exist for one OrderItem, for example if the OrderItem has been split for shipping purposes. The method returns null if no non-cancelled shipping order item exists.

**Deprecated:**

This item is deprecated.

**Returns:**

the last not cancelled shipping order item or null

---

### getShippingOrderItems

**Signature:** `getShippingOrderItems() : Collection`

**Description:** Returns a collection of the ShippingOrderItems created for this item. ShippingOrder items represents the whole or part of this item which could be delivered, and belong to a shipping order. Note that the cancelled shipping order items are returned too. This method is equivalent to getShippingOrderItems(Boolean) called with parameter true.

**Returns:**

collection of the shipping order items created for this item

---

### getShippingOrderItems

**Signature:** `getShippingOrderItems(includeCancelled : boolean) : Collection`

**Description:** Returns a collection of the ShippingOrderItems created for this item. ShippingOrder items represent the whole or part of this item which could be delivered, and belong to a shipping order. Depending on the includeCancelled parameter the cancelled shipping order items will be returned or not.

**Parameters:**

- `includeCancelled`: true all shipping order items, including the cancelled, created for this item will be returned false only non-cancelled shipping order items created for this item will be returned

**Returns:**

collection of the shipping order items created for this item

---

### getSplitItems

**Signature:** `getSplitItems() : Collection`

**Description:** Returns a collection of all split OrderItems associated with this item. Inverse relation to getSplitSourceItem(). Split order items are created when creating a ShippingOrderItem for a ShippingOrder, see ShippingOrder.createShippingOrderItem(OrderItem, Quantity) splitting an existing ShippingOrderItem, see ShippingOrderItem.split(Quantity) with a specified quantity less than the existing quantity of the associated ProductLineItem. In this case the associated ProductLineItem is split by creating a new ProductLineItem and associating a new ShippingOrderItem with this item. The new ShippingOrderItem receives the specified quantity and the quantity of the item is set to the remaining quantity. All split items are associated to their originating item via the "split source item" association.

**Returns:**

the split order items associated with this item

---

### getSplitSourceItem

**Signature:** `getSplitSourceItem() : OrderItem`

**Description:** Returns the split source item associated with this item, if existing. Inverse relation to getSplitItems(). A split source item is associated after the successful creation of a split item with a quantity less than the existing quantity of the item to split. For details see getSplitItems().

**Returns:**

the split source item or null

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Gets the order item status. The possible values are: STATUS_NEW STATUS_OPEN STATUS_BACKORDER STATUS_CONFIRMED STATUS_WAREHOUSE STATUS_SHIPPED STATUS_CANCELLED

**Returns:**

the status

---

### getType

**Signature:** `getType() : EnumValue`

**Description:** Returns the type of line item with which this instance is associated, one of SERVICE (method getLineItem() returns a ShippingLineItem PRODUCT (method getLineItem() returns a ProductLineItem

**Returns:**

the type of order item, one of TYPE_PRODUCT or TYPE_SERVICE.

---

### setStatus

**Signature:** `setStatus(status : String) : void`

**Description:** Set the status of the order item, use one of the values documented in getStatus(). If the order item has a related shipping order item (see getShippingOrderItem()) the status of the shipping order item will be adjusted to the same status. Setting the status of an order item might also change the status of the related order. The following rules apply in top-down order: all items STATUS_CANCELLED - order status is Order.ORDER_STATUS_CANCELLED at least one item in status STATUS_SHIPPED and all other items are STATUS_CANCELLED order status is Order.ORDER_STATUS_COMPLETED at least one item in status STATUS_CREATED, STATUS_OPEN, STATUS_NEW , STATUS_BACKORDER - order status is Order.ORDER_STATUS_OPEN, order confirmation status is Order.CONFIRMATION_STATUS_NOTCONFIRMED other combinations will have only items in STATUS_CONFIRMED, STATUS_CANCELLED and STATUS_SHIPPED - order status is Order.ORDER_STATUS_OPEN, order confirmation status is Order.CONFIRMATION_STATUS_CONFIRMED

**Parameters:**

- `status`: status string matching one of the values for status

---