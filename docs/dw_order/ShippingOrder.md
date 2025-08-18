## Package: dw.order

# Class ShippingOrder

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItemCtnr
    - dw.order.ShippingOrder

## Description

A shipping order is used to specify items that should be shipped, and is typically exported to, and updated by a back-office warehouse management system. An Order can have n shipping orders expressing how the order is to be shipped. The creation, export and update of shipping orders is largely handled by custom logic in scripts by implementing ShippingOrderHooks. Use method Order.createShippingOrder() for creation and add items using createShippingOrderItem(OrderItem, Quantity) - each item is related to an order item which in turn represents a product- or shipping- line item in the order. A shipping order has a status calculated from its item status, one of CONFIRMED - shipping order not yet exported, with 0 items, or all items in status CONFIRMED. WAREHOUSE - shipping order exported, with all items in status WAREHOUSE. SHIPPED - exported shipping order has been updated, with 1-n items in status SHIPPED and 0-n CANCELLED. CANCELLED - exported shipping order has been updated, with all items in status CANCELLED. The following status transitions are supported. Every status transition is documented by the addition of an order note such as 'Shipping order 123456 status changed to WAREHOUSE.': From To When Use CONFIRMED WAREHOUSE Shipping order exported Call setStatusWarehouse() - note this is the only way to set the items to status WAREHOUSE WAREHOUSE SHIPPED One or more items have been SHIPPED Call ShippingOrderItem.setStatus(String) using ShippingOrderItem.STATUS_SHIPPED WAREHOUSE CANCELLED All items have been CANCELLED Call ShippingOrderItem.setStatus(String) using ShippingOrderItem.STATUS_CANCELLED Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

### ORDERBY_ITEMID

**Type:** Object

Sorting by item id. Use with method getItems() as an argument to method FilteringCollection.sort(Object).

### ORDERBY_ITEMPOSITION

**Type:** Object

Sorting by the position of the related oder item. Use with method getItems() as an argument to method FilteringCollection.sort(Object).

### ORDERBY_UNSORTED

**Type:** Object

Unsorted , as it is. Use with method getItems() as an argument to method FilteringCollection.sort(Object).

### QUALIFIER_PRODUCTITEMS

**Type:** Object

Selects the product items. Use with method getItems() as an argument to method FilteringCollection.select(Object).

### QUALIFIER_SERVICEITEMS

**Type:** Object

Selects for the service items. Use with method getItems() as an argument to method FilteringCollection.select(Object).

### STATUS_CANCELLED

**Type:** String = "CANCELLED"

Constant for Shipping Order Status CANCELLED

### STATUS_CONFIRMED

**Type:** String = "CONFIRMED"

Constant for Shipping Order Status CONFIRMED

### STATUS_SHIPPED

**Type:** String = "SHIPPED"

Constant for Shipping Order Status SHIPPED

### STATUS_WAREHOUSE

**Type:** String = "WAREHOUSE"

Constant for Shipping Order Status WAREHOUSE

## Properties

### invoice

**Type:** Invoice (Read Only)

Returns null or the previously created Invoice.

### invoiceNumber

**Type:** String (Read Only)

Returns null or the invoice-number.

### items

**Type:** FilteringCollection (Read Only)

A filtering collection of the shipping order items belonging to the
 shipping order.
 
 This FilteringCollection could be sorted / filtered
 using:
 
 FilteringCollection.sort(Object) with
 ORDERBY_ITEMID
 FilteringCollection.sort(Object) with
 ORDERBY_ITEMPOSITION
 FilteringCollection.sort(Object) with
 ORDERBY_UNSORTED
 FilteringCollection.select(Object) with
 QUALIFIER_PRODUCTITEMS
 FilteringCollection.select(Object) with
 QUALIFIER_SERVICEITEMS

### shipDate

**Type:** Date

Gets the shipping date.
 
 Returns null if this shipping order is not yet shipped.

### shippingAddress

**Type:** OrderAddress

The shipping address (optional, can be null).

 
 Note: the shipping address is not copied into the
 ShippingOrder but is a link to a
 OrderAddress held in the Order.

### shippingMethod

**Type:** ShippingMethod (Read Only)

The shipping method of the shipping order.
 
 Can be null.

### shippingOrderNumber

**Type:** String (Read Only)

Gets the shipping order number.

### status

**Type:** EnumValue (Read Only)

Gets the status of this shipping order. The status is read-only and
 calculated from the item status. See class documentation for more
 details.
 The possible values are STATUS_CONFIRMED,
 STATUS_WAREHOUSE, STATUS_SHIPPED,
 STATUS_CANCELLED.

### trackingInfos

**Type:** Collection (Read Only)

Gets all tracking informations for this shipping order.

## Constructor Summary

## Method Summary

### addTrackingInfo

**Signature:** `addTrackingInfo(trackingInfoID : String) : TrackingInfo`

Adds a tracking info to this shipping order with the given ID.

### createInvoice

**Signature:** `createInvoice() : Invoice`

Creates a new Invoice based on this ShippingOrder.

### createInvoice

**Signature:** `createInvoice(invoiceNumber : String) : Invoice`

Creates a new Invoice based on this ShippingOrder.

### createShippingOrderItem

**Signature:** `createShippingOrderItem(orderItem : OrderItem, quantity : Quantity) : ShippingOrderItem`

Create a ShippingOrderItem in the shipping order with the number shippingOrderNumber.

### createShippingOrderItem

**Signature:** `createShippingOrderItem(orderItem : OrderItem, quantity : Quantity, splitIfPartial : boolean) : ShippingOrderItem`

Create a ShippingOrderItem in the shipping order with the number shippingOrderNumber.

### getInvoice

**Signature:** `getInvoice() : Invoice`

Returns null or the previously created Invoice.

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

Returns null or the invoice-number.

### getItems

**Signature:** `getItems() : FilteringCollection`

A filtering collection of the shipping order items belonging to the shipping order.

### getShipDate

**Signature:** `getShipDate() : Date`

Gets the shipping date.

### getShippingAddress

**Signature:** `getShippingAddress() : OrderAddress`

Returns the shipping address (optional, can be null).

### getShippingMethod

**Signature:** `getShippingMethod() : ShippingMethod`

Returns the shipping method of the shipping order.

### getShippingOrderNumber

**Signature:** `getShippingOrderNumber() : String`

Gets the shipping order number.

### getStatus

**Signature:** `getStatus() : EnumValue`

Gets the status of this shipping order.

### getTrackingInfo

**Signature:** `getTrackingInfo(trackingInfoID : String) : TrackingInfo`

Gets a tracking info for this shipping order.

### getTrackingInfos

**Signature:** `getTrackingInfos() : Collection`

Gets all tracking informations for this shipping order.

### setShipDate

**Signature:** `setShipDate(date : Date) : void`

Sets the shipping date.

### setShippingAddress

**Signature:** `setShippingAddress(address : OrderAddress) : void`

Set a shipping address for the shipping order.

### setShippingMethodID

**Signature:** `setShippingMethodID(shippingMethodID : String) : void`

Set the id of shipping method.

### setStatusWarehouse

**Signature:** `setStatusWarehouse() : void`

Set a CONFIRMED shipping order (all items in status CONFIRMED) to status WAREHOUSE (all items in status WAREHOUSE). Note - this method is the only way to transition a shipping order from CONFIRMED to WAREHOUSE.

## Method Detail

## Method Details

### addTrackingInfo

**Signature:** `addTrackingInfo(trackingInfoID : String) : TrackingInfo`

**Description:** Adds a tracking info to this shipping order with the given ID.

**Parameters:**

- `trackingInfoID`: the tracking info id

**Returns:**

the new tracking info

**See Also:**

TrackingInfo

---

### createInvoice

**Signature:** `createInvoice() : Invoice`

**Description:** Creates a new Invoice based on this ShippingOrder. The shipping-order-number will be used as the invoice-number. The Invoice can then be accessed using getInvoice() or getInvoiceNumber() can be used. The method must not be called more than once for a ShippingOrder, nor may 2 Invoices exist with the same invoice-number. The new Invoice is a debit-invoice with a status Invoice.STATUS_NOT_PAID, and will be passed to the capture payment-hook in a separate database transaction for processing.

**Returns:**

new invoice

---

### createInvoice

**Signature:** `createInvoice(invoiceNumber : String) : Invoice`

**Description:** Creates a new Invoice based on this ShippingOrder. The invoice-number must be specified as an argument.The Invoice can then be accessed using getInvoice() or getInvoiceNumber() can be used. The method must not be called more than once for a ShippingOrder, nor may 2 Invoices exist with the same invoice-number. The new Invoice is a debit-invoice with a status Invoice.STATUS_NOT_PAID, and will be passed to the capture payment-hook in a separate database transaction for processing.

**Parameters:**

- `invoiceNumber`: the invoice-number to use

**Returns:**

new invoice

---

### createShippingOrderItem

**Signature:** `createShippingOrderItem(orderItem : OrderItem, quantity : Quantity) : ShippingOrderItem`

**Description:** Create a ShippingOrderItem in the shipping order with the number shippingOrderNumber. The quantity of the new item can be optionally specified. A quantity of null indicates the new item should be based on the entire order item and is recommended for ShippingLineItems. If a quantity is specified for a ProductLineItem which is less than ProductLineItem.getQuantity() the ProductLineItem will be split, creating a new ProductLineItem. The new ShippingOrderItem will be associated with the new ProductLineItem, which will receive the specified quantity. See also createShippingOrderItem(OrderItem, Quantity, Boolean).

**Parameters:**

- `orderItem`: the order item for which the shipping order item is to be created
- `quantity`: the quantity for which the shipping order item will be created

**Returns:**

the created shipping order item

---

### createShippingOrderItem

**Signature:** `createShippingOrderItem(orderItem : OrderItem, quantity : Quantity, splitIfPartial : boolean) : ShippingOrderItem`

**Description:** Create a ShippingOrderItem in the shipping order with the number shippingOrderNumber. The quantity of the new item can be optionally specified. A quantity of null indicates the new item should be based on the entire order item and is recommended for ShippingLineItems. If the specified quantity is less than ProductLineItem.getQuantity() the ProductLineItem will be split or not depending on splitIfPartial parameter. When split is true, the method is equivalent to createShippingOrderItem(OrderItem, Quantity).

**Parameters:**

- `orderItem`: the order item for which the shipping order item is to be created
- `quantity`: the quantity for which the shipping order item will be created, not null
- `splitIfPartial`: the flag whether ProductLineItem should be split when requested quantity is less than ProductLineItem's quantity

**Returns:**

the created shipping order item

---

### getInvoice

**Signature:** `getInvoice() : Invoice`

**Description:** Returns null or the previously created Invoice.

**Returns:**

null or the previously created invoice.

**See Also:**

createInvoice(String)

---

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

**Description:** Returns null or the invoice-number.

**Returns:**

null or the previously created invoice number.

**See Also:**

createInvoice(String)

---

### getItems

**Signature:** `getItems() : FilteringCollection`

**Description:** A filtering collection of the shipping order items belonging to the shipping order. This FilteringCollection could be sorted / filtered using: FilteringCollection.sort(Object) with ORDERBY_ITEMID FilteringCollection.sort(Object) with ORDERBY_ITEMPOSITION FilteringCollection.sort(Object) with ORDERBY_UNSORTED FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS

**Returns:**

the filtering collection of the shipping items.

**See Also:**

createShippingOrderItem(OrderItem, Quantity)
ShippingOrderItem

---

### getShipDate

**Signature:** `getShipDate() : Date`

**Description:** Gets the shipping date. Returns null if this shipping order is not yet shipped.

**Returns:**

the shipping date or null

---

### getShippingAddress

**Signature:** `getShippingAddress() : OrderAddress`

**Description:** Returns the shipping address (optional, can be null). Note: the shipping address is not copied into the ShippingOrder but is a link to a OrderAddress held in the Order.

**Returns:**

the shipping address or null

---

### getShippingMethod

**Signature:** `getShippingMethod() : ShippingMethod`

**Description:** Returns the shipping method of the shipping order. Can be null.

**Returns:**

the shipping method or null

---

### getShippingOrderNumber

**Signature:** `getShippingOrderNumber() : String`

**Description:** Gets the shipping order number.

**Returns:**

the shipping order number

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Gets the status of this shipping order. The status is read-only and calculated from the item status. See class documentation for more details. The possible values are STATUS_CONFIRMED, STATUS_WAREHOUSE, STATUS_SHIPPED, STATUS_CANCELLED.

**Returns:**

the status

---

### getTrackingInfo

**Signature:** `getTrackingInfo(trackingInfoID : String) : TrackingInfo`

**Description:** Gets a tracking info for this shipping order.

**Parameters:**

- `trackingInfoID`: the tracking info id

**Returns:**

the tracking info or null

**See Also:**

TrackingInfo

---

### getTrackingInfos

**Signature:** `getTrackingInfos() : Collection`

**Description:** Gets all tracking informations for this shipping order.

**Returns:**

all tracking informations for this shipping order

**See Also:**

TrackingInfo

---

### setShipDate

**Signature:** `setShipDate(date : Date) : void`

**Description:** Sets the shipping date.

**Parameters:**

- `date`: the ship date

---

### setShippingAddress

**Signature:** `setShippingAddress(address : OrderAddress) : void`

**Description:** Set a shipping address for the shipping order.

**Parameters:**

- `address`: the shipping address

**See Also:**

getShippingAddress()

---

### setShippingMethodID

**Signature:** `setShippingMethodID(shippingMethodID : String) : void`

**Description:** Set the id of shipping method.

**Parameters:**

- `shippingMethodID`: the id of the shipping method

**See Also:**

ShippingMethod.getID()

---

### setStatusWarehouse

**Signature:** `setStatusWarehouse() : void`

**Description:** Set a CONFIRMED shipping order (all items in status CONFIRMED) to status WAREHOUSE (all items in status WAREHOUSE). Note - this method is the only way to transition a shipping order from CONFIRMED to WAREHOUSE.

**Throws:**

IllegalArgumentException - if the shipping order is in a status other than CONFIRMED.

---