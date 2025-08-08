## Package: dw.extensions.paymentrequest

# Class PaymentRequestHookResult

## Inheritance Hierarchy

- Object
  - dw.extensions.paymentrequest.PaymentRequestHookResult

## Description

Result of a hook handling a Payment Request request

## Properties

### eventDetail

**Type:** Object (Read Only)

Detail to the JS custom event to dispatch in response to this result.

### eventName

**Type:** String (Read Only)

Name of the JS custom event to dispatch in response to this result.

### redirect

**Type:** URL (Read Only)

URL to navigate to in response to this result.

### status

**Type:** Status (Read Only)

Status describing the outcome of this result.

## Constructor Summary

PaymentRequestHookResult(status : Status, redirect : URL) Constructs a result with the given outcome information.

## Method Summary

### getEventDetail

**Signature:** `getEventDetail() : Object`

Detail to the JS custom event to dispatch in response to this result.

### getEventName

**Signature:** `getEventName() : String`

Name of the JS custom event to dispatch in response to this result.

### getRedirect

**Signature:** `getRedirect() : URL`

URL to navigate to in response to this result.

### getStatus

**Signature:** `getStatus() : Status`

Status describing the outcome of this result.

### setEvent

**Signature:** `setEvent(name : String) : void`

Sets the name of the JS custom event to dispatch in response to this result.

### setEvent

**Signature:** `setEvent(name : String, detail : Object) : void`

Sets the name and detail of the JS custom event to dispatch in response to this result.

## Constructor Detail

## Method Detail

## Method Details

### getEventDetail

**Signature:** `getEventDetail() : Object`

**Description:** Detail to the JS custom event to dispatch in response to this result.

**Returns:**

event detail

---

### getEventName

**Signature:** `getEventName() : String`

**Description:** Name of the JS custom event to dispatch in response to this result.

**Returns:**

event name

---

### getRedirect

**Signature:** `getRedirect() : URL`

**Description:** URL to navigate to in response to this result.

**Returns:**

redirect URL

---

### getStatus

**Signature:** `getStatus() : Status`

**Description:** Status describing the outcome of this result.

**Returns:**

status of this result

---

### setEvent

**Signature:** `setEvent(name : String) : void`

**Description:** Sets the name of the JS custom event to dispatch in response to this result.

**Parameters:**

- `name`: JS custom event name

---

### setEvent

**Signature:** `setEvent(name : String, detail : Object) : void`

**Description:** Sets the name and detail of the JS custom event to dispatch in response to this result.

**Parameters:**

- `name`: JS custom event name
- `detail`: JS custom event detail

---