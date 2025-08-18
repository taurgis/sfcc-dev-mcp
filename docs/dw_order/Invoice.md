## Package: dw.order

# Class Invoice

## Inheritance Hierarchy

- Object
  - dw.object.Extensible
  - dw.order.AbstractItemCtnr
    - dw.order.Invoice

## Description

The Invoice can be a debit or credit invoice, and is created from custom scripts using one of the methods ShippingOrder.createInvoice(String), Appeasement.createInvoice(String), ReturnCase.createInvoice(String) or Return.createInvoice(String). Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

### ORDERBY_CREATION_DATE

**Type:** Object

Sorting by creation date. Use with method getPaymentTransactions() as an argument to method FilteringCollection.sort(Object).

### ORDERBY_ITEMID

**Type:** Object

Sorting by item id. Use with method getItems() as an argument to method FilteringCollection.sort(Object).

### ORDERBY_ITEMPOSITION

**Type:** Object

Sorting by the position of the related oder item. Use with method getItems() as an argument to method FilteringCollection.sort(Object).

### ORDERBY_REVERSE

**Type:** Object

Reverse orders. Use as an argument to method FilteringCollection.sort(Object).

### ORDERBY_UNSORTED

**Type:** Object

Unsorted , as it is. Use with method getItems() as an argument to method FilteringCollection.sort(Object).

### QUALIFIER_CAPTURE

**Type:** Object

Selects the capture transactions. Use with method getPaymentTransactions() as an argument to method FilteringCollection.select(Object).

### QUALIFIER_PRODUCTITEMS

**Type:** Object

Selects the product items. Use with method getItems() as an argument to method FilteringCollection.select(Object).

### QUALIFIER_REFUND

**Type:** Object

Selects the refund transactions. Use with method getPaymentTransactions() as an argument to method FilteringCollection.select(Object).

### QUALIFIER_SERVICEITEMS

**Type:** Object

Selects for the service items. Use with method getItems() as an argument to method FilteringCollection.select(Object).

### STATUS_FAILED

**Type:** String = "FAILED"

Constant for Invoice Status Failed. The invoice handling failed.

### STATUS_MANUAL

**Type:** String = "MANUAL"

Constant for Invoice Status Manual. The invoice is not paid but will not be handled automatically. A manual invoice handling (capture or refund) is necessary.

### STATUS_NOT_PAID

**Type:** String = "NOT_PAID"

Constant for Invoice Status Not Paid. The invoice is not paid and will be handled automatically.

### STATUS_PAID

**Type:** String = "PAID"

Constant for Invoice Status Paid. The invoice was successfully paid.

### TYPE_APPEASEMENT

**Type:** String = "APPEASEMENT"

Constant for Invoice Type Appeasement. The invoice was created for an appeasement. The invoice amount needs to be refunded.

### TYPE_RETURN

**Type:** String = "RETURN"

Constant for Invoice Type Return. The invoice was created for a return. The invoice amount needs to be refunded.

### TYPE_RETURN_CASE

**Type:** String = "RETURN_CASE"

Constant for Invoice Type Return Case. The invoice was created for a return case. The invoice amount needs to be refunded.

### TYPE_SHIPPING

**Type:** String = "SHIPPING"

Constant for Invoice Type Shipping. The invoice was created for a shipping order. The invoice amount needs to be captured.

## Properties

### capturedAmount

**Type:** Money (Read Only)

The sum of the captured amounts. The captured amounts are
 calculated on the fly.
 Associate a payment capture for a OrderPaymentInstrument
 with an Invoice using
 addCaptureTransaction(OrderPaymentInstrument, Money).

### invoiceNumber

**Type:** String (Read Only)

The invoice number.

### items

**Type:** FilteringCollection (Read Only)

Access the collection of InvoiceItems.
 
 This FilteringCollection can be sorted / filtered using:
 
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

### paymentTransactions

**Type:** FilteringCollection (Read Only)

The payment transactions belonging to this Invoice.
 
 This FilteringCollection can be sorted / filtered using:
 
 FilteringCollection.sort(Object) with
 ORDERBY_CREATION_DATE
 FilteringCollection.sort(Object) with
 ORDERBY_UNSORTED
 FilteringCollection.select(Object) with
 QUALIFIER_CAPTURE
 FilteringCollection.select(Object) with
 QUALIFIER_REFUND

### refundedAmount

**Type:** Money (Read Only)

The sum of the refunded amounts. The refunded amounts are
 calculated on the fly.
 Associate a payment capture for a OrderPaymentInstrument
 with an Invoice using
 addRefundTransaction(OrderPaymentInstrument, Money).

### status

**Type:** EnumValue

The invoice status.
 The possible values are STATUS_NOT_PAID, STATUS_MANUAL,
 STATUS_PAID, STATUS_FAILED.

### type

**Type:** EnumValue (Read Only)

The invoice type.
 The possible values are TYPE_SHIPPING, TYPE_RETURN,
 TYPE_RETURN_CASE, TYPE_APPEASEMENT.

## Constructor Summary

## Method Summary

### account

**Signature:** `account() : boolean`

The invoice will be accounted.

### addCaptureTransaction

**Signature:** `addCaptureTransaction(instrument : OrderPaymentInstrument, capturedAmount : Money) : PaymentTransaction`

Calling this method registers an amount captured for a given order payment instrument.

### addRefundTransaction

**Signature:** `addRefundTransaction(instrument : OrderPaymentInstrument, refundedAmount : Money) : PaymentTransaction`

Calling this method registers an amount refunded for a given order payment instrument.

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

Returns the sum of the captured amounts.

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

Returns the invoice number.

### getItems

**Signature:** `getItems() : FilteringCollection`

Access the collection of InvoiceItems.

### getPaymentTransactions

**Signature:** `getPaymentTransactions() : FilteringCollection`

Returns the payment transactions belonging to this Invoice.

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

Returns the sum of the refunded amounts.

### getStatus

**Signature:** `getStatus() : EnumValue`

Returns the invoice status. The possible values are STATUS_NOT_PAID, STATUS_MANUAL, STATUS_PAID, STATUS_FAILED.

### getType

**Signature:** `getType() : EnumValue`

Returns the invoice type. The possible values are TYPE_SHIPPING, TYPE_RETURN, TYPE_RETURN_CASE, TYPE_APPEASEMENT.

### setStatus

**Signature:** `setStatus(status : String) : void`

Sets the invoice status. The possible values are STATUS_NOT_PAID, STATUS_MANUAL, STATUS_PAID, STATUS_FAILED.

## Method Detail

## Method Details

### account

**Signature:** `account() : boolean`

**Description:** The invoice will be accounted. It will be captured in case of a shipping invoice and it will be refunded in case of an appeasement, return case or return invoice. The accounting will be handled in the payment hooks PaymentHooks.capture(Invoice) or PaymentHooks.refund(Invoice). The implementing script could add payment transactions to the invoice. The accompanying business logic will set the status to PAID or FAILED. The accounting will fail when the invoice state is different to STATUS_NOT_PAID or STATUS_FAILED. The method implements its own transaction handling. The method must not be called inside a transaction.

**Returns:**

true when the accounting was successful, otherwise false.

---

### addCaptureTransaction

**Signature:** `addCaptureTransaction(instrument : OrderPaymentInstrument, capturedAmount : Money) : PaymentTransaction`

**Description:** Calling this method registers an amount captured for a given order payment instrument. The authorization for the capture is associated with the payment transaction belonging to the instrument. Calling this method allows the Invoice, the OrderPaymentInstrument and the Order to return their captured amount as a sum calculated on the fly. The method may be called multiple times for the same instrument (multiple capture for one authorization) or for different instruments (invoice settlement using multiple payments).

**Parameters:**

- `instrument`: the order payment instrument
- `capturedAmount`: amount to register as captured

**Returns:**

the created capture transaction

---

### addRefundTransaction

**Signature:** `addRefundTransaction(instrument : OrderPaymentInstrument, refundedAmount : Money) : PaymentTransaction`

**Description:** Calling this method registers an amount refunded for a given order payment instrument. Calling this method allows the Invoice, the OrderPaymentInstrument and the Order to return their refunded amount as a sum calculated on the fly. The method may be called multiple times for the same instrument (multiple refunds of one payment) or for different instruments (invoice settlement using multiple payments).

**Parameters:**

- `instrument`: the order payment instrument
- `refundedAmount`: amount to register as refunded

**Returns:**

the created refund transaction

---

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

**Description:** Returns the sum of the captured amounts. The captured amounts are calculated on the fly. Associate a payment capture for a OrderPaymentInstrument with an Invoice using addCaptureTransaction(OrderPaymentInstrument, Money).

**Returns:**

sum of captured amounts

---

### getInvoiceNumber

**Signature:** `getInvoiceNumber() : String`

**Description:** Returns the invoice number.

**Returns:**

the invoice number

---

### getItems

**Signature:** `getItems() : FilteringCollection`

**Description:** Access the collection of InvoiceItems. This FilteringCollection can be sorted / filtered using: FilteringCollection.sort(Object) with ORDERBY_ITEMID FilteringCollection.sort(Object) with ORDERBY_ITEMPOSITION FilteringCollection.sort(Object) with ORDERBY_UNSORTED FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS

**Returns:**

the invoice items

---

### getPaymentTransactions

**Signature:** `getPaymentTransactions() : FilteringCollection`

**Description:** Returns the payment transactions belonging to this Invoice. This FilteringCollection can be sorted / filtered using: FilteringCollection.sort(Object) with ORDERBY_CREATION_DATE FilteringCollection.sort(Object) with ORDERBY_UNSORTED FilteringCollection.select(Object) with QUALIFIER_CAPTURE FilteringCollection.select(Object) with QUALIFIER_REFUND

**Returns:**

the payment transactions.

**See Also:**

PaymentTransaction

---

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

**Description:** Returns the sum of the refunded amounts. The refunded amounts are calculated on the fly. Associate a payment capture for a OrderPaymentInstrument with an Invoice using addRefundTransaction(OrderPaymentInstrument, Money).

**Returns:**

sum of refunded amounts

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Returns the invoice status. The possible values are STATUS_NOT_PAID, STATUS_MANUAL, STATUS_PAID, STATUS_FAILED.

**Returns:**

the invoice status

---

### getType

**Signature:** `getType() : EnumValue`

**Description:** Returns the invoice type. The possible values are TYPE_SHIPPING, TYPE_RETURN, TYPE_RETURN_CASE, TYPE_APPEASEMENT.

**Returns:**

the invoice type

---

### setStatus

**Signature:** `setStatus(status : String) : void`

**Description:** Sets the invoice status. The possible values are STATUS_NOT_PAID, STATUS_MANUAL, STATUS_PAID, STATUS_FAILED.

**Parameters:**

- `status`: the invoice status to set

---