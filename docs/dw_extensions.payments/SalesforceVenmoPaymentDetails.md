## Package: dw.extensions.payments

# Class SalesforceVenmoPaymentDetails

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentDetails
  - dw.extensions.payments.SalesforceVenmoPaymentDetails

## Description

Details to a Salesforce Payments payment of type SalesforcePayPalOrder.TYPE_VENMO. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### captureID

**Type:** String (Read Only)

The ID of the capture against the PayPal Venmo order, or null if not known.

### payerEmailAddress

**Type:** String (Read Only)

The email address of the payer for the PayPal Venmo order, or null if not known.

## Constructor Summary

## Method Summary

### getCaptureID

**Signature:** `getCaptureID() : String`

Returns the ID of the capture against the PayPal Venmo order, or null if not known.

### getPayerEmailAddress

**Signature:** `getPayerEmailAddress() : String`

Returns the email address of the payer for the PayPal Venmo order, or null if not known.

## Method Detail

## Method Details

### getCaptureID

**Signature:** `getCaptureID() : String`

**Description:** Returns the ID of the capture against the PayPal Venmo order, or null if not known.

**Returns:**

PayPal order capture ID

**See Also:**

SalesforcePayPalOrder.getCaptureID()

---

### getPayerEmailAddress

**Signature:** `getPayerEmailAddress() : String`

**Description:** Returns the email address of the payer for the PayPal Venmo order, or null if not known.

**Returns:**

payer email address

**See Also:**

SalesforcePayPalOrderPayer.getEmailAddress()

---