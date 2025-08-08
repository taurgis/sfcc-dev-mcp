## Package: dw.web

# Class Cookie

## Inheritance Hierarchy

- Object
  - dw.web.Cookie

## Description

Represents an HTTP cookie used for storing information on a client browser. Cookies are passed along in the HTTP request and can be retrieved by calling dw.system.Request.getHttpCookies(). Cookies must comply with RFC6265. We recommend you use only printable ASCII characters without separators, such as a comma or equal sign. If JSON is used as a cookie value, it must be encoded. Note: this class allows access to sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12. See Request.getHttpCookies().

## Constants

## Properties

### comment

**Type:** String

The comment associated with the cookie.

### domain

**Type:** String

The domain associated with the cookie.

### httpOnly

**Type:** boolean

Identifies if the cookie is http-only.

### maxAge

**Type:** Number

The maximum age of the cookie, specified in seconds.
 By default, -1 indicating the cookie will persist until client shutdown.

### name

**Type:** String (Read Only)

The cookie's name.

### path

**Type:** String

The path for the cookie.

### secure

**Type:** boolean

Identifies if the cookie is secure.

### value

**Type:** String

The cookie's value.

### version

**Type:** Number

The version for the cookie. 0 means original Netscape cookie and
 1 means RFC 2109 compliant cookie.

## Constructor Summary

Cookie(name : String, value : String) Constructs a new cookie using the specified name and value.

## Method Summary

### getComment

**Signature:** `getComment() : String`

Returns the comment associated with the cookie.

### getDomain

**Signature:** `getDomain() : String`

Returns the domain associated with the cookie.

### getMaxAge

**Signature:** `getMaxAge() : Number`

Returns the maximum age of the cookie, specified in seconds.

### getName

**Signature:** `getName() : String`

Returns the cookie's name.

### getPath

**Signature:** `getPath() : String`

Returns the path for the cookie.

### getSecure

**Signature:** `getSecure() : boolean`

Identifies if the cookie is secure.

### getValue

**Signature:** `getValue() : String`

Returns the cookie's value.

### getVersion

**Signature:** `getVersion() : Number`

Returns the version for the cookie.

### isHttpOnly

**Signature:** `isHttpOnly() : boolean`

Identifies if the cookie is http-only.

### setComment

**Signature:** `setComment(comment : String) : void`

Sets the comment associated with the cookie.

### setDomain

**Signature:** `setDomain(domain : String) : void`

Sets the domain associated with the cookie.

### setHttpOnly

**Signature:** `setHttpOnly(httpOnly : boolean) : void`

Sets the http-only state for the cookie.

### setMaxAge

**Signature:** `setMaxAge(age : Number) : void`

Sets the maximum age of the cookie in seconds.

### setPath

**Signature:** `setPath(path : String) : void`

Sets the path for the cookie.

### setSecure

**Signature:** `setSecure(secure : boolean) : void`

Sets the secure state for the cookie.

### setValue

**Signature:** `setValue(value : String) : void`

Sets the cookie's value.

### setVersion

**Signature:** `setVersion(version : Number) : void`

Sets the version for the cookie.

## Constructor Detail

## Method Detail

## Method Details

### getComment

**Signature:** `getComment() : String`

**Description:** Returns the comment associated with the cookie.

**Returns:**

the comment associated with the cookie.

---

### getDomain

**Signature:** `getDomain() : String`

**Description:** Returns the domain associated with the cookie.

**Returns:**

the domain associated with the cookie.

---

### getMaxAge

**Signature:** `getMaxAge() : Number`

**Description:** Returns the maximum age of the cookie, specified in seconds. By default, -1 indicating the cookie will persist until client shutdown.

**Returns:**

an integer specifying the maximum age of the cookie in seconds; if negative, means the cookie persists until client shutdown

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the cookie's name.

**Returns:**

the cookie's name.

---

### getPath

**Signature:** `getPath() : String`

**Description:** Returns the path for the cookie.

**Returns:**

the path for the cookie.

---

### getSecure

**Signature:** `getSecure() : boolean`

**Description:** Identifies if the cookie is secure.

**Returns:**

true if the cookie is secure, false otherwise.

---

### getValue

**Signature:** `getValue() : String`

**Description:** Returns the cookie's value.

**Returns:**

the cookie's value.

---

### getVersion

**Signature:** `getVersion() : Number`

**Description:** Returns the version for the cookie. 0 means original Netscape cookie and 1 means RFC 2109 compliant cookie.

**Returns:**

the version for the cookie.

---

### isHttpOnly

**Signature:** `isHttpOnly() : boolean`

**Description:** Identifies if the cookie is http-only.

**Returns:**

true if the cookie is http-only, false otherwise.

---

### setComment

**Signature:** `setComment(comment : String) : void`

**Description:** Sets the comment associated with the cookie. Setting a comment automatically changes the cookie to be a RFC 2109 (set-cookie2) compliant cookie, because comments are only supported with RFC cookies and not with Netscapes original cookie.

**Parameters:**

- `comment`: the comment associated with the cookie.

---

### setDomain

**Signature:** `setDomain(domain : String) : void`

**Description:** Sets the domain associated with the cookie.

**Parameters:**

- `domain`: the comment associated with the cookie.

---

### setHttpOnly

**Signature:** `setHttpOnly(httpOnly : boolean) : void`

**Description:** Sets the http-only state for the cookie.

**Parameters:**

- `httpOnly`: sets http-only state for the cookie.

---

### setMaxAge

**Signature:** `setMaxAge(age : Number) : void`

**Description:** Sets the maximum age of the cookie in seconds. A positive value indicates that the cookie will expire after that many seconds have passed. Note that the value is the maximum age when the cookie will expire, not the cookie's current age. A negative value means that the cookie is not stored persistently and will be deleted when the client exits. A zero value causes the cookie to be deleted.

**Parameters:**

- `age`: an integer specifying the maximum age of the cookie in seconds; if negative, means the cookie is not stored; if zero, deletes the cookie

---

### setPath

**Signature:** `setPath(path : String) : void`

**Description:** Sets the path for the cookie.

**Parameters:**

- `path`: the path for the cookie.

---

### setSecure

**Signature:** `setSecure(secure : boolean) : void`

**Description:** Sets the secure state for the cookie.

**Parameters:**

- `secure`: sets secure state for the cookie.

---

### setValue

**Signature:** `setValue(value : String) : void`

**Description:** Sets the cookie's value.

**Parameters:**

- `value`: the value to set in the cookie.

---

### setVersion

**Signature:** `setVersion(version : Number) : void`

**Description:** Sets the version for the cookie. 0 means original Netscape cookie and 1 means RFC 2109 compliant cookie. The default is 0.

**Parameters:**

- `version`: the version for the cookie.

---