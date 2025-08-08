## Package: dw.extensions.applepay

# Class ApplePayHookResult

## Inheritance Hierarchy

- Object
  - dw.extensions.applepay.ApplePayHookResult

## Description

Result of a hook handling an Apple Pay request. Use the constants in this type to indicate specific error reasons to be provided to Apple Pay JS. For example, the following code creates a Status that indicates the shipping contact information provided by Apple Pay is invalid: var ApplePayHookResult = require('dw/extensions/applepay/ApplePayHookResult'); var Status = require('dw/system/Status'); var error = new Status(Status.ERROR); error.addDetail(ApplePayHookResult.STATUS_REASON_DETAIL_KEY, ApplePayHookResult.REASON_SHIPPING_CONTACT); If a specific error reason is not provided, the generic Apple Pay STATUS_FAILURE reason will be used when necessary.

## Constants

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

ApplePayHookResult(status : Status, redirect : URL) Constructs a result with the given outcome information.

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