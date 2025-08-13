# Class Request

## Inheritance Hierarchy

- Object
    - sfra.models.Request

## Description

The SFRA Request object is a local wrapper around the global request object that provides enhanced functionality for SFRA (Storefront Reference Architecture) applications. This class translates the global request, customer, and session objects into a more convenient local interface with additional properties and methods. The Request object automatically handles currency setting based on locale, provides easy access to form data and query parameters, and includes customer information in a normalized format. It serves as the primary interface for accessing request-related data in SFRA controllers and provides a consistent API across different types of requests (GET, POST, PUT, etc.).

## Properties

### httpMethod

**Type:** String (Read Only)

The HTTP method of the request (GET, POST, PUT, DELETE, etc.).

### host

**Type:** String (Read Only)

The HTTP host header value from the request.

### path

**Type:** String (Read Only)

The HTTP path portion of the request URL.

### httpHeaders

**Type:** Object (Read Only)

Collection of HTTP headers from the request.

### https

**Type:** Boolean (Read Only)

Indicates whether the request was made over HTTPS.

### includeRequest

**Type:** Boolean (Read Only)

Indicates whether this is an include request (remote include).

### session

**Type:** Object (Read Only)

Local session object containing privacy cache, currency information, and click stream data.

### httpParameterMap

**Type:** dw.web.HttpParameterMap (Read Only)

The raw HTTP parameter map from the global request object.

### querystring

**Type:** QueryString (Read Only)

Parsed query string parameters as a QueryString object.

### form

**Type:** Object (Read Only)

Normalized form data from the HTTP parameter map, excluding query string parameters.

### body

**Type:** String (Read Only)

The request body as a string for POST and PUT requests.

### geolocation

**Type:** Object (Read Only)

Geolocation information including country code, latitude, and longitude.

### currentCustomer

**Type:** Object (Read Only)

Local customer object containing profile, address book, and wallet information.

### locale

**Type:** Object (Read Only)

Current locale information including currency details.

### remoteAddress

**Type:** String (Read Only)

The remote IP address of the client making the request.

### referer

**Type:** String (Read Only)

The HTTP referer header value.

### pageMetaData

**Type:** Object (Read Only)

Page metadata object for managing SEO-related information.

## Constructor Summary

### Request

**Signature:** `Request(request, customer, session)`

Creates a new SFRA Request object from global request, customer, and session objects.

**Parameters:**
- `request` (Object) - Global request object
- `customer` (dw.customer.Customer) - Global customer object
- `session` (dw.system.Session) - Global session object

## Method Summary

### setLocale

**Signature:** `setLocale(localeID) : Boolean`

Sets the locale for the current request.

**Parameters:**
- `localeID` (String) - The locale ID to set

**Returns:**
- Boolean indicating success of locale setting

## Method Detail

### setLocale

**Signature:** `setLocale(localeID) : Boolean`

**Description:** Sets the locale for the current request and returns whether the operation was successful.

**Parameters:**
- `localeID` (String) - The locale identifier (e.g., "en_US", "fr_FR")

**Returns:**
Boolean value indicating whether the locale was successfully set.

## Property Details

### session

**Type:** Object (Read Only)

**Description:** Provides access to session-related information including:

- `privacyCache` - Simple cache for session privacy data
- `raw` - Reference to the original session object
- `currency` - Current currency information with code, digits, name, and symbol
- `setCurrency(value)` - Method to update session currency
- `clickStream` - Click stream data with clicks array, first/last clicks, and partial flag

### currentCustomer

**Type:** Object (Read Only)

**Description:** Normalized customer object containing:

**For Authenticated Customers:**
- `profile` - Customer profile with name, email, phone, and customer number
- `addressBook` - Address book with preferred address and addresses array
- `wallet` - Payment instruments collection
- `raw` - Reference to original customer object

**For Unauthenticated Customers:**
- `credentials` - Username information
- `raw` - Reference to original customer object

### geolocation

**Type:** Object (Read Only)

**Description:** Geographic location information:
- `countryCode` - Two-letter country code
- `latitude` - Geographic latitude coordinate
- `longitude` - Geographic longitude coordinate

### pageMetaData

**Type:** Object (Read Only)

**Description:** SEO and page metadata management:
- `title` - Page title
- `description` - Page description
- `keywords` - Page keywords
- `pageMetaTags` - Collection of meta tags
- `addPageMetaTags(pageMetaTags)` - Method to add meta tags
- `setTitle(title)` - Method to set page title
- `setDescription(description)` - Method to set page description
- `setKeywords(keywords)` - Method to set page keywords

---
