## Package: dw.svc

# Class ServiceDefinition

## Inheritance Hierarchy

- Object
  - dw.svc.ServiceDefinition

## Description

Base class of Service Definitions. A service definition represents configuration that is shared across all Service instances.

## Properties

### configuration

**Type:** ServiceConfig (Read Only)

The Service Configuration stored in the database.

### mock

**Type:** boolean

The status of whether mock mode is enabled for all instances of this definition.

### serviceName

**Type:** String (Read Only)

The name of this service.

### throwOnError

**Type:** boolean

The status of whether the shared throwOnError flag is set.

## Constructor Summary

## Method Summary

### configure

**Signature:** `configure(config : Object) : ServiceDefinition`

Register a callback to handle custom portions of the service.

### getConfiguration

**Signature:** `getConfiguration() : ServiceConfig`

Returns the Service Configuration stored in the database.

### getServiceName

**Signature:** `getServiceName() : String`

Returns the name of this service.

### isMock

**Signature:** `isMock() : boolean`

Returns the status of whether mock mode is enabled for all instances of this definition.

### isThrowOnError

**Signature:** `isThrowOnError() : boolean`

Returns the status of whether the shared throwOnError flag is set.

### setMock

**Signature:** `setMock() : ServiceDefinition`

Sets the mock mode for all Service instances that use this definition.

### setThrowOnError

**Signature:** `setThrowOnError() : ServiceDefinition`

Sets the throwOnError flag to true for all Service instances that use this definition.

## Method Detail

## Method Details

### configure

**Signature:** `configure(config : Object) : ServiceDefinition`

**Description:** Register a callback to handle custom portions of the service. This callback may declare multiple methods: { initServiceClient: function() { // Create and return the internal service client object. // This is usually optional, except in the case of SOAP services. }, // svc is the call-specific Service instance. For example, it may be an HTTPService or FTPService. // params are the arguments passed to the call method (if any). createRequest: function(svc:Service, params) { // Perform any required call-time configuration. // Optionally return a Service-specific object }, // svc is the call-specific Service instance. // arg is the output of createRequest. execute: function(svc:Service, arg:Object) { // Execute the service call and return a result // This method is not used by default for HTTP-related services unless executeOverride is set. }, // Use the execute function if it is present. This is only required to use the functionality with HTTP services. executeOverride: true, // svc is the call-specific Service instance. // response is the output of execute. parseResponse: function(svc:Service, response: Object) { // Process the response object as needed. // The return value of this method will be the return value of the outer call method. }, // svc is the call-specific Service instance. // arg is the output of createRequest. mockCall: function(svc:Service, arg:Object) { // This method takes the place of the 'execute' phase when mocking is enabled. // Note initServiceClient, createRequest, and parseResponse still invoked. }, // svc is the call-specific Service instance. // params are the arguments passed to the call method (if any). mockFull: function(svc:Service, params) { // This method takes the place of the entire service call when mocking is enabled. // No other callbacks are invoked. The output of this method becomes the output of call. } }

**Parameters:**

- `config`: Callback object.

**Returns:**

this

---

### getConfiguration

**Signature:** `getConfiguration() : ServiceConfig`

**Description:** Returns the Service Configuration stored in the database.

**Returns:**

Service Configuration.

---

### getServiceName

**Signature:** `getServiceName() : String`

**Description:** Returns the name of this service.

**Returns:**

Service name.

---

### isMock

**Signature:** `isMock() : boolean`

**Description:** Returns the status of whether mock mode is enabled for all instances of this definition.

**Returns:**

true for mock mode, false otherwise.

---

### isThrowOnError

**Signature:** `isThrowOnError() : boolean`

**Description:** Returns the status of whether the shared throwOnError flag is set.

**Returns:**

throwOnError flag.

---

### setMock

**Signature:** `setMock() : ServiceDefinition`

**Description:** Sets the mock mode for all Service instances that use this definition.

**Returns:**

this Service Definition.

---

### setThrowOnError

**Signature:** `setThrowOnError() : ServiceDefinition`

**Description:** Sets the throwOnError flag to true for all Service instances that use this definition.

**Returns:**

this Service Definition.

---