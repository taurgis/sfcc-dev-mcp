## Package: dw.extensions.payments

# Class SalesforcePayPalOrder

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePayPalOrder

## Description

Salesforce Payments representation of a PayPal order object. See Salesforce Payments documentation for how to gain access and configure it for use on your sites. A PayPal order is automatically created when a shopper is ready to pay for items in their basket. It becomes completed when the shopper provides information to the payment provider that is acceptable to authorize payment for a given amount.

## Constants

### INTENT_AUTHORIZE

**Type:** String = "AUTHORIZE"

Represents the "AUTHORIZE" intent, meaning manual capture.

### INTENT_CAPTURE

**Type:** String = "CAPTURE"

Represents the "CAPTURE" intent, meaning automatic capture.

### TYPE_PAYPAL

**Type:** String = "paypal"

Represents the PayPal funding source.

### TYPE_VENMO

**Type:** String = "venmo"

Represents the Venmo funding source.

## Properties

### amount

**Type:** Money (Read Only)

The amount of this PayPal order.

### authorizationID

**Type:** String (Read Only)

The ID of the authorization against this order, or null if not available.

### captureID

**Type:** String (Read Only)

The ID of the capture against this order, or null if not available.

### completed

**Type:** boolean (Read Only)

Returns true if this PayPal order has been completed, or false if not.

### ID

**Type:** String (Read Only)

The identifier of this PayPal order.

### payer

**Type:** SalesforcePayPalOrderPayer (Read Only)

The payer information for this PayPal order, or null if not known.

### shipping

**Type:** SalesforcePayPalOrderAddress (Read Only)

The shipping address for this PayPal order, or null if not known.

## Constructor Summary

## Method Summary

### getAmount

**Signature:** `getAmount() : Money`

Returns the amount of this PayPal order.

### getAuthorizationID

**Signature:** `getAuthorizationID() : String`

Returns the ID of the authorization against this order, or null if not available.

### getCaptureID

**Signature:** `getCaptureID() : String`

Returns the ID of the capture against this order, or null if not available.

### getID

**Signature:** `getID() : String`

Returns the identifier of this PayPal order.

### getPayer

**Signature:** `getPayer() : SalesforcePayPalOrderPayer`

Returns the payer information for this PayPal order, or null if not known.

### getPaymentDetails

**Signature:** `getPaymentDetails(paymentInstrument : OrderPaymentInstrument) : SalesforcePaymentDetails`

Returns the details to the Salesforce Payments payment for this PayPal order, using the given payment instrument.

### getPaymentInstrument

**Signature:** `getPaymentInstrument(basket : Basket) : OrderPaymentInstrument`

Returns the payment instrument for this PayPal order in the given basket, or null if the given basket has none.

### getPaymentInstrument

**Signature:** `getPaymentInstrument(order : Order) : OrderPaymentInstrument`

Returns the payment instrument for this PayPal order in the given order, or null if the given order has none.

### getShipping

**Signature:** `getShipping() : SalesforcePayPalOrderAddress`

Returns the shipping address for this PayPal order, or null if not known.

### isCompleted

**Signature:** `isCompleted() : boolean`

Returns true if this PayPal order has been completed, or false if not.

## Method Detail

## Method Details

### getAmount

**Signature:** `getAmount() : Money`

**Description:** Returns the amount of this PayPal order.

**Returns:**

PayPal order amount

---

### getAuthorizationID

**Signature:** `getAuthorizationID() : String`

**Description:** Returns the ID of the authorization against this order, or null if not available.

**Returns:**

PayPal order authorization identifier

---

### getCaptureID

**Signature:** `getCaptureID() : String`

**Description:** Returns the ID of the capture against this order, or null if not available.

**Returns:**

PayPal order capture identifier

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the identifier of this PayPal order.

**Returns:**

PayPal order identifier

---

### getPayer

**Signature:** `getPayer() : SalesforcePayPalOrderPayer`

**Description:** Returns the payer information for this PayPal order, or null if not known.

**Returns:**

order payer information

---

### getPaymentDetails

**Signature:** `getPaymentDetails(paymentInstrument : OrderPaymentInstrument) : SalesforcePaymentDetails`

**Description:** Returns the details to the Salesforce Payments payment for this PayPal order, using the given payment instrument.

**Parameters:**

- `paymentInstrument`: payment instrument

**Returns:**

The payment details

---

### getPaymentInstrument

**Signature:** `getPaymentInstrument(basket : Basket) : OrderPaymentInstrument`

**Description:** Returns the payment instrument for this PayPal order in the given basket, or null if the given basket has none.

**Parameters:**

- `basket`: basket

**Returns:**

basket payment instrument

---

### getPaymentInstrument

**Signature:** `getPaymentInstrument(order : Order) : OrderPaymentInstrument`

**Description:** Returns the payment instrument for this PayPal order in the given order, or null if the given order has none.

**Parameters:**

- `order`: order

**Returns:**

order payment instrument

---

### getShipping

**Signature:** `getShipping() : SalesforcePayPalOrderAddress`

**Description:** Returns the shipping address for this PayPal order, or null if not known.

**Returns:**

order shipping address

---

### isCompleted

**Signature:** `isCompleted() : boolean`

**Description:** Returns true if this PayPal order has been completed, or false if not.

**Returns:**

true if this PayPal order has been completed

---