## Package: dw.web

# Class Cookies

## Inheritance Hierarchy

- Object
  - dw.web.Cookies

## Description

The class provides an index and associative array like access to the Cookies of the current request. Cookies can be retrieved by calling dw.system.Request.getHttpCookies(). Note: this class allows access to sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12. See Request.getHttpCookies().

## Properties

### cookieCount

**Type:** Number (Read Only)

The number of known cookies.

## Constructor Summary

## Method Summary

### getCookieCount

**Signature:** `getCookieCount() : Number`

Returns the number of known cookies.

## Method Detail

## Method Details

### getCookieCount

**Signature:** `getCookieCount() : Number`

**Description:** Returns the number of known cookies.

**Returns:**

the number of cookies

---