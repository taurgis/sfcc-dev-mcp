## Package: dw.rpc

# Class Stub

## Inheritance Hierarchy

- Object
  - dw.rpc.Stub

## Description

This is the base class for all service stubs accessible through a WebReference object. The Stub provides access to the WSDL operations. Demandware recommends a low timeout to ensure responsiveness of the site and to avoid thread exhaustion. Use the Services module in Business Manager to set timeout values, not the methods for this class. The Services module provides better analytics and timeout management. The default timeout, if not set, is 15 minutes when the web service is used in a job, and 2 minutes otherwise. If the timeout of the calling script is lower, the script timeout is used. // get WebReference var webref : WebReference = webreferences.myWSDLname; // get service stub var stub : Stub = webref.defaultService;

## Constants

### CONNECTION_TIMEOUT

**Type:** String

This property allows the user to set the web service connection timeout value in milliseconds. By default, the web service connection timeout is 5000 milliseconds (5 seconds). The minimum allowed value is 100 milliseconds and the maximum allowed value is 15000 milliseconds (15 seconds). Demandware recommends setting timeout values in Business Manager Services module as it provides better analytics and timeout management.

### ENDPOINT_ADDRESS_PROPERTY

**Type:** String

Standard property: target service endpoint address. The URI scheme for the endpoint address specification must correspond to the protocol/transport binding for this stub class.

### PASSWORD_PROPERTY

**Type:** String

Standard property: password for authentication.

### SESSION_MAINTAIN_PROPERTY

**Type:** String

Standard property: this boolean property is used by a service client to indicate whether or not it wants to participate in a session with a service endpoint. If this property is set to true, the service client indicates that it wants the session to be maintained. If set to false, the session is not maintained. The default value for this property is false.

### USERNAME_PROPERTY

**Type:** String

Standard property: user name for authentication.

## Properties

### password

**Type:** String

The password.

### timeout

**Type:** Number

The current read timeout value in milliseconds for this Stub.

### username

**Type:** String

The user name.
 
 Note: this method handles sensitive security-related data.
 Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

## Constructor Summary

Stub()

## Method Summary

### _getProperty

**Signature:** `_getProperty(name : String) : Object`

Gets the value of a specific configuration property.

### _setProperty

**Signature:** `_setProperty(name : String, value : Object) : void`

Sets the name and value of a configuration property for this Stub instance.

### getPassword

**Signature:** `getPassword() : String`

Returns the password.

### getTimeout

**Signature:** `getTimeout() : Number`

Returns the current read timeout value in milliseconds for this Stub.

### getUsername

**Signature:** `getUsername() : String`

Returns the user name.

### setHeader

**Signature:** `setHeader(namespace : String, name : String, value : Object) : void`

Sets an additional SOAP header value for the next operation.

### setPassword

**Signature:** `setPassword(password : String) : void`

Sets the password.

### setTimeout

**Signature:** `setTimeout(timeout : Number) : void`

Sets the timeout in milliseconds for the next call through this Stub.

### setUsername

**Signature:** `setUsername(username : String) : void`

Sets the user name.

## Constructor Detail

## Method Detail

## Method Details

### _getProperty

**Signature:** `_getProperty(name : String) : Object`

**Description:** Gets the value of a specific configuration property.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `name`: Name of the property whose value is to be retrieved

**Returns:**

Value of the configuration property

---

### _setProperty

**Signature:** `_setProperty(name : String, value : Object) : void`

**Description:** Sets the name and value of a configuration property for this Stub instance. If the Stub instance contains a value for the same property, the old value is replaced. Note: the _setProperty method may not perform a validity check on a configured property value. An example is the standard property for the target service endpoint address, which is not checked for validity in the _setProperty method. In this case, stub configuration errors are detected at the remote method invocation.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `name`: Name of the configuration property
- `value`: Value of the property

---

### getPassword

**Signature:** `getPassword() : String`

**Description:** Returns the password.

**Deprecated:**

use webreferences2 instead

**Returns:**

the password. Note: this method handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

---

### getTimeout

**Signature:** `getTimeout() : Number`

**Description:** Returns the current read timeout value in milliseconds for this Stub.

**Deprecated:**

use webreferences2 instead

**Returns:**

the current timeout value for this Stub.

---

### getUsername

**Signature:** `getUsername() : String`

**Description:** Returns the user name. Note: this method handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12.

**Deprecated:**

use webreferences2 instead

**Returns:**

the user name.

---

### setHeader

**Signature:** `setHeader(namespace : String, name : String, value : Object) : void`

**Description:** Sets an additional SOAP header value for the next operation.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `namespace`: the namespace to use.
- `name`: the name of the header item.
- `value`: the value for the header item.

---

### setPassword

**Signature:** `setPassword(password : String) : void`

**Description:** Sets the password.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `password`: the password to set.

---

### setTimeout

**Signature:** `setTimeout(timeout : Number) : void`

**Description:** Sets the timeout in milliseconds for the next call through this Stub. This timeout value controls "read timeout" (how long, after connecting, it will wait without any data being read). To control "connection timeout" you use the _setProperty(String, Object) method where the name parameter is CONNECTION_TIMEOUT.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `timeout`: the timeout for the next call through this stub.

**See Also:**

_setProperty(String, Object)
CONNECTION_TIMEOUT

---

### setUsername

**Signature:** `setUsername(username : String) : void`

**Description:** Sets the user name.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `username`: the user name to set.

---