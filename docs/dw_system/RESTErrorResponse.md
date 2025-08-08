## Package: dw.system

# Class RESTErrorResponse

## Inheritance Hierarchy

- Object
  - dw.system.RESTErrorResponse

## Description

This class represents a REST error response that is compliant with RFC 9457. It can only be instantiated using the createError methods in RESTResponseMgr. Here is an example: var error = RESTResponseMgr.createError(400); error.custom.foo = "bar"; error.render(); The above script would result in an HTTP response with status code 400 and the following body: { "type": "https://api.commercecloud.salesforce.com/documentation/error/v1/custom-errors/bad-request", "c_foo": "bar" } NOTE: Custom attributes are rendered with "c_" prefix as shown in the example above. Rendering works as described in JSON.stringify(Object).

## Properties

### custom

**Type:** CustomAttributes (Read Only)

All the custom attributes associated with the error response object. The attributes are stored for the
 lifetime of the error response object.

## Constructor Summary

## Method Summary

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns all the custom attributes associated with the error response object.

### render

**Signature:** `render() : void`

Sends the RESTErrorResponse object as an HTTP error response to the client, adhering to RFC 9457.

## Method Detail

## Method Details

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns all the custom attributes associated with the error response object. The attributes are stored for the lifetime of the error response object.

**Returns:**

All the custom attributes associated with the error response object.

---

### render

**Signature:** `render() : void`

**Description:** Sends the RESTErrorResponse object as an HTTP error response to the client, adhering to RFC 9457. This method sets the "Content-Type" header to "application/problem+json", HTTP Status Code to statusCode attribute and constructs the body from type, title, detail and custom attributes of the object. Custom attributes are rendered with "c_" prefix to the attribute name.

**Throws:**

IllegalStateException - If the RESTErrorResponse object is already rendered.
Exception - If there is an error while serializing the RESTErrorResponse object.

---