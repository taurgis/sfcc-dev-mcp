## Package: dw.svc

# Class FTPServiceDefinition

## Inheritance Hierarchy

- Object
  - dw.svc.ServiceDefinition
  - dw.svc.FTPServiceDefinition

## Description

Represents an FTP or SFTP Service Definition. There are two basic styles of configuration for this service. In the first style, createRequest is implemented to call the setOperation method on the Service. This will cause the single operation to be performed and returned as the data object in the parseResponse method. Any error status is set automatically based on the returned value of the operation. In the second style, execute is implemented to perform one or more operations using the serviceClient available on the Service object. This serviceClient will be either an FTPClient or an SFTPClient. The return value of execute will be passed as the data object in the parseResponse method.

## Properties

### autoDisconnect

**Type:** boolean

The status of whether the underlying FTP connection will be disconnected after the service call.

## Constructor Summary

## Method Summary

### isAutoDisconnect

**Signature:** `isAutoDisconnect() : boolean`

Returns the status of whether the underlying FTP connection will be disconnected after the service call.

### setAutoDisconnect

**Signature:** `setAutoDisconnect(b : boolean) : FTPServiceDefinition`

Sets the auto-disconnect flag.

## Method Detail

## Method Details

### isAutoDisconnect

**Signature:** `isAutoDisconnect() : boolean`

**Description:** Returns the status of whether the underlying FTP connection will be disconnected after the service call.

**Returns:**

The auto-disconnect flag.

---

### setAutoDisconnect

**Signature:** `setAutoDisconnect(b : boolean) : FTPServiceDefinition`

**Description:** Sets the auto-disconnect flag. If true, the underlying FTP connection will be disconnected after the service call. If false then it will remain open. The default value is true.

**Parameters:**

- `b`: true to enable auto-disconnect, false otherwise.

**Returns:**

this FTP or SFTP Service Definition.

---