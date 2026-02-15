## Package: dw.extensions.payments

# Class SalesforcePaymentsZone

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentsZone

## Description

Salesforce Payments representation of a payments zone. See Salesforce Payments documentation for how to gain access and configure payment zones and assign them to sites. A payments zone contains information about the payment zone for a site and country.

## Properties

### afterpayClearpayEnabled

**Type:** boolean (Read Only)

Returns true if Afterpay Clearpay presentment is enabled, or false if not.

### applePayEnabled

**Type:** boolean (Read Only)

Returns true if Apple Pay presentment is enabled, or false if not.

### bancontactEnabled

**Type:** boolean (Read Only)

Returns true if Bancontact presentment is enabled, or false if not. Note: For Adyen
 merchant accounts, this setting refers to the "Bancontact Card" payment method.

### bancontactMobileEnabled

**Type:** boolean (Read Only)

Returns true if Bancontact Mobile presentment is enabled, or false if not. Note: This
 setting is only applicable for Adyen Merchant Accounts

### cardEnabled

**Type:** boolean (Read Only)

Returns true if credit card presentment is enabled, or false if not.

### epsEnabled

**Type:** boolean (Read Only)

Returns true if EPS presentment is enabled, or false if not.

### idealEnabled

**Type:** boolean (Read Only)

Returns true if iDEAL presentment is enabled, or false if not.

### klarnaEnabled

**Type:** boolean (Read Only)

Returns true if Klarna presentment is enabled, or false if not. Note: For Adyen
 merchant accounts, this setting applies to the Klarna Pay Later payment method.

### klarnaPayInInstallmentsEnabled

**Type:** boolean (Read Only)

Returns true if Klarna Pay in Installments presentment is enabled, or false if not.
 Note: This setting is only applicable for Adyen Merchant Accounts.

### klarnaPayNowEnabled

**Type:** boolean (Read Only)

Returns true if Klarna Pay Now presentment is enabled, or false if not. Note: This
 setting is only applicable for Adyen Merchant Accounts.

### paymentRequestEnabled

**Type:** boolean (Read Only)

Returns true if W3C Payment Request API button presentment is enabled, or false if not.

### payPalEnabled

**Type:** boolean (Read Only)

Returns true if PayPal multi-step checkout presentment is enabled, or false if not.

### payPalExpressEnabled

**Type:** boolean (Read Only)

Returns true if PayPal express checkout presentment is enabled, or false if not.

### sepaDebitEnabled

**Type:** boolean (Read Only)

Returns true if SEPA Debit presentment is enabled, or false if not.

### venmoEnabled

**Type:** boolean (Read Only)

Returns true if Venmo multi-step checkout presentment is enabled, or false if not.

### venmoExpressEnabled

**Type:** boolean (Read Only)

Returns true if Venmo express checkout presentment is enabled, or false if not.

### zoneId

**Type:** String (Read Only)

The id of the payments zone.

## Constructor Summary

## Method Summary

### getPaymentMethods

**Signature:** `getPaymentMethods(countryCode : String, amount : Money) : Collection`

Returns a collection containing the merchant account payment methods to be presented for this payments zone.

### getZoneId

**Signature:** `getZoneId() : String`

Returns the id of the payments zone.

### isAfterpayClearpayEnabled

**Signature:** `isAfterpayClearpayEnabled() : boolean`

Returns true if Afterpay Clearpay presentment is enabled, or false if not.

### isApplePayEnabled

**Signature:** `isApplePayEnabled() : boolean`

Returns true if Apple Pay presentment is enabled, or false if not.

### isBancontactEnabled

**Signature:** `isBancontactEnabled() : boolean`

Returns true if Bancontact presentment is enabled, or false if not.

### isBancontactMobileEnabled

**Signature:** `isBancontactMobileEnabled() : boolean`

Returns true if Bancontact Mobile presentment is enabled, or false if not.

### isCardEnabled

**Signature:** `isCardEnabled() : boolean`

Returns true if credit card presentment is enabled, or false if not.

### isEpsEnabled

**Signature:** `isEpsEnabled() : boolean`

Returns true if EPS presentment is enabled, or false if not.

### isIdealEnabled

**Signature:** `isIdealEnabled() : boolean`

Returns true if iDEAL presentment is enabled, or false if not.

### isKlarnaEnabled

**Signature:** `isKlarnaEnabled() : boolean`

Returns true if Klarna presentment is enabled, or false if not.

### isKlarnaPayInInstallmentsEnabled

**Signature:** `isKlarnaPayInInstallmentsEnabled() : boolean`

Returns true if Klarna Pay in Installments presentment is enabled, or false if not.

### isKlarnaPayNowEnabled

**Signature:** `isKlarnaPayNowEnabled() : boolean`

Returns true if Klarna Pay Now presentment is enabled, or false if not.

### isPaymentRequestEnabled

**Signature:** `isPaymentRequestEnabled() : boolean`

Returns true if W3C Payment Request API button presentment is enabled, or false if not.

### isPayPalEnabled

**Signature:** `isPayPalEnabled() : boolean`

Returns true if PayPal multi-step checkout presentment is enabled, or false if not.

### isPayPalExpressEnabled

**Signature:** `isPayPalExpressEnabled() : boolean`

Returns true if PayPal express checkout presentment is enabled, or false if not.

### isSepaDebitEnabled

**Signature:** `isSepaDebitEnabled() : boolean`

Returns true if SEPA Debit presentment is enabled, or false if not.

### isVenmoEnabled

**Signature:** `isVenmoEnabled() : boolean`

Returns true if Venmo multi-step checkout presentment is enabled, or false if not.

### isVenmoExpressEnabled

**Signature:** `isVenmoExpressEnabled() : boolean`

Returns true if Venmo express checkout presentment is enabled, or false if not.

## Method Detail

## Method Details

### getPaymentMethods

**Signature:** `getPaymentMethods(countryCode : String, amount : Money) : Collection`

**Description:** Returns a collection containing the merchant account payment methods to be presented for this payments zone.

**Parameters:**

- `countryCode`: No Comment In JavaDoc
- `amount`: No Comment In JavaDoc

**Returns:**

collection of merchant account payment methods

---

### getZoneId

**Signature:** `getZoneId() : String`

**Description:** Returns the id of the payments zone.

**Returns:**

zone id

---

### isAfterpayClearpayEnabled

**Signature:** `isAfterpayClearpayEnabled() : boolean`

**Description:** Returns true if Afterpay Clearpay presentment is enabled, or false if not.

**Returns:**

if Afterpay Clearpay presentment is enabled

---

### isApplePayEnabled

**Signature:** `isApplePayEnabled() : boolean`

**Description:** Returns true if Apple Pay presentment is enabled, or false if not.

**Returns:**

if Apple Pay presentment is enabled

---

### isBancontactEnabled

**Signature:** `isBancontactEnabled() : boolean`

**Description:** Returns true if Bancontact presentment is enabled, or false if not. Note: For Adyen merchant accounts, this setting refers to the "Bancontact Card" payment method.

**Returns:**

if Bancontact presentment is enabled

---

### isBancontactMobileEnabled

**Signature:** `isBancontactMobileEnabled() : boolean`

**Description:** Returns true if Bancontact Mobile presentment is enabled, or false if not. Note: This setting is only applicable for Adyen Merchant Accounts

**Returns:**

if Bancontact Mobile presentment is enabled

---

### isCardEnabled

**Signature:** `isCardEnabled() : boolean`

**Description:** Returns true if credit card presentment is enabled, or false if not.

**Returns:**

if credit card presentment is enabled

---

### isEpsEnabled

**Signature:** `isEpsEnabled() : boolean`

**Description:** Returns true if EPS presentment is enabled, or false if not.

**Returns:**

if EPS presentment is enabled

---

### isIdealEnabled

**Signature:** `isIdealEnabled() : boolean`

**Description:** Returns true if iDEAL presentment is enabled, or false if not.

**Returns:**

if iDEAL presentment is enabled

---

### isKlarnaEnabled

**Signature:** `isKlarnaEnabled() : boolean`

**Description:** Returns true if Klarna presentment is enabled, or false if not. Note: For Adyen merchant accounts, this setting applies to the Klarna Pay Later payment method.

**Returns:**

if Klarna presentment is enabled

---

### isKlarnaPayInInstallmentsEnabled

**Signature:** `isKlarnaPayInInstallmentsEnabled() : boolean`

**Description:** Returns true if Klarna Pay in Installments presentment is enabled, or false if not. Note: This setting is only applicable for Adyen Merchant Accounts.

**Returns:**

if Klarna Pay in Installments presentment is enabled

---

### isKlarnaPayNowEnabled

**Signature:** `isKlarnaPayNowEnabled() : boolean`

**Description:** Returns true if Klarna Pay Now presentment is enabled, or false if not. Note: This setting is only applicable for Adyen Merchant Accounts.

**Returns:**

if Klarna Pay Now presentment is enabled

---

### isPaymentRequestEnabled

**Signature:** `isPaymentRequestEnabled() : boolean`

**Description:** Returns true if W3C Payment Request API button presentment is enabled, or false if not.

**Returns:**

if W3C Payment Request API presentment is enabled

---

### isPayPalEnabled

**Signature:** `isPayPalEnabled() : boolean`

**Description:** Returns true if PayPal multi-step checkout presentment is enabled, or false if not.

**Returns:**

if PayPal multi-step checkout presentment is enabled

---

### isPayPalExpressEnabled

**Signature:** `isPayPalExpressEnabled() : boolean`

**Description:** Returns true if PayPal express checkout presentment is enabled, or false if not.

**Returns:**

if PayPal express checkout presentment is enabled

---

### isSepaDebitEnabled

**Signature:** `isSepaDebitEnabled() : boolean`

**Description:** Returns true if SEPA Debit presentment is enabled, or false if not.

**Returns:**

if SEPA Debit presentment is enabled

---

### isVenmoEnabled

**Signature:** `isVenmoEnabled() : boolean`

**Description:** Returns true if Venmo multi-step checkout presentment is enabled, or false if not.

**Returns:**

if Venmo multi-step checkout presentment is enabled

---

### isVenmoExpressEnabled

**Signature:** `isVenmoExpressEnabled() : boolean`

**Description:** Returns true if Venmo express checkout presentment is enabled, or false if not.

**Returns:**

if Venmo express checkout presentment is enabled

---