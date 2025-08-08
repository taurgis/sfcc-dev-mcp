## Package: dw.order

# Class PaymentTransaction

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.PaymentTransaction

## Description

The PaymentTransaction class represents a payment transaction.

## Constants

## Properties

### accountID

**Type:** String

The payment service-specific account id.

### accountType

**Type:** String

The payment service-specific account type.

### amount

**Type:** Money

The amount of the transaction.

### paymentInstrument

**Type:** OrderPaymentInstrument (Read Only)

The payment instrument related to this payment transaction.

### paymentProcessor

**Type:** PaymentProcessor

The payment processor related to this payment transaction.

### transactionID

**Type:** String

The payment service-specific transaction id.

### type

**Type:** EnumValue

The value of the transaction type where the
 value is one of TYPE_AUTH, TYPE_AUTH_REVERSAL, TYPE_CAPTURE
 or TYPE_CREDIT.

## Constructor Summary

## Method Summary

### getAccountID

**Signature:** `getAccountID() : String`

Returns the payment service-specific account id.

### getAccountType

**Signature:** `getAccountType() : String`

Returns the payment service-specific account type.

### getAmount

**Signature:** `getAmount() : Money`

Returns the amount of the transaction.

### getPaymentInstrument

**Signature:** `getPaymentInstrument() : OrderPaymentInstrument`

Returns the payment instrument related to this payment transaction.

### getPaymentProcessor

**Signature:** `getPaymentProcessor() : PaymentProcessor`

Returns the payment processor related to this payment transaction.

### getTransactionID

**Signature:** `getTransactionID() : String`

Returns the payment service-specific transaction id.

### getType

**Signature:** `getType() : EnumValue`

Returns the value of the transaction type where the value is one of TYPE_AUTH, TYPE_AUTH_REVERSAL, TYPE_CAPTURE or TYPE_CREDIT.

### setAccountID

**Signature:** `setAccountID(accountID : String) : void`

Sets the payment service-specific account id.

### setAccountType

**Signature:** `setAccountType(accountType : String) : void`

Sets the payment service-specific account type.

### setAmount

**Signature:** `setAmount(amount : Money) : void`

Sets the amount of the transaction.

### setPaymentProcessor

**Signature:** `setPaymentProcessor(paymentProcessor : PaymentProcessor) : void`

Sets the payment processor related to this payment transaction.

### setTransactionID

**Signature:** `setTransactionID(transactionID : String) : void`

Sets the payment service-specific transaction id.

### setType

**Signature:** `setType(type : String) : void`

Sets the value of the transaction type where permissible values are TYPE_AUTH, TYPE_AUTH_REVERSAL, TYPE_CAPTURE or TYPE_CREDIT.

## Method Detail

## Method Details

### getAccountID

**Signature:** `getAccountID() : String`

**Description:** Returns the payment service-specific account id.

**Returns:**

the payment service-specific account id.

---

### getAccountType

**Signature:** `getAccountType() : String`

**Description:** Returns the payment service-specific account type.

**Returns:**

the payment service-specific account type.

---

### getAmount

**Signature:** `getAmount() : Money`

**Description:** Returns the amount of the transaction.

**Returns:**

the amount of the transaction.

---

### getPaymentInstrument

**Signature:** `getPaymentInstrument() : OrderPaymentInstrument`

**Description:** Returns the payment instrument related to this payment transaction.

**Returns:**

the order payment instrument related to this payment transaction.

---

### getPaymentProcessor

**Signature:** `getPaymentProcessor() : PaymentProcessor`

**Description:** Returns the payment processor related to this payment transaction.

**Returns:**

the payment processor related to this payment transaction.

---

### getTransactionID

**Signature:** `getTransactionID() : String`

**Description:** Returns the payment service-specific transaction id.

**Returns:**

the payment service-specific transaction id.

---

### getType

**Signature:** `getType() : EnumValue`

**Description:** Returns the value of the transaction type where the value is one of TYPE_AUTH, TYPE_AUTH_REVERSAL, TYPE_CAPTURE or TYPE_CREDIT.

**Returns:**

the value of the transaction type where the value is one of TYPE_AUTH, TYPE_AUTH_REVERSAL, TYPE_CAPTURE or TYPE_CREDIT.

---

### setAccountID

**Signature:** `setAccountID(accountID : String) : void`

**Description:** Sets the payment service-specific account id.

**Parameters:**

- `accountID`: the payment service-specific account id.

---

### setAccountType

**Signature:** `setAccountType(accountType : String) : void`

**Description:** Sets the payment service-specific account type.

**Parameters:**

- `accountType`: the payment service-specific account type.

---

### setAmount

**Signature:** `setAmount(amount : Money) : void`

**Description:** Sets the amount of the transaction.

**Parameters:**

- `amount`: the amount of the transaction.

---

### setPaymentProcessor

**Signature:** `setPaymentProcessor(paymentProcessor : PaymentProcessor) : void`

**Description:** Sets the payment processor related to this payment transaction.

**Parameters:**

- `paymentProcessor`: the payment processor related to this payment transaction.

---

### setTransactionID

**Signature:** `setTransactionID(transactionID : String) : void`

**Description:** Sets the payment service-specific transaction id.

**Parameters:**

- `transactionID`: the payment service-specific transaction id.

---

### setType

**Signature:** `setType(type : String) : void`

**Description:** Sets the value of the transaction type where permissible values are TYPE_AUTH, TYPE_AUTH_REVERSAL, TYPE_CAPTURE or TYPE_CREDIT.

**Parameters:**

- `type`: the value of the transaction type where the value is one of TYPE_AUTH, TYPE_AUTH_REVERSAL, TYPE_CAPTURE or TYPE_CREDIT.

---