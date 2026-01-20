---
name: sfcc-localserviceregistry
description: Guide for creating server-to-server integrations in Salesforce B2C Commerce using LocalServiceRegistry. Use this when asked to integrate external APIs, create HTTP services, implement OAuth flows, or configure service credentials.
---

# SFCC B2C Commerce: LocalServiceRegistry Best Practices

This guide provides a concise overview of best practices for creating server-to-server integrations in Salesforce B2C Commerce Cloud using the `dw.svc.LocalServiceRegistry`.

## 1. Core Architecture: Configuration and Code

Integrations use a two-part architecture:

**Declarative Configuration (Business Manager)**: Defines the what, who, and how of the service call. This includes the endpoint, credentials, and operational policies like timeouts and circuit breakers.

**Programmatic Definition (Script Module)**: Defines the dynamic behavior using callbacks. This includes creating the request payload, parsing the response, and defining mock behavior for testing.

### Business Manager Configuration Summary

| Component | Purpose | Key Settings |
|-----------|---------|--------------|
| Credential | Stores endpoint URL and authentication details. | ID, URL, User, Password |
| Profile | Defines operational behavior and resilience. | Timeout, Rate Limiting, Circuit Breaker |
| Service | Binds a Credential and Profile to a named service ID. | Name (ID), Service Type, Mode (Live/Mocked) |

**Best Practice**: Use a period-delimited naming convention for the Service ID (e.g., `int_myapi.http.customer.get`) to organize logs effectively.

## 2. Script Implementation with LocalServiceRegistry

The modern approach uses `dw.svc.LocalServiceRegistry` to define service behavior locally, eliminating the need for global initialization scripts.

### Key Callbacks

The `createService` method takes a configuration object with the following core callback functions:

- **`createRequest(svc,...params)`**: Configures the outgoing request (URL, method, headers) and returns the request body (e.g., a JSON string).

- **`parseResponse(svc, client)`**: Processes the raw HTTP response (`dw.net.HTTPClient`). It should parse the response body (e.g., `JSON.parse(client.text)`) and throw an Error if the status code indicates a failure (e.g., `client.statusCode >= 400`). This ensures the `result.ok` flag is set correctly.

- **`mockCall(svc, requestObj)`**: Mocks only the network execution. `createRequest` and `parseResponse` still run. Ideal for integration testing your service's logic.

- **`mockFull(svc,...params)`**: Mocks the entire service call. No other callbacks are executed. Ideal for unit testing the consumer of the service (e.g., a controller).

## 2.1 Understanding `dw.svc.Result` (What `service.call()` Returns)

The Service Framework returns a `dw.svc.Result` object. Your calling code should branch on `result.ok` and also differentiate transport/config failures from HTTP/API failures.

| Field | Meaning |
|------|---------|
| `ok` | `true` if the call succeeded and `parseResponse` did not error |
| `status` | Typically `OK`, `ERROR`, or `SERVICE_UNAVAILABLE` |
| `object` | Parsed value returned by `parseResponse` |
| `error` / `errorMessage` | Error code/message (often HTTP status + message) |
| `unavailableReason` | Why the framework refused to call (timeout, rate limit, circuit breaker, disabled, config issue) |
| `mockResult` | Whether the response came from mock mode |

**Practical rule**: treat `SERVICE_UNAVAILABLE` as a resilience signal (retry/fallback), and treat `ERROR` as a downstream/API problem (inspect HTTP status and body).

### Reusable Service Module Pattern

Encapsulate all logic for an integration into a single script module. Use a singleton pattern to avoid re-creating the service definition on every call.

```javascript
'use strict';

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Logger = require('dw/system/Logger');

// --- Private Helper for Operation-Specific Details ---
/**
 * Returns configuration details for a specific service operation.
 * @param {string} operation - The operation ID (e.g., 'getCustomer')
 * @returns {{method: string, path: string}}
 */
function getOperationDetails(operation) {
    switch (operation) {
        case 'getCustomer':
            return { method: 'GET', path: '/customers/' };
        case 'createCustomer':
            return { method: 'POST', path: '/customers' };
        default:
            Logger.error('Unknown operation in MyAPIService: {0}', operation);
            throw new Error('Operation not implemented: ' + operation);
    }
}

// --- Service Definition ---
var myAPIService = LocalServiceRegistry.createService('int_myapi.http.customer', {
    /**
     * @param {dw.svc.HTTPService} svc
     * @param {string} operation - The name of the operation to perform
     * @param {Object} params - The parameters for the operation
     * @returns {string|null} - Request body or null
     */
    createRequest: function (svc, operation, params) {
        var details = getOperationDetails(operation);
        var credential = svc.getConfiguration().getCredential();

        svc.setRequestMethod(details.method);
        svc.addHeader('Content-Type', 'application/json');
        svc.addHeader('X-API-Key', 'your-api-key'); // Example custom header

        var url = credential.getURL() + details.path;
        if (details.method === 'GET' && params && params.id) {
            svc.setURL(url + params.id);
            return null; // No body for GET
        }
        svc.setURL(url);
        return params? JSON.stringify(params) : null;
    },

    /**
     * @param {dw.svc.HTTPService} svc
     * @param {dw.net.HTTPClient} client
     * @returns {Object} - The parsed JSON response
     */
    parseResponse: function (svc, client) {
        if (client.statusCode >= 400) {
            Logger.error('MyAPIService error: {0} {1} - {2}', client.statusCode, client.statusMessage, client.text);
            throw new Error('API call failed with status ' + client.statusCode);
        }
        try {
            return JSON.parse(client.text);
        } catch (e) {
            Logger.error('Error parsing JSON response from MyAPIService: {0}', client.text);
            throw new Error('Invalid JSON response');
        }
    },

    /**
     * @param {dw.svc.HTTPService} svc
     * @param {string} operation
     * @param {Object} params
     * @returns {Object} - The final, parsed mock object
     */
    mockFull: function (svc, operation, params) {
        var details = getOperationDetails(operation);
        if (details.method === 'GET') {
            return { id: params.id, name: 'Mock Customer', email: 'mock@example.com' };
        }
        if (details.method === 'POST') {
            return { id: 'mock-' + new Date().getTime(), name: params.name, email: params.email };
        }
        return { error: 'Mock not implemented for ' + operation };
    },
    
    /**
     * Redacts sensitive data from logs.
     * @param {string} msg - The log message
     * @returns {string} - The filtered message
     */
    filterLogMessage: function (msg) {
        // Basic redaction example for JSON strings
        try {
            var logObject = JSON.parse(msg);
            if (logObject.password) {
                logObject.password = '<REDACTED>';
            }
            return JSON.stringify(logObject);
        } catch (e) {
            return msg; // Not a JSON message, return as is
        }
    }
});

## 2.2 Production Safety Notes

- Prefer `filterLogMessage` for any integration that may include secrets, tokens, passwords, or PII.
- Keep `parseResponse` strict: if `client.statusCode >= 400`, throw an error so failures propagate through `result.ok === false`.
- Use Business Manager service profiles for timeouts, rate limits, and circuit breaker behavior.
- For comprehensive logging patterns including categories, custom log files, and log level checks, see **[sfcc-logging](../sfcc-logging/SKILL.md)**.

// --- Public API ---
module.exports = {
    OPERATION_GET_CUSTOMER: 'getCustomer',
    OPERATION_CREATE_CUSTOMER: 'createCustomer',
    call: function (operation, params) {
        return myAPIService.call(operation, params);
    }
};
```

## 3. Practical Examples

### GET Request (SFRA Controller)

```javascript
// In controller/MyController.js
var server = require('server');
var MyAPIService = require('~/cartridge/scripts/services/MyAPIService');

server.get('ShowCustomer', function(req, res, next) {
    var customerId = req.querystring.id;
    var result = MyAPIService.call(MyAPIService.OPERATION_GET_CUSTOMER, { id: customerId });

    if (result.ok) {
        res.render('customer/customerDetails', {
            customer: result.object
        });
    } else {
        res.render('error', {
            message: 'Could not retrieve customer data.',
            error: result.errorMessage
        });
    }
    next();
});
```

### POST Request with JSON (SFRA Controller)

```javascript
// In controller/MyController.js
var server = require('server');
var MyAPIService = require('~/cartridge/scripts/services/MyAPIService');

server.post('CreateCustomer', function(req, res, next) {
    var customerData = {
        name: req.form.name,
        email: req.form.email
    };
    var result = MyAPIService.call(MyAPIService.OPERATION_CREATE_CUSTOMER, customerData);

    if (result.ok) {
        res.json({ success: true, customer: result.object });
    } else {
        res.setStatusCode(500);
        res.json({ success: false, error: result.errorMessage });
    }
    next();
});
```

### OAuth 2.0 Client Credentials Flow

Use a **Two-Service Pattern** for efficiency: one service to get the token, and another to call the API.

- **Auth Service (AuthTokenService.js)**: Handles the POST request to the token endpoint.

- **API Service (MyAPIService.js)**:
  - Gets the token from the Auth Service.
  - Caches the token (`dw.system.CacheMgr`) to avoid re-authenticating on every call.
  - Adds the `Authorization: Bearer <token>` header in its `createRequest` callback.

```javascript
// Conceptual snippet for API Service createRequest with OAuth
createRequest: function (svc, params) {
    var CacheMgr = require('dw/system/CacheMgr');
    var AuthTokenService = require('~/cartridge/scripts/services/AuthTokenService');
    
    // Get token from cache or fetch a new one
    var tokenCache = CacheMgr.getCache('MyAPIToken');
    var token = tokenCache.get('access_token', function () {
        var result = AuthTokenService.call();
        if (result.ok && result.object.access_token) {
            // Set cache expiry to slightly less than the token's actual expiry
            tokenCache.put('access_token', result.object.access_token, result.object.expires_in - 300);
            return result.object.access_token;
        }
        return null;
    });

    if (!token) {
        throw new Error('Unable to retrieve valid API token.');
    }

    svc.setRequestMethod('GET');
    svc.addHeader('Authorization', 'Bearer ' + token);
    //... set URL and other request details...
    return null;
}
```

## 4. Step-by-Step Business Manager Configuration Guide

This guide walks through the three essential parts of setting up a new service in the Business Manager: creating the Credential, configuring the Profile, and defining the Service itself.

### Step 1: Create the Service Credential (The "Who" and "What")

The Service Credential securely stores the endpoint URL and authentication details for the external system.

1. Navigate to **Administration > Operations > Services**.
2. Click the **Credentials** tab.
3. On the Service Credentials page, click **New**.
4. Fill in the following fields on the New Service Credential page:
   - **ID**: Enter a unique identifier. A recommended naming convention is `your.service.name.http.credentials`. This name cannot contain spaces.
   - **URL**: Enter the base URL for the third-party API. For example: `https://api.example.com/v2/`.
   - **User**: If using Basic Authentication, enter the Client ID or username provided by the third-party service.
   - **Password**: Enter the Client Secret or password. For security, this field is write-only. Once saved, the value cannot be viewed again, so be sure to store it in a secure location.
5. Click **Apply** to save the new credential.

### Step 2: Configure the Service Profile (The "How")

The Service Profile defines the operational behavior, such as timeouts and resilience patterns, for the service call.

1. Navigate to **Administration > Operations > Services**.
2. Click the **Profiles** tab.
3. On the Service Profiles page, click **New**.
4. Fill in the following fields on the New Service Profile page:
   - **Name (ID)**: Enter a descriptive name for the profile (e.g., `default-api-profile`, `realtime-payment-profile`).
   - **Timeout**: Enter the connection timeout in milliseconds (e.g., `10000` for 10 seconds). This is the maximum time B2C Commerce will wait for a response before the call fails.
   - **Enable Circuit Breaker**: Check this box to enable this crucial fault-tolerance feature. It is highly recommended to always enable this.
     - **Calls**: The number of failed calls that will "trip" the circuit (e.g., `10`).
     - **Interval (ms)**: The time window in which the failures must occur (e.g., `60000` for 1 minute). When the circuit is tripped, B2C Commerce will stop making calls to the service for a period to allow the external system to recover.
   - **Enable Rate Limit**: Check this box if the third-party API has call limits.
     - **Calls**: The maximum number of calls allowed in the interval (e.g., `1000`).
     - **Interval (ms)**: The time window for the rate limit in milliseconds (e.g., `60000` for 1 minute).
5. Click **Apply** to save the new profile.

### Step 3: Create the Service Definition (Tying It All Together)

The Service Definition links the Credential and Profile to create the final, named service that you will call from your code.

1. Navigate to **Administration > Operations > Services**.
2. Ensure you are on the **Services** tab and click **New**.
3. Fill in the following fields on the New Service page:
   - **Name (ID)**: Enter the unique ID for the service. This ID must exactly match the one used in your `LocalServiceRegistry.createService()` call.
     
     **Best Practice**: Use a period-delimited pattern like `{cartridge}.{protocol}.{service}.{operation}` (e.g., `int_myapi.http.customer.get`). This structure automatically organizes your service logs into a helpful hierarchy.
   
   - **Service Type**: Select the protocol, typically HTTP for REST APIs.

   - **Enabled**: Check this box to enable the service.

   - **Service Mode**:
     - **Live**: For making real calls to the external API.
     - **Mocked**: For testing. This mode will invoke the `mockCall` or `mockFull` function in your script instead of making a network request.
   
   - **Log Name Prefix**: (Optional but recommended) Enter a prefix (e.g., `myapi`) to create a dedicated log file for this service (`service-myapi-....log`), which simplifies debugging.
   
   - **Communication Log Enabled**: Check this box to log the full request and response data. This is useful for debugging but should be used with caution in production if sensitive data is being transmitted. Always implement a `filterLogMessage` callback in your script to redact sensitive information from these logs.

   - **Force PRD Behavior in Non-PRD Environments**: Check this box to force the service to behave as if it is in a production environment, even when it is not. This can be useful for testing how the service will behave in production.

   - **Profile**: Select the Service Profile you configured in Step 2 from the dropdown list.

   - **Credential**: Select the Service Credential you created in Step 1 from the dropdown list.

4. Click **Apply** to save the service definition.

Your service is now fully configured in the Business Manager and ready to be implemented and called from your SFRA cartridge code.
