## Package: dw.order

# Class Return

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItemCtnr
    - dw.order.Return

## Description

The Return represents a physical customer return, and contains 1..n ReturnItems. The Return is associated with one ReturnCase, and each ReturnItem is associated with one ReturnCaseItem and (via the ReturnCaseItem) a single OrderItem usually representing an Order ProductLineItem. The ReturnItem records the quantity returned. The Return can have one of these status values: NEW - the return is new, i.e. needs to undergo a check before it can be marked as COMPLETED COMPLETED - the return is complete, this is a precondition for refunding the customer for a return. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

## Properties

### invoice

**Type:** Invoice (Read Only)

Returns null or the previously created Invoice.

### invoiceNumber

**Type:** String (Read Only)

Returns null or the invoice-number.

### items

**Type:** FilteringCollection (Read Only)

The ReturnItems contained in the Return, created with method
 createItem(String).

 
 This FilteringCollection can be sorted / filtered using:
 
 FilteringCollection.sort(Object) with ORDERBY_ITEMID
 FilteringCollection.sort(Object) with
 ORDERBY_ITEMPOSITION
 FilteringCollection.sort(Object) with ORDERBY_UNSORTED
 FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS
 FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS

### note

**Type:** String

A note for the return.

### returnCase

**Type:** ReturnCase (Read Only)

The ReturnCase with which this Return is associated. The ReturnCase
 may represent an RMA (return merchandise authorization).

### returnNumber

**Type:** String (Read Only)

The return number identifying this return.

### status

**Type:** EnumValue

Gets the return status.
 
 Possible values are STATUS_NEW, STATUS_COMPLETED.

## Constructor Summary

## Method Summary

### createInvoice

**Signature:** `createInvoice() : Invoice`

Creates a new Invoice based on this Return.

### createInvoice

**Signature:** `createInvoice(invoiceNumber : String) : Invoice`

Creates a new Invoice based on this Return.

### createItem

**Signature:** `createItem(returnCaseItemID : String) : ReturnItem`

Create a ReturnItem based on a ReturnCaseItem.

### getInvoice

**Signature:** `getInvoice() : Invoice`

Returns null or the previously created Invoice.

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

Returns null or the invoice-number.

### getItems

**Signature:** `getItems() : FilteringCollection`

Returns the ReturnItems contained in the Return, created with method createItem(String).

### getNote

**Signature:** `getNote() : String`

A note for the return.

### getReturnCase

**Signature:** `getReturnCase() : ReturnCase`

Returns the ReturnCase with which this Return is associated.

### getReturnNumber

**Signature:** `getReturnNumber() : String`

The return number identifying this return.

### getStatus

**Signature:** `getStatus() : EnumValue`

Gets the return status.

### setNote

**Signature:** `setNote(note : String) : void`

Sets a note for the return.

### setStatus

**Signature:** `setStatus(statusName : String) : void`

Sets the return status.

## Method Detail

## Method Details

### createInvoice

**Signature:** `createInvoice() : Invoice`

**Description:** Creates a new Invoice based on this Return. The return-number will be used as the invoice-number. The Invoice can then be accessed using getInvoice() or its number using getInvoiceNumber(). The method must not be called more than once for a Return, nor may 2 Invoices exist with the same invoice-number. The new Invoice is a credit-invoice with a Invoice.STATUS_NOT_PAID status, and will be passed to the refund payment-hook in a separate database transaction for processing.

**Returns:**

new invoice

---

### createInvoice

**Signature:** `createInvoice(invoiceNumber : String) : Invoice`

**Description:** Creates a new Invoice based on this Return. The invoice-number must be specified as an argument. The Invoice can then be accessed using getInvoice() or its number using getInvoiceNumber(). The method must not be called more than once for a Return, nor may 2 Invoices exist with the same invoice-number. The new Invoice is a credit-invoice with a Invoice.STATUS_NOT_PAID status, and will be passed to the refund payment-hook in a separate database transaction for processing.

**Parameters:**

- `invoiceNumber`: the invoice-number to use

**Returns:**

the new invoice

---

### createItem

**Signature:** `createItem(returnCaseItemID : String) : ReturnItem`

**Description:** Create a ReturnItem based on a ReturnCaseItem.

**Parameters:**

- `returnCaseItemID`: the id of the return case item

**Returns:**

the created return item

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

null or the previously created invoice.

**See Also:**

createInvoice(String)

---

### getItems

**Signature:** `getItems() : FilteringCollection`

**Description:** Returns the ReturnItems contained in the Return, created with method createItem(String). This FilteringCollection can be sorted / filtered using: FilteringCollection.sort(Object) with ORDERBY_ITEMID FilteringCollection.sort(Object) with ORDERBY_ITEMPOSITION FilteringCollection.sort(Object) with ORDERBY_UNSORTED FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS

**Returns:**

the return items

**See Also:**

ReturnItem

---

### getNote

**Signature:** `getNote() : String`

**Description:** A note for the return.

**Returns:**

the note or null

---

### getReturnCase

**Signature:** `getReturnCase() : ReturnCase`

**Description:** Returns the ReturnCase with which this Return is associated. The ReturnCase may represent an RMA (return merchandise authorization).

**Returns:**

the return case

---

### getReturnNumber

**Signature:** `getReturnNumber() : String`

**Description:** The return number identifying this return.

**Returns:**

the return number

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Gets the return status. Possible values are STATUS_NEW, STATUS_COMPLETED.

**Returns:**

the status

---

### setNote

**Signature:** `setNote(note : String) : void`

**Description:** Sets a note for the return.

**Parameters:**

- `note`: the note

---

### setStatus

**Signature:** `setStatus(statusName : String) : void`

**Description:** Sets the return status. Possible values are STATUS_NEW, STATUS_COMPLETED When set to status COMPLETED, only the the custom attributes of the return itself and its return items can be changed.

**Parameters:**

- `statusName`: the status

---