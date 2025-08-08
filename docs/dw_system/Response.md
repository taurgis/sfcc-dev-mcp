## Package: dw.system

# Class Response

## Inheritance Hierarchy

- Object
  - dw.system.Response

## Description

Represents an HTTP response in Commerce Cloud Digital. An instance of this class is implicitly available within Digital script under the variable "response". The Response object can be used to set cookies and specific HTTP headers, for directly accessing the output stream or for sending redirects.

## Constants

## Properties

### writer

**Type:** PrintWriter (Read Only)

A print writer which can be used to print content directly to the response.

## Constructor Summary

## Method Summary

### addHttpCookie

**Signature:** `addHttpCookie(cookie : Cookie) : void`

Adds the specified cookie to the outgoing response.

### addHttpHeader

**Signature:** `addHttpHeader(name : String, value : String) : void`

Adds a response header with the given name and value.

### containsHttpHeader

**Signature:** `containsHttpHeader(name : String) : boolean`

Checks whether the response message header has a field with the specified name.

### getWriter

**Signature:** `getWriter() : PrintWriter`

Returns a print writer which can be used to print content directly to the response.

### redirect

**Signature:** `redirect(url : URL) : void`

Sends a temporary redirect response (HTTP status 302) to the client for the specified redirect location URL.

### redirect

**Signature:** `redirect(url : URL, status : Number) : void`

Sends a redirect response with the given status to the client for the specified redirect location URL.

### redirect

**Signature:** `redirect(location : String) : void`

Sends a temporary redirect response (HTTP status 302) to the client for the specified redirect location URL.

### redirect

**Signature:** `redirect(location : String, status : Number) : void`

Sends a redirect response with the given status to the client for the specified redirect location URL.

### redirect

**Signature:** `redirect(redirect : URLRedirect) : void`

Sends a redirect response with the given status to the client for the specified redirect location URL.

### setBuffered

**Signature:** `setBuffered(buffered : boolean) : void`

Sets whether the output should be buffered or streamed directly to the client.

### setContentType

**Signature:** `setContentType(contentType : String) : void`

Sets the content type for this response.

### setExpires

**Signature:** `setExpires(expires : Number) : void`

Sets the cache expiration time for the response.

### setExpires

**Signature:** `setExpires(expires : Date) : void`

Convenience method for setExpires(Number) which takes a Date object.

### setHttpHeader

**Signature:** `setHttpHeader(name : String, value : String) : void`

Adds a response header with the given name and value.

### setStatus

**Signature:** `setStatus(status : Number) : void`

Sets the HTTP response code.

### setVaryBy

**Signature:** `setVaryBy(varyBy : String) : void`

Marks the response as personalized with the given variant identifier.

## Method Detail

## Method Details

### addHttpCookie

**Signature:** `addHttpCookie(cookie : Cookie) : void`

**Description:** Adds the specified cookie to the outgoing response. This method can be called multiple times to set more than one cookie. If a cookie with the same cookie name, domain and path is set multiple times for the same response, only the last set cookie with this name is sent to the client. This method can be used to set, update or delete cookies at the client. If the cookie doesn't exist at the client, it is set initially. If a cookie with the same name, domain and path already exists at the client, it is updated. A cookie can be deleted at the client by submitting a cookie with the maxAge attribute set to 0 (see Cookie.setMaxAge() for more information). Example, how a cookie can be deleted at the client: var cookie : Cookie = new Cookie("SomeName", "Simple Value"); cookie.setMaxAge(0); response.addHttpCookie(cookie); You can't set a cookie's SameSite attribute using the API. The server sets SameSite to None if either the developer sets the cookie's Secure flag or the global security preference Enforce HTTPS is enabled, in which case the Secure flag is also set. Otherwise, the server doesn't set the SameSite attribute and the browser uses its own default SameSite setting. The SameSite attribute is not sent with a cookie if the server detects that the client doesn't correctly interpret the attribute.

**Parameters:**

- `cookie`: a Cookie object

---

### addHttpHeader

**Signature:** `addHttpHeader(name : String, value : String) : void`

**Description:** Adds a response header with the given name and value. This method allows response headers to have multiple values. For public headers, only the names listed in the "Constants" section are allowed. Custom header names must begin with the prefix "X-SF-CC-" and can contain only alphanumeric characters, dash, and underscore.

**Parameters:**

- `name`: the name to use for the response header.
- `value`: the value to use.

---

### containsHttpHeader

**Signature:** `containsHttpHeader(name : String) : boolean`

**Description:** Checks whether the response message header has a field with the specified name.

**Parameters:**

- `name`: the name to use.

---

### getWriter

**Signature:** `getWriter() : PrintWriter`

**Description:** Returns a print writer which can be used to print content directly to the response.

---

### redirect

**Signature:** `redirect(url : URL) : void`

**Description:** Sends a temporary redirect response (HTTP status 302) to the client for the specified redirect location URL.

**Parameters:**

- `url`: the URL object for the target location, must be not null

---

### redirect

**Signature:** `redirect(url : URL, status : Number) : void`

**Description:** Sends a redirect response with the given status to the client for the specified redirect location URL.

**Parameters:**

- `url`: the URL object with the redirect location, must be not null
- `status`: the status code for this redirect, must be 301, 302 or 307

---

### redirect

**Signature:** `redirect(location : String) : void`

**Description:** Sends a temporary redirect response (HTTP status 302) to the client for the specified redirect location URL. The target location must be a relative or an absolute URL.

**Parameters:**

- `location`: the target location as a string, must be not empty

---

### redirect

**Signature:** `redirect(location : String, status : Number) : void`

**Description:** Sends a redirect response with the given status to the client for the specified redirect location URL.

**Parameters:**

- `location`: the redirect location, must be not empty
- `status`: the status code for this redirect, must be 301, 302 or 307

---

### redirect

**Signature:** `redirect(redirect : URLRedirect) : void`

**Description:** Sends a redirect response with the given status to the client for the specified redirect location URL.

**Parameters:**

- `redirect`: the URLRedirect object with the location and status, must be not null

---

### setBuffered

**Signature:** `setBuffered(buffered : boolean) : void`

**Description:** Sets whether the output should be buffered or streamed directly to the client. By default, buffering is enabled. The mode can only be changed before anything has been written to the response. Switching buffering off and using streaming mode is recommended for sending large responses.

**Parameters:**

- `buffered`: if true, buffering is used, if false the response will be streamed

---

### setContentType

**Signature:** `setContentType(contentType : String) : void`

**Description:** Sets the content type for this response. This method may only be called before any output is written to the response.

**Parameters:**

- `contentType`: the MIME type of the content, like "text/html", "application/json" etc.

---

### setExpires

**Signature:** `setExpires(expires : Number) : void`

**Description:** Sets the cache expiration time for the response. The response will only be cached if caching was not disabled previously. By default, responses are not cached. This method can be called multiple times during request processing. If caching is enabled, the lowest expiration time, resulting from the invocations of the method becomes the cache expiration time. This is only used for HTTP requests. Streamed responses cannot be cached. This method is an alternative for setting the cache time using the <iscache> tag in ISML templates.

**Parameters:**

- `expires`: the expiration time in milliseconds since January 1, 1970, 00:00:00 GMT

---

### setExpires

**Signature:** `setExpires(expires : Date) : void`

**Description:** Convenience method for setExpires(Number) which takes a Date object.

**Parameters:**

- `expires`: a Date object.

---

### setHttpHeader

**Signature:** `setHttpHeader(name : String, value : String) : void`

**Description:** Adds a response header with the given name and value. If one or more value(s) have already been set, the new value overwrites the previous one. The containsHttpHeader(String) method can be used to test for the presence of a header before setting its value. For public headers, only the names listed in the "Constants" section are allowed. Custom header names must begin with the prefix "X-SF-CC-" and can contain only alphanumeric characters, dash, and underscore.

**Parameters:**

- `name`: the name to use for the response header.
- `value`: the value to use.

---

### setStatus

**Signature:** `setStatus(status : Number) : void`

**Description:** Sets the HTTP response code.

**Parameters:**

- `status`: a standard-conform HTTP status code, for example 200 for "OK"

---

### setVaryBy

**Signature:** `setVaryBy(varyBy : String) : void`

**Description:** Marks the response as personalized with the given variant identifier. Commerce Cloud Digital identifies unique pages based on a combination of pricebook, promotion, sorting rule and A/B test segments, caches the different variants of the page, and then delivers the correct version to the user. If a page is personalized by means other than pricebook, promotion, sorting rule and A/B test, the page must not be cached, because the wrong variants of the page would be delivered to the user. For performance reasons, a page should only be marked as personalized if it really is. Otherwise, the performance can unnecessarily degrade. This method has the same effect as using <iscache varyby="price_promotion" /> tag in an ISML template. Once the vary-by value was set, either using this method or by the <iscache> tag in a template, the entire response is treated as personalized.

**Parameters:**

- `varyBy`: the variation criteria, currently only "price_promotion" is supported, any other value has no effect

---