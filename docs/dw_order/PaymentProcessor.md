## Package: dw.order

# Class PaymentProcessor

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.PaymentProcessor

## Description

A PaymentProcessor represents an entity that processes payments of one or more types. In the B2C Commerce system, a payment processor is just a container for configuration values, which describe, for example, the parameters (URL, merchant ID, password, etc) required for connecting to a payment gateway. The system has several built in PaymentProcessors. These are: BASIC_CREDIT BASIC_GIFT_CERTIFICATE CYBERSOURCE_CREDIT CYBERSOURCE_BML PAYPAL_CREDIT PAYPAL_EXPRESS VERISIGN_CREDIT The first two of these are merely placeholders with no associated preference values. The remaining system payment processors define preference values which are maintained in the Business Manager and are used in conjunction with built-in B2C Commerce payment integrations. Preferences of system PaymentProcessors are not intended to be read programmatically. Merchants may also define custom payment processors. This is done by defining a payment processor with an arbitrary ID in the Business Manager, and then configuring an attribute group with the same ID on the SitePreferences system object. Attributes added to the group will be considered preferences of the payment processor and will be readable through getPreferenceValue(String). Merchants can design their checkout process to read these preferences at run time for connecting to their payment gateways. Every PaymentMethod in the system is associated with at most one PaymentProcessor. This basically represents the physical payment gateway which processes the (logical) payment method. Each payment processor may be associated with an arbitrary number of payment methods. Also, each payment transaction has one PaymentProcessor which is set by custom code during the checkout process.

## Properties

### ID

**Type:** String (Read Only)

The 'ID' of this processor.

## Constructor Summary

## Method Summary

### getID

**Signature:** `getID() : String`

Returns the 'ID' of this processor.

### getPreferenceValue

**Signature:** `getPreferenceValue(name : String) : Object`

Returns the value of the specified preference for this payment processor.

## Method Detail

## Method Details

### getID

**Signature:** `getID() : String`

**Description:** Returns the 'ID' of this processor.

**Returns:**

the 'ID' of this processor, e.g. "BASIC_CREDIT".

---

### getPreferenceValue

**Signature:** `getPreferenceValue(name : String) : Object`

**Description:** Returns the value of the specified preference for this payment processor. If the preference name is invalid (or null) or no preference value is defined for this payment processor, null is returned.

**Parameters:**

- `name`: preference name. Typically an attribute defined on SitePreferences contained in an attribute group whose name is the same as this.ID.

**Returns:**

preference value, or null.

---