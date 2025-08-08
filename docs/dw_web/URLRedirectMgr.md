## Package: dw.web

# Class URLRedirectMgr

## Inheritance Hierarchy

- Object
  - dw.web.URLRedirectMgr

## Description

URLRedirect manager class. Methods in this class generate URLRedirects based on the current configuration for Static, Dynamic and URLRedirect mappings in Commerce Cloud Digital. Information used to calculate URLRedirects are determined from the current HTTP request. The URL which is used to find a redirect can be accessed with getRedirectOrigin().

## Properties

### redirect

**Type:** URLRedirect (Read Only)

An URLRedirect object, containing a location and status. The redirect is calculated
 based on origin url of current request and the configured Static, Dynamic and URLRedirect mappings for
 the requested site.

### redirectOrigin

**Type:** String (Read Only)

The relative origin url (without protocol, port, hostname and site path information)
 which will be used in getRedirect() to calculate a redirect location for.

## Constructor Summary

## Method Summary

### getRedirect

**Signature:** `static getRedirect() : URLRedirect`

Returns an URLRedirect object, containing a location and status.

### getRedirectOrigin

**Signature:** `static getRedirectOrigin() : String`

Returns the relative origin url (without protocol, port, hostname and site path information) which will be used in getRedirect() to calculate a redirect location for.

## Method Detail

## Method Details

### getRedirect

**Signature:** `static getRedirect() : URLRedirect`

**Description:** Returns an URLRedirect object, containing a location and status. The redirect is calculated based on origin url of current request and the configured Static, Dynamic and URLRedirect mappings for the requested site.

**Returns:**

URLRedirect containing the location and status code, null in case of no redirect was found

---

### getRedirectOrigin

**Signature:** `static getRedirectOrigin() : String`

**Description:** Returns the relative origin url (without protocol, port, hostname and site path information) which will be used in getRedirect() to calculate a redirect location for.

**Returns:**

relative origin url

---