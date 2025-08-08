## Package: dw.extensions.payments

# Class SalesforceKlarnaPaymentDetails

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentDetails
  - dw.extensions.payments.SalesforceKlarnaPaymentDetails

## Description

Details to a Salesforce Payments payment of type SalesforcePaymentMethod.TYPE_KLARNA. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### paymentMethodCategory

**Type:** String (Read Only)

The payment method category used for the payment, or null if not known.

## Constructor Summary

## Method Summary

### getPaymentMethodCategory

**Signature:** `getPaymentMethodCategory() : String`

Returns the payment method category used for the payment, or null if not known.

## Method Detail

## Method Details

### getPaymentMethodCategory

**Signature:** `getPaymentMethodCategory() : String`

**Description:** Returns the payment method category used for the payment, or null if not known.

**Returns:**

payment method category

**See Also:**

SalesforcePaymentMethod.getPaymentMethodCategory()

---