## Package: dw.svc

# Class Service

## Inheritance Hierarchy

- Object
  - dw.svc.Service

## Description

Base class of Services. A service represents a call-specific configuration. Any configuration set here is local to the currently executing call.

## Properties

### configuration

**Type:** ServiceConfig (Read Only)

The Service Configuration.

### credentialID

**Type:** String

The ID of the currently associated Credential.

### mock

**Type:** boolean

The status of whether this service is executing in mock mode.

### requestData

**Type:** Object (Read Only)

The property that stores the object returned by createRequest.

### response

**Type:** Object (Read Only)

The property that stores the object returned by the service.
 
 This property is only useful after the service call(Object...) completes, and is the same as the object
 inside the Result.

### throwOnError

**Type:** boolean

The status of whether this service will throw an error when encountering a problem.

### URL

**Type:** String

The current URL, excluding any custom query parameters.

## Constructor Summary

## Method Summary

### call

**Signature:** `call(args : Object...) : Result`

Invokes the service.

### getConfiguration

**Signature:** `getConfiguration() : ServiceConfig`

Returns the Service Configuration.

### getCredentialID

**Signature:** `getCredentialID() : String`

Returns the ID of the currently associated Credential.

### getRequestData

**Signature:** `getRequestData() : Object`

Returns the property that stores the object returned by createRequest.

### getResponse

**Signature:** `getResponse() : Object`

Returns the property that stores the object returned by the service.

### getURL

**Signature:** `getURL() : String`

Returns the current URL, excluding any custom query parameters.

### isMock

**Signature:** `isMock() : boolean`

Returns the status of whether this service is executing in mock mode.

### isThrowOnError

**Signature:** `isThrowOnError() : boolean`

Returns the status of whether this service will throw an error when encountering a problem.

### setCredentialID

**Signature:** `setCredentialID(id : String) : Service`

Override the Credential by the credential object with the given ID.

### setMock

**Signature:** `setMock() : Service`

Forces the mock mode to be enabled.

### setThrowOnError

**Signature:** `setThrowOnError() : Service`

Forces a Service to throw an error when there is a problem instead of returning a Result with non-OK status.

### setURL

**Signature:** `setURL(url : String) : Service`

Override the URL to the given value.

## Method Detail

## Method Details

### call

**Signature:** `call(args : Object...) : Result`

**Description:** Invokes the service.

**Parameters:**

- `args`: Arguments to pass. If there is a single argument and that argument is an array, then each item in the array will become a separate argument. For example, the following results in three separate arguments to the service: svc.call( [1,2,3] ) and is functionally equivalent to svc.call( 1, 2, 3 ) This can be avoided by explicitly forming a List, enclosing the array in another array, or by sending a second argument. The following will all send the array as a List in the first argument. svc.call( ArrayList([1,2,3]) ) svc.call( [[1,2,3]] ) svc.call( [1,2,3], "" ) Another option is to change the definition of the associated ServiceCallback.createRequest(Service, Object...) to accept an object instead, and pass the array as a field of that object: svc.call( { 'data': [1,2,3] } )

**Returns:**

Result of the service.

---

### getConfiguration

**Signature:** `getConfiguration() : ServiceConfig`

**Description:** Returns the Service Configuration.

**Returns:**

Service Configuration.

---

### getCredentialID

**Signature:** `getCredentialID() : String`

**Description:** Returns the ID of the currently associated Credential.

**Returns:**

Credential Name.

---

### getRequestData

**Signature:** `getRequestData() : Object`

**Description:** Returns the property that stores the object returned by createRequest.

**Returns:**

Object returned by createRequest.

---

### getResponse

**Signature:** `getResponse() : Object`

**Description:** Returns the property that stores the object returned by the service. This property is only useful after the service call(Object...) completes, and is the same as the object inside the Result.

**Returns:**

Object returned by the service.

---

### getURL

**Signature:** `getURL() : String`

**Description:** Returns the current URL, excluding any custom query parameters.

**Returns:**

URL.

---

### isMock

**Signature:** `isMock() : boolean`

**Description:** Returns the status of whether this service is executing in mock mode.

**Returns:**

true for mock mode, false otherwise.

---

### isThrowOnError

**Signature:** `isThrowOnError() : boolean`

**Description:** Returns the status of whether this service will throw an error when encountering a problem.

**Returns:**

true to throw an error, false otherwise.

---

### setCredentialID

**Signature:** `setCredentialID(id : String) : Service`

**Description:** Override the Credential by the credential object with the given ID. If the URL is also overridden, that URL will continue to override the URL in this credential.

**Parameters:**

- `id`: Credential ID. It must exist.

**Returns:**

this Service.

---

### setMock

**Signature:** `setMock() : Service`

**Description:** Forces the mock mode to be enabled.

**Returns:**

this Service.

---

### setThrowOnError

**Signature:** `setThrowOnError() : Service`

**Description:** Forces a Service to throw an error when there is a problem instead of returning a Result with non-OK status.

**Returns:**

this Service.

---

### setURL

**Signature:** `setURL(url : String) : Service`

**Description:** Override the URL to the given value. Any query parameters (if applicable) will be appended to this URL.

**Parameters:**

- `url`: Force the URL to the given value.

**Returns:**

this Service.

---