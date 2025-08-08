## Package: dw.order

# Class ReturnCase

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItemCtnr
    - dw.order.ReturnCase

## Description

All returns exist in the context of a ReturnCase, each Order can have any number of ReturnCases. The ReturnCase has ReturnCaseItems, each of which is associated with an OrderItem (an extension to either a ProductLineItem or a ShippingLineItem). Each ReturnCaseItem defines ReturnCaseItem.getAuthorizedQuantity() representing the maximum quantity expected to be returned. The ReturnCaseItem may be associated with 0..n ReturnItems - ReturnItems are added to the ReturnCaseItem when Returns are created. Either - a ReturnCase may be used as an RMA, in which case they are created when a customer first shows a wish to return item(s). The customer then includes the RMA number with the returned item(s). The Return created as a result is then associated with the existing ReturnCase. Or - a ReturnCase is automatically created as part of the return creation, i.e. the customer returns some item(s) leading to a creation of both a Return and an associated ReturnCase. The scripting api allows access to the ReturnCases, whether the ReturnCase is an RMA or not, and the ReturnCase status. Both the ReturnCaseItems and any Returns associated with the ReturnCase can be accessed. A ReturnCase has one of these status values: NEW - the ReturnCase has been created and can be edited previous to its authorization CONFIRMED - the ReturnCase is CONFIRMED, can no longer be edited, no Returns have been associated with it. Only a NEW- ReturnCase can be CONFIRMED PARTIAL_RETURNED - the ReturnCase has been associated with at least one Return, but is not yet complete. Only a CONFIRMED- ReturnCase can be set to PARTIAL_RETURNED RETURNED - the ReturnCase has been associated with Returns which match the expected authorized quantity. Only an CONFIRMED- or PARTIAL_RETURNED- return-case can be set to RETURNED CANCELLED - the ReturnCase has been cancelled (only a NEW- or CONFIRMED- ReturnCase can be cancelled) Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

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

Access the collection of ReturnCaseItems.
 
 This FilteringCollection can be sorted / filtered using:
 
 FilteringCollection.sort(Object) with ORDERBY_ITEMID
 FilteringCollection.sort(Object) with
 ORDERBY_ITEMPOSITION
 FilteringCollection.sort(Object) with ORDERBY_UNSORTED
 FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS
 FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS

### returnCaseNumber

**Type:** String (Read Only)

The mandatory return case number identifying this document.

### returns

**Type:** Collection (Read Only)

Return the collection of Returns associated with this ReturnCase.

### RMA

**Type:** Order.createReturnCase(String, Boolean) (Read Only)

Return whether this is an RMA. This is specified when calling Order.createReturnCase(String, Boolean).

### status

**Type:** EnumValue (Read Only)

Gets the return case item status. The status of a ReturnCase is read-only and calculated from the status of
 the associated ReturnCaseItems.
 
 The possible values are STATUS_NEW,STATUS_CONFIRMED,
 STATUS_PARTIAL_RETURNED, STATUS_RETURNED,
 STATUS_CANCELLED.

## Constructor Summary

## Method Summary

### confirm

**Signature:** `confirm() : void`

Attempt to confirm the ReturnCase.

### createInvoice

**Signature:** `createInvoice() : Invoice`

Creates a new Invoice based on this ReturnCase.

### createInvoice

**Signature:** `createInvoice(invoiceNumber : String) : Invoice`

Creates a new Invoice based on this ReturnCase.

### createItem

**Signature:** `createItem(orderItemID : String) : ReturnCaseItem`

Creates a new item for a given order item.

### createReturn

**Signature:** `createReturn(returnNumber : String) : Return`

Creates a new Return with the given number and associates it with this ReturnCase.

### createReturn

**Signature:** `createReturn() : Return`

Creates a new Return with a generated number and associates it with this ReturnCase.

### getInvoice

**Signature:** `getInvoice() : Invoice`

Returns null or the previously created Invoice.

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

Returns null or the invoice-number.

### getItems

**Signature:** `getItems() : FilteringCollection`

Access the collection of ReturnCaseItems.

### getReturnCaseNumber

**Signature:** `getReturnCaseNumber() : String`

Returns the mandatory return case number identifying this document.

### getReturns

**Signature:** `getReturns() : Collection`

Return the collection of Returns associated with this ReturnCase.

### getStatus

**Signature:** `getStatus() : EnumValue`

Gets the return case item status.

### isRMA

**Signature:** `isRMA() : boolean`

Return whether this is an RMA.

## Method Detail

## Method Details

### confirm

**Signature:** `confirm() : void`

**Description:** Attempt to confirm the ReturnCase. Without items the return case will be canceled When confirmed, only the the custom attributes of its return case items can be changed.

**Throws:**

IllegalStateException - thrown if Status is not STATUS_NEW

---

### createInvoice

**Signature:** `createInvoice() : Invoice`

**Description:** Creates a new Invoice based on this ReturnCase. The return-case-number will be used as the invoice-number. The Invoice can then be accessed using getInvoice() or its number using getInvoiceNumber(). The method must not be called more than once for a ReturnCase, nor may 2 Invoices exist with the same invoice-number. The new Invoice is a credit-invoice with a Invoice.STATUS_NOT_PAID status, and will be passed to the refund payment-hook in a separate database transaction for processing.

**Returns:**

new invoice

---

### createInvoice

**Signature:** `createInvoice(invoiceNumber : String) : Invoice`

**Description:** Creates a new Invoice based on this ReturnCase. The invoice-number must be specified as an argument. The Invoice can then be accessed using getInvoice() or its number using getInvoiceNumber(). The method must not be called more than once for a ReturnCase, nor may 2 Invoices exist with the same invoice-number. The new Invoice is a credit-invoice with a Invoice.STATUS_NOT_PAID status, and will be passed to the refund payment-hook in a separate database transaction for processing.

**Parameters:**

- `invoiceNumber`: the invoice-number to be used for the invoice creation

**Returns:**

new invoice

---

### createItem

**Signature:** `createItem(orderItemID : String) : ReturnCaseItem`

**Description:** Creates a new item for a given order item. Note: a ReturnCase may have only one item per order item.

**Parameters:**

- `orderItemID`: order item id

**Returns:**

null or item for given order item

**Throws:**

IllegalArgumentException - thrown if getItem(orderItem) returns non null

---

### createReturn

**Signature:** `createReturn(returnNumber : String) : Return`

**Description:** Creates a new Return with the given number and associates it with this ReturnCase.

**Parameters:**

- `returnNumber`: return number to assign

**Returns:**

new Return instance

---

### createReturn

**Signature:** `createReturn() : Return`

**Description:** Creates a new Return with a generated number and associates it with this ReturnCase.

**Returns:**

new Return instance

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

**Description:** Access the collection of ReturnCaseItems. This FilteringCollection can be sorted / filtered using: FilteringCollection.sort(Object) with ORDERBY_ITEMID FilteringCollection.sort(Object) with ORDERBY_ITEMPOSITION FilteringCollection.sort(Object) with ORDERBY_UNSORTED FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS

**Returns:**

the items

---

### getReturnCaseNumber

**Signature:** `getReturnCaseNumber() : String`

**Description:** Returns the mandatory return case number identifying this document.

**Returns:**

the return case number

---

### getReturns

**Signature:** `getReturns() : Collection`

**Description:** Return the collection of Returns associated with this ReturnCase.

**Returns:**

the collection of Returns.

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Gets the return case item status. The status of a ReturnCase is read-only and calculated from the status of the associated ReturnCaseItems. The possible values are STATUS_NEW,STATUS_CONFIRMED, STATUS_PARTIAL_RETURNED, STATUS_RETURNED, STATUS_CANCELLED.

**Returns:**

the status

---

### isRMA

**Signature:** `isRMA() : boolean`

**Description:** Return whether this is an RMA. This is specified when calling Order.createReturnCase(String, Boolean).

**Returns:**

whether this is an RMA.

---