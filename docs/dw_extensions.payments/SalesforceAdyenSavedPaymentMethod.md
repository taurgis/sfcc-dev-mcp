## Package: dw.extensions.payments

# Class SalesforceAdyenSavedPaymentMethod

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforceAdyenSavedPaymentMethod

## Description

Salesforce Payments representation of an Adyen saved payment method object. See Salesforce Payments documentation for how to gain access and configure it for use on your sites. An Adyen saved payment method contains information about a credential used by a shopper to attempt payment, such as a payment card or bank account. The available information differs for each type of payment method. It includes only limited information that can be safely presented to a shopper to remind them what credential they used, and specifically not complete card, account, or other numbers that could be used to make future payments.

## Constants

### TYPE_BANCONTACT

**Type:** String = "bancontact"

Represents the Bancontact payment method.

### TYPE_CARD

**Type:** String = "card"

Represents a credit card type of payment method.

### TYPE_IDEAL

**Type:** String = "ideal"

Represents the iDEAL payment method.

### TYPE_SEPA_DEBIT

**Type:** String = "sepa_debit"

Represents the SEPA Debit payment method.

## Properties

### brand

**Type:** String (Read Only)

The brand of this payment method, or null if none is available. Available on
 TYPE_CARD type methods.

### expiryMonth

**Type:** String (Read Only)

The expiry month of the card for this payment method, or null if none is available.
 Available on TYPE_CARD and
 TYPE_BANCONTACT type methods.

### expiryYear

**Type:** String (Read Only)

The expiry year of the card for this payment method, or null if none is available. Available
 on TYPE_CARD and
 TYPE_BANCONTACT type methods.

### holderName

**Type:** String (Read Only)

The cardholder name for this payment method, or null if none is available. Available on
 TYPE_CARD and TYPE_BANCONTACT
 type methods.

### ID

**Type:** String (Read Only)

The identifier of this payment method.

### last4

**Type:** String (Read Only)

The last 4 digits of the credential for this payment method, or null if none is available.
 Available on TYPE_CARD and
 TYPE_BANCONTACT type methods.

### ownerName

**Type:** String (Read Only)

The back account owner name for this payment method, or null if none is available. Available
 on TYPE_SEPA_DEBIT and
 TYPE_IDEAL type method.

### type

**Type:** String (Read Only)

The type of this payment method.

## Constructor Summary

## Method Summary

### getBrand

**Signature:** `getBrand() : String`

Returns the brand of this payment method, or null if none is available.

### getExpiryMonth

**Signature:** `getExpiryMonth() : String`

Returns the expiry month of the card for this payment method, or null if none is available.

### getExpiryYear

**Signature:** `getExpiryYear() : String`

Returns the expiry year of the card for this payment method, or null if none is available.

### getHolderName

**Signature:** `getHolderName() : String`

Returns the cardholder name for this payment method, or null if none is available.

### getID

**Signature:** `getID() : String`

Returns the identifier of this payment method.

### getLast4

**Signature:** `getLast4() : String`

Returns the last 4 digits of the credential for this payment method, or null if none is available.

### getOwnerName

**Signature:** `getOwnerName() : String`

Returns the back account owner name for this payment method, or null if none is available.

### getType

**Signature:** `getType() : String`

Returns the type of this payment method.

## Method Detail

## Method Details

### getBrand

**Signature:** `getBrand() : String`

**Description:** Returns the brand of this payment method, or null if none is available. Available on TYPE_CARD type methods.

**Returns:**

payment method brand

---

### getExpiryMonth

**Signature:** `getExpiryMonth() : String`

**Description:** Returns the expiry month of the card for this payment method, or null if none is available. Available on TYPE_CARD and TYPE_BANCONTACT type methods.

**Returns:**

payment method credential expiry month

---

### getExpiryYear

**Signature:** `getExpiryYear() : String`

**Description:** Returns the expiry year of the card for this payment method, or null if none is available. Available on TYPE_CARD and TYPE_BANCONTACT type methods.

**Returns:**

payment method credential expiry year

---

### getHolderName

**Signature:** `getHolderName() : String`

**Description:** Returns the cardholder name for this payment method, or null if none is available. Available on TYPE_CARD and TYPE_BANCONTACT type methods.

**Returns:**

payment method credential cardholder name

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the identifier of this payment method.

**Returns:**

payment method identifier

---

### getLast4

**Signature:** `getLast4() : String`

**Description:** Returns the last 4 digits of the credential for this payment method, or null if none is available. Available on TYPE_CARD and TYPE_BANCONTACT type methods.

**Returns:**

payment method credential last 4 digits

---

### getOwnerName

**Signature:** `getOwnerName() : String`

**Description:** Returns the back account owner name for this payment method, or null if none is available. Available on TYPE_SEPA_DEBIT and TYPE_IDEAL type method.

**Returns:**

payment method credential back account owner name

---

### getType

**Signature:** `getType() : String`

**Description:** Returns the type of this payment method.

**Returns:**

payment method type

**See Also:**

TYPE_BANCONTACT
TYPE_CARD
TYPE_IDEAL
TYPE_SEPA_DEBIT

---