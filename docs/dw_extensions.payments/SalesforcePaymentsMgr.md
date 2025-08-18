## Package: dw.extensions.payments

# Class SalesforcePaymentsMgr

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentsMgr

## Description

Contains functionality for use with Salesforce Payments. See Salesforce Payments documentation for how to gain access and configure it for use on your sites.

## Constants

### CANCELLATION_REASON_ABANDONED

**Type:** String = "abandoned"

Cancellation reason indicating customer abandoned payment.

### CANCELLATION_REASON_DUPLICATE

**Type:** String = "duplicate"

Cancellation reason indicating payment intent was a duplicate.

### CANCELLATION_REASON_FRAUDULENT

**Type:** String = "fraudulent"

Cancellation reason indicating payment was fraudulent.

### CANCELLATION_REASON_REQUESTED_BY_CUSTOMER

**Type:** String = "requested_by_customer"

Cancellation reason indicating customer action or request.

### REFUND_REASON_DUPLICATE

**Type:** String = "duplicate"

Refund reason indicating payment intent was a duplicate.

### REFUND_REASON_FRAUDULENT

**Type:** String = "fraudulent"

Refund reason indicating payment was fraudulent.

### REFUND_REASON_REQUESTED_BY_CUSTOMER

**Type:** String = "requested_by_customer"

Refund reason indicating customer action or request.

## Properties

### paymentsSiteConfig

**Type:** SalesforcePaymentsSiteConfiguration (Read Only)

A payments site configuration object for the current site.

## Constructor Summary

## Method Summary

### attachPaymentMethod

**Signature:** `static attachPaymentMethod(paymentMethod : SalesforcePaymentMethod, customer : Customer) : void`

Attaches the given payment method to the given customer.

### cancelPaymentIntent

**Signature:** `static cancelPaymentIntent(paymentIntent : SalesforcePaymentIntent, paymentIntentProperties : Object) : Status`

Cancels the given payment intent.

### capturePaymentIntent

**Signature:** `static capturePaymentIntent(paymentIntent : SalesforcePaymentIntent, amount : Money) : Status`

Captures funds for the given payment intent.

### confirmPaymentIntent

**Signature:** `static confirmPaymentIntent(order : Order, paymentMethod : SalesforcePaymentMethod, paymentIntentProperties : Object) : Status`

Confirms a new payment intent using the given payment method, and associates it with the given order.

### createPaymentIntent

**Signature:** `static createPaymentIntent(basket : Basket, shipment : Shipment, zoneId : String, amount : Money, stripeCustomerRequired : boolean, paymentIntentProperties : Object) : Status`

Creates a payment intent using the given information, and associates it with the given basket.

### detachPaymentMethod

**Signature:** `static detachPaymentMethod(paymentMethod : SalesforcePaymentMethod) : void`

Detaches the given payment method from its associated customer.

### getAttachedPaymentMethods

**Signature:** `static getAttachedPaymentMethods(customer : Customer) : Collection`

Returns a collection containing the payment methods attached to the given customer.

### getOffSessionPaymentMethods

**Signature:** `static getOffSessionPaymentMethods(customer : Customer) : Collection`

Returns a collection containing the payment methods for the given customer set up for future off session reuse.

### getPaymentDetails

**Signature:** `static getPaymentDetails(paymentInstrument : OrderPaymentInstrument) : SalesforcePaymentDetails`

Returns the details to the Salesforce Payments payment associated with the given payment instrument, or null if the given payment instrument has none.

### getPaymentIntent

**Signature:** `static getPaymentIntent(basket : Basket) : SalesforcePaymentIntent`

Returns the payment intent for the given basket, or null if the given basket has none.

### getPaymentIntent

**Signature:** `static getPaymentIntent(order : Order) : SalesforcePaymentIntent`

Returns the payment intent for the given order, or null if the given order has none.

### getPaymentsSiteConfig

**Signature:** `static getPaymentsSiteConfig() : SalesforcePaymentsSiteConfiguration`

Returns a payments site configuration object for the current site.

### getPayPalOrder

**Signature:** `static getPayPalOrder(basket : Basket) : SalesforcePayPalOrder`

Returns the PayPal order for the given basket, or null if the given basket has none.

### getPayPalOrder

**Signature:** `static getPayPalOrder(order : Order) : SalesforcePayPalOrder`

Returns the PayPal order for the given order, or null if the given order has none.

### getSavedPaymentMethods

**Signature:** `static getSavedPaymentMethods(customer : Customer) : Collection`

Returns a collection containing the payment methods saved to be presented to the given customer for reuse in checkouts.

### onCustomerRegistered

**Signature:** `static onCustomerRegistered(order : Order) : void`

Handles the account registration of the shopper who placed the given order.

### refundPaymentIntent

**Signature:** `static refundPaymentIntent(paymentIntent : SalesforcePaymentIntent, amount : Money, refundProperties : Object) : Status`

Refunds previously captured funds for the given payment intent.

### removeSavedPaymentMethod

**Signature:** `static removeSavedPaymentMethod(paymentMethod : SalesforcePaymentMethod) : void`

Removes the given saved payment method so that it is no longer presented to the given customer for reuse in checkouts.

### savePaymentMethod

**Signature:** `static savePaymentMethod(customer : Customer, paymentMethod : SalesforcePaymentMethod) : void`

Saves the given payment method to be presented to the given customer for reuse in subsequent checkouts.

### setPaymentDetails

**Signature:** `static setPaymentDetails(paymentInstrument : OrderPaymentInstrument, paymentDetails : SalesforcePaymentDetails) : void`

Sets the details to the Salesforce Payments payment associated with the given payment instrument.

### updatePaymentIntent

**Signature:** `static updatePaymentIntent(paymentIntent : SalesforcePaymentIntent, shipment : Shipment, amount : Money, orderNo : String, paymentIntentProperties : Object) : Status`

Updates the provided information in the given payment intent.

## Method Detail

## Method Details

### attachPaymentMethod

**Signature:** `static attachPaymentMethod(paymentMethod : SalesforcePaymentMethod, customer : Customer) : void`

**Description:** Attaches the given payment method to the given customer. Use this method to attach a payment method of type SalesforcePaymentMethod.TYPE_CARD to a shopper who registers as a customer after placing an order, and has affirmatively elected to save their card as part of the registration process. This method will throw an error if passed incompatible payment method and/or customer objects.

**Deprecated:**

use onCustomerRegistered(Order) and savePaymentMethod(Customer, SalesforcePaymentMethod)

**Parameters:**

- `paymentMethod`: payment method to attach to customer
- `customer`: customer whose payment method to attach

**Throws:**

Exception - if there was an error attaching the payment method to the customer

---

### cancelPaymentIntent

**Signature:** `static cancelPaymentIntent(paymentIntent : SalesforcePaymentIntent, paymentIntentProperties : Object) : Status`

**Description:** Cancels the given payment intent. If a payment authorization has been made for the payment intent, the authorization is removed. The payment intent must be in a status that supports cancel. See the Stripe documentation for more details. The following Payment Intent property is supported: cancellationReason - optional payment intent cancellation reason

**Parameters:**

- `paymentIntent`: payment intent to capture
- `paymentIntentProperties`: additional properties to pass to the create Payment Intent API

**Returns:**

Status 'OK' or 'ERROR'. Status detail 'paymentintent' contains the payment intent, if it is available in the Stripe response. Status detail 'error' contains the Stripe error information, if it is available in the response.

**See Also:**

CANCELLATION_REASON_ABANDONED
CANCELLATION_REASON_DUPLICATE
CANCELLATION_REASON_FRAUDULENT
CANCELLATION_REASON_REQUESTED_BY_CUSTOMER

**Throws:**

Exception - if there was an error canceling the payment intent

---

### capturePaymentIntent

**Signature:** `static capturePaymentIntent(paymentIntent : SalesforcePaymentIntent, amount : Money) : Status`

**Description:** Captures funds for the given payment intent. The payment intent must be in a status that supports capture. See the Stripe documentation for more details. If amount is not specified, the default is the full amount available to capture. If specified, the amount must be less than or equal to the amount available to capture.

**Parameters:**

- `paymentIntent`: payment intent to capture
- `amount`: optional amount to capture, defaults to amount available to capture

**Returns:**

Status 'OK' or 'ERROR'. Status detail 'error' contains the Stripe error information, if it is available in the response.

**Throws:**

Exception - if there was an error capturing the payment intent

---

### confirmPaymentIntent

**Signature:** `static confirmPaymentIntent(order : Order, paymentMethod : SalesforcePaymentMethod, paymentIntentProperties : Object) : Status`

**Description:** Confirms a new payment intent using the given payment method, and associates it with the given order. The order must be prepared to contain products, shipments, and any other necessary data, and must be calculated to reflect the correct total amounts. If the order is not for the same Customer as the given payment method, an error is thrown. The specified payment method must be set up for off session future use or an error is thrown. iDeal and Bancontact implement reuse differently than other payment methods, but they can't be reused themselves. The following Payment Intent properties are supported: statementDescriptor - optional statement descriptor cardCaptureAutomatic - optional true if the credit card payment should be automatically captured at the time of the sale, or false if the credit card payment should be captured later If cardCaptureAutomatic is provided it is used to determine card capture timing, and otherwise the default card capture timing set for the site is used. If statementDescriptor is provided it is used as the complete description that appears on your customers' statements for the payment, and if not a default statement descriptor is used. If a default statement descriptor is set for the site it is used as the default, and otherwise the default statement descriptor for the account will apply.

**Parameters:**

- `order`: order to pay using Salesforce Payments
- `paymentMethod`: payment method to use to pay
- `paymentIntentProperties`: additional properties to pass to the create Payment Intent API

**Returns:**

Status 'OK' or 'ERROR'. Status detail 'paymentintent' contains the payment intent, if it is available in the Stripe response. Status detail 'error' contains the Stripe error information, if it is available in the response.

**Throws:**

Exception - if the parameter validation failed or there's an error confirming the payment intent

---

### createPaymentIntent

**Signature:** `static createPaymentIntent(basket : Basket, shipment : Shipment, zoneId : String, amount : Money, stripeCustomerRequired : boolean, paymentIntentProperties : Object) : Status`

**Description:** Creates a payment intent using the given information, and associates it with the given basket. The following Payment Intent properties are supported: type - required payment method type, such as SalesforcePaymentMethod.TYPE_CARD statementDescriptor - optional statement descriptor cardCaptureAutomatic - optional true if the credit card payment should be automatically captured at the time of the sale, or false if the credit card payment should be captured later The stripeCustomerRequired must be set to true if the payment will be set up for future usage, whether on session or off session. If true then if a Stripe Customer is associated with the shopper then it will be used, and otherwise a new Stripe Customer will be created. The new Stripe Customer will be associated with the shopper if logged into a registered customer account for the site. If cardCaptureAutomatic is provided it is used to determine card capture timing, and otherwise the default card capture timing set for the site is used. If statementDescriptor is provided it is used as the complete description that appears on your customers' statements for the payment, and if not a default statement descriptor is used. If a default statement descriptor is set for the site it is used as the default, and otherwise the default statement descriptor for the account will apply.

**Parameters:**

- `basket`: basket to checkout and pay using Salesforce Payments
- `shipment`: shipment to use for shipping information in the payment intent
- `zoneId`: id of the payment zone
- `amount`: payment amount
- `stripeCustomerRequired`: true if a Stripe Customer must be associated with the payment intent, and would be created if it doesn't already exist, or false if a Stripe Customer does not have to be associated with the payment intent
- `paymentIntentProperties`: properties to pass to the create Payment Intent API

**Returns:**

Status 'OK' or 'ERROR'. Status detail 'paymentintent' contains the payment intent, if it is available in the Stripe response. Status detail 'error' contains the Stripe error information, if it is available in the response.

---

### detachPaymentMethod

**Signature:** `static detachPaymentMethod(paymentMethod : SalesforcePaymentMethod) : void`

**Description:** Detaches the given payment method from its associated customer. Once detached the payment method remains associated with payment intents in the payment account, but is no longer saved for use by the customer in future orders.

**Deprecated:**

use removeSavedPaymentMethod(SalesforcePaymentMethod)

**Parameters:**

- `paymentMethod`: payment method to detach from customer

**Throws:**

Exception - if there was an error detaching the payment method from its customer

---

### getAttachedPaymentMethods

**Signature:** `static getAttachedPaymentMethods(customer : Customer) : Collection`

**Description:** Returns a collection containing the payment methods attached to the given customer. The collection will be empty if there are no payment methods attached to the customer, or there was an error retrieving the attached payment methods.

**Deprecated:**

use getSavedPaymentMethods(Customer)

**Parameters:**

- `customer`: customer whose payment methods to get

**Returns:**

collection of attached payment methods

**Throws:**

Exception - if the given customer is null or undefined

---

### getOffSessionPaymentMethods

**Signature:** `static getOffSessionPaymentMethods(customer : Customer) : Collection`

**Description:** Returns a collection containing the payment methods for the given customer set up for future off session reuse. The collection will be empty if there are no off session payment methods for the customer, or there was an error retrieving the off session payment methods.

**Parameters:**

- `customer`: customer whose off session payment methods to get

**Returns:**

collection of off session payment methods

**Throws:**

Exception - if the given customer is null or undefined, or there is an error getting the off session payment methods

---

### getPaymentDetails

**Signature:** `static getPaymentDetails(paymentInstrument : OrderPaymentInstrument) : SalesforcePaymentDetails`

**Description:** Returns the details to the Salesforce Payments payment associated with the given payment instrument, or null if the given payment instrument has none.

**Parameters:**

- `paymentInstrument`: payment instrument

**Returns:**

The payment details

**Throws:**

Exception - if paymentInstrument is null

---

### getPaymentIntent

**Signature:** `static getPaymentIntent(basket : Basket) : SalesforcePaymentIntent`

**Description:** Returns the payment intent for the given basket, or null if the given basket has none.

**Parameters:**

- `basket`: basket to checkout and pay using Salesforce Payments

**Returns:**

The payment intent

**Throws:**

Exception - if there was an error retrieving the payment intent for the basket

---

### getPaymentIntent

**Signature:** `static getPaymentIntent(order : Order) : SalesforcePaymentIntent`

**Description:** Returns the payment intent for the given order, or null if the given order has none.

**Parameters:**

- `order`: order paid using Salesforce Payments

**Returns:**

The payment intent

**Throws:**

Exception - if there was an error retrieving the payment intent for the order

---

### getPaymentsSiteConfig

**Signature:** `static getPaymentsSiteConfig() : SalesforcePaymentsSiteConfiguration`

**Description:** Returns a payments site configuration object for the current site.

**Returns:**

a payments site configuration or null if no payments site configuration found

**Throws:**

Exception - if there is no current site

---

### getPayPalOrder

**Signature:** `static getPayPalOrder(basket : Basket) : SalesforcePayPalOrder`

**Description:** Returns the PayPal order for the given basket, or null if the given basket has none.

**Parameters:**

- `basket`: basket to checkout and pay using Salesforce Payments

**Returns:**

The PayPal order

**Throws:**

Exception - if there was an error retrieving the PayPal order for the basket

---

### getPayPalOrder

**Signature:** `static getPayPalOrder(order : Order) : SalesforcePayPalOrder`

**Description:** Returns the PayPal order for the given order, or null if the given order has none.

**Parameters:**

- `order`: order paid using Salesforce Payments

**Returns:**

The PayPal order

**Throws:**

Exception - if there was an error retrieving the PayPal order for the order

---

### getSavedPaymentMethods

**Signature:** `static getSavedPaymentMethods(customer : Customer) : Collection`

**Description:** Returns a collection containing the payment methods saved to be presented to the given customer for reuse in checkouts. The collection will be empty if there are no payment methods saved for the customer, or there was an error retrieving the saved payment methods.

**Parameters:**

- `customer`: customer whose saved payment methods to get

**Returns:**

collection of saved payment methods

**Throws:**

Exception - if the given customer is null or undefined, or there is an error getting the saved payment methods

---

### onCustomerRegistered

**Signature:** `static onCustomerRegistered(order : Order) : void`

**Description:** Handles the account registration of the shopper who placed the given order. Use this method to ensure the registered customer profile is associated with the order in Salesforce Payments.

**Parameters:**

- `order`: order paid using Salesforce Payments

**Throws:**

Exception - if there was an error attaching the payment method to the customer

---

### refundPaymentIntent

**Signature:** `static refundPaymentIntent(paymentIntent : SalesforcePaymentIntent, amount : Money, refundProperties : Object) : Status`

**Description:** Refunds previously captured funds for the given payment intent. The payment intent must be in a state that supports refund. This includes its status as well as any previous refunds. See the Stripe documentation for more details. The following Payment Intent property is supported: reason - optional payment intent refund reason If amount is not specified, the default is the full amount available to refund. If specified, the amount must be less than or equal to the amount available to refund.

**Parameters:**

- `paymentIntent`: payment intent to refund
- `amount`: optional amount to refund, defaults to amount previously captured
- `refundProperties`: additional properties to pass to the refund API

**Returns:**

Status 'OK' or 'ERROR'. Status detail 'error' contains the Stripe error information, if it is available in the response.

**See Also:**

REFUND_REASON_DUPLICATE
REFUND_REASON_FRAUDULENT
REFUND_REASON_REQUESTED_BY_CUSTOMER

**Throws:**

Exception - if there was an error refunding the payment intent

---

### removeSavedPaymentMethod

**Signature:** `static removeSavedPaymentMethod(paymentMethod : SalesforcePaymentMethod) : void`

**Description:** Removes the given saved payment method so that it is no longer presented to the given customer for reuse in checkouts. The payment method remains in the payment account, but is no longer saved for use by the customer.

**Parameters:**

- `paymentMethod`: payment method to detach from customer

**Throws:**

Exception - if there was an error removing the saved payment method from its customer

---

### savePaymentMethod

**Signature:** `static savePaymentMethod(customer : Customer, paymentMethod : SalesforcePaymentMethod) : void`

**Description:** Saves the given payment method to be presented to the given customer for reuse in subsequent checkouts. This method will throw an error if passed incompatible payment method and/or customer objects.

**Parameters:**

- `customer`: customer for which to save the payment method
- `paymentMethod`: payment method to save for the customer

**Throws:**

Exception - if there was an error saving the payment method for the customer

---

### setPaymentDetails

**Signature:** `static setPaymentDetails(paymentInstrument : OrderPaymentInstrument, paymentDetails : SalesforcePaymentDetails) : void`

**Description:** Sets the details to the Salesforce Payments payment associated with the given payment instrument.

**Parameters:**

- `paymentInstrument`: payment instrument
- `paymentDetails`: payment details

**See Also:**

SalesforcePaymentMethod.getPaymentDetails(OrderPaymentInstrument)
SalesforcePayPalOrder.getPaymentDetails(OrderPaymentInstrument)

**Throws:**

Exception - if either paymentInstrument or paymentDetails is null

---

### updatePaymentIntent

**Signature:** `static updatePaymentIntent(paymentIntent : SalesforcePaymentIntent, shipment : Shipment, amount : Money, orderNo : String, paymentIntentProperties : Object) : Status`

**Description:** Updates the provided information in the given payment intent. The payment intent must be in a status that supports update. See the Stripe documentation for more details. The following Payment Intent properties are supported: statementDescriptor - optional statement descriptor cardCaptureAutomatic - optional true if the credit card payment should be automatically captured at the time of the sale, or false if the credit card payment should be captured later If cardCaptureAutomatic is provided it is used to determine card capture timing, and otherwise the default card capture timing set for the site is used. If statementDescriptor is provided it is used as the complete description that appears on your customers' statements for the payment, and if not a default statement descriptor is used. If a default statement descriptor is set for the site it is used as the default, and otherwise the default statement descriptor for the account will apply.

**Parameters:**

- `paymentIntent`: payment intent to update
- `shipment`: optional shipment to use to update shipping information in the payment intent
- `amount`: optional new payment amount
- `orderNo`: optional order no of Order to associate with the payment intent in metadata
- `paymentIntentProperties`: optional additional properties to pass to the update Payment Intent API

**Returns:**

Status 'OK' or 'ERROR'. Status detail 'paymentintent' contains the payment intent, if it is available in the Stripe response. Status detail 'error' contains the Stripe error information, if it is available in the response.

**Throws:**

Exception - if the parameter validation failed or there's an error updating the payment intent

---