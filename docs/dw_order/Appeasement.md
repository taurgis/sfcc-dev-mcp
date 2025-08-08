## Package: dw.order

# Class Appeasement

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItemCtnr
    - dw.order.Appeasement

## Description

The Appeasement represents a shopper request for an order credit. Example: The buyer finds any problem with the products but he agrees to preserve them, if he would be compensated, rather than return them. The Appeasement contains 1..n appeasement items. Each appeasement item is associated with one OrderItem usually representing an Order ProductLineItem. An Appeasement can have one of these status values: OPEN - the appeasement is open and appeasement items could be added to it COMPLETED - the appeasement is complete and it is not allowed to add new items to it, this is a precondition for refunding the customer for an appeasement. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

## Properties

### appeasementNumber

**Type:** String (Read Only)

The appeasement number.

### invoice

**Type:** Invoice (Read Only)

Returns null or the previously created Invoice.

### invoiceNumber

**Type:** String (Read Only)

Returns null or the invoice-number.

### items

**Type:** FilteringCollection (Read Only)

A filtering collection of the appeasement items belonging to the appeasement.
 
 This FilteringCollection could be sorted / filtered using:
 
 FilteringCollection.sort(Object) with ORDERBY_ITEMID
 FilteringCollection.sort(Object) with ORDERBY_ITEMPOSITION
 FilteringCollection.sort(Object) with ORDERBY_UNSORTED
 FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS
 FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS

### reasonCode

**Type:** EnumValue

The reason code for the appeasement. The list of reason codes can be updated
 by updating meta-data for Appeasement.

### reasonNote

**Type:** String

The reason note for the appeasement.

### status

**Type:** EnumValue

Gets the status of this appeasement.
 The possible values are STATUS_OPEN, STATUS_COMPLETED.

## Constructor Summary

## Method Summary

### addItems

**Signature:** `addItems(totalAmount : Money, orderItems : List) : void`

Creates appeasement items corresponding to certain order items and adds them to the appeasement.

### createInvoice

**Signature:** `createInvoice() : Invoice`

Creates a new Invoice based on this Appeasement.

### createInvoice

**Signature:** `createInvoice(invoiceNumber : String) : Invoice`

Creates a new Invoice based on this Appeasement.

### getAppeasementNumber

**Signature:** `getAppeasementNumber() : String`

Returns the appeasement number.

### getInvoice

**Signature:** `getInvoice() : Invoice`

Returns null or the previously created Invoice.

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

Returns null or the invoice-number.

### getItems

**Signature:** `getItems() : FilteringCollection`

Returns a filtering collection of the appeasement items belonging to the appeasement.

### getReasonCode

**Signature:** `getReasonCode() : EnumValue`

Returns the reason code for the appeasement.

### getReasonNote

**Signature:** `getReasonNote() : String`

Returns the reason note for the appeasement.

### getStatus

**Signature:** `getStatus() : EnumValue`

Gets the status of this appeasement. The possible values are STATUS_OPEN, STATUS_COMPLETED.

### setReasonCode

**Signature:** `setReasonCode(reasonCode : String) : void`

Set the reason code for the appeasement.

### setReasonNote

**Signature:** `setReasonNote(reasonNote : String) : void`

Sets the reason note for the appeasement.

### setStatus

**Signature:** `setStatus(appeasementStatus : String) : void`

Sets the appeasement status.

## Method Detail

## Method Details

### addItems

**Signature:** `addItems(totalAmount : Money, orderItems : List) : void`

**Description:** Creates appeasement items corresponding to certain order items and adds them to the appeasement.

**Parameters:**

- `totalAmount`: the appeasement amount corresponding to the provided order items; this amount is the net price when the order is net based and respectively - gross price when the order is gross based
- `orderItems`: the order items for which appeasement items should be created

---

### createInvoice

**Signature:** `createInvoice() : Invoice`

**Description:** Creates a new Invoice based on this Appeasement. The appeasement-number will be used as the invoice-number. The method must not be called more than once for an Appeasement, nor may 2 invoices exist with the same invoice-number. The new Invoice is a credit-invoice with a Invoice.STATUS_NOT_PAID status, and should be passed to the refund payment-hook in a separate database transaction for processing.

**Returns:**

the created invoice

---

### createInvoice

**Signature:** `createInvoice(invoiceNumber : String) : Invoice`

**Description:** Creates a new Invoice based on this Appeasement. The invoice-number must be specified as an argument. The method must not be called more than once for an Appeasement, nor may 2 invoices exist with the same invoice-number. The new Invoice is a credit-invoice with a Invoice.STATUS_NOT_PAID status, and should be passed to the refund payment-hook in a separate database transaction for processing.

**Parameters:**

- `invoiceNumber`: the invoice-number to be used in the appeasement creation process

**Returns:**

the created invoice

---

### getAppeasementNumber

**Signature:** `getAppeasementNumber() : String`

**Description:** Returns the appeasement number.

**Returns:**

the appeasement number

---

### getInvoice

**Signature:** `getInvoice() : Invoice`

**Description:** Returns null or the previously created Invoice.

**Returns:**

null or the previously created invoice

**See Also:**

createInvoice(String)

---

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

**Description:** Returns null or the invoice-number.

**Returns:**

null or the number of the previously created invoice

**See Also:**

createInvoice(String)

---

### getItems

**Signature:** `getItems() : FilteringCollection`

**Description:** Returns a filtering collection of the appeasement items belonging to the appeasement. This FilteringCollection could be sorted / filtered using: FilteringCollection.sort(Object) with ORDERBY_ITEMID FilteringCollection.sort(Object) with ORDERBY_ITEMPOSITION FilteringCollection.sort(Object) with ORDERBY_UNSORTED FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS

**Returns:**

the filtering collection of the appeasement items

---

### getReasonCode

**Signature:** `getReasonCode() : EnumValue`

**Description:** Returns the reason code for the appeasement. The list of reason codes can be updated by updating meta-data for Appeasement.

**Returns:**

the appeasement reason code

---

### getReasonNote

**Signature:** `getReasonNote() : String`

**Description:** Returns the reason note for the appeasement.

**Returns:**

the reason note or null

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Gets the status of this appeasement. The possible values are STATUS_OPEN, STATUS_COMPLETED.

**Returns:**

the status

---

### setReasonCode

**Signature:** `setReasonCode(reasonCode : String) : void`

**Description:** Set the reason code for the appeasement. The list of reason codes can be updated by updating meta-data for Appeasement.

**Parameters:**

- `reasonCode`: the reason code to set

---

### setReasonNote

**Signature:** `setReasonNote(reasonNote : String) : void`

**Description:** Sets the reason note for the appeasement.

**Parameters:**

- `reasonNote`: the reason note for the appeasement to set

---

### setStatus

**Signature:** `setStatus(appeasementStatus : String) : void`

**Description:** Sets the appeasement status. The possible values are STATUS_OPEN, STATUS_COMPLETED. When set to status COMPLETED, only the the custom attributes of its appeasement items can be changed.

**Parameters:**

- `appeasementStatus`: the appeasement status to set.

---