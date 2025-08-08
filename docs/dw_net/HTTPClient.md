## Package: dw.net

# Class HTTPClient

## Inheritance Hierarchy

- Object
  - dw.net.HTTPClient

## Description

The HTTPClient class supports the HTTP methods GET, POST, HEAD, PUT, PATCH, OPTIONS, and DELETE. If a secure connection via HTTPS is established the used server certificate or the signing CAs certificate needs to be imported into the customer key store via Business Manager. Note: when this class is used with sensitive data, be careful in persisting sensitive information. Key selection for mutual TLS: Check if there is an explicit identity requested setIdentity(KeyRef) Else, Check if there is a mapping for hostname in the keystore Deprecated: Select an arbitrary private key from the keystore var httpClient : HTTPClient = new HTTPClient(); var message : String; httpClient.open('GET', 'http://www.myinstance.com/feed.xml'); httpClient.setTimeout(3000); httpClient.send(); if (httpClient.statusCode == 200) { message = httpClient.text; } else { // error handling message="An error occurred with status code "+httpClient.statusCode; }

## Constants

## Properties

### allowRedirect

**Type:** boolean

Determines whether redirect handling is enabled.

### allResponseHeaders

**Type:** HashMap (Read Only)

All response headers as a map containing the name and value of the response header.

### bytes

**Type:** Bytes (Read Only)

The bytes in the message body for HTTP status codes between 200 and 299.

### errorBytes

**Type:** Bytes (Read Only)

The returned message body as bytes for HTTP status code greater or equal to 400. Error messages are not
 written to the response file.

### errorText

**Type:** String (Read Only)

The returned message body as text for HTTP status code greater or equal to 400. Error messages are not
 written to the response file.

### hostNameVerification

**Type:** boolean

Determines whether host name verification is enabled.

### identity

**Type:** KeyRef

Gets the identity used for mutual TLS (mTLS).

### responseHeaders

**Type:** Map (Read Only)

All response headers as a map in which each entry represents an individual header. The key of the entry
 holds the header name and the entry value holds a list of all header values.

### statusCode

**Type:** Number (Read Only)

The status code of the last HTTP operation.

### statusMessage

**Type:** String (Read Only)

The message text of the last HTTP operation.

### text

**Type:** String (Read Only)

The returned message body as text for HTTP status codes between 200 and 299.

### timeout

**Type:** Number

The timeout for this client, in milliseconds.

## Constructor Summary

HTTPClient()

## Method Summary

### enableCaching

**Signature:** `enableCaching(ttl : Number) : void`

Calling this method enables caching for GET requests.

### getAllowRedirect

**Signature:** `getAllowRedirect() : boolean`

Determines whether redirect handling is enabled.

### getAllResponseHeaders

**Signature:** `getAllResponseHeaders() : HashMap`

Returns all response headers as a map containing the name and value of the response header.

### getBytes

**Signature:** `getBytes() : Bytes`

Returns the bytes in the message body for HTTP status codes between 200 and 299.

### getErrorBytes

**Signature:** `getErrorBytes() : Bytes`

Returns the returned message body as bytes for HTTP status code greater or equal to 400.

### getErrorText

**Signature:** `getErrorText() : String`

Returns the returned message body as text for HTTP status code greater or equal to 400.

### getHostNameVerification

**Signature:** `getHostNameVerification() : boolean`

Determines whether host name verification is enabled.

### getIdentity

**Signature:** `getIdentity() : KeyRef`

Gets the identity used for mutual TLS (mTLS).

### getResponseHeader

**Signature:** `getResponseHeader(header : String) : String`

Returns a specific response header from the last HTTP operation.

### getResponseHeaders

**Signature:** `getResponseHeaders(name : String) : List`

Returns all the values of a response header from the last HTTP operation as a list of strings.

### getResponseHeaders

**Signature:** `getResponseHeaders() : Map`

Returns all response headers as a map in which each entry represents an individual header.

### getStatusCode

**Signature:** `getStatusCode() : Number`

Returns the status code of the last HTTP operation.

### getStatusMessage

**Signature:** `getStatusMessage() : String`

Returns the message text of the last HTTP operation.

### getText

**Signature:** `getText() : String`

Returns the returned message body as text for HTTP status codes between 200 and 299.

### getText

**Signature:** `getText(encoding : String) : String`

Returns the returned message body as text for HTTP status codes between 200 and 299.

### getTimeout

**Signature:** `getTimeout() : Number`

Returns the timeout for this client, in milliseconds.

### open

**Signature:** `open(method : String, url : String) : void`

Opens the specified URL using the specified method.

### open

**Signature:** `open(method : String, url : String, async : boolean, user : String, password : String) : void`

Deprecated method.

### open

**Signature:** `open(method : String, url : String, user : String, password : String) : void`

Opens the specified URL with the in parameter method specified Http method with given credentials [user, password] using HTTP basic authentication.

### send

**Signature:** `send() : void`

Sends an HTTP request.

### send

**Signature:** `send(text : String) : void`

This method performs the actual HTTP communication.

### send

**Signature:** `send(text : String, encoding : String) : void`

This method performs the actual HTTP communication.

### send

**Signature:** `send(file : File) : void`

This method performs the actual HTTP communication.

### sendAndReceiveToFile

**Signature:** `sendAndReceiveToFile(file : File) : boolean`

This method performs the actual HTTP communication.

### sendAndReceiveToFile

**Signature:** `sendAndReceiveToFile(text : String, outFile : File) : boolean`

This method performs the actual HTTP communication.

### sendAndReceiveToFile

**Signature:** `sendAndReceiveToFile(text : String, encoding : String, outFile : File) : boolean`

This method performs the actual HTTP communication.

### sendBytes

**Signature:** `sendBytes(body : Bytes) : void`

This method performs the actual HTTP communication.

### sendBytesAndReceiveToFile

**Signature:** `sendBytesAndReceiveToFile(body : Bytes, outFile : File) : boolean`

This method performs the actual HTTP communication.

### sendMultiPart

**Signature:** `sendMultiPart(parts : HTTPRequestPart...) : boolean`

Sends a multipart HTTP request.

### setAllowRedirect

**Signature:** `setAllowRedirect(allowRedirect : boolean) : void`

Sets whether automatic HTTP redirect handling is enabled.

### setHostNameVerification

**Signature:** `setHostNameVerification(enable : boolean) : void`

Sets whether certificate host name verification is enabled.

### setIdentity

**Signature:** `setIdentity(keyRef : KeyRef) : void`

Sets the identity (private key) to use when mutual TLS (mTLS) is configured.

### setRequestHeader

**Signature:** `setRequestHeader(key : String, value : String) : void`

Sets a request header for the next HTTP operation.

### setTimeout

**Signature:** `setTimeout(timeoutMillis : Number) : void`

Sets the timeout for connections made with this client to the given number of milliseconds.

## Constructor Detail

## Method Detail

## Method Details

### enableCaching

**Signature:** `enableCaching(ttl : Number) : void`

**Description:** Calling this method enables caching for GET requests. It basically means that a response is cached, and before making a request the HTTP client looks into the cache to determine whether the response is already available. Only responses with a status code of 2xx, with a content length, with a size less than 50k, and which are not intended to be immediately written to a file are cached. The provided parameter defines the TTL (time to live) for the cached content. A value of 0 disables caching. The URL and the username are used as cache keys. The total size of the cacheable content and the number of cached items is limited and automatically managed by the system. Cache control information send by the remote server is ignored. Caching HTTP responses should be done very carefully. It is important to ensure that the response really depends only on the URL and doesn't contain any remote state information or time information which is independent of the URL. It is also important to verify that the application sends exactly the same URL multiple times.

**Parameters:**

- `ttl`: the TTL for the cached content in secs

---

### getAllowRedirect

**Signature:** `getAllowRedirect() : boolean`

**Description:** Determines whether redirect handling is enabled.

**Returns:**

true if redirect handling is enabled, false otherwise.

---

### getAllResponseHeaders

**Signature:** `getAllResponseHeaders() : HashMap`

**Description:** Returns all response headers as a map containing the name and value of the response header.

**Deprecated:**

Use getResponseHeaders() instead.

**Returns:**

a map containing the names and corresponding values of the response headers.

---

### getBytes

**Signature:** `getBytes() : Bytes`

**Description:** Returns the bytes in the message body for HTTP status codes between 200 and 299.

**Returns:**

the returned message body as bytes.

---

### getErrorBytes

**Signature:** `getErrorBytes() : Bytes`

**Description:** Returns the returned message body as bytes for HTTP status code greater or equal to 400. Error messages are not written to the response file.

**Returns:**

the returned message body as bytes.

---

### getErrorText

**Signature:** `getErrorText() : String`

**Description:** Returns the returned message body as text for HTTP status code greater or equal to 400. Error messages are not written to the response file.

**Returns:**

the returned message body as text.

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

### getResponseHeader

**Signature:** `getResponseHeader(header : String) : String`

**Description:** Returns a specific response header from the last HTTP operation. The method returns null if the specific header was not returned.

**Parameters:**

- `header`: the name of the response header to locate.

**Returns:**

the value of the specified header or null if the header cannot be found.

---

### getResponseHeaders

**Signature:** `getResponseHeaders(name : String) : List`

**Description:** Returns all the values of a response header from the last HTTP operation as a list of strings. This reflects the fact that a specific header, e.g. "Set-Cookie", may be set multiple times. In case there is no such header, the method returns an empty list.

**Parameters:**

- `name`: The name of the response header to locate.

**Returns:**

The values of the specified header as a list of strings or an empty list if the header cannot be found.

---

### getResponseHeaders

**Signature:** `getResponseHeaders() : Map`

**Description:** Returns all response headers as a map in which each entry represents an individual header. The key of the entry holds the header name and the entry value holds a list of all header values.

**Returns:**

A map containing the names and corresponding values of the response headers.

---

### getStatusCode

**Signature:** `getStatusCode() : Number`

**Description:** Returns the status code of the last HTTP operation.

**Returns:**

the status code of the last HTTP operation.

---

### getStatusMessage

**Signature:** `getStatusMessage() : String`

**Description:** Returns the message text of the last HTTP operation.

**Returns:**

the message text of the last HTTP operation.

---

### getText

**Signature:** `getText() : String`

**Description:** Returns the returned message body as text for HTTP status codes between 200 and 299.

**Returns:**

the returned message body as text.

---

### getText

**Signature:** `getText(encoding : String) : String`

**Description:** Returns the returned message body as text for HTTP status codes between 200 and 299.

**Parameters:**

- `encoding`: the character encoding to use.

**Returns:**

String the encoded String.

---

### getTimeout

**Signature:** `getTimeout() : Number`

**Description:** Returns the timeout for this client, in milliseconds.

**Returns:**

the timeout in milliseconds

---

### open

**Signature:** `open(method : String, url : String) : void`

**Description:** Opens the specified URL using the specified method. The following methods are supported: GET, POST, HEAD, PUT, PATCH, OPTIONS, and DELETE

**Parameters:**

- `method`: the method to use for opening the URL.
- `url`: the url to open.

---

### open

**Signature:** `open(method : String, url : String, async : boolean, user : String, password : String) : void`

**Description:** Deprecated method.

**Deprecated:**

Use open(String, String, String, String) instead.

**Parameters:**

- `method`: the method to use for opening the URL.
- `url`: the url to open.
- `async`: true if asynchronous.
- `user`: name of the user.
- `password`: password.

---

### open

**Signature:** `open(method : String, url : String, user : String, password : String) : void`

**Description:** Opens the specified URL with the in parameter method specified Http method with given credentials [user, password] using HTTP basic authentication. The following methods are supported: GET, POST, HEAD, PUT, PATCH, OPTIONS, and DELETE

**Parameters:**

- `method`: HTTP method
- `url`: the url
- `user`: name of the user
- `password`: password

---

### send

**Signature:** `send() : void`

**Description:** Sends an HTTP request.

---

### send

**Signature:** `send(text : String) : void`

**Description:** This method performs the actual HTTP communication. The text is sent as a request body. If the text is null no data will be sent to the HTTP server.

**Parameters:**

- `text`: text String to be sent as request body.

---

### send

**Signature:** `send(text : String, encoding : String) : void`

**Description:** This method performs the actual HTTP communication. The text is sent as a request body. If the text is null no data will be sent to the HTTP server.

**Parameters:**

- `text`: text String to be sent as request body.
- `encoding`: character encoding name.

---

### send

**Signature:** `send(file : File) : void`

**Description:** This method performs the actual HTTP communication. Sends the file to the HTTP server. The file content is sent as a request body and is sent "as-is" (text or binary).

**Parameters:**

- `file`: File to be sent.

---

### sendAndReceiveToFile

**Signature:** `sendAndReceiveToFile(file : File) : boolean`

**Description:** This method performs the actual HTTP communication. If the file is null no data will be sent to the HTTP server. If this method is used with a GET then the file parameter will contain the contents retrieved. When using this method with a PUT/POST then the contents of the file parameter will be sent to the server.

**Parameters:**

- `file`: local file used to read from or write to, depending on the method used.

**Returns:**

true if the returned code was a positive status code

---

### sendAndReceiveToFile

**Signature:** `sendAndReceiveToFile(text : String, outFile : File) : boolean`

**Description:** This method performs the actual HTTP communication. If the text is null no data will be sent to the HTTP server.

**Parameters:**

- `text`: text String to be sent.
- `outFile`: local file to write to.

**Returns:**

true if the returned code was a positive status code

---

### sendAndReceiveToFile

**Signature:** `sendAndReceiveToFile(text : String, encoding : String, outFile : File) : boolean`

**Description:** This method performs the actual HTTP communication. If the text is null no data will be sent to the HTTP server.

**Parameters:**

- `text`: text String to be sent.
- `encoding`: character encoding name.
- `outFile`: local file to write to.

**Returns:**

true if the returned code was a positive status code

---

### sendBytes

**Signature:** `sendBytes(body : Bytes) : void`

**Description:** This method performs the actual HTTP communication. The bytes are sent as a request body. If the bytes are null no data will be sent to the HTTP server.

**Parameters:**

- `body`: Bytes to be sent as request body.

---

### sendBytesAndReceiveToFile

**Signature:** `sendBytesAndReceiveToFile(body : Bytes, outFile : File) : boolean`

**Description:** This method performs the actual HTTP communication. If the body is null no data will be sent to the HTTP server.

**Parameters:**

- `body`: Bytes to be sent.
- `outFile`: local file to write to.

**Returns:**

true if the returned code was a positive status code

**Throws:**

- IOException

---

### sendMultiPart

**Signature:** `sendMultiPart(parts : HTTPRequestPart...) : boolean`

**Description:** Sends a multipart HTTP request. This method should only be called if the connection to the remote URL was opened with a POST or PATCH method. All other methods will result in an exception being thrown. The request is constructed from the passed array of parts.

**Parameters:**

- `parts`: List of part objects representing either string or file parts.

**Returns:**

true if the returned code was a positive status code.

---

### setAllowRedirect

**Signature:** `setAllowRedirect(allowRedirect : boolean) : void`

**Description:** Sets whether automatic HTTP redirect handling is enabled. The default value is true. Set it to false to disable all redirects.

**Parameters:**

- `allowRedirect`: true or false for enabling or disabling automatic HTTP redirect

---

### setHostNameVerification

**Signature:** `setHostNameVerification(enable : boolean) : void`

**Description:** Sets whether certificate host name verification is enabled. The default value is true. Set it to false to disable host name verification.

**Parameters:**

- `enable`: true to enable host name verification or false to disable it.

---

### setIdentity

**Signature:** `setIdentity(keyRef : KeyRef) : void`

**Description:** Sets the identity (private key) to use when mutual TLS (mTLS) is configured. If this is not set and mTLS is used then the private key will be chosen from the key store based on the host name. If this is set to a reference named "__NONE__" then no private key will be used even if one is requested by the remote server.

**Parameters:**

- `keyRef`: Reference to the private key

---

### setRequestHeader

**Signature:** `setRequestHeader(key : String, value : String) : void`

**Description:** Sets a request header for the next HTTP operation.

**Parameters:**

- `key`: the request header.
- `value`: the request headers' value.

---

### setTimeout

**Signature:** `setTimeout(timeoutMillis : Number) : void`

**Description:** Sets the timeout for connections made with this client to the given number of milliseconds. If the given timeout is less than or equal to zero, the timeout is set to a maximum value of 2 or 15 minutes, depending on the context. This timeout value controls both the "connection timeout" (how long it takes to connect to the remote host) and the "socket timeout" (how long, after connecting, it will wait without any data being read). Therefore, in the worst case scenario, the total time of inactivity could be twice as long as the specified value. The maximum timeout is 15 minutes when the client is used in a job, and 2 minutes otherwise. The default timeout for a new client is the maximum timeout value. This method can be called at any time, and will affect the next connection made with this client. It is not possible to set the timeout for an open connection. You should always set a reasonable timeout (e.g., a few seconds). Allowing connections to run long can result in thread exhaustion.

**Parameters:**

- `timeoutMillis`: timeout, in milliseconds, up to a maximum of 2 or 15 minutes, depending on the context.

---