## Package: dw.extensions.payments

# Class SalesforceBancontactPaymentDetails

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentDetails
  - dw.extensions.payments.SalesforceBancontactPaymentDetails

## Description

Details to a Salesforce Payments payment of type SalesforcePaymentMethod.TYPE_BANCONTACT. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### bankName

**Type:** String (Read Only)

The bank name, or null if not known.

### last4

**Type:** String (Read Only)

The last 4 digits of the account number, or null if not known.

## Constructor Summary

## Method Summary

### getBankName

**Signature:** `getBankName() : String`

Returns the bank name, or null if not known.

### getLast4

**Signature:** `getLast4() : String`

Returns the last 4 digits of the account number, or null if not known.

## Method Detail

## Method Details

### getBankName

**Signature:** `getBankName() : String`

**Description:** Returns the bank name, or null if not known.

**Returns:**

bank name

**See Also:**

SalesforcePaymentMethod.getBankName()

---

### getLast4

**Signature:** `getLast4() : String`

**Description:** Returns the last 4 digits of the account number, or null if not known.

**Returns:**

last 4 digits of the account number

**See Also:**

SalesforcePaymentMethod.getLast4()

---