## Package: dw.order

# Class OrderPaymentInstrument

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.EncryptedObject
      - dw.order.PaymentInstrument
      - dw.order.OrderPaymentInstrument

## Description

Represents any payment instrument used to pay orders, such as credit card or bank transfer. The object defines standard methods for credit card payment, and can be extended by attributes appropriate for other payment methods.

## Properties

### bankAccountDriversLicense

**Type:** String (Read Only)

The driver's license associated with a bank account if the calling
 context meets the following criteria: 
 
 
 If the method call happens in the context of a storefront request and
 the current customer is identical to the customer related to the basket
 or order, and the current protocol is HTTPS.
 
 
 If the method call happens in the context of the business manager and the
 current user has permission to the Orders module.
 
 
 Otherwise, the method throws an exception.

### bankAccountNumber

**Type:** String (Read Only)

The account number if the calling context meets
 the following criteria: 
 
 
 If the method call happens in the context of a storefront request and
 the current customer is identical to the customer related to the basket
 or order, and the current protocol is HTTPS.
 
 
 If the method call happens in the context of the business manager and the
 current user has permissions to the Orders module.
 
 
 Otherwise, the method throws an exception.

### capturedAmount

**Type:** Money (Read Only)

The sum of the captured amounts. The captured amounts
 are calculated on the fly. Associate a payment capture for an Payment Instrument with an Invoice
 using Invoice method addCaptureTransaction.

### creditCardNumber

**Type:** String (Read Only)

The de-crypted creditcard number if the calling context meets
 the following criteria: 
 
 
 If the method call happens in the context of a storefront request and
 the current authenticated customer is referenced by the basket or order, and the current protocol is HTTPS.
 
 
 If the customer is anonymous, and the order references this customer, and the protocol is secure and
 the order status is CREATED.
 
 
 If the method call happens in the context of the business manager and the
 current user has the permission to manage orders.
 
 
 If the payment information has not been masked as a result of the data retention security policy
 for the site.
 
 
 Otherwise, the method returns the masked credit card number.

### paymentTransaction

**Type:** PaymentTransaction (Read Only)

The Payment Transaction for this Payment Instrument or null.

### refundedAmount

**Type:** Money (Read Only)

The sum of the refunded amounts. The refunded amounts
 are calculated on the fly. Associate a payment refund for an Payment Instrument with an Invoice
 using Invoice method addRefundTransaction.

## Constructor Summary

## Method Summary

### getBankAccountDriversLicense

**Signature:** `getBankAccountDriversLicense() : String`

Returns the driver's license associated with a bank account if the calling context meets the following criteria: If the method call happens in the context of a storefront request and the current customer is identical to the customer related to the basket or order, and the current protocol is HTTPS.

### getBankAccountNumber

**Signature:** `getBankAccountNumber() : String`

Returns the account number if the calling context meets the following criteria: If the method call happens in the context of a storefront request and the current customer is identical to the customer related to the basket or order, and the current protocol is HTTPS.

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

Returns the sum of the captured amounts.

### getCreditCardNumber

**Signature:** `getCreditCardNumber() : String`

Returns the de-crypted creditcard number if the calling context meets the following criteria: If the method call happens in the context of a storefront request and the current authenticated customer is referenced by the basket or order, and the current protocol is HTTPS.

### getPaymentTransaction

**Signature:** `getPaymentTransaction() : PaymentTransaction`

Returns the Payment Transaction for this Payment Instrument or null.

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

Returns the sum of the refunded amounts.

## Method Detail

## Method Details

### getBankAccountDriversLicense

**Signature:** `getBankAccountDriversLicense() : String`

**Description:** Returns the driver's license associated with a bank account if the calling context meets the following criteria: If the method call happens in the context of a storefront request and the current customer is identical to the customer related to the basket or order, and the current protocol is HTTPS. If the method call happens in the context of the business manager and the current user has permission to the Orders module. Otherwise, the method throws an exception.

**Returns:**

the driver's license number if the calling context meets the necessary criteria.

---

### getBankAccountNumber

**Signature:** `getBankAccountNumber() : String`

**Description:** Returns the account number if the calling context meets the following criteria: If the method call happens in the context of a storefront request and the current customer is identical to the customer related to the basket or order, and the current protocol is HTTPS. If the method call happens in the context of the business manager and the current user has permissions to the Orders module. Otherwise, the method throws an exception.

**Returns:**

the account number if the calling context meets the necessary criteria.

---

### getCapturedAmount

**Signature:** `getCapturedAmount() : Money`

**Description:** Returns the sum of the captured amounts. The captured amounts are calculated on the fly. Associate a payment capture for an Payment Instrument with an Invoice using Invoice method addCaptureTransaction.

**Returns:**

sum of captured amounts

---

### getCreditCardNumber

**Signature:** `getCreditCardNumber() : String`

**Description:** Returns the de-crypted creditcard number if the calling context meets the following criteria: If the method call happens in the context of a storefront request and the current authenticated customer is referenced by the basket or order, and the current protocol is HTTPS. If the customer is anonymous, and the order references this customer, and the protocol is secure and the order status is CREATED. If the method call happens in the context of the business manager and the current user has the permission to manage orders. If the payment information has not been masked as a result of the data retention security policy for the site. Otherwise, the method returns the masked credit card number.

**Returns:**

the de-crypted creditcard number if the calling context meets the necessary criteria.

---

### getPaymentTransaction

**Signature:** `getPaymentTransaction() : PaymentTransaction`

**Description:** Returns the Payment Transaction for this Payment Instrument or null.

**Returns:**

the Payment Transaction for this Payment Instrument or null.

---

### getRefundedAmount

**Signature:** `getRefundedAmount() : Money`

**Description:** Returns the sum of the refunded amounts. The refunded amounts are calculated on the fly. Associate a payment refund for an Payment Instrument with an Invoice using Invoice method addRefundTransaction.

**Returns:**

sum of refunded amounts

---