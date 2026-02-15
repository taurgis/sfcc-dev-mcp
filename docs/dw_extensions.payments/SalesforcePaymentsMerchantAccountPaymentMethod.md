## Package: dw.extensions.payments

# Class SalesforcePaymentsMerchantAccountPaymentMethod

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentsMerchantAccountPaymentMethod

## Description

Contains information about a payment method to be presented to a payer, as configured for a Salesforce Payments merchant account. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### merchantAccount

**Type:** SalesforcePaymentsMerchantAccount (Read Only)

The merchant account configured for this payment method.

### paymentMethodType

**Type:** String (Read Only)

The constant indicating the type of payment method to be presented, such as
 SalesforcePaymentMethod.TYPE_CARD.

### paymentModes

**Type:** Collection (Read Only)

A collection containing the payment modes for which this payment method is to be presented, such as
 "Express".

## Constructor Summary

## Method Summary

### getMerchantAccount

**Signature:** `getMerchantAccount() : SalesforcePaymentsMerchantAccount`

Returns the merchant account configured for this payment method.

### getPaymentMethodType

**Signature:** `getPaymentMethodType() : String`

Returns the constant indicating the type of payment method to be presented, such as SalesforcePaymentMethod.TYPE_CARD.

### getPaymentModes

**Signature:** `getPaymentModes() : Collection`

Returns a collection containing the payment modes for which this payment method is to be presented, such as "Express".

## Method Detail

## Method Details

### getMerchantAccount

**Signature:** `getMerchantAccount() : SalesforcePaymentsMerchantAccount`

**Description:** Returns the merchant account configured for this payment method.

**Returns:**

merchant account

---

### getPaymentMethodType

**Signature:** `getPaymentMethodType() : String`

**Description:** Returns the constant indicating the type of payment method to be presented, such as SalesforcePaymentMethod.TYPE_CARD.

**Returns:**

payment method type

---

### getPaymentModes

**Signature:** `getPaymentModes() : Collection`

**Description:** Returns a collection containing the payment modes for which this payment method is to be presented, such as "Express".

**Returns:**

collection of payment modes

---