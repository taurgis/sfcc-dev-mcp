## Package: dw.system

# Class Session

## Inheritance Hierarchy

- Object
  - dw.system.Session

## Description

Represents a session in B2C Commerce. The session has some well-defined attributes like the current authenticated customer or the click stream, but also supports storing custom values in the session. The Digital session handling works in the following way: A session is created in Digital on the first user click. This is guaranteed even if B2C Commerce caches the HTML pages. It is not guaranteed when the pages are cached by a CDN. A session is identified with a unique ID, called the session ID. When a session is created, the application server calls the pipeline OnSession-Start. It can be used to pre-initialize the session, before the actual request hits the server. Digital uses session stickiness and always routes requests within a single session to the same application server. Session data is also stored in a persistent location. In case of a fail-over situation, requests are re-routed to another application server, which then loads the session data from the persistent storage. There are two session timeouts. A soft timeout occurs 30 minutes after the last request has been made. The soft timeout logs out and clears all privacy data, but it is still possible to use the session ID to reopen the session. A hard timeout renders a session ID invalid after six hours, even if the session is still in use. The hard timeout prevents a session from being reopened. For example, if the session ID is pasted into a URL after the hard timeout, the session doesn't reopen. Certain rules apply for what and how much data can be stored in a session: All primitive types (boolean, number, string, Number, String, Boolean, Date) are supported. All B2C Commerce value types (Money, Quantity, Decimal, Calendar) are supported. Strings are limited to 2000 characters. No other types can be stored in a session. In particular, persistent objects, collections, and scripted objects cannot be stored in a session. B2C Commerce will report unsupported values with a deprecation message in the log files. An unsupported value will be stored in the session, but the results are undefined. Since version compatibility mode 19.10 unsupported types will no longer be accepted, and an exception will be thrown. There is a 10 KB size limit for the overall serialized session.

## Properties

### clickStream

**Type:** ClickStream (Read Only)

The current click stream if this is an HTTP session, null otherwise.

### currency

**Type:** Currency

Get the currency associated with the current session. The session
 currency is established at session construction time and is typically
 equal to the site default currency. In the case of a multi-currency site,
 the session currency may be different than the site default currency.

### custom

**Type:** CustomAttributes (Read Only)

The session's custom attributes. The
 attributes are stored for the lifetime of the session and are not
 cleared when the customer logs out.

### customer

**Type:** Customer (Read Only)

The customer associated with this storefront session. The method
 always returns null if called for a non-storefront session
 (e.g., within a job or within Business Manager). For a storefront
 session, the method always returns a customer. The returned customer
 may be anonymous if the customer could not be identified via the
 customer cookie.

### customerAuthenticated

**Type:** boolean (Read Only)

Identifies whether the customer associated with this session
 is authenticated. This call is equivalent to customer.isAuthenticated().

### customerExternallyAuthenticated

**Type:** boolean (Read Only)

Identifies whether the customer associated with this session
 is externally authenticated.

### forms

**Type:** Forms (Read Only)

The forms object that provides access to all current forms of a customer in the session.

### lastReceivedSourceCodeInfo

**Type:** SourceCodeInfo (Read Only)

Returns information on the last source code handled by the session.
 This may or may not be the session's active source code, e.g., the
 last received source code was inactive and therefore was not
 set as the session's active source code.

### privacy

**Type:** CustomAttributes (Read Only)

The session's custom privacy attributes.
 The attributes are stored for the lifetime of the session and are
 automatically cleared when the customer logs out.

### sessionID

**Type:** String (Read Only)

The unique session id. This can safely be used as an identifier
 against external systems.

### sourceCodeInfo

**Type:** SourceCodeInfo (Read Only)

Returns information on the session's active source-code.

### trackingAllowed

**Type:** boolean

Returns whether the tracking allowed flag is set in the session.
 The value for newly created sessions defaults to the Site Preference "TrackingAllowed" unless
 a cookie named "dw_dnt" is found in which case the cookie value takes precedence.

### userAuthenticated

**Type:** boolean (Read Only)

Identifies whether the agent user associated with this session
 is authenticated.

### userName

**Type:** String (Read Only)

The current agent user name associated with this session.
 
 Note: this class allows access to sensitive security-related data.
 Pay special attention to PCI DSS v3 requirements 2, 4, and 12.

## Constructor Summary

## Method Summary

### generateGuestSessionSignature

**Signature:** `generateGuestSessionSignature() : String`

Generates a new guest session signature.

### generateRegisteredSessionSignature

**Signature:** `generateRegisteredSessionSignature() : String`

Generates a new registered session signature.

### getClickStream

**Signature:** `getClickStream() : ClickStream`

Returns the current click stream if this is an HTTP session, null otherwise.

### getCurrency

**Signature:** `getCurrency() : Currency`

Get the currency associated with the current session.

### getCustom

**Signature:** `getCustom() : CustomAttributes`

Returns the session's custom attributes.

### getCustomer

**Signature:** `getCustomer() : Customer`

Returns the customer associated with this storefront session.

### getForms

**Signature:** `getForms() : Forms`

Returns the forms object that provides access to all current forms of a customer in the session.

### getLastReceivedSourceCodeInfo

**Signature:** `getLastReceivedSourceCodeInfo() : SourceCodeInfo`

Returns information on the last source code handled by the session.

### getPrivacy

**Signature:** `getPrivacy() : CustomAttributes`

Returns the session's custom privacy attributes.

### getSessionID

**Signature:** `getSessionID() : String`

Returns the unique session id.

### getSourceCodeInfo

**Signature:** `getSourceCodeInfo() : SourceCodeInfo`

Returns information on the session's active source-code.

### getUserName

**Signature:** `getUserName() : String`

Returns the current agent user name associated with this session.

### isCustomerAuthenticated

**Signature:** `isCustomerAuthenticated() : boolean`

Identifies whether the customer associated with this session is authenticated.

### isCustomerExternallyAuthenticated

**Signature:** `isCustomerExternallyAuthenticated() : boolean`

Identifies whether the customer associated with this session is externally authenticated.

### isTrackingAllowed

**Signature:** `isTrackingAllowed() : boolean`

Returns whether the tracking allowed flag is set in the session.

### isUserAuthenticated

**Signature:** `isUserAuthenticated() : boolean`

Identifies whether the agent user associated with this session is authenticated.

### setCurrency

**Signature:** `setCurrency(newCurrency : Currency) : void`

Sets the session currency.

### setSourceCode

**Signature:** `setSourceCode(sourceCode : String) : Status`

Applies the specified source code to the current session and basket.

### setTrackingAllowed

**Signature:** `setTrackingAllowed(trackingAllowed : boolean) : void`

Sets the tracking allowed flag for the session.

## Method Detail

## Method Details

### generateGuestSessionSignature

**Signature:** `generateGuestSessionSignature() : String`

**Description:** Generates a new guest session signature. This is intended for guest authentication with the Shopper Login and API Access Service (SLAS).

**Returns:**

A new signed session token.

---

### generateRegisteredSessionSignature

**Signature:** `generateRegisteredSessionSignature() : String`

**Description:** Generates a new registered session signature. This is intended for use with registered session-bridge call of Shopper Login and API Access Service (SLAS).

**Returns:**

A new signed session token for registered dwsid.

---

### getClickStream

**Signature:** `getClickStream() : ClickStream`

**Description:** Returns the current click stream if this is an HTTP session, null otherwise.

**Returns:**

the current click stream if this is an HTTP session, null otherwise.

---

### getCurrency

**Signature:** `getCurrency() : Currency`

**Description:** Get the currency associated with the current session. The session currency is established at session construction time and is typically equal to the site default currency. In the case of a multi-currency site, the session currency may be different than the site default currency.

**Returns:**

the currency associated with this storefront session, never null.

---

### getCustom

**Signature:** `getCustom() : CustomAttributes`

**Description:** Returns the session's custom attributes. The attributes are stored for the lifetime of the session and are not cleared when the customer logs out.

**Returns:**

the session's custom attributes.

---

### getCustomer

**Signature:** `getCustomer() : Customer`

**Description:** Returns the customer associated with this storefront session. The method always returns null if called for a non-storefront session (e.g., within a job or within Business Manager). For a storefront session, the method always returns a customer. The returned customer may be anonymous if the customer could not be identified via the customer cookie.

**Returns:**

the customer associated with this storefront session.

---

### getForms

**Signature:** `getForms() : Forms`

**Description:** Returns the forms object that provides access to all current forms of a customer in the session.

**Returns:**

the forms.

---

### getLastReceivedSourceCodeInfo

**Signature:** `getLastReceivedSourceCodeInfo() : SourceCodeInfo`

**Description:** Returns information on the last source code handled by the session. This may or may not be the session's active source code, e.g., the last received source code was inactive and therefore was not set as the session's active source code.

**Returns:**

source code information for the last received source code.

---

### getPrivacy

**Signature:** `getPrivacy() : CustomAttributes`

**Description:** Returns the session's custom privacy attributes. The attributes are stored for the lifetime of the session and are automatically cleared when the customer logs out.

**Returns:**

the session's custom privacy attributes.

---

### getSessionID

**Signature:** `getSessionID() : String`

**Description:** Returns the unique session id. This can safely be used as an identifier against external systems.

**Returns:**

the unique identifier for the session.

---

### getSourceCodeInfo

**Signature:** `getSourceCodeInfo() : SourceCodeInfo`

**Description:** Returns information on the session's active source-code.

**Returns:**

the session's source-code information.

---

### getUserName

**Signature:** `getUserName() : String`

**Description:** Returns the current agent user name associated with this session. Note: this class allows access to sensitive security-related data. Pay special attention to PCI DSS v3 requirements 2, 4, and 12.

**Returns:**

the current agent user name associated with this session.

---

### isCustomerAuthenticated

**Signature:** `isCustomerAuthenticated() : boolean`

**Description:** Identifies whether the customer associated with this session is authenticated. This call is equivalent to customer.isAuthenticated().

**Returns:**

true if the customer is authenticated, false otherwise.

---

### isCustomerExternallyAuthenticated

**Signature:** `isCustomerExternallyAuthenticated() : boolean`

**Description:** Identifies whether the customer associated with this session is externally authenticated.

**Returns:**

true if the customer is authenticated, false otherwise.

---

### isTrackingAllowed

**Signature:** `isTrackingAllowed() : boolean`

**Description:** Returns whether the tracking allowed flag is set in the session. The value for newly created sessions defaults to the Site Preference "TrackingAllowed" unless a cookie named "dw_dnt" is found in which case the cookie value takes precedence.

**Returns:**

true if the tracking allowed flag is set in the session, false otherwise.

---

### isUserAuthenticated

**Signature:** `isUserAuthenticated() : boolean`

**Description:** Identifies whether the agent user associated with this session is authenticated.

**Returns:**

true if the agent user is authenticated, false otherwise.

---

### setCurrency

**Signature:** `setCurrency(newCurrency : Currency) : void`

**Description:** Sets the session currency.

**Parameters:**

- `newCurrency`: the new currency to use. Must not be null. Method will throw an exception if a currency not allowed by the current site is passed.

---

### setSourceCode

**Signature:** `setSourceCode(sourceCode : String) : Status`

**Description:** Applies the specified source code to the current session and basket. This API processes the source code exactly as if it were supplied on the URL query string, with the additional benefit of returning error information. If no input parameter is passed, then the active source code in the session and basket is removed. If a basket exists, and the modification fails, then the session is not written to either. This method may open and commit a transaction, if none is currently active.

**Parameters:**

- `sourceCode`: the source code to set as active in the session and basket. If a null parameter is passed, then the active source code in the session is removed.

**Returns:**

an OK status if the source code was applied, otherwise an ERROR status. In the latter case, the possible error codes are: CODE_INVALID and CODE_INACTIVE. See documentation for SourceCodeStatusCodes for further descriptions.

---

### setTrackingAllowed

**Signature:** `setTrackingAllowed(trackingAllowed : boolean) : void`

**Description:** Sets the tracking allowed flag for the session. If tracking is not allowed, multiple services depending on tracking will be restricted or disabled: Predictive Intelligence recommendations, Active Data, Analytics of the customer behavior in the storefront. Additionally, collected clicks in the session click stream will be cleared. Setting this property to either value also results in setting a session-scoped cookie named "dw_dnt" (1=DoNotTrack; 0=Track)

**Parameters:**

- `trackingAllowed`: true if tracking is allowed, false otherwise.

---