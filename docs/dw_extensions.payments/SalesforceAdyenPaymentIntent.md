## Package: dw.extensions.payments

# Class SalesforceAdyenPaymentIntent

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforceAdyenPaymentIntent

## Description

Salesforce Payments representation of an Adyen payment intent object. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Properties

### action

**Type:** Object (Read Only)

The payment action for this payment intent.

### ID

**Type:** String (Read Only)

The identifier of this payment intent.

### resultCode

**Type:** String (Read Only)

The Adyen result code for this payment intent.

## Constructor Summary

## Method Summary

### getAction

**Signature:** `getAction() : Object`

Returns the payment action for this payment intent.

### getID

**Signature:** `getID() : String`

Returns the identifier of this payment intent.

### getPaymentInstrument

**Signature:** `getPaymentInstrument(basket : Basket) : OrderPaymentInstrument`

Returns the payment instrument for this payment intent in the given basket, or null if the given basket has none.

### getPaymentInstrument

**Signature:** `getPaymentInstrument(order : Order) : OrderPaymentInstrument`

Returns the payment instrument for this payment intent in the given order, or null if the given order has none.

### getResultCode

**Signature:** `getResultCode() : String`

Returns the Adyen result code for this payment intent.

### hasAction

**Signature:** `hasAction() : boolean`

Returns true if this payment intent has an action, or false if not.

## Method Detail

## Method Details

### getAction

**Signature:** `getAction() : Object`

**Description:** Returns the payment action for this payment intent.

**Returns:**

payment action

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the identifier of this payment intent.

**Returns:**

payment intent identifier

---

### getPaymentInstrument

**Signature:** `getPaymentInstrument(basket : Basket) : OrderPaymentInstrument`

**Description:** Returns the payment instrument for this payment intent in the given basket, or null if the given basket has none.

**Parameters:**

- `basket`: basket

**Returns:**

basket payment instrument

---

### getPaymentInstrument

**Signature:** `getPaymentInstrument(order : Order) : OrderPaymentInstrument`

**Description:** Returns the payment instrument for this payment intent in the given order, or null if the given order has none.

**Parameters:**

- `order`: order

**Returns:**

order payment instrument

---

### getResultCode

**Signature:** `getResultCode() : String`

**Description:** Returns the Adyen result code for this payment intent.

**Returns:**

Adyen result code

---

### hasAction

**Signature:** `hasAction() : boolean`

**Description:** Returns true if this payment intent has an action, or false if not.

**Returns:**

true if this payment intent has an action

---