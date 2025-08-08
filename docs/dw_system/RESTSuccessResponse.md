## Package: dw.system

# Class RESTSuccessResponse

## Inheritance Hierarchy

- Object
  - dw.system.RESTSuccessResponse

## Description

This class represents a REST success response that is compliant with the RFC standards. It can only be instantiated using the createSuccess methods in RESTResponseMgr. Here is an example: var body = {"hello": "world"} var success = RESTResponseMgr.createSuccess(body); success.render(); The above script would result in an HTTP response with status code 200 and the following body: { "hello": "world" }

## Constructor Summary

## Method Summary

### render

**Signature:** `render() : void`

Sends the RESTSuccessResponse object as an HTTP response to the client.

## Method Detail

## Method Details

### render

**Signature:** `render() : void`

**Description:** Sends the RESTSuccessResponse object as an HTTP response to the client. This sets the "Content-Type" header to "application/json" and expects the body to be a valid JavaScript JSON object.

**Throws:**

IllegalStateException - If the RESTSuccessResponse object is already rendered.
Exception - If there is an error while serializing the body.

---