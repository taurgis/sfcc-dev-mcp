## Package: dw.extensions.payments

# Class SalesforcePaymentIntent

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentIntent

## Description

Salesforce Payments representation of a payment intent object. See Salesforce Payments documentation for how to gain access and configure it for use on your sites. A payment intent is automatically created when a shopper is ready to pay for items in their basket. It becomes confirmed when the shopper provides information to the payment provider that is acceptable to authorize payment for a given amount. Once that information has been provided it becomes available as the payment method associated with the payment intent.

## Constants

## Properties

### amount

**Type:** Money (Read Only)

The amount of this payment intent.

### cancelable

**Type:** boolean (Read Only)

Returns true if this payment intent has a status which indicates it can be canceled,
 or false if its status does not indicate it can be canceled.

### clientSecret

**Type:** String (Read Only)

The client secret of this payment intent.

### confirmed

**Type:** boolean (Read Only)

Returns true if this payment intent has been confirmed, or false if not.

### ID

**Type:** String (Read Only)

The identifier of this payment intent.

### paymentMethod

**Type:** SalesforcePaymentMethod (Read Only)

The payment method for this payment intent, or null if none has been established.

### refundable

**Type:** boolean (Read Only)

Returns true if this payment intent has a status and other state which indicate it can be refunded,
 or false if it cannot be refunded.

### setupFutureUsage

**Type:** String (Read Only)

Returns SETUP_FUTURE_USAGE_OFF_SESSION or SETUP_FUTURE_USAGE_ON_SESSION to indicate how the payment
 intent can be used in the future or returns null if future usage is not set up.

## Constructor Summary

## Method Summary

### getAmount

**Signature:** `getAmount() : Money`

Returns the amount of this payment intent.

### getClientSecret

**Signature:** `getClientSecret() : String`

Returns the client secret of this payment intent.

### getID

**Signature:** `getID() : String`

Returns the identifier of this payment intent.

### getPaymentInstrument

**Signature:** `getPaymentInstrument(basket : Basket) : OrderPaymentInstrument`

Returns the payment instrument for this payment intent in the given basket, or null if the given basket has none.

### getPaymentInstrument

**Signature:** `getPaymentInstrument(order : Order) : OrderPaymentInstrument`

Returns the payment instrument for this payment intent in the given order, or null if the given order has none.

### getPaymentMethod

**Signature:** `getPaymentMethod() : SalesforcePaymentMethod`

Returns the payment method for this payment intent, or null if none has been established.

### getSetupFutureUsage

**Signature:** `getSetupFutureUsage() : String`

Returns SETUP_FUTURE_USAGE_OFF_SESSION or SETUP_FUTURE_USAGE_ON_SESSION to indicate how the payment intent can be used in the future or returns null if future usage is not set up.

### isCancelable

**Signature:** `isCancelable() : boolean`

Returns true if this payment intent has a status which indicates it can be canceled, or false if its status does not indicate it can be canceled.

### isConfirmed

**Signature:** `isConfirmed() : boolean`

Returns true if this payment intent has been confirmed, or false if not.

### isRefundable

**Signature:** `isRefundable() : boolean`

Returns true if this payment intent has a status and other state which indicate it can be refunded, or false if it cannot be refunded.

## Method Detail

## Method Details

### getAmount

**Signature:** `getAmount() : Money`

**Description:** Returns the amount of this payment intent.

**Returns:**

payment intent amount

---

### getClientSecret

**Signature:** `getClientSecret() : String`

**Description:** Returns the client secret of this payment intent.

**Returns:**

payment intent client secret

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

### getPaymentMethod

**Signature:** `getPaymentMethod() : SalesforcePaymentMethod`

**Description:** Returns the payment method for this payment intent, or null if none has been established.

**Returns:**

payment method

---

### getSetupFutureUsage

**Signature:** `getSetupFutureUsage() : String`

**Description:** Returns SETUP_FUTURE_USAGE_OFF_SESSION or SETUP_FUTURE_USAGE_ON_SESSION to indicate how the payment intent can be used in the future or returns null if future usage is not set up.

**Returns:**

setup future usage or null if future usage is not set up

**See Also:**

SalesforcePaymentRequest.setSetupFutureUsage(Boolean)
SETUP_FUTURE_USAGE_OFF_SESSION
SETUP_FUTURE_USAGE_ON_SESSION

---

### isCancelable

**Signature:** `isCancelable() : boolean`

**Description:** Returns true if this payment intent has a status which indicates it can be canceled, or false if its status does not indicate it can be canceled.

**Returns:**

true if this payment intent has a status which indicates it can be canceled

---

### isConfirmed

**Signature:** `isConfirmed() : boolean`

**Description:** Returns true if this payment intent has been confirmed, or false if not.

**Returns:**

true if this payment intent has been confirmed

---

### isRefundable

**Signature:** `isRefundable() : boolean`

**Description:** Returns true if this payment intent has a status and other state which indicate it can be refunded, or false if it cannot be refunded.

**Returns:**

true if this payment intent has a status and other state which indicate it can be refunded

---