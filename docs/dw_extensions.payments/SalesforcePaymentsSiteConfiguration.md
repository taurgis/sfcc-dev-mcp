## Package: dw.extensions.payments

# Class SalesforcePaymentsSiteConfiguration

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentsSiteConfiguration

## Description

Salesforce Payments representation of a payment site configuration object. See Salesforce Payments documentation for how to gain access and configure it for use on your sites. A payment site configuration contains information about the configuration of the site such as whether the site is activated with Express Checkout, Multi-Step Checkout or both.

## Properties

### cardCaptureAutomatic

**Type:** boolean (Read Only)

Returns true if the capture method is set to automatic for credit card Payment Intents created for this site, or
 false if the capture method is set to manual.

### expressCheckoutEnabled

**Type:** boolean (Read Only)

Returns true if Express Checkout is enabled for the site.

### futureUsageOffSession

**Type:** boolean (Read Only)

Returns true if the payment card credential storage is configured to set up all applicable payments for off
 session reuse, or false if the credential storage is configured to set up for on session reuse only the payments
 for which the shopper actively confirms use of saved credentials.

### multiStepCheckoutEnabled

**Type:** boolean (Read Only)

Returns true if Multi-Step Checkout is enabled for the site.

## Constructor Summary

## Method Summary

### isCardCaptureAutomatic

**Signature:** `isCardCaptureAutomatic() : boolean`

Returns true if the capture method is set to automatic for credit card Payment Intents created for this site, or false if the capture method is set to manual.

### isExpressCheckoutEnabled

**Signature:** `isExpressCheckoutEnabled() : boolean`

Returns true if Express Checkout is enabled for the site.

### isFutureUsageOffSession

**Signature:** `isFutureUsageOffSession() : boolean`

Returns true if the payment card credential storage is configured to set up all applicable payments for off session reuse, or false if the credential storage is configured to set up for on session reuse only the payments for which the shopper actively confirms use of saved credentials.

### isMultiStepCheckoutEnabled

**Signature:** `isMultiStepCheckoutEnabled() : boolean`

Returns true if Multi-Step Checkout is enabled for the site.

## Method Detail

## Method Details

### isCardCaptureAutomatic

**Signature:** `isCardCaptureAutomatic() : boolean`

**Description:** Returns true if the capture method is set to automatic for credit card Payment Intents created for this site, or false if the capture method is set to manual.

**Returns:**

true if the credit card capture method is automatic, or false if it is manual

---

### isExpressCheckoutEnabled

**Signature:** `isExpressCheckoutEnabled() : boolean`

**Description:** Returns true if Express Checkout is enabled for the site.

**Returns:**

true if Express Checkout is enabled for the site, or false if not

---

### isFutureUsageOffSession

**Signature:** `isFutureUsageOffSession() : boolean`

**Description:** Returns true if the payment card credential storage is configured to set up all applicable payments for off session reuse, or false if the credential storage is configured to set up for on session reuse only the payments for which the shopper actively confirms use of saved credentials.

**Returns:**

true if the future usage is off session, or false if on session

---

### isMultiStepCheckoutEnabled

**Signature:** `isMultiStepCheckoutEnabled() : boolean`

**Description:** Returns true if Multi-Step Checkout is enabled for the site.

**Returns:**

true if Multi-Step Checkout is enabled for the site, or false if not

---