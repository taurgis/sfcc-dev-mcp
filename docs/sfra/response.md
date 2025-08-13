# Class Response

## Inheritance Hierarchy

- Object
    - sfra.models.Response

## Description

The SFRA Response object is a local wrapper around the global response object that provides enhanced functionality for SFRA (Storefront Reference Architecture) applications. This class serves as a centralized interface for managing response data, rendering templates, handling redirects, and controlling HTTP response behavior. The Response object maintains state for template rendering, view data, redirect URLs, logging messages, and HTTP headers while providing a consistent API for different types of responses (ISML templates, JSON, XML, Page Designer pages). It includes built-in support for caching, content type management, and response status codes, making it the primary interface for controller response handling in SFRA applications.

## Properties

### view

**Type:** String

The template name/path to be rendered.

### viewData

**Type:** Object

Data object containing all variables to be passed to the template during rendering.

### redirectUrl

**Type:** String

URL to redirect to when a redirect response is triggered.

### redirectStatus

**Type:** String

HTTP status code for redirect responses (e.g., "301", "302").

### messageLog

**Type:** Array

Collection of log messages for debugging and error output.

### base

**Type:** dw.system.Response

Reference to the original global response object.

### cachePeriod

**Type:** Number

Cache expiration period value.

### cachePeriodUnit

**Type:** String

Unit for cache period (typically hours).

### personalized

**Type:** Boolean

Indicates whether the response contains personalized content.

### renderings

**Type:** Array

Collection of rendering steps to be executed in order.

### isJson

**Type:** Boolean

Flag indicating if the response should be rendered as JSON.

### isXml

**Type:** Boolean

Flag indicating if the response should be rendered as XML.

## Constructor Summary

### Response

**Signature:** `Response(response)`

Creates a new SFRA Response object from the global response object.

**Parameters:**
- `response` (Object) - Global response object

## Method Summary

### render

**Signature:** `render(name, data) : void`

Stores template name and data for ISML template rendering.

### json

**Signature:** `json(data) : void`

Configures response to render data as JSON.

### xml

**Signature:** `xml(xmlString) : void`

Configures response to render data as XML.

### page

**Signature:** `page(page, data, aspectAttributes) : void`

Configures response to render a Page Designer page.

### redirect

**Signature:** `redirect(url) : void`

Sets up URL redirection for the response.

### setRedirectStatus

**Signature:** `setRedirectStatus(redirectStatus) : void`

Sets the HTTP status code for redirects.

### getViewData

**Signature:** `getViewData() : Object`

Retrieves the current view data object.

### setViewData

**Signature:** `setViewData(data) : void`

Updates the view data with new data.

### log

**Signature:** `log(...arguments) : void`

Logs messages for debugging and error output.

### setContentType

**Signature:** `setContentType(type) : void`

Sets the HTTP content type for the response.

### setStatusCode

**Signature:** `setStatusCode(code) : void`

Sets the HTTP status code for the response.

### print

**Signature:** `print(message) : void`

Adds a print step to the rendering pipeline.

### cacheExpiration

**Signature:** `cacheExpiration(period) : void`

Sets cache expiration period in hours.

### setHttpHeader

**Signature:** `setHttpHeader(name, value) : void`

Adds a custom HTTP header to the response.

## Method Detail

### render

**Signature:** `render(name, data) : void`

**Description:** Stores template name and data for rendering an ISML template at execution time. The data is merged with existing view data, and a render step is added to the renderings pipeline.

**Parameters:**
- `name` (String) - Path to the ISML template file
- `data` (Object) - Data object to be passed to the template

**Returns:**
void

### json

**Signature:** `json(data) : void`

**Description:** Configures the response to render the provided data as JSON. Sets the isJson flag and merges data with existing view data.

**Parameters:**
- `data` (Object) - Data object to be serialized as JSON

**Returns:**
void

### xml

**Signature:** `xml(xmlString) : void`

**Description:** Configures the response to render the provided XML string. Sets the isXml flag and stores the XML content in view data.

**Parameters:**
- `xmlString` (String) - Valid XML string to be rendered

**Returns:**
void

### page

**Signature:** `page(page, data, aspectAttributes) : void`

**Description:** Configures the response to render a Page Designer page with optional aspect attributes for advanced page management.

**Parameters:**
- `page` (String) - ID of the Page Designer page to render
- `data` (Object) - Data object to be passed to the page
- `aspectAttributes` (dw.util.HashMap) - Optional aspect attributes for PageMgr

**Returns:**
void

### redirect

**Signature:** `redirect(url) : void`

**Description:** Sets up URL redirection for the response. The redirect will be executed during response processing.

**Parameters:**
- `url` (String) - Target URL for redirection

**Returns:**
void

### setRedirectStatus

**Signature:** `setRedirectStatus(redirectStatus) : void`

**Description:** Sets the HTTP status code for redirect responses. Common values are "301" for permanent redirects and "302" for temporary redirects.

**Parameters:**
- `redirectStatus` (String) - HTTP status code for the redirect

**Returns:**
void

### getViewData

**Signature:** `getViewData() : Object`

**Description:** Retrieves the current view data object containing all variables that will be passed to the template during rendering.

**Returns:**
Object containing all view data variables.

### setViewData

**Signature:** `setViewData(data) : void`

**Description:** Updates the view data by merging the provided data object with existing view data. Existing properties with the same keys will be overwritten.

**Parameters:**
- `data` (Object) - Data object to merge with existing view data

**Returns:**
void

### log

**Signature:** `log(...arguments) : void`

**Description:** Logs multiple arguments for debugging and error output. Objects and arrays are automatically JSON.stringified, while other types are converted to strings.

**Parameters:**
- `...arguments` - Variable number of arguments to log

**Returns:**
void

### setContentType

**Signature:** `setContentType(type) : void`

**Description:** Sets the HTTP content type header for the response (e.g., "application/json", "text/xml", "text/html").

**Parameters:**
- `type` (String) - MIME type for the response content

**Returns:**
void

### setStatusCode

**Signature:** `setStatusCode(code) : void`

**Description:** Sets the HTTP status code for the response (e.g., 200, 404, 500).

**Parameters:**
- `code` (Number) - Valid HTTP status code

**Returns:**
void

### print

**Signature:** `print(message) : void`

**Description:** Adds a print step to the rendering pipeline that will output the message directly to the response stream.

**Parameters:**
- `message` (String) - Message to be printed to the response

**Returns:**
void

### cacheExpiration

**Signature:** `cacheExpiration(period) : void`

**Description:** Sets the cache expiration period for the current page response in hours from the current time.

**Parameters:**
- `period` (Number) - Number of hours from current time for cache expiration

**Returns:**
void

### setHttpHeader

**Signature:** `setHttpHeader(name, value) : void`

**Description:** Adds a custom HTTP header to the response with the specified name and value.

**Parameters:**
- `name` (String) - Header name
- `value` (String) - Header value

**Returns:**
void

## Property Details

### viewData

**Type:** Object

**Description:** Central data object that accumulates all variables to be passed to templates during rendering. Data is merged using the assign utility, allowing for incremental data building throughout controller execution.

### renderings

**Type:** Array

**Description:** Ordered collection of rendering steps that define how the response should be processed. Each step contains:

**For Render Steps:**
- `type` - Always "render"
- `subType` - Type of rendering ("isml", "json", "xml", "page")
- `view` - Template name (for ISML)
- `page` - Page ID (for Page Designer)
- `aspectAttributes` - Page attributes (for Page Designer)

**For Print Steps:**
- `type` - Always "print"
- `message` - Message to output

### messageLog

**Type:** Array

**Description:** Collection of debug and error messages logged during controller execution. Messages are automatically formatted, with objects and arrays converted to JSON strings.

### base

**Type:** dw.system.Response

**Description:** Reference to the original global response object, providing access to core response functionality like setting HTTP headers, content types, and status codes.

---
