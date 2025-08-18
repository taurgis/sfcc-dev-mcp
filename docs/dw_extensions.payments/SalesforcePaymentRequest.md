## Package: dw.extensions.payments

# Class SalesforcePaymentRequest

## Inheritance Hierarchy

- Object
  - dw.extensions.payments.SalesforcePaymentRequest

## Description

Salesforce Payments request for a shopper to make payment. See Salesforce Payments documentation for how to gain access and configure it for use on your sites. A request is required to render payment methods and/or express checkout buttons using <ispayment> or <isbuynow>. You can call methods on the payment request to configure which payment methods and/or express checkout buttons may be presented, and customize their visual presentation. When used with <isbuynow> you must provide the necessary data to prepare the shopper basket to buy the product, and the necessary payment request options for the browser payment app.

## Constants

### ELEMENT_AFTERPAY_CLEARPAY_MESSAGE

**Type:** String = "afterpayClearpayMessage"

Element for the Stripe Afterpay/Clearpay message "afterpayClearpayMessage".

### ELEMENT_CARD_CVC

**Type:** String = "cardCvc"

Element for the Stripe credit card CVC field "cardCvc".

### ELEMENT_CARD_EXPIRY

**Type:** String = "cardExpiry"

Element for the Stripe credit card expiration date field "cardExpiry".

### ELEMENT_CARD_NUMBER

**Type:** String = "cardNumber"

Element for the Stripe credit card number field "cardNumber".

### ELEMENT_EPS_BANK

**Type:** String = "epsBank"

Element for the Stripe EPS bank selection field "epsBank".

### ELEMENT_IBAN

**Type:** String = "iban"

Element for the Stripe IBAN field "iban".

### ELEMENT_IDEAL_BANK

**Type:** String = "idealBank"

Element for the Stripe iDEAL bank selection field "idealBank".

### ELEMENT_PAYMENT_REQUEST_BUTTON

**Type:** String = "paymentRequestButton"

Element for the Stripe payment request button "paymentRequestButton".

### ELEMENT_TYPE_AFTERPAY_CLEARPAY

**Type:** String = "afterpay_clearpay"

Element type name for Afterpay.

### ELEMENT_TYPE_AFTERPAY_CLEARPAY_MESSAGE

**Type:** String = "afterpayclearpaymessage"

Element type name for Afterpay/Clearpay message.

### ELEMENT_TYPE_APPLEPAY

**Type:** String = "applepay"

Element type name for Apple Pay payment request buttons.

### ELEMENT_TYPE_BANCONTACT

**Type:** String = "bancontact"

Element type name for Bancontact.

### ELEMENT_TYPE_CARD

**Type:** String = "card"

Element type name for credit cards.

### ELEMENT_TYPE_EPS

**Type:** String = "eps"

Element type name for EPS.

### ELEMENT_TYPE_IDEAL

**Type:** String = "ideal"

Element type name for iDEAL.

### ELEMENT_TYPE_PAYMENTREQUEST

**Type:** String = "paymentrequest"

Element type name for other payment request buttons besides Apple Pay, like Google Pay.

### ELEMENT_TYPE_PAYPAL

**Type:** String = "paypal"

Element type name for PayPal in multi-step checkout.

### ELEMENT_TYPE_PAYPAL_EXPRESS

**Type:** String = "paypalexpress"

Element type name for PayPal in express checkout.

### ELEMENT_TYPE_PAYPAL_MESSAGE

**Type:** String = "paypalmessage"

Element type name for the PayPal messages component.

### ELEMENT_TYPE_SEPA_DEBIT

**Type:** String = "sepa_debit"

Element type name for SEPA debit.

### ELEMENT_TYPE_VENMO

**Type:** String = "venmo"

Element type name for Venmo in multi-step checkout.

### ELEMENT_TYPE_VENMO_EXPRESS

**Type:** String = "venmoexpress"

Element type name for Venmo in express checkout.

### PAYPAL_SHIPPING_PREFERENCE_GET_FROM_FILE

**Type:** String = "GET_FROM_FILE"

PayPal application context shipping_preference value "GET_FROM_FILE", to use the customer-provided shipping address on the PayPal site.

### PAYPAL_SHIPPING_PREFERENCE_NO_SHIPPING

**Type:** String = "NO_SHIPPING"

PayPal application context shipping_preference value "NO_SHIPPING", to redact the shipping address from the PayPal site. Recommended for digital goods.

### PAYPAL_SHIPPING_PREFERENCE_SET_PROVIDED_ADDRESS

**Type:** String = "SET_PROVIDED_ADDRESS"

PayPal application context shipping_preference value "SET_PROVIDED_ADDRESS", to use the merchant-provided address. The customer cannot change this address on the PayPal site.

### PAYPAL_USER_ACTION_CONTINUE

**Type:** String = "CONTINUE"

PayPal application context user_action value "CONTINUE". Use this option when the final amount is not known when the checkout flow is initiated and you want to redirect the customer to the merchant page without processing the payment.

### PAYPAL_USER_ACTION_PAY_NOW

**Type:** String = "PAY_NOW"

PayPal application context user_action value "PAY_NOW". Use this option when the final amount is known when the checkout is initiated and you want to process the payment immediately when the customer clicks Pay Now.

## Properties

### basketData

**Type:** Object

A JS object containing the data used to prepare the shopper basket when a Buy Now button is tapped.

### billingDetails

**Type:** Object

A JS object containing the billing details to use when a Stripe PaymentMethod is created.

### cardCaptureAutomatic

**Type:** boolean

Returns true if the credit card payment should be automatically captured at the time of the sale, or
 false if the credit card payment should be captured later.

### exclude

**Type:** Set (Read Only)

Returns a set containing the element types to be explicitly excluded from mounted components. See the element
 type constants in this class for the full list of supported element types.
 
 
 Note: if an element type is both explicitly included and excluded, it will not be presented.

### ID

**Type:** String (Read Only)

The identifier of this payment request.

### include

**Type:** Set (Read Only)

Returns a set containing the specific element types to include in mounted components. If the set is
 empty then all applicable and enabled element types will be included by default. See the element type constants
 in this class for the full list of supported element types.
 
 
 Note: if an element type is both explicitly included and excluded, it will not be presented.

### selector

**Type:** String (Read Only)

The DOM element selector where to mount payment methods and/or express checkout buttons.

### setupFutureUsage

**Type:** boolean

Returns true if the payment method should be always saved for future use off session, or
 false if the payment method should be only saved for future use on session when appropriate.

### statementDescriptor

**Type:** String

The complete description that appears on your customers' statements for payments made by this request, or
 null if the default statement descriptor for your account will be used.

## Constructor Summary

SalesforcePaymentRequest(id : String, selector : String) Constructs a payment request using the given identifiers.

## Method Summary

### addExclude

**Signature:** `addExclude(elementType : String) : void`

Adds the given element type to explicitly exclude from mounted components.

### addInclude

**Signature:** `addInclude(elementType : String) : void`

Adds the given element type to include in mounted components.

### calculatePaymentRequestOptions

**Signature:** `static calculatePaymentRequestOptions(basket : Basket, options : Object) : Object`

Returns a JS object containing the payment request options to use when a Pay Now button is tapped, in the appropriate format for use in client side JavaScript, with data calculated from the given basket.

### format

**Signature:** `static format(options : Object) : Object`

Returns a JS object containing the payment request options to use when a Buy Now button is tapped, in the appropriate format for use in client side JavaScript.

### getBasketData

**Signature:** `getBasketData() : Object`

Returns a JS object containing the data used to prepare the shopper basket when a Buy Now button is tapped.

### getBillingDetails

**Signature:** `getBillingDetails() : Object`

Returns a JS object containing the billing details to use when a Stripe PaymentMethod is created.

### getCardCaptureAutomatic

**Signature:** `getCardCaptureAutomatic() : boolean`

Returns true if the credit card payment should be automatically captured at the time of the sale, or false if the credit card payment should be captured later.

### getExclude

**Signature:** `getExclude() : Set`

Returns a set containing the element types to be explicitly excluded from mounted components.

### getID

**Signature:** `getID() : String`

Returns the identifier of this payment request.

### getInclude

**Signature:** `getInclude() : Set`

Returns a set containing the specific element types to include in mounted components.

### getSelector

**Signature:** `getSelector() : String`

Returns the DOM element selector where to mount payment methods and/or express checkout buttons.

### getSetupFutureUsage

**Signature:** `getSetupFutureUsage() : boolean`

Returns true if the payment method should be always saved for future use off session, or false if the payment method should be only saved for future use on session when appropriate.

### getStatementDescriptor

**Signature:** `getStatementDescriptor() : String`

Returns the complete description that appears on your customers' statements for payments made by this request, or null if the default statement descriptor for your account will be used.

### setBasketData

**Signature:** `setBasketData(basketData : Object) : void`

Sets the data used to prepare the shopper basket when a Buy Now button is tapped.

### setBillingDetails

**Signature:** `setBillingDetails(billingDetails : Object) : void`

Sets the billing details to use when a Stripe PaymentMethod is created.

### setCardCaptureAutomatic

**Signature:** `setCardCaptureAutomatic(cardCaptureAutomatic : boolean) : void`

Sets if the credit card payment should be automatically captured at the time of the sale.

### setOptions

**Signature:** `setOptions(options : Object) : void`

Sets the payment request options to use when a Buy Now button is tapped.

### setPayPalButtonsOptions

**Signature:** `setPayPalButtonsOptions(options : Object) : void`

Sets the the options to pass into the paypal.Buttons call.

### setPayPalShippingPreference

**Signature:** `setPayPalShippingPreference(shippingPreference : String) : void`

Sets the PayPal order application context shipping_preference value.

### setPayPalUserAction

**Signature:** `setPayPalUserAction(userAction : String) : void`

Sets the PayPal order application context user_action value.

### setReturnController

**Signature:** `setReturnController(returnController : String) : void`

Sets the controller to which to redirect when the shopper returns from a 3rd party payment website.

### setSavePaymentMethodEnabled

**Signature:** `setSavePaymentMethodEnabled(savePaymentMethodEnabled : boolean) : void`

Sets if mounted components may provide a control for the shopper to save their payment method for later use.

### setSetupFutureUsage

**Signature:** `setSetupFutureUsage(setupFutureUsage : boolean) : void`

Sets if the payment method should be always saved for future use off session.

### setStatementDescriptor

**Signature:** `setStatementDescriptor(statementDescriptor : String) : void`

Sets the complete description that appears on your customers' statements for payments made by this request.

### setStripeCreateElementOptions

**Signature:** `setStripeCreateElementOptions(element : String, options : Object) : void`

Sets the the options to pass into the Stripe elements.create call for the given element type.

### setStripeElementsOptions

**Signature:** `setStripeElementsOptions(options : Object) : void`

Sets the the options to pass into the stripe.elements call.

## Constructor Detail

## Method Detail

## Method Details

### addExclude

**Signature:** `addExclude(elementType : String) : void`

**Description:** Adds the given element type to explicitly exclude from mounted components. It is not necessary to explicitly exclude element types that are not enabled for the site, or are not applicable for the current shopper and/or their basket. See the element type constants in this class for the full list of supported element types. Note: if an element type is both explicitly included and excluded, it will not be presented.

**Parameters:**

- `elementType`: element type

**See Also:**

getExclude()

---

### addInclude

**Signature:** `addInclude(elementType : String) : void`

**Description:** Adds the given element type to include in mounted components. Call this method to include only a specific list of element types to be presented when applicable and enabled for the site. See the element type constants in this class for the full list of supported element types. Note: if an element type is both explicitly included and excluded, it will not be presented.

**Parameters:**

- `elementType`: element type

**See Also:**

getInclude()

---

### calculatePaymentRequestOptions

**Signature:** `static calculatePaymentRequestOptions(basket : Basket, options : Object) : Object`

**Description:** Returns a JS object containing the payment request options to use when a Pay Now button is tapped, in the appropriate format for use in client side JavaScript, with data calculated from the given basket. This method is provided as a convenience to calculate updated payment request options when the shopper basket has changed. Data in the given options object like total, displayItems, and shippingOptions will be replaced in the returned object by values recalculated from the given basket and applicable shipping methods. The following example shows the resulting output for a basket and sample options. SalesforcePaymentRequest.calculatePaymentRequestOptions(basket, { requestPayerName: true, requestPayerEmail: true, requestPayerPhone: false, requestShipping: true }); returns { currency: 'gbp', total: { label: 'Total', amount: '2644' }, displayItems: [{ label: 'Subtotal', amount: '1919' }, { label: 'Tax', amount: '126' }, { label: 'Ground', amount: '599' }], requestPayerName: true, requestPayerEmail: true, requestPayerPhone: false, requestShipping: true, shippingOptions: [{ id: 'GBP001', label: 'Ground', detail: 'Order received within 7-10 business days', amount: '599' },{ id: 'GBP002', label: 'Express', detail: 'Order received within 2-4 business days', amount: '999' }] }

**Parameters:**

- `basket`: No Comment In JavaDoc
- `options`: JS object containing payment request options in B2C Commerce API standard format

**Returns:**

JS object containing equivalent payment request options in Stripe JS API format

---

### format

**Signature:** `static format(options : Object) : Object`

**Description:** Returns a JS object containing the payment request options to use when a Buy Now button is tapped, in the appropriate format for use in client side JavaScript. This method is provided as a convenience to adjust values in B2C Commerce API standard formats to their equivalents as expected by Stripe JS APIs. The following example shows options set in B2C Commerce API format, and the resulting output. SalesforcePaymentRequest.format({ currency: 'GBP', total: { label: 'Total', amount: '26.44' }, displayItems: [{ label: 'Subtotal', amount: '19.19' }, { label: 'Tax', amount: '1.26' }, { label: 'Ground', amount: '5.99' }], requestPayerPhone: false, shippingOptions: [{ id: 'GBP001', label: 'Ground', detail: 'Order received within 7-10 business days', amount: '5.99' }] }); returns { currency: 'gbp', total: { label: 'Total', amount: '2644' }, displayItems: [{ label: 'Subtotal', amount: '1919' }, { label: 'Tax', amount: '126' }, { label: 'Ground', amount: '599' }], requestPayerPhone: false, shippingOptions: [{ id: 'GBP001', label: 'Ground', detail: 'Order received within 7-10 business days', amount: '599' }] }

**Parameters:**

- `options`: JS object containing payment request options in B2C Commerce API standard format

**Returns:**

JS object containing equivalent payment request options in Stripe JS API format

---

### getBasketData

**Signature:** `getBasketData() : Object`

**Description:** Returns a JS object containing the data used to prepare the shopper basket when a Buy Now button is tapped.

**Returns:**

JS object containing the basket data

**See Also:**

setBasketData(Object)

---

### getBillingDetails

**Signature:** `getBillingDetails() : Object`

**Description:** Returns a JS object containing the billing details to use when a Stripe PaymentMethod is created.

**Returns:**

JS object containing the billing details

**See Also:**

setBillingDetails(Object)

---

### getCardCaptureAutomatic

**Signature:** `getCardCaptureAutomatic() : boolean`

**Description:** Returns true if the credit card payment should be automatically captured at the time of the sale, or false if the credit card payment should be captured later.

**Returns:**

true if the credit card payment should be automatically captured at the time of the sale, false if the credit card payment should be captured later.

---

### getExclude

**Signature:** `getExclude() : Set`

**Description:** Returns a set containing the element types to be explicitly excluded from mounted components. See the element type constants in this class for the full list of supported element types. Note: if an element type is both explicitly included and excluded, it will not be presented.

**Returns:**

set of element types

**See Also:**

addExclude(String)

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the identifier of this payment request.

**Returns:**

payment request identifier

---

### getInclude

**Signature:** `getInclude() : Set`

**Description:** Returns a set containing the specific element types to include in mounted components. If the set is empty then all applicable and enabled element types will be included by default. See the element type constants in this class for the full list of supported element types. Note: if an element type is both explicitly included and excluded, it will not be presented.

**Returns:**

set of element types

**See Also:**

addInclude(String)

---

### getSelector

**Signature:** `getSelector() : String`

**Description:** Returns the DOM element selector where to mount payment methods and/or express checkout buttons.

**Returns:**

DOM element selector

---

### getSetupFutureUsage

**Signature:** `getSetupFutureUsage() : boolean`

**Description:** Returns true if the payment method should be always saved for future use off session, or false if the payment method should be only saved for future use on session when appropriate.

**Returns:**

true if the payment method should be always saved for future use off session, false if the payment method should be only saved for future use on session when appropriate.

---

### getStatementDescriptor

**Signature:** `getStatementDescriptor() : String`

**Description:** Returns the complete description that appears on your customers' statements for payments made by this request, or null if the default statement descriptor for your account will be used.

**Returns:**

statement descriptor for payments made by this request, or null if the account default will be used

---

### setBasketData

**Signature:** `setBasketData(basketData : Object) : void`

**Description:** Sets the data used to prepare the shopper basket when a Buy Now button is tapped. For convenience this method accepts a JS object to set all of the following properties at once: sku - SKU of the product to add exclusively to the basket (required) quantity - integer quantity of the product, default is 1 shippingMethod - ID of the shipping method to set on the shipment, default is the site default shipping method for the basket currency options - JS array containing one JS object per selected product option, default is no selected options id - product option ID valueId - product option value ID The following example shows how to set all of the supported basket data. request.setBasketData({ sku: 'tv-pdp-6010fdM', quantity: 1, shippingMethod: '001', options: [{ id: 'tvWarranty', valueId: '000' }] });

**Parameters:**

- `basketData`: JS object containing the basket data

**See Also:**

getBasketData()

---

### setBillingDetails

**Signature:** `setBillingDetails(billingDetails : Object) : void`

**Description:** Sets the billing details to use when a Stripe PaymentMethod is created. For convenience this method accepts a JS object to set all details at once. The following example shows how to set details including address. request.setBillingDetails({ address: { city: 'Wien', country: 'AT', line1: 'Opernring 2', postal_code: '1010' }, email: 'jhummel@salesforce.com', name: 'Johann Hummel' }); For more information on the available billing details see the Stripe create PaymentMethod API documentation.

**Parameters:**

- `billingDetails`: JS object containing the billing details

---

### setCardCaptureAutomatic

**Signature:** `setCardCaptureAutomatic(cardCaptureAutomatic : boolean) : void`

**Description:** Sets if the credit card payment should be automatically captured at the time of the sale.

**Parameters:**

- `cardCaptureAutomatic`: true if the credit card payment should be automatically captured at the time of the sale, or false if the credit card payment should be captured later.

---

### setOptions

**Signature:** `setOptions(options : Object) : void`

**Description:** Sets the payment request options to use when a Buy Now button is tapped. For convenience this method accepts a JS object to set all options at once. The following example shows how to set options including currency, labels, and amounts, in B2C Commerce API format. request.setOptions({ currency: 'GBP', total: { label: 'Total', amount: '26.44' }, displayItems: [{ label: 'Subtotal', amount: '19.19' }, { label: 'Tax', amount: '1.26' }, { label: 'Ground', amount: '5.99' }], requestPayerPhone: false, shippingOptions: [{ id: 'GBP001', label: 'Ground', detail: 'Order received within 7-10 business days', amount: '5.99' }] }); The total option must match the total that will result from preparing the shopper basket using the data provided to setBasketData(Object) in this request. The id of each JS object in the shippingOptions array must equal the ID of the corresponding site shipping method that the shopper may select in the browser payment app. For more information on the available payment request options see the Stripe Payment Request object API documentation. Note: The Stripe Payment Request country option will be set automatically to the country of the Salesforce Payments account associated with the Commerce Cloud instance and is not included here.

**Parameters:**

- `options`: JS object containing the payment request options

---

### setPayPalButtonsOptions

**Signature:** `setPayPalButtonsOptions(options : Object) : void`

**Description:** Sets the the options to pass into the paypal.Buttons call. For more information see the PayPal Buttons API documentation.

**Parameters:**

- `options`: JS object containing the options

---

### setPayPalShippingPreference

**Signature:** `setPayPalShippingPreference(shippingPreference : String) : void`

**Description:** Sets the PayPal order application context shipping_preference value. For more information see the PayPal Orders API documentation.

**Parameters:**

- `shippingPreference`: constant indicating the shipping preference

**See Also:**

PAYPAL_SHIPPING_PREFERENCE_GET_FROM_FILE
PAYPAL_SHIPPING_PREFERENCE_NO_SHIPPING
PAYPAL_SHIPPING_PREFERENCE_SET_PROVIDED_ADDRESS

---

### setPayPalUserAction

**Signature:** `setPayPalUserAction(userAction : String) : void`

**Description:** Sets the PayPal order application context user_action value. For more information see the PayPal Orders API documentation.

**Parameters:**

- `userAction`: constant indicating the user action

**See Also:**

PAYPAL_USER_ACTION_CONTINUE
PAYPAL_USER_ACTION_PAY_NOW

---

### setReturnController

**Signature:** `setReturnController(returnController : String) : void`

**Description:** Sets the controller to which to redirect when the shopper returns from a 3rd party payment website. Default is the controller for the current page.

**Parameters:**

- `returnController`: return controller, such as "Cart-Show"

---

### setSavePaymentMethodEnabled

**Signature:** `setSavePaymentMethodEnabled(savePaymentMethodEnabled : boolean) : void`

**Description:** Sets if mounted components may provide a control for the shopper to save their payment method for later use. When set to false no control will be provided. When set to true a control may be provided, if applicable for the shopper and presented payment method, but is not guaranteed.

**Parameters:**

- `savePaymentMethodEnabled`: if mounted components may provide a control for the shopper to save their payment method

---

### setSetupFutureUsage

**Signature:** `setSetupFutureUsage(setupFutureUsage : boolean) : void`

**Description:** Sets if the payment method should be always saved for future use off session.

**Parameters:**

- `setupFutureUsage`: true if the payment method should be always saved for future use off session, or false if the payment method should be only saved for future use on session when appropriate.

---

### setStatementDescriptor

**Signature:** `setStatementDescriptor(statementDescriptor : String) : void`

**Description:** Sets the complete description that appears on your customers' statements for payments made by this request. Set this to null to use the default statement descriptor for your account.

**Parameters:**

- `statementDescriptor`: statement descriptor for payments made by this request, or null to use the account default

---

### setStripeCreateElementOptions

**Signature:** `setStripeCreateElementOptions(element : String, options : Object) : void`

**Description:** Sets the the options to pass into the Stripe elements.create call for the given element type. For more information see the Stripe Elements API documentation.

**Parameters:**

- `element`: name of the Stripe element whose creation to configure
- `options`: JS object containing the options

**See Also:**

ELEMENT_AFTERPAY_CLEARPAY_MESSAGE
ELEMENT_CARD_CVC
ELEMENT_CARD_EXPIRY
ELEMENT_CARD_NUMBER
ELEMENT_EPS_BANK
ELEMENT_IBAN
ELEMENT_IDEAL_BANK
ELEMENT_PAYMENT_REQUEST_BUTTON

---

### setStripeElementsOptions

**Signature:** `setStripeElementsOptions(options : Object) : void`

**Description:** Sets the the options to pass into the stripe.elements call. For more information see the Stripe Elements API documentation.

**Parameters:**

- `options`: JS object containing the options

---