## Package: dw.extensions.payments

# Class SalesforcePaymentDetails

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentDetails

## Description

Base class details to a Salesforce Payments payment. See Salesforce Payments documentation for how to gain access and configure it for use on your sites. Some payment types like SalesforcePaymentMethod.TYPE_CARD contain additional details like the card brand, or the last 4 digits of the card number. Details to those payments will be of a specific subclass of this class like SalesforceCardPaymentDetails. Other payment types have no additional information so their details are represented by an object of this base type.

## Properties

### type

**Type:** String (Read Only)

The payment type.

## Constructor Summary

## Method Summary

### getType

**Signature:** `getType() : String`

Returns the payment type.

## Method Detail

## Method Details

### getType

**Signature:** `getType() : String`

**Description:** Returns the payment type.

**Returns:**

payment type

**See Also:**

SalesforcePaymentMethod.TYPE_BANCONTACT
SalesforcePaymentMethod.TYPE_CARD
SalesforcePaymentMethod.TYPE_EPS
SalesforcePaymentMethod.TYPE_IDEAL
SalesforcePaymentMethod.TYPE_KLARNA
SalesforcePaymentMethod.TYPE_SEPA_DEBIT
SalesforcePayPalOrder.TYPE_PAYPAL
SalesforcePayPalOrder.TYPE_VENMO

---