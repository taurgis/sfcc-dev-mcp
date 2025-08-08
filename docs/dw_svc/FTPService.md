## Package: dw.svc

# Class FTPService

## Inheritance Hierarchy

- Object
  - dw.svc.Service
  - dw.svc.FTPService

## Description

Represents an FTP or SFTP Service. There are two basic styles of configuration for this service. In the first style, createRequest is implemented to call the setOperation method on the Service. This will cause the single operation to be performed and returned as the data object in the parseResponse method. Any error status is set automatically based on the returned value of the operation. In the second style, execute is implemented to perform one or more operations using the serviceClient available on the Service object. This serviceClient will be either an FTPClient or an SFTPClient. The return value of execute will be passed as the data object in the parseResponse method. Note that the use of the FTP client is deprecated, and SFTP should be used instead.

## Properties

### autoDisconnect

**Type:** boolean

The status of whether the underlying FTP connection will be disconnected after the service call.

### client

**Type:** Object (Read Only)

The underlying client object.
 
 This is either an FTPClient or SFTPClient, depending on the protocol.

## Constructor Summary

## Method Summary

### getClient

**Signature:** `getClient() : Object`

Returns the underlying client object.

### isAutoDisconnect

**Signature:** `isAutoDisconnect() : boolean`

Returns the status of whether the underlying FTP connection will be disconnected after the service call.

### setAutoDisconnect

**Signature:** `setAutoDisconnect(b : boolean) : FTPService`

Sets the auto-disconnect flag.

### setOperation

**Signature:** `setOperation(name : String, args : Object...) : FTPService`

Sets a single operation to perform during the execute phase of the service.

## Method Detail

## Method Details

### getClient

**Signature:** `getClient() : Object`

**Description:** Returns the underlying client object. This is either an FTPClient or SFTPClient, depending on the protocol.

**Returns:**

(S)FTP Client object.

---

### isAutoDisconnect

**Signature:** `isAutoDisconnect() : boolean`

**Description:** Returns the status of whether the underlying FTP connection will be disconnected after the service call.

**Returns:**

The auto-disconnect flag.

---

### setAutoDisconnect

**Signature:** `setAutoDisconnect(b : boolean) : FTPService`

**Description:** Sets the auto-disconnect flag. If true, the underlying FTP connection will be disconnected after the service call. If false then it will remain open. The default value is true.

**Parameters:**

- `b`: true to enable auto-disconnect, false otherwise.

**Returns:**

this FTP or SFTP Service.

---

### setOperation

**Signature:** `setOperation(name : String, args : Object...) : FTPService`

**Description:** Sets a single operation to perform during the execute phase of the service. The given arguments make up a method name and arguments on the underlying getClient() object. This method will be invoked during execution, with the result passed into the callback's parseResponse method. This is required unless the callback defines an execute method.

**Parameters:**

- `name`: Method name.
- `args`: Method arguments.

**Returns:**

this FTP or SFTP Service.

---