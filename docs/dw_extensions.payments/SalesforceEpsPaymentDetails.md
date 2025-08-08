## Package: dw.extensions.payments

# Class SalesforceEpsPaymentDetails

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentDetails
  - dw.extensions.payments.SalesforceEpsPaymentDetails

## Description

Details to a Salesforce Payments payment of type SalesforcePaymentMethod.TYPE_EPS. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### bank

**Type:** String (Read Only)

The bank used for the payment, or null if not known.

## Constructor Summary

## Method Summary

### getBank

**Signature:** `getBank() : String`

Returns the bank used for the payment, or null if not known.

## Method Detail

## Method Details

### getBank

**Signature:** `getBank() : String`

**Description:** Returns the bank used for the payment, or null if not known.

**Returns:**

bank

**See Also:**

SalesforcePaymentMethod.getBank()

---