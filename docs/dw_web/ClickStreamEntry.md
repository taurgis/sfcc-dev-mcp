## Package: dw.web

# Class ClickStreamEntry

## Inheritance Hierarchy

- Object
  - dw.web.ClickStreamEntry

## Description

Represent an entry in the click stream.

## Properties

### host

**Type:** String (Read Only)

The host.

### locale

**Type:** String (Read Only)

The locale sent from the user agent.

### path

**Type:** String (Read Only)

The path.

### pipelineName

**Type:** String (Read Only)

The name of the called pipeline. In most cases the
 name can be derived from the path, but not in all cases. If with
 URL rewritting a special landing page is defined for a DNS name, than
 the system internally might use a specific pipeline associated with
 this landing page.

### queryString

**Type:** String (Read Only)

The query string.

### referer

**Type:** String (Read Only)

The referer.

### remoteAddress

**Type:** String (Read Only)

The remote address.

### timestamp

**Type:** Number (Read Only)

The entry's timestamp.

### url

**Type:** String (Read Only)

The full URL for this click. The URL is returned as relative
 URL.

### userAgent

**Type:** String (Read Only)

The user agent.

## Constructor Summary

## Method Summary

### getHost

**Signature:** `getHost() : String`

Returns the host.

### getLocale

**Signature:** `getLocale() : String`

Returns the locale sent from the user agent.

### getParameter

**Signature:** `getParameter(name : String) : String`

Returns a specific parameter value from the stored query string.

### getPath

**Signature:** `getPath() : String`

Returns the path.

### getPipelineName

**Signature:** `getPipelineName() : String`

Returns the name of the called pipeline.

### getQueryString

**Signature:** `getQueryString() : String`

Returns the query string.

### getReferer

**Signature:** `getReferer() : String`

Returns the referer.

### getRemoteAddress

**Signature:** `getRemoteAddress() : String`

Returns the remote address.

### getTimestamp

**Signature:** `getTimestamp() : Number`

Returns the entry's timestamp.

### getUrl

**Signature:** `getUrl() : String`

Returns the full URL for this click.

### getUserAgent

**Signature:** `getUserAgent() : String`

Returns the user agent.

## Method Detail

## Method Details

### getHost

**Signature:** `getHost() : String`

**Description:** Returns the host.

**Returns:**

the host.

---

### getLocale

**Signature:** `getLocale() : String`

**Description:** Returns the locale sent from the user agent.

**Returns:**

the locale sent from the user agent.

---

### getParameter

**Signature:** `getParameter(name : String) : String`

**Description:** Returns a specific parameter value from the stored query string. The method can be used to extract a source code or affiliate id out of the URLs in the click stream. The method returns null if there is no parameter with the given name.

**Parameters:**

- `name`: the name of the parameter.

**Returns:**

the value associated with the specified parameter, or null.

---

### getPath

**Signature:** `getPath() : String`

**Description:** Returns the path.

**Returns:**

the path.

---

### getPipelineName

**Signature:** `getPipelineName() : String`

**Description:** Returns the name of the called pipeline. In most cases the name can be derived from the path, but not in all cases. If with URL rewritting a special landing page is defined for a DNS name, than the system internally might use a specific pipeline associated with this landing page.

**Returns:**

the name of the called pipeline.

---

### getQueryString

**Signature:** `getQueryString() : String`

**Description:** Returns the query string.

**Returns:**

the query string.

---

### getReferer

**Signature:** `getReferer() : String`

**Description:** Returns the referer.

**Returns:**

the referer.

---

### getRemoteAddress

**Signature:** `getRemoteAddress() : String`

**Description:** Returns the remote address.

**Returns:**

the remote address.

---

### getTimestamp

**Signature:** `getTimestamp() : Number`

**Description:** Returns the entry's timestamp.

**Returns:**

the entry's timestamp.

---

### getUrl

**Signature:** `getUrl() : String`

**Description:** Returns the full URL for this click. The URL is returned as relative URL.

**Returns:**

the full URL for this click.

---

### getUserAgent

**Signature:** `getUserAgent() : String`

**Description:** Returns the user agent.

**Returns:**

the user agent.

---