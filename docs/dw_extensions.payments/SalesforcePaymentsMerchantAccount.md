## Package: dw.extensions.payments

# Class SalesforcePaymentsMerchantAccount

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentsMerchantAccount

## Description

Contains information about a merchant account configured for use with Salesforce Payments. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### accountId

**Type:** String (Read Only)

The ID of the Salesforce Payments merchant account.

### accountType

**Type:** String (Read Only)

The type of the Salesforce Payments merchant account and environment, such as "STRIPE_TEST"
 or "ADYEN_LIVE".

### config

**Type:** Object (Read Only)

An opaque configuration object containing gateway-specific information. Do not depend on the structure or
 contents of this object as they may change at any time.

### live

**Type:** boolean (Read Only)

Returns true if the account takes live payments, or false if it takes test payments.

### vendor

**Type:** String (Read Only)

The name of the gateway vendor, such as "Stripe" or "Adyen".

## Constructor Summary

## Method Summary

### getAccountId

**Signature:** `getAccountId() : String`

Returns the ID of the Salesforce Payments merchant account.

### getAccountType

**Signature:** `getAccountType() : String`

Returns the type of the Salesforce Payments merchant account and environment, such as "STRIPE_TEST" or "ADYEN_LIVE".

### getConfig

**Signature:** `getConfig() : Object`

Returns an opaque configuration object containing gateway-specific information.

### getVendor

**Signature:** `getVendor() : String`

Returns the name of the gateway vendor, such as "Stripe" or "Adyen".

### isLive

**Signature:** `isLive() : boolean`

Returns true if the account takes live payments, or false if it takes test payments.

## Method Detail

## Method Details

### getAccountId

**Signature:** `getAccountId() : String`

**Description:** Returns the ID of the Salesforce Payments merchant account.

**Returns:**

merchant account ID

**See Also:**

PaymentTransaction.setAccountID(String)
PaymentTransaction.getAccountID()

---

### getAccountType

**Signature:** `getAccountType() : String`

**Description:** Returns the type of the Salesforce Payments merchant account and environment, such as "STRIPE_TEST" or "ADYEN_LIVE".

**Returns:**

merchant account type

**See Also:**

PaymentTransaction.setAccountType(String)
PaymentTransaction.getAccountType()

---

### getConfig

**Signature:** `getConfig() : Object`

**Description:** Returns an opaque configuration object containing gateway-specific information. Do not depend on the structure or contents of this object as they may change at any time.

**Returns:**

opaque configuration object

---

### getVendor

**Signature:** `getVendor() : String`

**Description:** Returns the name of the gateway vendor, such as "Stripe" or "Adyen".

**Returns:**

gateway vendor name

---

### isLive

**Signature:** `isLive() : boolean`

**Description:** Returns true if the account takes live payments, or false if it takes test payments.

**Returns:**

true if the account takes live payments

---