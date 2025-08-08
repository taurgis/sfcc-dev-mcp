## Package: dw.extensions.payments

# Class SalesforceSepaDebitPaymentDetails

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentDetails
  - dw.extensions.payments.SalesforceSepaDebitPaymentDetails

## Description

Details to a Salesforce Payments payment of type SalesforcePaymentMethod.TYPE_SEPA_DEBIT. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### last4

**Type:** String (Read Only)

The last 4 digits of the account number, or null if not known.

## Constructor Summary

## Method Summary

### getLast4

**Signature:** `getLast4() : String`

Returns the last 4 digits of the account number, or null if not known.

## Method Detail

## Method Details

### getLast4

**Signature:** `getLast4() : String`

**Description:** Returns the last 4 digits of the account number, or null if not known.

**Returns:**

last 4 digits of the account number

**See Also:**

SalesforcePaymentMethod.getLast4()

---