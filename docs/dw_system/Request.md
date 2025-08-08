## Package: dw.system

# Class Request

## Inheritance Hierarchy

- Object
  - dw.system.Request

## Description

Represents a request in Commerce Cloud Digital. Each pipeline dictionary contains a CurrentRequest object, which is of type dw.system.Request. Most requests are HTTP requests, so you can use this object to get information about the HTTP request, such as the HTTP headers. You can also get a list of cookies, if any, associated with the request. If the request is issued from a job, the request is not an HTTP request, so HTTP-related methods return null.

## Properties

### clientId

**Type:** String (Read Only)

The client id of the current SCAPI or OCAPI request. If the request is not a SCAPI request or not an
 OCAPI request 'null' is returned. For client ids owned by Commerce Cloud Digital an alias is returned.

### custom

**Type:** CustomAttributes (Read Only)

All of the custom attributes associated with the request. The attributes are stored for the life time of
 the request.

### geolocation

**Type:** Geolocation

The physical location for the current request, if available. The
 location is calculated based on the IP address of the request. Note, if
 the geolocation tracking feature is not enabled, this method always
 returns null.

### httpCookies

**Type:** Cookies (Read Only)

The Cookies object, which can be used to read cookies sent by the client. Use the method
 Response.addHttpCookie() to add a cookie to the outgoing response.

### httpHeaders

**Type:** Map (Read Only)

A Map containing all HTTP header values.

### httpHost

**Type:** String (Read Only)

The host name or null if there is no host name.

### httpLocale

**Type:** String (Read Only)

The locale or null if there is no associated locale.

### httpMethod

**Type:** String (Read Only)

The name of the HTTP method with which this request was made, for example, GET, POST, or PUT.

### httpParameterMap

**Type:** HttpParameterMap (Read Only)

The parameter map that contains the HTTP parameters for the current request.

### httpParameters

**Type:** Map (Read Only)

A Map containing the raw HTTP parameters sent to the server. The Map contains name/value pairs. Each name
 is a String and each value is a String array.

### httpPath

**Type:** String (Read Only)

The path.

### httpProtocol

**Type:** String (Read Only)

The HTTP protocol used for this request. Possible values are "http" or "https". If the current activity
 is not related to an HTTP request, for example, when the request is part of a job, this method returns null.

### httpQueryString

**Type:** String (Read Only)

The query string or null if there is no query string.

### httpReferer

**Type:** String (Read Only)

The referer or null if there is no referer.

### httpRemoteAddress

**Type:** String (Read Only)

The remote address or null if no remote address is found.

### httpRequest

**Type:** boolean (Read Only)

Identifies if this request is an HTTP request. The method returns true, if the current processing is related to a
 HTTP request.

### httpSecure

**Type:** boolean (Read Only)

Returns whether the HTTP communication is secure, which basically means that the communication happens via https.
 If the current activity is not related to an HTTP request the method returns false.

### httpURL

**Type:** URL (Read Only)

The complete URL of the request which was received at the server.
 This URL does not include SEO optimizations.

### httpUserAgent

**Type:** String (Read Only)

The HTTP user agent or null if there is no user agent.

### includeRequest

**Type:** boolean (Read Only)

Returns true if the request represents a request for a remote include, false if it is a top-level request.

### locale

**Type:** String

The locale of the current request. This locale is set by the system based on the information in the URL.
 It may be different from the locale returned by getHttpLocale(), which is the preferred locale sent by the user agent.

### ocapiVersion

**Type:** String (Read Only)

The OCAPI version of the current request. If this is not
 an OCAPI request, 'null' is returned.

### pageMetaData

**Type:** PageMetaData (Read Only)

The page meta data that are associated with the current request.

### requestID

**Type:** String (Read Only)

The unique identifier of the current request. The unique id is helpful for debugging purpose, e.g. relate
 debug messages to a particular request.

### SCAPI

**Type:** boolean (Read Only)

Returns whether the request originated in SCAPI.

### SCAPIPathParameters

**Type:** Map (Read Only)

A map containing all path parameters of current SCAPI request in the following way:
 
 keys: path parameter names from path pattern
 values: corresponding path parameter values from current request
 

 Returns null if isSCAPI() returns false i.e. if the request is not a SCAPI request.
 

 For example:
 
 Current request: /product/shopper-products/v1/organizations/sfcc_org/products/apple-ipod-shuffle
 Path pattern: /product/shopper-products/v1/organizations/{organizationId}/products/{id}
 Result: Map with 2 key:value pairs: organizationId:sfcc_org and id:apple-ipod-shuffle.

### SCAPIPathPattern

**Type:** String (Read Only)

The SCAPI path pattern in the following way:

 
 The first three segments /api-family/api-name/version with concrete values.
 The /organizations part with the path parameter name organizationId in curly brackets.
 The actual resource path additional path parameter names in curly brackets.
 

 Returns null if isSCAPI() returns false i.e. if the request is not a SCAPI request.
 

 For example, in the context of a request to get a single product from shopper-products API, this method would
 return /product/shopper-products/v1/organizations/{organizationId}/products/{id}

### session

**Type:** Session (Read Only)

The session associated with this request.

### triggeredForm

**Type:** Form (Read Only)

The form that was submitted by the client if the request represents a form submission.

### triggeredFormAction

**Type:** FormAction (Read Only)

The form action that was triggered by the client if the request represents a form submission.

## Constructor Summary

## Method Summary

### addHttpCookie

**Signature:** `addHttpCookie(cookie : Cookie) : void`

Adds the specified cookie to the outgoing response.

### getClientId

**Signature:** `getClientId() : String`

Returns the client id of the current SCAPI or OCAPI request.

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns all of the custom attributes associated with the request.

### getGeolocation

**Signature:** `getGeolocation() : Geolocation`

Returns the physical location for the current request, if available.

### getHttpCookies

**Signature:** `getHttpCookies() : Cookies`

Returns the Cookies object, which can be used to read cookies sent by the client.

### getHttpHeaders

**Signature:** `getHttpHeaders() : Map`

Returns a Map containing all HTTP header values.

### getHttpHost

**Signature:** `getHttpHost() : String`

Returns the host name or null if there is no host name.

### getHttpLocale

**Signature:** `getHttpLocale() : String`

Returns the locale or null if there is no associated locale.

### getHttpMethod

**Signature:** `getHttpMethod() : String`

Returns the name of the HTTP method with which this request was made, for example, GET, POST, or PUT.

### getHttpParameterMap

**Signature:** `getHttpParameterMap() : HttpParameterMap`

Returns the parameter map that contains the HTTP parameters for the current request.

### getHttpParameters

**Signature:** `getHttpParameters() : Map`

Returns a Map containing the raw HTTP parameters sent to the server.

### getHttpPath

**Signature:** `getHttpPath() : String`

Returns the path.

### getHttpProtocol

**Signature:** `getHttpProtocol() : String`

Returns the HTTP protocol used for this request.

### getHttpQueryString

**Signature:** `getHttpQueryString() : String`

Returns the query string or null if there is no query string.

### getHttpReferer

**Signature:** `getHttpReferer() : String`

Returns the referer or null if there is no referer.

### getHttpRemoteAddress

**Signature:** `getHttpRemoteAddress() : String`

Returns the remote address or null if no remote address is found.

### getHttpURL

**Signature:** `getHttpURL() : URL`

Returns the complete URL of the request which was received at the server.

### getHttpUserAgent

**Signature:** `getHttpUserAgent() : String`

Returns the HTTP user agent or null if there is no user agent.

### getLocale

**Signature:** `getLocale() : String`

Returns the locale of the current request.

### getOcapiVersion

**Signature:** `getOcapiVersion() : String`

Returns the OCAPI version of the current request.

### getPageMetaData

**Signature:** `getPageMetaData() : PageMetaData`

Returns the page meta data that are associated with the current request.

### getRequestID

**Signature:** `getRequestID() : String`

Returns the unique identifier of the current request.

### getSCAPIPathParameters

**Signature:** `getSCAPIPathParameters() : Map`

Returns a map containing all path parameters of current SCAPI request in the following way: keys: path parameter names from path pattern values: corresponding path parameter values from current request Returns null if isSCAPI() returns false i.e.

### getSCAPIPathPattern

**Signature:** `getSCAPIPathPattern() : String`

Returns the SCAPI path pattern in the following way: The first three segments /api-family/api-name/version with concrete values. The /organizations part with the path parameter name organizationId in curly brackets. The actual resource path additional path parameter names in curly brackets. Returns null if isSCAPI() returns false i.e.

### getSession

**Signature:** `getSession() : Session`

Returns the session associated with this request.

### getTriggeredForm

**Signature:** `getTriggeredForm() : Form`

Returns the form that was submitted by the client if the request represents a form submission.

### getTriggeredFormAction

**Signature:** `getTriggeredFormAction() : FormAction`

Returns the form action that was triggered by the client if the request represents a form submission.

### isHttpRequest

**Signature:** `isHttpRequest() : boolean`

Identifies if this request is an HTTP request.

### isHttpSecure

**Signature:** `isHttpSecure() : boolean`

Returns whether the HTTP communication is secure, which basically means that the communication happens via https.

### isIncludeRequest

**Signature:** `isIncludeRequest() : boolean`

Returns true if the request represents a request for a remote include, false if it is a top-level request.

### isSCAPI

**Signature:** `isSCAPI() : boolean`

Returns whether the request originated in SCAPI.

### setGeolocation

**Signature:** `setGeolocation(geoLocation : Geolocation) : void`

Sets the physical location for the current request and remembers the new value for the duration of the user session.

### setLocale

**Signature:** `setLocale(localeID : String) : boolean`

Sets the given locale for the request.

## Method Detail

## Method Details

### addHttpCookie

**Signature:** `addHttpCookie(cookie : Cookie) : void`

**Description:** Adds the specified cookie to the outgoing response. This method can be called multiple times to set more than one cookie. If a cookie with the same cookie name, domain and path is set multiple times for the same response, only the last set cookie with this name is send to the client. This method can be used to set, update or delete cookies at the client. If the cookie doesn't exist at the client, it is set initially. If a cookie with the same name, domain and path already exists at the client, it is updated. A cookie can be deleted at the client by submitting a cookie with the maxAge attribute set to 0 (see Cookie.setMaxAge() for more information). Example, how a cookie can be deleted at the client: var cookie : Cookie = new Cookie("SomeName", "Simple Value"); cookie.setMaxAge(0); request.addHttpCookie(cookie);

**Deprecated:**

Use Response.addHttpCookie(Cookie) instead.

**Parameters:**

- `cookie`: a Cookie object

---

### getClientId

**Signature:** `getClientId() : String`

**Description:** Returns the client id of the current SCAPI or OCAPI request. If the request is not a SCAPI request or not an OCAPI request 'null' is returned. For client ids owned by Commerce Cloud Digital an alias is returned.

**Returns:**

a client id or alias in case of an OCAPI request, otherwise null.

---

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns all of the custom attributes associated with the request. The attributes are stored for the life time of the request.

**Returns:**

all of the custom attributes associated with the request.

---

### getGeolocation

**Signature:** `getGeolocation() : Geolocation`

**Description:** Returns the physical location for the current request, if available. The location is calculated based on the IP address of the request. Note, if the geolocation tracking feature is not enabled, this method always returns null.

**Returns:**

The geolocation of the current request, or null if this is not available.

---

### getHttpCookies

**Signature:** `getHttpCookies() : Cookies`

**Description:** Returns the Cookies object, which can be used to read cookies sent by the client. Use the method Response.addHttpCookie() to add a cookie to the outgoing response.

**Returns:**

Cookies object or null if this is not an HTTP request

---

### getHttpHeaders

**Signature:** `getHttpHeaders() : Map`

**Description:** Returns a Map containing all HTTP header values.

**Returns:**

a Map containing all HTTP header values.

---

### getHttpHost

**Signature:** `getHttpHost() : String`

**Description:** Returns the host name or null if there is no host name.

**Returns:**

the host name or null if there is no host name.

---

### getHttpLocale

**Signature:** `getHttpLocale() : String`

**Description:** Returns the locale or null if there is no associated locale.

**Returns:**

the locale or null.

---

### getHttpMethod

**Signature:** `getHttpMethod() : String`

**Description:** Returns the name of the HTTP method with which this request was made, for example, GET, POST, or PUT.

**Returns:**

the HTTP method

---

### getHttpParameterMap

**Signature:** `getHttpParameterMap() : HttpParameterMap`

**Description:** Returns the parameter map that contains the HTTP parameters for the current request.

**Returns:**

the HTTP parameter map

---

### getHttpParameters

**Signature:** `getHttpParameters() : Map`

**Description:** Returns a Map containing the raw HTTP parameters sent to the server. The Map contains name/value pairs. Each name is a String and each value is a String array.

**Returns:**

a Map containing all the raw HTTP parameters send to the server.

---

### getHttpPath

**Signature:** `getHttpPath() : String`

**Description:** Returns the path.

**Returns:**

the path or null.

---

### getHttpProtocol

**Signature:** `getHttpProtocol() : String`

**Description:** Returns the HTTP protocol used for this request. Possible values are "http" or "https". If the current activity is not related to an HTTP request, for example, when the request is part of a job, this method returns null.

**Returns:**

"http", "https" or null

---

### getHttpQueryString

**Signature:** `getHttpQueryString() : String`

**Description:** Returns the query string or null if there is no query string.

**Returns:**

the query string or null.

---

### getHttpReferer

**Signature:** `getHttpReferer() : String`

**Description:** Returns the referer or null if there is no referer.

**Returns:**

the referer or null if there is no referer.

---

### getHttpRemoteAddress

**Signature:** `getHttpRemoteAddress() : String`

**Description:** Returns the remote address or null if no remote address is found.

**Returns:**

the remote address or null if no remote address is found.

---

### getHttpURL

**Signature:** `getHttpURL() : URL`

**Description:** Returns the complete URL of the request which was received at the server. This URL does not include SEO optimizations.

**Returns:**

the URL as URL object

---

### getHttpUserAgent

**Signature:** `getHttpUserAgent() : String`

**Description:** Returns the HTTP user agent or null if there is no user agent.

**Returns:**

the HTTP user agent or null if there is no user agent.

---

### getLocale

**Signature:** `getLocale() : String`

**Description:** Returns the locale of the current request. This locale is set by the system based on the information in the URL. It may be different from the locale returned by getHttpLocale(), which is the preferred locale sent by the user agent.

**Returns:**

the locale of the current request, like 'en_US'

---

### getOcapiVersion

**Signature:** `getOcapiVersion() : String`

**Description:** Returns the OCAPI version of the current request. If this is not an OCAPI request, 'null' is returned.

**Returns:**

OCAPI version of the current request

---

### getPageMetaData

**Signature:** `getPageMetaData() : PageMetaData`

**Description:** Returns the page meta data that are associated with the current request.

**Returns:**

the page meta data object

---

### getRequestID

**Signature:** `getRequestID() : String`

**Description:** Returns the unique identifier of the current request. The unique id is helpful for debugging purpose, e.g. relate debug messages to a particular request.

**Returns:**

the unique identifier of the current request.

---

### getSCAPIPathParameters

**Signature:** `getSCAPIPathParameters() : Map`

**Description:** Returns a map containing all path parameters of current SCAPI request in the following way: keys: path parameter names from path pattern values: corresponding path parameter values from current request Returns null if isSCAPI() returns false i.e. if the request is not a SCAPI request. For example: Current request: /product/shopper-products/v1/organizations/sfcc_org/products/apple-ipod-shuffle Path pattern: /product/shopper-products/v1/organizations/{organizationId}/products/{id} Result: Map with 2 key:value pairs: organizationId:sfcc_org and id:apple-ipod-shuffle.

**Returns:**

the path parameter map or null

---

### getSCAPIPathPattern

**Signature:** `getSCAPIPathPattern() : String`

**Description:** Returns the SCAPI path pattern in the following way: The first three segments /api-family/api-name/version with concrete values. The /organizations part with the path parameter name organizationId in curly brackets. The actual resource path additional path parameter names in curly brackets. Returns null if isSCAPI() returns false i.e. if the request is not a SCAPI request. For example, in the context of a request to get a single product from shopper-products API, this method would return /product/shopper-products/v1/organizations/{organizationId}/products/{id}

**Returns:**

the path pattern or null.

---

### getSession

**Signature:** `getSession() : Session`

**Description:** Returns the session associated with this request.

**Returns:**

the session associated with this request.

---

### getTriggeredForm

**Signature:** `getTriggeredForm() : Form`

**Description:** Returns the form that was submitted by the client if the request represents a form submission.

**Returns:**

the form which was triggered

---

### getTriggeredFormAction

**Signature:** `getTriggeredFormAction() : FormAction`

**Description:** Returns the form action that was triggered by the client if the request represents a form submission.

**Returns:**

the action of the form that was triggered

---

### isHttpRequest

**Signature:** `isHttpRequest() : boolean`

**Description:** Identifies if this request is an HTTP request. The method returns true, if the current processing is related to a HTTP request.

**Deprecated:**

Effectively always returns true.

**Returns:**

true if the current processing is related to a HTTP request, false otherwise.

---

### isHttpSecure

**Signature:** `isHttpSecure() : boolean`

**Description:** Returns whether the HTTP communication is secure, which basically means that the communication happens via https. If the current activity is not related to an HTTP request the method returns false.

---

### isIncludeRequest

**Signature:** `isIncludeRequest() : boolean`

**Description:** Returns true if the request represents a request for a remote include, false if it is a top-level request.

---

### isSCAPI

**Signature:** `isSCAPI() : boolean`

**Description:** Returns whether the request originated in SCAPI.

**Returns:**

true or false.

---

### setGeolocation

**Signature:** `setGeolocation(geoLocation : Geolocation) : void`

**Description:** Sets the physical location for the current request and remembers the new value for the duration of the user session. So any subsequent calls to getGeolocation() will return this value

**Parameters:**

- `geoLocation`: the geolocation object to use

---

### setLocale

**Signature:** `setLocale(localeID : String) : boolean`

**Description:** Sets the given locale for the request. The locale is only set if it is valid, if it is active and if it is allowed for the current site.

**Parameters:**

- `localeID`: the locale ID to be set, like 'en_US'

**Returns:**

true, if the locale was successfully set, false otherwise

---