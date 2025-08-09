# Salesforce B2C Commerce: Custom SCAPI Endpoint Best Practices

This guide provides a concise overview of best practices and examples for creating custom Salesforce Commerce API (SCAPI) endpoints in B2C Commerce Cloud.

## 1. Core Concept: The Three Pillars of a Custom API

Every Custom SCAPI Endpoint is built from three mandatory files, located within a dedicated cartridge directory: `your_cartridge/cartridge/rest-apis/{api-name}/`.

- **`schema.yaml` (The Contract)**: An OpenAPI 3.0 specification that defines the endpoint's URL path, HTTP method, parameters, security requirements, and response models. SCAPI uses this for automated request validation.

- **`script.js` (The Logic)**: A server-side B2C Commerce script (`dw.*` packages) that contains the business logic. It must export a public function with a name that exactly matches the `operationId` in the schema.

- **`api.json` (The Mapping)**: A simple JSON file that links the `operationId` from the schema to the correct implementation script.

## 2. Quick Start Example: A "Loyalty Info" Endpoint

Here is a complete example for a custom Shopper API endpoint `GET /custom/loyalty-api/v1/.../loyalty-info?c_customer_id={id}`.

### Directory Structure

```
int_loyalty_api/
└── cartridge/
    └── rest-apis/
        └── loyalty-api/
            ├── schema.yaml
            ├── loyalty.js
            └── api.json
```

### `schema.yaml`

```yaml
openapi: 3.0.0
info:
  title: Loyalty Information API
  version: "1.0.0" # Becomes /v1/ in the URL
paths:
  /loyalty-info:
    get:
      summary: Retrieves loyalty points for a customer.
      operationId: getLoyaltyInfo # Must match the exported function name
      parameters:
        - name: siteId # Required for Shopper APIs
          in: query
          required: true
          schema:
            type: string
            minLength: 1
        - name: c_customer_id # Custom parameters must be prefixed with 'c_'
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful retrieval of loyalty information.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoyaltyInfo'
        '404':
          description: Customer not found.
      security:
        - ShopperToken: [c_read_loyalty] # Apply security scheme and custom scope
components:
  schemas:
    LoyaltyInfo:
      type: object
      properties:
        tier:
          type: string
        points:
          type: integer
  securitySchemes:
    ShopperToken: # Define the security scheme for Shopper APIs
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://my-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/my-org-id/oauth2/token
          scopes:
            c_read_loyalty: "Read access to loyalty data." # Define custom scope
```

### `loyalty.js`

```javascript
'use strict';

var RESTResponseMgr = require('dw/system/RESTResponseMgr');
var CustomerMgr = require('dw/customer/CustomerMgr');

/**
 * Implements the getLoyaltyInfo operationId.
 */
exports.getLoyaltyInfo = function () {
    var customerId = request.getHttpParameterMap().get('c_customer_id').getStringValue();
    var customer = CustomerMgr.getCustomerByCustomerNumber(customerId);

    // IMPORTANT: Add fine-grained authorization check here.
    // e.g., verify request.user.profile.customerNo === customerId

    if (customer) {
        var loyaltyData = {
            tier: 'Gold',
            points: 25800
        };
        RESTResponseMgr.createSuccess(loyaltyData).render();
    } else {
        RESTResponseMgr.createError(404, "customer-not-found", "Customer Not Found", "Customer ID is unknown.").render();
    }
};

// Function must be public to be exposed as an endpoint
exports.getLoyaltyInfo.public = true;
```

### `api.json`

```json
{
  "endpoints": [
    {
      "endpoint": "getLoyaltyInfo",
      "schema": "schema.yaml",
      "implementation": "loyalty"
    }
  ]
}
```

## 3. Core Best Practices

### Design & Architecture

**Shopper vs. Admin APIs**: Choose the correct type for your use case. This choice is critical and dictates security, required parameters, and performance limits.

- **Shopper API**: For customer-facing applications. Requires `siteId` parameter. Secured by ShopperToken (SLAS). 10-second timeout.
- **Admin API**: For merchant tools. Must not have `siteId`. Secured by AmOAuth2 (Account Manager). 60-second timeout.

**BFF Pattern**: Create endpoints that aggregate data for specific UI components to reduce the number of client-side calls and improve performance.

### Security

- **Custom Scopes**: Every endpoint must be secured by exactly one custom scope defined in the `schema.yaml`. Scope names must start with `c_` (e.g., `c_read_loyalty`).
- **Client Permissions**: The API client in SLAS (for Shopper) or Account Manager (for Admin) must be granted permission to use your custom scope.
- **In-Script Authorization**: The platform validates the token and scope. You must validate that the authenticated user has permission to access the specific data they are requesting. This prevents privilege escalation attacks.

### Performance

- **Timeouts**: Respect the hard timeouts: 10 seconds for Shopper APIs and 60 seconds for Admin APIs.
- **Efficient Scripting**: Avoid expensive API calls (e.g., `ProductMgr.getProduct()`) inside loops. Fetch data in bulk where possible.
- **External Calls**: Use the Service Framework (`dw.svc.*`) for any third-party callouts. Set aggressive timeouts and enable the circuit breaker to prevent cascading failures.
- **Caching**: Use Custom Caches (`dw.system.CacheMgr`) for data that is expensive to compute but doesn't change often.

### Versioning

- The URL version (e.g., `/v1/`) is automatically derived from the major version number in your `schema.yaml`'s `info.version` field (e.g., "1.0.0" or "1.2.5" both map to v1).
- Introduce breaking changes (e.g., removing a field, changing a data type) in a new major version (e.g., 2.0.0 -> `/v2/`) to avoid disrupting existing clients.

### Troubleshooting

- **404 Not Found**: This almost always means the API failed to register. Systematically check your cartridge structure, file names, `operationId` matching, and `api.json` syntax.
- **Log Center**: Use the Log Center with the query `CustomApiRegistry` to find detailed error messages about registration failures.
- **403 Forbidden**: The client's token is valid but is missing the required custom scope. Check the scope assignments in SLAS or Account Manager.
- **504 Gateway Timeout**: Your script exceeded the performance limit. Use the Code Profiler to find and optimize the bottleneck in your code.

## 4. Custom APIs vs. Hooks

This is a critical architectural decision.

- **Use Hooks to...** modify or augment the behavior of an existing, out-of-the-box SCAPI endpoint. For example, adding a custom attribute to the standard `/baskets` response.

- **Use Custom APIs to...** create entirely new functionality that has no OOTB equivalent. For example, a store locator, a loyalty points service, or a newsletter signup endpoint.

> **Note**: Choosing the wrong tool leads to technical debt. Do not use hooks to create net-new functionality.
