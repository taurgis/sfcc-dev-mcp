## Package: dw.extensions.payments

# Class SalesforcePaymentMethod

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentMethod

## Description

Salesforce Payments representation of a payment method object. See Salesforce Payments documentation for how to gain access and configure it for use on your sites. A payment method contains information about a credential used by a shopper to attempt payment, such as a payment card or bank account. The available information differs for each type of payment method. It includes only limited information that can be safely presented to a shopper to remind them what credential they used, and specifically not complete card, account, or other numbers that could be used to make future payments.

## Constants

### TYPE_AFTERPAY_CLEARPAY

**Type:** String = "afterpay_clearpay"

Represents the Afterpay Clearpay payment method.

### TYPE_BANCONTACT

**Type:** String = "bancontact"

Represents the Bancontact payment method.

### TYPE_CARD

**Type:** String = "card"

Represents a credit card type of payment method.

### TYPE_EPS

**Type:** String = "eps"

Represents the EPS (Electronic Payment Standard) payment method.

### TYPE_IDEAL

**Type:** String = "ideal"

Represents the iDEAL payment method.

### TYPE_KLARNA

**Type:** String = "klarna"

Represents the Klarna payment method.

### TYPE_SEPA_DEBIT

**Type:** String = "sepa_debit"

Represents the SEPA Debit payment method.

## Properties

### bank

**Type:** String (Read Only)

The bank of this payment method, or null if none is available. Available on
 TYPE_IDEAL and TYPE_EPS type methods.

### bankCode

**Type:** String (Read Only)

The bank code of this payment method, or null if none is available. Available on
 TYPE_SEPA_DEBIT and TYPE_BANCONTACT type methods.

### bankName

**Type:** String (Read Only)

The bank name of this payment method, or null if none is available. Available on
 TYPE_BANCONTACT type methods.

### branchCode

**Type:** String (Read Only)

The bank branch code of this payment method, or null if none is available. Available on
 TYPE_SEPA_DEBIT type methods.

### brand

**Type:** String (Read Only)

The brand of this payment method, or null if none is available. Available on
 TYPE_CARD type methods.

### country

**Type:** String (Read Only)

The country of this payment method, or null if none is available. Available on
 TYPE_SEPA_DEBIT type methods.

### ID

**Type:** String (Read Only)

The identifier of this payment method.

### last4

**Type:** String (Read Only)

The last 4 digits of the credential for this payment method, or null if none is available.
 Available on TYPE_CARD, TYPE_SEPA_DEBIT, and
 TYPE_BANCONTACT type methods.

### paymentMethodCategory

**Type:** String (Read Only)

The payment method category of this payment method, or null if none is available. Available
 on TYPE_KLARNA type methods.

### type

**Type:** String (Read Only)

The type of this payment method.

## Constructor Summary

## Method Summary

### getBank

**Signature:** `getBank() : String`

Returns the bank of this payment method, or null if none is available.

### getBankCode

**Signature:** `getBankCode() : String`

Returns the bank code of this payment method, or null if none is available.

### getBankName

**Signature:** `getBankName() : String`

Returns the bank name of this payment method, or null if none is available.

### getBranchCode

**Signature:** `getBranchCode() : String`

Returns the bank branch code of this payment method, or null if none is available.

### getBrand

**Signature:** `getBrand() : String`

Returns the brand of this payment method, or null if none is available.

### getCountry

**Signature:** `getCountry() : String`

Returns the country of this payment method, or null if none is available.

### getID

**Signature:** `getID() : String`

Returns the identifier of this payment method.

### getLast4

**Signature:** `getLast4() : String`

Returns the last 4 digits of the credential for this payment method, or null if none is available.

### getPaymentDetails

**Signature:** `getPaymentDetails(paymentInstrument : OrderPaymentInstrument) : SalesforcePaymentDetails`

Returns the details to the Salesforce Payments payment for this payment method, using the given payment instrument.

### getPaymentMethodCategory

**Signature:** `getPaymentMethodCategory() : String`

Returns the payment method category of this payment method, or null if none is available.

### getType

**Signature:** `getType() : String`

Returns the type of this payment method.

## Method Detail

## Method Details

### getBank

**Signature:** `getBank() : String`

**Description:** Returns the bank of this payment method, or null if none is available. Available on TYPE_IDEAL and TYPE_EPS type methods.

**Returns:**

payment method bank

---

### getBankCode

**Signature:** `getBankCode() : String`

**Description:** Returns the bank code of this payment method, or null if none is available. Available on TYPE_SEPA_DEBIT and TYPE_BANCONTACT type methods.

**Returns:**

payment method bank code

---

### getBankName

**Signature:** `getBankName() : String`

**Description:** Returns the bank name of this payment method, or null if none is available. Available on TYPE_BANCONTACT type methods.

**Returns:**

payment method bank name

---

### getBranchCode

**Signature:** `getBranchCode() : String`

**Description:** Returns the bank branch code of this payment method, or null if none is available. Available on TYPE_SEPA_DEBIT type methods.

**Returns:**

payment method bank branch code

---

### getBrand

**Signature:** `getBrand() : String`

**Description:** Returns the brand of this payment method, or null if none is available. Available on TYPE_CARD type methods.

**Returns:**

payment method brand

---

### getCountry

**Signature:** `getCountry() : String`

**Description:** Returns the country of this payment method, or null if none is available. Available on TYPE_SEPA_DEBIT type methods.

**Returns:**

payment method country

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the identifier of this payment method.

**Returns:**

payment method identifier

---

### getLast4

**Signature:** `getLast4() : String`

**Description:** Returns the last 4 digits of the credential for this payment method, or null if none is available. Available on TYPE_CARD, TYPE_SEPA_DEBIT, and TYPE_BANCONTACT type methods.

**Returns:**

payment method credential last 4 digits

---

### getPaymentDetails

**Signature:** `getPaymentDetails(paymentInstrument : OrderPaymentInstrument) : SalesforcePaymentDetails`

**Description:** Returns the details to the Salesforce Payments payment for this payment method, using the given payment instrument.

**Parameters:**

- `paymentInstrument`: payment instrument

**Returns:**

The payment details

---

### getPaymentMethodCategory

**Signature:** `getPaymentMethodCategory() : String`

**Description:** Returns the payment method category of this payment method, or null if none is available. Available on TYPE_KLARNA type methods.

**Returns:**

payment method category

---

### getType

**Signature:** `getType() : String`

**Description:** Returns the type of this payment method.

**Returns:**

payment method type

**See Also:**

TYPE_BANCONTACT
TYPE_CARD
TYPE_EPS
TYPE_AFTERPAY_CLEARPAY
TYPE_IDEAL
TYPE_SEPA_DEBIT

---