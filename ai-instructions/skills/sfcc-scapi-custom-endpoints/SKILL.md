---
name: sfcc-scapi-custom-endpoints
description: Guide for developing SCAPI Custom APIs on Salesforce B2C Commerce. Use this when asked to create custom REST endpoints, api.json, schema.yaml, or script implementations.
---

# Custom SCAPI Endpoint Development Skill

This skill guides you through developing Custom APIs for Salesforce B2C Commerce under the SCAPI framework.

## Quick Checklist

```text
[ ] Cartridge contains `cartridge/rest-apis/{api-name}/` with schema.yaml, script.js, api.json
[ ] operationId in schema matches exported function name with `.public = true`
[ ] Custom parameters and scopes use the `c_` prefix
[ ] Contract avoids unsupported features (no additionalProperties, only local $ref)
[ ] Shopper APIs include siteId; Admin APIs omit it
[ ] Code version is activated to register endpoints
```

## URL Structure

```
https://{shortcode}.api.commercecloud.salesforce.com/custom/{api-name}/v{major}/organizations/{org-id}{path}?{params}
```

Version is derived from `info.version`: "1.2.0" → `/v1/`, "2.0.0" → `/v2/`

## Cartridge Structure

```
my_cartridge/
└── cartridge/
    └── rest-apis/
        └── my-api-name/          # Lowercase alphanumeric + hyphens only
            ├── api.json          # Mapping file
            ├── schema.yaml       # OAS 3.0 contract
            └── script.js         # Implementation
```

## The Three Components

### 1. API Contract (schema.yaml)

```yaml
openapi: 3.0.0
info:
  title: My Custom API
  version: "1.0.0"
paths:
  /my-endpoint:
    get:
      operationId: getMyData        # Must match function name
      parameters:
        - name: siteId              # Required for Shopper APIs
          in: query
          required: true
          schema:
            type: string
            minLength: 1
        - name: c_my_param          # Custom params must have c_ prefix
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
      security:
        - ShopperToken: [c_my_scope]

components:
  securitySchemes:
    ShopperToken:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://{shortCode}.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/{orgId}/oauth2/token
          scopes:
            c_my_scope: Description
```

### 2. Implementation (script.js)

```javascript
'use strict';

var RESTResponseMgr = require('dw/system/RESTResponseMgr');

exports.getMyData = function () {
    // Query parameters
    var myParam = request.getHttpParameterMap().get('c_my_param').getStringValue();
    
    // Path parameters (for paths like /items/{itemId})
    var itemId = request.getSCAPIPathParameters().get('itemId');
    
    // Request body (POST/PUT/PATCH)
    var body = JSON.parse(request.httpParameterMap.requestBodyAsString);
    
    // Success response
    RESTResponseMgr.createSuccess({ data: myParam }).render();
};
exports.getMyData.public = true;  // Required!

// Error response example
exports.getMyDataWithError = function () {
    RESTResponseMgr.createError(404, 'not-found', 
        'Resource Not Found', 'The requested resource was not found.').render();
};
exports.getMyDataWithError.public = true;
```

### 3. Mapping (api.json)

```json
{
  "endpoints": [
    {
      "endpoint": "getMyData",
      "schema": "schema.yaml",
      "implementation": "script"
    }
  ]
}
```

**Important:** Implementation name has NO file extension. All files must be in the same folder.

## Shopper vs Admin APIs

| Aspect | Shopper API | Admin API |
|--------|-------------|-----------|
| Security Scheme | ShopperToken | AmOAuth2 |
| siteId Parameter | Required | Must omit |
| Max Runtime | 10 seconds | 60 seconds |
| Max Request Body | 5 MiB | 20 MB |
| Token Source | SLAS | Account Manager |

## Security & Scopes

Custom scopes must:
- Start with `c_`
- Only alphanumeric, period, hyphen, underscore
- Max 25 characters

```yaml
security:
  - ShopperToken: [c_read_loyalty]  # Global or per-operation
```

## Caching Responses

Enable Page Caching for the site, then:

```javascript
// Cache for 60 seconds
response.setExpires(Date.now() + 60000);

// Personalized caching (price/promotion variants)
response.setVaryBy('price_promotion');
```

TTL: minimum 1 second, maximum 86,400 seconds (24 hours).

## Circuit Breaker

Custom APIs have a circuit breaker that blocks requests when error rate exceeds 50%:

1. Circuit opens after 50+ errors in 100 requests
2. Requests return 503 for 60 seconds
3. Circuit enters half-open state, testing next 10 requests
4. If >5 fail, circuit reopens; otherwise closes

**Prevention:** Write robust error handling; avoid uncaught exceptions.

## Contract Constraints

- **No `additionalProperties`** in request body schemas
- **Only local `$ref`** - no remote/URL references
- **All parameters** must be defined in contract
- **System parameters** (`siteId`, `locale`) must have `type: string`, `minLength: 1`

## Custom APIs vs Hooks

- **Use Hooks** to modify existing SCAPI endpoints (e.g., add custom field to `/baskets` response)
- **Use Custom APIs** for entirely new functionality (e.g., loyalty service, store locator)

## Development Workflow

1. Create cartridge with `rest-apis/{api-name}/` structure
2. Define contract (schema.yaml) with endpoints and security
3. Implement logic (script.js) with exported public functions
4. Create mapping (api.json) binding endpoints to implementation
5. Upload cartridge to B2C instance
6. **Activate code version** to register endpoints
7. Check registration status to verify
8. Test with appropriate authentication

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Contract violation | Define all params in schema |
| 401 Unauthorized | Invalid/missing token | Check token validity |
| 403 Forbidden | Missing scope | Verify scope in token matches contract |
| 404 Not Found | Endpoint not registered | Check status, verify structure |
| 500 Internal Error | Script error | Check logs for CustomApiInvocationException |
| 503 Service Unavailable | Circuit breaker open | Fix script errors, wait for reset |

Review logs in Log Center with LCQL filter: `CustomApiRegistry`

## HTTP Methods Supported

GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

**Note:** GET requests cannot commit transactions.

## Limitations

- Maximum 50 remote includes per request
- Custom parameters must have `c_` prefix
- Custom scope names max 25 characters
- No `additionalProperties` in schemas
- Only local `$ref` references

## MCP Documentation Tools

```javascript
get_sfcc_class_info("dw.system.RESTResponseMgr")  // REST response manager
search_sfcc_methods("getCustomer")                 // Customer retrieval methods
get_sfcc_class_info("dw.svc.ServiceRegistry")     // External service integration
```

## Detailed References

- [Authentication](references/AUTHENTICATION.md) - SLAS flows, client config, token management
- [URL Mapping](references/URL-MAPPING.md) - Schema-to-URL translation, parameter access
