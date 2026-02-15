## Package: dw.customer

# Class Wallet

## Inheritance Hierarchy

- Object
  - dw.customer.Wallet

## Description

Represents a set of payment instruments associated with a registered customer. Note: this class allows access to sensitive personal and private information. Pay attention to appropriate legal and regulatory requirements when developing.

## Properties

### defaultPaymentInstrument

**Type:** CustomerPaymentInstrument (Read Only)

The default payment instrument associated with the related customer. If not available, returns the first
 payment instrument or null if no payment instruments are associated with the customer.

### paymentInstruments

**Type:** Collection (Read Only)

A collection of all payment instruments associated with the
 related customer.

## Constructor Summary

## Method Summary

### createPaymentInstrument

**Signature:** `createPaymentInstrument(paymentMethodId : String) : CustomerPaymentInstrument`

Creates a new, empty payment instrument object associated with the related customer for the given payment method.

### getDefaultPaymentInstrument

**Signature:** `getDefaultPaymentInstrument() : CustomerPaymentInstrument`

Returns the default payment instrument associated with the related customer.

### getPaymentInstruments

**Signature:** `getPaymentInstruments() : Collection`

Returns a collection of all payment instruments associated with the related customer.

### getPaymentInstruments

**Signature:** `getPaymentInstruments(paymentMethodID : String) : Collection`

Returns a collection of all payment instruments associated with the related customer filtered by the given payment method id.

### removePaymentInstrument

**Signature:** `removePaymentInstrument(instrument : CustomerPaymentInstrument) : void`

Removes a payment instrument associated with the customer.

## Method Detail

## Method Details

### createPaymentInstrument

**Signature:** `createPaymentInstrument(paymentMethodId : String) : CustomerPaymentInstrument`

**Description:** Creates a new, empty payment instrument object associated with the related customer for the given payment method.

**Parameters:**

- `paymentMethodId`: the id of a payment method

**Returns:**

the new payment instrument object.

**Throws:**

NullArgumentException - If passed 'paymentMethodId' is null.

---

### getDefaultPaymentInstrument

**Signature:** `getDefaultPaymentInstrument() : CustomerPaymentInstrument`

**Description:** Returns the default payment instrument associated with the related customer. If not available, returns the first payment instrument or null if no payment instruments are associated with the customer.

**Returns:**

The default payment instrument object.

---

### getPaymentInstruments

**Signature:** `getPaymentInstruments() : Collection`

**Description:** Returns a collection of all payment instruments associated with the related customer.

**Returns:**

Collection of all payment instruments.

---

### getPaymentInstruments

**Signature:** `getPaymentInstruments(paymentMethodID : String) : Collection`

**Description:** Returns a collection of all payment instruments associated with the related customer filtered by the given payment method id. If null is passed as payment method id all payment instruments of the customer will be retrieved. If for the given payment method id no payment instrument is associated with the customer an empty collection will be returned.

**Parameters:**

- `paymentMethodID`: the paymentMethodID the payment method id to filter for

**Returns:**

Collection of payment instruments for a payment method.

---

### removePaymentInstrument

**Signature:** `removePaymentInstrument(instrument : CustomerPaymentInstrument) : void`

**Description:** Removes a payment instrument associated with the customer.

**Parameters:**

- `instrument`: the instrument associated with this customer

**Throws:**

NullArgumentException - If passed 'instrument' is null.
IllegalArgumentException - If passed 'instrument' belongs to an other customer

---