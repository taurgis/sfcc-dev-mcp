## Package: dw.svc

# Class Result

## Inheritance Hierarchy

- Object
  - dw.svc.Result

## Description

Represents the result of a service call.

## Constants

## Properties

### error

**Type:** Number (Read Only)

An error-specific code if applicable. For example, this is the HTTP response code for an
 HTTPService.

### errorMessage

**Type:** String (Read Only)

An error message on a non-OK status.

### mockResult

**Type:** boolean (Read Only)

The status of whether the response is the result of a "mock" service call.

### msg

**Type:** String (Read Only)

An extra error message on failure (if any).

### object

**Type:** Object (Read Only)

The actual object returned by the service when the status is OK.

### ok

**Type:** boolean (Read Only)

The status of whether the service call was successful.

### status

**Type:** String (Read Only)

The status. This is "OK" on success. Failure codes include "ERROR" and "SERVICE_UNAVAILABLE".
 
 If the status is "SERVICE_UNAVAILABLE", then the unavailableReason is guaranteed to be non-null.

### unavailableReason

**Type:** String (Read Only)

The reason the status is SERVICE_UNAVAILABLE.

## Constructor Summary

Result() Constructs a new result instance.

## Method Summary

### getError

**Signature:** `getError() : Number`

Returns an error-specific code if applicable.

### getErrorMessage

**Signature:** `getErrorMessage() : String`

Returns an error message on a non-OK status.

### getMsg

**Signature:** `getMsg() : String`

Returns an extra error message on failure (if any).

### getObject

**Signature:** `getObject() : Object`

Returns the actual object returned by the service when the status is OK.

### getStatus

**Signature:** `getStatus() : String`

Returns the status.

### getUnavailableReason

**Signature:** `getUnavailableReason() : String`

Returns the reason the status is SERVICE_UNAVAILABLE.

### isMockResult

**Signature:** `isMockResult() : boolean`

Returns the status of whether the response is the result of a "mock" service call.

### isOk

**Signature:** `isOk() : boolean`

Returns the status of whether the service call was successful.

### toString

**Signature:** `toString() : String`

Returns a string representation of the result.

## Constructor Detail

## Method Detail

## Method Details

### getError

**Signature:** `getError() : Number`

**Description:** Returns an error-specific code if applicable. For example, this is the HTTP response code for an HTTPService.

**Returns:**

Error-specific code (if applicable).

---

### getErrorMessage

**Signature:** `getErrorMessage() : String`

**Description:** Returns an error message on a non-OK status.

**Returns:**

Error message.

---

### getMsg

**Signature:** `getMsg() : String`

**Description:** Returns an extra error message on failure (if any).

**Returns:**

Error message, or null.

---

### getObject

**Signature:** `getObject() : Object`

**Description:** Returns the actual object returned by the service when the status is OK.

**Returns:**

Object returned by the service.

---

### getStatus

**Signature:** `getStatus() : String`

**Description:** Returns the status. This is "OK" on success. Failure codes include "ERROR" and "SERVICE_UNAVAILABLE". If the status is "SERVICE_UNAVAILABLE", then the unavailableReason is guaranteed to be non-null.

**Returns:**

Status code.

**See Also:**

OK
ERROR
SERVICE_UNAVAILABLE

---

### getUnavailableReason

**Signature:** `getUnavailableReason() : String`

**Description:** Returns the reason the status is SERVICE_UNAVAILABLE.

**Returns:**

Unavailable reason code, or null if the status is not SERVICE_UNAVAILABLE.

**See Also:**

UNAVAILABLE_TIMEOUT
UNAVAILABLE_CIRCUIT_BROKEN
UNAVAILABLE_RATE_LIMITED
UNAVAILABLE_DISABLED
UNAVAILABLE_CONFIG_PROBLEM

---

### isMockResult

**Signature:** `isMockResult() : boolean`

**Description:** Returns the status of whether the response is the result of a "mock" service call.

**Returns:**

true if this was a mock service call, false otherwise.

---

### isOk

**Signature:** `isOk() : boolean`

**Description:** Returns the status of whether the service call was successful.

**Returns:**

true on success, false otherwise.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a string representation of the result.

**Returns:**

a string representation of the result.

---