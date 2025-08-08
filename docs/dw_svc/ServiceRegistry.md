## Package: dw.svc

# Class ServiceRegistry

## Inheritance Hierarchy

- Object
  - dw.svc.ServiceRegistry

## Description

The ServiceRegistry is responsible for managing Service definitions and their instances. Typical usage involves several steps: The service is defined in the Business Manager and configured with necessary credentials. The service callback is configured once during cartridge initialization: ServiceRegistry.configure("MyFTPService", { mockExec : function(svc:FTPService, params) { return [ { "name": "file1", "timestamp": new Date(2011, 02, 21)}, { "name": "file2", "timestamp": new Date(2012, 02, 21)}, { "name": "file3", "timestamp": new Date(2013, 02, 21)} ]; }, createRequest: function(svc:FTPService, params) { svc.setOperation("list", "/"); }, parseResponse : function(svc:FTPService, listOutput) { var x : Array = []; var resp : Array = listOutput; for(var i = 0; i < resp.length; i++) { var f = resp[i]; x.push( { "name": f['name'], "timestamp": f['timestamp'] } ); } return x; } }); A new service instance is created and called in order to perform the operation: var result : Result = ServiceRegistry.get("MyFTPService").call(); if(result.status == 'OK') { // The result.object is the object returned by the 'after' callback. } else { // Handle the error. See result.error for more information. } See ServiceCallback for all the callback options, and individual ServiceDefinition classes for customization specific to a service type.

## Constructor Summary

## Method Summary

### configure

**Signature:** `static configure(serviceID : String, configObj : Object) : ServiceDefinition`

Configure the given serviceId with a callback.

### get

**Signature:** `static get(serviceID : String) : Service`

Constructs a new instance of the given service.

### getDefinition

**Signature:** `static getDefinition(serviceID : String) : ServiceDefinition`

Gets a Service Definition.

### isConfigured

**Signature:** `static isConfigured(serviceID : String) : boolean`

Returns the status of whether the given service has been configured with a callback.

## Method Detail

## Method Details

### configure

**Signature:** `static configure(serviceID : String, configObj : Object) : ServiceDefinition`

**Description:** Configure the given serviceId with a callback. If the service is already configured, the given callback will replace any existing one.

**Parameters:**

- `serviceID`: Unique Service ID.
- `configObj`: Configuration callback. See ServiceCallback for a description of available callback methods.

**Returns:**

Associated ServiceDefinition, which can be used for further protocol-specific configuration.

---

### get

**Signature:** `static get(serviceID : String) : Service`

**Description:** Constructs a new instance of the given service.

**Parameters:**

- `serviceID`: Unique Service ID.

**Returns:**

Service instance.

---

### getDefinition

**Signature:** `static getDefinition(serviceID : String) : ServiceDefinition`

**Description:** Gets a Service Definition. This Service Definition is shared across all Service instances returned by get(String).

**Parameters:**

- `serviceID`: Unique Service ID.

**Returns:**

ServiceDefinition

---

### isConfigured

**Signature:** `static isConfigured(serviceID : String) : boolean`

**Description:** Returns the status of whether the given service has been configured with a callback.

**Parameters:**

- `serviceID`: Unique Service ID.

**Returns:**

true if configure has already been called, false otherwise.

---