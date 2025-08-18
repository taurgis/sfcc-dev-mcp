## Package: dw.order

# Class Order

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.LineItemCtnr
      - dw.order.Order

## Description

The Order class represents an order. The correct way to retrieve an order is described in OrderMgr.

## Constants

### CONFIRMATION_STATUS_CONFIRMED

**Type:** Number = 2

constant for when Confirmation Status is Confirmed

### CONFIRMATION_STATUS_NOTCONFIRMED

**Type:** Number = 0

constant for when Confirmation Status is Not Confirmed

### ENCRYPTION_ALGORITHM_RSA_ECB_OAEPWITHSHA_256ANDMGF1PADDING

**Type:** String = "RSA/ECB/OAEPWithSHA-256AndMGF1Padding"

The encryption algorithm "RSA/ECB/OAEPWithSHA-256AndMGF1Padding".

### ENCRYPTION_ALGORITHM_RSA_ECB_PKCS1PADDING

**Type:** String = "RSA/ECB/PKCS1Padding"

The outdated encryption algorithm "RSA/ECB/PKCS1Padding". Please do not use anymore!

### EXPORT_STATUS_EXPORTED

**Type:** Number = 1

constant for when Export Status is Exported

### EXPORT_STATUS_FAILED

**Type:** Number = 3

constant for when Export Status is Failed

### EXPORT_STATUS_NOTEXPORTED

**Type:** Number = 0

constant for when Export Status is Not Exported

### EXPORT_STATUS_READY

**Type:** Number = 2

constant for when Export Status is ready to be exported.

### ORDER_STATUS_CANCELLED

**Type:** Number = 6

constant for when Order Status is Cancelled

### ORDER_STATUS_COMPLETED

**Type:** Number = 5

constant for when Order Status is Completed

### ORDER_STATUS_CREATED

**Type:** Number = 0

constant for when Order Status is Created

### ORDER_STATUS_FAILED

**Type:** Number = 8

constant for when Order Status is Failed

### ORDER_STATUS_NEW

**Type:** Number = 3

constant for when Order Status is New

### ORDER_STATUS_OPEN

**Type:** Number = 4

constant for when Order Status is Open

### ORDER_STATUS_REPLACED

**Type:** Number = 7

constant for when Order Status is Replaced

### PAYMENT_STATUS_NOTPAID

**Type:** Number = 0

constant for when Payment Status is Not Paid

### PAYMENT_STATUS_PAID

**Type:** Number = 2

constant for when Payment Status is Paid

### PAYMENT_STATUS_PARTPAID

**Type:** Number = 1

constant for when Payment Status is Part Paid

### SHIPPING_STATUS_NOTSHIPPED

**Type:** Number = 0

constant for when Shipping Status is Not shipped

### SHIPPING_STATUS_PARTSHIPPED

**Type:** Number = 1

constant for when Shipping Status is Part Shipped

### SHIPPING_STATUS_SHIPPED

**Type:** Number = 2

constant for when Shipping Status is Shipped

## Properties

### affiliatePartnerID

**Type:** String

The affiliate partner ID value, or null.

### affiliatePartnerName

**Type:** String

The affiliate partner name value, or null.

### appeasementItems

**Type:** FilteringCollection (Read Only)

The collection of AppeasementItems associated with this order.

### appeasements

**Type:** FilteringCollection (Read Only)

The collection of Appeasements associated with this order.

### cancelCode

**Type:** EnumValue

If this order was cancelled, returns the value of the
 cancel code or null.

### cancelDescription

**Type:** String

If this order was cancelled, returns the text describing why
 the order was cancelled or null.

### capturedAmount

**Type:** Money (Read Only)

The sum of the captured amounts. The captured amounts
 are calculated on the fly. Associate a payment capture for an PaymentInstrument with an Invoice
 using Invoice.addCaptureTransaction(OrderPaymentInstrument, Money).

### confirmationStatus

**Type:** EnumValue

The confirmation status of the order.
 Possible values are CONFIRMATION_STATUS_NOTCONFIRMED and
 CONFIRMATION_STATUS_CONFIRMED.

### createdBy

**Type:** String (Read Only)

The name of the user who has created the order.
 If an agent user has created the order, the agent user's name
 is returned. Otherwise "Customer" is returned.

### currentOrder

**Type:** Order (Read Only)

The current order. The current order
 represents the most recent order in a chain of orders.
 For example, if Order1 was replaced by Order2, Order2 is the current
 representation of the order and Order1 is the original representation
 of the order. If you replace Order2 with Order3, Order 3 is now the
 current order and Order1 is still the original representation of the
 order. If this order has not been replaced, this method returns this
 order because this order is the current order.

### currentOrderNo

**Type:** String (Read Only)

The order number of the current order. The current order
 represents the most recent order in a chain of orders.
 For example, if Order1 was replaced by Order2, Order2 is the current
 representation of the order and Order1 is the original representation
 of the order. If you replace Order2 with Order3, Order 3 is now the
 current order and Order1 is still the original representation of the
 order. If this order has not been replaced, calling this method returns the
 same value as the getOrderNo() method because this order is the
 current order.

### customerLocaleID

**Type:** String (Read Only)

The ID of the locale that was in effect when the order
 was placed. This is the customer's locale.

### customerOrderReference

**Type:** String

The customer-specific reference information for the order, or null.

### exportAfter

**Type:** Date

A date after which an order can be exported.

### exportStatus

**Type:** EnumValue

The export status of the order.
 Possible values are: EXPORT_STATUS_NOTEXPORTED,
 EXPORT_STATUS_EXPORTED, EXPORT_STATUS_READY,
 and EXPORT_STATUS_FAILED.

### externalOrderNo

**Type:** String

The value of an external order number associated
 with this order, or null.

### externalOrderStatus

**Type:** String

The status of an external order associated
 with this order, or null.

### externalOrderText

**Type:** String

The text describing the external order, or null.

### globalPartyID

**Type:** String (Read Only)

The Global Party ID reconciles customer identity across multiple systems. For example, as part of the Service for
 Commerce experience, service agents can find information for customers who have never called into the call
 center, but have created a profile on the website. Service agents can find guest order data from B2C Commerce and
 easily create accounts for customers. Customer 360 Data Manager matches records from multiple data sources to
 determine all the records associated with a specific customer.

### imported

**Type:** boolean (Read Only)

Returns true, if the order is imported and false
 otherwise.

### invoiceItems

**Type:** FilteringCollection (Read Only)

The collection of InvoiceItems associated with this order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### invoiceNo

**Type:** String

The invoice number for this Order.
 
 When an order is placed (e.g. with OrderMgr.placeOrder(Order)) invoice number will be filled
 using a sequence. Before order was placed null will be returned unless it was set with
 setInvoiceNo(String).

### invoices

**Type:** FilteringCollection (Read Only)

The collection of Invoices associated with this order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### orderExportXML

**Type:** String (Read Only)

The order export XML as String object.
 
 NOTE: This method will return payment instrument data masked. If payment instrument re-encryption is needed
 please use getOrderExportXML(String, String) instead.
 
 Example:

  var orderXMLAsString : String = order.getOrderExportXML();
 var orderXML : XML = new XML(orderXMLAsString);

### orderNo

**Type:** String (Read Only)

The order number for this order.

### orderToken

**Type:** String (Read Only)

The token for this order. The order token is a string (length 32 bytes) associated
 with this one order. The order token is random. It reduces the capability of malicious
 users to access an order through guessing. Order token can be used to further validate order
 ownership, but should never be used to solely validate ownership. In addition, the storefront
 should ensure authentication and authorization. See the Security Best Practices for Developers for details.

### originalOrder

**Type:** Order (Read Only)

The original order associated with
 this order. The original order represents an order that was the
 first ancestor in a chain of orders.
 For example, if Order1 was replaced by Order2, Order2 is the current
 representation of the order and Order1 is the original representation
 of the order. If you replace Order2 with Order3, Order1 is still the
 original representation of the order. If this order is the first
 ancestor, this method returns this order.

### originalOrderNo

**Type:** String (Read Only)

The order number of the original order associated with
 this order. The original order represents an order that was the
 first ancestor in a chain of orders.
 For example, if Order1 was replaced by Order2, Order2 is the current
 representation of the order and Order1 is the original representation
 of the order. If you replace Order2 with Order3, Order1 is still the
 original representation of the order. If this order is the first
 ancestor, this method returns the value of getOrderNo().

### paymentStatus

**Type:** EnumValue

The order payment status value.
 Possible values are PAYMENT_STATUS_NOTPAID, PAYMENT_STATUS_PARTPAID
 or PAYMENT_STATUS_PAID.

### paymentTransaction

**Type:** PaymentTransaction (Read Only)

The payment transaction associated with this order.
 It is possible that there are multiple payment transactions
 associated with the order.  In this case, this method returns
 the transaction associated with the first PaymentInstrument
 returned by getPaymentInstruments().

### refundedAmount

**Type:** Money (Read Only)

The sum of the refunded amounts. The refunded amounts are
 calculated on the fly. Associate a payment refund for an PaymentInstrument with an Invoice
 using Invoice.addRefundTransaction(OrderPaymentInstrument, Money).

### remoteHost

**Type:** String (Read Only)

The IP address of the remote host from which the order was created.
 
 If the IP address was not captured for the order because order IP logging
 was disabled at the time the order was created, null will be returned.

### replaceCode

**Type:** EnumValue

If this order was replaced by another order,
 returns the value of the replace code. Otherwise.
 returns null.

### replaceDescription

**Type:** String

If this order was replaced by another order,
 returns the value of the replace description. Otherwise
 returns null.

### replacedOrder

**Type:** Order (Read Only)

The order that this order replaced or null. For example, if you
 have three orders where Order1 was replaced by Order2 and Order2 was
 replaced by Order3, calling this method on Order3 will return Order2.
 Similarly, calling this method on Order1 will return null as Order1 was
 the original order.

### replacedOrderNo

**Type:** String (Read Only)

The order number that this order replaced or null if this order
 did not replace an order. For example, if you have three orders
 where Order1 was replaced by Order2 and Order2 was replaced by Order3,
 calling this method on Order3 will return the order number for
 Order2. Similarly, calling this method on Order1 will return null as
 Order1 was the original order.

### replacementOrder

**Type:** Order (Read Only)

The order that replaced this order, or null.

### replacementOrderNo

**Type:** String (Read Only)

If this order was replaced by another order,
 returns the order number that replaced this order. Otherwise
 returns null.

### returnCaseItems

**Type:** FilteringCollection (Read Only)

The collection of ReturnCaseItems associated with this order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### returnCases

**Type:** FilteringCollection (Read Only)

The collection of ReturnCases associated with this order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### returnItems

**Type:** FilteringCollection (Read Only)

The collection of ReturnItems associated with this order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### returns

**Type:** FilteringCollection (Read Only)

The collection of Returns associated with this order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### shippingOrderItems

**Type:** FilteringCollection (Read Only)

The collection of ShippingOrderItems associated with this order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### shippingOrders

**Type:** FilteringCollection (Read Only)

The collection of ShippingOrders associated with this order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### shippingStatus

**Type:** EnumValue

The order shipping status.
 Possible values are SHIPPING_STATUS_NOTSHIPPED,
 SHIPPING_STATUS_PARTSHIPPED or SHIPPING_STATUS_SHIPPED.

### sourceCode

**Type:** String (Read Only)

The source code stored with the order or null if no source code is attached to the order.

### sourceCodeGroup

**Type:** SourceCodeGroup (Read Only)

The source code group attached to the order or null if no source code group is attached to
 the order.

### sourceCodeGroupID

**Type:** String (Read Only)

The source code group id stored with the order or null if no source code group is attached
 to the order.

### status

**Type:** EnumValue

The status of the order.
 Possible values are:
 
 ORDER_STATUS_CREATED
 ORDER_STATUS_NEW
 ORDER_STATUS_OPEN
 ORDER_STATUS_COMPLETED
 ORDER_STATUS_CANCELLED
 ORDER_STATUS_FAILED
 ORDER_STATUS_REPLACED
 
 
 The order status usually changes when a process action is initiated. Most status changes have an action which
 needs to executed in order to end having the order in a specific order status. When an order is created with e.g.
 OrderMgr.createOrder(Basket) the order status will be ORDER_STATUS_CREATED. The usual
 flow is that payment authorization will be added to the order. Once the order is considered as valid (payed,
 fraud checked, ...) the order gets placed. This can be done by calling
 OrderMgr.placeOrder(Order). The result of placing an order will be status
 ORDER_STATUS_OPEN (from a process standpoint ORDER_STATUS_NEW which has the same meaning).
 Status ORDER_STATUS_REPLACED is related to functionality
 BasketMgr.createBasketFromOrder(Order). ORDER_STATUS_COMPLETED has no meaning by
 default but can be used by custom implementations but is a synonym for NEW/OPEN. Below you will find the most important status changes:
 

 
 Status beforeActionStatus afterBusiness meaning
 -OrderMgr.createOrder(Basket)CREATEDOrder was created from a basket.
 CREATEDOrderMgr.placeOrder(Order)OPEN/NEWOrder was considered as valid. Order can now be exported to 3rd party systems.
 CREATEDOrderMgr.failOrder(Order)FAILEDOrder was considered not valid. E.g. payment authorization was wrong or fraud check was not successful.
 OPEN/NEWOrderMgr.cancelOrder(Order)CANCELLEDOrder was cancelled.
 CANCELLEDOrderMgr.undoCancelOrder(Order)OPEN/NEWOrder was cancelled by mistake and this needs to be undone.
 FAILEDOrderMgr.undoFailOrder(Order)CREATEDOrder was failed by mistake and this needs to be undone.
 
 Every status change will trigger a change in the order journal which is the base for GMV calculations.

### taxRoundedAtGroup

**Type:** boolean (Read Only)

Use this method to check if the Order was created with grouped taxation calculation.
 
 If the tax is rounded on group level, the tax is applied to the summed-up tax basis for each tax rate.

## Constructor Summary

## Method Summary

### createAppeasement

**Signature:** `createAppeasement(appeasementNumber : String) : Appeasement`

Creates a new Appeasement associated with this order.

### createAppeasement

**Signature:** `createAppeasement() : Appeasement`

Creates a new Appeasement associated with this order.

### createReturnCase

**Signature:** `createReturnCase(returnCaseNumber : String, isRMA : boolean) : ReturnCase`

Creates a new ReturnCase associated with this order specifying whether the ReturnCase is an RMA (return merchandise authorization).

### createReturnCase

**Signature:** `createReturnCase(isRMA : boolean) : ReturnCase`

Creates a new ReturnCase associated with this order specifying whether the ReturnCase is an RMA (return merchandise authorization).

### createServiceItem

**Signature:** `createServiceItem(ID : String, status : String) : OrderItem`

Returns the order item with the given status which wraps a new service item which is created and added to the order.

### createShippingOrder

**Signature:** `createShippingOrder() : ShippingOrder`

Creates a new ShippingOrder for this order.

### createShippingOrder

**Signature:** `createShippingOrder(shippingOrderNumber : String) : ShippingOrder`

Creates a new ShippingOrder for this order.

### getAffiliatePartnerID

**Signature:** `getAffiliatePartnerID() : String`

Returns the affiliate partner ID value, or null.

### getAffiliatePartnerName

**Signature:** `getAffiliatePartnerName() : String`

Returns the affiliate partner name value, or null.

### getAppeasement

**Signature:** `getAppeasement(appeasementNumber : String) : Appeasement`

Returns the Appeasement associated with this order with the given appeasementNumber.

### getAppeasementItem

**Signature:** `getAppeasementItem(appeasementItemID : String) : AppeasementItem`

Returns the AppeasementItem associated with this Order with the given appeasementItemID.

### getAppeasementItems

**Signature:** `getAppeasementItems() : FilteringCollection`

Returns the collection of AppeasementItems associated with this order.

### getAppeasements

**Signature:** `getAppeasements() : FilteringCollection`

Returns the collection of Appeasements associated with this order.

### getCancelCode

**Signature:** `getCancelCode() : EnumValue`

If this order was cancelled, returns the value of the cancel code or null.

### getCancelDescription

**Signature:** `getCancelDescription() : String`

If this order was cancelled, returns the text describing why the order was cancelled or null.

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

Returns the sum of the captured amounts.

### getConfirmationStatus

**Signature:** `getConfirmationStatus() : EnumValue`

Returns the confirmation status of the order. Possible values are CONFIRMATION_STATUS_NOTCONFIRMED and CONFIRMATION_STATUS_CONFIRMED.

### getCreatedBy

**Signature:** `getCreatedBy() : String`

Returns the name of the user who has created the order.

### getCurrentOrder

**Signature:** `getCurrentOrder() : Order`

Returns the current order.

### getCurrentOrderNo

**Signature:** `getCurrentOrderNo() : String`

Returns the order number of the current order.

### getCustomerLocaleID

**Signature:** `getCustomerLocaleID() : String`

Returns the ID of the locale that was in effect when the order was placed.

### getCustomerOrderReference

**Signature:** `getCustomerOrderReference() : String`

Returns the customer-specific reference information for the order, or null.

### getExportAfter

**Signature:** `getExportAfter() : Date`

Returns a date after which an order can be exported.

### getExportStatus

**Signature:** `getExportStatus() : EnumValue`

Returns the export status of the order. Possible values are: EXPORT_STATUS_NOTEXPORTED, EXPORT_STATUS_EXPORTED, EXPORT_STATUS_READY, and EXPORT_STATUS_FAILED.

### getExternalOrderNo

**Signature:** `getExternalOrderNo() : String`

Returns the value of an external order number associated with this order, or null.

### getExternalOrderStatus

**Signature:** `getExternalOrderStatus() : String`

Returns the status of an external order associated with this order, or null.

### getExternalOrderText

**Signature:** `getExternalOrderText() : String`

Returns the text describing the external order, or null.

### getGlobalPartyID

**Signature:** `getGlobalPartyID() : String`

The Global Party ID reconciles customer identity across multiple systems.

### getInvoice

**Signature:** `getInvoice(invoiceNumber : String) : Invoice`

Returns the Invoice associated with this order with the given invoiceNumber.

### getInvoiceItem

**Signature:** `getInvoiceItem(invoiceItemID : String) : InvoiceItem`

Returns the InvoiceItem associated with this order with the given ID.

### getInvoiceItems

**Signature:** `getInvoiceItems() : FilteringCollection`

Returns the collection of InvoiceItems associated with this order.

### getInvoiceNo

**Signature:** `getInvoiceNo() : String`

Returns the invoice number for this Order.

### getInvoices

**Signature:** `getInvoices() : FilteringCollection`

Returns the collection of Invoices associated with this order.

### getOrderExportXML

**Signature:** `getOrderExportXML() : String`

Returns the order export XML as String object.

### getOrderExportXML

**Signature:** `getOrderExportXML(encryptionAlgorithm : String, encryptionKey : String) : String`

Returns the order export XML as String object, with payment instrument data re-encrypted using the given encryption algorithm and key.

### getOrderExportXML

**Signature:** `getOrderExportXML(encryptionAlgorithm : String, encryptionKey : String, encryptUsingEKID : boolean) : String`

Returns the order export XML as String object, with payment instrument data re-encrypted using the given encryption algorithm and key.

### getOrderExportXML

**Signature:** `getOrderExportXML(encryptionAlgorithm : String, encryptionKey : String) : String`

Returns the order export XML as String object, with payment instrument data re-encrypted using the given encryption algorithm and key.

### getOrderItem

**Signature:** `getOrderItem(itemID : String) : OrderItem`

Returns the OrderItem for the itemID.

### getOrderNo

**Signature:** `getOrderNo() : String`

Returns the order number for this order.

### getOrderToken

**Signature:** `getOrderToken() : String`

Returns the token for this order.

### getOriginalOrder

**Signature:** `getOriginalOrder() : Order`

Returns the original order associated with this order.

### getOriginalOrderNo

**Signature:** `getOriginalOrderNo() : String`

Returns the order number of the original order associated with this order.

### getPaymentStatus

**Signature:** `getPaymentStatus() : EnumValue`

Returns the order payment status value. Possible values are PAYMENT_STATUS_NOTPAID, PAYMENT_STATUS_PARTPAID or PAYMENT_STATUS_PAID.

### getPaymentTransaction

**Signature:** `getPaymentTransaction() : PaymentTransaction`

Returns the payment transaction associated with this order.

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

Returns the sum of the refunded amounts.

### getRemoteHost

**Signature:** `getRemoteHost() : String`

Returns the IP address of the remote host from which the order was created.

### getReplaceCode

**Signature:** `getReplaceCode() : EnumValue`

If this order was replaced by another order, returns the value of the replace code.

### getReplaceDescription

**Signature:** `getReplaceDescription() : String`

If this order was replaced by another order, returns the value of the replace description.

### getReplacedOrder

**Signature:** `getReplacedOrder() : Order`

Returns the order that this order replaced or null.

### getReplacedOrderNo

**Signature:** `getReplacedOrderNo() : String`

Returns the order number that this order replaced or null if this order did not replace an order.

### getReplacementOrder

**Signature:** `getReplacementOrder() : Order`

Returns the order that replaced this order, or null.

### getReplacementOrderNo

**Signature:** `getReplacementOrderNo() : String`

If this order was replaced by another order, returns the order number that replaced this order.

### getReturn

**Signature:** `getReturn(returnNumber : String) : Return`

Returns the Return associated with this order with the given returnNumber.

### getReturnCase

**Signature:** `getReturnCase(returnCaseNumber : String) : ReturnCase`

Returns the ReturnCase associated with this order with the given returnCaseNumber.

### getReturnCaseItem

**Signature:** `getReturnCaseItem(returnCaseItemID : String) : ReturnCaseItem`

Returns the ReturnCaseItem associated with this order with the given returnCaseItemID.

### getReturnCaseItems

**Signature:** `getReturnCaseItems() : FilteringCollection`

Returns the collection of ReturnCaseItems associated with this order.

### getReturnCases

**Signature:** `getReturnCases() : FilteringCollection`

Returns the collection of ReturnCases associated with this order.

### getReturnItem

**Signature:** `getReturnItem(returnItemID : String) : ReturnItem`

Returns the ReturnItem associated with this order with the given ID.

### getReturnItems

**Signature:** `getReturnItems() : FilteringCollection`

Returns the collection of ReturnItems associated with this order.

### getReturns

**Signature:** `getReturns() : FilteringCollection`

Returns the collection of Returns associated with this order.

### getShippingOrder

**Signature:** `getShippingOrder(shippingOrderNumber : String) : ShippingOrder`

Returns the ShippingOrder associated with this order with the given shippingOrderNumber.

### getShippingOrderItem

**Signature:** `getShippingOrderItem(shippingOrderItemID : String) : ShippingOrderItem`

Returns the ShippingOrderItem associated with this order with the given shippingOrderItemID.

### getShippingOrderItems

**Signature:** `getShippingOrderItems() : FilteringCollection`

Returns the collection of ShippingOrderItems associated with this order.

### getShippingOrders

**Signature:** `getShippingOrders() : FilteringCollection`

Returns the collection of ShippingOrders associated with this order.

### getShippingStatus

**Signature:** `getShippingStatus() : EnumValue`

Returns the order shipping status. Possible values are SHIPPING_STATUS_NOTSHIPPED, SHIPPING_STATUS_PARTSHIPPED or SHIPPING_STATUS_SHIPPED.

### getSourceCode

**Signature:** `getSourceCode() : String`

Returns the source code stored with the order or null if no source code is attached to the order.

### getSourceCodeGroup

**Signature:** `getSourceCodeGroup() : SourceCodeGroup`

Returns the source code group attached to the order or null if no source code group is attached to the order.

### getSourceCodeGroupID

**Signature:** `getSourceCodeGroupID() : String`

Returns the source code group id stored with the order or null if no source code group is attached to the order.

### getStatus

**Signature:** `getStatus() : EnumValue`

Returns the status of the order. Possible values are: ORDER_STATUS_CREATED ORDER_STATUS_NEW ORDER_STATUS_OPEN ORDER_STATUS_COMPLETED ORDER_STATUS_CANCELLED ORDER_STATUS_FAILED ORDER_STATUS_REPLACED

### isImported

**Signature:** `isImported() : boolean`

Returns true, if the order is imported and false otherwise.

### isTaxRoundedAtGroup

**Signature:** `isTaxRoundedAtGroup() : boolean`

Use this method to check if the Order was created with grouped taxation calculation.

### reauthorize

**Signature:** `reauthorize() : Status`

Ensures that the order is authorized.

### removeRemoteHost

**Signature:** `removeRemoteHost() : void`

Removes the IP address of the remote host if stored.

### setAffiliatePartnerID

**Signature:** `setAffiliatePartnerID(affiliatePartnerID : String) : void`

Sets the affiliate partner ID value.

### setAffiliatePartnerName

**Signature:** `setAffiliatePartnerName(affiliatePartnerName : String) : void`

Sets the affiliate partner name value.

### setCancelCode

**Signature:** `setCancelCode(cancelCode : String) : void`

Sets the cancel code value.

### setCancelDescription

**Signature:** `setCancelDescription(cancelDescription : String) : void`

Sets the description as to why the order was cancelled.

### setConfirmationStatus

**Signature:** `setConfirmationStatus(status : Number) : void`

Sets the confirmation status value. Possible values are CONFIRMATION_STATUS_NOTCONFIRMED or CONFIRMATION_STATUS_CONFIRMED.

### setCustomer

**Signature:** `setCustomer(customer : Customer) : void`

This method is used to associate the order object with the specified customer object.

### setCustomerNo

**Signature:** `setCustomerNo(customerNo : String) : void`

Sets the customer number associated with this order.

### setCustomerOrderReference

**Signature:** `setCustomerOrderReference(reference : String) : void`

Sets the customer-specific reference information for the order.

### setExportAfter

**Signature:** `setExportAfter(date : Date) : void`

Sets the date after which an order can be exported.

### setExportStatus

**Signature:** `setExportStatus(status : Number) : void`

Sets the export status of the order. Possible values are: EXPORT_STATUS_NOTEXPORTED, EXPORT_STATUS_EXPORTED, EXPORT_STATUS_READY, and EXPORT_STATUS_FAILED.

### setExternalOrderNo

**Signature:** `setExternalOrderNo(externalOrderNo : String) : void`

Sets the value of an external order number associated with this order

### setExternalOrderStatus

**Signature:** `setExternalOrderStatus(status : String) : void`

Sets the status of an external order associated with this order

### setExternalOrderText

**Signature:** `setExternalOrderText(text : String) : void`

Sets the text describing the external order.

### setInvoiceNo

**Signature:** `setInvoiceNo(invoiceNumber : String) : void`

Sets the invoice number for this Order.

### setOrderStatus

**Signature:** `setOrderStatus(status : Number) : void`

Sets the order status.

### setPaymentStatus

**Signature:** `setPaymentStatus(status : Number) : void`

Sets the order payment status. Possible values are PAYMENT_STATUS_NOTPAID, PAYMENT_STATUS_PARTPAID or PAYMENT_STATUS_PAID.

### setReplaceCode

**Signature:** `setReplaceCode(replaceCode : String) : void`

Sets the value of the replace code.

### setReplaceDescription

**Signature:** `setReplaceDescription(replaceDescription : String) : void`

Sets the value of the replace description.

### setShippingStatus

**Signature:** `setShippingStatus(status : Number) : void`

Sets the order shipping status value. Possible values are SHIPPING_STATUS_NOTSHIPPED, SHIPPING_STATUS_PARTSHIPPED or SHIPPING_STATUS_SHIPPED.

### setStatus

**Signature:** `setStatus(status : Number) : void`

Sets the status of the order.

### trackOrderChange

**Signature:** `trackOrderChange(text : String) : Note`

Tracks an order change.

## Method Detail

## Method Details

### createAppeasement

**Signature:** `createAppeasement(appeasementNumber : String) : Appeasement`

**Description:** Creates a new Appeasement associated with this order. An appeasementNumber must be specified. If an Appeasement already exists for the appeasementNumber, the method fails with an exception. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `appeasementNumber`: the appeasementNumber to be assigned to the newly created appeasement

**Returns:**

the created appeasement

**Throws:**

IllegalArgumentException - if an Appeasement already exists with the number.

---

### createAppeasement

**Signature:** `createAppeasement() : Appeasement`

**Description:** Creates a new Appeasement associated with this order. The new Appeasement will have an appeasementNumber based on the getOrderNo(). Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

the created appeasement

---

### createReturnCase

**Signature:** `createReturnCase(returnCaseNumber : String, isRMA : boolean) : ReturnCase`

**Description:** Creates a new ReturnCase associated with this order specifying whether the ReturnCase is an RMA (return merchandise authorization). A returnCaseNumber must be specified. If a ReturnCase already exists for the returnCaseNumber, the method fails with an exception. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `returnCaseNumber`: returnCaseNumber to use
- `isRMA`: whether the new ReturnCase is an RMA (return merchandise authorization)

**Returns:**

null or the ReturnCase associated with the given returnCaseNumber

**Throws:**

IllegalArgumentException - if a ReturnCase already exists with the number.

---

### createReturnCase

**Signature:** `createReturnCase(isRMA : boolean) : ReturnCase`

**Description:** Creates a new ReturnCase associated with this order specifying whether the ReturnCase is an RMA (return merchandise authorization). The new ReturnCase will have a returnCaseNumber based on the getOrderNo(), e.g. for an order-no 1234 the return cases will have the numbers 1234#RC1, 1234#RC2, 1234#RC3... Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `isRMA`: whether the new ReturnCase is an RMA (return merchandise authorization)

**Returns:**

the created ReturnCase

---

### createServiceItem

**Signature:** `createServiceItem(ID : String, status : String) : OrderItem`

**Description:** Returns the order item with the given status which wraps a new service item which is created and added to the order.

**Parameters:**

- `ID`: the ID of the new service item. This ID will be returned when ShippingLineItem.getID() is called.
- `status`: the status of the order item, use one of OrderItem.STATUS_NEW OrderItem.STATUS_OPEN OrderItem.STATUS_SHIPPED Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

the created order item

---

### createShippingOrder

**Signature:** `createShippingOrder() : ShippingOrder`

**Description:** Creates a new ShippingOrder for this order. Generates a default shipping order number. Use createShippingOrder(String) for a defined shipping order number. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

the created shipping order

**See Also:**

ShippingOrder

---

### createShippingOrder

**Signature:** `createShippingOrder(shippingOrderNumber : String) : ShippingOrder`

**Description:** Creates a new ShippingOrder for this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `shippingOrderNumber`: the document number to be used

**Returns:**

the created shipping order

**See Also:**

ShippingOrder

---

### getAffiliatePartnerID

**Signature:** `getAffiliatePartnerID() : String`

**Description:** Returns the affiliate partner ID value, or null.

**Returns:**

the affiliate partner ID value, or null.

---

### getAffiliatePartnerName

**Signature:** `getAffiliatePartnerName() : String`

**Description:** Returns the affiliate partner name value, or null.

**Returns:**

the affiliate partner name value, or null.

---

### getAppeasement

**Signature:** `getAppeasement(appeasementNumber : String) : Appeasement`

**Description:** Returns the Appeasement associated with this order with the given appeasementNumber. The method returns null if no instance can be found.

**Parameters:**

- `appeasementNumber`: the appeasement number

**Returns:**

the Appeasement associated with the given appeasementNumber

---

### getAppeasementItem

**Signature:** `getAppeasementItem(appeasementItemID : String) : AppeasementItem`

**Description:** Returns the AppeasementItem associated with this Order with the given appeasementItemID. The method returns null if no instance can be found.

**Parameters:**

- `appeasementItemID`: the ID

**Returns:**

the AppeasementItem associated with the given appeasementItemID.

---

### getAppeasementItems

**Signature:** `getAppeasementItems() : FilteringCollection`

**Description:** Returns the collection of AppeasementItems associated with this order.

**Returns:**

the appeasement items belonging to this order

---

### getAppeasements

**Signature:** `getAppeasements() : FilteringCollection`

**Description:** Returns the collection of Appeasements associated with this order.

**Returns:**

the appeasements associated with this order

---

### getCancelCode

**Signature:** `getCancelCode() : EnumValue`

**Description:** If this order was cancelled, returns the value of the cancel code or null.

**Returns:**

the value of the cancel code.

---

### getCancelDescription

**Signature:** `getCancelDescription() : String`

**Description:** If this order was cancelled, returns the text describing why the order was cancelled or null.

**Returns:**

the description as to why the order was cancelled or null.

---

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

**Description:** Returns the sum of the captured amounts. The captured amounts are calculated on the fly. Associate a payment capture for an PaymentInstrument with an Invoice using Invoice.addCaptureTransaction(OrderPaymentInstrument, Money).

**Returns:**

sum of captured amounts

---

### getConfirmationStatus

**Signature:** `getConfirmationStatus() : EnumValue`

**Description:** Returns the confirmation status of the order. Possible values are CONFIRMATION_STATUS_NOTCONFIRMED and CONFIRMATION_STATUS_CONFIRMED.

**Returns:**

Order confirmation status

---

### getCreatedBy

**Signature:** `getCreatedBy() : String`

**Description:** Returns the name of the user who has created the order. If an agent user has created the order, the agent user's name is returned. Otherwise "Customer" is returned.

**Returns:**

the name of the user who created the order.

---

### getCurrentOrder

**Signature:** `getCurrentOrder() : Order`

**Description:** Returns the current order. The current order represents the most recent order in a chain of orders. For example, if Order1 was replaced by Order2, Order2 is the current representation of the order and Order1 is the original representation of the order. If you replace Order2 with Order3, Order 3 is now the current order and Order1 is still the original representation of the order. If this order has not been replaced, this method returns this order because this order is the current order.

**Returns:**

the current order.

**See Also:**

getOriginalOrderNo()
getOriginalOrder()
getReplacedOrderNo()
getReplacedOrder()
getReplacementOrderNo()
getReplacementOrder()

---

### getCurrentOrderNo

**Signature:** `getCurrentOrderNo() : String`

**Description:** Returns the order number of the current order. The current order represents the most recent order in a chain of orders. For example, if Order1 was replaced by Order2, Order2 is the current representation of the order and Order1 is the original representation of the order. If you replace Order2 with Order3, Order 3 is now the current order and Order1 is still the original representation of the order. If this order has not been replaced, calling this method returns the same value as the getOrderNo() method because this order is the current order.

**Returns:**

the order number of the current order

**See Also:**

getOriginalOrderNo()
getOriginalOrder()
getReplacedOrderNo()
getReplacedOrder()
getReplacementOrderNo()
getReplacementOrder()

---

### getCustomerLocaleID

**Signature:** `getCustomerLocaleID() : String`

**Description:** Returns the ID of the locale that was in effect when the order was placed. This is the customer's locale.

**Returns:**

the ID of the locale associated with this order, or null.

---

### getCustomerOrderReference

**Signature:** `getCustomerOrderReference() : String`

**Description:** Returns the customer-specific reference information for the order, or null.

**Returns:**

the customer-specific reference information for the order, or null.

---

### getExportAfter

**Signature:** `getExportAfter() : Date`

**Description:** Returns a date after which an order can be exported.

**Returns:**

a date after which an order can be exported.

---

### getExportStatus

**Signature:** `getExportStatus() : EnumValue`

**Description:** Returns the export status of the order. Possible values are: EXPORT_STATUS_NOTEXPORTED, EXPORT_STATUS_EXPORTED, EXPORT_STATUS_READY, and EXPORT_STATUS_FAILED.

**Returns:**

Order export status

---

### getExternalOrderNo

**Signature:** `getExternalOrderNo() : String`

**Description:** Returns the value of an external order number associated with this order, or null.

**Returns:**

the value of an external order number associated with this order, or null.

---

### getExternalOrderStatus

**Signature:** `getExternalOrderStatus() : String`

**Description:** Returns the status of an external order associated with this order, or null.

**Returns:**

the status of an external order associated with this order, or null.

---

### getExternalOrderText

**Signature:** `getExternalOrderText() : String`

**Description:** Returns the text describing the external order, or null.

**Returns:**

the text describing the external order, or null.

---

### getGlobalPartyID

**Signature:** `getGlobalPartyID() : String`

**Description:** The Global Party ID reconciles customer identity across multiple systems. For example, as part of the Service for Commerce experience, service agents can find information for customers who have never called into the call center, but have created a profile on the website. Service agents can find guest order data from B2C Commerce and easily create accounts for customers. Customer 360 Data Manager matches records from multiple data sources to determine all the records associated with a specific customer.

**Returns:**

the Global Party ID associated with this order, or null.

---

### getInvoice

**Signature:** `getInvoice(invoiceNumber : String) : Invoice`

**Description:** Returns the Invoice associated with this order with the given invoiceNumber. The method returns null if no instance can be found. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `invoiceNumber`: the invoice number

**Returns:**

the invoice associated with the given invoiceNumber

---

### getInvoiceItem

**Signature:** `getInvoiceItem(invoiceItemID : String) : InvoiceItem`

**Description:** Returns the InvoiceItem associated with this order with the given ID. The method returns null if no instance can be found. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `invoiceItemID`: the item ID

**Returns:**

the invoice item associated with the given ID

---

### getInvoiceItems

**Signature:** `getInvoiceItems() : FilteringCollection`

**Description:** Returns the collection of InvoiceItems associated with this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

invoice items belonging to this order

---

### getInvoiceNo

**Signature:** `getInvoiceNo() : String`

**Description:** Returns the invoice number for this Order. When an order is placed (e.g. with OrderMgr.placeOrder(Order)) invoice number will be filled using a sequence. Before order was placed null will be returned unless it was set with setInvoiceNo(String).

**Returns:**

the invoice number for this Order.

---

### getInvoices

**Signature:** `getInvoices() : FilteringCollection`

**Description:** Returns the collection of Invoices associated with this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

invoices belonging to this order

---

### getOrderExportXML

**Signature:** `getOrderExportXML() : String`

**Description:** Returns the order export XML as String object. NOTE: This method will return payment instrument data masked. If payment instrument re-encryption is needed please use getOrderExportXML(String, String) instead. Example: var orderXMLAsString : String = order.getOrderExportXML(); var orderXML : XML = new XML(orderXMLAsString);

**Returns:**

the order export XML

**Throws:**

IllegalStateException - If the method is called in a transaction with changes.
IllegalStateException - If the order is not placed. This method can be called for placed orders only.
IllegalStateException - If the order export XML could not be generated.

---

### getOrderExportXML

**Signature:** `getOrderExportXML(encryptionAlgorithm : String, encryptionKey : String) : String`

**Description:** Returns the order export XML as String object, with payment instrument data re-encrypted using the given encryption algorithm and key. NOTE: If no encryption is needed or desired please always use getOrderExportXML() instead, which returns the payment instrument data masked. Do not pass in any null arguments! Example: var orderXMLAsString : String = order.getOrderExportXML( "RSA/ECB/PKCS1Padding", "[key]" ); var orderXML : XML = new XML( orderXMLAsString );

**API Versioned:**

No longer available as of version 22.7. undefined behaviour for invalid arguments (e.g. null)

**Parameters:**

- `encryptionAlgorithm`: The encryption algorithm to be used for the re-encryption of the payment instrument data (credit card number, bank account number, bank account driver's license number). Must be a valid, non-null algorithm. Currently, only ENCRYPTION_ALGORITHM_RSA_ECB_PKCS1PADDING is supported, but this will be fixed and support for ENCRYPTION_ALGORITHM_RSA_ECB_OAEPWITHSHA56ANDMGF1PADDING will be added soon.
- `encryptionKey`: The Base64 encoded form of the public key to be used for the re-encryption of the payment instrument data. Must be a valid, non-blank key.

**Returns:**

the order export XML

**Throws:**

IllegalStateException - If the method is called in a transaction with changes.
IllegalStateException - If the order is not placed. This method can be called for placed orders only.
IllegalStateException - If the order export XML could not be generated.

---

### getOrderExportXML

**Signature:** `getOrderExportXML(encryptionAlgorithm : String, encryptionKey : String, encryptUsingEKID : boolean) : String`

**Description:** Returns the order export XML as String object, with payment instrument data re-encrypted using the given encryption algorithm and key. NOTE: If no encryption is needed or desired please always use getOrderExportXML() instead, which returns the payment instrument data masked. Do not pass in any null arguments! Example: var orderXMLAsString : String = order.getOrderExportXML( "RSA/ECB/PKCS1Padding", "[key]", false ); var orderXML : XML = new XML( orderXMLAsString );

**API Versioned:**

No longer available as of version 22.7. undefined behaviour for invalid arguments (e.g. null)

**Deprecated:**

This method will be removed soon. Please use the following methods instead: getOrderExportXML() – if payment instrument data should be masked getOrderExportXML(String, String) – if payment instrument data should be re-encrypted

**Parameters:**

- `encryptionAlgorithm`: The encryption algorithm to be used for the re-encryption of the payment instrument data (credit card number, bank account number, bank account driver's license number). Must be a valid, non-null algorithm. Currently, only ENCRYPTION_ALGORITHM_RSA_ECB_PKCS1PADDING is supported, but this will be fixed and support for ENCRYPTION_ALGORITHM_RSA_ECB_OAEPWITHSHA56ANDMGF1PADDING will be added soon.
- `encryptionKey`: The Base64 encoded form of the public key to be used for the re-encryption of the payment instrument data. Must be a valid, non-blank key.
- `encryptUsingEKID`: ignored

**Returns:**

the order export XML

**Throws:**

IllegalStateException - If the method is called in a transaction with changes.
IllegalStateException - If the order is not placed. This method can be called for placed orders only.
IllegalStateException - If the order export XML could not be generated.

---

### getOrderExportXML

**Signature:** `getOrderExportXML(encryptionAlgorithm : String, encryptionKey : String) : String`

**Description:** Returns the order export XML as String object, with payment instrument data re-encrypted using the given encryption algorithm and key. NOTE: If no encryption is needed or desired please always use getOrderExportXML() instead, which returns the payment instrument data masked. Example: var orderXMLAsString : String = order.getOrderExportXML( "RSA/ECB/PKCS1Padding", "[key]" ); var orderXML : XML = new XML( orderXMLAsString );

**API Versioned:**

From version 22.7. strict encryption argument checks; no null or otherwise invalid values allowed

**Parameters:**

- `encryptionAlgorithm`: The encryption algorithm used for the re-encryption of the payment instrument data (credit card number, bank account number, bank account driver's license number). Must be one of the following: ENCRYPTION_ALGORITHM_RSA_ECB_OAEPWITHSHA56ANDMGF1PADDING – The current and preferred algorithm. ENCRYPTION_ALGORITHM_RSA_ECB_PKCS1PADDING – This algorithm is outdated/deprecated and will be removed in a future release. Please do not use anymore.
- `encryptionKey`: The Base64 encoded form of the public key used for the re-encryption of the payment instrument data. Must be a valid, non-blank key.

**Returns:**

the order export XML

**Throws:**

IllegalArgumentException - If encryptionAlgorithm is not a valid known algorithm.
IllegalArgumentException - If encryptionKey is a blank string.
IllegalStateException - If the method is called in a transaction with changes.
IllegalStateException - If the order is not placed. This method can be called for placed orders only.
IllegalStateException - If the order export XML could not be generated.

---

### getOrderItem

**Signature:** `getOrderItem(itemID : String) : OrderItem`

**Description:** Returns the OrderItem for the itemID. An OrderItem will only exist for ProductLineItems or ShippingLineItems which belong to the order. The method fails with an exception if no instance can be found.

**Parameters:**

- `itemID`: the itemID

**Returns:**

the order item for itemID

**See Also:**

ProductLineItem.getOrderItem()
ShippingLineItem.getOrderItem()

**Throws:**

IllegalArgumentException - if no instance is found

---

### getOrderNo

**Signature:** `getOrderNo() : String`

**Description:** Returns the order number for this order.

**Returns:**

the order number for this order.

---

### getOrderToken

**Signature:** `getOrderToken() : String`

**Description:** Returns the token for this order. The order token is a string (length 32 bytes) associated with this one order. The order token is random. It reduces the capability of malicious users to access an order through guessing. Order token can be used to further validate order ownership, but should never be used to solely validate ownership. In addition, the storefront should ensure authentication and authorization. See the Security Best Practices for Developers for details.

**Returns:**

the token for this order.

---

### getOriginalOrder

**Signature:** `getOriginalOrder() : Order`

**Description:** Returns the original order associated with this order. The original order represents an order that was the first ancestor in a chain of orders. For example, if Order1 was replaced by Order2, Order2 is the current representation of the order and Order1 is the original representation of the order. If you replace Order2 with Order3, Order1 is still the original representation of the order. If this order is the first ancestor, this method returns this order.

**Returns:**

the order number of the original order associated with this order.

**See Also:**

getCurrentOrderNo()
getCurrentOrder()
getReplacedOrderNo()
getReplacedOrder()
getReplacementOrderNo()
getReplacementOrder()

---

### getOriginalOrderNo

**Signature:** `getOriginalOrderNo() : String`

**Description:** Returns the order number of the original order associated with this order. The original order represents an order that was the first ancestor in a chain of orders. For example, if Order1 was replaced by Order2, Order2 is the current representation of the order and Order1 is the original representation of the order. If you replace Order2 with Order3, Order1 is still the original representation of the order. If this order is the first ancestor, this method returns the value of getOrderNo().

**Returns:**

the order number of the original order associated with this order.

**See Also:**

getCurrentOrderNo()
getCurrentOrder()
getReplacedOrderNo()
getReplacedOrder()
getReplacementOrderNo()
getReplacementOrder()

---

### getPaymentStatus

**Signature:** `getPaymentStatus() : EnumValue`

**Description:** Returns the order payment status value. Possible values are PAYMENT_STATUS_NOTPAID, PAYMENT_STATUS_PARTPAID or PAYMENT_STATUS_PAID.

**Returns:**

Order payment status

---

### getPaymentTransaction

**Signature:** `getPaymentTransaction() : PaymentTransaction`

**Description:** Returns the payment transaction associated with this order. It is possible that there are multiple payment transactions associated with the order. In this case, this method returns the transaction associated with the first PaymentInstrument returned by getPaymentInstruments().

**Deprecated:**

Use LineItemCtnr.getPaymentInstruments() to get the list of PaymentInstrument instances and then use getPaymentTransaction() method on each PaymentInstrument to access the individual transactions.

**Returns:**

the payment transaction or null if there is no transaction.

---

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

**Description:** Returns the sum of the refunded amounts. The refunded amounts are calculated on the fly. Associate a payment refund for an PaymentInstrument with an Invoice using Invoice.addRefundTransaction(OrderPaymentInstrument, Money).

**Returns:**

sum of refunded amounts

---

### getRemoteHost

**Signature:** `getRemoteHost() : String`

**Description:** Returns the IP address of the remote host from which the order was created. If the IP address was not captured for the order because order IP logging was disabled at the time the order was created, null will be returned.

**Returns:**

The IP address of the remote host captured for the order or null

---

### getReplaceCode

**Signature:** `getReplaceCode() : EnumValue`

**Description:** If this order was replaced by another order, returns the value of the replace code. Otherwise. returns null.

**Returns:**

the replace code

---

### getReplaceDescription

**Signature:** `getReplaceDescription() : String`

**Description:** If this order was replaced by another order, returns the value of the replace description. Otherwise returns null.

**Returns:**

the value of the replace code or null.

---

### getReplacedOrder

**Signature:** `getReplacedOrder() : Order`

**Description:** Returns the order that this order replaced or null. For example, if you have three orders where Order1 was replaced by Order2 and Order2 was replaced by Order3, calling this method on Order3 will return Order2. Similarly, calling this method on Order1 will return null as Order1 was the original order.

**Returns:**

the order that replaced this order, or null.

**See Also:**

getCurrentOrderNo()
getCurrentOrder()
getOriginalOrderNo()
getOriginalOrder()
getReplacementOrderNo()
getReplacementOrder()

---

### getReplacedOrderNo

**Signature:** `getReplacedOrderNo() : String`

**Description:** Returns the order number that this order replaced or null if this order did not replace an order. For example, if you have three orders where Order1 was replaced by Order2 and Order2 was replaced by Order3, calling this method on Order3 will return the order number for Order2. Similarly, calling this method on Order1 will return null as Order1 was the original order.

**Returns:**

the order number of the order that this order replaced or null.

**See Also:**

getCurrentOrderNo()
getCurrentOrder()
getOriginalOrderNo()
getOriginalOrder()
getReplacementOrderNo()
getReplacementOrder()

---

### getReplacementOrder

**Signature:** `getReplacementOrder() : Order`

**Description:** Returns the order that replaced this order, or null.

**Returns:**

the order that replaced this order, or null.

**See Also:**

getCurrentOrderNo()
getCurrentOrder()
getOriginalOrderNo()
getOriginalOrder()
getReplacedOrderNo()
getReplacedOrder()

---

### getReplacementOrderNo

**Signature:** `getReplacementOrderNo() : String`

**Description:** If this order was replaced by another order, returns the order number that replaced this order. Otherwise returns null.

**Returns:**

the order that replaced this order, or null.

**See Also:**

getCurrentOrderNo()
getCurrentOrder()
getOriginalOrderNo()
getOriginalOrder()
getReplacedOrderNo()
getReplacedOrder()

---

### getReturn

**Signature:** `getReturn(returnNumber : String) : Return`

**Description:** Returns the Return associated with this order with the given returnNumber. The method returns null if no instance can be found. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `returnNumber`: the return number

**Returns:**

the return associated with the given returnNumber

---

### getReturnCase

**Signature:** `getReturnCase(returnCaseNumber : String) : ReturnCase`

**Description:** Returns the ReturnCase associated with this order with the given returnCaseNumber. The method returns null if no instance can be found. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `returnCaseNumber`: the return case number

**Returns:**

the return case associated with the given returnCaseNumber

---

### getReturnCaseItem

**Signature:** `getReturnCaseItem(returnCaseItemID : String) : ReturnCaseItem`

**Description:** Returns the ReturnCaseItem associated with this order with the given returnCaseItemID. The method returns null if no instance can be found. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `returnCaseItemID`: the ID

**Returns:**

the return case item associated with the given returnCaseItemID

---

### getReturnCaseItems

**Signature:** `getReturnCaseItems() : FilteringCollection`

**Description:** Returns the collection of ReturnCaseItems associated with this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

return case items belonging to this order

---

### getReturnCases

**Signature:** `getReturnCases() : FilteringCollection`

**Description:** Returns the collection of ReturnCases associated with this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

return cases belonging to this order

---

### getReturnItem

**Signature:** `getReturnItem(returnItemID : String) : ReturnItem`

**Description:** Returns the ReturnItem associated with this order with the given ID. The method returns null if no instance can be found. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `returnItemID`: the ID

**Returns:**

the return item associated with the given returnItemID

---

### getReturnItems

**Signature:** `getReturnItems() : FilteringCollection`

**Description:** Returns the collection of ReturnItems associated with this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

return items belonging to this order

---

### getReturns

**Signature:** `getReturns() : FilteringCollection`

**Description:** Returns the collection of Returns associated with this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

returns belonging to this order

---

### getShippingOrder

**Signature:** `getShippingOrder(shippingOrderNumber : String) : ShippingOrder`

**Description:** Returns the ShippingOrder associated with this order with the given shippingOrderNumber. The method returns null if no instance can be found. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `shippingOrderNumber`: the shipping order number

**Returns:**

the shipping order associated with the given shippingOrderNumber

---

### getShippingOrderItem

**Signature:** `getShippingOrderItem(shippingOrderItemID : String) : ShippingOrderItem`

**Description:** Returns the ShippingOrderItem associated with this order with the given shippingOrderItemID. The method returns null if no instance can be found. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Parameters:**

- `shippingOrderItemID`: the ID

**Returns:**

the shipping order item associated with the given shippingOrderItemID

---

### getShippingOrderItems

**Signature:** `getShippingOrderItems() : FilteringCollection`

**Description:** Returns the collection of ShippingOrderItems associated with this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

shipping order items belonging to this order

---

### getShippingOrders

**Signature:** `getShippingOrders() : FilteringCollection`

**Description:** Returns the collection of ShippingOrders associated with this order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

shipping orders belonging to this order

---

### getShippingStatus

**Signature:** `getShippingStatus() : EnumValue`

**Description:** Returns the order shipping status. Possible values are SHIPPING_STATUS_NOTSHIPPED, SHIPPING_STATUS_PARTSHIPPED or SHIPPING_STATUS_SHIPPED.

**Returns:**

Order shipping status

---

### getSourceCode

**Signature:** `getSourceCode() : String`

**Description:** Returns the source code stored with the order or null if no source code is attached to the order.

**Returns:**

the source code stored with the order or null if no source code is attached to the order.

---

### getSourceCodeGroup

**Signature:** `getSourceCodeGroup() : SourceCodeGroup`

**Description:** Returns the source code group attached to the order or null if no source code group is attached to the order.

**Returns:**

the source code group attached to the order or null if no source code group is attached to the order.

---

### getSourceCodeGroupID

**Signature:** `getSourceCodeGroupID() : String`

**Description:** Returns the source code group id stored with the order or null if no source code group is attached to the order.

**Returns:**

the source code group id stored with the order or null if no source code group is attached to the order.

---

### getStatus

**Signature:** `getStatus() : EnumValue`

**Description:** Returns the status of the order. Possible values are: ORDER_STATUS_CREATED ORDER_STATUS_NEW ORDER_STATUS_OPEN ORDER_STATUS_COMPLETED ORDER_STATUS_CANCELLED ORDER_STATUS_FAILED ORDER_STATUS_REPLACED The order status usually changes when a process action is initiated. Most status changes have an action which needs to executed in order to end having the order in a specific order status. When an order is created with e.g. OrderMgr.createOrder(Basket) the order status will be ORDER_STATUS_CREATED. The usual flow is that payment authorization will be added to the order. Once the order is considered as valid (payed, fraud checked, ...) the order gets placed. This can be done by calling OrderMgr.placeOrder(Order). The result of placing an order will be status ORDER_STATUS_OPEN (from a process standpoint ORDER_STATUS_NEW which has the same meaning). Status ORDER_STATUS_REPLACED is related to functionality BasketMgr.createBasketFromOrder(Order). ORDER_STATUS_COMPLETED has no meaning by default but can be used by custom implementations but is a synonym for NEW/OPEN. Below you will find the most important status changes: Status beforeActionStatus afterBusiness meaning -OrderMgr.createOrder(Basket)CREATEDOrder was created from a basket. CREATEDOrderMgr.placeOrder(Order)OPEN/NEWOrder was considered as valid. Order can now be exported to 3rd party systems. CREATEDOrderMgr.failOrder(Order)FAILEDOrder was considered not valid. E.g. payment authorization was wrong or fraud check was not successful. OPEN/NEWOrderMgr.cancelOrder(Order)CANCELLEDOrder was cancelled. CANCELLEDOrderMgr.undoCancelOrder(Order)OPEN/NEWOrder was cancelled by mistake and this needs to be undone. FAILEDOrderMgr.undoFailOrder(Order)CREATEDOrder was failed by mistake and this needs to be undone. Every status change will trigger a change in the order journal which is the base for GMV calculations.

**Returns:**

Status of the order.

**See Also:**

LineItemCtnr

---

### isImported

**Signature:** `isImported() : boolean`

**Description:** Returns true, if the order is imported and false otherwise.

**Returns:**

true, if the order was imported, false otherwise.

---

### isTaxRoundedAtGroup

**Signature:** `isTaxRoundedAtGroup() : boolean`

**Description:** Use this method to check if the Order was created with grouped taxation calculation. If the tax is rounded on group level, the tax is applied to the summed-up tax basis for each tax rate.

**Returns:**

true if the Order was created with grouped taxation

---

### reauthorize

**Signature:** `reauthorize() : Status`

**Description:** Ensures that the order is authorized. Checks if the order is authorized by calling the hook PaymentHooks.validateAuthorization(Order). If the authorization is not valid it reauthorizes the order by calling the PaymentHooks.reauthorize(Order).

**Returns:**

the status of the operation, will be Status.OK if the order is authorized after this call

---

### removeRemoteHost

**Signature:** `removeRemoteHost() : void`

**Description:** Removes the IP address of the remote host if stored. If IP logging was enabled during order creation the IP address of the customer will be stored and can be retrieved using getRemoteHost().

**See Also:**

getRemoteHost()

---

### setAffiliatePartnerID

**Signature:** `setAffiliatePartnerID(affiliatePartnerID : String) : void`

**Description:** Sets the affiliate partner ID value.

**Parameters:**

- `affiliatePartnerID`: the affiliate partner ID value.

---

### setAffiliatePartnerName

**Signature:** `setAffiliatePartnerName(affiliatePartnerName : String) : void`

**Description:** Sets the affiliate partner name value.

**Parameters:**

- `affiliatePartnerName`: the affiliate partner name value.

---

### setCancelCode

**Signature:** `setCancelCode(cancelCode : String) : void`

**Description:** Sets the cancel code value.

**Parameters:**

- `cancelCode`: the cancel code value.

---

### setCancelDescription

**Signature:** `setCancelDescription(cancelDescription : String) : void`

**Description:** Sets the description as to why the order was cancelled.

**Parameters:**

- `cancelDescription`: the description for why the order was cancelled.

---

### setConfirmationStatus

**Signature:** `setConfirmationStatus(status : Number) : void`

**Description:** Sets the confirmation status value. Possible values are CONFIRMATION_STATUS_NOTCONFIRMED or CONFIRMATION_STATUS_CONFIRMED.

**Parameters:**

- `status`: Order confirmation status

---

### setCustomer

**Signature:** `setCustomer(customer : Customer) : void`

**Description:** This method is used to associate the order object with the specified customer object. If the customer object represents a registered customer, the order will be assigned to this registered customer and the order's customer number (LineItemCtnr.getCustomerNo()) will be updated. If the customer object represents an unregistered (anonymous) customer, the order will become an anonymous order and the order's customer number will be set to null.

**Parameters:**

- `customer`: The customer to be associated with the order.

**Throws:**

NullArgumentException - If specified customer is null.

---

### setCustomerNo

**Signature:** `setCustomerNo(customerNo : String) : void`

**Description:** Sets the customer number associated with this order. Note it is recommended to use (setCustomer(Customer)) instead of this method. This method only sets the customer number and should be used with care as it does not re-link the order with a customer profile object which can lead to an inconsistency! Ensure that the customer number used is not already taken by a different customer profile.

**Parameters:**

- `customerNo`: the customer number associated with this order.

---

### setCustomerOrderReference

**Signature:** `setCustomerOrderReference(reference : String) : void`

**Description:** Sets the customer-specific reference information for the order.

**Parameters:**

- `reference`: the customer-specific reference information for the order.

---

### setExportAfter

**Signature:** `setExportAfter(date : Date) : void`

**Description:** Sets the date after which an order can be exported.

**Parameters:**

- `date`: the date after which an order can be exported.

---

### setExportStatus

**Signature:** `setExportStatus(status : Number) : void`

**Description:** Sets the export status of the order. Possible values are: EXPORT_STATUS_NOTEXPORTED, EXPORT_STATUS_EXPORTED, EXPORT_STATUS_READY, and EXPORT_STATUS_FAILED. Setting the status to EXPORT_STATUS_EXPORTED will also trigger the finalization of on order inventory transactions for this order meaning that all inventory transactions with type on order will be moved into final inventory transactions. This is only relevant when On Order Inventory is turned on for the inventory list ordered products are in. In case of an exception the current transaction is marked as rollback only.

**Parameters:**

- `status`: Order export status

---

### setExternalOrderNo

**Signature:** `setExternalOrderNo(externalOrderNo : String) : void`

**Description:** Sets the value of an external order number associated with this order

**Parameters:**

- `externalOrderNo`: the value of an external order number associated with this order.

---

### setExternalOrderStatus

**Signature:** `setExternalOrderStatus(status : String) : void`

**Description:** Sets the status of an external order associated with this order

**Parameters:**

- `status`: the status of the external order.

---

### setExternalOrderText

**Signature:** `setExternalOrderText(text : String) : void`

**Description:** Sets the text describing the external order.

**Parameters:**

- `text`: the text describing the external order.

---

### setInvoiceNo

**Signature:** `setInvoiceNo(invoiceNumber : String) : void`

**Description:** Sets the invoice number for this Order. Notice that this value might be overwritten during order placement (e.g. with OrderMgr.placeOrder(Order)).

**Parameters:**

- `invoiceNumber`: the invoice number for this Order.

**See Also:**

getInvoiceNo()

---

### setOrderStatus

**Signature:** `setOrderStatus(status : Number) : void`

**Description:** Sets the order status. Use this method when using Order Post Processing such as the creation of shipping orders. The only supported values are ORDER_STATUS_OPEN, ORDER_STATUS_CANCELLED. Setting the status will adjust the order item status when applicable (item status not SHIPPED or CANCELLED). Note that the order status and the status of the items are directly related and dependent on one another. See OrderItem.setStatus(String) for more information about possible status transitions. Warning: This method will not undo coupon redemptions upon cancellation of an order. Re-opening such an order later with OrderMgr.undoCancelOrder(Order) or OrderItem.setStatus(String) with ORDER_STATUS_OPEN will result in an additional application of the same coupon code which in turn might fail. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Deprecated:**

use setStatus(Number) instead

**Parameters:**

- `status`: the status to be set, use one of: ORDER_STATUS_OPEN ORDER_STATUS_CANCELLED

**Throws:**

IllegalArgumentException - on attempt to set an unsupported status value

---

### setPaymentStatus

**Signature:** `setPaymentStatus(status : Number) : void`

**Description:** Sets the order payment status. Possible values are PAYMENT_STATUS_NOTPAID, PAYMENT_STATUS_PARTPAID or PAYMENT_STATUS_PAID.

**Parameters:**

- `status`: Order payment status

---

### setReplaceCode

**Signature:** `setReplaceCode(replaceCode : String) : void`

**Description:** Sets the value of the replace code.

**Parameters:**

- `replaceCode`: the value of the replace code.

---

### setReplaceDescription

**Signature:** `setReplaceDescription(replaceDescription : String) : void`

**Description:** Sets the value of the replace description.

**Parameters:**

- `replaceDescription`: the value of the replace description.

---

### setShippingStatus

**Signature:** `setShippingStatus(status : Number) : void`

**Description:** Sets the order shipping status value. Possible values are SHIPPING_STATUS_NOTSHIPPED, SHIPPING_STATUS_PARTSHIPPED or SHIPPING_STATUS_SHIPPED.

**Parameters:**

- `status`: Order shipping status

---

### setStatus

**Signature:** `setStatus(status : Number) : void`

**Description:** Sets the status of the order. Possible values are: ORDER_STATUS_NEW ORDER_STATUS_OPEN ORDER_STATUS_COMPLETED ORDER_STATUS_CANCELLED ORDER_STATUS_REPLACED This method does not support order statuses ORDER_STATUS_CREATED or ORDER_STATUS_FAILED. Please use OrderMgr.placeOrder(Order) or OrderMgr.failOrder(Order). Setting the order status to ORDER_STATUS_CANCELLED will have the same effect as calling OrderMgr.cancelOrder(Order). Setting a canceled order to ORDER_STATUS_NEW, ORDER_STATUS_OPEN or ORDER_STATUS_COMPLETED will have the same effect as calling OrderMgr.undoCancelOrder(Order). It is recommended to use the methods in OrderMgr directly to be able to do error processing with the return code.

**Parameters:**

- `status`: Order status

**Throws:**

IllegalArgumentException - on attempt to set status CREATED or FAILED, or status transition while cancel order or undo cancel order returns with an error code.

---

### trackOrderChange

**Signature:** `trackOrderChange(text : String) : Note`

**Description:** Tracks an order change. This adds a history entry to the order. Focus of history entries are changes through business logic, both custom and internal logic. Tracked order changes are read-only and can be accessed in the Business Manager order history. The following attributes of the created history entry are initialized: Note.getCreatedBy() gets the current user assigned Note.getCreationDate() gets the current date assigned This feature is intended to track important changes in custom order flow which should become visible in Business Manager's history tab. It is NOT intended as auditing feature for every change to an order. A warning will be produced after 600 notes are added to an order. The warning can be reviewed in Business Manager's Quota Status screen. Attempting to add a note to an order which already has 1000 notes results in an exception. Please bear in mind that internal changes, such as order status changes, also track changes. Avoid using this feature in recurring jobs which may re-process orders multiple times as the limit needs to be considered each time a change is tracked. The same limit on the number of notes added also applies when using method LineItemCtnr.addNote(String, String) to add notes.

**Parameters:**

- `text`: the text of the history entry

**Returns:**

the created history entry

---