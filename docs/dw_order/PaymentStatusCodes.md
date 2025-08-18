## Package: dw.order

# Class PaymentStatusCodes

## Inheritance Hierarchy

- Object
  - dw.order.PaymentStatusCodes

## Description

Helper class containing status codes for the various errors that can occur when validating a payment card. One of these codes is returned as part of a Status object when a unsuccessful call to the VerifyPaymentCard or VerifyCreditCard pipelet is made. The same codes are used when calling PaymentCard.verify(Number, Number, String) or PaymentCard.verify(Number, Number, String, String).

## Constants

### CREDITCARD_INVALID_CARD_NUMBER

**Type:** String = "CREDITCARD_INVALID_CARD_NUMBER"

The code indicates that the credit card number is incorrect.

### CREDITCARD_INVALID_EXPIRATION_DATE

**Type:** String = "CREDITCARD_INVALID_EXPIRATION_DATE"

The code indicates that the credit card is expired.

### CREDITCARD_INVALID_SECURITY_CODE

**Type:** String = "CREDITCARD_INVALID_SECURITY_CODE"

The code indicates that the credit card security code length is invalid.

## Properties

## Constructor Summary

PaymentStatusCodes()

## Method Summary

## Constructor Detail