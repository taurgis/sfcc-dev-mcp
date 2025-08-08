## Package: dw.svc

# Class HTTPService

## Inheritance Hierarchy

- Object
  - dw.svc.Service
  - dw.svc.HTTPService

## Description

Represents an HTTP Service. The HTTP Service will use the return value of the createRequest callback as the request body (if supported by the HTTP method). If this is an array of non-null HTTPRequestPart objects, then a multi-part request will be formed. Otherwise the object is converted to a String and used. See also XML.toXMLString() and JSON.stringify(Object), which must be explicitly called if needed.

## Properties

### authentication

**Type:** String

The authentication type.

### cachingTTL

**Type:** Number

The caching time to live value.

### client

**Type:** HTTPClient (Read Only)

The underlying HTTP client object.

### encoding

**Type:** String

The request body encoding to declare.

### hostNameVerification

**Type:** boolean

Determines whether host name verification is enabled.

### identity

**Type:** KeyRef

Gets the identity used for mutual TLS (mTLS).

### outFile

**Type:** File

The output file, or null if there is none.

### requestMethod

**Type:** String

The request method.

## Constructor Summary

## Method Summary

### addHeader

**Signature:** `addHeader(name : String, val : String) : HTTPService`

Adds an HTTP Header.

### addParam

**Signature:** `addParam(name : String, val : String) : HTTPService`

Adds a query parameter that will be appended to the URL.

### getAuthentication

**Signature:** `getAuthentication() : String`

Returns the authentication type.

### getCachingTTL

**Signature:** `getCachingTTL() : Number`

Returns the caching time to live value.

### getClient

**Signature:** `getClient() : HTTPClient`

Returns the underlying HTTP client object.

### getEncoding

**Signature:** `getEncoding() : String`

Returns the request body encoding to declare.

### getHostNameVerification

**Signature:** `getHostNameVerification() : boolean`

Determines whether host name verification is enabled.

### getIdentity

**Signature:** `getIdentity() : KeyRef`

Gets the identity used for mutual TLS (mTLS).

### getOutFile

**Signature:** `getOutFile() : File`

Returns the output file, or null if there is none.

### getRequestMethod

**Signature:** `getRequestMethod() : String`

Returns the request method.

### setAuthentication

**Signature:** `setAuthentication(authentication : String) : HTTPService`

Sets the type of authentication.

### setCachingTTL

**Signature:** `setCachingTTL(ttl : Number) : HTTPService`

Enables caching for GET requests.

### setEncoding

**Signature:** `setEncoding(encoding : String) : HTTPService`

Sets the encoding of the request body (if any).

### setHostNameVerification

**Signature:** `setHostNameVerification(enable : boolean) : HTTPService`

Sets whether certificate host name verification is enabled.

### setIdentity

**Signature:** `setIdentity(keyRef : KeyRef) : HTTPService`

Sets the identity (private key) to use when mutual TLS (mTLS) is configured.

### setOutFile

**Signature:** `setOutFile(outFile : File) : HTTPService`

Sets the output file in which to write the HTTP response body.

### setRequestMethod

**Signature:** `setRequestMethod(requestMethod : String) : HTTPService`

Sets the HTTP request method.

## Method Detail

## Method Details

### addHeader

**Signature:** `addHeader(name : String, val : String) : HTTPService`

**Description:** Adds an HTTP Header.

**Parameters:**

- `name`: Header name.
- `val`: Header value.

**Returns:**

this HTTP Service.

---

### addParam

**Signature:** `addParam(name : String, val : String) : HTTPService`

**Description:** Adds a query parameter that will be appended to the URL.

**Parameters:**

- `name`: Parameter name.
- `val`: Parameter value.

**Returns:**

this HTTP Service.

---

### getAuthentication

**Signature:** `getAuthentication() : String`

**Description:** Returns the authentication type.

**Returns:**

Authentication type.

---

### getCachingTTL

**Signature:** `getCachingTTL() : Number`

**Description:** Returns the caching time to live value.

**Returns:**

The caching time to live value in seconds.

**See Also:**

setCachingTTL(Number)

---

### getClient

**Signature:** `getClient() : HTTPClient`

**Description:** Returns the underlying HTTP client object.

**Returns:**

HTTP client object.

---

### getEncoding

**Signature:** `getEncoding() : String`

**Description:** Returns the request body encoding to declare.

**Returns:**

Request encoding.

---

### getHostNameVerification

**Signature:** `getHostNameVerification() : boolean`

**Description:** Determines whether host name verification is enabled.

**Returns:**

true if verification is enabled, false otherwise

---

### getIdentity

**Signature:** `getIdentity() : KeyRef`

**Description:** Gets the identity used for mutual TLS (mTLS).

**Returns:**

Reference to the private key, or null if not configured

---

### getOutFile

**Signature:** `getOutFile() : File`

**Description:** Returns the output file, or null if there is none.

**Returns:**

Output file or null.

---

### getRequestMethod

**Signature:** `getRequestMethod() : String`

**Description:** Returns the request method.

**Returns:**

HTTP Request method.

---

### setAuthentication

**Signature:** `setAuthentication(authentication : String) : HTTPService`

**Description:** Sets the type of authentication. Valid values include "BASIC" and "NONE". The default value is BASIC.

**Parameters:**

- `authentication`: Type of authentication.

**Returns:**

this HTTP Service.

---

### setCachingTTL

**Signature:** `setCachingTTL(ttl : Number) : HTTPService`

**Description:** Enables caching for GET requests. This only caches status codes 2xx with a content length and size of less than 50k that are not immediately written to file. The URL and the user name are used as cache keys. The total size of cacheable content and the number of cached items is limited and automatically managed by the system. Cache control information sent by the remote server is ignored. Caching HTTP responses should be done very carefully. It is important to ensure that the response really depends only on the URL and doesn't contain any remote state information or time information which is independent of the URL. It is also important to verify that the application sends exactly the same URL multiple times.

**Parameters:**

- `ttl`: The time to live for the cached content in seconds. A value of 0 disables caching.

**See Also:**

HTTPClient.enableCaching(Number)

---

### setEncoding

**Signature:** `setEncoding(encoding : String) : HTTPService`

**Description:** Sets the encoding of the request body (if any). The default value is UTF-8.

**Parameters:**

- `encoding`: Encoding of the request body.

**Returns:**

this HTTP Service.

---

### setHostNameVerification

**Signature:** `setHostNameVerification(enable : boolean) : HTTPService`

**Description:** Sets whether certificate host name verification is enabled. The default value is true. Set it to false to disable host name verification.

**Parameters:**

- `enable`: true to enable host name verification or false to disable it.

**Returns:**

this HTTP Service.

---

### setIdentity

**Signature:** `setIdentity(keyRef : KeyRef) : HTTPService`

**Description:** Sets the identity (private key) to use when mutual TLS (mTLS) is configured. If this is not set and mTLS is used then the private key will be chosen from the key store based on the host name. If this is set to a reference named "__NONE__" then no private key will be used even if one is requested by the remote server.

**Parameters:**

- `keyRef`: Reference to the private key

---

### setOutFile

**Signature:** `setOutFile(outFile : File) : HTTPService`

**Description:** Sets the output file in which to write the HTTP response body. The default behavior is to not write a file.

**Parameters:**

- `outFile`: Output file, or null to disable.

**Returns:**

this HTTP Service.

---

### setRequestMethod

**Signature:** `setRequestMethod(requestMethod : String) : HTTPService`

**Description:** Sets the HTTP request method. Valid values include GET, PUT, POST, and DELETE. The default value is POST.

**Parameters:**

- `requestMethod`: HTTP request method.

**Returns:**

this HTTP Service.

---