## Package: dw.order

# Class PaymentMethod

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.PaymentMethod

## Description

The PaymentMethod class represents a logical type of payment a customer can make in the storefront. This class provides methods to access the payment method attributes, status, and (for card-based payment methods) the related payment cards. A typical storefront presents the customer a list of payment methods that a customer can choose from after he has entered his billing address during the checkout. PaymentMgr.getApplicablePaymentMethods(Customer, String, Number) is used to determine the PaymentMethods that are relevant for the customer based on the amount of his order, his customer groups, and his shipping address.

## Properties

### active

**Type:** boolean (Read Only)

Returns 'true' if payment method is active (enabled), otherwise 'false' is returned.

### activePaymentCards

**Type:** List (Read Only)

Returns enabled payment cards that are assigned to this payment method, regardless
 of current customer, country or payment amount restrictions.
 The payment cards are sorted as defined in the Business Manager.

### description

**Type:** MarkupText (Read Only)

The description of the payment method.

### ID

**Type:** String (Read Only)

The unique ID of the payment method.

### image

**Type:** MediaFile (Read Only)

The reference to the payment method image.

### name

**Type:** String (Read Only)

The name of the payment method.

### paymentProcessor

**Type:** PaymentProcessor (Read Only)

The payment processor associated to this payment method.

## Constructor Summary

## Method Summary

### getActivePaymentCards

**Signature:** `getActivePaymentCards() : List`

Returns enabled payment cards that are assigned to this payment method, regardless of current customer, country or payment amount restrictions.

### getApplicablePaymentCards

**Signature:** `getApplicablePaymentCards(customer : Customer, countryCode : String, paymentAmount : Number) : List`

Returns the sorted list of all enabled payment cards of this payment method applicable for the specified customer, country, payment amount and the session currency The payment cards are sorted as defined in the Business Manager.

### getDescription

**Signature:** `getDescription() : MarkupText`

Returns the description of the payment method.

### getID

**Signature:** `getID() : String`

Returns the unique ID of the payment method.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the reference to the payment method image.

### getName

**Signature:** `getName() : String`

Returns the name of the payment method.

### getPaymentProcessor

**Signature:** `getPaymentProcessor() : PaymentProcessor`

Returns the payment processor associated to this payment method.

### isActive

**Signature:** `isActive() : boolean`

Returns 'true' if payment method is active (enabled), otherwise 'false' is returned.

### isApplicable

**Signature:** `isApplicable(customer : Customer, countryCode : String, paymentAmount : Number) : boolean`

Returns 'true' if this payment method is applicable for the specified customer, country and payment amount and the session currency.

## Method Detail

## Method Details

### getActivePaymentCards

**Signature:** `getActivePaymentCards() : List`

**Description:** Returns enabled payment cards that are assigned to this payment method, regardless of current customer, country or payment amount restrictions. The payment cards are sorted as defined in the Business Manager.

**Returns:**

List of enabled payment cards of current site

---

### getApplicablePaymentCards

**Signature:** `getApplicablePaymentCards(customer : Customer, countryCode : String, paymentAmount : Number) : List`

**Description:** Returns the sorted list of all enabled payment cards of this payment method applicable for the specified customer, country, payment amount and the session currency The payment cards are sorted as defined in the Business Manager. A payment card is applicable if the card is restricted by customer group, and at least one of the groups of the specified customer is assigned to the card the card is restricted by billing country, and the specified country code is assigned to the card the card is restricted by payment amount for the session currency, and the specified payment amount is within the limits of the min/max payment amount defined for the method and the session currency the card is restricted by currency code, and the specified currency code matches session currency. All parameters are optional, and if not specified, the respective restriction won't be validated. For example, if a card is restricted by billing country, but no country code is specified, this card will be returned, unless it is filtered out by customer group or payment amount.

**Parameters:**

- `customer`: Customer or null
- `countryCode`: Billing country code or null
- `paymentAmount`: Payment amount or null

**Returns:**

List of applicable payment cards of this payment method

---

### getDescription

**Signature:** `getDescription() : MarkupText`

**Description:** Returns the description of the payment method.

**Returns:**

Description of the payment method.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique ID of the payment method.

**Returns:**

ID of the payment method.

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the reference to the payment method image.

**Returns:**

Image of the payment method.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the payment method.

**Returns:**

Name of the payment method.

---

### getPaymentProcessor

**Signature:** `getPaymentProcessor() : PaymentProcessor`

**Description:** Returns the payment processor associated to this payment method.

**Returns:**

the payment processor associated to this payment method.

---

### isActive

**Signature:** `isActive() : boolean`

**Description:** Returns 'true' if payment method is active (enabled), otherwise 'false' is returned.

**Returns:**

true if payment method is active, otherwise false.

---

### isApplicable

**Signature:** `isApplicable(customer : Customer, countryCode : String, paymentAmount : Number) : boolean`

**Description:** Returns 'true' if this payment method is applicable for the specified customer, country and payment amount and the session currency. The payment method is applicable if the method is restricted by customer group, and at least one of the groups of the specified customer is assigned to the method the method is restricted by billing country, and the specified country code is assigned to the method the method is restricted by payment amount for the session currency, and the specified payment amount is within the limits of the min/max payment amount defined for the method and the session currency the method is restricted by currency code, and the specified currency code matches session currency. All parameters are optional, and if not specified, the respective restriction won't be validated. For example, if a method is restricted by billing country, but no country code is specified, this method will be returned, unless it is filtered out by customer group or payment amount.

**Parameters:**

- `customer`: Customer or null
- `countryCode`: Billing country code or null
- `paymentAmount`: Payment amount or null

**Returns:**

true if payment method is applicable, false otherwise

---