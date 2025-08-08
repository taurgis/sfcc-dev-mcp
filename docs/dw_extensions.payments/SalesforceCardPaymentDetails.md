## Package: dw.extensions.payments

# Class SalesforceCardPaymentDetails

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentDetails
  - dw.extensions.payments.SalesforceCardPaymentDetails

## Description

Details to a Salesforce Payments payment of type SalesforcePaymentMethod.TYPE_CARD. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### brand

**Type:** String (Read Only)

The card brand, or null if not known.

### last4

**Type:** String (Read Only)

The last 4 digits of the card number, or null if not known.

### walletType

**Type:** String (Read Only)

The type of wallet used to make the card payment, or null if not known.

## Constructor Summary

## Method Summary

### getBrand

**Signature:** `getBrand() : String`

Returns the card brand, or null if not known.

### getLast4

**Signature:** `getLast4() : String`

Returns the last 4 digits of the card number, or null if not known.

### getWalletType

**Signature:** `getWalletType() : String`

Returns the type of wallet used to make the card payment, or null if not known.

## Method Detail

## Method Details

### getBrand

**Signature:** `getBrand() : String`

**Description:** Returns the card brand, or null if not known.

**Returns:**

card brand

**See Also:**

SalesforcePaymentMethod.getBrand()

---

### getLast4

**Signature:** `getLast4() : String`

**Description:** Returns the last 4 digits of the card number, or null if not known.

**Returns:**

last 4 digits of the card number

**See Also:**

SalesforcePaymentMethod.getLast4()

---

### getWalletType

**Signature:** `getWalletType() : String`

**Description:** Returns the type of wallet used to make the card payment, or null if not known.

**Returns:**

wallet type

---