## Package: dw.net

# Class HTTPClientLoggingConfig

## Inheritance Hierarchy

- Object
  - dw.net.HTTPClientLoggingConfig

## Description

Script API for configuring HTTP client logging and sensitive data redaction. This class provides a customer-facing interface for configuring HTTP client logging behavior, including enabling/disabling logging, setting log levels, and defining sensitive fields that should be redacted from HTTP request and response bodies. Security Note: This class handles sensitive security-related data and logging configuration. Pay special attention to PCI DSS requirements when configuring sensitive field redaction to ensure proper data protection. Sensitive Fields of appropriate types MUST be set else logging will be skipped. Usage Example: var config = new dw.net.HTTPClientLoggingConfig(); // Enable logging and set level config.setEnabled(true); config.setLevel("INFO"); // Configure sensitive JSON fields config.setSensitiveJsonFields(["password", "creditCard", "ssn"]); // Configure sensitive XML fields config.setSensitiveXmlFields(["password", "creditCard", "ssn"]); // Configure sensitive headers config.setSensitiveHeaders(["authorization", "x-api-key", "cookie"]); // Configure sensitive body fields (for form data) config.setSensitiveBodyFields(["password", "creditCard", "ssn"]); // Configure text patterns for plain text/HTML content config.setSensitiveTextPatterns([["password\\s*=\\s*[^\\s&]+"]]); Content Type Support: JSON: Use setSensitiveJsonFields() to specify field names to redact XML: Use setSensitiveXmlFields() to specify element/attribute names to redact Form Data: Use setSensitiveBodyFields() to specify parameter names to redact Plain Text/HTML: Use setSensitiveTextPatterns() to specify regex patterns Binary/Multipart: Entire body is automatically treated as sensitive

## Properties

### enabled

**Type:** boolean

Gets whether HTTP client logging is enabled.

### level

**Type:** String

Gets the current log level for HTTP client logging.

### sensitiveBodyFields

**Type:** String

Gets the sensitive body fields configured for form data redaction.

### sensitiveHeaders

**Type:** String

Gets the sensitive headers configured for redaction.

### sensitiveJsonFields

**Type:** String

Gets the sensitive JSON fields configured for redaction.

### sensitiveXmlFields

**Type:** String

Gets the sensitive XML fields configured for redaction.

## Constructor Summary

HTTPClientLoggingConfig() Creates a new HTTPClientLoggingConfig instance.

## Method Summary

### getLevel

**Signature:** `getLevel() : String`

Gets the current log level for HTTP client logging.

### getSensitiveBodyFields

**Signature:** `getSensitiveBodyFields() : String[]`

Gets the sensitive body fields configured for form data redaction.

### getSensitiveHeaders

**Signature:** `getSensitiveHeaders() : String[]`

Gets the sensitive headers configured for redaction.

### getSensitiveJsonFields

**Signature:** `getSensitiveJsonFields() : String[]`

Gets the sensitive JSON fields configured for redaction.

### getSensitiveXmlFields

**Signature:** `getSensitiveXmlFields() : String[]`

Gets the sensitive XML fields configured for redaction.

### isEnabled

**Signature:** `isEnabled() : boolean`

Gets whether HTTP client logging is enabled.

### setEnabled

**Signature:** `setEnabled(enabled : boolean) : void`

Sets whether HTTP client logging is enabled.

### setLevel

**Signature:** `setLevel(level : String) : void`

Sets the log level for HTTP client logging.

### setSensitiveBodyFields

**Signature:** `setSensitiveBodyFields(fields : String...) : void`

Sets the sensitive body fields that should be redacted from HTTP form data.

### setSensitiveHeaders

**Signature:** `setSensitiveHeaders(headers : String...) : void`

Sets the sensitive headers that should be redacted from HTTP requests/responses.

### setSensitiveJsonFields

**Signature:** `setSensitiveJsonFields(fields : String...) : void`

Sets the sensitive JSON fields that should be redacted from HTTP request/response bodies.

### setSensitiveTextPatterns

**Signature:** `setSensitiveTextPatterns(patterns : String...) : void`

Sets the sensitive text patterns that should be redacted from HTTP request/response bodies.

### setSensitiveXmlFields

**Signature:** `setSensitiveXmlFields(fields : String...) : void`

Sets the sensitive XML fields that should be redacted from HTTP request/response bodies.

## Constructor Detail

## Method Detail

## Method Details

### getLevel

**Signature:** `getLevel() : String`

**Description:** Gets the current log level for HTTP client logging.

**Returns:**

the log level as a string (DEBUG, INFO, WARN, ERROR)

---

### getSensitiveBodyFields

**Signature:** `getSensitiveBodyFields() : String[]`

**Description:** Gets the sensitive body fields configured for form data redaction.

**Returns:**

an array of field names that will be redacted from form data

---

### getSensitiveHeaders

**Signature:** `getSensitiveHeaders() : String[]`

**Description:** Gets the sensitive headers configured for redaction.

**Returns:**

an array of header names that will be redacted

---

### getSensitiveJsonFields

**Signature:** `getSensitiveJsonFields() : String[]`

**Description:** Gets the sensitive JSON fields configured for redaction.

**Returns:**

an array of field names that will be redacted from JSON content

---

### getSensitiveXmlFields

**Signature:** `getSensitiveXmlFields() : String[]`

**Description:** Gets the sensitive XML fields configured for redaction.

**Returns:**

an array of field names that will be redacted from XML content

---

### isEnabled

**Signature:** `isEnabled() : boolean`

**Description:** Gets whether HTTP client logging is enabled.

**Returns:**

true if logging is enabled, false otherwise

---

### setEnabled

**Signature:** `setEnabled(enabled : boolean) : void`

**Description:** Sets whether HTTP client logging is enabled. When enabled, HTTP requests and responses will be logged according to the configured log level and sensitive field redaction settings. When disabled, no HTTP logging will occur.

**Parameters:**

- `enabled`: true to enable logging, false to disable

---

### setLevel

**Signature:** `setLevel(level : String) : void`

**Description:** Sets the log level for HTTP client logging. The log level determines the verbosity of HTTP logging output. Available levels: DEBUG: Most verbose, includes detailed request/response information INFO: Standard level, includes basic request/response details WARN: Only logs warnings and errors ERROR: Only logs errors

**Parameters:**

- `level`: the log level (DEBUG, INFO, WARN, ERROR). Case-insensitive.

---

### setSensitiveBodyFields

**Signature:** `setSensitiveBodyFields(fields : String...) : void`

**Description:** Sets the sensitive body fields that should be redacted from HTTP form data. When HTTP requests or responses contain form data (application/x-www-form-urlencoded), any parameters matching the specified field names will be redacted with "****FILTERED****" in the logs. Sensitive Field MUST be set else logging will be skipped for form body type Setting with empty array will use default values ["name", "email", "email_address", "ssn", "first_name", "last_name"] Example: config.setSensitiveBodyFields(["fname", "creditCard", "ssn_last_4"]);

**Parameters:**

- `fields`: an array of field names to redact from form data

---

### setSensitiveHeaders

**Signature:** `setSensitiveHeaders(headers : String...) : void`

**Description:** Sets the sensitive headers that should be redacted from HTTP requests/responses. Any HTTP headers matching the specified names will be redacted with "****FILTERED****" in the logs. This is useful for protecting sensitive authentication tokens, API keys, and session information. Sensitive Headers MUST be set else logging will be skipped for headers Setting the sensitive headers with empty array will use default values ["authorization", "cookie"] Example: config.setSensitiveHeaders([ "x-api-key", "x-auth-token"]); config.setSensiviteHeaders([]);

**Parameters:**

- `headers`: an array of header names to redact

---

### setSensitiveJsonFields

**Signature:** `setSensitiveJsonFields(fields : String...) : void`

**Description:** Sets the sensitive JSON fields that should be redacted from HTTP request/response bodies. When HTTP requests or responses contain JSON content, any fields matching the specified names will be redacted with "****FILTERED****" in the logs. Sensitive Field MUST be set else logging will be skipped for JSON body type Setting with empty array will use default values ["name", "email", "email_address", "ssn", "first_name", "last_name", "password"] Example: config.setSensitiveJsonFields(["password", "creditCard", "ssn"]);

**Parameters:**

- `fields`: an array of field names to redact from JSON content

---

### setSensitiveTextPatterns

**Signature:** `setSensitiveTextPatterns(patterns : String...) : void`

**Description:** Sets the sensitive text patterns that should be redacted from HTTP request/response bodies. When HTTP requests or responses contain text content, any text matching the specified regex patterns will be redacted with "****FILTERED****" in the logs. Example: config.setSensitiveTextPatterns(["password", "credit.*card", "\\d{3}-\\d{2}-\\d{4}"]);

**Parameters:**

- `patterns`: an array of regex patterns to match and redact from text content

---

### setSensitiveXmlFields

**Signature:** `setSensitiveXmlFields(fields : String...) : void`

**Description:** Sets the sensitive XML fields that should be redacted from HTTP request/response bodies. When HTTP requests or responses contain XML content, any elements or attributes matching the specified names will be redacted with "****FILTERED****" in the logs. Sensitive Field MUST be set else logging will be skipped for XML body type Setting with empty array will use default values ["name", "email", "email_address", "ssn", "first_name", "last_name", "password"] Example: config.setSensitiveXmlFields(["password", "creditCard", "ssn"]);

**Parameters:**

- `fields`: an array of element/attribute names to redact from XML content

---