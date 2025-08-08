## Package: dw.system

# Class RESTResponseMgr

## Inheritance Hierarchy

- Object
  - dw.system.RESTResponseMgr

## Description

This class provides helper methods for creating REST error and success responses. It is mainly intended to be used to build Custom REST APIs. But, any controller implementation planning to provide REST-like responses can use these methods. If these methods are being used in the controllers, note that a few defaults like URL prefix for type in createError methods will correspond to Custom REST APIs.

## Constructor Summary

RESTResponseMgr()

## Method Summary

### createEmptySuccess

**Signature:** `static createEmptySuccess(statusCode : Number) : RESTSuccessResponse`

Constructs a new RESTSuccessResponse object.

### createError

**Signature:** `static createError(statusCode : Number) : RESTErrorResponse`

Constructs a new RESTErrorResponse object.

### createError

**Signature:** `static createError(statusCode : Number, type : String) : RESTErrorResponse`

Constructs a new RESTErrorResponse object.

### createError

**Signature:** `static createError(statusCode : Number, type : String, title : String) : RESTErrorResponse`

Constructs a new RESTErrorResponse object.

### createError

**Signature:** `static createError(statusCode : Number, type : String, title : String, detail : String) : RESTErrorResponse`

Constructs a new RESTErrorResponse object.

### createScapiRemoteInclude

**Signature:** `static createScapiRemoteInclude(apiFamily : String, apiName : String, apiVersion : String, resourcePath : String, params : URLParameter...) : RemoteInclude`

Constructs a new RemoteInclude object specific for the SCAPI include path.

### createStorefrontControllerRemoteInclude

**Signature:** `static createStorefrontControllerRemoteInclude(action : URLAction, params : URLParameter...) : RemoteInclude`

Constructs a new RemoteInclude object specific for the Storefront Controller include path.

### createSuccess

**Signature:** `static createSuccess(body : Object, statusCode : Number) : RESTSuccessResponse`

Constructs a new RESTSuccessResponse object.

### createSuccess

**Signature:** `static createSuccess(body : Object) : RESTSuccessResponse`

Constructs a new RESTSuccessResponse object.

## Constructor Detail

## Method Detail

## Method Details

### createEmptySuccess

**Signature:** `static createEmptySuccess(statusCode : Number) : RESTSuccessResponse`

**Description:** Constructs a new RESTSuccessResponse object. This method is to be used in scenarios where response body is not expected (e.g. statusCode is 204).

**Parameters:**

- `statusCode`: The http status code of the response. The statusCode parameter should conform to RFC standards for a success.

**Returns:**

A new RESTSuccessResponse object.

**Throws:**

IllegalArgumentException - If the statusCode is not in the (100..299) range.

---

### createError

**Signature:** `static createError(statusCode : Number) : RESTErrorResponse`

**Description:** Constructs a new RESTErrorResponse object. This method should be used when you have just the statusCode of the error and want the type of error to be inferred. 'type' of the error is inferred from the status code as follows: 400 - bad-request 401 - unauthorized 403 - forbidden 404 - resource-not-found 409 - conflict 412 - precondition-failed 429 - too-many-requests 500 - internal-server-error default - about:blank

**Parameters:**

- `statusCode`: The error code of the response. The statusCode parameter should conform to RFC standards for an error.

**Returns:**

A new RESTErrorResponse object.

**Throws:**

IllegalArgumentException - If the statusCode is not in the (400..599) range.

---

### createError

**Signature:** `static createError(statusCode : Number, type : String) : RESTErrorResponse`

**Description:** Constructs a new RESTErrorResponse object. This method should be used when you want to omit 'title' and 'detail' of the error. With this method, custom error codes and types apart from the standard ones can be constructed.

**Parameters:**

- `statusCode`: The error code of the response. The statusCode parameter should conform to RFC standards for an error.
- `type`: Type of the error according to RFC 9457. We enforce the following restrictions on top of the RFC: If the provided type is not an absolute URL, it will be prepended with https://api.commercecloud.salesforce.com/documentation/error/v1/custom-errors/. Custom error types are not allowed to have SYSTEM error type prefix: https://api.commercecloud.salesforce.com/documentation/error/v1/errors/.

**Returns:**

A new RESTErrorResponse object.

**Throws:**

IllegalArgumentException - If the statusCode is not in the (400..599) range or if the error type is not a valid URI or conflicts with the SYSTEM error type namespace.

---

### createError

**Signature:** `static createError(statusCode : Number, type : String, title : String) : RESTErrorResponse`

**Description:** Constructs a new RESTErrorResponse object. This method should be used when you want to omit 'detail' of the error but want to have valid 'statusCode', 'type' and 'title'.

**Parameters:**

- `statusCode`: The error code of the response. The statusCode parameter should conform to RFC standards for an error.
- `type`: Type of the error according to RFC 9457. We enforce the following restrictions on top of the RFC: If the provided type is not an absolute URL, it will be prepended with https://api.commercecloud.salesforce.com/documentation/error/v1/custom-errors/. Custom error types are not allowed to have SYSTEM error type prefix: https://api.commercecloud.salesforce.com/documentation/error/v1/errors/.
- `title`: Human-readable summary of the error type.

**Returns:**

A new RESTErrorResponse object.

**Throws:**

IllegalArgumentException - If the statusCode is not in the (400..599) range or if the error type is not a valid URI or conflicts with SYSTEM error type namespace.

---

### createError

**Signature:** `static createError(statusCode : Number, type : String, title : String, detail : String) : RESTErrorResponse`

**Description:** Constructs a new RESTErrorResponse object. This method can be used to construct error responses with valid 'statusCode', 'type', 'title' and 'detail'. If you want to omit title or detail, you can pass in null.

**Parameters:**

- `statusCode`: The error code of the response. The statusCode parameter should conform to RFC standards for an error.
- `type`: Type of the error according to RFC 9457. We enforce the following restrictions on top of the RFC: If the provided type is not an absolute URL, it will be prepended with https://api.commercecloud.salesforce.com/documentation/error/v1/custom-errors/. Custom error types are not allowed to have SYSTEM error type prefix: https://api.commercecloud.salesforce.com/documentation/error/v1/errors/.
- `title`: Human-readable summary of the error type.
- `detail`: Human-readable explanation of the specific occurrence of the error.

**Returns:**

A new RESTErrorResponse object.

**Throws:**

IllegalArgumentException - If the statusCode is not in the (400..599) range or if the error type is not a valid URI or conflicts with SYSTEM error type namespace.

---

### createScapiRemoteInclude

**Signature:** `static createScapiRemoteInclude(apiFamily : String, apiName : String, apiVersion : String, resourcePath : String, params : URLParameter...) : RemoteInclude`

**Description:** Constructs a new RemoteInclude object specific for the SCAPI include path. Usage: SCAPI remote include URL have following form: BASE_PATH/{apiFamily}/{apiName}/{apiVersion}/organizations/ORG_ID/{resourcePath}[?params] For the given SCAPI resource path: BASE_PATH/product/shopper-products/v1/organizations/ORG_ID/categories/root?siteId=YourShopHere RemoteInclude object can be constructed in a script like following: let include = dw.system.RESTResponseMgr.createScapiRemoteInclude("product", "shopper-products", "v1", "categories/root", dw.web.URLParameter("siteId", "YourShopHere")); Please notice that 'BASE_PATH' and 'ORG_ID' are automatically resolved.

**Parameters:**

- `apiFamily`: an API Family name. Example: 'product'.
- `apiName`: an API Name. Example: 'shopper-products'.
- `apiVersion`: an API Version. Example: 'v1'.
- `resourcePath`: a Resource path. Example: 'categories/root'
- `params`: a query parameters (optional)

**Returns:**

a new instance of RemoteInclude.

---

### createStorefrontControllerRemoteInclude

**Signature:** `static createStorefrontControllerRemoteInclude(action : URLAction, params : URLParameter...) : RemoteInclude`

**Description:** Constructs a new RemoteInclude object specific for the Storefront Controller include path.

**Parameters:**

- `action`: a container to specify target controller. Hostnames in URL actions are ignored.
- `params`: a query parameters (optional).

**Returns:**

a new instance of RemoteInclude.

---

### createSuccess

**Signature:** `static createSuccess(body : Object, statusCode : Number) : RESTSuccessResponse`

**Description:** Constructs a new RESTSuccessResponse object.

**Parameters:**

- `body`: The body of the successful response. This should always be a valid JavaScript JSON object.
- `statusCode`: The http status code of the response. The statusCode parameter should conform to RFC standards for a success.

**Returns:**

A new RESTSuccessResponse object.

**Throws:**

IllegalArgumentException - If the statusCode is not in the (100..299) range.

---

### createSuccess

**Signature:** `static createSuccess(body : Object) : RESTSuccessResponse`

**Description:** Constructs a new RESTSuccessResponse object. HTTP status code of the response will be defaulted to 200.

**Parameters:**

- `body`: The body of the successful response. This should always be a valid JavaScript JSON object.

**Returns:**

A new RESTSuccessResponse object.

---