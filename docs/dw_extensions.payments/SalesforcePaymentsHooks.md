## Package: dw.extensions.payments

# Class SalesforcePaymentsHooks

## Inheritance Hierarchy

- dw.extensions.payments.SalesforcePaymentsHooks

## Description

This interface represents all script hooks that can be registered to customize the Salesforce Payments functionality. See Salesforce Payments documentation for how to gain access and configure it for use on your sites. It contains the extension points (hook names), and the functions that are called by each extension point. A function must be defined inside a JavaScript source and must be exported. The script with the exported hook function must be located inside a site cartridge. Inside the site cartridge a 'package.json' file with a 'hooks' entry must exist. "hooks": "./hooks.json" The hooks entry links to a json file, relative to the 'package.json' file. This file lists all registered hooks inside the hooks property: "hooks": [ {"name": "dw.extensions.payments.asyncPaymentSucceeded", "script": "./payments.js"}, {"name": "dw.extensions.payments.adyenNotification", "script": "./payments.js"}, {"name": "dw.extensions.payments.sendOrderConfirmationEmail", "script": "./emails.js"} ] A hook entry has a 'name' and a 'script' property. The 'name' contains the extension point, the hook name. The 'script' contains the script relative to the hooks file, with the exported hook function.

## Constants

## Properties

## Constructor Summary

## Method Summary

### adyenNotification

**Signature:** `adyenNotification(order : Order) : Status`

Called when an Adyen webhook notification is received for the given order.

### asyncPaymentSucceeded

**Signature:** `asyncPaymentSucceeded(order : Order) : Status`

Called when asynchronous payment succeeded for the given order.

### sendOrderConfirmationEmail

**Signature:** `sendOrderConfirmationEmail(order : Order) : Status`

Called to send order confirmation email after successful payment processing.

### stripePaymentEvent

**Signature:** `stripePaymentEvent(eventName : String, order : Order) : Status`

Called when a Stripe payment event is received for the given order.

## Method Detail

## Method Details

### adyenNotification

**Signature:** `adyenNotification(order : Order) : Status`

**Description:** Called when an Adyen webhook notification is received for the given order.

**Parameters:**

- `order`: the order for which the notification was received

**Returns:**

a non-null result ends the hook execution, and is ignored

---

### asyncPaymentSucceeded

**Signature:** `asyncPaymentSucceeded(order : Order) : Status`

**Description:** Called when asynchronous payment succeeded for the given order.

**Parameters:**

- `order`: the order whose asynchronous payment succeeded

**Returns:**

a non-null result ends the hook execution, and is ignored

---

### sendOrderConfirmationEmail

**Signature:** `sendOrderConfirmationEmail(order : Order) : Status`

**Description:** Called to send order confirmation email after successful payment processing.

**Parameters:**

- `order`: the order for which to send confirmation email

**Returns:**

a non-null result ends the hook execution

---

### stripePaymentEvent

**Signature:** `stripePaymentEvent(eventName : String, order : Order) : Status`

**Description:** Called when a Stripe payment event is received for the given order.

**Parameters:**

- `eventName`: the Stripe event name, such as "payment_intent.succeeded"
- `order`: the order for which the event was received

**Returns:**

a non-null result ends the hook execution, and is ignored

---