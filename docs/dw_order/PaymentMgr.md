## Package: dw.order

# Class PaymentMgr

## Inheritance Hierarchy

- Object
  - dw.order.PaymentMgr

## Description

PaymentMgr is used to access payment methods and payment cards of the current site. To access payment methods and payment cards explicitly, use methods getPaymentMethod(String) and getPaymentCard(String). To access active payment methods use method getActivePaymentMethods(). To access applicable payment methods for a customer, country and/or payment amount use method getApplicablePaymentMethods(Customer, String, Number).

## Properties

### activePaymentMethods

**Type:** List (Read Only)

The sorted list of all enabled payment methods of the current
 site, regardless of any customer group, country, payment amount or currency
 restrictions. The payment methods are sorted as defined in the Business
 Manager.

## Constructor Summary

## Method Summary

### getActivePaymentMethods

**Signature:** `static getActivePaymentMethods() : List`

Returns the sorted list of all enabled payment methods of the current site, regardless of any customer group, country, payment amount or currency restrictions.

### getApplicablePaymentMethods

**Signature:** `static getApplicablePaymentMethods(customer : Customer, countryCode : String, paymentAmount : Number) : List`

Returns the sorted list of all enabled payment methods of the current site applicable for the session currency, specified customer, country and payment amount.

### getPaymentCard

**Signature:** `static getPaymentCard(cardType : String) : PaymentCard`

Returns the payment card for the specified cardType or null if no such card exists in the current site.

### getPaymentMethod

**Signature:** `static getPaymentMethod(id : String) : PaymentMethod`

Returns the payment method for the specified ID or null if no such method exists in the current site.

## Method Detail

## Method Details

### getActivePaymentMethods

**Signature:** `static getActivePaymentMethods() : List`

**Description:** Returns the sorted list of all enabled payment methods of the current site, regardless of any customer group, country, payment amount or currency restrictions. The payment methods are sorted as defined in the Business Manager.

**Returns:**

List of enabled payment methods of current site

---

### getApplicablePaymentMethods

**Signature:** `static getApplicablePaymentMethods(customer : Customer, countryCode : String, paymentAmount : Number) : List`

**Description:** Returns the sorted list of all enabled payment methods of the current site applicable for the session currency, specified customer, country and payment amount. The payment methods are sorted as defined in the Business Manager. A payment method is applicable if the method is restricted by customer group, and at least one of the groups of the specified customer is assigned to the method the method is restricted by billing country, and the specified country code is assigned to the method the method is restricted by payment amount for the session currency, and the specified payment amount is within the limits of the min/max payment amount defined for the method and the session currency the method is restricted by currency code, and the specified currency code matches session currency. All parameters are optional, and if not specified, the respective restriction won't be validated. For example, if a method is restricted by billing country, but no country code is specified, this method will be returned, unless it is filtered out by customer group or payment amount.

**Parameters:**

- `customer`: Customer or null
- `countryCode`: Billing country code or null
- `paymentAmount`: Payment amount or null

**Returns:**

List of applicable payment methods of current site

---

### getPaymentCard

**Signature:** `static getPaymentCard(cardType : String) : PaymentCard`

**Description:** Returns the payment card for the specified cardType or null if no such card exists in the current site.

**Parameters:**

- `cardType`: PaymentCard type

**Returns:**

PaymentCard or null

---

### getPaymentMethod

**Signature:** `static getPaymentMethod(id : String) : PaymentMethod`

**Description:** Returns the payment method for the specified ID or null if no such method exists in the current site.

**Parameters:**

- `id`: PaymentMethod ID

**Returns:**

PaymentMethod or null

---