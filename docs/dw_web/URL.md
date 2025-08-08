## Package: dw.web

# Class URL

## Inheritance Hierarchy

- Object
  - dw.web.URL

## Description

Represents a URL in Commerce Cloud Digital.

## Constructor Summary

## Method Summary

### abs

**Signature:** `abs() : URL`

Makes the URL absolute and ensures that the protocol of the request is used or http in a mail context.

### append

**Signature:** `append(name : String, value : String) : URL`

Append a request parameter to this URL.

### appendCSRFTokenBM

**Signature:** `appendCSRFTokenBM() : URL`

Appends, if applicable, a CSRF protection token to this URL.

### host

**Signature:** `host(host : String) : URL`

Updates the URL with the specified host name Note: This method is not applicable for static content or image transformation URLs.

### http

**Signature:** `http() : URL`

Makes the URL absolute and ensures that the protocol http is used.

### https

**Signature:** `https() : URL`

Makes the URL absolute and ensures that the protocol https is used.

### relative

**Signature:** `relative() : URL`

Makes the URL relative.

### remove

**Signature:** `remove(name : String) : URL`

Remove a request parameter from this URL.

### siteHost

**Signature:** `siteHost() : URL`

Updates the URL with the site host name Note: This method is not applicable for static content or image transformation URLs.

### toString

**Signature:** `toString() : String`

Return String representation of the URL.

## Method Detail

## Method Details

### abs

**Signature:** `abs() : URL`

**Description:** Makes the URL absolute and ensures that the protocol of the request is used or http in a mail context. Note: This method is not applicable for static content or image transformation URLs. In this case a runtime exception is thrown.

**Returns:**

A new URL instance.

---

### append

**Signature:** `append(name : String, value : String) : URL`

**Description:** Append a request parameter to this URL.

**Parameters:**

- `name`: The parameter name. Must not be null.
- `value`: The parameter value. If null, then treated as empty value.

**Returns:**

A reference to this URL.

---

### appendCSRFTokenBM

**Signature:** `appendCSRFTokenBM() : URL`

**Description:** Appends, if applicable, a CSRF protection token to this URL. The CSRF token will only be appended under the following conditions: the URL is a pipeline URL the URL is for Business Manager If a CSRF token already exists in the URL, it will be replaced with a newly generated one.

**Returns:**

a reference to this URL, with a CSRF token appended if applicable.

---

### host

**Signature:** `host(host : String) : URL`

**Description:** Updates the URL with the specified host name Note: This method is not applicable for static content or image transformation URLs. In this case a runtime exception is thrown.

**Parameters:**

- `host`: The host name that is used to update the URL.

**Returns:**

A new URL instance.

---

### http

**Signature:** `http() : URL`

**Description:** Makes the URL absolute and ensures that the protocol http is used. Note: This method is not applicable for static content or image transformation URLs. In this case a runtime exception is thrown.

**Returns:**

A new URL instance.

---

### https

**Signature:** `https() : URL`

**Description:** Makes the URL absolute and ensures that the protocol https is used. Note: This method is not applicable for static content or image transformation URLs. In this case a runtime exception is thrown.

**Returns:**

A new URL instance.

---

### relative

**Signature:** `relative() : URL`

**Description:** Makes the URL relative. Note: This method is not applicable for static content or image transformation URLs. In this case a runtime exception is thrown.

**Returns:**

A new URL instance.

---

### remove

**Signature:** `remove(name : String) : URL`

**Description:** Remove a request parameter from this URL. If the parameter is not part of the URL, nothing is done.

**Parameters:**

- `name`: The parameter name. Must not be null.

**Returns:**

A reference to this URL.

---

### siteHost

**Signature:** `siteHost() : URL`

**Description:** Updates the URL with the site host name Note: This method is not applicable for static content or image transformation URLs. In this case a runtime exception is thrown.

**Returns:**

A new URL instance.

---

### toString

**Signature:** `toString() : String`

**Description:** Return String representation of the URL.

**Returns:**

the URL as a string.

---