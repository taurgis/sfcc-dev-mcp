## Package: dw.svc

# Class ServiceCallback

## Inheritance Hierarchy

- Object
  - dw.svc.ServiceCallback

## Description

Defines callbacks for use with the LocalServiceRegistry. Note this class itself is not used directly, and is present only for documentation of the available callback methods. These methods are called in sequence when a service is called: initServiceClient(Service) -- Creates the underlying client that will be used to make the call. This is intended for SOAP Services. Other client types will be created automatically. createRequest(Service, Object...) -- Given arguments to the Service.call(Object...), configure the actual service request. This may include setting request headers, defining the message body, etc. execute(Service, Object) -- Perform the actual request. At this point the client has been configured with the relevant credentials, so the call should be made. This is required for SOAP services. parseResponse(Service, Object) -- Convert the result of the call into an object to be returned from the Service.call(Object...) method. If the service is mocked (see Service.isMock()), then mockFull(Service, Object...) takes the place of this entire sequence. If that is not implemented, then mockCall(Service, Object) takes the place of just the execute(Service, Object) method. The URL, request, and response objects may be logged. To avoid logging sensitive data, filterLogMessage(String) and/or getRequestLogMessage(Object) and getResponseLogMessage(Object) must be implemented. If they are not implemented then this logging will not be done on Production environments. There are some special considerations for the combination of service type and callback: Service Type initServiceClient createRequest execute parseResponse HTTP Not normally implemented. Must return a HTTPClient Required unless execute is provided. The return value is expected to be either a String or array of HTTPRequestPart, which will be used as the request body Not called unless a boolean "executeOverride:true" is set on the callback. This is a temporary limitation, a future release will always call this callback if it is present Required unless execute is provided. HTTPForm Not normally implemented. Must return a HTTPClient Not normally implemented. Default behavior constructs an "application/x-www-form-urlencoded" request based on a Map given as an argument. Not normally implemented. The same limitations as HTTP regarding the "executeOverride" flag apply here. Optional. Default behavior is to return the response body as a String. SOAP Optional. This must return the Webservice stub or port Required. If initServiceClient was not provided, then this function must call SOAPService.setServiceClient(Object) with the stub or port Required. A typical implementation will call the webservice via a method on the service client Optional. Default behavior returns the output of execute FTP Not normally implemented. Must return a FTPClient or SFTPClient Required unless execute is defined. If present, it should call FTPService.setOperation(String, Object...) Optional. An implementation may call any required methods on the given client. The default implementation calls the Operation that was set up and returns the result. Optional. Default behavior returns the output of execute GENERIC Optional. Optional. Required. The GENERIC type allows any code to be wrapped in the service framework layer, and it's up to this execute method to define what that logic is. Optional.

## Properties

### URL

**Type:** String (Read Only)

Allows overriding the URL provided by the service configuration.
 
 It is usually better to call Service.setURL(String) within createRequest(Service, Object...)
 because that allows you to modify the existing URL based on call parameters.

## Constructor Summary

## Method Summary

### createRequest

**Signature:** `createRequest(service : Service, params : Object...) : Object`

Creates a request object to be used when calling the service.

### execute

**Signature:** `execute(service : Service, request : Object) : Object`

Provides service-specific execution logic.

### filterLogMessage

**Signature:** `filterLogMessage(msg : String) : String`

Allows filtering communication URL, request, and response log messages.

### getRequestLogMessage

**Signature:** `getRequestLogMessage(request : Object) : String`

Creates a communication log message for the given request.

### getResponseLogMessage

**Signature:** `getResponseLogMessage(response : Object) : String`

Creates a response log message for the given request.

### getURL

**Signature:** `getURL() : String`

Allows overriding the URL provided by the service configuration.

### initServiceClient

**Signature:** `initServiceClient(service : Service) : Object`

Creates a protocol-specific client object.

### mockCall

**Signature:** `mockCall(service : Service, requestObj : Object) : Object`

Override this method to mock the remote portion of the service call.

### mockFull

**Signature:** `mockFull(service : Service, args : Object...) : Object`

Override this method to mock the entire service call, including the createRequest, execute, and parseResponse phases.

### parseResponse

**Signature:** `parseResponse(service : Service, response : Object) : Object`

Creates a response object from a successful service call.

## Method Detail

## Method Details

### createRequest

**Signature:** `createRequest(service : Service, params : Object...) : Object`

**Description:** Creates a request object to be used when calling the service. The type of the object expected is dependent on the service. For example, the HTTPService expects the HTTP request body to be returned. This is required unless the execute method is implemented. It is not recommended to have a service accept a single array or list as a parameter, since doing so requires some extra work when actually calling the service. See Service.call(Object...) for more details.

**Parameters:**

- `service`: Service being executed.
- `params`: Parameters given to the call method.

**Returns:**

Request object to give to the execute method.

---

### execute

**Signature:** `execute(service : Service, request : Object) : Object`

**Description:** Provides service-specific execution logic. This can be overridden to execute a chain of FTP commands in the FTPService, or perform the actual remote call on a webservice stub in the SOAPService.

**Parameters:**

- `service`: Service being executed.
- `request`: Request object returned by createRequest(Service, Object...).

**Returns:**

Response from the underlying call, to be sent to parseResponse(Service, Object).

**Throws:**

- Exception

---

### filterLogMessage

**Signature:** `filterLogMessage(msg : String) : String`

**Description:** Allows filtering communication URL, request, and response log messages. If not implemented, then no filtering will be performed and the message will be logged as-is.

**Parameters:**

- `msg`: Original log message.

**Returns:**

Message to be logged.

---

### getRequestLogMessage

**Signature:** `getRequestLogMessage(request : Object) : String`

**Description:** Creates a communication log message for the given request. If not implemented then the default logic will be used to convert the request into a log message.

**Parameters:**

- `request`: Request object.

**Returns:**

Log message, or null to create and use the default message.

---

### getResponseLogMessage

**Signature:** `getResponseLogMessage(response : Object) : String`

**Description:** Creates a response log message for the given request. If not implemented then the default logic will be used to convert the response into a log message.

**Parameters:**

- `response`: Response object.

**Returns:**

Log message, or null to create and use the default message.

---

### getURL

**Signature:** `getURL() : String`

**Description:** Allows overriding the URL provided by the service configuration. It is usually better to call Service.setURL(String) within createRequest(Service, Object...) because that allows you to modify the existing URL based on call parameters.

**Returns:**

URL to use. The default behavior is to use the URL from the service configuration.

---

### initServiceClient

**Signature:** `initServiceClient(service : Service) : Object`

**Description:** Creates a protocol-specific client object. This does not normally need to be implemented, except in the case of SOAP services. Example declaration: initServiceClient: function( svc:SOAPService ) { }

**Parameters:**

- `service`: the Service object.

**Returns:**

Client object

**Throws:**

- Exception

---

### mockCall

**Signature:** `mockCall(service : Service, requestObj : Object) : Object`

**Description:** Override this method to mock the remote portion of the service call. Other callbacks like createRequest and parseResponse are still called.

**Parameters:**

- `service`: Service being executed.
- `requestObj`: Request object returned by createRequest(Service, Object...).

**Returns:**

Mock response, to be sent to parseResponse(Service, Object).

**Throws:**

- Exception

---

### mockFull

**Signature:** `mockFull(service : Service, args : Object...) : Object`

**Description:** Override this method to mock the entire service call, including the createRequest, execute, and parseResponse phases.

**Parameters:**

- `service`: Service being executed.
- `args`: Arguments from the Service call method.

**Returns:**

Object to return in the service call's Result.

**Throws:**

- Exception

---

### parseResponse

**Signature:** `parseResponse(service : Service, response : Object) : Object`

**Description:** Creates a response object from a successful service call. This response object will be the output object of the call method's Result.

**Parameters:**

- `service`: Service being executed.
- `response`: Service-specific response object. For example, the HTTPService service provides the underlying HTTPClient object that made the HTTP call.

**Returns:**

Object to return in the service call's Result.

---